export function  doLit(tk:string): void {
  	if (tk[0]=='"') { //a string literal, 
  		let s=tk.slice(1);
  		if (s[s.length-1]=='"') s=s.slice(0,s.length-1);
  		this.colonWriter.i32_const(this.here);
  		this.here= this.moduleWriter.addString(this.here, s) ;
  	} else if (parseInt(tk).toString() == tk) { //十進位數
    	this.colonWriter.i32_const(parseInt(tk));
    } else if (
    	tk.slice(0, 2) == "0x" && "0x" + parseInt(tk, 16).toString(16) == tk) { //十六進位數
    	this.colonWriter.i32_const(parseInt(tk, 16));
    } else {
    	if (tk !== "_start") { //因為 js 會自動進入 _start ，不能重覆叫它
        	this.colonWriter.call(tk); //token作為函式名，在codegen::resolveFunctionNames 會回填位址
      	} else {
            throw "cannot call _start in forth program";
        }
    }
}
