const mem = document.getElementById("mem");
const corp = document.getElementById("corp");
const search = document.getElementById("search");
const form1 = document.getElementById("form1");
const form2 = document.getElementById("form2");

const header = $.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content"),
    },
});

form1.addEventListener("submit", (e) => {
    header;
    let data = { member_no: mem.value, corp: corp.value };
    $.ajax({
        url: "/getMembers",
        method: "POST",
        data: data,
        success: function (result) {
            let counter = 1;
            let full_names = "";
            $("#admissionTbl").DataTable().clear();

            result.forEach((element) => {
                let family_no = element.family_no;
                let member_no = element.member_no;
                if (element.other_names == null) {
                    full_names = element.surname + " " + element.first_name;
                } else {
                    full_names =
                        element.surname +
                        " " +
                        element.first_name +
                        " " +
                        element.other_names;
                }
                let corporate = element.corporate;
                let relation = element.relation;
                let status = element.status;

                let md = [
                    "<tr><td>" +
                        counter +
                        "</td><td>" +
                        family_no +
                        "</td><td>" +
                        member_no +
                        "</td><td>" +
                        full_names +
                        "</td><td>" +
                        corporate +
                        "</td><td>" +
                        relation +
                        "</td><td>" +
                        status +
                        "</td><td>" +
                        "<button style='padding:5px' type='button' class='btn btn-success view'>view</button></td ></tr > ",
                ];

                var datatable = $("#admissionTbl").DataTable();

                datatable.destroy();
                $.each(md, function (i, item) {
                    $("#admissionTbl tbody").append(item);
                });

                datatable = $("#admissionTbl").DataTable();
                $("#careAdmissions").modal("show");

                counter++;
            });
            $(".view").click(function () {
                $("#careAdmissions").modal("hide");
                datas = [];
                var $row = $(this).closest("tr");
                var $tds = $row.find("td");
                $.each($tds, function () {
                    datas.push($(this).text());
                });
                sendData(datas);
            });
        },
        error: function (error) {
            console.log(error);
        },
    });
    e.preventDefault();
});

function sendData(data) {
    header;
    let dt = {
        family_no: data[1],
        member_no: data[2],
        full_names: data[3],
        corporate: data[4],
        relation: data[5],
        status: data[6],
    };
    $.ajax({
        url: "/getMemberData",
        method: "POST",
        data: dt,
        success: function (result) {
            result.forEach((element) => {
                let md = [
                    "<tr><td>" +
                        element.code +
                        "</td><td>" +
                        element.member_name +
                        "</td><td>" +
                        element.provider +
                        "</td><td>" +
                        element.date_reported +
                        "</td><td>" +
                        element.reported_by +
                        "</td><td>" +
                        element.date_authorized +
                        "</td><td>" +
                        element.authorized_by +
                        "</td><td>" +
                        "<button style='padding:5px' type='button' class='btn btn-success view2'>view</button></td ></tr > ",
                ];
                var datatable = $("#benefits_table").DataTable();

                datatable.destroy();
                $.each(md, function (i, item) {
                    $("#benefits_table tbody").append(item);
                });

                datatable = $("#benefits_table").DataTable();
            });

            document.getElementById("member_name").value = data[3];
            document.getElementById("member_no").value = data[2];

            $(".view2").click(function () {
                datas = [];
                var $row = $(this).closest("tr");
                var $tds = $row.find("td");
                $.each($tds, function () {
                    datas.push($(this).text());
                });

                document.getElementById("authorization_no").value = datas[0];
                document.getElementById("date_admitted").value = datas[3];
                document.getElementById("provider").value = datas[2];
            });
        },
        error: function (error) {
            console.log(error);
        },
    });
}

form2.addEventListener("submit", (e) => {
    header;
    let data = $("#form2").serializeArray();
    $.ajax({
        url: "/saveCareAdmission",
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
