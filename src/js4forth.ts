export const ztype = function(pos:number){
	if (!this._mem) return ;
	const buffer=new Uint8Array(this._mem.buffer.slice(pos,256)); //max string length
	const str=(new TextDecoder('utf-8')).decode(buffer).replace(/\0+$/,' ').trim();
	this.onLog( str );
}