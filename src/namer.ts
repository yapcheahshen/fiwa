import {Mnemonic} from './constants.ts'
import {ordinalOf} from './ordinal.ts'
import {parseNumber} from './utils.ts';
import {tailEmoji} from './emojisym.ts';

export const InstAttr={immediate:0,id:1,en:2,zh:3,stackin:4,stackout:5,depth:6};
export const Instructions=[
// , immediate,id         ,en, zh, stackin/out, , depth(1,-1)
/*00*/[0,'unreachable'    ,'unr' ,'◆'],
/*01*/[0,'nop'            ,'nop' ,'◇'],
/*02*/[1,'block'          ,'{' ,'〈',0,0,1],
/*03*/[1,'loop'           ,'{^','☉',0,0,1],
/*04*/[1,'if'             ,'?'  ,'？',0,0,1],
/*05*/[0,'else'           ,'!','！'],
/*06~0a*/[],[],[],[],[],
/*0b*/[0,'end'            ,'}' ,'〉',0,0,-1],
/*0c*/[1,'br'             ,'^'  ,'㍘'],
/*0d*/[1,'br_if'          ,'^?'   ,'䷀'],
/*0e*/[1,'br_table'       ,'^t','㏠'],
/*0f*/[0,'return'         ,')' ,'⏎',],
/*10*/[1,'call'           ,'('   ,'가'],
/*11*/[1,'call_indirect'  ,'i('  ,'㋐'],
/*12~1f*/[],[],[],[],[],[],[],[],
/*1a*/[0,'drop'           ,'drop','𥬔'   ,1,0],
/*1b*/[0,'select'         ,'sel' ,'⚤'   ,3,1],
/*1c~1f*/[],[],[],[],
/*20*/[1,'get_local'      ,'$'   ,'⑴'   ,0,1],
/*21*/[1,'set_local'      ,':$'  ,'①'    ,1,0],
/*22*/[1,'tee_local'      ,';$'  ,'⒈'   ,1,1],
/*23*/[1,'get_global'     ,'g$'  ,'⒜'   ,0,1],
/*24*/[1,'set_global'     ,':g$' ,'ⓐ'   ,1,0],
/*25*/[1,'get_table'      ,'t$'  ,'㈀'   ,0,1],
/*26*/[1,'set_table'      ,':t$' ,'㉠'   ,1,0],
/*27*/[],
/*28*/[2,'i32_load'       ,'[]',  '入' ,1,1], // [] allow embedded varible
/*29*/[2,'i64_load'      ,'l[]',  '籴' ,1,1],
/*2a*/[2,'f32_load'      ,'f[]',  '鳰' ,1,1],
/*2b*/[2,'f64_load'     , 'd[]',  '糴' ,1,1],
/*2c*/[2,'i32_load8_s'  ,'[]bs','𦵔入' ,1,1],
/*2d*/[2,'i32_load8_u'  ,'[]b' ,'爼入' ,1,1],
/*2e*/[2,'i32_load16_s' ,'[]ws','泮入' ,1,1],
/*2f*/[2,'i32_load16_u' ,'[]w' ,'半入' ,1,1],
/*30*/[2,'i64_load8_s' ,'l[]bs','𦵔籴' ,1,1],
/*31*/[2,'i64_load8_u' ,'l[]b' ,'爼籴' ,1,1],
/*32*/[2,'i64_load16_s','l[]ws','𠅫籴' ,1,1],
/*33*/[2,'i64_load16_u','l[]w' ,'㸚籴' ,1,1],
/*34*/[2,'i64_load32_s','l[]qs','泮籴' ,1,1],
/*35*/[2,'i64_load32_u','l[]q' ,'半籴' ,1,1],
/*36*/[2,'i32_store'    ,':[]',    '出' ,2,0], 
/*37*/[2,'i64_store'   ,'l:[]',    '粜' ,2,0],
/*38*/[2,'f32_store'   ,'f:[]',    '𩿩' ,2,0],
/*39*/[2,'f64_store'   ,'d:[]',    '糶' ,2,0],
/*3a*/[2,'i32_store8'   ,':[]b', '爼出' ,2,0],
/*3b*/[2,'i32_store16'  ,':[]w', '半出' ,2,0],
/*3c*/[2,'i64_store8'  ,'l:[]b', '爼粜' ,2,0],
/*3d*/[2,'i64_store16' ,'l:[]w', '㸚粜' ,2,0],
/*3e*/[2,'i64_store32' ,'l:[]q', '半粜' ,2,0],
/*3f*/[2,'memory_size'  ,'memsz', '憶愹' ,0,1],
/*40*/[2,'memory_grow'  ,'memgr', '憶脹' ,1,1],
/*41*/[-1,'i32_const'  ,'i',  '圭'    ,0,1],
/*42*/[-1,'i64_const'  ,'l', '卦'    ,0,1],
/*43*/[-1,'f32_const'  ,'f', '䳏'    ,0,1],
/*44*/[-1,'f64_const'  ,'d','𦐰'    ,0,1],
/*45*/[0,'i32_eqz'     ,'==0',  '空圭'  ,1,1],
/*46*/[0,'i32_eq'      ,'==',   '相同'  ,2,1],
/*47*/[0,'i32_ne'      ,'!=',   '相異'  ,2,1],
/*48*/[0,'i32_lt_s'    ,'<s',  '湘小'  ,2,1],
/*49*/[0,'i32_lt_u'    ,'<',   '相小'  ,2,1],
/*4a*/[0,'i32_gt_s'    ,'>s',  '湘大'  ,2,1],
/*4b*/[0,'i32_gt_u'    ,'>',   '相大'  ,2,1],
/*4c*/[0,'i32_le_s'    ,'<=s',  '湘小同',2,1],
/*4d*/[0,'i32_le_u'    ,'<=',   '相小同',2,1],
/*4e*/[0,'i32_ge_s'    ,'>=s',  '湘大同',2,1],
/*4f*/[0,'i32_ge_u'    ,'>=',   '相大同',2,1],
/*50*/[0,'i64_eqz'     ,'l==0', '空卦',  1,1],
/*51*/[0,'i64_eq'      ,'l==',  '厢同',  2,1],
/*52*/[0,'i64_ne'      ,'l!=',  '厢異',  2,1],
/*53*/[0,'i64_lt_s'    ,'l<s', '廂小',  2,1],
/*54*/[0,'i64_lt_u'    ,'l<',  '厢小',  2,1],
/*55*/[0,'i64_gt_s'    ,'l>s', '廂大',  2,1],
/*56*/[0,'i64_gt_u'    ,'l>',  '厢大',  2,1],
/*57*/[0,'i64_le_s'    ,'l<=s', '廂小同',2,1],
/*58*/[0,'i64_le_u'    ,'l>=',  '厢小同',2,1],
/*59*/[0,'i64_ge_s'    ,'l<=s', '廂大同',2,1],
/*5a*/[0,'i64_ge_u'    ,'l>=',  '厢大同',2,1],
/*5b*/[0,'f32_eq'      ,'f==',  '𪂼同',  2,1],
/*5c*/[0,'f32_ne'      ,'f!=',  '𪂼異',  2,1],
/*5d*/[0,'f32_lt'      ,'f>',  '𪂼小',  2,1],
/*5e*/[0,'f32_gt'      ,'f>',  '𪂼大',  2,1],
/*5f*/[0,'f32_le'      ,'f<=',  '𪂼小同',2,1],
/*60*/[0,'f32_ge'      ,'f>=',  '𪂼大同',2,1],
/*61*/[0,'f64_eq'      ,'d==', '𩮌同',  2,1],
/*62*/[0,'f64_ne'      ,'d!=', '𩮌異',  2,1],
/*63*/[0,'f64_lt'      ,'d<', '𩮌小',  2,1],
/*64*/[0,'f64_gt'      ,'d>', '𩮌大',  2,1],
/*65*/[0,'f64_le'      ,'d<=', '𩮌小同',2,1],
/*66*/[0,'f64_ge'      ,'d>=', '𩮌大同',2,1],
/*67*/[0,'i32_clz'     ,'clz',  '領陰',  1,1],
/*68*/[0,'i32_ctz'     ,'ctz',  '尾陰',  1,1],
/*69*/[0,'i32_popcnt'  ,'popc', '爆陽',  1,1],
/*6a*/[0,'i32_add'     ,'+',  '相加',  2,1],
/*6b*/[0,'i32_sub'     ,'-',  '相減',  2,1],
/*6c*/[0,'i32_mul'     ,'*',  '相乘',  2,1],
/*6d*/[0,'i32_div_s'   ,'/s', '湘除',  2,1],
/*6e*/[0,'i32_div_u'   ,'/',  '相除',  2,1],
/*6f*/[0,'i32_rem_s'   ,'%s', '湘餘',  2,1],
/*70*/[0,'i32_rem_u'   ,'%',  '相餘',  2,1],
/*71*/[0,'i32_and'     ,'and',  '相且',  2,1],
/*72*/[0,'i32_or'      ,'or',   '相或',  2,1],
/*73*/[0,'i32_xor'     ,'xor',  '相斥',  2,1],
/*74*/[0,'i32_shl'     ,'shl',  '相左移',2,1],
/*75*/[0,'i32_shr_s'   ,'shrs', '湘左移',2,1],
/*76*/[0,'i32_shr_u'   ,'shr',  '相左旋',2,1],
/*77*/[0,'i32_rotl'    ,'rotl', '相右旋',2,1],
/*78*/[0,'i32_rotr'    ,'rotr', '相右旋',2,1],
/*79*/[0,'i64_clz'     ,'lclz', '卦領陰',1,1],
/*7a*/[0,'i64_ctz'     ,'lctz', '卦尾陰',1,1],
/*7b*/[0,'i64_popcnt'  ,'lpopc','卦爆陽',1,1],
/*7c*/[0,'i64_add'     ,'l+', '厢加',  2,1],
/*7d*/[0,'i64_sub'     ,'l-', '厢減',  2,1],
/*7e*/[0,'i64_mul'     ,'l*', '厢乘',  2,1],
/*7f*/[0,'i64_div_s'   ,'l/s','廂除',  2,1],
/*80*/[0,'i64_div_u'   ,'l/', '厢除',  2,1],
/*81*/[0,'i64_rem_s'   ,'l%s','廂餘',  2,1],
/*82*/[0,'i64_rem_u'   ,'l%', '厢餘',  2,1],
/*83*/[0,'i64_and'     ,'land', '厢且',  2,1],
/*84*/[0,'i64_or'      ,'orx',  '厢或',  2,1],
/*85*/[0,'i64_xor'     ,'lxor', '厢斥',  2,1],
/*86*/[0,'i64_shl'     ,'lshl', '厢左移',2,1],
/*87*/[0,'i64_shr_s'   ,'lshrs','廂右移',2,1],
/*88*/[0,'i64_shr_u'   ,'lshr', '厢右移',2,1],
/*89*/[0,'i64_rotl'    ,'lrotl','厢左旋',2,1],
/*8a*/[0,'i64_rotr'    ,'lrotr','厢右旋',2,1],
/*8b*/[0,'f32_abs'     ,'abs',  '䳏絕正',1,1],
/*8c*/[0,'f32_neg'     ,'neg',  '䳏負反',1,1],
/*8d*/[0,'f32_ceil'    ,'ceil', '䳏天板',1,1],
/*8e*/[0,'f32_floor'   ,'floor','䳏地板',1,1],
/*8f*/[0,'f32_trunc'   ,'trunc','䳏截整',1,1],
/*90*/[0,'f32_nearest' ,'near', '䳏極近',1,1],
/*91*/[0,'f32_sqrt'    ,'sqrt', '䳏方根',1,1],
/*92*/[0,'f32_add'     ,'f+', '𪂼加'  ,2,1],
/*93*/[0,'f32_sub'     ,'f-', '𪂼減'  ,2,1],
/*94*/[0,'f32_mul'     ,'f*', '𪂼乘'  ,2,1],
/*95*/[0,'f32_div'     ,'f/', '𪂼除'  ,2,1],
/*96*/[0,'f32_min'     ,'fmin', '𪂼最小',2,1],
/*97*/[0,'f32_max'     ,'fmax', '𪂼最大',2,1],
/*98*/[0,'f32_copysign','fcpsg', '䳏抄號',2,1],
/*99*/[0,'f64_abs'    ,'dabs',  '𦐰絕正',1,1],
/*9a*/[0,'f64_neg'    ,'dneg',  '𦐰負反',1,1],
/*9b*/[0,'f64_ceil'   ,'dceil', '𦐰天板',1,1],
/*9c*/[0,'f64_floor'  ,'dfloor','𦐰地板',1,1],
/*9d*/[0,'f64_trunc'  ,'dtrunc','𦐰截整',1,1],
/*9e*/[0,'f64_nearest','dnear', '𦐰極近',1,1],
/*9f*/[0,'f64_sqrt'   ,'dsqrt', '𦐰方根',1,1],
/*a0*/[0,'f64_add'    ,'d+', '𩮌加',  2,1],
/*a1*/[0,'f64_sub'    ,'d-', '𩮌減',  2,1],
/*a2*/[0,'f64_mul'    ,'d*', '𩮌乘',  2,1],
/*a3*/[0,'f64_div'    ,'d/', '𩮌除',  2,1],
/*a4*/[0,'f64_min'    ,'dmin', '𩮌最小',2,1],
/*a5*/[0,'f64_max'    ,'dmax', '𩮌最大',2,1],
/*a6*/[0,'f64_copysign','dcpsg','𦐰抄號',2,1],
/*a7*/[0,'i32_wrap_i64'    ,'wrap',    '圭包卦',1,1],
/*a8*/[0,'i32_trunc_f32_s' ,'truncfs', '洼截䳏',1,1],
/*a9*/[0,'i32_trunc_f32_u' ,'truncf',  '圭截䳏',1,1],
/*aa*/[0,'i32_trunc_f64_s' ,'truncds','洼截𦐰',1,1],
/*ab*/[0,'i32_trunc_f64_u' ,'truncd', '圭截𦐰',1,1],
/*ac*/[0,'i64_trunc_i32_s','ltruncs',  '啩展圭',1,1],
/*ad*/[0,'i64_trunc_i32_u','ltrunc',   '卦展圭',1,1],
/*ae*/[0,'i64_trunc_f32_s','ltruncfs', '啩截䳏',1,1],
/*af*/[0,'i64_trunc_f32_u','ltruncf',  '卦截䳏',1,1],
/*b0*/[0,'i64_trunc_f64_s','ltruncds','啩截𦐰',1,1],
/*b1*/[0,'i64_trunc_f64_u','ltruncd', '卦截𦐰',1,1],
/*b2*/[0,'f32_convert_i32_s','fcvts',  '䳏變洼',1,1],
/*b3*/[0,'f32_convert_i32_u','fcvt',   '䳏變圭',1,1],
/*b4*/[0,'f32_convert_i64_s','fcvxs',  '䳏變啩',1,1],
/*b5*/[0,'f32_convert_i64_u','fcvx',   '䳏變卦',1,1],
/*b6*/[0,'f32_demote_f64'   ,'fdemd', '䳏降𦐰',1,1],
/*b7*/[0,'f64_convert_i32_s','fcvts',  '𦐰變洼',1,1],
/*b8*/[0,'f64_convert_i32_u','fcvt',   '𦐰變圭',1,1],
/*b9*/[0,'f64_convert_i64_s','fcvxs',  '𦐰變啩',1,1],
/*ba*/[0,'f64_convert_i64_u','fcvx',   '𦐰變卦',1,1],
/*bb*/[0,'f64_promote_f32'  ,'dprof', '𦐰升䳏',1,1],
/*bc*/[0,'i32_reinterpret_f32',  'rintf', '圭譯䳏',1,1],
/*bd*/[0,'i64_reinterpret_f64', 'xrintd','卦譯𦐰',1,1],
/*be*/[0,'f32_reinterpret_i32', 'frint',  '䳏譯圭',1,1],
/*bf*/[0,'f64_reinterpret_i64','drintx', '䳏譯卦',1,1],
[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[], //C
[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[], //D

// ,[],[],[],[],[],[],[],[],[],[],[] , //E using E for inline
/*e0*/[1,'addfetch',        '+[]' , '加入'  , 1,1],
/*e1*/[1,'addstore',         '+:[]' , '加出'  , 1,0],
/*e2*/[1,'addtee_store',     '-;[]' , '咖出'  , 1,1],  //𠽦
/*e3*/[1,'string',           '_'   , '𦀵'  , 1,1],  //𠽦
/*e4*/[1,'appendstring',     '+_'  , '加𦀵' , 1,1],  //𠽦


[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[] //F
]
for (let i=0;i<Instructions.length;i++){
	Mnemonic[Instructions[i][1]]=i;
}
const getTailingNumber=(symbol:string)=>{
	let immstart=symbol.length-1;//the immediate value in name
	let cp=symbol.codePointAt(immstart);
	if (!(cp>=0x30&& cp<=0x39)) return [symbol,NaN]
	while (cp>=0x30&& cp<=0x39) {
		immstart--;
		cp=symbol.codePointAt(immstart);
	}
	immstart++;
	let imm=parseInt(symbol.slice(immstart)); 
	let sliced=symbol.slice(0,immstart);
	return (immstart<symbol.length)?[sliced,imm]:[symbol,NaN];
}
const parseOffset=(symbol:string)=>{
	const at=symbol.indexOf('[');
	const at2=symbol.indexOf(']');
	if (~at && ~at2) {
		return [symbol.slice(0,at+1)+symbol.slice(at2), symbol.slice(at+1,at2)];
	} 
	return [symbol,''];
}
const getArgs=(symbol:string)=>{

	let osymbol=symbol;
	let [slice,imm]=getTailingNumber(symbol);
	if(!isNaN(imm)) symbol=slice;
	let offset='';
	[symbol,offset]=parseOffset(symbol);
	const emoji=tailEmoji(symbol);
	if (emoji){
		imm=String.fromCodePoint(emoji);
		symbol=symbol.slice(0, symbol.length-imm.length)
	}

	const at=symbol.indexOf('$');
	if (~at) {
		symbol=symbol.slice(0,at);
		imm=symbol.slice(at);
	}
	// console.log('args!',osymbol,symbol,offset,imm)

	return [symbol,imm,offset];
}

export const immOfSym=(symbol:string):number=>{
	const [ostart,imm,max]=ordinalOf(symbol);
	if (ostart) return imm;
	
	const code=codeOfSym(symbol);
	if (~code) {
		if (Instructions[code][InstAttr.immediate]) {
			const [sliced,imm,offset]=getArgs(symbol);
			return imm;
		}
	}
	return NaN;
}
export const instType=(symbol:string):string=>{
	const code=codeOfSym(symbol);
	if (~code) {
		const id=Instructions[code][InstAttr.id];
		if (code==Mnemonic.if ||code==Mnemonic.end||
		    code==Mnemonic.block||code==Mnemonic.loop||code==Mnemonic.br_if||code==Mnemonic.br) {
			return "branch";
		} else if (code>=0x20&& code<=0x26) {
			return "variable";
		} else if (code>=0x28 && code<=0x40) {
			return "memory";
		} else if (code>=0x41 &&code<=0x44) {
			return "constant";
		} else if (code==Mnemonic.call || code==Mnemonic.call_indirect|| code==Mnemonic.return) {
			return "subroutine";
		} 
		return "arithmetic";
	} else {
		const [n,const_type]=parseNumber(symbol);
		if (const_type) return "constant";
		return 'unknown';
	}
}
//export breakImmediate=
export const codeOfSym=(symbol:string):number=>{
	let code=-1;
	const [ostart,im2,max]=ordinalOf(symbol);
	const firstch=ostart?String.fromCodePoint(ostart):'';
	const [sliced,imm,offset]=getArgs(symbol);

	for (let i=0;i<Instructions.length;i++){
		const [immediate,id,en,zh]=Instructions[i];
		if (id==sliced||zh==sliced||en==sliced) {
		   code=i; 
		   break;
		}
	}
	return code;
}

export {ordinalOf};