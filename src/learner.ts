/* Machine learning Chinese 
輸入符串
只看得懂基本指令。
數字前沒有 圭卦 指令，也視為文字。
看不懂的指令，一律視為𦀵，入料倉，棧上留下卦䄳。
如果下一個還是看不懂，更新卦䄳，以免爆棧。
返回時，如果是一卦，打印這個字串。
一開始程式就就像鸚鵡一樣學舌。
用戶輸入什麼字，就回什麼字。

因為已知籌的笅，及指令的入出笅，靜態檢查是可行的。

一個集在一行內完成。
私籌不給名，公籌可命名 上頭顯示籌號。
依返回自動算出𫘏。未知䮶視為0進0出。
這樣就可以算出一行的入籌和出籌。

每一行只能定義一個䮶
凡

 */
import {Tokenizer} from './tokenizer.ts'
export class Learner {
 	constructor (){

 	}
 	run(buf:string){
        const lines=buf.split(/\r?\n/);
        let tokenizer=new Tokenizer();

        for (let i=0;i<lines.length;i++) {
            const tk=tokenizer.run(lines[i]);
            console.log(i,tk)
        }
 	}
 }