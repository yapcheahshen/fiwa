/* 各種小writer */
import {encUInt,encUIntString} from './utils.ts'
import {Var} from './constants.ts'
export class FunctionWriter{
	constructor (type:number) {
		this.type=type;
	}
	write() {
		return encUInt(this.type);
	}
}
export class TypeWriter {
	constructor(param_types:[], result_types:[]){
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
export class ExportWriter {
	constructor(field,kind,index){
		this._field=field;
		this._index=index;
		this._kind=kind;
	}
	setName(name){
		this.name=name;
	}
	write(){ 
	    const out = [];
	    const encoded_field_bytes = encUIntString(this._field);
	    out.push(...encUInt(encoded_field_bytes.length),...encoded_field_bytes);
	    out.push(this._kind);
	    out.push(...encUInt(this._index));
	    return out;
	}
}
export class ImportWriter {
	constructor (mod, field, kind){
		this._mod=mod;
		this._field=field;
		this._kind=kind;
	}
	setName(name){
		this.name=name;
	}
	setType(type){
		this.type=type;
	}
	write(){
	    const output = [];
	    const module_bytes = encUIntString(this._mod);
	    const field_bytes = encUIntString(this._field);
	    output.push(...encUInt(module_bytes.length), ...module_bytes);
	    output.push(...encUInt(field_bytes.length), ...field_bytes);
	    output.push( this._kind);
	    output.push( ...encUInt(this.type)); //strange!!!
	    return output;
	}	
}
export class MemoryWriter {
	constructor(initial_pages, maximum_pages) {
    	this._initial_pages = initial_pages;
    	if (maximum_pages) this._maximum_pages = maximum_pages;
    }
	Write() {
	    const output = [];
	    if (this._maximum_pages) {
	        output.push(1,...encUInt(this._initial_pages),...encUInt(this._maximum_pages));
	    } else {
	        output.push(0,...encUInt(this._initial_pages));
	    }
	 	return output;
	}
}