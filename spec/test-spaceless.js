import assert from "assert";
export const test_tokenize=async ({Fiwa},tests,pass)=>{
	const test=async (src,val)=>{
		tests++;
		const tokenCB=tk=>{
			// if (isNaN(parseInt(tk))&&tk.codePointAt(0)>0x100) console.log('tk',tk)
		}
		const fiwa=new Fiwa({callbacks:{token:tokenCB}}); 
		const r=await fiwa.execute(src);
		assert.equal(r,val);
		pass++;
	}
	try{
		await test(`
			:你 ( -- 1) 3;you   \\ ; 只能出現在一個字的開頭，所以 3和 ;會被分開
   			:還好 ( 2 -- 1 ) + ;
			:嗎;
			:年了 ( 1 -- 1 ) 365 * ; 10年了你還好嗎 
			`
			, 3653);
		// await test('3 10 *',30);
	} catch(e) {
		console.error(e)
	}
	
	return [tests,pass]
}