import assert from "assert";

export const test_signature =({Var,Assembler,parseSignature},tests,pass)=>{
	const {i32}=Var;
	const A=new Assembler();
	const test=(signature, out, message)=>{
		tests++
		A.setTib(signature);
		const r=parseSignature.call(A, A.nextToken());
		assert.deepEqual(r,out, message);
		pass++;
	}
	try {
		test('(a )',[['a'],[],[]]);
		test('(1 -- 1 )',[['$0'],[],[i32]]);
		test('( -- 1 )',[[],[],[i32]]);
		test('(a !xxx )',[['a'],[],[]],'一切不以 A-Za-z開頭的，視為注解'); 
		test('( a )',[['a'],[],[]]);
		test('( a b)',[['a','b'],[],[]]);
		test('( a b )',[['a','b'],[],[]]);
		test('( a -- b )',[['a'],[],[]],'b視為注解');
		test('( a -- 1 )',[['a'],[],[i32]]);
		test('( 2 -- 1 )',[['$0','$1'],[],[i32]]);
		test('(a 變數注解 b | i 區變 j | 2 comment )',[[ 'a','b' ], ['i','j'], [i32,i32] ]);

		test('( 2 | i | 1 )',[['$0','$1'],['i'],[i32]]); 
		test('( 2 -- | i | 1 )',[['$0','$1'],[],[i32]],'--之後的定義無效'); 

		test('( 3 | i 3 | 1)',[['$0','$1','$2'],['i'],[i32]],'區域變數內的數字不起作用');  

		test('( 3 | i | 1 | j |)',[['$0','$1','$2'],['i'],[i32]],'在一個區域內定義');  //
		test('( 2 -- 1 之後再定義不會覆蓋 2)',[['$0','$1'],[],[i32]],'返回數只能指定一次');  

		test('( 2 -- 3)',[['$0','$1'],[],[i32,i32,i32]],'返回數最多3個');  
		test('( 10 -- 1 )',[['$0','$1','$2'],[],[i32]],'數字型最多3個，超過必須命名');  
		test('( a b c d -- 1 )',[['a','b','c','d'],[],[i32]],'名字型參數不限個數');  

	} catch(e){
		console.log(e)
	}

	return [tests,pass]	;
}