/* Events related to the client side */

$('#submitBtn').click(() => {
    let code = getCode();
    submit(code, currentLang);
});

$('#submitBtn').hover(function() {
    if (running)
        $(this).css('cursor', 'default');
    else
        $(this).css('cursor', 'pointer');
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

function submit(code, lang) {
    activeLoadBtn();
    $.post( "compilecode", { 
        code: code, 
        lang: lang, 
        exerciseId: sessionStorage.getItem('exerciseId')
    })
    .done((data) => {
        activeRunBtn();
        const noDataError = "A server error occured, please try again.";
        const invalidStateError = "Your code could not be validated.";
        const basicError = 'Hmm, an error occured.';
        let output = $('#output');

        if (!data || !data.response || !data.state) {
            output.val(noDataError);
            output.addClass('output_error');
            return;
        }
        console.log(data);
        
        output.html((data.stdout ? data.stdout : ''));
        switch(data.state) {
            case "success":
                updateOutputTime(data.time);
                output.html((data.response ? data.response : ''));
                return updateClass(output, 'output_success');
            case "error":
                updateOutputTime('<i class="fas fa-exclamation-triangle"></i> ' + data.response ? data.response : basicError);
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

function fetch() {
    $.get(fetchExerciseBaseURL + sessionStorage.getItem('exerciseId'), function( data ) {
        let content = $('#exoContainer');
        let input  = $('#input');
        let expected  = $('#outputExpected');

        let firstTestKey = Object.keys(data[0]["tests"])[0];
        let firstTestValue = Object.values(data[0]["tests"])[0];
        
        content.html(data[0]["content"]);
        input.html(typeof firstTestKey === 'string' ? firstTestKey : firstTestKey.join(', '));
        expected.html(firstTestValue);
    });
}
fetch();

function updateClass(element, newClass) {
    element.removeClass();
    element.addClass('output ' + newClass);
}

function updateOutputTime(time) {
    let outputTime = $('#outputTime');
    outputTime.html(time);
}

function activeRunBtn() {
    running = false;
    $('#runIcon').css('display', 'block');
    $('#loadIcon').css('display', 'none');
    $('#submitBtn').css('opacity', 1);
}

function activeLoadBtn() {
    running = true;
    $('#runIcon').css('display', 'none');
    $('#loadIcon').css('display', 'block');
    $('#submitBtn').css('opacity', 0.6);
}

function loadScores() {
    for (let i = 0; i < 20; i++) {
        $('#scores').append('<li>[$i] Hello</li>'.replace('$i', i));
    }
}

loadScores();
