import {ordinalOf} from './ordinal.ts'
export const InstAttr={immediate:0,id:1,en:2,zh:3,stackin:4,stackout:5,depth:6};
export const Instructions=[
// , immediate,id         ,en, zh, stackin/out, , depth(1,-1)
/*00*/[0,'unreachable'    ,'unr' ,'◆'],
/*01*/[0,'nop'            ,'nop' ,'◇'],
/*02*/[1,'block'          ,'blk' ,'〈',0,0,1],
/*03*/[1,'loop'           ,'loop','☉',0,0,1],
/*04*/[1,'if'             ,'if'  ,'？',0,0,1],
/*05*/[0,'else'           ,'else','！'],
/*06~0a*/[],[],[],[],[],
/*0b*/[0,'end'            ,'end' ,'〉',0,0,-1],
/*0c*/[1,'br'             ,'br'  ,'㍘'],
/*0d*/[1,'br_if'          ,'bif' ,'䷀'],
/*0e*/[1,'br_table'       ,'btbl','㏠'],
/*0f*/[0,'return'         ,'ret' ,'⏎',],
/*10*/[1,'call'           ,'c'   ,'가'],
/*11*/[1,'call_indirect'  ,'ci'  ,'㋐'],
/*12~1f*/[],[],[],[],[],[],[],[],
/*1a*/[0,'drop'           ,'drop','𥬔'   ,1,0],
/*1b*/[0,'select'         ,'sel' ,'⚤'   ,3,1],
/*1c~1f*/[],[],[],[],
/*20*/[1,'get_local'      ,'$'   ,'⑴'   ,0,1],
/*21*/[1,'set_local'      ,'=$'  ,'①'    ,1,0],
/*22*/[1,'tee_local'      ,'@$'  ,'⒈'   ,1,1],
/*23*/[1,'get_global'     ,'g$'  ,'⒜'   ,0,1],
/*24*/[1,'set_global'     ,'=t$' ,'ⓐ'   ,1,0],
/*25*/[1,'get_table'      ,'t$'  ,'㈀'   ,0,1],
/*26*/[1,'set_table'      ,'=g$' ,'㉠'   ,1,0],
/*27*/[],
/*28*/[2,'i32_load'       ,'load',  '入' ,1,1],
/*29*/[2,'i64_load'      ,'lload',  '籴' ,1,1],
/*2a*/[2,'f32_load'      ,'fload',  '鳰' ,1,1],
/*2b*/[2,'f64_load'     ,'xfload',  '糴' ,1,1],
/*2c*/[2,'i32_load8_s'  ,'loadbs','𦵔入' ,1,1],
/*2d*/[2,'i32_load8_u'  ,'loadb' ,'爼入' ,1,1],
/*2e*/[2,'i32_load16_s' ,'loadws','泮入' ,1,1],
/*2f*/[2,'i32_load16_u' ,'loadw' ,'半入' ,1,1],
/*30*/[2,'i64_load8_s' ,'xloadbs','𦵔籴' ,1,1],
/*31*/[2,'i64_load8_u' ,'xloadb' ,'爼籴' ,1,1],
/*32*/[2,'i64_load16_s','xloadws','𠅫籴' ,1,1],
/*33*/[2,'i64_load16_u','xloadw' ,'㸚籴' ,1,1],
/*34*/[2,'i64_load32_s','xloadqs','泮籴' ,1,1],
/*35*/[2,'i64_load32_u','xloadq' ,'半籴' ,1,1],
/*36*/[2,'i32_store'    ,'stor',    '出' ,2,0],
/*37*/[2,'i64_store'   ,'xstor',    '粜' ,2,0],
/*38*/[2,'f32_store'   ,'fstor',    '𩿩' ,2,0],
/*39*/[2,'f64_store'  ,'xfstor',    '糶' ,2,0],
/*3a*/[2,'i32_store8'   ,'storb', '爼出' ,2,0],
/*3b*/[2,'i32_store16'  ,'storw', '半出' ,2,0],
/*3c*/[2,'i64_store8'  ,'xstorb', '爼粜' ,2,0],
/*3d*/[2,'i64_store16' ,'xstorw', '㸚粜' ,2,0],
/*3e*/[2,'i64_store32' ,'xstorq', '半粜' ,2,0],
/*3f*/[2,'memory_size'  ,'memsz', '憶愹' ,0,1],
/*40*/[2,'memory_grow'  ,'memgr', '憶脹' ,1,1],
/*41*/[-1,'i32_const'  ,'con',  '圭'    ,0,1],
/*42*/[-1,'i64_const'  ,'xcon', '卦'    ,0,1],
/*43*/[-1,'f32_const'  ,'fcon', '䳏'    ,0,1],
/*44*/[-1,'f64_const'  ,'xfcon','𦐰'    ,0,1],
/*45*/[0,'i32_eqz'     ,'eqz',  '空圭'  ,1,1],
/*46*/[0,'i32_eq'      ,'eq',   '相同'  ,2,1],
/*47*/[0,'i32_ne'      ,'ne',   '相異'  ,2,1],
/*48*/[0,'i32_lt_s'    ,'lts',  '湘小'  ,2,1],
/*49*/[0,'i32_lt_u'    ,'lt',   '相小'  ,2,1],
/*4a*/[0,'i32_gt_s'    ,'gts',  '湘大'  ,2,1],
/*4b*/[0,'i32_gt_u'    ,'gt',   '相大'  ,2,1],
/*4c*/[0,'i32_le_s'    ,'les',  '湘小同',2,1],
/*4d*/[0,'i32_le_u'    ,'le',   '相小同',2,1],
/*4e*/[0,'i32_ge_s'    ,'ges',  '湘大同',2,1],
/*4f*/[0,'i32_ge_u'    ,'ge',   '相大同',2,1],
/*50*/[0,'i64_eqz'     ,'xeqz', '空卦',  1,1],
/*51*/[0,'i64_eq'      ,'xeq',  '厢同',  2,1],
/*52*/[0,'i64_ne'      ,'xne',  '厢異',  2,1],
/*53*/[0,'i64_lt_s'    ,'xlts', '廂小',  2,1],
/*54*/[0,'i64_lt_u'    ,'xlt',  '厢小',  2,1],
/*55*/[0,'i64_gt_s'    ,'xgts', '廂大',  2,1],
/*56*/[0,'i64_gt_u'    ,'xgt',  '厢大',  2,1],
/*57*/[0,'i64_le_s'    ,'xles', '廂小同',2,1],
/*58*/[0,'i64_le_u'    ,'xle',  '厢小同',2,1],
/*59*/[0,'i64_ge_s'    ,'xges', '廂大同',2,1],
/*5a*/[0,'i64_ge_u'    ,'xge',  '厢大同',2,1],
/*5b*/[0,'f32_eq'      ,'feq',  '𪂼同',  2,1],
/*5c*/[0,'f32_ne'      ,'fne',  '𪂼異',  2,1],
/*5d*/[0,'f32_lt'      ,'flt',  '𪂼小',  2,1],
/*5e*/[0,'f32_gt'      ,'fgt',  '𪂼大',  2,1],
/*5f*/[0,'f32_le'      ,'fle',  '𪂼小同',2,1],
/*60*/[0,'f32_ge'      ,'fge',  '𪂼大同',2,1],
/*61*/[0,'f64_eq'      ,'xfeq', '𩮌同',  2,1],
/*62*/[0,'f64_ne'      ,'xfne', '𩮌異',  2,1],
/*63*/[0,'f64_lt'      ,'xflt', '𩮌小',  2,1],
/*64*/[0,'f64_gt'      ,'xfgt', '𩮌大',  2,1],
/*65*/[0,'f64_le'      ,'xfle', '𩮌小同',2,1],
/*66*/[0,'f64_ge'      ,'xfge', '𩮌大同',2,1],
/*67*/[0,'i32_clz'     ,'clz',  '領陰',  1,1],
/*68*/[0,'i32_ctz'     ,'ctz',  '尾陰',  1,1],
/*69*/[0,'i32_popcnt'  ,'popc', '爆陽',  1,1],
/*6a*/[0,'i32_add'     ,'add',  '相加',  2,1],
/*6b*/[0,'i32_sub'     ,'sub',  '相減',  2,1],
/*6c*/[0,'i32_mul'     ,'mul',  '相乘',  2,1],
/*6d*/[0,'i32_div_s'   ,'divs', '湘除',  2,1],
/*6e*/[0,'i32_div_u'   ,'div',  '相除',  2,1],
/*6f*/[0,'i32_rem_s'   ,'rems', '湘餘',  2,1],
/*70*/[0,'i32_rem_u'   ,'rem',  '相餘',  2,1],
/*71*/[0,'i32_and'     ,'and',  '相且',  2,1],
/*72*/[0,'i32_or'      ,'or',   '相或',  2,1],
/*73*/[0,'i32_xor'     ,'xor',  '相斥',  2,1],
/*74*/[0,'i32_shl'     ,'shl',  '相左移',2,1],
/*75*/[0,'i32_shr_s'   ,'shrs', '湘左移',2,1],
/*76*/[0,'i32_shr_u'   ,'shr',  '相左旋',2,1],
/*77*/[0,'i32_rotl'    ,'rotl', '相右旋',2,1],
/*78*/[0,'i32_rotr'    ,'rotr', '相右旋',2,1],
/*79*/[0,'i64_clz'     ,'xclz', '卦領陰',1,1],
/*7a*/[0,'i64_ctz'     ,'xctz', '卦尾陰',1,1],
/*7b*/[0,'i64_popcnt'  ,'xpopc','卦爆陽',1,1],
/*7c*/[0,'i64_add'     ,'xadd', '厢加',  2,1],
/*7d*/[0,'i64_sub'     ,'xclz', '厢減',  2,1],
/*7e*/[0,'i64_mul'     ,'xclz', '厢乘',  2,1],
/*7f*/[0,'i64_div_s'   ,'xdivs','廂除',  2,1],
/*80*/[0,'i64_div_u'   ,'xdiv', '厢除',  2,1],
/*81*/[0,'i64_rem_s'   ,'xrems','廂餘',  2,1],
/*82*/[0,'i64_rem_u'   ,'xrem', '厢餘',  2,1],
/*83*/[0,'i64_and'     ,'xand', '厢且',  2,1],
/*84*/[0,'i64_or'      ,'orx',  '厢或',  2,1],
/*85*/[0,'i64_xor'     ,'xxor', '厢斥',  2,1],
/*86*/[0,'i64_shl'     ,'xshl', '厢左移',2,1],
/*87*/[0,'i64_shr_s'   ,'xshrs','廂右移',2,1],
/*88*/[0,'i64_shr_u'   ,'xshr', '厢右移',2,1],
/*89*/[0,'i64_rotl'    ,'xrotl','厢左旋',2,1],
/*8a*/[0,'i64_rotr'    ,'xrotr','厢右旋',2,1],
/*8b*/[0,'f32_abs'     ,'abs',  '䳏絕正',1,1],
/*8c*/[0,'f32_neg'     ,'neg',  '䳏負反',1,1],
/*8d*/[0,'f32_ceil'    ,'ceil', '䳏天板',1,1],
/*8e*/[0,'f32_floor'   ,'floor','䳏地板',1,1],
/*8f*/[0,'f32_trunc'   ,'trunc','䳏截整',1,1],
/*90*/[0,'f32_nearest' ,'near', '䳏極近',1,1],
/*91*/[0,'f32_sqrt'    ,'sqrt', '䳏方根',1,1],
/*92*/[0,'f32_add'     ,'fadd', '𪂼加'  ,2,1],
/*93*/[0,'f32_sub'     ,'fsub', '𪂼減'  ,2,1],
/*94*/[0,'f32_mul'     ,'fmul', '𪂼乘'  ,2,1],
/*95*/[0,'f32_div'     ,'fdiv', '𪂼除'  ,2,1],
/*96*/[0,'f32_min'     ,'fmin', '𪂼最小',2,1],
/*97*/[0,'f32_max'     ,'fmax', '𪂼最大',2,1],
/*98*/[0,'f32_copysign','cpsg', '䳏抄號',2,1],
/*99*/[0,'f64_abs'    ,'xabs',  '𦐰絕正',1,1],
/*9a*/[0,'f64_neg'    ,'xneg',  '𦐰負反',1,1],
/*9b*/[0,'f64_ceil'   ,'xceil', '𦐰天板',1,1],
/*9c*/[0,'f64_floor'  ,'xfloor','𦐰地板',1,1],
/*9d*/[0,'f64_trunc'  ,'xtrunc','𦐰截整',1,1],
/*9e*/[0,'f64_nearest','xnear', '𦐰極近',1,1],
/*9f*/[0,'f64_sqrt'   ,'xsqrt', '𦐰方根',1,1],
/*a0*/[0,'f64_add'    ,'xfadd', '𩮌加',  2,1],
/*a1*/[0,'f64_sub'    ,'xfsub', '𩮌減',  2,1],
/*a2*/[0,'f64_mul'    ,'xfmul', '𩮌乘',  2,1],
/*a3*/[0,'f64_div'    ,'xfdiv', '𩮌除',  2,1],
/*a4*/[0,'f64_min'    ,'xfmin', '𩮌最小',2,1],
/*a5*/[0,'f64_max'    ,'xfmax', '𩮌最大',2,1],
/*a6*/[0,'f64_copysign','xcpsg','𦐰抄號',2,1],
/*a7*/[0,'i32_wrap_i64'    ,'wrap',    '圭包卦',1,1],
/*a8*/[0,'i32_trunc_f32_s' ,'truncfs', '洼截䳏',1,1],
/*a9*/[0,'i32_trunc_f32_u' ,'truncf',  '圭截䳏',1,1],
/*aa*/[0,'i32_trunc_f64_s' ,'truncxfs','洼截𦐰',1,1],
/*ab*/[0,'i32_trunc_f64_u' ,'truncxf', '圭截𦐰',1,1],
/*ac*/[0,'i64_trunc_i32_s','xtruncs',  '啩展圭',1,1],
/*ad*/[0,'i64_trunc_i32_u','xtrunc',   '卦展圭',1,1],
/*ae*/[0,'i64_trunc_f32_s','xtruncfs', '啩截䳏',1,1],
/*af*/[0,'i64_trunc_f32_u','xtruncf',  '卦截䳏',1,1],
/*b0*/[0,'i64_trunc_f64_s','xtruncxfs','啩截𦐰',1,1],
/*b1*/[0,'i64_trunc_f64_u','xtruncxf', '卦截𦐰',1,1],
/*b2*/[0,'f32_convert_i32_s','fcvts',  '䳏變洼',1,1],
/*b3*/[0,'f32_convert_i32_u','fcvt',   '䳏變圭',1,1],
/*b4*/[0,'f32_convert_i64_s','fcvxs',  '䳏變啩',1,1],
/*b5*/[0,'f32_convert_i64_u','fcvx',   '䳏變卦',1,1],
/*b6*/[0,'f32_demote_f64'   ,'fdemxf', '䳏降𦐰',1,1],
/*b7*/[0,'f64_convert_i32_s','fcvts',  '𦐰變洼',1,1],
/*b8*/[0,'f64_convert_i32_u','fcvt',   '𦐰變圭',1,1],
/*b9*/[0,'f64_convert_i64_s','fcvxs',  '𦐰變啩',1,1],
/*ba*/[0,'f64_convert_i64_u','fcvx',   '𦐰變卦',1,1],
/*bb*/[0,'f64_promote_f32'  ,'xfprof', '𦐰升䳏',1,1],
/*bc*/[0,'i32_reinterpret_f32',  'rintf', '圭譯䳏',1,1],
/*bd*/[0,'i64_reinterpret_f64', 'xrintxf','卦譯𦐰',1,1],
/*be*/[0,'f32_reinterpret_i32', 'frint',  '䳏譯圭',1,1],
/*bf*/[0,'f64_reinterpret_i64','xfrintx', '䳏譯卦',1,1]
]
export const Mnemonic={};
for (let i=0;i<Instructions.length;i++){
	Mnemonic[Instructions[i][1]]=i;
}
const getTailingNumber=(symbol:string)=>{
	let immstart=symbol.length-1;//the immediate value in name
	let cp=symbol.codePointAt(immstart);
	while (cp>=0x30&& cp<=0x39) {
		immstart--;
		cp=symbol.codePointAt(immstart);
	}
	immstart++;
	let imm=parseInt(symbol.slice(immstart)); 
	let sliced=symbol.slice(0,immstart);
	return (immstart<symbol.length)?[sliced,imm]:[symbol,NaN];
}
export const immOfSym=(symbol:string):number=>{
	const [ostart,imm,max]=ordinalOf(symbol);
	if (ostart) return imm;
	
	const code=codeOfSym(symbol);
	if (~code) {
		if (Instructions[code][InstAttr.immediate]) {
			const [sliced,imm]=getTailingNumber(symbol);
			return imm;
		}
	}
	return NaN;
}

//export breakImmediate=
export const codeOfSym=(symbol:string):number=>{
	let code=-1;
	const [ostart,im2,max]=ordinalOf(symbol);
	const firstch=ostart?String.fromCodePoint(ostart):'';
	//if (symbol=='③') console.log(firstch,ostart);
	const [sliced,imm]=getTailingNumber(symbol);
	for (let i=0;i<Instructions.length;i++){
		const [immediate,id,en,zh]=Instructions[i];
		if (id==symbol||en==symbol||zh==symbol||id==sliced||zh==sliced||en==sliced) {
		   code=i;
		   break;
		}
		if (firstch==zh) {
			code=i;
			break;
		}
	}
	return code;
}

export {ordinalOf};