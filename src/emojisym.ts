import {splitUTF32} from './utils.ts'
export const isEmojiSymbol=(cp:number)=>!!emojiSymbol(cp)[0];
export const isEmoji=(cp:number)=> cp>=0x1f000&&cp<=0x1ffff ;
export const tailEmoji=(symbol:string)=>{
    const tokens=splitUTF32(symbol);
    return isEmoji(tokens[tokens.length-1])?tokens[tokens.length-1]:'';
}
export const emojiSymbol=(cp:number)=>{
    if (cp>=0x1f400&&cp<=0x1f43c) return [0x1f400,cp-0x1f400,60];// animal object
    else if (cp>=0x1f980&&cp<=0x1f9ae) return [0x1f980,cp-0x1f980,46];// animal object2
    else if (cp>=0x1f344&&cp<=0x1f372) return [0x1f344,cp-0x1f344,46];// food 43
    else if (cp>=0x1f680&&cp<=0x1f69f) return [0x1f680,cp-0x1f680,32];// vehical object32
    return [0,0,0]	
	/* global
parameters     :
local variable :
global variable :
field name      (if object is missing, default to myself)
object name 🛺 🚕 🚌 🚄 🚅 🚚 🚛 ⛵ 🛳️ ⛴️  🚤 🚢 🛥️ ✈️ 🛩️ 🚁 🛰️ 

🌾米 
👨父
👩 母
🧑 
👶 兒
👦 子
👧 女
👴 公
👵 婆 


🌈 
🗺️ world
🧮 calculate

 ➡️  ⬅️ 
🔄  ↩️
🧱 block   🚪 ⚓
🐾
☁️ 💴
🌐 🌏亞 🌍歐非  🌎美
🔑 🗝️
🦍 🦧 🦄 🦌 🐫 🐪 🐘 🦏 🦛 🦘 
🐚 🐌
🦋 🐞 🕷️ 🕸️ 🦟 🦠
🐛 🐜 🐝 🦗 🦂
🦕 🦖 🐳 🐋 
魚類 🐟 🐠 🐬 🐡 🦈 🐙
兩棲 🐊 🐢 🦎  
大型
鳥類 🐦 🐧 🕊️ 🦅 🦆 🦢 🦉  🦃 🦩 🦚 🦜
🦇
🐣 

string name 
🦊 🐱  🦁  🦒 🐻 🐨 🦥 


      external parameters
🐀🐄🐅🐇🐉🐍🐎🐏🐒🐔🐕🐖  12 生宵  local variables , in any order you like 
🐭🐮🐯🐰🐲🐸🐴🐼🐵🐥🐶🐷   




🈶
🈚
🔁  loop
🔂  block
⏏️  br
🈁
🈂️
🔄 loop 
⛔
⁉️
❓
❔
🤔
💤
☝️
✌️
🤏
👌
✍️ write
👋
🤚
🤙
🙏
🖐️
🛡️
*/
}