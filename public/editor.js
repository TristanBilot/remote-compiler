
/* +++++ Editor init +++++ */
init()

const init = () => {
    let lang = "python";
    initEditor(lang);
}

const initEditor = (lang) => {
    if (lang == null)
        return console.log('Invalid lang !');

    require.config({ paths: { 'vs': './public/lib/monaco-editor/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        window.editor = monaco.editor.create(document.getElementById('container'), {
            value: baseCode[lang].join('\n'),
            language: lang
        });
    });
}

const updateEditor = (lang) => {
    let language = lang.charAt(0).toLowerCase() + lang.substring(1);
    if (lang === "C++")
        language = "cpp";
    let code = baseCode[lang].join('\n');

    window.editor.setValue(code);
    monaco.editor.setModelLanguage(window.editor.getModel(), language);
}

const getCode = () => {
    return window.editor.getValue();
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
