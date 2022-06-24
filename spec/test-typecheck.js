/* macro  change the behavior of Tokenizer, it has no knowledge of syntax and type in*/
import assert from "assert";
export const test_typecheck=async ({TypeChecker},tests,pass)=>{
	const typechecker=new TypeChecker();
	const test=(str, out, message)=>{
		const r=typechecker.run(str);
		tests++
		// console.log(macroer.getLexicon())
		console.log('r',r)
		// assert.deepEqual(tokens,out,message);
		pass++;
		// console.log('lexicon',tokenizer.getLexicon());
		// console.log(str,tokens)
	}
	try {
		//²¹₁₂₃  , ₘₙₒ 
		//define macro in bracket, as macro cannot have parameter
		test('我們圭₁10相加0x50某個動作','');
	} catch(e) {
		console.error(e);
	}
	return [tests,pass]

}