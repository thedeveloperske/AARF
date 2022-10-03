import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";

import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const ClaimsRegister = () => {
  const [address, setAddress] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [hiddenStatus, setHiddenStatus] = useState({
    provider_type: true,
    provider: true,
    status: true,
  });
  const [report, setReport] = useState([]);

  useEffect(() => {
    getOneData("fetch_client_address", 4)
      .then((data) => {
        setAddress(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
    getData("fetch_providers")
      .then((data) => {
        setProviders(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    switch (selectedOption) {
      case "0":
        setHiddenStatus({
          provider_type: true,
          provider: true,
          status: true,
        });
        break;
      case "1":
        setHiddenStatus({
          provider_type: false,
          provider: true,
          status: true,
        });
        break;
      case "2":
        setHiddenStatus({
          provider_type: true,
          provider: false,
          status: true,
        });
        break;
      case "3":
        setHiddenStatus({
          provider_type: true,
          provider: true,
          status: false,
        });
        break;
      case "4":
        setHiddenStatus({
          provider_type: true,
          provider: true,
          status: true,
        });
        break;
    }
  }, [selectedOption]);

  const fetchReport = () => {
    document.getElementById("spinner").style.display = "block";

    const frmData = new FormData(document.getElementById("claimsRegisterFrm"));

    postData(frmData, "fetch_claims_register")
      .then((data) => {
        console.log(data);
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        document.getElementById("spinner").style.display = "none";

        console.log(error);
      });
  };

  const printPdf = () => {
    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;
    let period = `Period ${from} - ${to}`;

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
      <p className="text-info h2">Claims Register</p>
      <hr />
      <form id="claimsRegisterFrm">
        <div className="row">
          <div className="col-md-2">
            <select
              name="options"
              className="form-control"
              defaultValue="0"
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option disabled value="0">
                Select Options
              </option>
              <option value="1">Provider Type</option>
              <option value="2">Provider</option>
              <option value="3">Per Status</option>
              <option value="4">All</option>
            </select>
          </div>
          <div className="col-md-2" hidden={hiddenStatus.provider_type}>
            <select
              name="provider_type"
              className="form-control"
              defaultValue="0"
            >
              <option disabled value="0">
                Select Provider Type
              </option>
              <option value="1">AAR</option>
              <option value="2">PPOs</option>
              <option value="3">All</option>
            </select>
          </div>
          <div className="col-md-2" hidden={hiddenStatus.provider}>
            <select name="provider" className="form-control" defaultValue="0">
              <option disabled value="0">
                Select Provider
              </option>
              {providers.map((dt) => {
                return <option value={dt.CODE}>{dt.PROVIDER}</option>;
              })}
            </select>
          </div>
          <div className="col-md-2" hidden={hiddenStatus.status}>
            <select name="status" className="form-control" defaultValue="0">
              <option disabled value="0">
                Select status
              </option>
            </select>
          </div>
          <div className="col-md-2">
            <select name="date_type" className="form-control" defaultValue="0">
              <option disabled value="0">
                Select Date Type
              </option>
              <option value="1">Invoice Date</option>
              <option value="2">Received Date</option>
              <option value="3">Voucher Date</option>
            </select>
          </div>
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
            className="btn btn-info col-1"
            table="claims_register"
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
            id="claims_register"
            className="table table-sm table-bordered"
            style={{ maxHeight: "500px" }}
          >
            <thead className="thead-dark" style={{ zIndex: "0" }}>
              <tr>
                <th>Claim No</th>
                <th>Invoice No</th>
                <th>Provider</th>
                <th>Benefit</th>
                <th>Service</th>
                <th>Invoice Date</th>
                <th>Date Entered</th>
                <th>Invoiced Amt</th>
                <th>Amount Payable</th>
                <th>Vet Status</th>
              </tr>
            </thead>
            <tbody>{report.map((dt) => {})}</tbody>
          </table>
          <Spinner />
        </div>
      </div>
    </div>
  );
};

export default ClaimsRegister;
