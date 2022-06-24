import {parseSignature} from "./signature.ts";
import {Tokenizer} from "./tokenizer.ts";
import {Macroer} from "./macroer.ts";
import {TypeChecker} from "./typechecker.ts";
import Assembler from "./assembler.ts"
import {Learner} from './learner.ts';
import {Disassembler} from "./disassembler.ts"
import bindSys from './js4forth.ts';    //給 forth 調用的 js 函式
import {Inst,Var} from "./constants.ts"
import {Fiwa} from './browserhost.ts';

if (typeof global!=='undefined') {
	global.testable={Fiwa,Assembler,parseSignature,Var,Inst,Learner,
	Tokenizer,Macroer,Disassembler,TypeChecker}; //for nodejs
}