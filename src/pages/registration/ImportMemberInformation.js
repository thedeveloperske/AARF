import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { postData } from "../../components/helpers/Data";
import { Spinner } from "../../components/helpers/Spinner";
import AccessLogs from "../../components/helpers/AccessLogs";
import ResponseModal from "../../components/helpers/Modal2";

const ImportMemberInformation = () => {
  //save access log
  useEffect(() => {
    const frmData = new FormData();
    frmData.append("username", localStorage.getItem("username"));
    frmData.append("accessed", 11);
    AccessLogs(frmData);
  }, []);
  //module variables
  const [modalIsOpen, setModalIsOpen] = useState(false);
   const [response, setResponse] = useState([]);
  const [member_info, setMemberInfo] = useState([]);
  const [memberColumns, setMemberColumns] = useState([]);
  const [buttonHidden, setButtonHidden] = useState({
    generate: true,
    save: true,
    extraRow: true,
    refresh: true,
  });
  let index = 0;

  const refresh = () => {
    window.location.replace("import-member-info");
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const readExcel = (file) => {
    document.getElementById("spinner").style.display = "block";
    setButtonHidden({ generate: true, save: true, refresh: true });
    setMemberInfo([]);
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
            columns[20] === "bank_account_name" &&
            columns[21] === "bank_account_number" &&
            columns[22] === "kin_names" &&
            columns[23] === "kin_phone_no" &&
            columns[24] === "kin_email_address" &&
            columns[25] === "hc_status"
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
        setMemberInfo(dt);
        setButtonHidden({
          ...buttonHidden,
          extraRow: false,
          generate: false,
          refresh: false,
        });
      } else {
        document.getElementById("spinner").style.display = "none";
        setResponse("Warning, the excel columns are not correct");
        setModalIsOpen(true)
      }
    });
  };
  const validateMemberData = (e) => {
    document.getElementById("spinner").style.display = "block";

    setButtonHidden({
      extraRow: false,
      generate: false,
      save: false,
      refresh: false,
    });
    e.preventDefault();
    const frmData = new FormData(
      document.getElementById("import_member_info_form")
    );

    postData(frmData, "validate_member_data")
      .then((data) => {
        const tbl = document.querySelector(
          "#import_member_info_table tbody"
        ).children;
        for (let i = 0; i < tbl.length; i++) {
          const tr = tbl[i];
          tr.children[1].children[0].value = data[i].family_no;
          tr.children[2].children[0].value = data[i].member_no;
        }
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveMembers = (e) => {
    document.getElementById("spinner").style.display = "block";

    e.preventDefault();
    const frmData = new FormData(
      document.getElementById("import_member_info_form")
    );
    frmData.append("user", localStorage.getItem("username"));
    postData(frmData, "save_member_data")
      .then((data) => {
        const tbl = document.querySelector(
          "#import_member_info_table tbody"
        ).children;
        data.map((dt) => {
          for (let i = 0; i < tbl.length; i++) {
            const tr = tbl[i];
            const indexCol = tr.children[0].children[0].value;
            if (indexCol == dt.index) {
              tr.children[27].children[0].value = dt.res;
              let x = tr.children[27].children[0];
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
        document.getElementById("generate").style.visibility = "hidden";
        document.getElementById("save").style.visibility = "hidden";
      })
      .catch((error) => console.log(error));
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
                      name="import_member_info"
                      id="import_member_info"
                      placeholder="Choose File"
                      aria-required="true"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        readExcel(file);
                      }}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <form className="claims_form mt-1" id="import_member_info_form">
                <fieldset>
                  <div id="invoice_details_1">
                    <p className="fs-title text-info">
                      Import Member Information
                    </p>
                    <hr />
                    <span className="text-success font-weight-bold">
                      Total members to import - [{member_info.length}]
                    </span>
                    <Spinner />
                  </div>
                  <div className="table table-responsive">
                    <table
                      id="import_member_info_table"
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
                        {member_info.map((data) => {
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
                                  value={data.family_no}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="member_no"
                                  name="member_no[]"
                                  value={data.member_no}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="surname"
                                  name="surname[]"
                                  value={data.surname}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="first_name"
                                  name="first_name[]"
                                  value={data.first_name}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="other_names"
                                  name="other_names[]"
                                  value={data.other_names}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="mobile_no"
                                  name="mobile_no[]"
                                  value={data.mobile_no}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="dob"
                                  name="dob[]"
                                  value={data.dob}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="id_no"
                                  name="id_no[]"
                                  value={data.id_no}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="principal_dependant"
                                  name="principal_dependant[]"
                                  value={data.pri_dep}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="gender"
                                  name="gender[]"
                                  value={data.gender}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="health_plan"
                                  name="health_plan[]"
                                  value={data.health_plan}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="option"
                                  name="option[]"
                                  value={data.option}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="corp_id"
                                  name="corp_id[]"
                                  value={data.corp_id}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="family_relation"
                                  name="family_relation[]"
                                  value={data.family_relation}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="employment_no"
                                  name="employment_no[]"
                                  value={data.employment_no}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="idx"
                                  name="idx[]"
                                  value={data.idx}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="start_date"
                                  name="start_date[]"
                                  value={data.start_date}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="end_date"
                                  name="end_date[]"
                                  value={data.end_date}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  id="status"
                                  name="status[]"
                                  value={data.status}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bank_name[]"
                                  value={data.bank_name}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bank_account_name[]"
                                  value={data.bank_account_name}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="bank_account_number[]"
                                  value={data.bank_account_number}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="kin_names[]"
                                  value={data.kin_names}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="kin_phone_no[]"
                                  value={data.kin_phone_no}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="kin_email_address[]"
                                  value={data.kin_email_address}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="hc_status[]"
                                  value={data.hc_status}
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
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
                  {/* Save button */}

                  <p>
                    <button
                      id="generate"
                      className="btn btn-info col-2 form-control"
                      style={{ margin: "2px" }}
                      onClick={validateMemberData}
                      hidden={buttonHidden.generate}
                    >
                      Generate
                    </button>
                    <button
                      id="save"
                      className="btn btn-success col-2 form-control"
                      style={{ margin: "2px" }}
                      onClick={saveMembers}
                      hidden={buttonHidden.save}
                    >
                      Save
                    </button>
                    <button
                      id="generate"
                      className="btn btn-warning col-2 text-white form-control"
                      style={{ margin: "2px" }}
                      onClick={refresh}
                      hidden={buttonHidden.refresh}
                    >
                      Refresh
                    </button>                 
                  </p>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ResponseModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        background="#0047AB"
        body={<p className="text-white h5 text-weight-bold">{response}</p>}
      />
    </div>
  );
};

export default ImportMemberInformation;
