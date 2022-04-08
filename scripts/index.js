const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_SJcKkYT79";
const kinveyAppSecret = "7d76fdb3d2954e3ab205577a664c07a9";
const kinveyAppAuthHeaders = {
    "Authorization": "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret)
};

function startApp() {
    showHideMenuLinks();
    showView('viewHome');
}

var handleAjaxError = function (response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0) {
        errorMsg = "Cannot connect due to network error.";
    }
    if (response.responseJSON && response.responseJSON.description) {
        errorMsg = response.responseJSON.description;
    }

    showError(errorMsg);
}

var getKinveyUserAuthHeaders = function () {
    return {
        "Authorization": "Kinvey " + sessionStorage.getItem('authToken')
    };
}

var showInfo = function (message) {
    $('#infoBox').text(message);
    $('#infoBox').show();
    setTimeout(function () {
        $('#infoBox').fadeOut();
    }, 3000);
}

var showError = function (errorMsg) {
    $('#errorBox').text("Error: " + errorMsg);
    $('#errorBox').show();
}

$(document).ready(function () {
    $('#infoBox, #errorBox').click(function () {
        $(this).fadeOut();
    });

    $(document).on({
        ajaxStart: function () {
            $('#loadingBox').show();
        },
        ajaxStop: function () {
            $('#loadingBox').hide();
        }
    });
});