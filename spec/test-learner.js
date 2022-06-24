import assert from "assert";
export const test_learner=async ({Learner},tests,pass)=>{
	const test=async (src,val)=>{
		tests++;
		const tokenCB=tk=>{
			// if (isNaN(parseInt(tk))&&tk.codePointAt(0)>0x100) console.log('tk',tk)
		}
		const learner=new Learner();
		learner.run('你好嗎？\n我不好')
		// assert.equal(r,val);
		pass++;
	}
	try{
		await test(`	`, 3653);
		// await test('3 10 *',30);
	} catch(e) {
		console.error(e)
	}
	
	return [tests,pass]
}