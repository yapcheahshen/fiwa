//從 https://github.com/btzy/wasm-codegen 翻譯過來， 
//負責生成 WebAssembly bytecode (.wasm 檔的內容) 
//wasm-codegen實作不完整，又比較囉嗦。
//也沒有充份利用Javascript 的特性。
//產生bytecode全程都用 Javascript Array ，會自動長大，最後一次性轉為 Uint8Array 。
import {Var,ExternalKind,sectionCode,Inst,bytecodes,bytecode} from './constants.ts'
import {encInt,encUInt,encUIntString,eqFuncTypes,validExportName} from './utils.ts'
export {Var, ExternalKind,encUInt,encUIntString,sectionCode};
import {CodeWriter} from './codewriter.ts';
import {Writer,FunctionWriter,ImportWriter,TypeWriter,ExportWriter,GlobalWriter,DataWriter} from './writers.ts'
export {TypeWriter,CodeWriter,FunctionWriter,ImportWriter,ExportWriter};
export class ModuleWriter {
	_types:bytecodes[];
	_imports:ImportWriter[];
	_functions:FunctionWriter[];
	_exports:ExportWriter[];
	_codes:CodeWriter[];
	_globals:GlobalWriter[];
	_datum:DataWriter[];
	_memory:bytecodes[];
	constructor (opts:{memory:number}) {
	    this._types     = [];
	    this._imports   = [];
	    this._functions = [];
	    this._exports   = [];
	    this._codes     = [];
	    this._globals   = [];
	    this._datum     = [];
	    this._memory= [];//[ [1,1, opts.memory]]:[[0,1]]; //always use 64KB
	}
	exportExtra(){
		//export memory=2,global=3
		//const exportWriter = new ExportWriter("_mem", ExternalKind.memory); //only one memory area 
    	//this._exports.push(exportWriter);
    }
	gen({datasize:number}) {
		const output = [];
    	this.exportExtra();
 
	    this.resolveFunctionNames();
	    const wasm_header = [0,97,115,109,1,0,0,0]; //.asm....
	    output.push(...wasm_header);
	    this.writeSection(output,sectionCode.TYPE,this._types );
	    this.writeSection(output,sectionCode.IMPORT,this._imports );
	    this.writeSection(output,sectionCode.FUNCTION,this._functions );
	    this.writeSection(output,sectionCode.MEMORY,this._memory );
	    this.writeSection(output,sectionCode.EXPORT,this._exports );
	    this.writeSection(output,sectionCode.CODE,this._codes );
	    this.writeSection(output,sectionCode.GLOBAL,this._globals );
	    this.writeSection(output,sectionCode.DATA,this._datum );
	    return new Uint8Array(output);
	}
	exportFunction (name:string, exportname:string) { // name
    	exportname = exportname || name;
    	if (!validExportName(exportname)) throw "invalid export name "+exportname; 
    	const exportWriter = new ExportWriter(exportname, ExternalKind.function);
    	exportWriter.setName(name);
    	this._exports.push(exportWriter);
    }
    addData (offset:number, data:bytecode[] ):number {
    	const dataWriter = new DataWriter( offset, data);
    	this._datum.push(dataWriter);
    	return offset+data.length;
    }
    addString( offset:number, str:string):number {
    	const arr=encUIntString(str);
    	arr.push(0) ;//utf 8 zero terminated
    	return this.addData(offset, arr );
    }
    addGlobal (name:string,  val:number, mutable=true, type:Var=Var.i32) {
    	const globalWriter = new GlobalWriter(type,mutable, val);
    	this._globals.push(globalWriter); //nameless table to hold global and it's initial value.

    	const exportWriter = new ExportWriter(name, ExternalKind.global);
    	exportWriter.setName(name);
    	this._exports.push(exportWriter);
    }
    addConstant (name:string, val:number, type:Var=Var.i32) { // add a global constant
    	this.addGlobal(name, val, false, type);
    }
    importFunction (name:string, signature:bytecode[], mod:string, exportname:string) {
    	const importWriter = new ImportWriter(mod, exportname, ExternalKind.function);
    	importWriter.setName(name);
    	importWriter.setType(signature);
    	this._imports.push(importWriter);
	}
	importMemory(name:string,mod:string) {
    	const importWriter = new ImportWriter(mod, name, ExternalKind.memory);
    	this._imports.push(importWriter);
	}
	addFunction (name:string, signature:bytecode[] ,codeWriter:CodeWriter) {
	    codeWriter.setName(name);
	    codeWriter.setType(signature);
	    this._codes.push(codeWriter);
	}
	private writeSection(output:bytecode[],sectioncode:sectionCode,section:(Writer|bytecodes)[]  ){
		if (section.length==0) return;
        output.push(sectioncode);
        const sizeloc = output.length;
        output.push(...encUInt(section.length));
        section.forEach(it=>{
			if (Array.isArray(it)) {
				output.push(...it);
			} else {
				output.push(... it.write()); // only Type section has no write()
			}
		});
        output.splice(sizeloc, 0,...encUInt(output.length - sizeloc));
	}
	private clearSymbols( symbols: ({name:string,type:bytecode[]})[]){
		symbols.forEach(obj=> {
	        if (obj.name) obj.name = '';
	        if (obj.type) obj.type = [];
	    })
	}
	private resolveFunctionNames(){
		const funcTypes : bytecodes[] = [];
	    const funcTypesOffset = this._types.length;
	    const funcNames : ({name:string,funcType:bytecode[]})[] = [];
	    const funcNamesOffset = this._functions.length;
	    this._imports.forEach( ({name,type})=> {
	        if (name) {
	            if (funcNames.findIndex(el=>el.name === name) === -1)funcNames.push({ name, funcType: type }); 
	            else throw 'Repeated function "' + name + '".';
	        }
	    })
	    this._codes.forEach(({name,type})=> {
	        if (name) {
	            if (funcNames.findIndex(el=>el.name === name) === -1)funcNames.push({ name, funcType: type }); 
	            else throw 'Repeated function "' + name + '".';
	        }
	    })
	    funcNames.forEach(el=> {
	        if (funcTypes.findIndex(eqFuncTypes(el.funcType)) === -1) funcTypes.push(el.funcType);
	    });
	    this._types.push( ... funcTypes );
		// const that=this;
	    // funcTypes.forEach(type=>that._types.push(type));
	    const _functions=this._functions;
	    this._codes.forEach( ({type} )=>{
	        if (type) {
	            const typeIndex = funcTypes.findIndex(eqFuncTypes(type)) + funcTypesOffset;
	            if (typeIndex === -1) throw "Weird assembler bug.";
	            const functionWriter = new FunctionWriter(typeIndex);
	            _functions.push(functionWriter);
	        }
	    });
	    this._imports.forEach(obj=>{
	        if (obj.type) {
	            const typeIndex = funcTypes.findIndex(eqFuncTypes(obj.type)) + funcTypesOffset;
	            if (typeIndex === -1) throw "Weird assembler bug.";
	            obj.typeIndex = typeIndex;
	        }
	    });
	    this._codes.forEach( obj=> {
	        const functionLinks = obj._functionLinks;
	        functionLinks.sort((a, b) =>b.location - a.location );
	        functionLinks.forEach(functionLink=>{
	            const funcIndex = funcNames.findIndex(el=>el.name === functionLink.name) + funcNamesOffset;
	            if (funcIndex === -1) throw 'Undeclared function "' + functionLink.name + '".';
	            obj._code.splice(functionLink.location, 0,...encUInt(funcIndex));
	        });
	    })
	    this._exports.forEach(obj=>{
	        if (obj.name) {
	            const funcIndex = funcNames.findIndex(el=>el.name === obj.name) + funcNamesOffset;
	            if (funcIndex === -1) throw 'Undeclared function "' + obj.name + '".';
	            obj._index = funcIndex;
	        }
	    })
	    this.clearSymbols(this._exports);
	    this.clearSymbols(this._imports);
	    this.clearSymbols(this._codes);
	}
}
//helper constant
export const one_one=(new TypeWriter([Var.i32],[Var.i32])).write(); //return one in one out signature
//generic signature for javascript calls
export const makeSignature=(count,result=1)=>{
	return (new TypeWriter( Array(count).fill().map(()=>Var.i32),
		                   Array(result).fill().map(()=>Var.i32))).write();
}