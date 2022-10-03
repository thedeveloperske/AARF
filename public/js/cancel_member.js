var loader = document.getElementById('overlay');

var corporate_id;

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

// $Corp_id = document.getElementById("select-corporate").value;
//         $html = '';
//         $members.forEach()
//         if($members.corp_id == $Corp_id) {
//             $html += '<option value="'+ $membersName['member_no']+ '">' + $membersName['member_no']+'</option>';
//         }
//         document.getElementById("select-member").innerHTML = html;
}

//populate member names in dropdown after selecting corporate
function populateMemberNames(member_data){
    var members_dropdown_options = '';

    for (var i = 0;i < member_data.length; i++){
        var options = '<option value='+ member_data[i]['member_no'] +'>'+ member_data[i]['surname'] +' '+ member_data[i]['first_name'] +'</option>';
        members_dropdown_options+=options;
    }

    document.getElementById("select-member").innerHTML = members_dropdown_options;

}

//fills the corporate input field after selecting
function getCorporateName(){
    $corporate_name = document.getElementById('select-corporate').value;
    document.getElementById('corporate_name').value=$corporate_name;
    document.getElementById('corporate_name').readOnly=true;
}
function getMemberName(){
    $member_name = document.getElementById('select-member').value;
    document.getElementById('member_no').value=$member_name;
    document.getElementById('member_no').readOnly=true;
}
function CancelMember(){

    //select properties
    var select = document.getElementById('member_no');

    //member_no
    member_no =  select.value;

    //member name
    var member_name = document.getElementById('member_name');

    if(!member_no){
        $('#cancelCorporateError').modal('show');
    }
    else{

        //set member name
        member_name.value = select.options[select.selectedIndex].text;

        //start loader
        loader.style.display = 'block';
        fetchData(member_no);
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
function persistCancelMember(){

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content')
        }
    });

    //data
    var member_no = member_no;
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
            member_no:member_no,
            date_cancelled:date_cancelled,
            anniv:anniv,
            cancellation_reason:cancellation_reason,
            user_id:user_id,
            date_entered:date_entered
        }

        $.ajax({
            type:'POST',
            url:'cancel_member',
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
