const options = document.getElementById("options");
const divcorp = document.getElementById("divcorp");
const divfam = document.getElementById("divfam");
const divfrom = document.getElementById("divfrom");
const divto = document.getElementById("divto");
const toLabel = document.getElementById("toLabel");
const fromLabel = document.getElementById("fromLabel");
const run = document.getElementById("run");
const form = document.getElementById("form");
const divtbl = document.getElementById("divtbl");

let header = $.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content"),
    },
});

function chooseOption(item) {
    switch (item) {
        case "":
            divtbl.style.display = "none";
            divcorp.style.display = "none";
            divfam.style.display = "none";
            divfrom.style.display = "none";
            divto.style.display = "none";
            toLabel.style.display = "none";
            fromLabel.style.display = "none";
            break;
        case "1":
            divtbl.style.display = "none";
            divcorp.style.display = "none";
            divfam.style.display = "none";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
        case "2":
            divtbl.style.display = "none";
            divcorp.style.display = "none";
            divfam.style.display = "none";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
        case "3":
            divtbl.style.display = "none";
            divcorp.style.display = "none";
            divfam.style.display = "none";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
        case "4":
            divtbl.style.display = "none";
            divcorp.style.display = "inline";
            divfam.style.display = "none";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
        case "5":
            divtbl.style.display = "none";
            divcorp.style.display = "none";
            divfam.style.display = "none";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
        case "6":
            divtbl.style.display = "none";
            divcorp.style.display = "none";
            divfam.style.display = "none";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
        case "7":
            divtbl.style.display = "none";
            divcorp.style.display = "none";
            divfam.style.display = "inline";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
        case "8":
            divtbl.style.display = "none";
            divcorp.style.display = "none";
            divfam.style.display = "none";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
        case "9":
            divtbl.style.display = "none";
            divcorp.style.display = "none";
            divfam.style.display = "none";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
        case "10":
            divtbl.style.display = "none";
            divcorp.style.display = "inline";
            divfam.style.display = "none";
            divfrom.style.display = "inline";
            divto.style.display = "inline";
            toLabel.style.display = "inline";
            fromLabel.style.display = "inline";
            break;
    }
}

run.addEventListener("click", (e) => {
    let data = $("#form").serializeArray();
    header;
    $.ajax({
        url: "/getMiscReport",
        method: "POST",
        data: data,
        success: function (result) {
            $("#care_reports_table > thead").empty();
            $("#care_reports_table > tbody").empty();       

            switch (result.options) {
                case "1":
                    $("#care_reports_table thead").append(
                        "<tr><th>corporate</th><th>Member No</th><th>Member Name</th><th>Preauth No</th><th>Provider</th><th>Admission No</th><th>Ward</th><th>Room No</th><th>Date Admitted</th><th>Bed No</th></tr>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.pre_auth_no}</td><td>${element.provider}</td><td>${element.admission_no}</td><td>${element.ward}</td><td>${element.room_no}</td><td>${element.date_admitted}</td><td>${element.bed_no}</td></tr>`
                        );
                    });

                    break;
                case "2":
                    $("#care_reports_table thead").append(
                        "<tr><th>corporate</th><th>Member No</th><th>Member Name</th><th>Preauth No</th><th>Incurred Amount</th><th>Visit Date</th><th>Visited By</th></tr>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.pre_auth_no}</td><td>${element.incurred_amt}</td><td>${element.visit_date}</td><td>${element.visited_by}</td></tr>`
                        );
                    });
                    break;
                case "3":
                    $("#care_reports_table thead").append(
                        "<th>corporate</th><th>Member No</th><th>Member Name</th><th>Provider</th><th>Visit Date</th><th>Visited By</th><th>Preauth No</th><th>Care Nurse Comments</th><th>Doctor Comments</th>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.provider}</td><td>${element.visit_date}</td><td>${element.visited_by}</td><td>${element.pre_auth_no}</td><td>${element.care_nurse_comments}</td><td>${element.doc_comments}</td></tr>`
                        );
                    });
                    break;
                case "4":
                    $("#care_reports_table thead").append(
                        "<th>corporate</th><th>Member No</th><th>Member Name</th><th>Preauth No</th><th>Diagnosis</th><th>Incurred Amount</th><th>Provider</th><th>Attending Doctor</th><th>Ward</th><th>Benefit</th><th>Date Reported</th><th>Date Authorized</th>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corp_id}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.code}</td><td>${element.pre_diagnosis}</td><td>${element.incurred_amt}</td><td>${element.provider}</td><td>${element.Doctor}</td><td>${element.ward}</td><td>${element.benefit}</td><td>${element.date_reported}</td><td>${element.date_authorized}</td></tr>`
                        );
                    });
                    break;
                case "5":
                    $("#care_reports_table thead").append(
                        "<th>corporate</th><th>Member No</th><th>Member Name</th><th>Preauth No</th><th>Ward</th><th>Room No</th><th>Bed No</th><th>Provider</th><th>Date Admitted</th><th>Admission No</th>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.pre_auth_no}</td><td>${element.ward}</td><td>${element.room_no}</td><td>${element.bed_no}</td><td>${element.provider}</td><td>${element.date_admitted}</td><td>${element.admission_no}</td></tr>`
                        );
                    });
                    break;
                case "6":
                    $("#care_reports_table thead").append(
                        "<th>corporate</th><th>Member No</th><th>Member Name</th><th>Preauth No</th><th>Ward</th><th>Diagnosis</th><th>Attending Doctor</th><th>Provider</th><th>Benefit</th><th>Date Reported</th>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.pre_auth_no}</td><td>${element.ward}</td><td>${element.pre_diagnosis}</td><td>${element.Doctor}</td><td>${element.provider}</td><td>${element.benefit}</td><td>${element.date_reported}</td></tr>`
                        );
                    });
                    break;
                case "7":
                    $("#care_reports_table thead").append(
                        "<th>corporate</th><th>Member No</th><th>Member Name</th><th>Preauth No</th><th>Ward</th><th>Diagnosis</th><th>Attending Doctor</th><th>Provider</th><th>Benefit</th><th>Date Reported</th><th>Ward</th>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.pre_auth_no}</td><td>${element.ward}</td><td>${element.pre_diagnosis}</td><td>${element.Doctor}</td><td>${element.provider}</td><td>${element.benefit}</td><td>${element.date_reported}</td><td>${element.ward}</td></tr>`
                        );
                    });
                    break;
                case "8":
                    $("#care_reports_table thead").append(
                        "<th>corporate</th><th>Member No</th><th>Member Name</th><th>Preauth No</th><th>Ward</th><th>Diagnosis</th><th>Attending Doctor</th><th>Provider</th><th>Benefit</th><th>Date Reported</th><th>Date Authorized</th><th>Ward</th>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.pre_auth_no}</td><td>${element.ward}</td><td>${element.pre_diagnosis}</td><td>${element.Doctor}</td><td>${element.provider}</td><td>${element.benefit}</td><td>${element.date_reported}</td><td>${element.date_authorized}</td><td>${element.ward}</td></tr>`
                        );
                    });
                    break;
                case "9":
                    $("#care_reports_table thead").append(
                        "<th>corporate</th><th>Member No</th><th>Member Name</th><th>Preauth No</th><th>Ward</th><th>Diagnosis</th><th>Attending Doctor</th><th>Provider</th><th>Benefit</th><th>Date Reported</th><th>Date Authorized</th><th>Ward</th>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.pre_auth_no}</td><td>${element.ward}</td><td>${element.pre_diagnosis}</td><td>${element.Doctor}</td><td>${element.provider}</td><td>${element.benefit}</td><td>${element.date_reported}</td><td>${element.date_authorized}</td><td>${element.ward}</td></tr>`
                        );
                    });
                    break;
                case "10":
                    $("#care_reports_table thead").append(
                        "<th>corporate</th><th>Member No</th><th>Member Name</th><th>Preauth No</th><th>Ward</th><th>Diagnosis</th><th>Attending Doctor</th><th>Provider</th><th>Benefit</th><th>Date Reported</th><th>Date Authorized</th><th>Ward</th>"
                    );
                    result.data.forEach((element) => {
                        $("#care_reports_table tbody").append(
                            `<tr><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.pre_auth_no}</td><td>${element.ward}</td><td>${element.pre_diagnosis}</td><td>${element.Doctor}</td><td>${element.provider}</td><td>${element.benefit}</td><td>${element.date_reported}</td><td>${element.date_authorized}</td><td>${element.ward}</td></tr>`
                        );
                    });
                    break;
            }
            divtbl.style.display = "inline";
            $("#care_reports_table").DataTable();
        //   $("#care_reports_table").DataTable({
        //         dom: "Bfrtip",
        //         butdivtons: ["copy", "excel", "pdf"],
        //     });
        },
        error: function (error) {
            console.log(error);
        },
    });
    
    e.preventDefault();
});
