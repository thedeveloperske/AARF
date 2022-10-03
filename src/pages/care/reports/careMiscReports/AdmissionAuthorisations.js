import React, { useState, useEffect } from "react";
import { getOneData, postData } from "../../../../components/helpers/Data";
import { Spinner } from "../../../../components/helpers/Spinner";
import MessageModal from "../../../../components/helpers/Modal2";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const AdmissionAuthorisations = () => {
  const [address, setAddress] = useState([]);
  const [admissionAuthorization, setAdmissionAuthorization] = useState([]);
  const [period, setPeriod] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);
  const [visibleState, setVisibleState] = useState({
    address: true
  });

  useEffect(() => {
    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
  }, []);

  const fetchReport = (e) => {
    e.preventDefault();

    setPeriod(
      "Period:  " +
        document.getElementById("date_from").value +
        " - " +
        document.getElementById("date_to").value
    );
    const frmData = new FormData(
      document.getElementById("admission_authorisation_frm")
    );
    document.getElementById("spinner").style.display = "block";
    postData(frmData, "fetch_admission_authorisations")
      .then((data) => {
        console.log(data);
        if (data.length === 0) {
          //stop loader
          document.getElementById("spinner").style.display = "none";
          setResponse("Notice! No Records to Retrieve Between This Period.");
          setIsMessageModal(true);
        } else {
          setAdmissionAuthorization(data);
          setVisibleState({ address: false});

          document.getElementById("spinner").style.display = "none";
        }
      })
      .catch((error) => console.log(error));
  };
  //close message modal
  const closeMessageModal = () => {
    setIsMessageModal(false);
  };

  //print to pdf
  const printPdf = (e) => {
    e.preventDefault();

    let page_header = `
    <ul style="list-style-type: none;">
        <li>${address.client_name}</li>
        <li>${address.physical_location}</li>
        <li>${address.box_no}</li>
        <li>${address.tel_cell}</li>
        <li>${address.fax}</li>
        <li>${address.email}</li>
        <li>${address.url}</li>
    </ul>
    `;
    let title = "ADMISSION AUTHORIZATIONS";
    let user = localStorage.getItem("username");
    var tbl = document.getElementById("admission_auth_table_div").innerHTML;

    let j = `
    <div class="row">
    <div class="col-md-4" style="font-weight:bold; text-align: right">${page_header}</div>
    <br><br><br>
    <div class="row">
    <div class="col-md-4" style="font-weight:bold;">${title}</div>
    <div class="col-md-4 ml-auto" style="font-weight:bold; text-align: right">${period}</div>
    </div>
    <div>${tbl}</div>
    <br><br><br>
    <p>Prepared By: ${user}</p>
    <br/>
    <p>Received By: __________________________   Date Received: __________________________</p>
    </div>
    `;

    var val = htmlToPdfmake(j);
    var dd = {
      pageOrientation: "landscape",
      pageMargins: [40, 60, 40, 60],
      content: val,
      pageSize: "A4",
    };
    pdfMake.createPdf(dd).download();
  };
  return (
    <div>
      <div className="row ml-0">
        <h4 className="fs-title">Care Reports - Admission Authorisations</h4>
        <hr />
        <div className="col-md-12">
          <form id="admission_authorisation_frm" onSubmit={fetchReport}>
            <div className="form-group row ml-0">
              <label
                htmlFor="date_from"
                className="col-form-label col-md-0.5 label-right pr-3 pl-3"
              >
                From:
              </label>
              <div className="col-md-2">
                <input
                  className="form-control"
                  type="date"
                  name="from"
                  id="date_from"
                />
              </div>
              <label
                htmlFor="date_to"
                className="col-form-label col-md-0.5 label-right pr-3 pl-3"
              >
                To:
              </label>
              <div className="col-md-2">
                <input
                  className="form-control"
                  type="date"
                  name="to"
                  id="date_to"
                />
              </div>
              <div className="col-md-1">
                <button type="submit" className="btn btn-outline-info btn-sm">
                  Run
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <section id="pay_provider" className="project-tab">
        <div className="row">
          <div className="col-md-12">
            <div className="card mt-0" id={""}>
              <div className={"row "}>
                <div className={"col-md-12"}>
                  <div
                    className="col-md-4 float-right"
                    hidden={visibleState.address}
                  >
                    <h6>{address.client_name}</h6>
                    <h6>{address.physical_location}</h6>
                    <h6>{address.box_no}</h6>
                    <h6>{address.tel_cell}</h6>
                    <h6>{address.fax}</h6>
                    <h6>{address.email}</h6>
                    <h6>{address.url}</h6>
                  </div>
                </div>
              </div>
              <form id={"admission_authorisations_report"}>
                <div className={"row mt-4"}>
                  <div>
                    <div></div>
                  </div>
                  <div className={"col-md-4 float-right ml-auto"}></div>
                </div>
                <div className={"row justify-content-center"} id={"card"}>
                  <div
                    id={"admission_auth_table_div"}
                    className={"table-responsive"}
                  >
                    <table
                      className="table table-bordered table-sm"
                      id="admission_auth_table"
                      style={{ maxHeight: "500px" }}
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th>Code</th>
                          <th>Member No</th>
                          <th>Member Names</th>
                          <th>Date Reported</th>
                          <th>Date Authorized</th>
                          <th>Diagnosis</th>
                          <th>Provider</th>
                          <th>Corporate</th>
                          <th>Admission Date</th>
                          <th>Discharged Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admissionAuthorization.map((dt) => {
                          return (
                            <tr>
                              <td>{dt.code}</td>
                              <td>{dt.member_no}</td>
                              <td>{dt.member_name}</td>
                              <td>{dt.date_reported}</td>
                              <td>{dt.date_authorized}</td>
                              <td>{dt.pre_diagnosis}</td>
                              <td>{dt.provider}</td>
                              <td>{dt.corporate}</td>
                              <td>{dt.admission_date}</td>
                              <td>{dt.discharge_date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row mb-2">
                  <Spinner />
                </div>
                <div className={"row justify-content-center"}>
                  <div className={"col-md-1"}>
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="btn btn-outline-success float-right pl-0 pr-0"
                      table="admission_auth_table"
                      filename="admission_authorizations"
                      sheet="Admission Authorizations "
                      buttonText="Export"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={printPdf}
                  >
                    Print
                  </button>
                </div>
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

export default AdmissionAuthorisations;
