//從 https://github.com/btzy/wasm-codegen 翻譯過來， 
//負責生成 WebAssembly bytecode (.wasm 檔的內容) 
//wasm-codegen實作不完整，又比較囉嗦。
//也沒有充份利用Javascript 的特性。
//產生bytecode全程都用 Javascript Array ，會自動長大，最後一次性轉為 Uint8Array 。
import {Var,ExternalKind,Inst,sectionCode} from './constants.ts'
import {encInt,encUInt,encUIntString,eqFuncTypes} from './utils.ts'
export {Var, ExternalKind,encodeInt,encUInt,encUIntString,sectionCode};
import {CodeWriter} from './codewriter.ts';
import {FunctionWriter,ImportWriter,TypeWriter,ExportWriter} from './writers.ts'
export {TypeWriter,CodeWriter,FunctionWriter,ImportWriter,ExportWriter};
export class ModuleWriter {
	constructor () {
	    this._types     = [];
	    this._imports   = [];
	    this._functions = [];
	    this._memory    = [];
	    this._exports   = [];
	    this._codes     = [];
	}
	gen() {
		const output = [];
	    this.resolveFunctionNames();
	    const wasm_header = [0,97,115,109,1,0,0,0]; //.asm....
	    output.push(...wasm_header);
	    this.writeSection(output,sectionCode.TYPE,this._types );
	    this.writeSection(output,sectionCode.IMPORT,this._imports );
	    this.writeSection(output,sectionCode.FUNCTION,this._functions );
	    this.writeSection(output,sectionCode.MEMORY,this._memory );
	    this.writeSection(output,sectionCode.EXPORT,this._exports );
	    this.writeSection(output,sectionCode.CODE,this._codes );
	    return new Uint8Array(output);
	}
	setMemory (memory) {
    	this._memory = [ memory ];
	}
	exportFunction (name:string, field:string) {
    	field = field || name;
    	let exportWriter = new ExportWriter(field, ExternalKind.function);
    	exportWriter.setName(name);
    	this._exports.push(exportWriter);
    }
    importFunction = function(name, type, mod, field) {
    	let importWriter = new ImportWriter(mod, field, ExternalKind.function);
    	importWriter.setName(name);
    	importWriter.setType(type);
    	this._imports.push(importWriter);
	}
	addFunction = function(name, type, codeWriter) {
	    codeWriter.setName(name);
	    codeWriter.setType(type);
	    this._codes.push(codeWriter);
	}
	private writeSection(output,sectioncode,section){
		if (section.length==0) return;
        output.push(sectioncode);
        let sizeloc = output.length;
        output.push(...encUInt(section.length));
        section.forEach(it=>output.push(...(it.write?it.write():it))); // only Type section has no write()
        output.splice(sizeloc, 0,...encUInt(output.length - sizeloc));
	}
	private clearSymbols(symbols){
		symbols.forEach(obj=> {
	        if (obj.hasOwnProperty("name")) obj.name = undefined;
	        if (obj.hasOwnProperty("type")) obj.type = undefined;
	    })
	}
	private resolveFunctionNames(){
		let funcTypes = [];
	    let funcTypesOffset = this._types.length;
	    let funcNames = [];
	    let funcNamesOffset = this._functions.length;
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
	    //funcTypes.forEach(function(type) { that._types.push(type)  });
	    const _functions=this._functions;
	    this._codes.forEach( ({type} )=>{
	        if (type) {
	            var typeIndex = funcTypes.findIndex(eqFuncTypes(type)) + funcTypesOffset;
	            if (typeIndex === -1) throw "Weird assembler bug.";
	            let functionWriter = new FunctionWriter(typeIndex);
	            _functions.push(functionWriter);
	        }
	    });
	    this._imports.forEach(obj=>{
	        if (type) {
	            var typeIndex = funcTypes.findIndex(eqFuncTypes(type)) + funcTypesOffset;
	            if (typeIndex === -1) throw "Weird assembler bug.";
	            obj.type = typeIndex;
	        }
	    });
	    this._codes.forEach( obj=> {
	        let functionLinks = obj._functionlinks;
	        functionLinks.sort((a, b) =>b.location - a.location );
	        functionLinks.forEach(functionLink=>{
	            let funcIndex = funcNames.findIndex(el=>el.name === functionLink.name) + funcNamesOffset;
	            if (funcIndex === -1) throw 'Undeclared function "' + functionLink.name + '".';
	            obj._code.splice(functionLink.location, 0,...encUInt(funcIndex));
	        });
	    })
	    this._exports.forEach(obj=>{
	        if (obj.name) {
	            var funcIndex = funcNames.findIndex(el=>el.name === obj.name) + funcNamesOffset;
	            if (funcIndex === -1) throw 'Undeclared function "' + functionLink.name + '".';
	            obj._index = funcIndex;
	        }
	    })
	    this.clearSymbols(this._exports);
	    this.clearSymbols(this._imports);
	    this.clearSymbols(this._codes);
	}
}
//helper constant
export const one_one= (new TypeWriter([Var.i32],[Var.i32])).write(); //return one in one out signature