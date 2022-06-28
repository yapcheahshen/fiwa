// import {test_signature} from "./spec/test-signature.js";
// import {test_arithmetic} from "./spec/test-arithmetic.js";
import {test_tokenize} from "./spec/test-tokenize.js";
// import {test_disassemble} from "./spec/test-disassemble.js";
// import {test_macro} from "./spec/test-macro.js";
// import {test_transliterate} from "./spec/test-transliterate.js";
// import {test_namer} from "./spec/test-namer.js";
// import {test_modreader} from "./spec/test-modreader.js";

import * as Fiwa from "./dist/index.js"
// import {test_typecheck} from "./spec/test-typecheck.js";
let test=0,pass=0;

async function allTest(){
 //    [test,pass]=test_signature(global.testable,test,pass);
	// [test,pass]=await test_arithmetic(global.testable,test,pass);
	[test,pass]=await test_tokenize(global.testable,test,pass);
	 // [test,pass]=await test_disassemble(global.testable,test,pass);
	   // [test,pass]=await test_macro(global.testable,test,pass);
	// [test,pass]=await test_namer(global.testable,test,pass);
	 // [test,pass]=await test_transliterate(global.testable,test,pass);
	 // [test,pass]=await test_modreader(global.testable,test,pass);
	console.log('test',test,'pass',pass)
}

allTest()
