/*與語義無關的切分模組，不斷學會新詞，並做為之後斷詞的參考，
最簡單的長詞優先算法，有歧義的情況，人工補空白。
中文詞必須連續，並且不含任何的標點符號。
*/
import assert from "assert";
export const test_tokenize=async ({Var,Mnemonic,Assembler,Tokenizer,Expression,Symbol},tests,pass)=>{
	const {parseExpression} = Expression;
	const {SymbolType,symbolType} = Symbol;
	const tokenizer=new Tokenizer();

	//const handlers={"": (tk)=>tokens.push(tk) } ;
	const test=(str, out, message)=>{
		let tokens=tokenizer.run(str).map(it=>it[0]);
		tests++
		assert.deepEqual(tokens,out,message);
		pass++;
	}
	const testExpression=(token,out,message)=>{
		const expr=parseExpression(token);
		tests++
		assert.deepEqual(expr,out,message);
		pass++;
	}
	const testSymbol=(symbol,out,message)=>{
		const st=symbolType(symbol);
		tests++
		assert.equal(st,out,message);
		pass++;
	}
	try {
		testSymbol('_11'    ,SymbolType.Inline ); //a string literal
		testSymbol('+_11'    ,SymbolType.Inline ); //append string literal
		testSymbol('[_11]'  , SymbolType.Primitive); //syntax ok, type check later
		testExpression('[_11]',[Mnemonic.i32_load, '_11'  ]  );

		test(`   `,['   '] );
		test('a bb ccc',['a',' ','bb',' ','ccc'] );
		test(`甲乙 甲乙丙丁`,	['甲乙',' ','甲乙','丙丁'] ); 
		test(`甲乙 丙丁甲甲乙乙`,['甲乙',' ','丙丁甲','甲乙','乙'] );//
		test(`天a乙丙1 甲乙丙丁3乙`,['天','a','乙丙','1',' ','甲','乙丙','丁','3','乙'] );

		//ascii group into a single token, like forth
		test(`abc123 a33`,['abc123',' ','a33'] );
		test(`[x] [2]`,['[x]',' ','[2]'] );
		//ascii number breaks chinese
		test(`中文32中文`,['中文','32','中文'] );
		//ordinal is part of token
		test(`中⑴文 中가文`,['中⑴','文',' ','中가','文'] );
		//ordinal can mix with ascii
		test(`[⑴] [가]`,['[⑴]',' ','[가]'] );

		// //
		// //生肖
		test(`🐍🐎🐏`,['🐍','🐎','🐏'] );
		// //may follow chinese
		test('泮籴🐮入🐏',['泮籴🐮','入🐏'])
		test('泮籴🐏a[🐮]b入🐏',['泮籴🐏','a[🐮]b','入🐏'])

		test('泮籴🐮回回🐏🐏🐍',['泮籴🐮','回回🐏','🐏','🐍']);
		test('泮籴🐮入🐏',['泮籴🐮','入🐏']);
		test('泮籴🚌', ['泮籴🚌']  );
		test('泮籴[🍋]🚌', ['泮籴[🍋]🚌']  );
		test('泮籴[中]🚌', ['泮籴[中]🚌']  );

		test('"xx x" xx yy',['"xx x"', ' ','xx',' ','yy']);

		test('"x\\"x x" xx yy',['"x\\"x x"', ' ','xx',' ','yy']);

//an expression consist of a instruction, immediate value and offset value.
// immediate and offset value can be given by a symbol
// a symbol is $n (for number variable) or _n (for string literal) or emoji

//load,store,get,set can be easily input,
		testExpression('[🐖]',[0x28, '🐖' ]  );
		testExpression('[_4]',[0x28, '_4' ]  );
		testExpression('[$44]',[0x28, '$44' ]  );
		testExpression('[中]',[0x28 ]  );      //cannot use single chinese, must use literal

//load from 🚌 with offset store in  🍋
		testExpression('l[🍋]🚌qs',[0x34,'🚌','🍋' ]  );

		testExpression('泮籴🐮',[0x34, '🐮'  ]  );

		testSymbol('call123',SymbolType.Primitive);
		testSymbol('drop123',SymbolType.Primitive);
		testSymbol('addfetch🐮',SymbolType.Inline);

		testSymbol('+:[🍋]🚌',SymbolType.Inline);
		testSymbol('+:[]',SymbolType.Inline);  //missing tail

		testSymbol('+:[🍋]🚌',SymbolType.Inline);

		// testInline('4 +[🍋]','4 + 🐮 i64_load32_s')

	} catch(e) {
		console.error(e);
	}
	return [tests,pass]
}