/* 編寫 WebAssembly 指令*/
import {encInt,encUInt} from './utils.ts'
import {Inst,Var,bytecode,splitInstruction} from './constants.ts'
import {Writer} from './writers.ts'
//簡單指令
const simpleInsts=`unreachable,nop,drop,select,else,end,ret,i32_eqz,i32_eq,i32_ne,
i32_add,i32_sub,i32_mul,i32_div_s,i32_and,i32_or,i32_xor,i32_shr_s,i32_shr_u,i32_shl,
i32_lt_s,i32_gt_s,i32_le_s,i32_ge_s`;
//記憶體操作
const loadStoreInsts=`i32_load,i64_load,f32_load,f64_load,i32_load8_s,i32_load8_u,i32_load16_s,i32_load16_u,
i64_load8_s,i64_load8_u,i64_load16_s,i64_load16_u,i64_load32_s,i64_load32_u,
i32_store,i64_store,f32_store,f64_store,i32_store8,i32_store8,i32_store16,i64_store8,i64_store16,i64_store32`
//變數取值賦值
const getsetInsts=`get_local,set_local,tee_local,get_global,set_global`; 
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
	private addInst(str:string, doer) { //創建填入bytecode的成員函式
		const insts=splitInstruction(str);
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
	//以下指令重覆性較少，為易讀故不用 addInst 創建，原則上按官方順序排列
	block(r_t:Var)   {this._code.push(Inst.block,r_t||Var.i32)	}
	loop(r_t:Var)    {this._code.push(Inst.loop,r_t||Var.i32)	}
	if(r_t:Var)      {this._code.push(Inst.if,r_t||Var.i32)	}
	br(idx:number)    {this._code.push(Inst.br, ...encUInt(idx))	}
	br_if(idx:number) {this._code.push(Inst.br_if,...encUInt(idx))	}
	br_table(idx:number) {this._code.push(Inst.br_if,...encUInt(idx))	}
	call(name:string|number) {
		if (typeof name==='number') {
			this._code.push(Inst.call,...encUInt(name)); //已知funcIndex
		} else { //call by name
			this._code.push(Inst.call); 
			//後面跟funcIndex , 到resolveName 才會把一個 leb128 塞進去
			//先存下名字和要地址
			this._functionLinks.push({location: this._code.length, name});
		}
	}
	memory_size() {this._code.push(Inst.memory_size,0)}
	memory_grow() {this._code.push(Inst.memory_grow,0)}
	// memory_init , memory_fill , memory_copy data_drop
	i32_const(v:number) {this._code.push(Inst.i32_const,...encInt(v))}
	i64_const(v:number) {this._code.push(Inst.i64_const,...encInt(v))}
}