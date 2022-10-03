   function save_corporate_data(){

    //loader
    var loader = document.getElementById('overlay');

    //corporate
    var corporate = document.getElementById('corporate').value;
    var scheme = document.getElementById('scheme').value;
    var corp_tel_no = document.getElementById('corp_tel_no').value;
    var pin_number = document.getElementById('pin_number').value;
    var corp_mobile_no = document.getElementById('corp_mobile_no').value;
    var town = document.getElementById('town').value;
    var corp_email = document.getElementById('email').value;
    var phy_loc = document.getElementById('phy_loc').value;
    var individual = document.getElementById('individual').value;
    var agent_id = document.getElementById('agent_id').value;
    var introducer = document.getElementById('introducer').value;
    var notes = document.getElementById('notes').value;
    var acct_no = document.getElementById('acct_no').value;
    var gl_account = document.getElementById('gl_account').value;
    var bank_gl = document.getElementById('bank_gl').value;
    var rmf = document.getElementById('rmf').value;

    //corporate contact person
    var title = document.getElementById('title').value;
    var surname  = document.getElementById('surname').value;
    var first_name = document.getElementById('first_name').value;
    var other_names  = document.getElementById('other_names').value;
    var job_title = document.getElementById('job_title').value;
    var mobile_no = document.getElementById('mobile_no').value;
    var tel_no = document.getElementById('tel_no').value;
    var email = document.getElementById('email').value;

    //corp anniversary
    var start_date = document.getElementById('start_date').value;
    var end_date = document.getElementById('end_date').value;
    var renewal_date = document.getElementById('renewal_date').value;
    var agent_id = document.getElementById('agent_id').value;
    var commiss_rate = document.getElementById('commiss_rate').value;
    var whtax_rate = document.getElementById('whtax_rate').value;
    var smart_sync = document.getElementById('smart_sync').value;

    //admin fee regulations
      var admin_fee_type = document.getElementById('admin_fee_type').value;
      var admin_fee_rate = document.getElementById('admin_fee_rate').value;
      var admin_fee_amt = document.getElementById('admin_fee_amt').value;
      var employer_copay = document.getElementById('employer_copay').value;
      var employee_copay = document.getElementById('employee_copay').value;
      var upfront_copay = document.getElementById('upfront_copay').value;
      var vat = document.getElementById('vat').value;

      //benefits
      var category = document.getElementById('category').value;
      var benefit = document.getElementById('benefit').value;
      var sub_limit_of = document.getElementById('sub_limit_of').value;
      var limit = document.getElementById('limit').value;
      var change_factor = document.getElementById('change_factor').value;
      var ceiling = document.getElementById('ceiling').value;
      var cap = document.getElementById('cap').value;
      var copay_amount = document.getElementById('copay_amt').value;
      var sharing = document.getElementById('sharing').value;
      var fund = document.getElementById('fund').value;
      var smart_sync = document.getElementById('smart_sync').value;
      var indemnity = document.getElementById('indemnity').value;


      //provider
      var provider_category = document.getElementById('provider_category').value;
      var provider = document.getElementById('provider').value;
      var copay_amount = document.getElementById('provider_copay_amount').value;
      var restricted = document.getElementById('restricted').value;


    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
        }
    });

    var formData = {
        corporate:corporate,
        scheme:scheme,
        corp_tel_no:corp_tel_no,
        pin_number:pin_number,
        corp_mobile_no:corp_mobile_no,
        town:town,
        corp_email:corp_email,
        phy_loc:phy_loc,
        individual:individual,
        agent_id:agent_id,
        introducer:introducer,
        notes:notes,
        acct_no:acct_no,
        gl_account:gl_account,
        bank_gl:bank_gl,
        rmf:rmf,
        //corporate contact person
        title:title,
        surname:surname,
        first_name:first_name,
        other_names:other_names,
        job_title:job_title,
        mobile_no:mobile_no,
        tel_no:tel_no,
        email:email,
        //corp anniversary
        start_date:start_date,
        end_date:end_date,
        renewal_date:renewal_date,
        agent_id:agent_id,
        commiss_rate:commiss_rate,
        whtax_rate:whtax_rate,
        smart_sync:smart_sync,
        //admin fee regulations
        admin_fee_type:admin_fee_type,
        admin_fee_rate:admin_fee_amt,
        admin_fee_amt:admin_fee_amt,
        employer_copay:employer_copay,
        employee_copay:employee_copay,
        upfront_copay:upfront_copay,
        vat:vat,
        //benefits
        category:category,
        benefit:benefit,
        sub_limit_of:sub_limit_of,
        limit:limit,
        change_factor:change_factor,
        ceiling:ceiling,
        cap:cap,
        copay_amount:copay_amount,
        sharing:sharing,
        fund:fund,
        smart_sync:smart_sync,
        indemnity:indemnity,
        //provider
        category:provider_category,
        provider:provider,
        copay_amount:copay_amount,
        restricted:restricted
    }; 

    console.log(formData);
    var type = "POST";
    var ajaxurl = 'save_corporate_data';

    // start loader
    loader.style.display = 'block';

    var str = $( "form" ).serialize();

   
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

            console.log(data.responseJSON)

            document.getElementById('errorbody').innerHTML = data.responseJSON;

            $('#errorModal').modal('show');

        }
    });

   }

function validateInputFields(){

        //corporate
        var corporate = document.getElementById('corporate').value;
        var scheme = document.getElementById('scheme').value;
        var corp_tel_no = document.getElementById('corp_tel_no').value;
        var pin_number = document.getElementById('pin_number').value;
        var corp_mobile_no = document.getElementById('corp_mobile_no').value;
        var town = document.getElementById('town').value;
        var corp_email = document.getElementById('corp_email').value;
        var phy_loc = document.getElementById('phy_loc').value;
        var individual = document.getElementById('individual').value;
        var agent_id = document.getElementById('agent_id').value;
        var introducer = document.getElementById('introducer').value;
        var notes = document.getElementById('notes').value;
        var acct_no = document.getElementById('acct_no').value;
        var gl_account = document.getElementById('gl_account').value;
        var bank_gl = document.getElementById('bank_gl').value;
        var rmf = document.getElementById('rmf').value;

        //corporate contact person
        var title = document.getElementById('title').value;
        var surname  = document.getElementById('surname').value;
        var first_name = document.getElementById('first_name').value;
        var other_names  = document.getElementById('other_names').value;
        var job_title = document.getElementById('job_title').value;
        var mobile_no = document.getElementById('mobile_no').value;
        var tel_no = document.getElementById('tel_no').value;
        var email = document.getElementById('email').value;

        //corp anniversary

        var start_date = document.getElementById('start_date').value;
        var end_date = document.getElementById('end_date').value;
        var renewal_date = document.getElementById('renewal_date').value;
        var agent_id = document.getElementById('agent_id').value;
        var commiss_rate = document.getElementById('commiss_rate').value;
        var whtax_rate = document.getElementById('whtax_rate').value;
        var smart_sync = document.getElementById('smart_sync').value;

        //admin fee regulations
          var admin_fee_type = document.getElementById('admin_fee_type').value;
          var admin_fee_rate = document.getElementById('admin_fee_rate').value;
          var admin_fee_amt = document.getElementById('admin_fee_amt').value;
          var employer_copay = document.getElementById('employer_copay').value;
          var employee_copay = document.getElementById('employee_copay').value;
          var upfront_copay = document.getElementById('upfront_copay').value;
          var vat = document.getElementById('vat').value;

          //benefits
          var category = document.getElementById('category').value;
          var benefit = document.getElementById('benefit').value;
          var sub_limit_of = document.getElementById('sub_limit_of').value;
          var limit = document.getElementById('limit').value;
          var change_factor = document.getElementById('change_factor').value;
          var ceiling = document.getElementById('ceiling').value;
          var cap = document.getElementById('cap').value;
          var copay_amount = document.getElementById('copay_amt').value;
          var sharing = document.getElementById('sharing').value;
          var fund = document.getElementById('fund').value;
          var smart_sync = document.getElementById('smart_sync').value;
          var indemnity = document.getElementById('indemnity').value;


          //provider
          var provider_category = document.getElementById('provider_category').value;
          var provider = document.getElementById('provider').value;
          var provider_copay_amount = document.getElementById('provider_copay_amount').value;
          var restricted = document.getElementById('restricted').value;

          //error array
          var errors = new Array();

          console.log(category);

            if(!category){
                errors.push('Benefits: Category is required');
            }

            if(!benefit){
                errors.push('Benefits: Benefit is required');
            }
            if(!sub_limit_of){
                errors.push('Benefits: Sub limit of category is required');
            }
            if(!limit){
            errors.push('Benefits: Limit is required');
            }
            if(!cap){
                errors.push('Benefits: Ceiling is required');
            }
            if(!copay_amount){
                errors.push('Benefits: Copay amount is required');
            }
            if(!sharing){
                errors.push('Benefits: Sharing is required');
            }

            //validate contact person
            if(!title){
                errors.push('Contact Person: Title is required');
            }
            if(!surname){
                errors.push('Contact Person: Surname is required');
            }
            if(!job_title){
                errors.push('Contact Person: Job Title is required');
            }
            if(!mobile_no){
                errors.push('Contact Person: Mobile Number is required');
            }

            //validate corporate

            if(!corporate){
                errors.push('Corporate: Corporate Name is required');
            }
            if(!scheme){
                errors.push('Corporate: Corporate Scheme is required');
            }
            if(!individual){
                errors.push('Corporate: Individual Name is required');
            }
            // if(!class){
            //     errors.push('Corporate: Corporate Class is required');
            // }
            if(!introducer){
                errors.push('Corporate: Introducer is required');
            }
            if(!bank_gl){
                errors.push('Corporate: Bank GL is required');
            }
            if(!pin_number){
                errors.push('Corporate: pin number is required');
            }
            if(!rmf){
                errors.push('Corporate: Bank GL is required');
            }

            //validate cover dates
            if(!start_date){
                errors.push('Cover Dates: Start date is required');
            }
            if(!agent_id){
                errors.push('Cover Dates: Intermidiary is required');
            }

            //validate provider

          if(provider_category || provider || restricted ||provider_copay_amount != null){
            if(!provider_category){
                errors.push('Corporate Provider: Provider Category is required');
            }
            if(!provider){
                errors.push('Corporate Provider: Provider is required');
            }
            if(!restricted){
                errors.push('Corporate Provider: restricted is required');
            }
            if(!provider_copay_amount){
                errors.push('Corporate Provider: Provider Copay amount is required');
            }

          }


            var html = '';

            console.log(errors);

            //create error strings
            for (let i = 0; i < errors.length; i++) {
                html += '<p style="color:red">' + errors[i] + ' !</p><br>';
            }

            document.getElementById("errorbody").innerHTML = html;

            //show error modal
            if(errors.length > 0){
                $('#errorModal').modal('show');
            }
            else{
                save_corporate_data();
            }


}
