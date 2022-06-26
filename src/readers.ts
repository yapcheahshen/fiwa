import {decodeUInt,decodeInt} from './utils.ts'
export const typeReader=(buf,at)=>{
	const [numOfType,c]= decodeUInt(buf,at);
	at+=c;
	const typeInfos=[];
	for (let i=0;i<numOfType;i++) {
		at++;
		const [numOfParamters,c]=decodeUInt(buf,at);
		at+=c; //skip var.func
		const param_types=[],result_types=[];
		for (let j=0;j<numOfParamters;j++) {
			param_types.push(buf[at]);
			at++;
		}
		const [numOfResults,c2]=decodeUInt(buf,at);
		at+=c2;
		for (let j=0;j<numOfResults;j++) {
			result_types.push(buf[at]);
			at++;
		}
		typeInfos.push({numOfParamters,param_types,numOfResults,result_types});
	}
	return [at, typeInfos];
}

export const functionReader=(buf,at)=>{
	const info=[];
	const [numOfFunctions,c2]=decodeUInt(buf,at);
	at+=c2;
	for (let i=0;i<numOfFunctions;i++) {
		const [index,c]=decodeUInt(buf,at);
		info.push(index);
		at+=c;
	}
	return [at,info];
}