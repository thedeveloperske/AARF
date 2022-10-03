export const today = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;

  return today;
};

export const today2 = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;

  return today;
};

export const currentYear = () => {
  var today = new Date();
  var year = today.getFullYear();


  return year;
};