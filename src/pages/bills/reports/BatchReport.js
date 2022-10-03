import React, { useState, useEffect } from "react";
import { Spinner } from "../../../components/helpers/Spinner";
import { getOneData, getData, postData } from "../../../components/helpers/Data";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const BatchReport = () => {
  const [providers, setProviders] = useState([]);
  const [address, setAddress] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [hidden, setHidden] = useState({
    provider: true,
  });
  const [visibleState, setVisibleState] = useState({
    address: true,
    print: true,
    excel: true,
  });

  useEffect(() => {
    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
    getData("fetch_providers").then((data) => {
      setProviders(data);
    });
  }, []);

  const selectedOption = () => {
    const option = document.getElementById("option").value;
    switch (option) {
      case "1":
        setHidden({
          provider: false,
        });
        break;
      case "2":
        setHidden({
          provider: true,
        });
        break;
      default:
        setHidden({
          provider: true,
        });
        break;
    }
  };

  const fetchReport = (e) =>{
    e.preventDefault();
    setBatchData([]);

    const frmData = new FormData(document.getElementById('batch_report_form'));
    document.getElementById('spinner').style.display = 'block';
      postData(frmData, 'fetch_batch_report').then((data) =>{
        console.log(data);
        setBatchData(data);
        setVisibleState({ address: false, save: false, excel: false });

        document.getElementById("spinner").style.display = "none";
    }).catch((error) => console.log(error));

  }

  const printPdf = (e) => {
    e.preventDefault();

      let from = document.getElementById("from").value;
      let to = document.getElementById("to").value;
      let period = `Period: ${from} - ${to}`;

    let page_header = `
    <ul style="list-style-type: none">
      <li>${address.client_name}</li>
      <li>${address.physical_location}</li>
      <li>${address.box_no}</li>
      <li>${address.tel_cell}</li>
      <li>${address.fax}</li>
      <li>${address.email}</li>
      <li>${address.url}</li>
    </ul>
  `;

        let title = "BATCH REPORT";
        let user = localStorage.getItem("username");
        var tbl = document.getElementById("batch_report_div").innerHTML;

        let j = `
  <div class="row">
  <div class="col-md-4" style="font-weight:bold;">${page_header}</div>
  <br><br><br>
  <div class="row">
    <p>
    <span style="text-align:right;">${period}</span>
    </p>
  <div class="col-md-4" style="font-weight:bold;">${title}</div>
  <div class="col-md-4 ml-auto" style="font-weight:bold; text-align: right"></div>
  </div>
  <div>${tbl}</div>
  <br><br><br>
  <p>Prepared By: ${user}</p>
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
        <h4 className="fs-title">Bills Reports - Batching Report</h4>
        <hr />
        <div className="col-md-12">
          <form id="batch_report_form" onSubmit={fetchReport}>
            <div className="row ml-0">
              <div className="form-group row">
                <label
                  htmlFor="select_task"
                  className="col-form-label col-md-0.5 label-right pr-3 pl-3"
                >
                  Task:
                </label>
                <div className="col-md-2">
                  <select
                    className="form-control"
                    id="option"
                    name="option"
                    defaultValue="0"
                    onChange={selectedOption}
                  >
                    <option disabled value="0">
                      Select Option
                    </option>
                    <option value={1}>Provider</option>
                    <option value={2}>All Providers</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-control"
                    id="provider"
                    name="provider"
                    defaultValue="0"
                    hidden={hidden.provider}
                  >
                    <option disabled value="0">
                      Select Provider
                    </option>
                    {providers.map((data) => {
                      return <option value={data.CODE}>{data.PROVIDER}</option>;
                    })}
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    id="from"
                    maxLength="4"
                    max="9999-12-31"
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    id="to"
                    maxLength="4"
                    max="9999-12-31"
                  />
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
      <section id="batch_report" className="project-tab">
        <div className="col-md-4 float-right" hidden={visibleState.address}>
          <h6>{address.client_name}</h6>
          <h6>{address.physical_location}</h6>
          <h6>{address.box_no}</h6>
          <h6>{address.tel_cell}</h6>
          <h6>{address.fax}</h6>
          <h6>{address.email}</h6>
          <h6>{address.url}</h6>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card mt-0" id="">
              <form id="batch_report_frm">
                <div className="row mt-4">
                  <div>{/* <div>{title}</div> */}</div>
                  <div className="col-md-4 float-right ml-auto">
                    {/* {period} */}
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div id="batch_report_div">
                    <table
                      className="table table-bordered table-sm"
                      id="batch_report_table"
                      style={{ maxHeight: "500px" }}
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th>Batch Date</th>
                          <th>Batch No</th>
                          <th>Provider</th>
                          <th>Invoice No</th>
                          <th>Original Cnt</th>
                          <th>Fin Count</th>
                          <th>Batch Amount</th>
                          <th>Status</th>
                          <th>Date Entered</th>
                          <th>Amount Entered</th>
                          <th>Entrant</th>
                          <th>Vetter</th>
                          <th>Amount Payable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchData.map((dt) => {
                          return (
                            <tr>
                              <td>{dt.batch_date}</td>
                              <td>{dt.batch_no}</td>
                              <td>{dt.provider}</td>
                              <td>{dt.invoice_no}</td>
                              <td>{dt.original_cnt}</td>
                              <td>{dt.fin_count}</td>
                              <td>{dt.batch_amount}</td>
                              <td>{dt.status}</td>
                              <td>{dt.date_entered}</td>
                              <td>{dt.amount_entered}</td>
                              <td>{dt.user_id}</td>
                              <td>{dt.vetter}</td>
                              <td>{dt.amount_payable}</td>
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
                <hr />
                <div className="row justify-content-center">
                  <button
                    type="button"
                    className="action-button btn-outline-info btn-sm col-md-1"
                    onClick={printPdf}
                    hidden={visibleState.print}
                  >
                    Print
                  </button>
                  <button
                    type="button"
                    className="action-button btn-outline-info btn-sm col-md-1"
                    hidden={visibleState.excel}
                  >
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      table="batch_report_table"
                      filename="tablexls"
                      sheet="tablexls"
                      buttonText="Excel"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BatchReport;
