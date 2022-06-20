/* 各種小writer */
import {encUInt,encUIntString} from './utils.ts'
import {Var,bytecode,ExternalKind,Inst} from './constants.ts'
export class Writer {
	write(){

	}
}
export class FunctionWriter extends Writer {
	type:number;
	constructor (type:number) {
		super();
		this.type=type;
	}
	write() {
		return encUInt(this.type);
	}
}
export class TypeWriter extends Writer {
	_param_types:Var[];
	_result_types:Var[];
	constructor(param_types:Var[], result_types:Var[]){
		super();
	    this._param_types = param_types ? param_types : [];
	    this._result_types = result_types ? result_types : [];
	}
	write(){
    	const out=[];
    	out.push(Var.func); // in LEB128, num of params/result type of parameters/result
    	out.push(...encUInt(this._param_types.length),   ...this._param_types);  
        out.push(...encUInt(this._result_types.length), 	...this._result_types); 
		return out;
	}
}
export class ExportWriter extends Writer {
	_field:string;
	_index:number;
	_kind:ExternalKind;
	name:string;
	constructor(field:string,kind:ExternalKind,index:number=0){
		super();
		this._field=field; //name for outside world
		this._index=index;
		this._kind=kind;
		this.name='';
	}
	setName(name:string){ //the name in webassembly
		this.name=name;
	}
	write(){ 
	    const out = [];
	    const encoded_field_bytes = encUIntString(this._field); 
	    out.push(...encUInt(encoded_field_bytes.length),...encoded_field_bytes);
	    out.push(this._kind, ...encUInt(this._index));
	    return out;
	}
}
export class ImportWriter extends Writer {
	_mod:string;
	_field:string;
	_kind:ExternalKind;
	name:string;
	type:bytecode[];
	typeIndex:number;//resolve by codegen
	constructor (mod:string, field:string, kind:ExternalKind){
		super();
		this._mod=mod;
		this._field=field;
		this._kind=kind;
		this.type=null;
		this.typeIndex=0;
		this.name='';
	}
	setName(name:string){
		this.name=name;
	}
	setType(type:bytecode[]){
		this.type=type;
	}
	write(){
	    const output = [];
	    const module_bytes = encUIntString(this._mod);
	    const field_bytes = encUIntString(this._field);
	    output.push(...encUInt(module_bytes.length), ...module_bytes);
	    output.push(...encUInt(field_bytes.length), ...field_bytes);
	    output.push( this._kind);
	    if (this._kind==ExternalKind.memory) {
	    	output.push(0,1);
	    } else {
	    	output.push(...encUInt(this.typeIndex));
	    }
	    return output;
	}	
}

export class GlobalWriter extends Writer{
	type:Var;
	_mutable:boolean;
	_instruction:bytecode[];
	constructor(type:Var,mutable:boolean,val:number){
		super();
		this.type=type;
		this._mutable=mutable;
		this.val=val;
	}
	write(){ 
	    const out = [];
	    out.push(this.type);
	    out.push(this._mutable?1:0); //const:0 , variable :1
	    const instruction=[Inst.i32_const,...encUInt(this.val),Inst.end]
	    out.push(...instruction);
	    return out;
	}
}

export class DataWriter extends Writer{
	_offset:bytecode[]; //
	_data:bytecode[];
	constructor(offset:number,data:bytecode[]){
		super();
		this.offset=offset;
		this.data=data;
	}
	write(){ 
	    const out = [];
	    out.push(0 ); //memIdx is always 0
	    const instruction=[Inst.i32_const, ...encUInt(this.offset), Inst.end];
	    out.push(...instruction); //const with value
	    out.push(...encUInt( this.data.length),...this.data);
	    return out;
	}
}