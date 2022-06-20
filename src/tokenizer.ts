/* 
預先處理 字串及 註解中可能有空格的情況，
將 "xxx"  (xx xx x)  抽出來，用「前綴n」 表達， 這樣用 很容易以空白換行 切分成 token*/
export const QSTRING_REGEX_G= /"((?:\\.|.)*?)"/g         
export const QUOTE_PREFIX='\u0010';
export const PARENTHESIS_REGEX_G= /\(((?:\\.|.)*?)\)/g
export const PARENTHESIS_PREFIX='\u0011';
const replacePat=(buf:string,pat:RegExp,prefix:string):[string, string[] ]=>{
	const quotes:string[]=[];
	const newbuf=buf.replace(pat,(_m,m1)=>{
	        quotes.push(m1);
	        return prefix+(quotes.length-1);
	});
	return [newbuf,quotes];
}
export const tokenize=(buf:string):string[]=>{
	buf=buf.replace(/\\[^\n]+/g,''); //remove comment
	const [buf2,quotes]=replacePat(buf , QSTRING_REGEX_G ,QUOTE_PREFIX );
	const [buf3,parenthesis]=replacePat(buf2, PARENTHESIS_REGEX_G,PARENTHESIS_PREFIX);
	const tokens=buf3.split(/[\r\n ]+/);
	return tokens.map(tk=>{
		if (tk[0]==QUOTE_PREFIX)       return '"'+quotes[ parseInt(tk.slice(1)) ]+'"';
		if (tk[0]==PARENTHESIS_PREFIX) return '('+parenthesis[ parseInt(tk.slice(1)) ]+')';
		return tk.trim();
	}).filter(it=>!!it);
}