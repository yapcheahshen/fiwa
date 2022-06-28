import assert from "assert";
import {readFileSync} from 'fs'
export const test_modreader=async ({ModReader},tests,pass)=>{
	const {SectionCode} =ModReader;
	const test=async (src,val,msg)=>{
		tests++;
		const mod=new ModReader();
		const loopmod='AGFzbQEAAAABhoCAgAABYAF/AX8DgoCAgAABAASEgICAAAFwAAAFg4CAgAABAAEGgYCAgAAAB5GAgIAAAgZtZW1vcnkCAARmYWN0AAAKuoCAgAABtICAgAABAn8CQCAAQQFIDQBBACEBQQEhAgNAIAEgAmwhAiAAIAFBAWoiAUcNAAsgAkEFag8LQQYL';
		mod.loadFromBase64(loopmod);
		assert.equal(mod.sections.code[0].name,'fact');
		assert.equal(mod.sections.code[0].codesize,49);
		pass++;
	}
	const source_map_wasm=()=>{
		tests++;
		const content=readFileSync('./wat-wasm/change.wasm');//mappings.wasm');
		const mod=new ModReader();
		mod.loadFromBuffer(content);
		assert.equal(mod.sections.code[mod.sections.code.length-1].index,47);
		assert.equal(mod.sections.data.length,6);
		pass++;
	}
	try{
		test();
		source_map_wasm();
	} catch(e) {
		console.error(e)
	}
	
	return [tests,pass]
}