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
            console.log(lang);
            
            switch (lang) {
                case 'C++':
                case 'C':
                    if (lang === 'C')
                        code += '\n#include <assert.h>\n';
                    code += '\n' + 'int main() {\n';

                    firstTestKey = Object.keys(ex[0]["tests"])[0];
                    params = (typeof firstTestKey === "string") ? firstTestKey : firstTestKey.join(',');
                    code += 'printf(\"%d\\n\", ' + funcName + '(' + params + '));';
                    for (const [key, value] of Object.entries(ex[0]['tests'])) {
                        params = (typeof key === "string") ? key : key.join(',');
                        code += ('\tassert(' + funcName + '(' + params + ') == ' + value + ');\n');
                    }
                    code += '\treturn 0;\n}';
                    return closure(code);

                case 'Python':
                    for (const [key, value] of Object.entries(ex[0]['tests'])) {
                        params = (typeof key === "string") ? key : key.join(',');
                        code += ('\nassert ' + funcName + '(' + params + ') == ' + value);
                    }
                    return closure(code);

                case 'Java':
                    for (let i = code.length- 1; i >= 0; i--) {
                        if (code[i] === '}') { /* remove last } to add main in Algorithm class */
                            code = code.replaceAt(i, ' ');
                            break;
                        }
                    }
                    code += '\npublic static void main(String[] args) {\n';
                    for (const [key, value] of Object.entries(ex[0]['tests'])) {
                        params = (typeof key === "string") ? key : key.join(',');
                        code += ('\tassert ' + funcName + '(' + params + ') == ' + value + ';\n');
                    }
                    code += '\t}\n}';
                    return closure(code);

                case 'Swift':
                    firstTestKey = Object.keys(ex[0]["tests"])[0];
                    code += '\nprint(' + funcName + '(';
                    params = (typeof firstTestKey === "string") ? firstTestKey : firstTestKey.join(',');
                    code += params;
                    code += '))';
                    code += " assert(fib(7) == 13)";
                    // for (const [key, value] of Object.entries(ex[0]['tests'])) {
                    //     params = (typeof key === "string") ? key : key.join(',');
                    //     code += ('\nassert(' + funcName + '(' + params + ') == ' + value + ')');
                    // }

                    // for (const [key, value] of Object.entries(ex[0]['tests'])) {
                    //     if (!printed)
                    //         code += '\nprint(' + funcName + '(';
                    //     else
                    //         code += ('\nassert(' + funcName + '(');
                    //     for (let i = 0; i < paramNames.length; i++) {
                    //         code += paramNames[i] + ': ';
                    //         code += (typeof key === "string") ? key : key[i];
                    //         if (i != paramNames.length - 1)
                    //             code += ',';
                    //     }
                    //     if (!printed) {
                    //         code +=  '))';
                    //         printed = !printed;
                    //     }
                    //     else
                    //         code += ') == ' + value + ')';
                    // }
                    return closure(code);
                default: console.log("Error on code formatter.");
                }
        });
    } catch (err) {
        console.log('fail' + err);
    }
}
