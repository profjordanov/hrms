$(document).ready(function () {
    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
});

function showHideMenuLinks() {
    $('#linkHome').show();

    if (sessionStorage.getItem('authToken')) {
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkListEmployees').show();
        $('#linkCreateEmployee').show();
        $('#linkLogout').show();
    } else {
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkListEmployees').hide();
        $('#linkCreateEmployee').hide();
        $('#linkLogout').hide();
    }
}

function showView(viewName) {
    $('main > section').hide();
    $('#' + viewName).show();
}

function showHomeView(event) {
    event.preventDefault();
    showView('viewHome');
}

function showLoginView(event) {
    event.preventDefault();
    showView('viewLogin');
    $('#formLogin').trigger('reset');
}

function showRegisterView(event) {
    event.preventDefault();
    $('#formRegister').trigger('reset');
    showView('viewRegister');
}