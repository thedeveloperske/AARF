let btnSubmit = document.getElementById("btnSubmit");
let user_info = document.getElementById("user_info");
let member_no = document.getElementById("member_no");
let corporates = document.getElementById("corporates");
let getMemberData = document.getElementById("getMemberData");
let options = document.getElementById("options");
let authority_type = document.getElementById("authority_type");
let reference_no = document.getElementById("reference_no");
let member_name = document.getElementById("member_name");
let anniv = document.getElementById("anniv");
let username = document.getElementById("username");
let date_authorized = document.getElementById("date_authorized");
let claims = document.getElementById("claims");
let reserve_ttl = document.getElementById("reserve_ttl");
let balance = document.getElementById("balance");
let limit_ttl = document.getElementById("limit_ttl");
let limit = document.getElementById("limit");
let reserve = document.getElementById("reserve");
let notes = document.getElementById("notes");
let admit_days = document.getElementById("admit_days");
let diagnosis = document.getElementById("diagnosis");
let reported_by = document.getElementById("reported_by");
let date_reported = document.getElementById("date_reported");
let ward = document.getElementById("ward");
let co_signee = document.getElementById("co_signee");
let doctor_attending = document.getElementById("doctor_attending");
let provider = document.getElementById("provider");
let preauthForm = document.getElementById("preauthForm");

let membernoVal = "";
let reserveVal = 0,
    balanceVal = 0,
    limitVal = 0,
    header = $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $("meta[name='csrf-token']").attr("content"),
        },
    });

getMemberData.addEventListener("click", (e) => {
    authority_type.innerHTML = "";
    sendData({ member_no: member_no.value });
    e.preventDefault();
});

function sendData(data) {
    header;
    $.ajax({
        url: "/getMemberDataPreauth",
        method: "POST",
        data: data,
        success: function (result) {
            reference_no.value = result.preauth;
            member_name.value = result.member_name;
            anniv.value = result.anniv;
            username.value = result.username;
            date_authorized.value = result.date_authorized;
            let opt = document.createElement("option");
            opt.value = "";
            opt.innerHTML = "Select Benefit";
            authority_type.append(opt);
            result.benefits.forEach((element) => {
                let opt = document.createElement("option");
                opt.value = element.code;
                opt.innerHTML = element.benefit;
                authority_type.append(opt);
            });
            user_info.style.visibility = "visible";
        },
        error: function (error) {
            console.log(error);
        },
    });
}

function chooseBenefit(benefit) {
    if (benefit != "") {
        header;
        arr = { member_no: member_no.value, benefit };

        claims.value = "loading...";
        reserve_ttl.value = "loading...";
        balance.value = "loading...";
        limit_ttl.value = "loading...";

        $.ajax({
            url: "/getBalance",
            method: "POST",
            data: arr,
            success: function (result) {
                claims.value = result.claims;
                reserve_ttl.value = result.reserves;
                balance.value = result.balance;
                limit_ttl.value = result.limit;
                limitVal = result.limit_raw;
                reserveVal = result.reserves_raw;
                balanceVal = result.balance_raw;
            },
            error: function (error) {
                console.log(error);
            },
        });
    } else {
        claims.value = "";
        reserve_ttl.value = "";
        balance.value = "";
        limit_ttl.value = "";
    }
}

preauthForm.addEventListener("submit", (e) => {   
        header;
        if (parseFloat(limit.value) > parseFloat(reserve.value)) {
            alert("Limit cannot exceed reserve!");
        } else if (parseFloat(reserve.value) > parseFloat(balanceVal)) {
            alert("Reserve cannot exceed balance!");
        } else {
            let formData = $("#preauthForm").serializeArray();
            $.ajax({
                url: "/savePreauthData",
                method: "POST",
                data: formData,
                success: function (result) {
                    sendToPdf(result);
                },
                error: function (error) {
                    console.log(error);
                },
            });
        }
    e.preventDefault();
});

function sendToPdf(data) {
    $.ajax({
        url: "/generatePdf",
        method: "POST",
        data: data,
        success: function (result) {
            showalert("Data saved successfully.", "success");
            window.location.replace('/pre_authorization');
        },
        error: function (error) {
            console.log(error);
        },
    });
}

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

