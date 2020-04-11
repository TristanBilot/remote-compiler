currentLang = 'C++';
currentBaseCode = "";
running = false;
fetchExerciseBaseURL = "http://localhost:8080/exercises/fetchExercise/";

sessionStorage.setItem('exerciseId', '5e921cb1f81e42dbeec6545d');

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
            // value: currentBaseCode,
            language: language,
            automaticLayout: true,
            // fontFamily: '"Source-Code-Pro", "Courier New", monospace',
            fontSize: 16
        });
        initTheme();
        updateEditor(currentLang);
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
    $.get(fetchExerciseBaseURL + sessionStorage.getItem('exerciseId'), function( data ) {
        let language = formatLanguage(lang);
        currentBaseCode = formatBaseCode(lang, data[0]["code"][language]).join('\n');
        window.editor.setValue(currentBaseCode);
        monaco.editor.setModelLanguage(window.editor.getModel(), language);
    });
}

function getCode() {
    return window.editor.getValue();
}

/* Need to format the lang with good syntax (lowCase...) for editor */
function formatLanguage(lang) {
    let language = lang.charAt(0).toLowerCase() + lang.substring(1);
    if (lang === "C++")
        language = "cpp";
    if (lang === "Objective-C")
        language = "objective-c";
    return language;
}

function formatBaseCode(lang, functionProto) {
    switch (lang) {
        case 'Python':
            return [functionProto + ':', '\t'];
        case 'C':
            return ['#include <stddef.h>', '', functionProto + ' {', '', '}'];
        case 'C++':
            return ['#include <iostream>', 'using namespace std;', '', functionProto + ' {', '', '}'];
        case 'Java':
            return ['import java.io.*;', '', 'class Algorithm {', '\t' + 'static ' + functionProto + ' {', '', '\t}', '}'];
        case 'Swift':
            return ['#!/usr/bin/swift', '', functionProto + ' {', '', '}'];
        case 'Objective-C':
            return ['#import <Foundation/Foundation.h>', '', functionProto + ' {', '', '}']
        default:
            return "Invalid Language (formatBaseCode())";
    }
}
    // 'Python': [
    //     'class Algorithm:',
    //     '\tprint("Hello")'
    // ],
    // 'C': [
    //     '#include <stdio.h>',
    //     '#include <stddef.h>',
    //     '\nint main() {',
    //     '\n\tputs("Hello");',
    //     '\treturn 0;',
    //     '}\n'
    // ],
    // 'C++': [
    //     '#include <iostream>',
    //     'using namespace std;',
    //     '\nint main() {',
    //     '\n\tcout << "Hello";',
    //     '\treturn 0;',
    //     '}\n'
    // ],
    // 'Java': [
    //     'import java.io.*;',
    //     'class Algorithm {',
    //     '\tpublic static void main(String[] args) {\n',
    //     '\t\tSystem.out.println("Hello !");',
    //     '\t}',
    //     '}'
    // ],
    // 'Swift': [
    //     '#!/usr/bin/swift',
    //     '\nprint("Hello !")'
    // ],
    // 'Objective-C': [
    //     '#import <Foundation/Foundation.h>\n',
    //     'int main(int argc, const char * argv[]) {\n',
    //     '\t@autoreleasepool {',
    //     '\t\tprintf("Hello !");',
    //     '\t}',
    //     '\treturn 0;',
    //     '}'
    // ]
// };

/* +++++ Editor init +++++ */
init();
