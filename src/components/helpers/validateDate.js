import FormatDate2 from "./FormatDate2";

export const validateDate = (dateString2) => {
    const dateString = FormatDate2(dateString2);
    let dateformat = /^\d{2}([./-])\d{2}\1\d{4}$/

    // Match the date format through regular expression      
    if(dateString.match(dateformat)){
        let operator = dateString.split('-');

        // Extract the string into month, date and year
        let datepart = [];
        if (operator.length>1){
            datepart = dateString.split('-');
        }
        let day = parseInt(datepart[0]);
        let month = parseInt(datepart[1]);
        let year = parseInt(datepart[2]);
        return [day, month, year];
    }
}