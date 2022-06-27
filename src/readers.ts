import {Mnemonic} from './namer.ts'
import {ExternalKind} from './constants.ts'
export const readType=(reader:byteReader,sz:number)=>{
	const numOfType=reader.readUint();
	const typeInfos=[];
	for (let i=0;i<numOfType;i++) {
		const func=reader.readByte();
		const numOfParamters=reader.readUint();
		const param_types=[],result_types=[];
		for (let j=0;j<numOfParamters;j++) param_types.push(reader.readByte());
		const numOfResults=reader.readUint();
		for (let j=0;j<numOfResults;j++) result_types.push(reader.readByte());
		typeInfos.push({numOfParamters,param_types,numOfResults,result_types});
	}
	return typeInfos;
}
export const readFunction=(reader:byteReader,sz:number)=>{
	const info=[];
	const numOfFunction=reader.readUint();
	for (let i=0;i<numOfFunction;i++) {
		const index=reader.readUint();
		info.push(index);
	}
	return info;
}
export const readTable=(reader:byteReader,sz:number)=>{
	const numOfTable=reader.readUint();
	const out=[];
	for (let i=0;i<numOfTable;i++) {
		const reftype=reader.readByte();
		const limit=reader.readByte();
		out.push({limit,reftype});
	}
	return out;
}
export const readMemory=(reader:byteReader,sz:number)=>{
	const numOfMemory=reader.readUint();
	const out=[];
	for (let i=0;i<numOfMemory;i++) {
		const index=reader.readByte();
		const limit=reader.readByte();
		out.push({limit,index});
	}
	return out;
}
export const readImport=(reader:byteReader,sz:number)=>{
	const numOfImport=reader.readUint();
	const out=[];
	for (let i=0;i<numOfImport;i++) {
		const mod=reader.readCountedString();
		const name=reader.readCountedString();
		const kind=reader.readByte();
		let index=0,a,b,c;
		if (kind===ExternalKind.memory) {
			const limit =reader.readByte();
			const min=reader.readUint();
			const max=limit?reader.readUint():min;
			out.push({mod,name,kind,index,min,max});
		} else if (kind===ExternalKind.global){
			const type=reader.readUint();
			const mutable=reader.readUint();
			out.push({mod,name,kind,mutable,type});
		} else if (kind===ExternalKind.function) {
			const typeindex=reader.readUint();
			out.push({mod,name,kind,typeindex});
		} else if (kind===ExternalKind.table){
			const type=reader.readUint();
			const limit=reader.readUint();
			const min=reader.readUint();
			const max=limit?reader.readUint():min;
			out.push({mod,name,kind,type,min,max});
		}
	}
	return out;
}
export const readExport=(reader:byteReader,sz:number)=>{
	const numOfExport=reader.readUint();
	const out=[];
	for (let i=0;i<numOfExport;i++) {
		const name=reader.readCountedString();
		const kind=reader.readByte();
		const funcidx=reader.readUint();
		//,tableidx,memidx,globalidx
		out.push({name,kind,funcidx});
	}
	return out;
}
export const readGlobal=(reader:byteReader,sz:number)=>{
	const numOfGlobal=reader.readUint();
	const out=[];
	// console.log('global count',numOfGlobal)
	for (let i=0;i<numOfGlobal;i++) {
		const type=reader.readByte();
		const mutable=reader.readByte();
		const expr=[];
		let b=reader.readByte();
		while (!reader.atEnd() && b!==Mnemonic.end) {
			expr.push(b);
			b=reader.readByte();
		}
		expr.push(b);
		out.push({type,expr,mutable});
	}
	return out;
}
export const readCode=(reader:byteReader,sz:number)=>{
	const numOfFunction=reader.readUint();
	const out=[];
	for (let i=0;i<numOfFunction;i++) {
		const size=reader.readUint();
		const start=reader.skip(0);
		const locallen=reader.readUint();
		const locals=[];
		for (let j=0;j<locallen;j++) {
			const typecount=reader.readByte();//always 1
			const type=reader.readByte();
			for (let k=0;k<typecount;k++) locals.push(type);
		}
		const codesize=size - (reader.skip(0)-start);
		const code=reader.readBytes(codesize);
		reader.seek(start+size);
		out.push({index:i,name:'', type:null,locals, codesize:code.length});
	}
	return out;
}
export const readData=(reader:byteReader,sz:number)=>{
	const start=reader.skip();
	const segmentcount=reader.readUint();
	const segments=[];
	let offset=0;
	for (let i=0;i<segmentcount;i++) {
		const id=reader.readByte();
		if (id==0) {
			const expr=reader.readByte();			
			const offset=reader.readUint();
			const terminator=reader.readByte();
			const len=reader.readUint();
			segments.push({offset, len , at:reader.skip(0)});
			reader.skip(len)
		} else {
			throw 'data id !==0'
		}
	}
	return segments;
}
export const readDataCount=(reader:byteReader,sz:number)=>{
	const start=reader.skip();
	const count=reader.readUint();
	for (let i=0;i<count;i++) {
		
	}
	return {start,count};
}
export const readStart=(reader:byteReader,sz:number)=>{
	const idx=reader.readUint();
	return {idx};
}
export const readElement=(reader:byteReader,sz:number)=>{
	// throw "not implment yet"
	const numOfElement=reader.readUint();
	return {count:numOfElement}
}