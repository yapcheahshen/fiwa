export const decodeUInt=(bytes,at)=>{
	let byt='',shift=0 , count=0, num=0;
	while (true) {
	    count++;
	    byt = bytes[at];
	    num+= (byt&0x7f) << shift;
	    if (byt>>7 ===0 ) {
	    	break;
	    } else {
	    	shift+=7;
	    }
	}
	return [num,count];
}
/*
export const decodeInt=(bytes,at)=>{
	let bye='';
	while (true) {
	    byt = bytes[at];
	    num+= (byt&0x7f) << shift;
     	shift+=7;
	    if (byt>>7 ===0 ) {
	    	break;
	    }
	}
	if (byt&0x40) {
		num=
	}
    return num
}
*/