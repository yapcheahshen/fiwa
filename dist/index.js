(() => {
  // src/utils.ts
  var encUInt = (value) => {
    const output = [];
    while (true) {
      const next_val = value % 128;
      value = Math.floor(value / 128);
      if (value > 0) {
        output.push(128 + next_val);
      } else {
        output.push(next_val);
        break;
      }
    }
    return output;
  };
  var encUIntString = (str) => Array.from(new TextEncoder().encode(str, "utf8"));
  var encInt = (value) => {
    const output = [];
    const is_neg = value < 0;
    if (is_neg)
      value = -value - 1;
    while (true) {
      const next_val = value % 128;
      value = Math.floor(value / 128);
      if (value > 0 || next_val >= 64) {
        if (is_neg)
          output.push(~next_val & 255);
        else
          output.push(128 + next_val);
      } else {
        if (is_neg)
          output.push(~next_val & 127);
        else
          output.push(next_val);
        break;
      }
    }
    return output;
  };
  var eqFuncTypes = function(type_data) {
    return function(el) {
      if (el.length != type_data.length)
        return false;
      for (let i = 0; i < el.length; ++i) {
        if (el[i] != type_data[i])
          return false;
      }
      return true;
    };
  };
  var validExportName = (str) => str.match(/^[$A-Z_][0-9A-Z_$]*$/i);

  // src/writers.ts
  var Writer = class {
    write() {
    }
  };
  var FunctionWriter = class extends Writer {
    constructor(type) {
      super();
      this.type = type;
    }
    write() {
      return encUInt(this.type);
    }
  };
  var TypeWriter = class extends Writer {
    constructor(param_types, result_types) {
      super();
      this._param_types = param_types ? param_types : [];
      this._result_types = result_types ? result_types : [];
    }
    write() {
      const out = [];
      out.push(96 /* func */);
      out.push(...encUInt(this._param_types.length), ...this._param_types);
      out.push(...encUInt(this._result_types.length), ...this._result_types);
      return out;
    }
  };
  var ExportWriter = class extends Writer {
    constructor(field, kind, index = 0) {
      super();
      this._field = field;
      this._index = index;
      this._kind = kind;
      this.name = "";
    }
    setName(name) {
      this.name = name;
    }
    write() {
      const out = [];
      const encoded_field_bytes = encUIntString(this._field);
      out.push(...encUInt(encoded_field_bytes.length), ...encoded_field_bytes);
      out.push(this._kind, ...encUInt(this._index));
      return out;
    }
  };
  var ImportWriter = class extends Writer {
    constructor(mod, field, kind) {
      super();
      this._mod = mod;
      this._field = field;
      this._kind = kind;
      this.type = [];
      this.typeIndex = 0;
      this.name = "";
    }
    setName(name) {
      this.name = name;
    }
    setType(type) {
      this.type = type;
    }
    write() {
      const output = [];
      const module_bytes = encUIntString(this._mod);
      const field_bytes = encUIntString(this._field);
      output.push(...encUInt(module_bytes.length), ...module_bytes);
      output.push(...encUInt(field_bytes.length), ...field_bytes);
      output.push(this._kind, ...encUInt(this.typeIndex));
      return output;
    }
  };
  var GlobalWriter = class extends Writer {
    constructor(type, mutable, val) {
      super();
      this.type = type;
      this._mutable = mutable;
      this.val = val;
    }
    write() {
      const out = [];
      out.push(this.type);
      out.push(this._mutable ? 1 : 0);
      const instruction = [65 /* i32_const */, ...encUInt(this.val), 11 /* end */];
      out.push(...instruction);
      return out;
    }
  };
  var DataWriter = class extends Writer {
    constructor(offset, data) {
      super();
      this.offset = offset;
      this.data = data;
    }
    write() {
      const out = [];
      out.push(0);
      const instruction = [65 /* i32_const */, ...encUInt(this.offset), 11 /* end */];
      out.push(...instruction);
      out.push(...encUInt(this.data.length), ...this.data);
      return out;
    }
  };

  // src/codewriter.ts
  var CodeWriter = class extends Writer {
    constructor(local_types) {
      super();
      this._localTypes = local_types ? local_types : [];
      this._code = [];
      this._functionLinks = [];
      this.name = "";
      this.type = [];
    }
    setName(name) {
      this.name = name;
    }
    setType(type) {
      this.type = type;
    }
    write() {
      const out = [];
      out.push(...encUInt(this._localTypes.length));
      this._localTypes.forEach((localtype) => out.push(1, localtype));
      out.push(...this._code);
      return [...encUInt(out.length), ...out];
    }
    unreachable() {
      this._code.push(0 /* unreachable */);
    }
    nop() {
      this._code.push(1 /* nop */);
    }
    block(r_t) {
      this._code.push(2 /* block */, r_t || 127 /* i32 */);
    }
    loop(r_t) {
      this._code.push(3 /* loop */, r_t || 127 /* i32 */);
    }
    if(r_t) {
      this._code.push(4 /* if */, r_t || 127 /* i32 */);
    }
    else() {
      this._code.push(5 /* else */);
    }
    end() {
      this._code.push(11 /* end */);
    }
    br(depth) {
      this._code.push(12 /* br */, depth);
    }
    br_if(depth) {
      this._code.push(13 /* br_if */, depth);
    }
    ret() {
      this._code.push(15 /* return */);
    }
    call(name) {
      if (typeof name === "number") {
        this._code.push(16 /* call */, ...encUInt(name));
      } else {
        this._code.push(16 /* call */);
        this._functionLinks.push({ location: this._code.length, name });
      }
    }
    drop() {
      this._code.push(26 /* drop */);
    }
    select() {
      this._code.push(27 /* select */);
    }
    get_local(i) {
      this._code.push(32 /* get_local */, ...encUInt(i));
    }
    set_local(i) {
      this._code.push(33 /* set_local */, ...encUInt(i));
    }
    tee_local(i) {
      this._code.push(34 /* tee_local */, ...encUInt(i));
    }
    i32_load(offset, align) {
      this._code.push(40 /* i32_load */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_load(offset, align) {
      this._code.push(41 /* i64_load */, ...encUInt(align || 0), ...encUInt(offset));
    }
    f32_load(offset, align) {
      this._code.push(42 /* f32_load */, ...encUInt(align || 0), ...encUInt(offset));
    }
    f64_load(offset, align) {
      this._code.push(43 /* f64_load */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i32_load8_s(offset, align) {
      this._code.push(44 /* i32_load8_s */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i32_load8_u(offset, align) {
      this._code.push(45 /* i32_load8_u */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i32_load16_s(offset, align) {
      this._code.push(46 /* i32_load16_s */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i32_load16_u(offset, align) {
      this._code.push(47 /* i32_load16_u */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_load8_s(offset, align) {
      this._code.push(48 /* i64_load8_s */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_load8_u(offset, align) {
      this._code.push(49 /* i64_load8_u */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_load16_s(offset, align) {
      this._code.push(50 /* i64_load16_s */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_load16_u(offset, align) {
      this._code.push(51 /* i64_load16_u */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_load32_s(offset, align) {
      this._code.push(52 /* i64_load32_s */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_load32_u(offset, align) {
      this._code.push(53 /* i64_load32_u */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i32_store(offset, align) {
      this._code.push(54 /* i32_store */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_store(offset, align) {
      this._code.push(55 /* i64_store */, ...encUInt(align || 0), ...encUInt(offset));
    }
    f32_store(offset, align) {
      this._code.push(56 /* f32_store */, ...encUInt(align || 0), ...encUInt(offset));
    }
    f64_store(offset, align) {
      this._code.push(57 /* f64_store */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i32_store8(offset, align) {
      this._code.push(58 /* i32_store8 */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i32_store16(offset, align) {
      this._code.push(59 /* i32_store16 */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_store8(offset, align) {
      this._code.push(60 /* i64_store8 */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_store16(offset, align) {
      this._code.push(61 /* i64_store16 */, ...encUInt(align || 0), ...encUInt(offset));
    }
    i64_store32(offset, align) {
      this._code.push(62 /* i64_store32 */, ...encUInt(align || 0), ...encUInt(offset));
    }
    memory_size() {
      this._code.push(63 /* memory_size */, 0);
    }
    memory_grow() {
      this._code.push(64 /* memory_grow */, 0);
    }
    i32_const(v) {
      this._code.push(65 /* i32_const */, ...encInt(v));
    }
    i64_const(v) {
      this._code.push(66 /* i64_const */, ...encInt(v));
    }
    i32_eqz() {
      this._code.push(69 /* i32_eqz */);
    }
    i32_eq() {
      this._code.push(70 /* i32_eq */);
    }
    i32_ne() {
      this._code.push(71 /* i32_ne */);
    }
    i32_add() {
      this._code.push(106 /* i32_add */);
    }
    i32_sub() {
      this._code.push(107 /* i32_sub */);
    }
    i32_mul() {
      this._code.push(108 /* i32_mul */);
    }
    i32_div_s() {
      this._code.push(109 /* i32_div_s */);
    }
    i32_and() {
      this._code.push(113 /* i32_and */);
    }
    i32_or() {
      this._code.push(114 /* i32_or */);
    }
    i32_xor() {
      this._code.push(115 /* i32_xor */);
    }
    i32_shr_s() {
      this._code.push(117 /* i32_shr_s */);
    }
    i32_shr_u() {
      this._code.push(118 /* i32_shr_u */);
    }
    i32_shl() {
      this._code.push(116 /* i32_shl */);
    }
    i32_lt_s() {
      this._code.push(72 /* i32_lt_s */);
    }
    i32_gt_s() {
      this._code.push(74 /* i32_gt_s */);
    }
    i32_le_s() {
      this._code.push(76 /* i32_le_s */);
    }
    i32_ge_s() {
      this._code.push(78 /* i32_ge_s */);
    }
  };

  // src/codegen.ts
  var ModuleWriter = class {
    constructor(opts) {
      this._types = [];
      this._imports = [];
      this._functions = [];
      this._exports = [];
      this._codes = [];
      this._globals = [];
      this._datum = [];
      this._memory = opts.memory > 1 ? [[1, 1, opts.memory]] : [[0, 1]];
    }
    exportExtra() {
      const exportWriter = new ExportWriter("_mem", 2 /* memory */);
      this._exports.push(exportWriter);
    }
    gen({ exportMem: boolean = false, datasize: number }) {
      const output = [];
      this.resolveFunctionNames();
      const wasm_header = [0, 97, 115, 109, 1, 0, 0, 0];
      output.push(...wasm_header);
      this.writeSection(output, 1 /* TYPE */, this._types);
      this.writeSection(output, 2 /* IMPORT */, this._imports);
      this.writeSection(output, 3 /* FUNCTION */, this._functions);
      this.writeSection(output, 5 /* MEMORY */, this._memory);
      this.writeSection(output, 7 /* EXPORT */, this._exports);
      this.writeSection(output, 10 /* CODE */, this._codes);
      this.writeSection(output, 6 /* GLOBAL */, this._globals);
      this.writeSection(output, 11 /* DATA */, this._datum);
      return new Uint8Array(output);
    }
    exportFunction(name, exportname) {
      exportname = exportname || name;
      if (!validExportName(exportname))
        throw "invalid export name " + exportname;
      const exportWriter = new ExportWriter(exportname, 0 /* function */);
      exportWriter.setName(name);
      this._exports.push(exportWriter);
    }
    addData(offset, data) {
      const dataWriter = new DataWriter(offset, data);
      this._datum.push(dataWriter);
      return offset + data.length;
    }
    addString(offset, str) {
      const arr = encUIntString(str);
      arr.push(0);
      return this.addData(offset, arr);
    }
    addGlobal(name, val, mutable = true, type = 127 /* i32 */) {
      const globalWriter = new GlobalWriter(type, mutable, val);
      this._globals.push(globalWriter);
      const exportWriter = new ExportWriter(name, 3 /* global */);
      exportWriter.setName(name);
      this._exports.push(exportWriter);
    }
    addConstant(name, val, type = 127 /* i32 */) {
      this.addGlobal(name, val, false, type);
    }
    importFunction(name, signature, mod, exportname) {
      const importWriter = new ImportWriter(mod, exportname, 0 /* function */);
      importWriter.setName(name);
      importWriter.setType(signature);
      this._imports.push(importWriter);
    }
    addFunction(name, signature, codeWriter) {
      codeWriter.setName(name);
      codeWriter.setType(signature);
      this._codes.push(codeWriter);
    }
    writeSection(output, sectioncode, section) {
      if (section.length == 0)
        return;
      output.push(sectioncode);
      const sizeloc = output.length;
      output.push(...encUInt(section.length));
      section.forEach((it) => {
        if (Array.isArray(it)) {
          output.push(...it);
        } else {
          output.push(...it.write());
        }
      });
      output.splice(sizeloc, 0, ...encUInt(output.length - sizeloc));
    }
    clearSymbols(symbols) {
      symbols.forEach((obj) => {
        if (obj.name)
          obj.name = "";
        if (obj.type)
          obj.type = [];
      });
    }
    resolveFunctionNames() {
      const funcTypes = [];
      const funcTypesOffset = this._types.length;
      const funcNames = [];
      const funcNamesOffset = this._functions.length;
      this._imports.forEach(({ name, type }) => {
        if (name) {
          if (funcNames.findIndex((el) => el.name === name) === -1)
            funcNames.push({ name, funcType: type });
          else
            throw 'Repeated function "' + name + '".';
        }
      });
      this._codes.forEach(({ name, type }) => {
        if (name) {
          if (funcNames.findIndex((el) => el.name === name) === -1)
            funcNames.push({ name, funcType: type });
          else
            throw 'Repeated function "' + name + '".';
        }
      });
      funcNames.forEach((el) => {
        if (funcTypes.findIndex(eqFuncTypes(el.funcType)) === -1)
          funcTypes.push(el.funcType);
      });
      this._types.push(...funcTypes);
      const _functions = this._functions;
      this._codes.forEach(({ type }) => {
        if (type) {
          const typeIndex = funcTypes.findIndex(eqFuncTypes(type)) + funcTypesOffset;
          if (typeIndex === -1)
            throw "Weird assembler bug.";
          const functionWriter = new FunctionWriter(typeIndex);
          _functions.push(functionWriter);
        }
      });
      this._imports.forEach((obj) => {
        if (obj.type) {
          const typeIndex = funcTypes.findIndex(eqFuncTypes(obj.type)) + funcTypesOffset;
          if (typeIndex === -1)
            throw "Weird assembler bug.";
          obj.typeIndex = typeIndex;
        }
      });
      this._codes.forEach((obj) => {
        const functionLinks = obj._functionLinks;
        functionLinks.sort((a, b) => b.location - a.location);
        functionLinks.forEach((functionLink) => {
          const funcIndex = funcNames.findIndex((el) => el.name === functionLink.name) + funcNamesOffset;
          if (funcIndex === -1)
            throw 'Undeclared function "' + functionLink.name + '".';
          obj._code.splice(functionLink.location, 0, ...encUInt(funcIndex));
        });
      });
      this._exports.forEach((obj) => {
        if (obj.name) {
          const funcIndex = funcNames.findIndex((el) => el.name === obj.name) + funcNamesOffset;
          if (funcIndex === -1)
            throw 'Undeclared function "' + obj.name + '".';
          obj._index = funcIndex;
        }
      });
      this.clearSymbols(this._exports);
      this.clearSymbols(this._imports);
      this.clearSymbols(this._codes);
    }
  };
  var one_one = new TypeWriter([127 /* i32 */], [127 /* i32 */]).write();
  var makeSignature = (count, result = 1) => {
    return new TypeWriter(Array(count).fill().map(() => 127 /* i32 */), Array(result).fill().map(() => 127 /* i32 */)).write();
  };

  // src/tokenizer.ts
  var QSTRING_REGEX_G = /"((?:\\.|.)*?)"/g;
  var QUOTE_PREFIX = "";
  var PARENTHESIS_REGEX_G = /\(((?:\\.|.)*?)\)/g;
  var PARENTHESIS_PREFIX = "";
  var replacePat = (buf, pat, prefix) => {
    const quotes = [];
    const newbuf = buf.replace(pat, (_m, m1) => {
      quotes.push(m1);
      return prefix + (quotes.length - 1);
    });
    return [newbuf, quotes];
  };
  var tokenize = (buf) => {
    buf = buf.replace(/\\[^\n]+/g, "");
    const [buf2, quotes] = replacePat(buf, QSTRING_REGEX_G, QUOTE_PREFIX);
    const [buf3, parenthesis] = replacePat(buf2, PARENTHESIS_REGEX_G, PARENTHESIS_PREFIX);
    const tokens = buf3.split(/[\r\n ]+/);
    return tokens.map((tk) => {
      if (tk[0] == QUOTE_PREFIX)
        return '"' + quotes[parseInt(tk.slice(1))] + '"';
      if (tk[0] == PARENTHESIS_PREFIX)
        return "(" + parenthesis[parseInt(tk.slice(1))] + ")";
      return tk.trim();
    }).filter((it) => !!it);
  };

  // src/parser.ts
  var parseParenthesis = (par) => {
    let params = [];
    let locals = [];
    let resultCount = 0;
    par = par.slice(1, par.length - 1);
    const items = par.split(/\-+/);
    if (items.length == 1)
      items.push("0");
    if (items.length == 2) {
      params = items[0].split(/ +/).filter((it) => !!it);
      const paramcount = parseInt(params[0]);
      if (params.length == 1 && paramcount.toString() == params[0]) {
        params = Array(paramcount).fill().map((it, idx) => "$" + idx);
      }
      locals = items[1].split(/[\r\n ]+/).filter((it) => !!it);
      locals.forEach((l) => resultCount = parseInt(l) ? parseInt(l) : resultCount);
      locals = locals.filter((it) => !(parseInt(it).toString() == it));
      const unique = [];
      for (let i = 0; i < locals.length; i++) {
        if (unique.indexOf(locals[i]) == -1)
          unique.push(locals[i]);
      }
      locals = unique;
    } else {
      throw "wrong parathesis format " + par;
    }
    const resultsType = new Array(resultCount);
    resultsType.fill(127 /* i32 */);
    return [params, locals, resultsType];
  };

  // src/instructions.ts
  var Instructions = {
    "drop": "drop",
    "nop": "nop",
    "if": "if",
    "else": "else",
    "then": "end",
    "=": "i32_eq",
    "=0": "i32_eqz",
    "!=": "i32_ne",
    "+": "i32_add",
    "-": "i32_sub",
    "/": "i32_div_s",
    "*": "i32_mul",
    "<": "i32_lt_s",
    ">": "i32_gt_s",
    "<=": "i32_le_s",
    ">=": "i32_ge_s",
    "and": "i32_and",
    "or": "i32_or",
    "xor": "i32_xor",
    "ret": "ret",
    "@": "i32_load",
    "c@": "i32_load8_u",
    "i32_store": "i32_store",
    "i32_store8_u": "i32_store8_u"
  };

  // src/assembler.ts
  var invalidName = (n) => !n || n.startsWith("_") || n.startsWith("=") || n.endsWith(")") || n.endsWith('"');
  var makeType = (names) => names.map(() => 127 /* i32 */);
  var Assembler = class {
    constructor(opts) {
      this.imports = opts.imports || {};
      this.opts = opts || {};
      this.colonName = "";
      this.colonSignature = [];
      this.colonParams = [];
      this.colonLocals = [];
      this.here = 0;
      this.symbols = {};
      this._start = new CodeWriter([]);
      this.colonWriter = this._start;
      this.moduleWriter = new ModuleWriter({ memory: opts.memory || 1 });
    }
    colon(tk, nexttk) {
      let skip = 0;
      if (this.colonName) {
        throw this.colonName + "word not finished yet ";
      }
      this.colonName = tk.slice(1);
      if (this.symbols[this.colonName]) {
        throw "repeat defination " + this.colonName;
      }
      if (invalidName(this.colonName)) {
        throw "invalid name " + this.colonName;
      }
      this.symbols[this.colonName] = true;
      let params = [], locals = [], resultsType = [];
      if (nexttk[0] === "(") {
        [params, locals, resultsType] = parseParenthesis(nexttk);
        skip++;
      }
      this.colonParams = params;
      this.colonLocals = locals;
      this.colonWriter = new CodeWriter(makeType(locals));
      this.colonWriter.setName(this.colonName);
      this.colonSignature = new TypeWriter(makeType(params), resultsType).write();
      if (params.length && params.length == params.filter((it) => it[0] == "$").length) {
        for (let j = 0; j < params.length; j++) {
          this.colonWriter.get_local(j);
        }
      }
      return skip;
    }
    semicolon(tk) {
      const exportname = tk.slice(1);
      this.colonWriter.end();
      this.moduleWriter.addFunction(this.colonName, this.colonSignature, this.colonWriter);
      if (exportname) {
        this.moduleWriter.exportFunction(this.colonName, exportname);
      }
      this.colonName = "";
      this.colonWriter = this._start;
    }
    tryLit(tk) {
      if (tk[0] == '"') {
        let s = tk.slice(1);
        if (s[s.length - 1] == '"')
          s = s.slice(0, s.length - 1);
        this.colonWriter.i32_const(this.here);
        this.here = this.moduleWriter.addString(this.here, s);
      } else if (parseInt(tk).toString() == tk) {
        this.colonWriter.i32_const(parseInt(tk));
      } else if (tk.slice(0, 2) == "0x" && "0x" + parseInt(tk, 16).toString(16) == tk) {
        this.colonWriter.i32_const(parseInt(tk, 16));
      } else {
        if (tk !== "_start") {
          this.colonWriter.call(tk);
        } else {
          throw "cannot call _start in forth program";
        }
      }
    }
    tryVariables(tk) {
      let assignment = false;
      if (!Instructions[tk] && tk[0] == "=") {
        assignment = true;
        tk = tk.slice(1);
      }
      let paramIndex = -1;
      let localIndex = -1;
      if (tk[0] == "$" && parseInt(tk.slice(1)).toString() == tk.slice(1)) {
        paramIndex = parseInt(tk.slice(1));
      } else {
        paramIndex = this.colonParams.indexOf(tk);
        if (paramIndex == -1)
          localIndex = this.colonLocals.indexOf(tk);
      }
      if (~paramIndex || ~localIndex) {
        let idx = paramIndex;
        if (~localIndex) {
          idx = this.colonParams.length + localIndex;
        }
        if (assignment) {
          this.colonWriter.set_local(idx);
        } else {
          this.colonWriter.get_local(idx);
        }
        return true;
      }
      return false;
    }
    assemble(buf) {
      if (!buf.trim())
        return;
      const tokens = tokenize(buf);
      let i = 0;
      while (i < tokens.length) {
        let tk = tokens[i];
        if (tk[0] == ":") {
          i += this.colon(tk, tokens[i + 1]);
        } else if (tk[0] == ";") {
          this.semicolon(tk);
        } else if (tk[0] == "(") {
        } else {
          if (!this.tryVariables(tk)) {
            if (Instructions[tk]) {
              const inst = this.colonWriter[Instructions[tk]];
              if (inst)
                inst.apply(this.colonWriter);
            } else {
              this.tryLit(tk);
            }
          }
        }
        i++;
      }
    }
    codeGen() {
      for (let name in this.imports) {
        const signature = makeSignature(this.imports[name], 1);
        this.moduleWriter.importFunction(name, signature, "js", name);
      }
      this._start.end();
      this.moduleWriter.addFunction("_start", makeSignature(2, 1), this._start);
      this.moduleWriter.exportFunction("_start", "_start");
      return this.moduleWriter.gen({ datasize: this.here, ...this.opts });
    }
  };

  // index.ts
  var Fiwa = class {
    constructor({ boot, onError, onLog, memory, exportMem = false }) {
      this.boot = boot;
      if (typeof this.boot == "string")
        this.boot = [this.boot];
      this.onError = onError;
      this.onLog = onLog;
      this.imports = {};
      this._mem;
      this.exportMem = exportMem || false;
      this.byteCodes = [];
      this.memory = memory || 10;
    }
    async instantiate(byteCodes, arg, imports) {
      try {
        const wa = await WebAssembly.instantiate(byteCodes, this.imports);
        if (wa.instance.exports._start) {
          const ret = wa.instance.exports._start(arg);
          this.onLog && this.onLog(">" + ret);
        }
        this._mem = wa.instance.exports._mem;
        return wa.instance.exports;
      } catch (e) {
        this.setError("instantiate:" + e);
      }
    }
    async execute(buf, arg) {
      const A = new Assembler({ memory: this.memory, exportMem: this.exportMem, imports: {} });
      try {
        this.boot.forEach((bootcode) => A.assemble(bootcode));
        A.assemble(buf);
        const byteCodes = A.codeGen();
        const r = this.instantiate(byteCodes, arg, this.imports);
        this.byteCodes = byteCodes;
        return r;
      } catch (e) {
        this.setError("assemble:" + e);
      }
    }
    async bundle() {
    }
    setError(e) {
      this.onError && this.onError(e);
    }
  };
  var fiwa_default = Fiwa;
  if (typeof window !== "undefined")
    window.Fiwa = Fiwa;
})();
