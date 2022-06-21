/* 輸出WebAssembly 指令集*/
import {encInt,encUInt} from './utils.ts'
import {Inst,Var,bytecode} from './constants.ts'
import {Writer} from './writers.ts'
const loadStoreInsts=`i32_load,i64_load,f32_load,f64_load,i32_load8_s,i32_load8_u,i32_load16_s,i32_load16_u,
i64_load8_s,i64_load8_u,i64_load16_s,i64_load16_u,i64_load32_s,i64_load32_u,
i32_store,i64_store,f32_store,f64_store,i32_store8,i32_store8,i32_store16,i64_store8,i64_store16,i64_store32`
const getsetInsts=`get_local,set_local,tee_local,get_global,set_global`;
const simpleInsts=`unreachable,nop,drop,select,else,end,ret,i32_eqz,i32_eq,i32_ne,
i32_add,i32_sub,i32_mul,i32_div_s,i32_and,i32_or,i32_xor,i32_shr_s,i32_shr_u,i32_shl,
i32_lt_s,i32_gt_s,i32_le_s,i32_ge_s`;
interface ICodeWriter{
	_localTypes: bytecode[];
	_code: bytecode[];
	name: string;
	type: bytecode[];
	_functionLinks : ({location: number, name:string})[ ];	
	setName(name):void;
	setType(type:bytecode[]);
}
export class CodeWriter extends Writer implements ICodeWriter{
	constructor (local_types:bytecode[]) {
		super();
	    this._localTypes = local_types ? local_types : [];
	    this._code = [];
	    this._functionLinks = [];
		this.name='';
		this.type=[];
		this.addInst(loadStoreInsts,this.load_store);//(Inst[name]).bind(that) );
		this.addInst(getsetInsts, this.get_set);
		this.addInst(simpleInsts, this.simple);
	}
	write() {
		const out=[];
		out.push(...encUInt(this._localTypes.length));
		this._localTypes.forEach(type=>out.push(1,type));
		out.push(...this._code);
		return [...encUInt(out.length), ...out];
	}
	setName(name:string){
		this.name=name;
	}
	setType(type:bytecode[]){
		this.type=type;
	}
	private addInst(str:string, doer){
		const insts=str.split(/[\r\n ]*,[\r\n ]*/).map(it=>it.trim());
		for (let i=0;i<insts.length;i++){
			const name=insts[i];
			this[name] = doer(Inst[name],this._code);
		}
	}
	private simple(inst:Inst,_code:bytecode[]) {
		return function() {_code.push(inst)};
	}
	private get_set(inst:Inst,_code:bytecode[]) {
		return function(i:number) {_code.push(inst,...encUInt(i))} 
	}
	private load_store(inst:Inst,_code:bytecode[]){
		return function(offset:number,align:number) {_code.push(inst, ...encUInt(align||0),...encUInt(offset))}
	}
	block(r_t:Var)   {this._code.push(Inst.block,r_t||Var.i32)	}
	loop(r_t:Var)    {this._code.push(Inst.loop,r_t||Var.i32)	}
	if(r_t:Var)      {this._code.push(Inst.if,r_t||Var.i32)	}
	br(depth:number)    {this._code.push(Inst.br,depth)	}
	br_if(depth:number) {this._code.push(Inst.br_if,depth)	}
	call(name:string|number) {
		if (typeof name==='number') {
			this._code.push(Inst.call,...encUInt(name));
		} else { //call by name
			this._code.push(Inst.call); 
			this._functionLinks.push({location: this._code.length, name});
		}
	}
	memory_size() {this._code.push(Inst.memory_size,0)}
	memory_grow() {this._code.push(Inst.memory_grow,0)}
	// memory_init , memory_fill , memory_copy data_drop
	i32_const(v:number) {this._code.push(Inst.i32_const,...encInt(v))}
	i64_const(v:number) {this._code.push(Inst.i64_const,...encInt(v))}
}