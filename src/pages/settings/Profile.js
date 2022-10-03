import React, { useState, useEffect } from "react";
import { postData } from "../../components/helpers/Data";
import MessageModal from "../../components/helpers/Modal2";

const Profile = () => {
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  let user = localStorage.getItem("username");
  const savePasswordChange = (e) => {
    e.preventDefault();
    const frmData = new FormData(
      document.getElementById("change_password_form")
    );
    postData(frmData, "save_profile_password_change")
      .then((data) => {
        console.log(data);
        if (data[0].length === 0) {
            setResponse("Entered The Correct Existing Password!");
            setIsMessageModal(true);
        } else {
          setResponse(data[1]);
        setIsMessageModal(true);
        }
      })
      .catch((error) => console.log(error));
  };
  //close message modal
  const closeMessageModal = () => {
    setIsMessageModal(false);
    setTimeout(function () {
        window.location.replace("/profile");
      });
  };

  return (
    <div>
      <section id="changepassword" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <hr />
              <form
                className="claims_form mt-1"
                id="change_password_form"
                onSubmit={savePasswordChange}
              >
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Password Change</h2>
                    <hr />
                  </div>
                  <div className="row col-md-12" id="step-1">
                    <div className="form-group row ml-0">
                      <label
                        for="username"
                        className="col-form-label col-md-3 label-align text-center pr-0 pl-0"
                      >
                        Existing User Name:
                      </label>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          id="username"
                          placeholder="Username"
                          aria-required="true"
                          value={user}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="existing_password"
                        className="col-form-label col-md-3 label-align text-center pr-0 pl-0"
                      >
                        Existing Password:
                      </label>
                      <div className="col-md-6">
                        <input
                          type="password"
                          className="form-control"
                          name="existing_password"
                          id="existing_password"
                          placeholder="Existing Password"
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="new_password"
                        className="col-form-label col-md-3 label-align text-center pr-0 pl-0"
                      >
                        New Password:
                      </label>
                      <div className="col-md-6">
                        <input
                          type="password"
                          className="form-control"
                          name="new_password"
                          id="new_password"
                          placeholder="New Password"
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="confirm_new_password"
                        className="col-form-label col-md-3 label-align text-center pr-0 pl-0"
                      >
                        Confirm New Password:
                      </label>
                      <div className="col-md-6">
                        <input
                          type="password"
                          className="form-control"
                          name="confirm_new_password"
                          id="confirm_new_password"
                          placeholder="Confirm New Password"
                          aria-required="true"
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* Save button */}
                  <input
                    type="submit"
                    className="action-button btn-success col-md-4 ml-auto"
                    value="Save"
                  />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/*Message modal*/}
      <MessageModal
        modalIsOpen={messageModal}
        closeModal={closeMessageModal}
        background="#0047AB"
        body={<p className="text-white font-weight-bold h4">{response}</p>}
      />
    </div>
  );
};

export default Profile;
