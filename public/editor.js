currentLang = 'C++';
running = false;

/* +++++ init() at the end of file +++++ */
function init() {
    initEditor(currentLang);
}

function initEditor(lang) {
    if (lang == null)
        return console.log('Invalid lang !');
    let language = formatLanguage(lang);

    require.config({ paths: { 'vs': './public/lib/monaco-editor/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        window.editor = monaco.editor.create(document.getElementById('container'), {
            value: baseCode[lang].join('\n'),
            language: language,
            automaticLayout: true,
            // fontFamily: '"Source-Code-Pro", "Courier New", monospace',
            fontSize: 16
        });
        initTheme();
        // $( "#container" ).resizable({
        //     minWidth: 350,
        //     maxWidth: $(window).width() / 1.666
        // });
    });
}

function initTheme() {
    monaco.editor.defineTheme('myTheme', {
        base: 'vs',
        inherit: true,
        rules: [
            { background: '#151619' },
            { token: '', foreground: '#61AFEF' },
            { token: 'delimiter', foreground: '#C3C3C3' },
            { token: 'number', foreground: '#CC9765' },
            { token: 'keyword', foreground: '#E06C75' },
            { token: 'string', foreground: '#90B973' },
            { token: 'comment', foreground: '#7F848E' },
        ],
        colors: {
            'editor.foreground': '#151619',
            'editor.background': '#151619',
            'editorCursor.foreground': '#528BFF',
            'editor.lineHighlightBackground': '#30333D',
            'editorLineNumber.foreground': '#495062',
            'editor.selectionBackground': '#88000030',
            'editor.inactiveSelectionBackground': '#88000015'
        }
    });
    monaco.editor.setTheme('myTheme');
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
        '\tprint("Hello")'
    ],
    'C': [
        '#include <stdio.h>',
        '#include <stddef.h>',
        '\nint main() {',
        '\n\tputs("Hello");',
        '\treturn 0;',
        '}\n'
    ],
    'C++': [
        '#include <iostream>',
        'using namespace std;',
        '\nint main() {',
        '\n\tcout << "Hello";',
        '\treturn 0;',
        '}\n'
    ],
    'Java': [
        'import java.io.*;',
        'class Algorithm {',
        '\tpublic static void main(String[] args) {\n\t',
        '\t}',
        '}'
    ]
};

/* +++++ Editor init +++++ */
init();
