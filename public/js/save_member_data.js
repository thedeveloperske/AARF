function save_member_data(){

    //loader
    var loader = document.getElementById('overlay');

    $.ajaxSetup({
       headers:{
           'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
       }
    });
    var str = $('form').serialize();

    console.log(str);
    var type = 'POST';
    var ajaxurl = 'save_member_data';

    // start loader
    loader.style.display = 'block';

    $.ajax({
        type: type,
        url: ajaxurl,
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

            console.log(data)

            $('#errorModal').modal('show');

        }
    });
}
function validateMemberInputFields(){

    //principal
    var principal_surname = document.getElementById('principal_surname').value;
    var principal_first_name = document.getElementById('principal_first_name').value;
    var principal_other_names = document.getElementById('principal_other_names').value;
    var category = document.getElementById('corp_category').value;
    var tel_no = document.getElementById('tel_no').value;
    var mobile_no = document.getElementById('mobile_no').value;
    var postal_add = document.getElementById('postal_add').value;
    var town = document.getElementById('town').value;
    var email = document.getElementById('email').value;
    var phy_loc = document.getElementById('phy_loc').value;
    var family_size = document.getElementById('family_size').value;

    //personal
    var relation_to_principal = document.getElementById('relation_to_principal').value;
    var surname = document.getElementById('surname').value;
    var first_name = document.getElementById('first_name').value;
    var other_names = document.getElementById('other_names').value;
    var family_title = document.getElementById('family_title').value;
    var dob = document.getElementById('dob').value;

    //benefits
    /*
    var member_no = document.getElementById('member_no').value;
    var benefit = document.getElementById('benefit').value;
    var sub_limit_of = document.getElementById('sub_limit_of').value;
    var limit = document.getElementById('limit').value;
    var change_factor = document.getElementById('change_factor').value;
    var ceiling = document.getElementById('ceiling').value;
    var cap = document.getElementById('cap').value;
    var copay_amount = document.getElementById('copay_amount').value;
    var sharing = document.getElementById('sharing').value;
    var anniv = document.getElementById('anniv').value;
    var fund = document.getElementById('fund').value;*/

    //vetting


    var member_no = document.getElementById('member_no').value;
    var status = $("input[type='radio'][name='status']:checked").val();
    var comments = document.getElementById('comments').value;

    //errors array
    var errors = new Array();

    if(!principal_surname){
        errors.push('Principal: Surname is required');
    }
    if(!principal_first_name){
        errors.push('Principal: First Name is required');
    }
    if(!category){
        errors.push('Principal: Category is required');
    }
    if(!mobile_no){
        errors.push('Principal: Mobile No. is required');
    }
    if(!town){
        errors.push('Principal: Town is required');
    }
    if(!email){
        errors.push('Principal: Email is required');
    }
    if(!family_size){
        errors.push('Principal: Family Size is required');
    }
    if(!relation_to_principal){
        errors.push('Personal: Relation is required');
    }
    if(!surname){
        errors.push('Personal: Surname is required');
    }
    if(!first_name){
        errors.push('Personal: First Name is required');
    }
 
   
    if(!status){
        errors.push('Vetting: Member Number is required');
    }
    if(!status){
        errors.push('Vetting: Status is required');
    }

    var html='';

    for (let i = 0; i < errors.length; i++) {
        html += '<p style="color:red">' + errors[i] + ' !</p><br>';
    }
    document.getElementById('errorbody').innerHTML = html;

    //show error modal
    if(errors.length > 0){
        $('#errorModal').modal('show');
    }
    else{
        save_member_data();
    }
}
