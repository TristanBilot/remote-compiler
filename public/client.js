
$('#submitBtn').click(() => {
    let code = $('#code').val();
    let lang = $('#lang').val();

    submit(code, lang);
});

const submit = (code, lang) => {
    $.post( "compilecode", { code: code, lang: lang } )
    .done((data) => {
        const noDataError = "A server error occured, please try again.";
        const invalidStateError = "Your code could not be validated.";
        let output = $('#output');

        console.log(data.response);

        if (!data || !data.response || !data.state) {
            output.val(noDataError);
            output.addClass('output_error');
            return;
        }
        output.html(data.response);

        switch(data.state) {
            case "success":
                return updateClass(output, 'output_success');
            case "error":
                return updateClass(output, 'output_error');
            case "timeout":
                return updateClass(output, 'output_timeout');
            default:
                output.val(invalidStateError);
                return updateClass(output, 'output_timeout');
        }
    })
}

const updateClass = (element, newClass) => {
    element.removeClass();
    element.addClass('output ' + newClass);
}