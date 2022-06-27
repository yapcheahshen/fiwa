import {WasmHeader,SectionCode,SectionName,ExternalKind} from './constants.ts';
import {decodeUInt,decodeInt} from './utils.ts';
import {ByteReader} from './bytereader.ts';
import {readType,readFunction,readTable,readMemory,readCode,readData,readDataCount,
	readGlobal,readImport,readExport,readStart,readElement} from './readers.ts';

const Readers={
	[SectionCode.TYPE]:readType,
	[SectionCode.FUNCTION]:readFunction,
	[SectionCode.TABLE]:readTable,
	[SectionCode.MEMORY]:readMemory,
	[SectionCode.IMPORT]:readImport,
	[SectionCode.EXPORT]:readExport,
	[SectionCode.GLOBAL]:readGlobal,
	[SectionCode.CODE]:readCode,
	[SectionCode.DATA]:readData,
	[SectionCode.START]:readStart,
	[SectionCode.ELEMENT]:readElement,
	[SectionCode.DATACOUNT]:readDataCount,
}
interface iIModReader {
	private reader:byteReader;
	private arr:Uint8Array;
	public importfunction:number;
	sections:[];
}
export class ModReader {
	constructor(){
		this.arr=[];
		this.sections={};
		this.importcount=0;
	}
	resolveFunction(){
		const exportcodes=this.sections.export;
		const codes=this.sections.code;
		this.importcount=this.sections.import?this.sections.import.filter(it=>it.kind==ExternalKind.function).length:0;
		for (let i=0;i<exportcodes.length;i++) {
			const {funcidx,name,kind}=exportcodes[i];
			if (kind==ExternalKind.function) {
				codes[funcidx-this.importcount].name=name;
			}
		}
		for (let i=0;i<codes.length;i++) {
			codes[i].type = this.sections.type[this.sections.function[i]];
			codes[i].index+=this.importcount; //adjust index
		}
	}
	readSections(tryread=false){
		const R=this.reader;
		while ( !R.atEnd() ) {
			const sectiontype=R.readByte();
			const size=R.readUint();
			const start=R.skip(0);
			const section=SectionName[sectiontype];

			const sectionReader=Readers[sectiontype];
			if (sectionReader) {
				let info=null;
				if (tryread) {
					info={offset:R.skip(0), size}
				} else {
					// console.log('reading',section)
					info=sectionReader(R,size);
				}
				this.sections[section]=info;					
			} else {
				console.log('no writer for ',section,sectiontype,'skip',size);
			}
			R.seek(start+size)
		}
		this.resolveFunction();
	}
	loadFromBuffer(buf:Uint8Array,  tryread=false){
		this.reader=new ByteReader(buf);
		const header=this.reader.readBytes(8);
		if (header.join('')!==WasmHeader.join('')) {
			throw "not a valid module";
		}
		this.readSections(tryread);
	} 
	loadFromBase64(str:string,  tryread=false){
		const mod=atob(str)
		const buf=Uint8Array.from(mod,c=>c.charCodeAt(0));
		this.loadFromBuffer(buf,  tryread)
	}
}

export {SectionCode};