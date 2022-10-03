var loader = document.getElementById('overlay');

var corporate_id;

function reinstateCorporate(){
  
    //select properties
    var select = document.getElementById('select-corporate');

    //corporate id
    corporate_id =  select.value;
    
    //corporate name
    var corporate_name = document.getElementById('corporate_name');

    if(!corporate_id){
        $('#cancelCorporateError').modal('show');
    }
    else{

        //set corpoate name
        corporate_name.value = select.options[select.selectedIndex].text;

        //start loader
        loader.style.display = 'block';
        fetchData(corporate_id);
    }

}

function fetchData(id){

    var members_url = 'api/fetch_members/'+id;
    var anniversary_url = 'api/query/corp_anniversary/'+id;

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
        }
    });

    
    $.when(
        $.ajax({
            url: members_url,
            type: 'GET',
            dataType:'JSON'
        }),
        $.ajax({
            url:anniversary_url,
            type:'GET',
            dataType:'JSON'
        })
    )
    .then(function(members_data,anniversary_data){

        //stop loader
        loader.style.display = 'none';

        updateData(members_data,anniversary_data);
    });
}

function updateData(members_data, anniversary_data){
    populateMembersData(members_data);
    populateAnniversaryData(anniversary_data);
}

function populateMembersData(members_data){

    var members_table = document.getElementById('members-table');

    var total_members = members_data[0].length;

    var corporate_statistics_row =
    '<tr>'+
    '<td style="font-size:12px"; align="center">'+total_members+'</td>'+
    '<td style="font-size:12px"; align="center">'+12+'</td>'+
    '<td style="font-size:12px"; align="center">'+12+'</td>'+
    '</tr>';

    members_table.insertRow(1).innerHTML = corporate_statistics_row;

}

function populateAnniversaryData(anniversary_data){

    var anniv_table = document.getElementById('prev-anniv-table');

    console.log();

    //set hiddden inputs
    document.getElementById('anniv').value = anniversary_data[0][anniversary_data[0].length-1]['anniv'];
    document.getElementById('date_entered').value = formatDate(anniversary_data[0][anniversary_data[0].length-1]['date_entered']);
    document.getElementById('user_id').value = anniversary_data[0][anniversary_data[0].length-1]['user_id'];

    for(var i = 0; i< anniversary_data[0].length;i++){
        anniv_table.insertRow(1).innerHTML =
        '<tr>'+
        '<td style="font-size:12px;" align="center">'+anniversary_data[0][i]['anniv']+'</td>'+
        '<td style="font-size:12px;" align="center">'+anniversary_data[0][i]['agent_id']+'</td>'+
        '<td style="font-size:12px;" align="center">'+formatDate(anniversary_data[0][i]['start_date'])+'</td>'+
        '<td style="font-size:12px;" align="center">'+formatDate(anniversary_data[0][i]['end_date'])+'</td>'+
        '<td style="font-size:12px;" align="center">'+formatDate(anniversary_data[0][i]['renewal_date'])+'</td>'+
        '</tr>';
    }
}


//persist changes
function persistReinstateCorporate(){

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
        }
    });

    //data
    var corp_id = corporate_id;
    var date_cancelled = formatDate(document.getElementById('date_cancelled').value);
    var anniv = document.getElementById('anniv').value;
    var cancellation_reason = document.getElementById('cancellation_reason').value;
    var user_id = document.getElementById('user_id').value;
    var date_entered = document.getElementById('date_entered').value;

    if(!date_cancelled || !cancellation_reason){
        $('#errorModal').modal('show');
    }
    else{

        loader.style.display = 'block';

        var formData = {
            corp_id:corp_id,
            date_cancelled:date_cancelled,
            anniv:anniv,
            cancellation_reason:cancellation_reason,
            user_id:user_id,
            date_entered:date_entered
        }

        console.log(formData);
    
        $.ajax({
            type:'POST',
            url:'reinstate_corporate',
            data:formData,
            success:function(response){
                loader.style.display = 'none';
    
                //show modal
                $('#successModal').modal('show');
                console.log(response);
    
            },
            error:function(response){
                loader.style.display = 'none';
                console.log(response);
            }
        });
    }
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
