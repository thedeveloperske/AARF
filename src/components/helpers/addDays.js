import { checkLeapYear } from "./checkLeapYear";

export const addDays = (dt) => {
  const date = new Date(dt);
  const year = new Date(dt).getFullYear();
  date.setDate(date.getDate() + 1); 
  return date;
};

export const addYear = (dt) => {
  const date = new Date(dt);
  const year = new Date(dt).getFullYear();
  if (checkLeapYear(year + 1)) {
    date.setDate(date.getDate() + 365);
  } else {
    date.setDate(date.getDate() + 364);
  }
  return date;
};
