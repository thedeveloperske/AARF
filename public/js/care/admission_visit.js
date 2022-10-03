const form1 = document.getElementById("form1");
const form2 = document.getElementById("form2");
const mem = document.getElementById("mem");
const corp = document.getElementById("corp");

const header = $.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content"),
    },
});

form1.addEventListener("submit", (e) => {
    header;
    let data = { mem: mem.value, corp: corp.value };
    $.ajax({
        url: "/getMembersData",
        method: "POST",
        data: data,
        success: function (result) {
            let counter = 1;
            $("#admissionTbl").DataTable().clear();
            result.forEach((element) => {
                let md = [
                    "<tr><td>" +
                        counter +
                        "</td><td>" +
                        element.family_no +
                        "</td><td>" +
                        element.member_no +
                        "</td><td>" +
                        element.full_names +
                        "</td><td>" +
                        element.corporate +
                        "</td><td>" +
                        element.relation +
                        "</td><td>" +
                        element.status +
                        "</td><td>" +
                        "<button style='padding:5px' type='button' class='btn btn-success view'>view</button></td ></tr > ",
                ];

                var datatable = $("#admissionTbl").DataTable();

                datatable.destroy();
                $.each(md, function (i, item) {
                    $("#admissionTbl tbody").append(item);
                });

                datatable = $("#admissionTbl").DataTable();
                $("#admissionModal").modal("show");

                counter++;
            });
            $(".view").click(function () {
                $("#admissionModal").modal("hide");
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
    let arr = {
        family_no: data[1],
        member_no: data[2],
        full_names: data[3],
        corporate: data[4],
        relation: data[5],
        status: data[6],
    };
    $.ajax({
        url: "/getCareData",
        method: "POST",
        data: arr,
        success: function (result) {
            appendTableVisit(result.data_1);
            appendTableAdmission(result.data_2);
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function appendTableVisit(data) {
    let counter = 1;
    data.forEach((element) => {
        let md = [
            "<tr><td>" +
                counter +
                "</td><td>" +
                element.member_no +
                "</td><td>" +
                element.member_name +
                "</td><td>" +
                element.auth_no +
                "</td><td>" +
                element.provider +
                "</td><td>" +
                element.date_admitted +
                "</td><td>" +
                element.admitting_doc +
                "</td><td>" +
                element.admission_no +
                "</td><td>" +
                element.ward +
                "</td><td>" +
                element.room_no +
                "</td><td>" +
                element.bed_no +
                "</td><td>" +
                "<button style='padding:5px' type='button' class='btn btn-success view2'>view</button></td ></tr > ",
        ];
        var datatable = $("#admissionTbl2").DataTable();

        datatable.destroy();
        $.each(md, function (i, item) {
            $("#admissionTbl2 tbody").append(item);
        });

        datatable = $("#admissionTbl2").DataTable();

        counter++;
    });
    $(".view2").click(function () {
        $("#admissionModal").modal("hide");
        datas = [];
        var $row = $(this).closest("tr");
        var $tds = $row.find("td");
        $.each($tds, function () {
            datas.push($(this).text());
        });
        document.getElementById("preauth_add").value = datas[3];
        document.getElementById("mem_no").value = datas[1];
    });
}
function appendTableAdmission(data) {
    let counter = 1;
    data.forEach((element) => {
        let md = [
            "<tr><td>" +
                counter +
                "</td><td>" +
                element.auth_no +
                "</td><td>" +
                element.visit_date +
                "</td><td>" +
                element.visited_by +
                "</td><td>" +
                element.incurred_amt +
                "</td><td>" +
                element.nurse_comment +
                "</td><td>" +
                element.doc_comments +
                "</td></tr > ",
        ];

        var datatable = $("#admissionTbl3").DataTable();

        datatable.destroy();
        $.each(md, function (i, item) {
            $("#admissionTbl3 tbody").append(item);
        });

        datatable = $("#admissionTbl3").DataTable();

        counter++;
    });
}

form2.addEventListener("submit", (e) => {
    let formData = $("#form2").serializeArray();
    $.ajax({
        url: "/saveCareVisit",
        method: "POST",
        data: formData,
        success: function (result) {
            console.log(result);
        },
        error: function (error) {
            console.log(error);
        },
    });
    e.preventDefault();
});
