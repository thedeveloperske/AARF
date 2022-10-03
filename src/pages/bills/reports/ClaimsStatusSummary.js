import React, { useState, useEffect } from "react";
import { getOneData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const ClaimsStatusSummary = () => {
  const [address, setAddress] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [startDate1, setStartDate1] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [report, setReport] = useState([]);

  const [hidden, setHidden] = useState({year: true, month: true})

  useEffect(() => {
    getOneData("fetch_client_address", 4)
      .then((data) => {
        setAddress(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    switch (selectedOption) {
      case "0":
        setHidden({ year: true, month: true });
        break;
      case "1":
         setHidden({ year: false, month: true });
        break;
      case "2":
         setHidden({ year: true, month: false });
        break;    
    }
  }, [selectedOption]);

  const fetchReport = () => {
    setReport([]);
    document.getElementById("spinner").style.display = "block";
    const frmData = new FormData(document.getElementById("vettedBills"));

    frmData.append('option', selectedOption)

    postData(frmData, "fetch_claims_status_summary")
      .then((data) => {
        setReport(data);
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        document.getElementById("spinner").style.display = "none";
        console.log(error);
      });
  };

  const printPdf = () => {
    let period = `Period - ${report.period}`;

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
    <p>
    
    <p style="text-align:center;font-size:30px;">Claims Status Summary</p>
    <span style="float:right;">${period}</span>
    </p>
    <div>${tbl}</div>
    <br><br><br>   
    </div>
    `;
    var val = htmlToPdfmake(html);
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
      <p className="text-info h2">Claim Status Summary</p>
      <hr />
      <form id="vettedBills">
        <div className="row">
          <div className="col-md-2">
            <select
              className="form-control"
              name="options"
              id="options"
              defaultValue="0"
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option disabled value="0">
                Select Option
              </option>
              <option value="1">Year</option>
              <option value="2">Month</option>
            </select>
          </div>
          <div className="col-md-2" hidden={hidden.month}>
            <DatePicker
              name="month"
              id="month"
              className="form-control"
              selected={startDate1}
              onChange={(date) => setStartDate1(date)}
              showMonthYearPicker
              dateFormat={"MM/yyyy"}
            />
          </div>
          <div className="col-md-2" hidden={hidden.year}>
            <DatePicker
              name="year"
              id="year"
              className="form-control"
              selected={startDate2}
              onChange={(date) => setStartDate2(date)}
              showYearPicker
              dateFormat={"yyyy"}
            />
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
      <div className="card" style={{ zIndex: "0 !important" }}>
        <div className="row" style={{ margin: "20px" }}>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-info col-1"
            table="claims_status_summary"
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
            id="claims_status_summary"
            className="table  table-bordered"
            style={{ maxHeight: "500px" }}
          >
            <thead className="thead-dark" style={{ zIndex: "0" }}>
              <tr>
                <th>Period</th>
                <th>Entered</th>
                <th>Vetted</th>
                <th>Pending Vetting</th>
                <th>Vouchered</th>
                <th>Pending Voucher</th>
                <th>Paid</th>
                <th>Pending Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{report.period}</td>
                <td>{report.entered}</td>
                <td>{report.vetted}</td>
                <td>{report.pending_vetting}</td>
                <td>{report.vouchered}</td>
                <td>{report.pending_voucher}</td>
                <td>{report.paid}</td>
                <td>{report.pending_paid}</td>
              </tr>
            </tbody>
          </table>
          <Spinner />
        </div>
      </div>
    </div>
  );
};

export default ClaimsStatusSummary;
