import {parseSignature} from "./signature.ts";
import {Tokenizer} from "./tokenizer.ts";
import * as Expression from './expression.ts';
import * as Symbol from './symbol.ts';
import {Macroer} from "./macroer.ts";
import {TypeChecker} from "./typechecker.ts";
import Assembler from "./assembler.ts"
import {Learner} from './learner.ts';
import {ModReader} from './modreader.ts';
import {Disassembler} from "./disassembler.ts"
import {Transliterator} from "./transliterator.ts"
import * as Namer from './namer.ts';
import {Compiler} from "./compiler.ts"
import bindSys from './js4forth.ts';    //給 forth 調用的 js 函式
import {Var,Mnemonic} from "./constants.ts"
import {Fiwa} from './browserhost.ts';
import * as StockWasm from './stockwasm.ts';


if (typeof global!=='undefined') {
	global.testable={Fiwa,Assembler,parseSignature,Var,Mnemonic,Learner,StockWasm,Namer,ModReader,
	Tokenizer,Macroer,Disassembler,TypeChecker, Compiler, Transliterator,
	Expression,Symbol}; //for nodejs
}