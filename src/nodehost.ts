import {parseSignature} from "./signature.ts";
import Assembler from "./assembler.ts"

if (typeof global!=='undefined') {
	global.FiwaUnits={Assembler,parseSignature}; //for nodejs
}