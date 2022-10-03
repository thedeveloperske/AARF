var loader = document.getElementById('overlay');


function coverDates(date){
    //fetch date and add one year to it

    var new_date = new Date(date.target.value);
    new_date.setFullYear(new_date.getFullYear() + 1);

    //inject new date to renewal date and end date
    var end_date = document.getElementById('end_date');
    var renewal_date = document.getElementById('renewal_date');

    end_date.value = formatDate(new_date);
    renewal_date.value = formatDate(new_date);

}

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

// add contact person row
function addContactPersonRow(){

    $.get('api/fetchTitles', function(title_response){

        //start loader
        loader.style.display = "block";

        let options_string = '';

            for(var i = 0; i < title_response.length;i++){
                var option = '<option value = "' + title_response[i]['code'] +'">'+title_response[i]['title']+'</option>';
                options_string += option;
            }

        $.get('api/fetchContactRelations',function(contact_relation_response){

            let job_title_options_string = '';

            for(var i = 0; i < contact_relation_response.length;i++){
                var option = '<option value = "' + contact_relation_response[i]['code'] +'">'+contact_relation_response[i]['relation']+'</option>';
                job_title_options_string += option;
            }

            //pass options data to insertRow function
            insertContactPersonRow(options_string,job_title_options_string);

        });
    });

}

//insert contact person row
function insertContactPersonRow(title_options_string, job_title_options_string){

    //stop loader
    loader.style.display = "none";

    let corp_contact_person_table = document.getElementById('contact_person_table');

   
    let new_row = '<tr><td> <select class="form-control" name="title[]"><option selected="true">Select Title</option>'+ title_options_string +'</select></td><td> <input id="surname" class="form-control col" type="text" name="surname[]" placeholder="Surname"></td><td> <input id="first-name" class="form-control col" type="text" name="first_name[]" id="first-name" placeholder="First Name"></td><td> <input id="other-name" class="form-control col" type="text" name="other_names[]" placeholder="Other Names"></td><td> <select class="form-control" name="job_title[]"><option selected="true">Select Job Title'+ job_title_options_string +'</select></td><td> <input id="mobile-no" class="form-control col" type="tel" name="mobile_no[]" placeholder="Mobile No"></td><td> <input id="tel-no" class="form-control col" type="tel" name="tel_no[]" placeholder="Telephone No"></td><td> <input id="email" class="form-control col" type="email" name="email[]" placeholder="Email Address"></td><td><input class="btn btn-danger" type="text" value="delete" onclick="deleteRow(this)"/></td></tr>';      
        
    corp_contact_person_table.insertRow().innerHTML = `${new_row}`;

}


//add benefits row
function addBenefitsRow(){

    $.get('api/fetchBenefits', function(benefits_response){

        //start loader
        loader.style.display = "block";

        let benefits_options = '';

        for(var i = 0;i < benefits_response.length; i++){
            var option = '<option value = "' + benefits_response[i]['code'] +'">'+benefits_response[i]['benefit']+'</option>';

            benefits_options += option;

        }

        $.get('api/fetchCategories', function(categories_response){
            let categories_options = '';

            console.log(categories_response);

            for(var i = 0;i < categories_response.length; i++){
                var option = '<option value = "' + categories_response[i]['category'] +'">'+categories_response[i]['description']+'</option>';

                categories_options += option;
            }

            //insert new row
            insertBenefitsRow(benefits_options,categories_options);
        });
    })

}

//insertBenefit row
function insertBenefitsRow(benefits_options, categories_options){
    //stop loader
    loader.style.display = "none";

    let benefits_table = document.getElementById('benefits_table');

    let new_row = '<tr><input class="form-control col" type="hidden" name="idx[]" id="idx"><td> <input class="form-control col" type="number" name="anniv[]" placeholder="Anniv" disabled=true></td><td> <select class="form-control" name="category[]"><option selected="true">Select Category' + categories_options + '</select></td><td> <select class="form-control" name="benefit[]"><option selected="true">Select Benefit</option> '+ benefits_options + '</select></td><td> <select class="form-control" name="sub_limit_of[]"><option selected="true">Select Main Benefit</option>' +benefits_options+ '</select></td><td> <input id="limit-amt" class="form-control col" type="number" name="limit[]" placeholder="Limit"></td><td> <input id="change-factor" class="form-control col" type="number" name="change_factor[]" placeholder="Change Factor"></td><td> <input id="ceiling" class="form-control col" type="number" name="ceiling[]" placeholder="Ceiling"></td><td> <input id="cap" class="form-control col" type="number" name="cap[]" placeholder="Cap"></td><td> <input id="copay-amt" class="form-control col" type="number" name="copay_amount[]" placeholder="Copay Amount"></td><td> <select class="form-control" name="sharing[]"><option selected="true">Select Sharing</option><option value="1">PP</option><option value="2">PF</option> </select></td><td> <select class="form-control" name="fund[]"><option selected="true">Select Fund</option><option value="1">Y</option><option value="0">N</option> </select></td><td> <select class="form-control" name="indemnity[]"><option selected="true">Select Indemnity</option><option value="1">Y</option><option value="0">N</option> </select></td><td><input class="btn btn-danger" type="text" value="delete" onclick="deleteRow(this)"/></td></tr>';
   

    benefits_table.insertRow(1).innerHTML = `${new_row}`;
}


//change number of rows

// document.getElementById('sel1').addEventListener('change',function(){
//     console.log('selected');
//   $("#benefits_table tbody tr").removeClass('hidden');
//   $("#benefits_table tbody tr:gt("+(this.value-1)+")").addClass('hidden');
// });


//delete row
function deleteRow(e) {
    var row = e.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }