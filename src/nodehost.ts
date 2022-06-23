import {parseSignature} from "./signature.ts";
import {Tokenizer} from "./tokenizer.ts";
import Assembler from "./assembler.ts"
import {Disassembler} from "./disassembler.ts"
import bindSys from './js4forth.ts';    //給 forth 調用的 js 函式
import {Inst,Var} from "./constants.ts"
import {Fiwa} from './browserhost.ts';
if (typeof global!=='undefined') {
	global.testable={Fiwa,Assembler,parseSignature,Var,Inst,Tokenizer,Disassembler}; //for nodejs
}