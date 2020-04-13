const Exercise = require('./database/model/Exercise');
'use strict';

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

exports.formatCode = async function(code, lang, exId, closure) {
    try {
        await Exercise.find({_id: exId})
        .then(function(ex) {
            let funcName = ex[0]['funcName'];
            var params = '';
            
            switch (lang) {
                case 'C++':
                case 'C':
                    if (lang === 'C')
                        code += '\n#include <assert.h>\n';
                    code += '\n' + 'int main() {\n';
                    code = appendPrintFunction(lang, code, ex);
                    for (const [key, value] of Object.entries(ex[0]['tests'])) {
                        params = (typeof key === "string") ? key : key.join(',');
                        code += ('\tassert(' + funcName + '(' + params + ') == ' + value + ');\n');
                    }
                    code += '\treturn 0;\n}';
                    return closure(code);

                case 'Python':
                    code = appendPrintFunction(lang, code, ex);
                    for (const [key, value] of Object.entries(ex[0]['tests'])) {
                        params = (typeof key === "string") ? key : key.join(',');
                        code += ('\nassert ' + funcName + '(' + params + ') == ' + value);
                    }
                    return closure(code);

                case 'Java':
                    for (let i = code.length- 1; i >= 0; i--)
                        if (code[i] === '}') /* remove last } to add main in Algorithm class */
                        {    code = code.replaceAt(i, ' '); break; }

                    code += '\npublic static void main(String[] args) {\n';
                    code = appendPrintFunction(lang, code, ex);
                    for (const [key, value] of Object.entries(ex[0]['tests'])) {
                        params = (typeof key === "string") ? key : key.join(',');
                        code += ('\if (' + funcName + '(' + params + ') != ' + value + ')\n');
                        code += ('\tthrow new RuntimeException();');
                    }
                    code += '\t}\n}';
                    return closure(code);

                case 'Swift':
                    code = appendPrintFunction(lang, code, ex);
                    for (const [key, value] of Object.entries(ex[0]['tests'])) {
                        params = (typeof key === "string") ? key : key.join(',');
                        code += ('\nassert(' + funcName + '(' + params + ') == ' + value + ')');
                    }
                    return closure(code);
                default: console.log("Error on code formatter.");
                }
        });
    } catch (err) {
        console.log('fail' + err);
    }
}


function appendPrintFunction(lang, code, ex) {
    let firstTestKey = Object.keys(ex[0]["tests"])[0];
    let funcName = ex[0]['funcName'];
    let params = (typeof firstTestKey === "string") ? firstTestKey : firstTestKey.join(',');
    switch (lang) {
        case 'C':
        case 'C++':
            return code + '\nprintf(\"%d\\n\", ' + funcName + '(' + params + '));\n';
        case 'Python':
        case 'Swift':
            return code + '\nprint(' + funcName + '(' + params + '))\n';
        case 'Java':
            return code + '\nSystem.out.println(' + funcName + '(' + params + '));\n';
    }
}
