import {WasmHeader,SectionCode,SectionName} from './constants.ts'
import {decodeUInt,decodeInt} from './utils.ts'
import {typeReader,functionReader} from './readers.ts';

const Readers={
	[SectionCode.TYPE]:typeReader,
	[SectionCode.FUNCTION]:functionReader,
}
export class ModReader {
	constructor(){
		this.sections=[];
	}
	readSections(buf){
		let p=8;
		while (p<buf.length) {
			const sectiontype=buf.slice(p,p+1);
			const [sz,count]=decodeUInt(buf,p+1)
			p+=count+1;
			const reader=Readers[sectiontype];
			if (reader) {
				console.log('reading',sectiontype,SectionName[sectiontype],p,'sz',sz)
				const [adv, info]=reader(buf,p);
				console.log('adv',adv,'info',info)
				this.sections[sectiontype]=info;
				p=adv;
			} else {
				console.log('no writer for',SectionName[sectiontype]);
				break;
			}
		}
	}
	loadFromBuffer(buf:Uint8Array){
		if (buf.slice(0,8).join('')!==WasmHeader.join('')) {
			throw "not a valid module";
		}
		this.readSections(buf)
		// console.log(sectionCode,buf.slice(0,100))
	} 
	loadFromBase64(str:string){
		const mod=atob(str)
		const buf=Uint8Array.from(mod,c=>c.charCodeAt(0));
		this.loadFromBuffer(buf)
	}
}