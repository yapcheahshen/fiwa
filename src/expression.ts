import {splitUTF32} from './utils.js';
import {isEmoji} from './emojisym.ts';
import {ordinalOfCodePoint} from './ordinal.ts'
import {codeOfSym} from './namer.ts';

export const parseExpression=(tk:string)=>{
	const codepoints=splitUTF32(tk);
	let arg=[], i=0;
	let pureinst='';
	while (i<codepoints.length) {
		const cp=codepoints[i];
		const ord=ordinalOfCodePoint(cp)
		if (ord[0]) {
			if (arg.length>1) throw 'more than two arg in expression '+tk;
			arg.unshift(String.fromCodePoint(cp));
		} else if (isEmoji(cp) ) { 
			if (arg.length>1) throw 'more than two arg in expression '+tk;
			arg.unshift(String.fromCodePoint(cp));
		} else if (cp==0x5f || cp==0x24) { //string or number literal
			pureinst+=String.fromCodePoint(cp);
			let a=String.fromCodePoint(codepoints[i++]);
			while (codepoints[i]>=0x30&&codepoints[i]<=0x39) {
				a+=String.fromCodePoint(codepoints[i++])
			}
			i--;
			arg.unshift(a)
		} else {
			pureinst+=String.fromCodePoint(codepoints[i]);
		}
		i++;
	}
	const code=codeOfSym(pureinst);
	return [code,...arg];
}