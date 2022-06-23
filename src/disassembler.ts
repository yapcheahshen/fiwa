import {bytecode,InstNames,Inst} from "./constants.ts";
import {decodeUInt} from './leb128.ts'
import {CInstNames} from './cinst.ts';
interface IDisassembler {

}
const oneOps=[Inst.i32_const,Inst.get_local,Inst.set_local,Inst.tee_const,Inst.i64_const
,Inst.if,Inst.call,Inst.call_indirect,Inst.get_global,Inst.set_global]
const renames=[Inst.call,Inst.get_local,Inst.set_local,Inst.tee_const,Inst.get_global,Inst.set_global];
export class Disassembler {
	constructor() {

	}

	decode(codes:bytecode[], mapping) {
		let i=0, out='';
		while (i<codes.length) {
			const code=codes[i];
			const name=InstNames[code];
			const mapname=mapping?mapping[name]:name;

			if (!~renames.indexOf(code)) out+= (mapping?'':' ')+mapname;
			if (~oneOps.indexOf(code)) {
				let [num,c]=decodeUInt( codes,i+1);
				if (~'⑴①⓵⒜ⓐⒶ㊀㍘㏠'.indexOf(mapname)) {
					num=String.fromCodePoint(mapname.codePointAt(0)+num);
				} 
				out+=( (mapping?'':' ')+num);
				i+=c;
			}
			i++;
		}
		return out.trim();
	}
	decodeC(codes:bytecode[]) {
		return this.decode(codes,CInstNames)
	}
}