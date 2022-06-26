import {parseSignature} from "./signature.ts";
import {Tokenizer} from "./tokenizer.ts";
import {Macroer} from "./macroer.ts";
import {TypeChecker} from "./typechecker.ts";
import Assembler from "./assembler.ts"
import {Learner} from './learner.ts';
import {Disassembler} from "./disassembler.ts"
import {Transliterator} from "./transliterator.ts"
import * as Namer from './namer.ts';
import {Compiler} from "./compiler.ts"
import bindSys from './js4forth.ts';    //給 forth 調用的 js 函式
import {Var} from "./constants.ts"
import {Fiwa} from './browserhost.ts';
import * as StockWasm from './stockwasm.ts';

if (typeof global!=='undefined') {
	global.testable={Fiwa,Assembler,parseSignature,Var,Learner,StockWasm,Namer,
	Tokenizer,Macroer,Disassembler,TypeChecker, Compiler, Transliterator}; //for nodejs
}