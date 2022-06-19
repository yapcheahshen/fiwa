(() => {
  // src/constants.ts
  var Inst = /* @__PURE__ */ ((Inst2) => {
    Inst2[Inst2["unreachable"] = 0] = "unreachable";
    Inst2[Inst2["nop"] = 1] = "nop";
    Inst2[Inst2["block"] = 2] = "block";
    Inst2[Inst2["loop"] = 3] = "loop";
    Inst2[Inst2["if"] = 4] = "if";
    Inst2[Inst2["else"] = 5] = "else";
    Inst2[Inst2["end"] = 11] = "end";
    Inst2[Inst2["br"] = 12] = "br";
    Inst2[Inst2["br_if"] = 13] = "br_if";
    Inst2[Inst2["br_table"] = 14] = "br_table";
    Inst2[Inst2["return"] = 15] = "return";
    Inst2[Inst2["call"] = 16] = "call";
    Inst2[Inst2["call_indirect"] = 17] = "call_indirect";
    Inst2[Inst2["drop"] = 26] = "drop";
    Inst2[Inst2["select"] = 27] = "select";
    Inst2[Inst2["get_local"] = 32] = "get_local";
    Inst2[Inst2["set_local"] = 33] = "set_local";
    Inst2[Inst2["tee_local"] = 34] = "tee_local";
    Inst2[Inst2["get_global"] = 35] = "get_global";
    Inst2[Inst2["set_global"] = 36] = "set_global";
    Inst2[Inst2["i32_load"] = 40] = "i32_load";
    Inst2[Inst2["i64_load"] = 41] = "i64_load";
    Inst2[Inst2["f32_load"] = 42] = "f32_load";
    Inst2[Inst2["f64_load"] = 43] = "f64_load";
    Inst2[Inst2["i32_load8_s"] = 44] = "i32_load8_s";
    Inst2[Inst2["i32_load8_u"] = 45] = "i32_load8_u";
    Inst2[Inst2["i32_load16_s"] = 46] = "i32_load16_s";
    Inst2[Inst2["i32_load16_u"] = 47] = "i32_load16_u";
    Inst2[Inst2["i64_load8_s"] = 48] = "i64_load8_s";
    Inst2[Inst2["i64_load8_u"] = 49] = "i64_load8_u";
    Inst2[Inst2["i64_load16_s"] = 50] = "i64_load16_s";
    Inst2[Inst2["i64_load16_u"] = 51] = "i64_load16_u";
    Inst2[Inst2["i64_load32_s"] = 52] = "i64_load32_s";
    Inst2[Inst2["i64_load32_u"] = 53] = "i64_load32_u";
    Inst2[Inst2["i32_store"] = 54] = "i32_store";
    Inst2[Inst2["i64_store"] = 55] = "i64_store";
    Inst2[Inst2["f32_store"] = 56] = "f32_store";
    Inst2[Inst2["f64_store"] = 57] = "f64_store";
    Inst2[Inst2["i32_store8"] = 58] = "i32_store8";
    Inst2[Inst2["i32_store16"] = 59] = "i32_store16";
    Inst2[Inst2["i64_store8"] = 60] = "i64_store8";
    Inst2[Inst2["i64_store16"] = 61] = "i64_store16";
    Inst2[Inst2["i64_store32"] = 62] = "i64_store32";
    Inst2[Inst2["memory_size"] = 63] = "memory_size";
    Inst2[Inst2["memory_grow"] = 64] = "memory_grow";
    Inst2[Inst2["i32_const"] = 65] = "i32_const";
    Inst2[Inst2["i64_const"] = 66] = "i64_const";
    Inst2[Inst2["f32_const"] = 67] = "f32_const";
    Inst2[Inst2["f64_const"] = 68] = "f64_const";
    Inst2[Inst2["i32_eqz"] = 69] = "i32_eqz";
    Inst2[Inst2["i32_eq"] = 70] = "i32_eq";
    Inst2[Inst2["i32_ne"] = 71] = "i32_ne";
    Inst2[Inst2["i32_lt_s"] = 72] = "i32_lt_s";
    Inst2[Inst2["i32_lt_u"] = 73] = "i32_lt_u";
    Inst2[Inst2["i32_gt_s"] = 74] = "i32_gt_s";
    Inst2[Inst2["i32_gt_u"] = 75] = "i32_gt_u";
    Inst2[Inst2["i32_le_s"] = 76] = "i32_le_s";
    Inst2[Inst2["i32_le_u"] = 77] = "i32_le_u";
    Inst2[Inst2["i32_ge_s"] = 78] = "i32_ge_s";
    Inst2[Inst2["i32_ge_u"] = 79] = "i32_ge_u";
    Inst2[Inst2["i32_add"] = 106] = "i32_add";
    Inst2[Inst2["i32_sub"] = 107] = "i32_sub";
    Inst2[Inst2["i32_mul"] = 108] = "i32_mul";
    Inst2[Inst2["i32_div_s"] = 109] = "i32_div_s";
    Inst2[Inst2["i32_and"] = 113] = "i32_and";
    Inst2[Inst2["i32_or"] = 114] = "i32_or";
    Inst2[Inst2["i32_xor"] = 115] = "i32_xor";
    Inst2[Inst2["i32_shl"] = 116] = "i32_shl";
    Inst2[Inst2["i32_shr_s"] = 117] = "i32_shr_s";
    Inst2[Inst2["i32_shr_u"] = 118] = "i32_shr_u";
    Inst2[Inst2["i32_rotl"] = 119] = "i32_rotl";
    Inst2[Inst2["i32_rotr"] = 120] = "i32_rotr";
    Inst2[Inst2["f32_abs"] = 139] = "f32_abs";
    Inst2[Inst2["f32_neg"] = 140] = "f32_neg";
    Inst2[Inst2["f32_ceil"] = 141] = "f32_ceil";
    Inst2[Inst2["f32_floor"] = 142] = "f32_floor";
    Inst2[Inst2["f32_trunc"] = 143] = "f32_trunc";
    Inst2[Inst2["f32_nearest"] = 144] = "f32_nearest";
    Inst2[Inst2["f32_sqrt"] = 145] = "f32_sqrt";
    return Inst2;
  })(Inst || {});

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

  // src/codewriter.ts
  var CodeWriter = class {
    constructor(local_types) {
      this._localTypes = local_types ? local_types : [];
      this._code = [];
      this._functionlinks = [];
    }
    setName(name) {
      this.name = name;
    }
    setType(type2) {
      this.type = type2;
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
      if (typeof idx_name === "number") {
        this._code.push(16 /* call */, ...encUInt(idx_name));
      } else {
        this._code.push(16 /* call */);
        this._functionlinks.push({ location: this._code.length, name });
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
      this._code.push(Inst.grow_memory, 0);
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

  // src/writers.ts
  var FunctionWriter = class {
    constructor(type2) {
      this.type = type2;
    }
    write() {
      return encUInt(this.type);
    }
  };
  var TypeWriter = class {
    constructor(param_types, result_types) {
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
  var ExportWriter = class {
    constructor(field, kind, index) {
      this._field = field;
      this._index = index;
      this._kind = kind;
    }
    setName(name) {
      this.name = name;
    }
    write() {
      const out = [];
      const encoded_field_bytes = encUIntString(this._field);
      out.push(...encUInt(encoded_field_bytes.length), ...encoded_field_bytes);
      out.push(this._kind);
      out.push(...encUInt(this._index));
      return out;
    }
  };
  var ImportWriter = class {
    constructor(mod, field, kind) {
      this._mod = mod;
      this._field = field;
      this._kind = kind;
    }
    setName(name) {
      this.name = name;
    }
    setType(type2) {
      this.type = type2;
    }
    write() {
      const output = [];
      const module_bytes = encUIntString(this._mod);
      const field_bytes = encUIntString(this._field);
      output.push(...encUInt(module_bytes.length), ...module_bytes);
      output.push(...encUInt(field_bytes.length), ...field_bytes);
      output.push(this._kind);
      output.push(...encUInt(this.type));
      return output;
    }
  };

  // src/codegen.ts
  var ModuleWriter = class {
    constructor() {
      this.importFunction = function(name, type2, mod, field) {
        const importWriter = new ImportWriter(mod, field, 0 /* function */);
        importWriter.setName(name);
        importWriter.setType(type2);
        this._imports.push(importWriter);
      };
      this.addFunction = function(name, type2, codeWriter) {
        codeWriter.setName(name);
        codeWriter.setType(type2);
        this._codes.push(codeWriter);
      };
      this._types = [];
      this._imports = [];
      this._functions = [];
      this._memory = [];
      this._exports = [];
      this._codes = [];
    }
    gen() {
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
      return new Uint8Array(output);
    }
    setMemory(memory) {
      this._memory = [memory];
    }
    exportFunction(name, field) {
      field = field || name;
      const exportWriter = new ExportWriter(field, 0 /* function */);
      exportWriter.setName(name);
      this._exports.push(exportWriter);
    }
    writeSection(output, sectioncode, section) {
      if (section.length == 0)
        return;
      output.push(sectioncode);
      const sizeloc = output.length;
      output.push(...encUInt(section.length));
      section.forEach((it) => output.push(...it.write ? it.write() : it));
      output.splice(sizeloc, 0, ...encUInt(output.length - sizeloc));
    }
    clearSymbols(symbols) {
      symbols.forEach((obj) => {
        if (obj.name)
          obj.name = void 0;
        if (obj.type)
          obj.type = void 0;
      });
    }
    resolveFunctionNames() {
      const funcTypes = [];
      const funcTypesOffset = this._types.length;
      const funcNames = [];
      const funcNamesOffset = this._functions.length;
      this._imports.forEach(({ name, type: type2 }) => {
        if (name) {
          if (funcNames.findIndex((el) => el.name === name) === -1)
            funcNames.push({ name, funcType: type2 });
          else
            throw 'Repeated function "' + name + '".';
        }
      });
      this._codes.forEach(({ name, type: type2 }) => {
        if (name) {
          if (funcNames.findIndex((el) => el.name === name) === -1)
            funcNames.push({ name, funcType: type2 });
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
      this._codes.forEach(({ type: type2 }) => {
        if (type2) {
          const typeIndex = funcTypes.findIndex(eqFuncTypes(type2)) + funcTypesOffset;
          if (typeIndex === -1)
            throw "Weird assembler bug.";
          const functionWriter = new FunctionWriter(typeIndex);
          _functions.push(functionWriter);
        }
      });
      this._imports.forEach((obj) => {
        if (type) {
          const typeIndex = funcTypes.findIndex(eqFuncTypes(type)) + funcTypesOffset;
          if (typeIndex === -1)
            throw "Weird assembler bug.";
          obj.type = typeIndex;
        }
      });
      this._codes.forEach((obj) => {
        const functionLinks = obj._functionlinks;
        functionLinks.sort((a, b) => b.location - a.location);
        functionLinks.forEach((functionLink2) => {
          const funcIndex = funcNames.findIndex((el) => el.name === functionLink2.name) + funcNamesOffset;
          if (funcIndex === -1)
            throw 'Undeclared function "' + functionLink2.name + '".';
          obj._code.splice(functionLink2.location, 0, ...encUInt(funcIndex));
        });
      });
      this._exports.forEach((obj) => {
        if (obj.name) {
          const funcIndex = funcNames.findIndex((el) => el.name === obj.name) + funcNamesOffset;
          if (funcIndex === -1)
            throw 'Undeclared function "' + functionLink.name + '".';
          obj._index = funcIndex;
        }
      });
      this.clearSymbols(this._exports);
      this.clearSymbols(this._imports);
      this.clearSymbols(this._codes);
    }
  };
  var one_one = new TypeWriter([127 /* i32 */], [127 /* i32 */]).write();

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
    const items = par.split("--");
    if (items.length == 1)
      items.push("0");
    if (items.length == 2) {
      params = items[0].split(/ +/).filter((it) => !!it);
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
    "ret": "ret"
  };

  // src/assembler.ts
  var invalidName = (n) => !n || n[0] === "_" || n.endsWith("!") || n.endsWith(")") || n.endsWith('"');
  var makeType = (names) => names.map(() => 127 /* i32 */);
  var Assembler = class {
    constructor() {
      this.colonName = "";
      this.colonSignature = [];
      this.colonParams = [];
      this.colonLocals = [];
      this.symbols = {};
      this._main = new CodeWriter();
      this.colonWriter = this._main;
      this.moduleWriter = new ModuleWriter();
    }
    assemble(buf) {
      if (!buf.trim())
        return;
      const tokens = tokenize(buf);
      let i = 0;
      while (i < tokens.length) {
        let tk = tokens[i];
        if (tk[0] == ":") {
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
          if (tokens[i + 1][0] === "(") {
            [params, locals, resultsType] = parseParenthesis(tokens[i + 1]);
            i++;
          }
          this.colonParams = params;
          this.colonLocals = locals;
          this.colonWriter = new CodeWriter(makeType(locals));
          this.colonSignature = new TypeWriter(makeType(params), resultsType).write();
          for (let j = 0; j < params.length; j++) {
            this.colonWriter.get_local(j);
          }
        } else if (tk[0] == ";") {
          const exportname = tk.slice(1);
          this.colonWriter.end();
          this.moduleWriter.addFunction(this.colonName, this.colonSignature, this.colonWriter);
          exportname && this.moduleWriter.exportFunction(this.colonName, exportname);
          this.colonName = "";
          this.colonWriter = this._main;
        } else if (tk[0] == "(") {
        } else {
          let assignment = false;
          if (tk[tk.length - 1] == "!") {
            assignment = true;
            tk = tk.slice(0, tk.length - 1);
          }
          const paramIndex = this.colonParams.indexOf(tk);
          const localIndex = this.colonLocals.indexOf(tk);
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
          } else if (Instructions[tk]) {
            const inst = this.colonWriter[Instructions[tk]];
            if (inst)
              inst.apply(this.colonWriter);
          } else {
            if (parseInt(tk).toString() == tk) {
              this.colonWriter.i32_const(parseInt(tk));
            } else if (tk.slice(0, 2) == "0x" && "0x" + parseInt(tk, 16).toString(16) == tk) {
              this.colonWriter.i32_const(parseInt(tk, 16));
            } else {
              if (tk !== "_main") {
                this.colonWriter.call(tk);
              } else {
                throw "cannot call _main in forth program";
              }
            }
          }
        }
        i++;
      }
    }
    codeGen() {
      this._main.end();
      this.moduleWriter.addFunction("_main", one_one, this._main);
      this.moduleWriter.exportFunction("_main", "main");
      return this.moduleWriter.gen();
    }
  };

  // index.ts
  var Fiwa = class {
    constructor({ boot, onError, onLog }) {
      this.boot = boot;
      if (typeof this.boot == "string")
        this.boot = [this.boot];
      this.onError = onError;
      this.onLog = onLog;
      this.imports = {};
    }
    async execute(buf, arg) {
      const A = new Assembler();
      try {
        this.boot.forEach((bootcode) => A.assemble(bootcode));
        A.assemble(buf);
        const byteCode = A.codeGen();
        const { instance } = await WebAssembly.instantiate(byteCode, this.imports);
        if (instance.exports.main) {
          const ret = instance.exports.main(arg);
          this.onLog && this.onLog(">" + ret);
        }
        return instance.exports;
      } catch (e) {
        this.setError(e);
      }
    }
    setError(e) {
      this.onError && this.onError(e);
    }
  };
  var fiwa_default = Fiwa;
  if (typeof window !== "undefined")
    window.Fiwa = Fiwa;
})();
