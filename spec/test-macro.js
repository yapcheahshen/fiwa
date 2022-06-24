/* macro  change the behavior of Tokenizer, it has no knowledge of syntax and type in*/
import assert from "assert";
export const test_macro=async ({Var,Macroer,Tokenizer},tests,pass)=>{
	const macroer=new Macroer();
	const test=(str, out, message)=>{
		const tokens=macroer.run(str);
		tests++
		// console.log(macroer.getLexicon())
		console.log(tokens)
		// assert.deepEqual(tokens,out,message);
		pass++;
		// console.log('lexicon',tokenizer.getLexicon());
		// console.log(str,tokens)
	}
	try {
		//²¹₁₂₃  , ₘₙₒ 
		//define macro in bracket, as macro cannot have parameter
		test('#加 圭₁相加\n人數加10',['人數','圭','10','相加'],'');
	} catch(e) {
		console.error(e);
	}
	return [tests,pass]

}