import {test_signature} from "./spec/test-signature.js";
import * as Fiwa from "./dist/index.js"
let test=0,pass=0;
[test,pass]=test_signature(global.FiwaUnits);

console.log('test',test,'pass',pass)