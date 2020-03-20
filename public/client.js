/* Events related to the client side */

$('#submitBtn').click(() => {
    let code = getCode();
    let lang = $('#lang').val();

    submit(code, lang);
});

$('#lang').on("change", function() {
    let selectedLang = $(this).find(":selected").val();
    updateEditor(selectedLang);
});

$(window).on('resize', function(){
    $('#app-cover').css('left', $('#right').width() / 2 - $('#app-cover').width() / 2)
                   .css('top', '20');
});

function submit(code, lang) {
    $.post( "compilecode", { code: code, lang: lang } )
    .done((data) => {
        const noDataError = "A server error occured, please try again.";
        const invalidStateError = "Your code could not be validated.";
        let output = $('#output');

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

function updateClass(element, newClass) {
    element.removeClass();
    element.addClass('output ' + newClass);
}
