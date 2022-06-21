import {bytecode,Var} from "./constants.ts";
import {validForthName,validExportName} from "./utils.ts";
/* 避免使用 regular expression ，讓meta compiling 好做
 ( a b - i j - 3 memo ) a b 兩個參數 , c 和 d 兩個
 ( 一個數字 或 多個命名參數  -區域變數- 返回值個數 注解...) // - 之間可以注解

 ( 3 -- 1 ) 數字型參數，用$0, $1, $2引用。並自動推入stack
 ( 3 )  等效於  ( 3 -- 0 )
 一踫結尾為 ")" 就結束，
*/
export function parseSignature(tk:string):[ string[],string[],Var[] ]{ 
	const from=this.ntib;
	let params:string[]=[],locals:string[]=[], resultcount=-1, paracount=-1; 
	let rightside=false, definelocal=false;//start from leftside
	tk=tk.length>1?tk.slice(1):this.nextToken(); // 只要 tk[0]=="(" 就會到這裡，所以如果有字也要看

	while (tk) {
		if (tk[tk.length-1]===')') break; //如果寫成  (a b) //b 會被無視
		if (tk=='--') {  //跳過區域變數，切到返回區 ，如果出現多次，當作注解
			definelocal=false;
			rightside=true; //no local variables
		} else if (tk[0]=='|' || tk[tk.length-1]=='|') {//定義區域變數，結束區域變數切到返回區
			if (definelocal) {
				definelocal=false;
				rightside=true;
			} else if (!rightside) { //在返回區不能再定義區域變數了
				definelocal=true;
			}
		} else {
			const n=parseInt(tk);
			if (n.toString()==tk) { //we have a number
				if (rightside) {
					if (resultcount==-1) resultcount=n;//first number as result count
				} else if (!definelocal) {
					if (paracount==-1) paracount=n;
				}
			} else {
				const validname=validForthName(tk)&&validExportName(tk);
				if (validname) {
					if (definelocal) {
						locals.push(tk);
					} else if (!rightside) {
						if (validForthName(tk)&&validExportName(tk)) params.push(tk);
					}
				}
			}
		}
		tk=this.nextToken();
	}
	if (resultcount<0) resultcount=0;
	const resultsType=Array(resultcount).fill().map(it=>Var.i32);
	if (!params.length && paracount) { //沒有對參數命名，但有指定個數，產生paramater 數字型參數，並自動推到stack
		params=Array(paracount).fill().map((i,idx)=>'$'+idx);
	}
	//console.log('paren',this.tib.slice(from,this.ntib), params, locals,resultcount);
	return [params,locals,resultsType];
}