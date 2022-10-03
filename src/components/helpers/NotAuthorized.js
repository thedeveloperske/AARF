import React from "react";

const NotAuthorized = () => {
  return (
    <div className="row">
      <div className="col-md-12 ">
        <p>
          <img src="images/danger.png" height="300px" />
        </p>
        <p className="text-danger h2 font-weight-bold">
          Sorry, you are not authorized to view this page.
        </p>
        <p className="text-danger h2 font-weight-bold">
          Contact Admin for more information!
        </p>
      </div>
    </div>
  );
};

export default NotAuthorized;
