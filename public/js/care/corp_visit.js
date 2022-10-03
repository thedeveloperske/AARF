const add_issue = document.getElementById("add_issue");
const save = document.getElementById("save");
const header = $.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content"),
    },
});

$("#add_issue").click(function (e) {
    e.preventDefault();
    const data = $(this).attr("data-name");
    const dt = JSON.parse(data);
    appendRow(dt);
});

function appendRow(dt) {
    let userstr = "<option value=''>Select user</option>",
        issuestr = "<option value=''>Select Issue</option>";
    dt[0].forEach((element) => {
        let users =
            "<option value='" +
            element.user_name +
            "'>" +
            element.user_name +
            "</option>";
        userstr += users;
    });
    dt[1].forEach((element) => {
        let issues =
            "<option value='" +
            element.code +
            "'>" +
            element.corp_issue +
            "</option>";
        issuestr += issues;
    });
    let row = `
         <tr><td>        
        <select class="form-control" name='issue[]' class='issue' style='width:100%;'>${issuestr}</select> 
        </td><td> 
        <select class="form-control" name='assign_to[]' class='user' style='width:100%;'>${userstr}</select> 
        </td><td> 
        <input type='date' name='complete_by[]' style='width:100%;'> 
        </td><td> 
        <input type='date' name='completed_on[]' style='width:100%;'> 
        </td><td> 
        <button type='button' class='btn btn-danger remove'><i class='far fa-trash-alt'></i></button></td ></tr > `;

    $("#add_issue_tbl tbody").append(row);

    $(".remove").click(function () {
        $(this).closest("tr").remove();
    });
}

save.addEventListener("click", (e) => {
    header;
    let rowCount = $("#add_issue_tbl tbody tr").length;
    let form1 = $("#form1").serializeArray();
    let form2 = $("#form2").serializeArray();
    $.ajax({
        url: "/sendVisits",
        method: "POST",
        data: form1,
        success: function (result) {
            console.log(result)
             if (rowCount) {
                 $.ajax({
                     url: "/sendIssues",
                     method: "POST",
                     data: form2,
                     success: function (result) {
                         console.log(result);
                     },
                     error: function (error) {
                         if (error) {
                             console.log(error);
                         } else {
                             console.log("could not save Corp care");
                         }
                     },
                 });
             }   
        },
        error: function (error) {
            if (error) {
                console.log(error)
            } else {
                console.log("could not save corp visit")
            }
        },
    });

   
    // showalert(res, "success");

    e.preventDefault();
});

function showalert(message, alerttype) {
    $("#alert_placeholder").append(
        '<div id="alertdiv" class="alert alert-' +
            alerttype +
            '"><a class="close" data-dismiss="alert">×</a><span>' +
            message +
            "</span></div>"
    );

    setTimeout(function () {
        $("#alertdiv").remove();
    }, 5000);
}
