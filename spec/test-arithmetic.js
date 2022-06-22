import assert from "assert";

export const test_arithmetic=async ({Fiwa},tests,pass)=>{
	const test=async (src,val,msg)=>{
		tests++;
		const fiwa=new Fiwa();
		const r=await fiwa.execute(src);
		assert.equal(r,val,msg);
		pass++;
	}
	try{
		await test('3 10 + ',13);
		await test('3 10 * ',30);
		await test(': dup ( 1 -- 2 ) $0 ; 10 dup * ',100, '數字型參數，會自動推入' );
		await test(': dup2 ( a -- 2 ) a a ; 10 dup2 * ',100,'已經將參數賦給a ，當區域變數使用');
	} catch(e) {
		console.error(e)
	}
	
	return [tests,pass]
}