import assert from "assert";

export const test_arithmetic=async ({Fiwa},tests,pass)=>{
	const onLog=msg=>console.log(msg);
	const onError=err=>console.log(err);
	const test=async (src,val)=>{
		tests++;
		const fiwa=new Fiwa({onError,onLog});
		const r=await fiwa.execute(src);
		assert.equal(r,val);
		pass++;
	}
	try{
		await test('3 10 + ',13);
		await test('3 10 * ',30);
		await test(': dup ( 1 -- 2 ) $0 ; 10 dup * ',100);
		await test(': dup2 ( a -- 2 ) a a ; 10 dup2 * ',100);
	} catch(e) {
		console.error(e)
	}
	
	return [tests,pass]
}