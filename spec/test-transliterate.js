import assert from "assert";

export const test_transliterate=async ({Var,Assembler,Transliterator,StockWasm},tests,pass)=>{
	const transliterator=new Transliterator();
  const {fibonacci,sum_array} = StockWasm;
	const testFromText=(str, out, lang,message)=>{
		const r=transliterator.fromText(str,lang);
		tests++
		if (message=='dump') {
			console.log( 'GOT '+r.join(','),'\nEXP',out.join(','))
			console.log(transliterator.toText(r,'concise'))
		}	else {
			assert.deepEqual(r,out,message);
			pass++;
		}
	}
	const testToText=(bytes,out,lang,message)=>{
		const r=transliterator.toText(bytes,lang);
		tests++
		assert.deepEqual(r,out,message);
		pass++;		
	}
	try {
		testFromText('1000',[65,232,7]);
		testToText([65,232,7],'1000');
		testFromText('30.7',[65,30]); //floating convert to integer, don't know how to store float yet

		testFromText('-2000',[65,176,112]);
		testToText([65,176,112],'-2000');
		testFromText('-16777215',[65,129, 128, 128, 120]);
		testToText([65,129, 128, 128, 120],'-16777215');
		testFromText('-333320040',[65,152, 225, 135, 225, 126]);
		testToText([65,152, 225, 135, 225, 126],'-333320040');
		testFromText(Number.MAX_SAFE_INTEGER.toString(),[66,255, 255, 255, 255, 255, 255, 255, 15]);
		testToText([66,255, 255, 255, 255, 255, 255, 255, 15],Number.MAX_SAFE_INTEGER.toString());

		//instruction ends with number is a operand
		testFromText('get_local100',[32,100]);//
		testToText([32,100],'get_local100');//
		testFromText('set_local100',[33,100]);
		testToText([33,100],'set_local100');
		
		testFromText('br1',[12,1]); 
		testToText([12,12],'br12');  //follow unsigned byte

		testToText(fibonacci,'get_local0 2 i32_lt_u if get_local0 return end get_local0 2 i32_sub call0 get_local0 1 i32_sub call0 i32_add return end');
		testToText(fibonacci,'⑴ 2相小？⑴⏎〉⑴ 2相減가⑴ 1相減가相加⏎〉','zh');
	
    const sum_array_concise='0 =$2 blk $1 1 lts bif0 loop $0 load $2 add =$2 $0 4 add =$0 $1 -1 add @$1 bif0 end end $2 end'
    const sum_array_zh='0③〈⑵ 1湘小䷀☉⑴入⑶相加③⑴ 4相加①⑵ -1相加⒉䷀〉〉⑶〉';
  // //   	//                  0③□⑵小于1㍘◎⑴入加給⑶4加給⑴-1加存⑵㍘。。⑶。 //more clear after macro

		testFromText(sum_array_concise,sum_array,'concise');
		testFromText(sum_array_zh,sum_array,'zh');

		testToText(sum_array,sum_array_concise,'concise');
		testToText(sum_array,sum_array_zh ,'zh')

	} catch(e) {
		console.error(e);
	}
	return [tests,pass]
}