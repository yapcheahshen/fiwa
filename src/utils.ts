import {Var,Inst } from './constants.ts';
export const encUInt = (value:number) => { //encode unsigned LEB128
    //if (value < 0 || value !== Math.floor(value)) debugger;
    const output = [];
    while (true) {
        const next_val = value % 128;
        value = Math.floor(value / 128);
        if (value > 0) {
            output.push(128 + next_val);
        } else {
            output.push(next_val);
            break;
        }
    }
    return output;
};
export const encUIntString = (str:string)=>Array.from(new TextEncoder().encode(str,'utf8'));
export const encInt = (value:number)=> { //encode signed LEB128
    //if (value !== Math.floor(value)) debugger;
    const output = [];
    const is_neg = value < 0;
    if (is_neg) value = -value - 1;
    while (true) {
        const next_val = value % 128;
        value = Math.floor(value / 128);
        if (value > 0 || next_val >= 64) {
            if (is_neg) output.push(~next_val & 255); else output.push(128 + next_val);
        } else {
            if (is_neg) output.push(~next_val & 127); else output.push(next_val);
            break;
        }
    }
    return output;
}
export const eqFuncTypes = function(type_data) {
    return function(el) {
        if (el.length != type_data.length) return false;
        for (let i = 0; i < el.length; ++i) {
            if (el[i] != type_data[i]) return false;
        }
        return true;
    }
}
export const parseNumber=str=>{
    let n=parseInt(str);
    if (!str) return [0,0];
    if (n.toString(10)==str) {

    } else if (str.slice(0,2)=='0x'&&parseInt(str.slice(2)).toString(16)==str.slice(2)) 
        n=parseInt(str.slice(2),16);
    else if (parseFloat(str).toString()==str) n=Math.floor(parseFloat(str));
    
    if (!isNaN(n)) return [n,n>=2147483648?Inst.i64_const:Inst.i32_const];
    return [0,0];
}
//https://handwiki.org/wiki/LEB128

export const decodeUInt=(bytes,at)=>{
    let byt='',shift=0 , count=0, num=0;
    while (true) {
        count++;
        byt = bytes[at];at++;
        num |= (byt&0x7f) << shift;
        shift+=7;
        if (byt>>7 ===0 ) break;
    }
    return [num,count];
}
export const decodeInt=(bytes,at)=>{
    let byt='',shift=0,count=0,num=0;
    while (true) {
        count++;
        byt = bytes[at];
        at++;
        num += (byt&0x7f) * Math.pow(2,shift); //cannot use << shift, javascript only allow 31bits integer
        shift+=7;
        if (byt>>7 ===0 ) break;
    }
    if (byt&0x40) {//sign
          num +=  ~0*Math.pow(2,shift);
    }
    return [num,count];
}
export const validExportName=str=> str.match(/^[A-Z_][0-9A-Z_$]*$/i);
export const validForthName=(n:string)=>!(!n 
    || n.startsWith("_") || n.startsWith("=") || n.startsWith(":") || n.startsWith(";") 
    || n.endsWith(")") || n.endsWith('"'));
