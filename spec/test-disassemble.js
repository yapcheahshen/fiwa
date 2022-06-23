/* translating opcode*/
import assert from "assert";
export const test_disassemble=async ({Var,Assembler,Tokenizer,Disassembler},tests,pass)=>{
	const disassembler=new Disassembler();

	const test=(func,code,expected,message)=>{
		tests++;
		const out=func.call(disassembler,code);
		assert.equal(out,expected,message);
		pass++;
	}
	test(disassembler.decode,[0x41,0x2a,0xf,0xb],'i32_const 42 return end');
	test(disassembler.decodeC,[0x41,0x2a,0xf,0xb],'圭42返。');
const fibonacci=[0x20,0x0,0x41,0x2,0x49,0x4,0x40,0x20,0x0,0xF,0x0B,
0x20,0x0,0x41,0x02,0x6B,0x10,0x0,0x20,0x0,0x41,0x1,0x6B,0x10,0x0,0x6A,0x0F,0xB];
	test(disassembler.decodeC,fibonacci,'⑴圭2相小？64⑴返。⑴圭2相減Ⓐ⑴圭1相減Ⓐ相加返。')
	//adjust (⑴小於2)？(⑴返)。((⑴減2)Ⓐ(⑴減1)Ⓐ相加)返。 //
	//translate back to wasm 
	return [tests,pass];
}