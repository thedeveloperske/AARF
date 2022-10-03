//hide form
document.getElementById('member_tabs').style.display = 'none';

//variables needed
var loader = document.getElementById('overlay');
var select_btn = document.getElementById('select-corporate-dropdown');
var underwriter = document.getElementById('underwriter');
var corporate_name = document.getElementById('corporate_name');
var individual = document.getElementById('individual');
var family_size = document.getElementById('family_size');
var relation_to_principal = document.getElementById('relation_to_principal');
var family_title = document.getElementById('family_title');
var corporate_id = document.getElementById('corp_id');
var corp_id;

function startProcess(){
    //start loader
    loader.style.display = 'block';

    //reveal form
    document.getElementById('member_tabs').style.display = 'block';

    //corp_id
    corp_id = select_btn.value;

    //call fetchCorporateData and pass corp id

    fetchCorporateData(corp_id);

}

//fetchCorporateData function to fetch corporate data

function fetchCorporateData(id){

    $.get('api/query/corporate/'+id, function(corporate_data){
        updatePrincipalForm(corporate_data);
    });
}

//prefill principal form data
function updatePrincipalForm(corporate_data){

    console.log(corporate_data);
    //set corp_id
    corporate_id.value = corporate_data[0]['corp_id'];
    //set underwriter
    underwriter.value = corporate_data[0]['agent_id'];
    corporate_name.value = corporate_data[0]['corporate'];
    individual.value = corporate_data[0]['individual'];
    //set family size to M
    family_size.value = 1;
    //set relation to principal principal
    relation_to_principal.value = 24;
    family_title.value = 24;
    //stop loader
    loader.style.display = 'none';
}

//prefill member benefits from category chosen 
function updatePrincipalsBenefits(category){


    var category = document.getElementById('corp_category').value;

    let url = 'fetchCategoryBenefits/'+corp_id+'/'+category;

    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function (benefits_data) {
            populateBenefits(benefits_data);
        },
        error: function (data) {

        }
    });
}

function populateBenefits(benefits_data) {

    console.log(benefits_data);

    var benefits_table = document.getElementById('benefits_table');

    //fetch drop downs
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
            if (benefits_data.length > 0) {


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


                for (var i = 0; i < benefits_data.length; i++) {
                    benefits_table.insertRow(1).innerHTML =

                        '<tr>' +
                        '<input  class="form-control col" hidden name="idx[]" value=' + benefits_data[i]['idx'] + '>' +
                        '<td> <input class="form-control col" type="number" name="anniv[]" placeholder="Anniv" disabled=true value=' + benefits_data[i]['anniv'] + '></td>' +
                        '<td> <select class="form-control" name="category[]"><option selected="true">' + categories_map.get(benefits_data[i]['category']) + '</option>' + categories_options + '</select></td>' +
                        '<td> <select class="form-control" name="benefit[]"><option selected="true" value=' + benefits_data[i]['benefit'] + '>' + benefit_map.get(benefits_data[i]['benefit']) + '</option>' + benefits_options + '</select></td>' +
                        '<td> <select class="form-control" name="sub_limit_of[]"><option selected="true" value=' + benefits_data[i]['benefit'] + '>' + benefit_map.get(benefits_data[i]['benefit']) + '</option>' + benefits_options + '</select></td>' +
                        '<td> <input  class="form-control col" type="number" name="limit[]" placeholder="Limit" value=' + benefits_data[i]['limit'] + '></td>' +
                        '<td> <input  class="form-control col" type="number" name="change_factor[]" placeholder="Change Factor" value=' + benefits_data[i]['change_factor'] + '></td>' +
                        '<td> <input  class="form-control col" type="number" name="ceiling[]" placeholder="Ceiling" value=' + benefits_data[i]['ceiling'] + '></td>' +
                        '<td> <input  class="form-control col" type="number" name="cap[]" placeholder="Cap" value=' + benefits_data[i]['cap'] + '></td>' +
                        '<td> <input  class="form-control col" type="number" name="copay_amount[]" placeholder="Copay Amount" value=' + benefits_data[i]['copay_amount'] + '></td>' +
                        '<td> <select class="form-control" name="sharing[]"><option selected="true" value=' + benefits_data[i]['sharing'] + '>' + sharing_dict[benefits_data[i]['sharing']] + '</option><option value="1">PP</option><option value="2">PF</option></select></td>' +
                        '<td> <select class="form-control" name="fund[]"><option selected="true" value=' + benefits_data[i]['fund'] + '>' + fund_dict[benefits_data[i]['fund']] + '</option><option value="1">Y</option><option value="0">N</option></select></td>' +
                        '<td> <select class="form-control" name="indemnity[]"><option selected="true" value=' + benefits_data[i]['indemnity'] + '>' + indemnity_dict[benefits_data[i]['indemnity']] + '</option><option value="1">Y</option><option value="0">N</option> </select></td></tr>' +
                        '<td><input class="btn btn-danger" type="text" value="delete" onclick="deleteRow(this)"/></td>';
                }
            }


        });
    })


}
//add benefits row
function addMemberBenefitsRow(){

    $.get('api/fetchBenefits', function(benefits_response){

        //start loader
        loader.style.display = "block";

        let benefits_options = '';

        for(var i = 0;i < benefits_response.length; i++){
            var option = '<option value = "' + benefits_response[i]['code'] +'">'+benefits_response[i]['benefit']+'</option>';

            benefits_options += option;

        }
        insertMemberBenefitsRow(benefits_options);
    });

}
function pass_surname(){
    var principal_surname = document.getElementById('principal_surname').value;
    document.getElementById("surname").value= principal_surname;
    document.getElementById("surname").readOnly=true;
}
function pass_first_name(){
    var principal_first_name = document.getElementById('principal_first_name').value;
    document.getElementById("first_name").value= principal_first_name;
    document.getElementById("first_name").readOnly=true;
}
function pass_other_name(){
    var principal_other_name = document.getElementById('principal_other_names').value;
    document.getElementById("other_names").value= principal_other_name;
    document.getElementById("other_names").readOnly=true;
}

//insertBenefit row 
function insertMemberBenefitsRow(benefits_options){
    //stop loader
    loader.style.display = "none";

    let benefits_table = document.getElementById('benefits_table');

    let new_row = '<tr>' +
        '<td> <input id="member_no" class="form-control col" type="number" name="member_no[]" placeholder="Member No"></td>' +
        '<td> <select class="form-control" name="benefit[]"><option selected="true">Select Benefit</option> '+ benefits_options + '</select></td>' +
        '<td> <select class="form-control" name="sub_limit_of[]"><option selected="true">Select Main Benefit</option>' +benefits_options+ '</select></td>' +
        '<td> <input id="limit-amt" class="form-control col" type="number" name="limit[]" placeholder="Limit"></td>' +
        '<td> <input id="change-factor" class="form-control col" type="number" name="change_factor[]" placeholder="Change Factor"></td>' +
        '<td> <input id="ceiling" class="form-control col" type="number" name="ceiling[]" placeholder="Ceiling"></td>' +
        '<td> <input id="cap" class="form-control col" type="number" name="cap[]" placeholder="Cap"></td>' +
        '<td> <input id="copay-amt" class="form-control col" type="number" name="copay_amount[]" placeholder="Copay Amount"></td>' +
        '<td> <select class="form-control" name="sharing[]"><option selected="true">Select Sharing</option><option value="1">PP</option><option value="2">PF</option> </select></td>' +
        '<td> <input id="anniv" class="form-control col" type="number" name="anniv[]" placeholder="Anniv" readonly></td>' +
        '<td> <select class="form-control" name="fund[]"><option selected="true">Select Fund</option><option value="1">Y</option><option value="0">N</option> </select></td>' + '' +
        '<td> <select class="form-control" name="indemnity[]"><option selected="true">Select Indemnity</option><option value="1">Y</option><option value="0">N</option> </select></td></tr>';


    benefits_table.insertRow(2).innerHTML = `${new_row}`;
}

//search member
function getNames(){
    var corp_id = document.getElementById("select-corporate").value;


    //ajax request get members where corp_id = corp_id

    var fetch_members_url = 'fetch_members/'+corp_id;

    $.ajax({
        url:fetch_members_url,
        type:'GET',
        success:function(member_data){
            console.log(member_data);
            populateMemberNames(member_data);
        },
        error:function(error){
            console.log(error.response.message);
        }
    });
}


//used in member cancellaion and reinstation
function populateMemberNames(member_data){
    var members_dropdown_options = '';

    for (var i = 0;i < member_data.length; i++){
        var options = '<option value='+ member_data[i]['member_no'] +'>'+ member_data[i]['surname'] +' '+ member_data[i]['first_name'] +'</option>';
        members_dropdown_options+=options;
    }

    document.getElementById("select-member").innerHTML = members_dropdown_options;

}

//Populate the anniversary details for member cancellation
function populateAnniversaryDetails(){
    var anniv_table = document.getElementById('prev-anniv-table');
}
