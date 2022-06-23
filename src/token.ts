export enum CharType {
	blank=0;
	ascii=1;  //might combine
	chinese=2; //might combine
	separator=3; //only one char allow for a token
}

export const charType:CharType=cp=>{
	if (cp<=0x20) return CharType.blank;
	if (cp<0x2000) {
		return CharType.ascii;
	} else if ((cp>=0x3400&&cp<=0x9fff) || (cp>=0xd800&&cp<=0xdcff )||(cp>=0xe000&&cp<=0xf9ff )) {
		return CharType.chinese;
	} else return CharType.separator;
}
