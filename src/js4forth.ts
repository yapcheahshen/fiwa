export const ztype = function(pos:number){
	if (!this._mem) return ;
	const buffer=new Uint8Array(this._mem.buffer.slice(pos,256)); //max string length
	const str=(new TextDecoder('utf-8')).decode(buffer).replace(/\0+$/,' ').trim();
	this.onLog( str );
}

export const dot = function (n:number) {
	this.onLog( ' '+n );
}
export const here = function() {
	return this.getAssemblerContext().here;
}

const words={
	"ztype":ztype,
	".":dot,
	"here":here,
	//",":comma,
	//"c.":ccomma,
}

export default function(fiwa){
	const out={};
	for (let name in words) {
		out[ name ] = words[name].bind(fiwa)
	}
	return out;
}