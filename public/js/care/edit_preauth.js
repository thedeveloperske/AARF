const mem = document.getElementById("mem");
const preauth = document.getElementById("preauth");
const ward_edit = document.getElementById("ward_edit");
const diagnosis_edit = document.getElementById("diagnosis_edit");
const admit_days_edit = document.getElementById("admit_days_edit");
const limit_edit = document.getElementById("limit_edit");
const notes_edit = document.getElementById("notes_edit");
const reserve_edit = document.getElementById("reserve_edit");
const co_signee_edit = document.getElementById("co_signee_edit");
const form1 = document.getElementById("form1");
const form2 = document.getElementById("form2");
const header = $.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content"),
    },
});

form1.addEventListener("submit", (e) => {
    let counter = 1;
    let current_user = "";
    header;
    let data = { mem_no: mem.value, preauth_no: preauth.value };
    $.ajax({
        url: "/getPreauthData",
        method: "POST",
        data: data,
        success: function (result) {
            $("#editTbl").DataTable().clear();
            result.forEach((element) => {
                let md = [
                    "<tr><td>" +
                        counter +
                        "</td><td>" +
                        element.code +
                        "</td><td>" +
                        element.date_reported +
                        "</td><td>" +
                        element.member_no +
                        "</td><td>" +
                        element.member_name +
                        "</td><td>" +
                        element.authority_type +
                        "</td><td>" +
                        element.reserve +
                        "</td><td>" +
                        element.limit +
                        "</td><td>" +
                        element.authorized_by +
                        "</td><td>" +
                        element.date_authorized +
                        "</td><td>" +
                        element.anniv +
                        "</td><td>" +
                        element.provider +
                        "</td><td>" +
                        element.doctor_attending +
                        "</td><td>" +
                        element.ward +
                        "</td><td>" +
                        element.diagnosis +
                        "</td><td>" +
                        element.admit_days +
                        "</td><td>" +
                        element.notes +
                        "</td><td>" +
                        element.current_user +
                        "</td><td>" +
                        element.co_signee +
                        "</td><td>" +
                        element.reported_by +
                        "</td><td>" +
                        "<button style='padding:5px' type='button' class='btn btn-success view'>view</button></td ></tr > ",
                ];

                current_user = element.current_user;
                var datatable = $("#editTbl").DataTable();

                datatable.destroy();
                $.each(md, function (i, item) {
                    $("#editTbl tbody").append(item);
                });

                datatable = $("#editTbl").DataTable();
                $("#editPreauth").modal("show");

                counter++;
            });
            $(".view").click(function () {
                $("#editPreauth").modal("hide");
                datas = [];
                var $row = $(this).closest("tr");
                var $tds = $row.find("td");
                $.each($tds, function () {
                    datas.push($(this).text());
                });
                document.getElementById("reference_no").value = datas[1];
                document.getElementById("date_reported").value = datas[2];
                document.getElementById("authority_type").value = datas[5];
                document.getElementById("date_authorized").value = datas[9];
                document.getElementById("anniv").value = datas[10];
                document.getElementById("provider").value = datas[11];
                document.getElementById("co_signee").value = datas[18];
                document.getElementById("ward").value = datas[13];
                document.getElementById("reported_by").value = datas[19];
                document.getElementById("diagnosis").value = datas[14];
                document.getElementById("reserve").value = datas[6];
                document.getElementById("limit").value = datas[7];
                document.getElementById("admit_days").value = datas[15];
                document.getElementById("notes").value = datas[16];
                document.getElementById("member_names").value = datas[4];
                document.getElementById("current_user").value = current_user;
            });
        },
        error: function (error) {
            console.log(error);
        },
    });
    e.preventDefault();
});

form2.addEventListener("submit", (e) => {
    let data = {
        code: document.getElementById("reference_no").value,
        ward: ward_edit.value,
        diagnosis: diagnosis_edit.value,
        admit_days: admit_days_edit.value,
        limit: limit_edit.value,
        notes: notes_edit.value,
        reserve: reserve_edit.value,
        cosignee: co_signee_edit.value,
    };
    $.ajax({
        url: "/updateData",
        method: "POST",
        data: data,
        success: function (result) {
            showalert(result, "success");
        },
        error: function (error) {
            console.log(error);
        },
    });
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