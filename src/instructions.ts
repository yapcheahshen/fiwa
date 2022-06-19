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
	'/'   :"i32_div",
	"*"   :"i32_mul",
	"ret" :"ret",
}