import React, { useState, useEffect } from "react";
import { getOneData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const PremiumRegister = () => {
  const [address, setAddress] = useState([]);
  const [report, setReport] = useState([]);
  const [totals, setTotals] = useState([]);

  useEffect(() => {
    getOneData("fetch_client_address", 4)
      .then((data) => {
        setAddress(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchReport = () => {
    setReport([]);
    setTotals([]);
    document.getElementById("spinner").style.display = "block";
    const frmData = new FormData(document.getElementById("premiumRegisterFrm"));
    postData(frmData, "fetch_premium_register")
      .then((data) => {
        setReport(data.body);
        setTotals(data.totals);
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("spinner").style.display = "none";
      });
  };

  const printPdf = () => {
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
    let tbl = document.getElementById("pdf").innerHTML;
    let html = `
    <div class="row">
    <div class="col-md-4" style="text-align:right;font-weight:bold;">${page_header}</div>
    <br><br><br>
    <div>${tbl}</div>
    <br><br><br>   
    </div>
    `;
    var val = htmlToPdfmake(html);
    var dd = {
      pageOrientation: "landscape",
      pageMargins: [40, 60, 40, 60],
      content: val,
      pageSize: "A2",
    };
    pdfMake.createPdf(dd).download();
  };
  return (
    <div>
      {/* <div className="container"> */}
      <p className="text-info h2">Premium Register</p>
      <hr />
      <form id="premiumRegisterFrm">
        <div className="row">
          <div className="col-md-2">
            <input className="form-control" type="date" name="from" />
          </div>
          <div className="col-md-2">
            <input className="form-control" type="date" name="to" />
          </div>

          <div className="col-md-2">
            <input
              className="btn btn-info"
              type="button"
              value="Run"
              onClick={fetchReport}
            />
          </div>
        </div>
      </form>
      <div className="card">
        <div className="row" style={{ margin: "20px" }}>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-info"
            table="valid_members_with_limits"
            filename="tablexls"
            sheet="tablexls"
            buttonText="Excel"
          />
          <button
            className="btn btn-warning col-1"
            onClick={printPdf}
            style={{ marginLeft: "20px" }}
          >
            Print
          </button>
        </div>
        {/* insert report table */}
        <div id="pdf">
          <table
            className="table table-sm table-bordered table-striped"
            style={{ maxHeight: "500px" }}
            id="valid_members_with_limits"
          >
            <thead className="thead-dark">
              <tr>
                <th>Plan</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Corporate</th>
                <th>Policy No</th>
                <th>Debit No</th>
                <th>Premium</th>
                <th>Comm Rate %</th>
                <th>Commission</th>
                <th>Override</th>
                <th>Total Commission</th>
                <th>Cover Type</th>
                <th>Premium Type</th>
                <th>Agent Broker</th>
                <th>Channel</th>
                <th>Upr</th>
              </tr>
            </thead>
            <tbody>
              {report.map((dt) => {
                return (
                  <tr>
                    <td>{dt.plan}</td>
                    <td>{dt.start_date}</td>
                    <td>{dt.end_date}</td>
                    <td>{dt.corporate}</td>
                    <td>{dt.policy_no}</td>
                    <td>{dt.debit_no}</td>
                    <td>{dt.premium}</td>
                    <td>{dt.comm_rate}</td>
                    <td>{dt.commission}</td>
                    <td>{dt.override}</td>
                    <td>{dt.total_commission}</td>
                    <td>{dt.cover_type}</td>
                    <td>{dt.premium_type}</td>
                    <td>{dt.agent_broker}</td>
                    <td>{dt.channel}</td>
                    <td>{dt.upr}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>{totals.ttl_premium}</th>
                <th></th>
                <th>{totals.ttl_commission}</th>
                <th>{totals.ttl_override}</th>
                <th>{totals.ttl_ttl_commission}</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
          <Spinner />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default PremiumRegister;
