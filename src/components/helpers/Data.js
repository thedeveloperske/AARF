const mainUrl = "http://127.0.0.1:8000/api/";

export const postData = async (formData, route) => {
  const url = mainUrl + route;
  const options = {
    method: "POST",
    body: formData,
  };

  const response = await fetch(url, options);
  if (response.status >= 200 && response.status <= 299) {
    const data = await response.json();
    return data;
  } else {
    // throw new Error(response.statusText);
    return "Error while accessing data. Please contact the admin...";
  }
};

export const getData = async (route) => {
  const response = await fetch(mainUrl + route);
  if (response.status >= 200 && response.status <= 299) {
    const data = await response.json();
    return data;
  } else {
    return "Error while accessing data. Please contact the admin...";
  }
};

export const getOneData = async (route, path) => {
  const response = await fetch(mainUrl + route + "/" + path);
  if (response.status >= 200 && response.status <= 299) {
    const data = await response.json();
    return data;
  } else {
    return "Error while accessing data. Please contact the admin...";
  }
};

export const getTwoData = async (route, value1, value2) => {
  const response = await fetch(mainUrl + route + "/" + value1 + "/" + value2);
  if (response.status >= 200 && response.status <= 299) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(response.statusText);
  }
};
