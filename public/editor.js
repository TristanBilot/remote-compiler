/* +++++ init() at the end of file +++++ */
function init() {
    let lang = "Python";
    initEditor(lang);
    $('#lang').val(lang);
}

function initEditor(lang) {
    if (lang == null)
        return console.log('Invalid lang !');
    let language = formatLanguage(lang);

    require.config({ paths: { 'vs': './public/lib/monaco-editor/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        window.editor = monaco.editor.create(document.getElementById('container'), {
            value: baseCode[lang].join('\n'),
            language: language
        });
    });
}

function updateEditor(lang) {
    let language = formatLanguage(lang);
    let code = baseCode[lang].join('\n');

    window.editor.setValue(code);
    monaco.editor.setModelLanguage(window.editor.getModel(), language);
}

function getCode() {
    return window.editor.getValue();
}

/* Need to format the lang with good syntax (lowCase...) for editor */
function formatLanguage(lang) {
    let language = lang.charAt(0).toLowerCase() + lang.substring(1);
    if (lang === "C++")
        language = "cpp";
    return language;
}

const baseCode = {
    'Python': [
        'class Algorithm:',
        '\t\n'
    ],
    'C': [
        '#include <stdio.h>',
        '#include <stddef.h>',
        '\nint main() {',
        '\n\treturn 0;',
        '}\n'
    ],
    'C++': [
        '#include <stdio.h>',
        '#include <stddef.h>',
        '\nint main() {',
        '\n\treturn 0;',
        '}\n'
    ],
    'Java': [
        'class Algorithm {',
        '\tpublic static void main(String[] args) {\n',
        '\t}',
        '}'
    ]
};

/* +++++ Editor init +++++ */
init();
