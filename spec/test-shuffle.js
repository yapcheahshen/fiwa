import assert from "assert";
export const test_shuffle=async ({Var,Assembler,Tokenizer,Shuffler},tests,pass)=>{
	const tokenizer=new Tokenizer();
	const tokens=[];

	const handlers={"": (tk)=>tokens.push(tk) } ;
	const test=(str, out, handlers,message)=>{
		tokens.length=0;
		tokenizer.run(str,handlers);
		tests++
		assert.deepEqual(tokens,out,message);
		pass++;
	}
	try {

	} catch(e) {
		console.error(e);
	}
	return [tests,pass]
}