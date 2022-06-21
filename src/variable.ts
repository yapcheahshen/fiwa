//取用參數及區域/全域變數，
//$0 ,$1  取 不帶名的參數。(是否禁止賦值？)
//區域變數及帶名參數，用名字直接取值。  
//賦值前面加  = ，如  =a  ，將變數 a 設為 tos 。 =a
// ==a //兩個等於表示設完值，還留在stack 上
// =+a    就像 c 的  x += 1   ，   1 =+x 
// =+=a   =+a 之後，新值留在堆疊
//全域變數名字前要帶$，只能在 colon 定義及賦值
// 7 = $A  定義並直接賦值，這是一個常數
// $B     只定義的話，就是一個變數，清零

import {Instructions} from './instructions.ts'
export function doVar(tk:string): boolean {
    let assignment = false ,additive=false;tee=false;
    if (!Instructions[tk] && tk[0] === '=') { //變數賦值
      assignment = true;
      tk = tk.slice(1);
      if (tk[0]==='+') {
      	  additive=true;
      	  tk=tk.slice(1)
      }
      if (tk[0]==='=') {
      	  tee=true;
      	  tk = tk.slice(1);
      }
    }
    let paramIndex = -1;
    let localIndex = -1;
    if (tk[0]=='$' && parseInt(tk.slice(1)).toString()==tk.slice(1)) {
    	paramIndex=parseInt(tk.slice(1));
    } else {
	    paramIndex=this.defining().params.indexOf(tk);
	    if (paramIndex==-1) localIndex=this.defining().locals.indexOf(tk);
    }

    if (~paramIndex || ~localIndex) { //是參數或區域變數？
      let idx = paramIndex;
      if (~localIndex) {
        idx = this.defining().params.length + localIndex; //local vars 的index要加上 params count
      }
      if (assignment) { //變數賦值, tee 是wasm 特有的，可省很多 dup
      	if(plus) {
      		this.colonWriter.get_local(idx);
      		this.colonWriter.add();
      	}
        (tee?this.colonWriter.tee_local:this.colonWriter.set_local)(idx);
      } else {
        this.colonWriter.get_local(idx);
      }
      return true;
    }
    return false;
  }
export function doGlobal(){

}