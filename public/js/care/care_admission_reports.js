let options = document.getElementById("options");
let mem = document.getElementById("mem");
let from = document.getElementById("from");
let to = document.getElementById("to");
let fromLable = document.getElementById("fromLable");
let toLable = document.getElementById("toLable");
let run = document.getElementById("run");
let header = $.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content"),
    },
});

$(document).ready(() => {
    mem.style.display = "none";
    from.style.display = "none";
    to.style.display = "none";
    fromLabel.style.display = "none";
    toLabel.style.display = "none";
});

function chooseOption(item) {
    switch (item) {
        case "":
            mem.style.display = "none";
            from.style.display = "none";
            to.style.display = "none";
            fromLabel.style.display = "none";
            toLabel.style.display = "none";
            break;
        case "1":
            mem.style.display = "none";
            from.style.display = "inline";
            to.style.display = "inline";
            fromLabel.style.display = "inline";
            toLabel.style.display = "inline";
            break;
        case "2":
            mem.style.display = "inline";
            from.style.display = "inline";
            to.style.display = "inline";
            fromLabel.style.display = "inline";
            toLabel.style.display = "inline";
            break;
    }
}

run.addEventListener("click", (e) => {
    let data = $("#form").serializeArray();
    header;
    $.ajax({
        url: "/getAdminVisitReport",
        method: "POST",
        data: data,
        success: function (result) {
            let counter = 1;
            $("#care_admission_visits > tbody").empty();
            result.forEach((element) => {
                $("#care_admission_visits tbody").append(
                    `<tr><td>${counter}</td><td>${element.corporate}</td><td>${element.member_no}</td><td>${element.surname} ${element.first_name} ${element.other_names} </td><td>${element.provider}</td><td>${element.pre_auth_no}</td><td>${element.date_admitted}</td><td>${element.date_discharged}</td><td>${element.visit_date}</td><td>${element.visited_by}</td><td>${element.care_nurse_comments}</td><td>${element.doc_comments}</td></tr>`
                );
                counter++;
            });
            
        },
        error: function (error) {
            console.log(error);
        },
    });
    $("#care_admission_visits").DataTable();
    //  $("#care_admission_visits").DataTable({
    //      dom: "Bfrtip",
    //      buttons: ["copy", "excel", "pdf"],
    //  });
    e.preventDefault();
});
