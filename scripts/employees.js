$(document).ready(function () {
    $('#linkListEmployees').click(listEmployees);
    $('#buttonCreateEmployee').click(createEmployee);
    $('#buttonEditEmployee').click(editEmployee);
    $('#linkCreateEmployee').click(showCreateEmployeeView);
    $('#linkListDocuments').click(listDocuments);
    $('#buttonAddDoc').click(displayUploadDocument)
    $('#formDocument').submit(uploadDocument);
});

function showCreateEmployeeView(event) {
    event.preventDefault();
    $('#formCreateEmployee').trigger('reset');
    showView('viewCreateEmployee');
}

function displayUploadDocument(event) {
    event.preventDefault();
    $('#formDocument').trigger('reset');
    showView('addEmployeeDocument');
}

function listEmployees(event) {
    if (event != undefined) {
        event.preventDefault();
    }

    $('#Employees').empty();
    showView('viewEmployees');

    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/employees",
        headers: getKinveyUserAuthHeaders(),
        success: loadEmployeesSuccess,
        error: handleAjaxError
    });

    function loadEmployeesSuccess(Employees) {
        showInfo('Employees loaded.');
        if (Employees.length == 0) {
            $('#Employees').text('No Employees in the library.');
        } else {
            let EmployeesTable =
                $('<table>')
                .append($('<tr>')
                    .append('<th>Име</th><th>Дни отпуск</th>', '<th>Опции</th>'));

            for (let Employee of Employees) {
                appendEmployeeRow(Employee, EmployeesTable);
            }

            $('#Employees').append(EmployeesTable)
        }

        function appendEmployeeRow(Employee, EmployeesTable) {
            let links = [];
            if (Employee._acl.creator == sessionStorage['userId']) {
                let deleteLink = $('<a href="#">[Delete]</a>').click(function () {
                    deleteEmployee(Employee);
                });
                let editLink = $('<a href="#">[Edit]</a>').click(function () {
                    loadEmployeeForEdit(Employee);
                });

                links = [deleteLink, ' ', editLink];
            }

            EmployeesTable
                .append($('<tr>')
                    .append(
                        $('<td>').text(Employee.title),
                        $('<td>').text(Employee.daysOff),
                        $('<td>').append(links)));
        }
    }
}

function listDocuments(event) {
    if (event != undefined) {
        event.preventDefault();
    }

    showView('viewDocuments');

    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "blob/" + kinveyAppKey,
        headers: getKinveyUserAuthHeaders(),
        success: loadDocsSuccess,
        error: handleAjaxError
    });

    function loadDocsSuccess(documents) {
        showInfo('Documents loaded.');
        for(let document of documents){
            $('#documentsResults').append($('<div>').text(document._filename));
        }
    }
}

function uploadDocument(event) {
    event.preventDefault();

    let formData = new FormData(this);
    let fileInput = $('#file')[0];
    let file = fileInput.files[0];
    formData.append("File", file);
  
    $.ajax({
      method: "POST",
      url: kinveyBaseUrl + "blob/" + kinveyAppKey,
      headers: getKinveyUserAuthHeaders(),
      data: formData,
      success: function(data) {
          alert(data._filename);
          listDocuments();
      },
      error: handleAjaxError,
      cache: false,
      contentType: false,
      processData: false
    });
}

function createEmployee() {
    let EmployeeData = {
        title: $('#formCreateEmployee input[name=title]').val(),
        daysOff: 25
    };

    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/employees",
        headers: getKinveyUserAuthHeaders(),
        data: EmployeeData,
        success: createEmployeeSuccess,
        error: handleAjaxError
    });

    function createEmployeeSuccess(response) {
        listEmployees();
        showInfo('Employee created.');
    }
}

function loadEmployeeForEdit(Employee) {
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/employees/" + Employee._id,
        headers: getKinveyUserAuthHeaders(),
        success: loadEmployeeForEditSuccess,
        error: handleAjaxError
    });

    function loadEmployeeForEditSuccess(Employee) {
        $('#formEditEmployee input[name=id]').val(Employee._id);
        $('#formEditEmployee input[name=title]').val(Employee.title);
        $('#formEditEmployee input[name=daysOff]').val(Employee.daysOff);

        showView('viewEditEmployee');
    }
}

function editEmployee() {
    let EmployeeData = {
        title: $('#formEditEmployee input[name=title]').val(),
        daysOff: $('#formEditEmployee input[name=daysOff]').val()
    };

    $.ajax({
        method: "PUT",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/employees/" + $('#formEditEmployee input[name=id]').val(),
        headers: getKinveyUserAuthHeaders(),
        data: EmployeeData,
        success: editEmployeeSuccess,
        error: handleAjaxError
    });

    function editEmployeeSuccess(response) {
        listEmployees();
        showInfo('Employee edited.');
    }
}

function deleteEmployee(Employee) {
    $.ajax({
        method: "DELETE",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/employees/" + Employee._id,
        headers: getKinveyUserAuthHeaders(),
        success: deleteEmployeeSuccess,
        error: handleAjaxError
    });

    function deleteEmployeeSuccess(response) {
        listEmployees();
        showInfo('Employee deleted.');
    }
}