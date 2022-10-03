var btn = document.getElementById('querycorporatebtn');

var table = document.getElementById('querycorporatetable');

var loader = document.getElementById('overlay');

table.style.display = 'none';

function queryCorporate() {

    var corporate_id = document.getElementById('select-corporate-dropdown').value;


    if (!corporate_id) {
        $('#queryCorporateError').modal('show');
    } else {

        //start loader
        loader.style.display = 'block';

        fetchData(corporate_id);
    }
}

function fetchData(id) {

    //csrf
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
        }
    });

    //urls
    var corporate_url = 'api/query/corporate/' + id;
    var cover_dates_url = 'api/query/cover_date/' + id;
    var contact_person_url = 'api/query/corp_contact_person/' + id;
    var admin_fee_regulation_url = 'api/query/corp_admin_fee_regulations/' + id;
    var corp_benefits_url = 'api/query/corp_benefits/' + id;
    var corp_providers_url = 'api/query/corp_providers/' + id;

    //variables
    var corporate_data = new Array();
    var cover_dates_data = new Array();
    var contact_person_data = new Array();
    var admin_fee_reg_data = new Array();
    var benefits_data = new Array();
    var provider_data = new Array();


    $.when(
            $.ajax({
                url: corporate_url,
                type: 'GET',
                dataType: 'JSON'
            }),
            $.ajax({
                url: cover_dates_url,
                type: 'GET',
                dataType: 'JSON'
            }),
            $.ajax({
                url: contact_person_url,
                type: 'GET',
                dataType: 'JSON'
            }),
            $.ajax({
                url: corp_benefits_url,
                type: 'GET',
                dataType: 'JSON'
            }),
            $.ajax({
                url: admin_fee_regulation_url,
                type: 'GET',
                dataType: 'JSON'
            }),
            $.ajax({
                url: corp_providers_url,
                type: 'GET',
                dataType: 'JSON'
            })
        )
        .then(function (response1, response2, response3, response4, response5, response6) {

            //stop loader
            loader.style.display = 'none';

            corporate_data = response1;
            cover_dates_data = response2;
            contact_person_data = response3;
            benefits_data = response4;
            admin_fee_reg_data = response5;
            provider_data = response6;

            updateForms(corporate_data, cover_dates_data, contact_person_data, benefits_data, admin_fee_reg_data, provider_data);
        });


}

function updateForms(corporate_data, cover_dates_data, contact_person_data, benefits_data, admin_fee_reg_data, provider_data) {


    populateCorporateForm(corporate_data);
    populateCoverDates(cover_dates_data);
    populateAdminFeeReg(admin_fee_reg_data);
    populateProvider(provider_data);
    populateContactPerson(contact_person_data);
    populateBenefits(benefits_data);

    //hider shimmer
    document.getElementById('shimmer').style.display = 'none';

    //show table 
    table.style.display = 'block';




}

function populateCorporateForm(corporate_data) {

    //corporate
    var corp_id = document.getElementById('corp_id');
    var corporate = document.getElementById('corporate');
    var policy_number = document.getElementById('policy_number');
    var scheme = document.getElementById('scheme');
    var corp_tel_no = document.getElementById('corp_tel_no');
    var pin_number = document.getElementById('pin_number');
    var corp_mobile_no = document.getElementById('corp_mobile_no');
    var town = document.getElementById('town');
    var corp_email = document.getElementById('corp_email');
    var phy_loc = document.getElementById('phy_loc');
    var individual = document.getElementById('individual');
    var agent_id = document.getElementById('agent_id');
    var introducer = document.getElementById('introducer');
    var notes = document.getElementById('notes');
    var acct_no = document.getElementById('acct_no');
    var gl_account = document.getElementById('gl_account');
    var bank_gl = document.getElementById('bank_gl');
    var rmf = document.getElementById('rmf');

    //assign values to form fields
    corp_id.value = corporate_data[0][0]['corp_id'];
    corporate.value = corporate_data[0][0]['corporate'];
    policy_number.value = corporate_data[0][0]['policy_no'];
    scheme.value = corporate_data[0][0]['scheme'];
    corp_tel_no.value = corporate_data[0][0]['tel_no'];
    pin_number.value = corporate_data[0][0]['pin_number'];
    corp_mobile_no.value = corporate_data[0][0]['mobile_no'];
    town.value = corporate_data[0][0]['town'];
    corp_email.value = corporate_data[0][0]['email'];
    phy_loc.value = corporate_data[0][0]['phy_loc'];
    individual.value = corporate_data[0][0]['individual'];
    agent_id.value = corporate_data[0][0]['agent_id'];
    introducer.value = corporate_data[0][0]['introducer'];
    notes.value = corporate_data[0][0]['notes'];
    acct_no.value = corporate_data[0][0]['acct_no'];
    gl_account.value = corporate_data[0][0]['bank_gl'];
    bank_gl.value = corporate_data[0][0]['bank_gl'];
    rmf.value = corporate_data[0][0]['rmf'];
}

function populateCoverDates(cover_dates_data) {

    //corp anniversary
    var start_date = document.getElementById('start_date');
    var end_date = document.getElementById('end_date');
    var renewal_date = document.getElementById('renewal_date');
    var agent_id = document.getElementById('agent_id');
    var commiss_rate = document.getElementById('commiss_rate');
    var whtax_rate = document.getElementById('whtax_rate');
    var smart_sync = document.getElementById('smart_sync');
    var anniv = document.getElementById('anniv');


    start_date.value = formatDate(cover_dates_data[0][0]['date_entered']);
    end_date.value = formatDate(cover_dates_data[0][0]['end_date']);
    renewal_date.value = formatDate(cover_dates_data[0][0]['renewal_date']);
    agent_id.value = cover_dates_data[0][0]['agent_id'];
    commiss_rate.value = cover_dates_data[0][0]['commiss_rate'];
    whtax_rate.value = cover_dates_data[0][0]['whtax_rate'];
    smart_sync.value = cover_dates_data[0][0]['smart_sync'];
    anniv.value = cover_dates_data[0][0]['anniv'];

}

//populate admin fee regulations

function populateAdminFeeReg(admin_fee_data) {
    //admin fee table
    var admin_fee_table = document.getElementById('admin_fee_table');

    //fetch admin fee items
    $.get('api/fetch_admin_fee_type', function (response) {

        //options placeholder
        var admin_fee_options = '';
        let admin_fee_map = new Map();

        for (var i = 0; i < response.length; i++) {
            var option = '<option value = "' + response[i]['code'] + '">' + response[i]['admin_fee_type'] + '</option>';
            admin_fee_options += option;
            admin_fee_map.set(response[i]['code'], response[i]['admin_fee_type']);
        }

        if (admin_fee_data[0].length > 0) {
            for (let i = 0; i < admin_fee_data[0].length; i++) {
                admin_fee_table.insertRow(1).innerHTML =
                    '<tr><td> <input class="form-control col" name="anniv" id="anniv" placeholder="Anniv" readonly value=' + admin_fee_data[0][i]['anniv'] + '></td>' +
                    '<td> <select class="form-control" name="admin_fee_type" id="admin_fee_type"><option selected="true" value=' + admin_fee_data[0][i]['admin_fee_type'] + '>' + admin_fee_map.get(admin_fee_data[0][i]['admin_fee_type']) + '</option>' + admin_fee_options + '</select></td>' +
                    '<td> <input class="form-control col" type="number" name="admin_fee_rate" id="admin_fee_rate" placeholder="Admin Fee Rate" value=' + admin_fee_data[0][i]['admin_fee_rate'] + '></td>' +
                    '<td> <input class="form-control col" type="number" name="admin_fee_amt" id="admin_fee_amt" placeholder="Admin Fee Rate" value=' + admin_fee_data[0][i]['admin_fee_amt'] + '></td>' +
                    '<td> <input class="form-control col" type="number" name="employer_copay" id="employer_copay" placeholder="Employer Copay" value=' + admin_fee_data[0][i]['employer_copay'] + '></td>' +
                    '<td> <input class="form-control col" type="number" name="employee_copay" id="employee_copay" placeholder="Employee Copay" value=' + admin_fee_data[0][i]['employee_copay'] + '></td>' +
                    '<td> <input class="form-control col" type="number" name="upfront_copay" id="upfront_copay" placeholder="Upfront Copay" value=' + admin_fee_data[0][i]['upfront_copay'] + '></td>' +
                    '<td> <input id="vat" class="form-control col" type="number" name="vat" placeholder="Vat" value=' + admin_fee_data[0][i]['vat'] + '></td></tr>';
            }
        }
    });

}

function populateProvider(provider_data) {

    //provider  
    var provider_category = document.getElementById('provider_category');
    var provider = document.getElementById('provider');
    var copay_amount = document.getElementById('provider_copay_amount');
    var restricted = document.getElementById('restricted');
    var provider_idx = document.getElementById('provider_idx');

    console.log(provider_data);

    if (provider_data[0].length > 0) {
        provider_idx.value = provider_data[0][0]['idx'];
        provider_category.value = provider_data[0][0]['category'];
        provider.value = provider_data[0][0]['provider'];
        copay_amount.value = provider_data[0][0]['copay_amt'];
        restricted.value = provider_data[0][0]['restricted'];
    }

}

//populate contact person

function populateContactPerson(contact_person_data) {

    //contact person table
    let corp_contact_person_table = document.getElementById('contact_person_table');

    $.get('api/fetchTitles', function (title_response) {

        var title_map = new Map();

        var options_string = '';

        for (var i = 0; i < title_response.length; i++) {

            var option = '<option value = "' + title_response[i]['code'] + '">' + title_response[i]['title'] + '</option>';

            options_string += option;

            title_map.set(title_response[i]['code'], title_response[i]['title']);

        }

        $.get('api/fetchContactRelations', function (contact_relation_response) {

            let job_title_options_string = '';

            contact_relation_map = new Map();

            for (var i = 0; i < contact_relation_response.length; i++) {

                var option = '<option value = "' + contact_relation_response[i]['code'] + '">' + contact_relation_response[i]['relation'] + '</option>';

                job_title_options_string += option;

                contact_relation_map.set(contact_relation_response[i]['code'], contact_relation_response[i]['relation']);

            }

            if (contact_person_data[0].length > 0) {
                for (var i = 0; i < contact_person_data[0].length; i++) {
                    corp_contact_person_table.insertRow(1).innerHTML =
                        '<tr><td> <select class="form-control" name="title[]"><option selected="true" value=' + contact_person_data[0][i]['title'] + '>' + title_map.get(contact_person_data[0][i]['title']) + '</option>' + options_string + '</select></td>' +
                        '<td><input id="surname" class="form-control col" type="text" name="surname[]" placeholder="Surname" value = ' + contact_person_data[0][i]["surname"] + '></td>' +
                        '<td> <input id="first-name" class="form-control col" type="text" name="first_name[]" id="first-name" placeholder="First Name" value=' + contact_person_data[0][i]['first_name'] + '></td>' +
                        '<td> <input id="other-name" class="form-control col" type="text" name="other_names[]" placeholder="Other Names" value=' + contact_person_data[0][i]['other_names'] + '></td>' +
                        '<td> <select class="form-control" name="job_title[]"><option selected="true" value=' + contact_person_data[0][i]['job_title'] + '>' + contact_relation_map.get(contact_person_data[0][i]['job_title']) + '</option>' + job_title_options_string + '</select></td>' +
                        '<td> <input id="mobile-no" class="form-control col" type="tel" name="mobile_no[]" placeholder="Mobile No" value=' + contact_person_data[0][i]['mobile_no'] + '></td>' +
                        '<td> <input id="tel-no" class="form-control col" type="tel" name="tel_no[]" placeholder="Telephone No" value=' + contact_person_data[0][i]['tel_no'] + '></td>' +
                        '<td> <input id="email" style="font-size:12px !important;" class="form-control col" name="email[]" placeholder="Email Address" value=' + contact_person_data[0][i]['email'] + '></td></tr>' +
                        '<td><input class="btn btn-danger" type="text" value="delete" onclick="deleteRow(this)"/></td>';

                }
            }

        });
    });

}

function populateBenefits(benefits_data) {

    let benefits_table = document.getElementById('benefits_table');

    //fetch drop downs

    console.log(benefits_data);

    $.get('api/fetchBenefits', function (benefits_response) {


        let benefits_options = '';

        //benfits dictionary

        var benefit_map = new Map();


        for (var i = 0; i < benefits_response.length; i++) {
            var option = '<option value = "' + benefits_response[i]['code'] + '">' + benefits_response[i]['benefit'] + '</option>';


            benefits_options += option;

            benefit_map.set(benefits_response[i]['code'], benefits_response[i]['benefit']);
        }


        $.get('api/fetchCategories', function (categories_response) {
            let categories_options = '';

            let categories_map = new Map();


            for (var i = 0; i < categories_response.length; i++) {
                var option = '<option value = "' + categories_response[i]['category'] + '">' + categories_response[i]['description'] + '</option>';

                categories_options += option;

                categories_map.set(categories_response[i]['category'], categories_response[i]['description']);
            }


            //insert new row
            if (benefits_data[0].length > 0) {


                let sharing_dict = {
                    1: 'PP',
                    2: 'PF'
                };
                let fund_dict = {
                    0: 'N',
                    1: 'Y'
                };
                let indemnity_dict = {
                    0: 'N',
                    1: 'Y'
                };


                for (var i = 0; i < benefits_data[0].length; i++) {
                    benefits_table.insertRow(1).innerHTML =

                        '<tr>' +
                        '<input  class="form-control col" hidden name="idx[]" value=' + benefits_data[0][i]['idx'] + '>' +
                        '<td> <input class="form-control col" type="number" name="anniv[]" placeholder="Anniv" disabled=true value=' + benefits_data[0][i]['anniv'] + '></td>' +
                        '<td> <select class="form-control" name="category[]"><option selected="true">' + categories_map.get(benefits_data[0][i]['category']) + '</option>' + categories_options + '</select></td>' +
                        '<td> <select class="form-control" name="benefit[]"><option selected="true" value=' + benefits_data[0][i]['benefit'] + '>' + benefit_map.get(benefits_data[0][i]['benefit']) + '</option>' + benefits_options + '</select></td>' +
                        '<td> <select class="form-control" name="sub_limit_of[]"><option selected="true" value=' + benefits_data[0][i]['benefit'] + '>' + benefit_map.get(benefits_data[0][i]['benefit']) + '</option>' + benefits_options + '</select></td>' +
                        '<td> <input  class="form-control col" type="number" name="limit[]" placeholder="Limit" value=' + benefits_data[0][i]['limit'] + '></td>' +
                        '<td> <input  class="form-control col" type="number" name="change_factor[]" placeholder="Change Factor" value=' + benefits_data[0][i]['change_factor'] + '></td>' +
                        '<td> <input  class="form-control col" type="number" name="ceiling[]" placeholder="Ceiling" value=' + benefits_data[0][i]['ceiling'] + '></td>' +
                        '<td> <input  class="form-control col" type="number" name="cap[]" placeholder="Cap" value=' + benefits_data[0][i]['cap'] + '></td>' +
                        '<td> <input  class="form-control col" type="number" name="copay_amount[]" placeholder="Copay Amount" value=' + benefits_data[0][i]['copay_amount'] + '></td>' +
                        '<td> <select class="form-control" name="sharing[]"><option selected="true" value=' + benefits_data[0][i]['sharing'] + '>' + sharing_dict[benefits_data[0][i]['sharing']] + '</option><option value="1">PP</option><option value="2">PF</option></select></td>' +
                        '<td> <select class="form-control" name="fund[]"><option selected="true" value=' + benefits_data[0][i]['fund'] + '>' + fund_dict[benefits_data[0][i]['fund']] + '</option><option value="1">Y</option><option value="0">N</option></select></td>' +
                        '<td> <select class="form-control" name="indemnity[]"><option selected="true" value=' + benefits_data[0][i]['indemnity'] + '>' + indemnity_dict[benefits_data[0][i]['indemnity']] + '</option><option value="1">Y</option><option value="0">N</option> </select></td></tr>' +
                        '<td><input class="btn btn-danger" type="text" value="delete" onclick="deleteRow(this)"/></td>';
                }
            }


        });
    })


}

//formate date
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}


//save or update corporate data

function updateCorporateData() {

    loader.style.display = 'block';

    var str = $("form").serialize();

    console.log('update corporate clicked');

    $.ajax({
        type: 'POST',
        url: 'update_corporate_data',
        data: str,
        dataType: 'json',
        success: function (data) {
            //stop loader
            loader.style.display = 'none';

            //success modal
            $('#successModal').modal('show');

            console.log(data);
        },
        error: function (data) {
            loader.style.display = 'none';

            console.log(data.responseJSON)

            document.getElementById('errorModal').innerHTML = data.responseJSON;

            $('#errorModal').modal('show');

        }
    });
}

function paginateBenefitsTable() {
    console.log('paginating .....');
    $('#benefits_table').after('<div id="nav" class="d-flex justify-content-center"></div>');
    var rowsShown = 10;
    var rowsTotal = $('#benefits_table tbody tr').length;
    var numPages = rowsTotal / rowsShown;
    for (i = 0; i < numPages; i++) {
        var pageNum = i + 1;
        $('#nav').append('<a href="#" style="color:blue;padding:5px;" rel="' + i + '">' + pageNum + '</a> ');
    }
    $('#benefits_table tbody tr').hide();
    $('#benefits_table tbody tr').slice(0, rowsShown).show();
    $('#nav a:first').addClass('active');
    $('#nav a').bind('click', function () {

        $('#nav a').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $('#benefits_table tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
        css('display', 'table-row').animate({
            opacity: 1
        }, 300);
    });
}