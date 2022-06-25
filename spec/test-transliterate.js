import assert from "assert";
export const test_transliterate=async ({Var,Assembler,Transliterator},tests,pass)=>{
	const transliterator=new Transliterator();

	const testFromText=(str, out, lang,message)=>{
		const r=transliterator.fromText(str,lang);
		tests++
		if (message=='dump') console.log( 'GOT '+r.join(','),'\nEXP',out.join(','))
		else assert.deepEqual(r,out,message);
		pass++;
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
		testToText([12,232],'br232');  //followunsigned byte

		const fibonacci=[0x20,0x0,0x41,0x2,0x49,0x4,0x40,0x20,0x0,0xF,0x0B,0x20,0x0,
			0x41,0x02,0x6B,0x10,0x0,0x20,0x0,0x41,0x1,0x6B,0x10,0x0,0x6A,0x0F,0xB];
		testToText(fibonacci,'get_local0 2 i32_lt_u if64 get_local0 return end get_local0 2 i32_sub call0 get_local0 1 i32_sub call0 i32_add return end');
		testToText(fibonacci,'⑴ 2相小？⑴⏎。⑴ 2相減※0⑴ 1相減※0相加⏎。','zh');

/*
int sum_array(int* input, int length) {
  int sum = 0;
  for (int i = 0; i < length; ++i) {
    sum += input[i];
  }
  return sum;
  0③□⑵ 1湘小↩0◎⑴入⑶相加③⑴ 4相加①⑵ -1相加⓶↩0。。⑶。
}
    (local $var2 i32) 
    i32.const 0
    set_local $var2
    block $label0
      get_local $var1
      i32.const 1
      i32.lt_s
      br_if $label0
      loop $label1
        get_local $var0
        i32.load
        get_local $var2
        i32.add
        set_local $var2
        get_local $var0
        i32.const 4
        i32.add
        set_local $var0
        get_local $var1
        i32.const -1
        i32.add
        tee_local $var1
        br_if $label1
      end $label1
    end $label0
    get_local $var2*/		
    	const sum_array=[0x41,0,0x21,0x02,0x02,0x40,0x20,0x01,0x41,0x01,0x48,0x0D,0,0x03,0x40,0x20,0,0x28,0x02,0,0x20,0x02,0x6A,0x21,0x02,0x20,0,0x41,0x04,0x6A,0x21,0,0x20,0x01,0x41,0x7F,0x6A,0x22,0x01,0x0D,0,0x0B,0x0B,0x20,0x02,0x0B];
    	const sum_array_concise='0 sl2 blk gl1 1 lt_s br_if0 loop gl0 load gl2 add sl2 gl0 4 add sl0 gl1 -1 add tl1 br_if0 end end gl2 end'
    	const sum_array_zh='0③□⑵ 1湘小↩0◎⑴入⑶相加③⑴ 4相加①⑵ -1相加⓶↩0。。⑶。';
    	//                  0③□⑵小于1↩0◎⑴入加給⑶4加給⑴-1加存⑵↩0。。⑶。 //more clear after macro
		testToText(sum_array,sum_array_concise,'concise');
		testToText(sum_array,sum_array_zh ,'zh')

		testFromText(sum_array_concise,sum_array,'concise');
		testFromText(sum_array_zh,sum_array,'zh');

	} catch(e) {
		console.error(e);
	}
	return [tests,pass]
}