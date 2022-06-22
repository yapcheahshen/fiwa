/*Assembler hosted by Browser 由瀏覽器提供的編譯環境 */
import Assembler from './assembler.ts'; //匯編器
import bindSys from './js4forth.ts';    //給 forth 調用的 js 函式
export class Fiwa {
	byteCodes: Uint8Array;
	constructor ({sources,onError,onLog,callbacks}) {
		this.sources=sources||[];
		if (typeof this.sources=='string') this.sources=[this.sources]; //可以提供多個
		this.assembler=null;
		this.onError=onError||console.error;
		this.onLog=onLog||console.log;
		this.callbacks=callbacks||{};
		this._mem = new WebAssembly.Memory({initial:1}); //從64KB 開始
		this.imports={	env:{_mem:this._mem }, js:bindSys(this) };
		this.exports={};
		this.byteCodes=[];
	}
	async instantiate(byteCodes,arg,imports) { //實例化一個wasm模塊，用以載入其他的wasm
		try {
		    const wa=await WebAssembly.instantiate(byteCodes,this.imports);
		    //到這裡虛擬機已成功啟動，DevTools可以看到還原為 Wasm-Text ，並可單步除錯
	    	const ret=wa.instance.exports._start(...arg);
	    	// this.onLog&&this.onLog('⏎'+ret, true);
	    	this.exports=wa.instance.exports;
		    return ret;
		} catch(e) {
			console.error(e);            //扔給DevTool 
			this.setError('runtime:'+e); //扔給Browser UI
		}
	}
	async execute(source,arg=[]){ //組譯並實例化，成功的話就可以bundle
		const A=this.assembler=new Assembler({_mem:this._mem, //雙方可視的memory 區
			callbacks:this.callbacks,
			imports:{ztype:[1,0],".":[1,0]}}) //讓wasm 呼叫的host 
		try{
			this.sources.forEach(src=>A.scan(src));
			A.scan(source);
			const byteCodes=A.genByteCode(); //到此目的碼成功產生，Devtools右鍵此變數可以檢視bytecode
			const r=this.instantiate(byteCodes, arg, this.imports );
			this.byteCodes=byteCodes; //update if successful
			return r;
		} catch(e){
			console.error(e)
			this.setError(e);  //編譯錯誤
		}
	}
	getAssemblerContext(){
		return this.assembler.getContext();
	}
	setError(e) {
		this.onError&&this.onError(e);
	}
}

if (typeof window!=='undefined') window.Fiwa=Fiwa;
