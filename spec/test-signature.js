import assert from "assert";
export const test_signature =({Assembler,parseSignature})=>{
	let tests=0,pass=0;
	const A=new Assembler();
	const test=(signature, out)=>{
		tests++
		A.setTib(signature);
		const r=parseSignature.call(A, A.nextToken());
		assert.deepEqual(r,out);
		pass++;
	}
	try {
		test('(a )',[['a'],[],[]]);
		test('( a )',[['a'],[],[]]);
		test('( a b)',[['a'],[],[]]);
		test('( a b )',[['a','b'],[],[]]);
		test('( a -- b )',[['a'],[],[]]); //b is comment
		test('( a -- 1 )',[['a'],[],[127]]);
		test('( 2 -- 1 )',[['$0','$1'],[],[127]]);
		test('(a 變數注解 b 中文注解 | i 區變 j | 2 comment )',[[ 'a','b' ], ['i','j'], [127,127] ]);
	} catch(e){
		console.log(e)
	}

	return [tests,pass]	;
}