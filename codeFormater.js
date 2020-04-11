const Exercise = require('./database/model/Exercise');
'use strict';

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
                    code += ('\n' + 'int main() {\n')
                    for (const [key, value] of Object.entries(ex[0]['tests'])) {
                        params = (typeof key === "string") ? key : key.join(',');
                        code += ('\tassert(' + funcName + '(' + params + ') == ' + value + ');\n');
                    }
                    code += '\treturn 0;\n}';
                    closure(code);
                default: console.log("Error on code formatter.");
                }
        });
    } catch (err) {
        console.log('fail' + err);
    }
}
