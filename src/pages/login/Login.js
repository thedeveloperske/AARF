import React, { useState } from "react";
import ReactDom from "react-dom";
import App from "../../App";
import { BrowserRouter } from "react-router-dom";
import { postData } from "../../components/helpers/Data";
import Modal2 from "../../components/helpers/Modal2";

export const Login = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [feedback, setFeedback] = useState([]);

  const loginUser = (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("login_form"));
    postData(formData, "fetch_users")
      .then((data) => {
        if (data.user.length !== 0) {
          saveDataInStorage(data);
        } else {
          setFeedback(["Sorry, password or username is incorrect!"]);
          setModalIsOpen(true);
        }
      })
      .catch((error) => console.log(error));
  };

  const saveDataInStorage = (data) => {
    if (typeof Storage !== "undefined") {
      localStorage.setItem("username", data.user[0].user_name);
      localStorage.setItem("fullname", data.user[0].full_names);
      localStorage.setItem("usergroups", JSON.stringify(data.user_group));
      ReactDom.render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
        document.getElementById("root")
      );
    } else {
      setFeedback(["Sorry, something went wrong, please contact admin"]);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <a className="hiddenanchor" id="signin"></a>

      <div className="login_wrapper">
        <div className="animate form login_form">
          <section className="login_content">
            <form id="login_form" onSubmit={loginUser}>
              <h1>
                <span className="display-5 text-success font-weight-bold">
                  HAIS
                </span>
                <span className="display-5 text-info font-italic">
                  Experience
                </span>
              </h1>
              <div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  required={true}
                  name="username"
                />
              </div>
              <div>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  required={true}
                  name="password"
                />

                <p style={{ color: "red" }}></p>
              </div>
              <div>
                <button type="submit" className="btn btn-info form-control">
                  Log in
                </button>
              </div>

              <div className="clearfix"></div>
              <div>
                <p>©2021 All Rights Reserved.</p>
              </div>
              <div className="separator"></div>
            </form>
          </section>
        </div>
      </div>
      <Modal2
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        body={
          <span className="h4 text-white font-weight-bold text-center">
            {feedback}
          </span>
        }
        background={
          feedback.length > 0
            ? feedback[0].includes("Sorry")
              ? "#d9534f"
              : "#105878"
            : ""
        }
      />
    </div>
  );
};

export default Login;
