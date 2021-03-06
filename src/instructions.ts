/* forth word and CodeWriter function mapping */
export const Instructions={ 
	"drop":"drop",
	"nop" :"nop",
	"if"  :"if",
	"else":"else",
	"then":"end",
	"="   :"i32_eq",
	"=0"  :"i32_eqz",
	"!="  :"i32_ne",
	"+"   :"i32_add",
	"-"   :"i32_sub",
	'/'   :"i32_div_s",
	"*"   :"i32_mul",
	"<"   :"i32_lt_s",
	">"   :"i32_gt_s",
	"<="   :"i32_le_s",
	">="   :"i32_ge_s",
	"and"   :"i32_and",
	"or"   :"i32_or",
	"xor"   :"i32_xor",
	"ret" :"ret",
}