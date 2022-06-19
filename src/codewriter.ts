/* 輸出WebAssembly 指令集*/
import {encInt,encUInt} from './utils.ts'
import {Inst,Var} from './constants.js'
export class CodeWriter {
	constructor (local_types:[]) {
	    this._localTypes = local_types ? local_types : [];
	    this._code = [];
	    this._functionlinks = [];
	}
	setName(name){
		this.name=name;
	}
	setType(type){
		this.type=type;
	}
	write() { //need setName
		const out=[];
		out.push(...encUInt(this._localTypes.length));
		this._localTypes.forEach(localtype=>out.push(1,localtype));
		out.push(...this._code);
		return [...encUInt(out.length), ...out];
	}

	unreachable(){this._code.push(Inst.unreachable)	}
	nop()        {this._code.push(Inst.nop)	        }
	block(r_t)   {this._code.push(Inst.block,r_t||Var.i32)	}
	loop(r_t)    {this._code.push(Inst.loop,r_t||Var.i32)	}
	if(r_t)      {this._code.push(Inst.if,r_t||Var.i32)	}
	else()              {this._code.push(Inst.else)	}
	end()               {this._code.push(Inst.end)	}
	br(depth:number)    {this._code.push(Inst.br,depth)	}
	br_if(depth:number) {this._code.push(Inst.br_if,depth)	}
	ret()               {this._code.push(Inst.return)	}
	call(name:string|number) {
		if (typeof idx_name==='number') {
			this._code.push(Inst.call,...encUInt(idx_name));
		} else { //call by name
			this._code.push(Inst.call); 
			this._functionlinks.push({location: this._code.length, name});
		}
	}
	drop() {this._code.push(Inst.drop)	}
	select() {this._code.push(Inst.select)	}
	get_local(i:number) {this._code.push(Inst.get_local, ...encUInt(i)) }
	set_local(i:number) {this._code.push(Inst.set_local, ...encUInt(i)) }
	tee_local(i:number) {this._code.push(Inst.tee_local, ...encUInt(i)) }
	i32_load(offset,align:number) {this._code.push(Inst.i32_load, ...encUInt(align||0),...encUInt(offset)) }
	i64_load(offset,align:number) {this._code.push(Inst.i64_load, ...encUInt(align||0),...encUInt(offset)) }
	f32_load(offset,align:number) {this._code.push(Inst.f32_load, ...encUInt(align||0),...encUInt(offset)) }
	f64_load(offset,align:number) {this._code.push(Inst.f64_load, ...encUInt(align||0),...encUInt(offset)) }
	i32_load8_s(offset,align:number) {this._code.push(Inst.i32_load8_s, ...encUInt(align||0),...encUInt(offset)) }
	i32_load8_u(offset,align:number) {this._code.push(Inst.i32_load8_u, ...encUInt(align||0),...encUInt(offset)) }
	i32_load16_s(offset,align:number) {this._code.push(Inst.i32_load16_s, ...encUInt(align||0),...encUInt(offset)) }
	i32_load16_u(offset,align:number) {this._code.push(Inst.i32_load16_u, ...encUInt(align||0),...encUInt(offset)) }
	i64_load8_s(offset,align:number) {this._code.push(Inst.i64_load8_s, ...encUInt(align||0),...encUInt(offset)) }
	i64_load8_u(offset,align:number) {this._code.push(Inst.i64_load8_u, ...encUInt(align||0),...encUInt(offset)) }
	i64_load16_s(offset,align:number) {this._code.push(Inst.i64_load16_s, ...encUInt(align||0),...encUInt(offset)) }
	i64_load16_u(offset,align:number) {this._code.push(Inst.i64_load16_u, ...encUInt(align||0),...encUInt(offset)) }
	i64_load32_s(offset,align:number) {this._code.push(Inst.i64_load32_s, ...encUInt(align||0),...encUInt(offset)) }
	i64_load32_u(offset,align:number) {this._code.push(Inst.i64_load32_u, ...encUInt(align||0),...encUInt(offset)) }
	i32_store(offset,align:number) {this._code.push(Inst.i32_store, ...encUInt(align||0),...encUInt(offset)) }
	i64_store(offset,align:number) {this._code.push(Inst.i64_store, ...encUInt(align||0),...encUInt(offset)) }
	f32_store(offset,align:number) {this._code.push(Inst.f32_store, ...encUInt(align||0),...encUInt(offset)) }
	f64_store(offset,align:number) {this._code.push(Inst.f64_store, ...encUInt(align||0),...encUInt(offset)) }
	i32_store8(offset,align:number) {this._code.push(Inst.i32_store8, ...encUInt(align||0),...encUInt(offset)) }
	i32_store16(offset,align:number) {this._code.push(Inst.i32_store16, ...encUInt(align||0),...encUInt(offset)) }
	i64_store8(offset,align:number) {this._code.push(Inst.i64_store8, ...encUInt(align||0),...encUInt(offset)) }
	i64_store16(offset,align:number) {this._code.push(Inst.i64_store16, ...encUInt(align||0),...encUInt(offset)) }
	i64_store32(offset,align:number) {this._code.push(Inst.i64_store32, ...encUInt(align||0),...encUInt(offset)) }
	memory_size() {this._code.push(Inst.memory_size,0)}
	memory_grow() {this._code.push(Inst.grow_memory,0)}
	// memory_init , memory_fill , memory_copy data_drop
	i32_const(v:number) {this._code.push(Inst.i32_const,...encInt(v))}
	i64_const(v:number) {this._code.push(Inst.i64_const,...encInt(v))}
	i32_eqz() {this._code.push(Inst.i32_eqz)}
	i32_eq()  {this._code.push(Inst.i32_eq)}
	i32_ne()  {this._code.push(Inst.i32_ne)}
	i32_add() {this._code.push(Inst.i32_add)}
	i32_sub() {this._code.push(Inst.i32_sub)}
	i32_mul() {this._code.push(Inst.i32_mul)}
	i32_div_s(){this._code.push(Inst.i32_div_s)}
	i32_and(){this._code.push(Inst.i32_and)}
	i32_or(){this._code.push(Inst.i32_or)}
	i32_xor(){this._code.push(Inst.i32_xor)}
	i32_shr_s(){this._code.push(Inst.i32_shr_s)}
	i32_shr_u(){this._code.push(Inst.i32_shr_u)}
	i32_shl(){this._code.push(Inst.i32_shl)}
	i32_lt_s(){this._code.push(Inst.i32_lt_s)}
	i32_gt_s(){this._code.push(Inst.i32_gt_s)}
	i32_le_s(){this._code.push(Inst.i32_le_s)}
	i32_ge_s(){this._code.push(Inst.i32_ge_s)}
}