/*與語義無關的切分模組，不斷學會新詞，並做為之後斷詞的參考，
最簡單的長詞優先算法，有歧義的情況，人工補空白。
中文詞必須連續，並且不含任何的標點符號。
*/
import assert from "assert";
export const test_tokenize=async ({Var,Assembler,Tokenizer},tests,pass)=>{
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
		test('a bb ccc',['a',' ','bb',' ','ccc'],handlers );
		test(`甲乙 甲乙丙丁`,	['甲乙',' ','甲乙','丙丁'],handlers ); 
		test(`甲乙 丙丁甲甲乙乙`,['甲乙',' ','丙丁甲','甲乙','乙'],handlers );//
		test(`天a乙丙1 甲乙丙丁3乙`,['天','a','乙丙','1',' ','甲','乙丙','丁','3','乙'],handlers );
	} catch(e) {
		console.error(e);
	}
	return [tests,pass]
}