/* 將 forth風格的參數宣告方式，產生 wasm 的 型別定義
參數和區域變數的優先權比函數高。
https://coinexsmartchain.medium.com/wasm-introduction-part-1-binary-format-57895d851580
*/
import { Var } from "./constants.ts";
export const parseParenthesis = (par: string) => {
  let params = []; //傳入參數的型別，params 和 results 型別 構成函式的Signature
  let locals = []; //區域變數的型別，每個字都要個別存。
  let resultCount = 0; //返回值的個數
  par = par.slice(1, par.length - 1);
  const items = par.split(/\-+/); //分成左右兩部分
  if (items.length == 1) items.push("0"); //右邊沒指定，或是少了 -- ，即是無返回值  void
  if (items.length == 2) {
    params = items[0].split(/ +/).filter((it) => !!it); //params 重名未檢查(a a -- )不要這樣寫
    const paramcount=parseInt(params[0]);
    if (params.length==1 && paramcount.toString()==params[0]) { //只給參數個數，呼叫函式時自動推stack。
    	params=Array(paramcount).fill().map((it,idx)=>'$'+idx); // 用 $0 來取parameter 及 local
    } //如果參數有命名，則不會推到stack, 見assembler :: colon

    locals = items[1].split(/[\r\n ]+/).filter((it) => !!it);
    locals.forEach((l) =>
      resultCount = parseInt(l) ? parseInt(l) : resultCount
    ); //右邊只要是數字，都視為返數個數，多於一個會被覆蓋
    locals = locals.filter((it) => !(parseInt(it).toString() == it)); //把數字去掉，留的的都是區域變數
    const unique = [];
    //很笨的去重法，因為要保留順序和序號對應，不能按名字排
    for (let i = 0; i < locals.length; i++) {
      if (unique.indexOf(locals[i]) == -1) unique.push(locals[i]);
    }
    locals = unique;
  } else {
    throw "wrong parathesis format " + par;
  }
  const resultsType = new Array(resultCount); //轉為返回值的型別，
  resultsType.fill(Var.i32); //未來可能改

  return [params, locals, resultsType]; //參數名 , 區域變數名, 返回型別
};
