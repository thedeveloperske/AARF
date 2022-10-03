import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../../components/helpers/Data";
import { Spinner } from "../../../../components/helpers/Spinner";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import MessageModal from "../../../../components/helpers/Modal2";

const CorporateNeeds = () => {
  const [corporates, setCorporates] = useState([]);
  const [address, setAddress] = useState([]);
  const [corporateNeeds, setCorporateNeeds] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_corporates").then((data) => {
      setCorporates(data);
    });

    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
  }, []);

  const fetchReport = (e) => {
    e.preventDefault();

    const frmData = new FormData(
      document.getElementById("corporate_needs_form")
    );
    document.getElementById("spinner").style.display = "block";
    postData(frmData, "fetch_corporate_needs")
      .then((data) => {
        console.log(data);
        if (data.length === 0) {
          //stop loader
          document.getElementById("spinner").style.display = "none";
          setResponse("Notice! No Records to Retrieve.");
          setIsMessageModal(true);
        } else {
          setCorporateNeeds(data);
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
    let title = "CORPORATE NEEDS";
    let user = localStorage.getItem("username");
    var tbl = document.getElementById("corporate_needs_table_div").innerHTML;

    let j = `
      <div class="row">
      <div class="col-md-4" style="font-weight:bold; text-align: right">${page_header}</div>
      <br><br><br>
      <div class="row">
      <div class="col-md-4" style="font-weight:bold;">${title}</div>
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
        <h4 className="fs-title">Care Reports - Corporate Needs</h4>
        <hr />
        <div className="col-md-12">
          <form id="corporate_needs_form" onSubmit={fetchReport}>
            <div className="row ml-0">
              <div className="form-group row">
                <label
                  htmlFor="select_task"
                  className="col-form-label col-md-0.5 label-right pr-3 pl-3"
                >
                  Select:
                </label>
                <div className="col-md-4">
                  <select
                    className="form-control"
                    id="corp_id"
                    name="corp_id"
                    defaultValue="0"
                  >
                    <option disabled value="0">
                      Select Corporate
                    </option>
                    {corporates.map((data) => {
                      return (
                        <option value={data.CORP_ID}>{data.CORPORATE}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-1">
                  <button type="submit" className="btn btn-outline-info btn-sm">
                    Run
                  </button>
                </div>
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
                  <div className="col-md-4 float-right">
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
              <form id={"corporate_needs_report"}>
                <div className={"row mt-4"}>
                  <div>
                    <div></div>
                  </div>
                  <div className={"col-md-4 float-right ml-auto"}></div>
                </div>
                <div className={"row justify-content-center"} id={"card"}>
                  <div
                    id={"corporate_needs_table_div"}
                    className={"table-responsive"}
                  >
                    <table
                      className="table table-bordered table-sm"
                      id="corporate_needs_table"
                      style={{ maxHeight: "500px" }}
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th>Corporate</th>
                          <th>Visit No</th>
                          <th>Visit Date</th>
                          <th>Visited By</th>
                          <th>Met With</th>
                          <th>Issue Raised</th>
                        </tr>
                      </thead>
                      <tbody>
                        {corporateNeeds.map((dt) => {
                          return (
                            <tr>
                              <td>{dt.corporate}</td>
                              <td>{dt.visit_no}</td>
                              <td>{dt.visit_date}</td>
                              <td>{dt.visited_by}</td>
                              <td>{dt.met_with}</td>
                              <td>{dt.issue_no}</td>
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
                      table="corporate_needs_table"
                      filename="corporate_needs"
                      sheet="Corporate Needs"
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

export default CorporateNeeds;
