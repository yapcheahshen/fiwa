const compiled='';
const clearLog=e=>document.querySelector("#log").innerHTML='';
const clearError=e=>document.querySelector("#error").innerHTML='　';
let logBuffer='';
const onLog=(str,flush)=> {
  if (flush) {
    const log=document.querySelector("#log");
    log.insertAdjacentHTML('afterbegin','<div>'+logBuffer+str+'</div>');
    if (log.childElementCount>10 ) log.removeChild(log.lastChild);
    logBuffer='';
  } else {
    logBuffer+=str;
  }
}
const onError=e=>document.querySelector("#error").innerHTML=e;
const showSymbols=syms=>document.querySelector("#symbols").innerHTML=Object.keys(syms);
const fiwa=new Fiwa({boot:[corewords,usercode],onError,onLog, exportMem:false});
let timer;
function compileMe(){
  if (!document.querySelector("#autocompile").checked)return;
  clearTimeout(timer);
  timer=setTimeout(async ()=>{   
     clearError();
     fiwasource=document.querySelector("#fiwasrc").value;
     const symbols=await fiwa.execute(fiwasource);  //返回exports
     symbols&&showSymbols(symbols);
  },250);
}

const bundle=()=>{
  var a = document.createElement("a");
  a.href = window.URL.createObjectURL(new Blob([fiwa.byteCodes]));
  a.download = "output.wasm";
  a.click();
}
const loadwasm=async ()=>{
  const pickerOpts = {types: [
      {
        description: 'Images',
        accept: {
          'binary/*': ['.wasm']
        }
      },
    ]}
  let [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const file=await fileHandle.getFile();
  const bytecode=new Uint8Array(await file.arrayBuffer());
  const symbols=await fiwa.instantiate(bytecode);
  symbols&&showSymbols(symbols)
}

compileMe();