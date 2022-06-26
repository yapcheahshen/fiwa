/* macro  change the behavior of Tokenizer, it has no knowledge of syntax and type in*/
import assert from "assert";
export const test_namer=async ({Var,Namer},tests,pass)=>{
	const {Instructions,InstAttr,Mnemonic,immOfSym, codeOfSym}=Namer;
	const test=(str, out, message)=>{

		console.log('testing nameing')
	}
	try {
		tests++;assert.equal( Instructions[0][InstAttr.id] ,'unreachable' );pass++;
		tests++;assert.equal( Instructions[0xbf][InstAttr.id] ,'f64_reinterpret_i64' );pass++;
		tests++;assert.equal(codeOfSym('ret'),15);pass++;
		tests++;assert.equal(codeOfSym('nop'),1);pass++;
		tests++;assert.equal(codeOfSym('$22'),0x20);pass++;
		tests++;assert.equal(codeOfSym('set_local22'),0x21);pass++;
		tests++;assert.equal(immOfSym('$22'),22);pass++;
		tests++;assert.equal(immOfSym('get_local22'),22);pass++;
		tests++;assert.equal(immOfSym('⑳'),19);pass++;
		tests++;assert.equal(immOfSym('힣'),11171);pass++;

		tests++;assert.equal(Mnemonic.nop , 1 );pass++;
		tests++;assert.equal(Mnemonic.i32_const , 0x41 );pass++;
		tests++;assert.equal(Instructions[Mnemonic.i32_store][InstAttr.zh] , '出' );pass++;
	} catch(e) {

		console.error(e);
	}
	return [tests,pass]
}