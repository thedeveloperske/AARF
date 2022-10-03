import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { postData } from "../../components/helpers/Data";
import { Spinner } from "../../components/helpers/Spinner";
import MessageModal from "../../components/helpers/Modal2";

const ImportPreloadedMembers = () => {
  const [preloaded_members, setPreloadedMembers] = useState([]);
  const [memberColumns, setMemberColumns] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);
  const [buttonHidden, setButtonHidden] = useState({
    save: true,
    extraRow: true,
  });
  let index = 0;

  const readExcel = (file) => {
    document.getElementById("spinner").style.display = "block";
    setButtonHidden({ save: true });
    setPreloadedMembers([]);
    setMemberColumns([]);
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      if (file) {
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
          const bufferArray = e.target.result;

          const wb = XLSX.read(bufferArray, {
            type: "buffer",
            cellDates: true,
            cellNF: false,
            cellText: false,
          });

          const wsname = wb.SheetNames[0];

          //get column names and validate
          const workbookHeaders = XLSX.read(bufferArray, {
            sheetRows: 1,
          });
          const columns = XLSX.utils.sheet_to_json(
            workbookHeaders.Sheets[wsname],
            { header: 1 }
          )[0];
          if (
            columns[0] === "family_no" &&
            columns[1] === "member_no" &&
            columns[2] === "surname" &&
            columns[3] === "first_name" &&
            columns[4] === "other_names" &&
            columns[5] === "mobile_no" &&
            columns[6] === "dob" &&
            columns[7] === "idno" &&
            columns[8] === "pri_dep" &&
            columns[9] === "gender" &&
            columns[10] === "health_plan" &&
            columns[11] === "option" &&
            columns[12] === "corp_id" &&
            columns[13] === "family_relation" &&
            columns[14] === "employment_no" &&
            columns[15] === "idx" &&
            columns[16] === "start_date" &&
            columns[17] === "end_date" &&
            columns[18] === "status" &&
            columns[19] === "bank_name" &&
            columns[20] === "bank_account_number" &&
            columns[21] === "bank_account_name" &&
            columns[22] === "kin_names" &&
            columns[23] === "kin_phone_no" &&
            columns[24] === "kin_email_address"
          ) {
            const ws = wb.Sheets[wsname];

            const data = XLSX.utils.sheet_to_json(ws, {
              raw: false,
              dateNF: "YYYY-MM-DD",
            });

            setMemberColumns(columns);
            resolve(data);
          } else {
            resolve([]);
          }
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        document.getElementById("spinner").style.display = "none";
      }
    });

    promise.then((dt) => {
      if (dt.length !== 0) {
        document.getElementById("spinner").style.display = "none";
        console.log(dt);
        setPreloadedMembers(dt);
        setButtonHidden({ ...buttonHidden, extraRow: false, save: false });
      } else {
        document.getElementById("spinner").style.display = "none";
        setResponse("Notice! Columns Not Correct");
        setIsMessageModal(true);
      }
    });
  };

  const savePreloadedMembers = async (e) => {
    document.getElementById("spinner").style.display = "block";
    e.preventDefault();
    const frmData = new FormData(
      document.getElementById("preloaded_members_form")
    );
    frmData.append("user", localStorage.getItem("username"));
    postData(frmData, "save_preloaded_members")
      .then((data) => {
        const table = document.querySelector(
          "#preloaded_members_table tbody"
        ).children;
        data.map((dt) => {
          console.log(dt);
          for (let i = 0; i < table.length; i++) {
            const tr = table[i];
            const indexCol = tr.children[0].children[0].value;
            if (indexCol == dt.index) {
              tr.children[26].children[0].value = dt.res;
              let x = tr.children[26].children[0];
              if (dt.res.includes("Error")) {
                x.style.backgroundColor = "red";
                x.style.color = "white";
              } else {
                x.style.backgroundColor = "green";
                x.style.color = "white";
              }
            }
          }
        });
        document.getElementById("spinner").style.display = "none";
        setButtonHidden({ ...buttonHidden, save: true });
      })
      .catch((error) => console.log(error));
  };

  //close message modal
  const closeMessageModal = () => {
    setIsMessageModal(false);
    setTimeout(function () {
        window.location.replace("/import-preloaded-members");
      });
  };

  return (
    <div>
      <section id="information_table" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="row col-md-12" id="step-1">
                <div className="form-group row ml-0">
                  <label
                    className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                    for="member_no"
                  >
                    Import File:
                  </label>
                  <div className="col-md-4 col-sm-4 ">
                    <input
                      type="file"
                      className="form-control"
                      name="import_preloaded_members"
                      id="import_preloaded_members"
                      placeholder="Choose File"
                      aria-required="true"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        readExcel(file);
                      }}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <form
                className="claims_form mt-1"
                id="preloaded_members_form"
                onSubmit={savePreloadedMembers}
              >
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Import Preloaded Members</h2>
                    <hr />
                    <span className="text-success font-weight-bold">
                      ({preloaded_members.length}) Members uploaded
                    </span>
                    <Spinner />
                  </div>
                  <div className="table table-responsive">
                    <table
                      id="preloaded_members_table"
                      style={{
                        maxHeight: "300px",
                        tableLayout: "fixed",
                        whiteSpace: "nowrap",
                        width: "700%",
                      }}
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th hidden={buttonHidden.extraRow}>Index</th>
                          {memberColumns.map((dt) => {
                            return <th>{dt}</th>;
                          })}
                          <th hidden={buttonHidden.extraRow}>Feedback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preloaded_members.map((data) => {
                          index++;
                          return (
                            <tr key={index}>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="index"
                                  name="index[]"
                                  value={index}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="family_no"
                                  name="family_no[]"
                                  placeholder="Family No"
                                  value={data.family_no}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="member_no"
                                  name="member_no[]"
                                  placeholder="Member No"
                                  value={data.member_no}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="surname"
                                  name="surname[]"
                                  placeholder="Surname"
                                  value={data.surname}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="first_name"
                                  name="first_name[]"
                                  placeholder="First Name"
                                  value={data.first_name}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="other_names"
                                  name="other_names[]"
                                  placeholder="Other Names"
                                  value={data.other_names}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="mobile_no"
                                  name="mobile_no[]"
                                  placeholder="Mobile No"
                                  value={data.mobile_no}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="dob"
                                  name="dob[]"
                                  placeholder="DOB"
                                  value={data.dob}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="id_no"
                                  name="id_no[]"
                                  placeholder="Id No"
                                  value={data.idno}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="principal_dependant"
                                  name="principal_dependant[]"
                                  placeholder="Principal Dependant"
                                  value={data.pri_dep}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="gender"
                                  name="gender[]"
                                  placeholder="Gender"
                                  value={data.gender}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="health_plan"
                                  name="health_plan[]"
                                  placeholder="Health Plan"
                                  value={data.health_plan}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="option"
                                  name="option[]"
                                  placeholder="Option"
                                  value={data.option}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="corp_id"
                                  name="corp_id[]"
                                  placeholder="Corp Id"
                                  value={data.corp_id}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="family_relation"
                                  name="family_relation[]"
                                  placeholder="Family Relation"
                                  value={data.family_relation}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="employment_no"
                                  name="employment_no[]"
                                  placeholder="Employment No"
                                  value={data.employment_no}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="idx"
                                  name="idx[]"
                                  placeholder="IDX"
                                  value={data.idx}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="start_date"
                                  name="start_date[]"
                                  placeholder="Start Date"
                                  value={data.start_date}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="end_date"
                                  name="end_date[]"
                                  placeholder="End Date"
                                  value={data.end_date}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="status"
                                  name="status[]"
                                  placeholder="Status"
                                  value={data.status}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="bank_name"
                                  name="bank_name[]"
                                  placeholder="Bank Name"
                                  value={data.bank_name}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="bank_account_number"
                                  name="bank_account_number[]"
                                  placeholder="Account No"
                                  value={data.bank_account_number}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="bank_account_name"
                                  name="bank_account_name[]"
                                  placeholder="Account Name"
                                  value={data.bank_account_name}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="kin_names"
                                  name="kin_names[]"
                                  placeholder="Kin Names"
                                  value={data.kin_names}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="kin_phone_no"
                                  name="kin_phone_no[]"
                                  placeholder="Kin Phone No"
                                  value={data.kin_phone_no}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="kin_email"
                                  name="kin_email[]"
                                  placeholder="Kin Email"
                                  value={data.kin_email}
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="feedback"
                                  name="feedback[]"
                                  readOnly
                                  style={{ fontSize: "15px" }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <hr />
                  {/* Save button */}
                  <input
                    type="submit"
                    className="action-button btn-success col-md-4 ml-auto"
                    value="Save"
                    hidden={buttonHidden.save}
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
export default ImportPreloadedMembers;
