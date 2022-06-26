import assert from "assert";

export const test_modreader=async ({ModReader},tests,pass)=>{
	const test=async (src,val,msg)=>{
	}
	try{
		const mod=new ModReader();
		const loopmod='AGFzbQEAAAABhoCAgAABYAF/AX8DgoCAgAABAASEgICAAAFwAAAFg4CAgAABAAEGgYCAgAAAB5GAgIAAAgZtZW1vcnkCAARmYWN0AAAKuoCAgAABtICAgAABAn8CQCAAQQFIDQBBACEBQQEhAgNAIAEgAmwhAiAAIAFBAWoiAUcNAAsgAkEFag8LQQYL';
		mod.loadFromBase64(loopmod)
		// mod.loadFromBinary(bin);
	} catch(e) {
		console.error(e)
	}
	
	return [tests,pass]
}