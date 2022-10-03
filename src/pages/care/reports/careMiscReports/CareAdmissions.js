import React, { useState, useEffect } from "react";
import { getOneData, postData } from "../../../../components/helpers/Data";
import { Spinner } from "../../../../components/helpers/Spinner";

import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import FormatDate3 from "../../../../components/helpers/FormatDate3";

const CareAdmissions = () => {
  const [report, setReport] = useState([]);
  const [address, setAddress] = useState([]);

  
  useEffect(() => {
    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]).catch((error) => console.log(error));
    });
  }, []);

  const fetchReport = (e) => {
    e.preventDefault();
    setReport([]);
    document.getElementById("spinner").style.display = "block";
    const frmData = new FormData(document.getElementById("careAdmissions"));
    postData(frmData, "fetch_care_admissions")
      .then((data) => {
        setReport(data);
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => console.log(error));
  };

  const printPdf = () => {
    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;
    let period = `${FormatDate3(from)} - ${FormatDate3(to)}`;
    const doc = document.getElementById("pdf").innerHTML;

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
    
    let html = `
    <div style="text-align:center;font-size:40px;">CARE ADMISSION</div>    
  <br/>
    <div style="text-align:right;">${page_header}</div>
    <br/>
    <div style="text-align:left;">Period (${period})</div>
    <br/><br/>
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
      <p className="text-info h2">Care Admissions</p>
      <hr />
      <form id="careAdmissions" onSubmit={fetchReport}>
        <div className="row">
          <div className="col-md-2">
            <input className="form-control" type="date" name="from" id="from" />
          </div>
          <div className="col-md-2">
            <input className="form-control" type="date" name="to" id="to" />
          </div>

          <div className="col-md-2">
            <input className="btn btn-info" type="submit" value="Run" />
          </div>
        </div>
      </form>
      <div className="card">
        <div className="row" style={{ margin: "20px" }}>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-info col-1"
            table="care_admissions"
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
            id="care_admissions"
          >
            <thead className="thead-dark">
              <th>Corporate</th>
              <th>Member No</th>
              <th>Member Names</th>
              <th>Auth No</th>
              <th>Provider</th>
              <th>Date Admitted</th>
              <th>Adm'n No</th>
              <th>Ward</th>
              <th>Room No</th>
              <th>Bed No</th>
            </thead>
            <tbody>
              {report.map((dt) => {
                return (
                  <tr>
                    <td>{dt.corporate}</td>
                    <td>{dt.member_no}</td>
                    <td>{dt.member_name}</td>
                    <td>{dt.pre_auth_no}</td>
                    <td>{dt.provider}</td>
                    <td>{dt.date_admitted}</td>
                    <td>{dt.admission_no}</td>
                    <td>{dt.ward}</td>
                    <td>{dt.room_no}</td>
                    <td>{dt.bed_no}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot></tfoot>
          </table>
          <Spinner />
        </div>
      </div>
    </div>
  );
};

export default CareAdmissions;
