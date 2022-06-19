/* 將 forth風格的參數宣告方式，產生 wasm 的 型別定義 
參數和區域變數的優先權比函數高。
*/
export const parseParenthesis=(par:string)=>{
	let locals=[];      //webassembly 並沒有區分 parameters 和 local variables, 都是用 get_local , set_local 處理
	let paramCount=0;   // 參數的個數
	let resultCount=0;   //返回值的個數
	par=par.slice(1,par.length-1);
	const items=par.split('--');
	if (items.length==1) items.push('0') ; //右邊沒指定，或是少了 -- ，即是無返回值  void
	if (items.length==2) {
		const params=items[0].split(/ +/).filter(it=>!!it);//params 重名未檢查(a a -- )不要這樣寫
		paramCount=params.length;

		locals=items[1].split(/[\r\n ]+/).filter(it=>!!it);
		locals.forEach(l=>resultCount=parseInt(l)?parseInt(l):resultCount );                 //右邊只要是數字，都視為返數個數，多於一個會被覆蓋
		locals=locals.filter( it=>  !(parseInt(it).toString()==it ));  //把數字去掉，留的的都是區域變數
		
		locals.unshift(...params); //parameter comes first , params and locals share same string array
		const unique=[];
		//很笨的去重法，因為不能排序
		for (let i=0;i<locals.length;i++) if (unique.indexOf(locals[i])==-1) unique.push(locals[i]);
		locals=unique;
	} else {
		throw "wrong parathesis format "+par
	}
	return [locals, paramCount, resultCount ];
}