/* macro  change the behavior of Tokenizer, it has no knowledge of syntax and type in*/
import assert from "assert";
export const test_macro=async ({Var,Assembler,Tokenizer},tests,pass)=>{
	const tokenizer=new Tokenizer();
	const tokens=[];
	const handlers={"": (tk)=>tokens.push(tk) } ;
	const test=(str, out, handlers,message)=>{
		tokens.length=0;
		tokenizer.run(str,handlers);
		tests++
		// assert.deepEqual(tokens,out,message);
		pass++;
		// console.log('lexicon',tokenizer.getLexicon());
		console.log(str,tokens)
	}
	try {
		//²¹₁₂₃  , ₘₙₒ 
		//define macro in bracket, as macro cannot have parameter
		test('(#加 圭₁相加)參加人數加10',['參加人數','圭','10','相加'],handlers ,'');
	} catch(e) {
		console.error(e);
	}
	return [tests,pass]

}