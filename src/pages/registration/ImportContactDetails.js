import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { postData } from "../../components/helpers/Data";
import { Spinner } from "../../components/helpers/Spinner";

const ImportContactDetails = () => {
  const [contact_details, setContactDetails] = useState([]);
  const [memberColumns, setMemberColumns] = useState([]);
  const [buttonHidden, setButtonHidden] = useState({
    save: true,
    extraRow: true,
  });
  let index = 0;

  const readExcel = (file) => {
    document.getElementById("spinner").style.display = "block";
    setButtonHidden({ save: true });
    setContactDetails([]);
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
            columns[0] === "MEMBER_NO" &&
            columns[1] === "TEL_NO" &&
            columns[2] === "MOBILE_NO" &&
            columns[3] === "EMAIL" &&
            columns[4] === "POSTAL_ADD"
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
        setContactDetails(dt);
        setButtonHidden({ ...buttonHidden, extraRow: false, save: false });
      } else {
        document.getElementById("spinner").style.display = "none";
        alert("columns not correct");
      }
    });
  };

  const updateContactDetails = async (e) => {
    e.preventDefault();
    const frmData = new FormData(
      document.getElementById("contact_details_form")
    );

    postData(frmData, "update_contact_details").then((data) => {
        const table = document.querySelector(
            "#contact_details_table tbody"
          ).children;
          data.map((dt) =>{
            console.log(dt)
            for( let i=0; i<table.length; i++){
                const tr = table[i];
                const indexCol = tr.children[0].children[0].value;
                if(indexCol == dt.index){
                    tr.children[6].children[0].value = dt.res;
                    let x = tr.children[6].children[0];
                    if(dt.res.includes("Error")){
                        x.style.backgroundColor = "red";
                        x.style.color = "white";
                    } else{
                        x.style.backgroundColor = "green";
                        x.style.color = "white";
                    }
                }

            }
          });
          document.getElementById("spinner").style.display = "none";
          setButtonHidden({...buttonHidden, save: true });
        
      }).catch((error) => console.log(error));
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
                      name="import_contact_details"
                      id="import_contact_details"
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
                id="contact_details_form"
                onSubmit={updateContactDetails}
              >
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Import Contact Details</h2>
                    <hr />
                    <span className="text-success font-weight-bold">
                      ({contact_details.length}) Contacts uploaded
                    </span>
                    <Spinner />
                  </div>
                  <div className="table table-responsive">
                    <table
                      id="contact_details_table"
                      style={{
                        maxHeight: "300px",
                        tableLayout: "fixed",
                        whiteSpace: "nowrap",
                        width: "150%",
                      }}
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th hidden={buttonHidden.extraRow}>INDEX</th>
                          {memberColumns.map((dt) => {
                            return <th>{dt}</th>;
                          })}
                          <th hidden={buttonHidden.extraRow}>FEEDBACK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (memberColumns.length == 5,
                          contact_details.map((data) => {
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
                                    id="member_no"
                                    name="member_no[]"
                                    placeholder="Member No"
                                    value={data.MEMBER_NO}
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="tel_no"
                                    name="tel_no[]"
                                    placeholder="Tel No"
                                    value={data.TEL_NO}
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="mobile_no"
                                    name="mobile_no[]"
                                    placeholder="Mobile No"
                                    value={data.MOBILE_NO}
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="email"
                                    name="email[]"
                                    placeholder="Email"
                                    value={data.EMAIL}
                                    readOnly
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    id="postal_add"
                                    name="postal_add[]"
                                    placeholder="Postal Address"
                                    value={data.POSTAL_ADD}
                                    readOnly
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
                          }))
                        }
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
    </div>
  );
};

export default ImportContactDetails;
