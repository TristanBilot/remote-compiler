/* Events related to the client side */

$('#submitBtn').click(() => {
    let code = getCode();
    submit(code, currentLang);
});

$('.option').click(function() {
    let selectedLang = $(".label", this).text();
    currentLang = $(".opt-val", this).text();
    updateEditor(selectedLang);
});

$(window).on('resize', function(){
    $('#app-cover').css('left', $('#right').width() / 2 - $('#app-cover').width() / 2)
                   .css('top', '20');
});

$(document).keydown(function(e) {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 82) {
        e.preventDefault();
        let code = getCode();
        submit(code, currentLang);
    }
});

$('.view-lines').keydown(function(e) {

    if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
        let code = getCode();
        submit(code, currentLang);
    }
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
                updateOutputTime(data.time);
                return updateClass(output, 'output_success');
            case "error":
                updateOutputTime('<i class="fas fa-exclamation-triangle"></i> Hmm, an error occured.');
                return updateClass(output, 'output_error');
            case "timeout":
                updateOutputTime('<i class="fas fa-bomb"></i> Too slow !');
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

function updateOutputTime(time) {
    let outputTime = $('#outputTime');
    outputTime.html(time);
}
