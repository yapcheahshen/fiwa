export const encUInt = (value:number) => { //encode unsigned LEB128
    //if (value < 0 || value !== Math.floor(value)) debugger;
    var output = [];
    while (true) {
        var next_val = value % 128;
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
export const encUIntString = (str:string)=>Array.from(new TextEncoder().encode(str,'utf8'));
export const encInt = (value:number)=> { //encode signed LEB128
    //if (value !== Math.floor(value)) debugger;
    var output = [];
    var is_neg = value < 0;
    if (is_neg) value = -value - 1;
    while (true) {
        var next_val = value % 128;
        value = Math.floor(value / 128);
        if (value > 0 || next_val >= 64) {
            if (is_neg) output.push(~next_val & 255); else output.push(128 + next_val);
        } else {
            if (is_neg) output.push(~next_val & 127); else output.push(next_val);
            break;
        }
    }
    return output;
}
export const eqFuncTypes = function(type_data) {
    return function(el) {
        if (el.length != type_data.length) return false;
        for (let i = 0; i < el.length; ++i) {
            if (el[i] != type_data[i]) return false;
        }
        return true;
    }
};
