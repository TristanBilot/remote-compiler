
$('#submitBtn').click(() => {
    let code = $('#code').val()
    let lang = $('#lang').val()

    submit(code, lang)
});

const submit = (code, lang) => {
    $.post( "compilecode", { code: code, lang: lang } )
    .done((data) => {
        if (data.error)
            console.log("Error: " + data.error);
        else if (data.output)
            console.log("Output: " + data.output);
        else
            console.log("Impossible");
    })
}
