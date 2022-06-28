import {codeOfSym} from "./namer.ts";
export const SymbolType = {

	Unknown:0,
	Primitive:1,
	Inline:2,

	Num:10,
	Str:20,
	SmallStr:21,  //255bytes
	NormalStr:22, //64kb
	HugeStr:23 ,  //1mb

	Nums:30,      // an array holding numbers , max 16KB numbers
	HugeNums: 31, // an huge array hold big numbers, max

	Keys:40,      // length of each string is fixed to 256 bytes.
	Strs:41,      // packing counted string.

//Simple Map 
	NumNums:51,
	NumStrings:52,
	KeyNums:53,
	KeyString:54
}

export const symbolType=(tk:string)=>{
	const code=codeOfSym(tk);
	if (code>0) {
		if (code>=0xe0&&code<=0xef) {
			return SymbolType.Inline;
		} else {
			return SymbolType.Primitive;
		}
	} else {
		return SymbolType.Unknown;
	}
}