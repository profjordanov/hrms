$(document).ready(function () {
    $('#linkListEmployees').click(listEmployees);
    $('#buttonCreateEmployee').click(createEmployee);
    $('#buttonEditEmployee').click(editEmployee);
    $('#linkCreateEmployee').click(showCreateEmployeeView);
});

function showCreateEmployeeView(event) {
    event.preventDefault();
    $('#formCreateEmployee').trigger('reset');
    showView('viewCreateEmployee');
}

function listEmployees(event) {
    if (event != undefined) {
        event.preventDefault();
    }

    $('#Employees').empty();
    showView('viewEmployees');

    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Employees",
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
                    .append('<th>Title</th><th>Author</th>', '<th>Description</th><th>Actions</th>'));

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
                        $('<td>').text(Employee.author),
                        $('<td>').text(Employee.description),
                        $('<td>').append(links)));
        }
    }
}

function createEmployee() {
    let EmployeeData = {
        title: $('#formCreateEmployee input[name=title]').val(),
        author: $('#formCreateEmployee input[name=author]').val(),
        description: $('#formCreateEmployee textarea[name=descr]').val()
    };

    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Employees",
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
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Employees/" + Employee._id,
        headers: getKinveyUserAuthHeaders(),
        success: loadEmployeeForEditSuccess,
        error: handleAjaxError
    });

    function loadEmployeeForEditSuccess(Employee) {
        $('#formEditEmployee input[name=id]').val(Employee._id);
        $('#formEditEmployee input[name=title]').val(Employee.title);
        $('#formEditEmployee input[name=author]').val(Employee.author);
        $('#formEditEmployee textarea[name=descr]').val(Employee.description);

        showView('viewEditEmployee');
    }
}

function editEmployee() {
    let EmployeeData = {
        title: $('#formEditEmployee input[name=title]').val(),
        author: $('#formEditEmployee input[name=author]').val(),
        description: $('#formEditEmployee textarea[name=descr]').val()
    };

    $.ajax({
        method: "PUT",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Employees/" + $('#formEditEmployee input[name=id]').val(),
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
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/Employees/" + Employee._id,
        headers: getKinveyUserAuthHeaders(),
        success: deleteEmployeeSuccess,
        error: handleAjaxError
    });

    function deleteEmployeeSuccess(response) {
        listEmployees();
        showInfo('Employee deleted.');
    }
}