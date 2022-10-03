import React, { useState, useEffect } from "react";
import { getData, getOneData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";

import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import FormatDate3 from "../../../components/helpers/FormatDate3";

const CaseManagement = () => {
  const [selectedOption, setSelectedOption] = useState([]);
  const [corporate, setCorporate] = useState([]);
  const [address, setAddress] = useState([]);
  const [hidden, setHidden] = useState({
    corp: true,
    member: true,
    from: true,
    to: true,
    run: true,
  });
  const [report, setReport] = useState([]);
  let ttl = 0;

  useEffect(() => {
    setReport([]);
    document.getElementById("corporate").value = "0";
    document.getElementById("member").value = "";
    switch (selectedOption) {
      case "0":
        setHidden({
          corp: true,
          member: true,
          from: true,
          to: true,
          run: true,
        });
        break;
      case "1":
        setHidden({
          corp: false,
          member: true,
          from: false,
          to: false,
          run: false,
        });
        break;
      case "2":
        setHidden({
          corp: true,
          member: false,
          from: false,
          to: false,
          run: false,
        });
        break;
    }
  }, [selectedOption]);

  useEffect(() => {
    getData("fetch_corporates")
      .then((data) => setCorporate(data))
      .catch((error) => console.log(error));
    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]).catch((error) => console.log(error));
    });
  }, []);

  const fetchReport = (e) => {
    e.preventDefault();
    setReport([]);
    document.getElementById("spinner").style.display = "block";
    const frmData = new FormData(document.getElementById("caseManagement"));
    postData(frmData, "fetch_case_management")
      .then((data) => {
        setReport(data);
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => console.log(error));
  };

  const printPdf = () => {
    let e = document.getElementById("corporate");
    let client = "";
    if (selectedOption == 1) {
      client = e.options[e.selectedIndex].text;
    } else {
      client = report[0].member_name;
      }
      
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

    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;
    let period = `${FormatDate3(from)} - ${FormatDate3(to)}`;

    const doc = document.getElementById("pdf").innerHTML;
    let html = `
    <div style="text-align:center;font-size:40px;">CASE MANAGEMENT</div>    
    <br/>
    <div style="text-align:right;">${page_header}</div>
    <br/>
    <div style="float:left;">${client}</div>
    <br/>
    <div style="float:right;">Period (${period})</div>
    <br/>
    <div>${doc}</div>
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
      <p className="text-info h2">CASE MANAGEMENT</p>
      <hr />
      <form id="caseManagement" onSubmit={fetchReport}>
        <div className="row">
          <div className="col-md-2">
            <select
              className="form-control"
              name="options"
              id="options"
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="0">Select Option</option>
              <option value="1">Corporate</option>
              <option value="2">Member</option>
            </select>
          </div>
          <div className="col-md-2" hidden={hidden.corp}>
            <select className="form-control" name="corporate" id="corporate">
              <option value="0">Select Corporate</option>
              {corporate.map((dt) => {
                return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
              })}
            </select>
          </div>
          <div className="col-md-2" hidden={hidden.member}>
            <input
              className="form-control"
              type="text"
              name="member"
              id="member"
              placeholder="Type Member No..."
            />
          </div>
          <div className="col-md-2" hidden={hidden.from}>
            <input className="form-control" type="date" name="from" id="from" />
          </div>
          <div className="col-md-2" hidden={hidden.to}>
            <input className="form-control" type="date" name="to" id="to" />
          </div>

          <div className="col-md-2" hidden={hidden.run}>
            <input className="btn btn-info" type="submit" value="Run" />
          </div>
        </div>
      </form>
      <div className="card">
        <div className="row" style={{ margin: "20px" }}>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-info col-1"
            table="case_management"
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
            className="table table-sm table-bordered"
            style={{ maxHeight: "500px" }}
            id="case_management"
          >
            <thead className="thead-dark">
              <th>Claim No</th>
              <th>Invoice No</th>
              <th>Provider</th>
              <th>Service</th>
              <th>Invoice Date</th>
              <th>Clinical Diagnosis</th>
              <th>Invoiced Amount</th>
            </thead>
            <tbody>
              {report.map((dt) => {
                ttl += parseFloat(dt.invoiced_amount);
                return (
                  <tr>
                    <td>{dt.claim_no}</td>
                    <td>{dt.invoice_no}</td>
                    <td>{dt.provider}</td>
                    <td>{dt.service}</td>
                    <td>{dt.invoice_date}</td>
                    <td>{dt.clinical_diagnosis}</td>
                    <td>{parseFloat(dt.invoiced_amount).toLocaleString()}</td>
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
                <th>Totals</th>
                <th>{ttl.toLocaleString()}</th>
              </tr>
            </tfoot>
          </table>
          <Spinner />
        </div>
      </div>
    </div>
  );
};

export default CaseManagement;
