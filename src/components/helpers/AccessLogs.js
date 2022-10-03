import { postData } from "./Data";

const AccessLogs = (frmData) => {
  postData(frmData, "save_access_logs")
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export default AccessLogs;
