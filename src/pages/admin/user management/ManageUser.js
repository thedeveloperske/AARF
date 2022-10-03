import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const ManageUser = () => {
  const [departments, setDepartments] = useState([]);
  const [userGroup, setUserGroup] = useState([]);
  const [userData, setUserData] = useState([]);
  const [oneUserRowData, setOneUserRowData] = useState([]);
  const [defaultPass, setDefaultPass] = useState([]);
  const [appendedUser, setAppendedUser] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);
  const [username, setUsername] = useState([]);
  const [visibleState, setVisibleState] = useState(false);

  useEffect(() => {
    getData("fetch_departments")
      .then((data) => {
        setDepartments(data);
      })
      .catch((error) => console.log(error));

    getData("fetch_user_group")
      .then((data) => {
        setUserGroup(data);
      })
      .catch((error) => console.log(error));

    getData("fetch_default_password")
      .then((data) => {
        setDefaultPass(data);
      })
      .catch((error) => console.log(error));

    document.getElementById("spinner").style.display = "block";
    getData("fetch_manage_users")
      .then((data) => {
        setUserData(data);
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => console.log(error));
  }, []);

  const getUserRowData = (e) => {
    setOneUserRowData([]);
    setVisibleState(true);
    e.preventDefault();
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.children[0].value);
    });
    document.getElementById("spinner").style.display = "block";
    getOneData("fetch_user_group", arr[0])
      .then((data) => {
        console.log(data);
        setOneUserRowData(data);

        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => console.log(error));
  };

  // append user management row
  const appendUserManagementRow = (e) => {
    setUserData([]);
    setOneUserRowData([]);
    setVisibleState(false);
    e.preventDefault();
    let user = localStorage.getItem("username");
    // append row to the first table
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input
              className="form-control"
              type="text"
              name="user_name_added[]"
              id="user_name_added"
              onInput={toInputUpperCase}
              onChange={(e) => setUsername(e.target.value)}
            />
          </td>
          <td>
            <input
              className="form-control"
              type="password"
              name="user_pass_added[]"
              value={defaultPass.password}
              readOnly
            />
          </td>
          <td>
            <input
              className="form-control"
              type="text"
              name="full_names_added[]"
              style={{ width: "200px" }}
              onInput={toInputUpperCase}
            />
          </td>
          <td>
            <select
              className="form-control"
              name="department_added[]"
              style={{ width: "200px" }}
            >
              <option value="">Select Department</option>
              {departments.map((dt) => {
                return <option value={dt.code}>{dt.department}</option>;
              })}
            </select>
          </td>
          <td>
            <select className="form-control" name="status_added[]">
              <option value="" disabled>
                Select Status
              </option>
              <option value="0">Active</option>
              <option value="1">Deactive</option>
            </select>
          </td>
          <td>
            <input
              className="form-control"
              type="checkbox"
              name="blocked_added[]"
            />
          </td>
          <td>
            <input
              className="form-control"
              type="text"
              name="created_by_added[]"
              value={user}
              readOnly
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeUserManagement(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedUser((appendedUser) => {
      return [...appendedUser, row];
    });
  };
  //remove user management row
  const removeUserManagement = async (id, e) => {
    e.preventDefault();
    setAppendedUser((appendedUser) => {
      return appendedUser.filter((row) => row.id !== id);
    });
  };
  //save user management
  const saveUserManagement = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmUserManagement"));
    const blockCheckbox = document.querySelectorAll(".blocked");
    blockCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("blocked[]", "1");
      } else {
        frmData.append("blocked[]", "0");
      }
    });
    postData(frmData, "save_user_management")
      .then((data) => {
        console.log(data);
        setResponse(data[0]);
        setIsMessageModal(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //close message modal
  const closeMessageModal = () => {
    setIsMessageModal(false);
    setTimeout(function () {
      window.location.replace("/manage-user");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">User Management</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendUserManagementRow}>
            Add
          </button>
          <form id="frmUserManagement" onSubmit={saveUserManagement}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>User Name</th>
                  <th>User Pass</th>
                  <th>Full Names</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Blocked</th>
                  <th>Created By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          name="user_name[]"
                          defaultValue={dt.user_name}
                          onInput={toInputUpperCase}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="password"
                          name="user_pass[]"
                          defaultValue={dt.user_pass}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          name="full_names[]"
                          style={{ width: "200px" }}
                          defaultValue={dt.full_names}
                          onInput={toInputUpperCase}
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="department[]"
                          style={{ width: "200px" }}
                          defaultValue={
                            dt.department == null ? "" : dt.department
                          }
                        >
                          <option value="">Select Department</option>
                          {departments.map((dt) => {
                            return (
                              <option value={dt.code}>{dt.department}</option>
                            );
                          })}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="status[]"
                          defaultValue={dt.status}
                        >
                          <option disabled>
                            Select Status
                          </option>
                          <option value="0">Active</option>
                          <option value="1">Deactive</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control blocked"
                          type="checkbox"
                          defaultValue={dt.blocked}
                          defaultChecked={dt.blocked == 1 ? true : false}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          name="created_by[]"
                          defaultValue={dt.created_by}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-success form-control select"
                          onClick={getUserRowData}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {appendedUser.map((data) => {
                  return <tr key={data.id}>{data.new}</tr>;
                })}
              </tbody>
            </table>
            <Spinner />

            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>User Name</th>
                  <th>User Group</th>
                </tr>
              </thead>
              <tbody>
                {oneUserRowData.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          className="form-control"
                          type="text"
                          name="user_name_row[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.user_name}
                          readOnly
                        />
                      </td>
                      <td>
                        <select
                          name="user_group_row[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.user_group}
                        >
                          <option value="">Select UserGroup</option>
                          {userGroup.map((dt) => {
                            return (
                              <option value={dt.code}>{dt.user_group}</option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                <tr hidden={visibleState}>
                  <td>
                    <input
                      className="form-control"
                      type="text"
                      name="user_name_append[]"
                      style={{ width: "400px" }}
                      value={username}
                      readOnly
                    />
                  </td>
                  <td>
                    <select
                      name="user_group_apped[]"
                      style={{ width: "400px" }}
                    >
                      <option value="">Select UserGroup</option>
                      {userGroup.map((dt) => {
                        return <option value={dt.code}>{dt.user_group}</option>;
                      })}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <Spinner />
            <p>
              <input
                className="btn btn-info col-2"
                type="submit"
                value="save"
              />
            </p>
          </form>
        </div>
      </div>
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

export default ManageUser;
