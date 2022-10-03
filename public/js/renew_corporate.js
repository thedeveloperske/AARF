
var loader = document.getElementById('overlay');

var corporate_name = document.getElementById('corporate_name');

//select dropdown
var sel = document.getElementById('select-corporate-dropdown');

//date entered
var date_entered = new Date().toLocaleDateString();;

//user id
var user_id = document.getElementById('user_id');

//latest anniv 
var latest_anniv;

//set date entered
document.getElementById('date_entered').value = formatDate(date_entered);

//set new anniversary

function fetchAnniversary(id){
    var latest_anniv;

    $.get('api/fetchanniversaries/'+id)
    .then(response => {
        let temp_array = new Array();
        for(var i = 0;i < response.length;i++){
            temp_array.push(response[i]['anniv']);
        }

        //return max of anniv array to fetch maximum
        setAnniversary(Math.max(...temp_array));

        latest_anniv = Math.max(...temp_array);

        //fetch benefits of latest anniversary
        $.get('api/fetch_latest_anniv_benefits/'+id+'/'+latest_anniv)
        .then(response => {
            populateBenefits(response);
        });
    });
}

function setAnniversary(anniv){
     latest_anniv = parseInt(anniv)+1;
    //  document.getElementById('corporate_anniv').value  = latest_anniv;
    $('#corporate_anniv').val(latest_anniv);
}


 function fetchCorporateData(){

    var corporate_id = sel.value;    

    if(!corporate_id){
        $('#queryCorporateError').modal('show');
    }
    else{

        loader.style.display = 'block';
        //selected corporate name
        var corporate_name_value = sel.options[sel.selectedIndex].text;
       
        //set corporate name
        corporate_name.value = corporate_name_value;

        //set corporate id
        document.getElementById('corporate_id').value = corporate_id;
        fetchData(corporate_id);
        fetchAnniversary(corporate_id);
    }   

 }

 function fetchData(id){

    var anniversary_url = 'api/query/corp_anniversary/'+id;
    var benefits_url = 'api/query/corp_benefits/'+id;
    var admin_fee_url = 'api/query/corp_admin_fee_regulations/'+id;
    


    $.when(
        $.ajax({
            url: anniversary_url,
            type: 'GET',
            dataType:'JSON'
        }),
        $.ajax({
            url:benefits_url,
            type:'GET',
            dataType:'JSON'
        }),
        $.ajax({
            url:admin_fee_url,
            type:'GET',
            dataType:'JSON'
        })
    )
    .then(function(response1,response2,response3){

        //stop loader
        loader.style.display = 'none';

        updateData(response1,response2,response3);
    });

 }

 function updateData(response1,response2,response3){

    populatePrevAnniversaries(response1);
    // populateBenefits(response2);
    populateAdminFeeReg(response3);

 }

 function populatePrevAnniversaries(anniv_data){

    console.log(anniv_data);

    var anniv_table = document.getElementById('prev-anniv-table');
    
    //set the user_id
    user_id.value = anniv_data[0][0]['user_id'];
    
    //set commiss_rate
    document.getElementById('commiss_rate').value = anniv_data[0][0]['commiss_rate'];
    //set whtax rate
    document.getElementById('whtax_rate').value = anniv_data[0][0]['whtaxt_rate'];
    //set smart sync
    document.getElementById('smart_sync').value = anniv_data[0][0]['smart_sync'];
    //set status
    document.getElementById('status').value = anniv_data[0][0]['status_user'];

    for(var i = 0; i< anniv_data[0].length;i++){
        anniv_table.insertRow(1).innerHTML =
        '<tr>'+
        '<td style="font-size:12px;" align="center">'+anniv_data[0][i]['anniv']+'</td>'+
        '<td style="font-size:12px;" align="center">'+anniv_data[0][i]['agent_id']+'</td>'+
        '<td style="font-size:12px;" align="center">'+formatDate(anniv_data[0][i]['start_date'])+'</td>'+
        '<td style="font-size:12px;" align="center">'+formatDate(anniv_data[0][i]['end_date'])+'</td>'+
        '<td style="font-size:12px;" align="center">'+formatDate(anniv_data[0][i]['renewal_date'])+'</td>'+
        '</tr>';
    }
 }

 function populateBenefits(benefits_data){

    let benefits_table = document.getElementById('benefits_table');

    //fetch drop downs
    $.get('api/fetchBenefits', function(benefits_response){

           
        let benefits_options = '';

        //benfits dictionary

        var benefit_map = new Map();


        for(var i = 0;i < benefits_response.length; i++){
            var option = '<option value = "' + benefits_response[i]['code'] +'">'+benefits_response[i]['benefit']+'</option>'; 
            
         
            benefits_options += option;

            benefit_map.set(benefits_response[i]['code'] , benefits_response[i]['benefit']);
        }


        $.get('api/fetchCategories', function(categories_response){
            let categories_options = '';

            let categories_map = new Map();
        

            for(var i = 0;i < categories_response.length; i++){
                var option = '<option value = "' + categories_response[i]['category'] +'">'+categories_response[i]['description']+'</option>'; 
                
                categories_options += option;

                categories_map.set(categories_response[i]['category'], categories_response[i]['description']);
            }


            //insert new row
            if(benefits_data.length > 0){

                let sharing_dict = {1:'PP', 2:'PF'}; 
                let fund_dict = {0:'N', 1:'Y'};
                let indemnity_dict = {0:'N',1:'Y'};


                for(var i = 0; i < benefits_data.length; i++){

                    benefits_table.insertRow(1).innerHTML =

                    '<tr><td> <input class="form-control col" type="number" placeholder="Anniv" readonly value='+ benefits_data[i]['anniv'] +'></td>'+
                    '<td> <select class="form-control" name="category[]" id="category><option selected="true">'+ categories_map.get(benefits_data[i]['category']) +'</option>'+ categories_options +'</select></td>'+
                    '<td> <select class="form-control" name="benefit[]"><option selected="true" value='+ benefits_data[i]['benefit'] +'>'+ benefit_map.get(benefits_data[i]['benefit']) +'</option>'+ benefits_options +'</select></td>'+
                    '<td> <select class="form-control" name="sub_limit_of[]"><option selected="true" value='+ benefits_data[i]['benefit'] +'>'+ benefit_map.get(benefits_data[i]['benefit']) +'</option>'+ benefits_options +'</select></td>'+
                    '<td> <input  class="form-control col" type="number" name="limit[]" placeholder="Limit" value='+ benefits_data[i]['limit'] +'></td>'+
                    '<td> <input  class="form-control col" type="number" name="change_factor[]" placeholder="Change Factor" value='+ benefits_data[i]['change_factor'] +'></td>'+
                    '<td> <input  class="form-control col" type="number" name="ceiling[]" placeholder="Ceiling" value='+ benefits_data[i]['ceiling'] +'></td>'+
                    '<td> <input  class="form-control col" type="number" name="cap[]" placeholder="Cap" value='+ benefits_data[i]['cap'] +'></td>'+
                    '<td> <input  class="form-control col" type="number" name="copay_amount[]" placeholder="Copay Amount" value='+ benefits_data[i]['copay_amount'] +'></td>'+
                    '<td> <select class="form-control" name="sharing[]"><option selected="true" value='+ benefits_data[i]['sharing'] +'>'+ sharing_dict[benefits_data[i]['sharing']] + '</option><option value="1">PP</option><option value="2">PF</option></select></td>'+
                    '<td> <select class="form-control" name="fund[]"><option selected="true" value='+ benefits_data[i]['fund'] +'>' + fund_dict[benefits_data[i]['fund']] + '</option><option value="1">Y</option><option value="0">N</option></select></td>'+
                    '<td> <select class="form-control" name="indemnity[]"><option selected="true" value='+ benefits_data[i]['indemnity'] +'>'+ indemnity_dict[benefits_data[i]['indemnity']] + '</option><option value="1">Y</option><option value="0">N</option> </select></td></tr>';
                }
            }


        });
    })


}

function populateAdminFeeReg(admin_fee_data){    
    //admin fee table
    var admin_fee_table = document.getElementById('admin_fee_table');

    //fetch admin fee items
    $.get('api/fetch_admin_fee_type',function(response){

        //options placeholder
        var admin_fee_options = '';
        let admin_fee_map = new Map();

        for(var i = 0;i < response.length;i++){
            var option = '<option value = "'+response[i]['code']+'">'+response[i]['admin_fee_type']+'</option>';
            admin_fee_options += option;
            admin_fee_map.set(response[i]['code'],response[i]['admin_fee_type']);
        }

        if(admin_fee_data[0].length > 0){
            for (let i = 0; i < admin_fee_data[0].length; i++) {
                admin_fee_table.insertRow(1).innerHTML = 
                '<tr><td> <input class="form-control col" name="anniv" id="anniv" placeholder="Anniv" readonly value='+ admin_fee_data[0][i]['anniv'] +'></td>'+
                '<td> <select class="form-control" name="admin_fee_type" id="admin_fee_type"><option selected="true" value='+ admin_fee_data[0][i]['admin_fee_type'] +'>'+ admin_fee_map.get(admin_fee_data[0][i]['admin_fee_type']) +'</option>'+ admin_fee_options +'</select></td>'+
                '<td> <input class="form-control col" type="number" name="admin_fee_rate" id="admin_fee_rate" placeholder="Admin Fee Rate" value='+ admin_fee_data[0][i]['admin_fee_rate'] +'></td>'+
                '<td> <input class="form-control col" type="number" name="admin_fee_amt" id="admin_fee_amt" placeholder="Admin Fee Rate" value='+ admin_fee_data[0][i]['admin_fee_amt'] +'></td>'+
                '<td> <input class="form-control col" type="number" name="employer_copay" id="employer_copay" placeholder="Employer Copay" value='+ admin_fee_data[0][i]['employer_copay'] +'></td>'+
                '<td> <input class="form-control col" type="number" name="employee_copay" id="employee_copay" placeholder="Employee Copay" value='+ admin_fee_data[0][i]['employee_copay'] +'></td>'+
                '<td> <input class="form-control col" type="number" name="upfront_copay" id="upfront_copay" placeholder="Upfront Copay" value='+ admin_fee_data[0][i]['upfront_copay'] +'></td>'+
                '<td> <input id="vat" class="form-control col" type="number" name="vat" placeholder="Vat" value='+ admin_fee_data[0][i]['vat'] +'></td></tr>';           
            }
        }
    });

};



//format date
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

//check if corporate has expired before
function checkForExpiry(){

}
//update and renew corporate

function renewCorporate(){
    
    //loader
    loader.style.display = 'block';

    //fetch data
    var corporate_name = document.getElementById('corporate_name').value;
    var anniv = document.getElementById('corporate_anniv').value;
    var corp_id = document.getElementById('corporate_id').value;
    var start_date = document.getElementById('start_date').value;
    var user_id = document.getElementById('user_id').value;
    var end_date = document.getElementById('date_entered').value;
    var date_entered = document.getElementById('date_entered').value;
    var renewal_date = document.getElementById('renewal_date').value;
    var intermediary = document.getElementById('agent').value;
    var commiss_rate = document.getElementById('commiss_rate').value;
    var whtax_rate = document.getElementById('whtax_rate').value;
    var smart_sync = document.getElementById('smart_sync').value;
    var status = document.getElementById('status').value;
    var status_user = document.getElementById('status_user').value;

    //admin fee reg
    // var admin_fee_type = document.getElementById('admin_fee_type').value;
    // var admin_fee_rate = document.getElementById('admin_fee_rate').value;
    // var admin_fee_amt = document.getElementById('admin_fee_amt').value;
    // var employer_copay = document.getElementById('employer_copay').value;
    // var employee_copay = document.getElementById('employee_copay').value;
    // var upfront_copay = document.getElementById('upfront_copay').value;
    // var vat = document.getElementById('vat').value;


    // var formData = {
    //     corporate_name:corporate_name,
    //     corp_id:corp_id,
    //     anniv:anniv,
    //     start_date:start_date,
    //     user_id:user_id,
    //     end_date:end_date,
    //     date_entered:date_entered,
    //     renewal_date:renewal_date,
    //     intermediary:intermediary,
    //     commiss_rate:commiss_rate,
    //     whtax_rate:whtax_rate,
    //     smart_sync:smart_sync,
    //     status:status,
    //     status_user:status_user,      
    //     admin_fee_rate:admin_fee_rate,
    //     admin_fee_type:admin_fee_type,
    //     admin_fee_amt:admin_fee_amt,
    //     employee_copay:employee_copay,
    //     employer_copay:employer_copay,
    //     upfront_copay:upfront_copay,
    //     vat:vat
    // }

    var renew_endpoint = 'renew_corporate_save';

    $.ajax({
        type:'POST',
        url:renew_endpoint,
        data:$('form').serialize(),
        success:function(response){

            loader.style.display = 'none';

            //success modal
            $('#successModal').modal('show');

            console.log(response);
        },
        error:function(response){

            loader.style.display = 'none';

            console.log(response);
        }
    })
    console.log(data);
}

function validate(){
     //corp anniversary
       
     var start_date = document.getElementById('start_date').value;
     var end_date = document.getElementById('end_date').value;
     var renewal_date = document.getElementById('renewal_date').value;
     var agent_id = document.getElementById('agent').value;
     var commiss_rate = document.getElementById('commiss_rate').value;
     var whtax_rate = document.getElementById('whtax_rate').value;
     var smart_sync = document.getElementById('smart_sync').value;

     //admin fee regulations
    //  var admin_fee_type = document.getElementById('admin_fee_type').value;
    //  var admin_fee_rate = document.getElementById('admin_fee_rate').value;
    //  var admin_fee_amt = document.getElementById('admin_fee_amt').value;
    //  var employer_copay = document.getElementById('employer_copay').value;
    //  var employee_copay = document.getElementById('employee_copay').value;
    //  var upfront_copay = document.getElementById('upfront_copay').value;
    //  var vat = document.getElementById('vat').value;
   
     //benefits
    var errors = new Array();


        //validate cover dates
        if(!start_date){
            errors.push('Cover Dates: Start date is required');
        }
        if(!agent_id){
            errors.push('Cover Dates: Intermidiary is required');
        }

        var html = '';

        //create error strings
        for (let i = 0; i < errors.length; i++) {
            html += '<p style="color:red">' + errors[i] + ' !</p><br>';
        }

        document.getElementById('errorbody').innerHTML = html;

        //show error modal
        if(errors.length > 0){
            $('#errorModal').modal('show');
        }
        else{
            renewCorporate();
        }
    }