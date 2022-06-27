import {decodeUInt,decodeInt} from './utils.ts'
export class ByteReader {
	constructor( arr:Uint8Array) {
		this.arr=arr;
		this.pos=0;
	}
	seek(pos:number):void{
		this.pos=pos;
	}
	skip(bytecount:number):number{
		this.pos+=(bytecount||0);
		return this.pos;
	}
	readBytes(count:number):number[] {
		const sliced=this.arr.slice(this.pos,this.pos+count);
		this.pos+=count;
		return Array.from(sliced);
	}
	readByte():number{
		const b= this.arr[this.pos];
		this.pos++
		return b;
	}
	readCountedString():string{
		const len=this.readUint();
		const s=(new TextDecoder()).decode(this.arr.slice(this.pos,this.pos+len));
		this.pos+=len;
		return s;
	}
	readUint():number{
		const [n,count]=decodeUInt(this.arr,this.pos);
		this.pos+=count;
		return n;
	}
	readInt():number{
		const [n,count]=decodeInt(this.arr,this.pos);
		this.pos+=count;
		return n;
	}
	atEnd() {
		return this.pos>=this.arr.length;
	}
}