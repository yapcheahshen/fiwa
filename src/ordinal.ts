//export const OrdinalChar='⑴⒈①⓵⒜ⓐⒶ㊀㈠㍘㏠㋀䷀가'; //these can be use to represent code+number
export const isOrdinal=(cp:number):boolean=>!!ordinalOfCodePoint(cp)[0];
export const ordinalOfCodePoint=(cp:number)=>{
    if (cp>=0x2474&&cp<=0x2487) return [0x2474,cp-0x2474,20];// ⑴~20
    else if (cp>=0xac00&&cp<=0xd7a3) return [0xac00,cp-0xac00,11172];// 가~11171 
    else if (cp>=0x4dc0&&cp<=0x4dff) return [0x4dc0,cp-0x4dc0,64];// ䷀~64
    else if (cp>=0x2460&&cp<=0x2473) return [0x2460,cp-0x2460,20];// ①~20
    else if (cp>=0x2080&&cp<=0x2089) return [0x2080,cp-0x2080,20];// ₀~10
    //廢物利用 機種依存文字
    else if (cp>=0x322a&&cp<=0x3230) return [0x322a,cp-0x322a,20];// ㈪㈫ ~7
    else if (cp>=0x2488&&cp<=0x249b) return [0x2488,cp-0x2488,20];// ⒈~20
    else if (cp>=0x249c&&cp<=0x24b5) return [0x249c,cp-0x249c,26];// ⒜~26
    else if (cp>=0x24b6&&cp<=0x24cf) return [0x24b6,cp-0x24b6,26];// Ⓐ~26
    else if (cp>=0x24d0&&cp<=0x24e9) return [0x24d0,cp-0x24d0,26];// ⓐ~26    
    else if (cp>=0x3358&&cp<=0x336f) return [0x3358,cp-0x3358,23];// ㍘~23
    else if (cp>=0x33E0&&cp<=0x33FE) return [0x33E0,cp-0x33E0,31];// ㏠~31
    else if (cp>=0x32c0&&cp<=0x32cb) return [0x32c0,cp-0x32c0,12];// ㋀~12
    else if (cp>=0x3220&&cp<=0x3229) return [0x3220,cp-0x3220,10];// ㈠~10
    else if (cp>=0x3280&&cp<=0x3289) return [0x3280,cp-0x3280,10];// ㊀~10
    else if (cp>=0x24f5&&cp<=0x24fe) return [0x24f5,cp-0x24f5,10];// ⓵~10
    else if (cp>=0x32d0&&cp<=0x32fe) return [0x32d0,cp-0x32d0,10];// ㋐~46
    else if (cp>=0x3200&&cp<=0x321e) return [0x3200,cp-0x3200,31];// ㈀ 31
    else if (cp>=0x3260&&cp<=0x327e) return [0x3260,cp-0x3260,31];// ㉠ 31
    else if (cp>=0x3260&&cp<=0x327e) return [0x3260,cp-0x3260,31];// ㉠ 31
    
    //emoji, act as symbol
    return [0,0,0];
}
export const ordinalOf=(nc:string):[number,number,number]=>{
	const cp=nc.codePointAt(0);
    return ordinalOfCodePoint(cp);
}
