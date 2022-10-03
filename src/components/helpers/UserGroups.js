export const userGroups = () => {
  const groups = localStorage.getItem("usergroups");
  const groups_array = JSON.parse(groups);
  return groups_array;
};
