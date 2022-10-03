import React, { useState, useEffect } from "react";
import { getOneData, postData } from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const RejectionRate = () => {
  const [rejectionRate, setRejectionRate] = useState([]);
    const [address, setAddress] = useState([]);
    const [visibleState, setVisibleState] = useState({
      address: true,
      print: true,
      excel: true,
    });

    useEffect(() => {
      getOneData("fetch_client_address", 4).then((data) => {
        setAddress(data[0]);
      });
    }, []);

  const fetchReport = (e) =>{
    e.preventDefault();

    const frmData = new FormData(document.getElementById('rejection_rate_frm'));
    document.getElementById('spinner').style.display = 'block';
      postData(frmData, 'fetch_rejection_rates').then((data) =>{
        console.log(data);
        setRejectionRate(data);
        setVisibleState({ address: false, save: false, excel: false });

        document.getElementById("spinner").style.display = "none";
    }).catch((error) => console.log(error));

  }

    const printPdf = (e) => {
      e.preventDefault();

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

      let title = "REJECTION RATE";
      let user = localStorage.getItem("username");
      var tbl = document.getElementById("rejection_rate_div").innerHTML;

      let j = `
  <div class="row">
  <div class="col-md-4" style="font-weight:bold;">${page_header}</div>
  <br><br><br>
  <div class="row">
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
        <h4 className="fs-title">Bills Reports - Rejection Rate</h4>
        <hr />
        <div className="col-md-12">
          <form id="rejection_rate_frm" onSubmit={fetchReport}>
            <div className="form-group row ml-0">
              <label
                htmlFor="date_from"
                className="col-form-label col-md-0.5 label-right pr-3 pl-3"
              >
                From:
              </label>
              <div className="col-md-2">
                <input className="form-control" type="date" name="from" />
              </div>
              <label
                htmlFor="date_to"
                className="col-form-label col-md-0.5 label-right pr-3 pl-3"
              >
                To:
              </label>
              <div className="col-md-2">
                <input className="form-control" type="date" name="to" />
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
      <section id="rejection_rate" className="project-tab">
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
            <div className="card mt-0">
              <form>
                <div
                  className="row justify-content-center"
                  id="rejection_rate_div"
                >
                  <table
                    className="table table-bordered table-sm"
                    id="rejection_rate_report_table"
                    style={{ maxHeight: "500px" }}
                  >
                    <thead className="thead-dark">
                      <tr>
                        <th className={"pr-2 pl-2"}>Provider</th>
                        <th className={"pr-2 pl-2"}>Invoiced Amount</th>
                        <th className={"pr-3 pl-3"}>Not Payable</th>
                        <th className={"pr-5 pl-5"}>Rejection Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rejectionRate.map((dt) => {
                        return (
                          <tr>
                            <td>{dt.provider}</td>
                            <td>{dt.invoiced_amount}</td>
                            <td>{dt.non_payable}</td>
                            <td>{dt.rejection_rate}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="row">
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
                      table="rejection_rate_report_table"
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

export default RejectionRate;
