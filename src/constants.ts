export const Var ={ i32:127, i64:126, f32:125, f64:124, anyfunc:112, func:96, none:64 }
export const ExternalKind ={function :0,table :1,memory:2,global:3}
export const sectionCode = {TYPE:1,IMPORT:2,FUNCTION:3,TABLE:4,MEMORY:5,GLOBAL:6,EXPORT:7,START:8,ELEMENT:9,CODE:10,DATA:11}
export type bytecode=number;
export type bytecodes=bytecode[];
export const START='_start';
export const splitInstruction=str=>str.split(/[\r\n ]*,[\r\n ]*/).map(it=>it.trim()).filter(it=>it.trim());

