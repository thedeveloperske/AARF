import FormatDate from "./FormatDate";

const CoverDates = async (e) => {
    e.preventDefault();
    //get input date and add 1 yr
    let new_date = await new Date(e.target.value);
    new_date.setFullYear(new_date.getFullYear() + 1);
    new_date.setDate(new_date.getDate() - 1);

    let new_renew_date = new Date(e.target.value);
    new_renew_date.setFullYear(new_renew_date.getFullYear() + 1);

    //inject new date to renewal date and end date
    var renewal_date = document.getElementById('renewal_date');
    var end_date = document.getElementById('end_date');

    end_date.value = FormatDate(new_date);
    renewal_date.value = FormatDate(new_renew_date);
}

export default CoverDates;