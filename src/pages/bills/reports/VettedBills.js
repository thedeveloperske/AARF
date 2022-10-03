import React, { useState, useEffect } from "react";
import { getOneData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const VettedBills = () => {
  const [address, setAddress] = useState([]);
  const [startDate1, setStartDate1] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [report, setReport] = useState([]);

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
    document.getElementById("spinner").style.display = "block";

    const frmData = new FormData(document.getElementById("vettedBills"));

    postData(frmData, "fetch_vetted_bills")
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
      <p className="text-info h2">Vetted Bills</p>
      <hr />
      <form id="vettedBills">
        <div className="row">
          <div className="col-md-2">
            <DatePicker
              name="from"
              className="form-control"
              selected={startDate1}
              onChange={(date) => setStartDate1(date)}
              showMonthYearPicker
              dateFormat={"MM/yyyy"}
            />
          </div>
          <div className="col-md-2">
            <DatePicker
              name="to"
              className="form-control"
              selected={startDate2}
              onChange={(date) => setStartDate2(date)}
              showMonthYearPicker
              dateFormat={"MM/yyyy"}
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
      <div className="card">
        <div className="row" style={{ margin: "20px" }}>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-info col-1"
            table="vetted_bills"
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
            id="vetted_bills"
            className="table table-sm table-bordered"
            style={{ maxHeight: "500px" }}
          >
            <thead className="thead-dark" style={{ zIndex: "0" }}>
              <tr>
                <th>Claim No</th>
                <th>Provider</th>
                <th>Benefit</th>
                <th>Service</th>
                <th>Invoice No</th>
                <th>Member No</th>
                <th>Invoice Date</th>
                <th>Invoiced Amount</th>
                <th>Deduction Amount</th>
                <th>Amount Payable</th>
                <th>Paid</th>
                <th>Voucher No</th>
                <th>Payment No</th>
                <th>Batch No</th>
                <th>Payment Date</th>
                <th>Bill User</th>
                <th>Bills Date Entered</th>
                <th>Anniv</th>
                <th>Date Recieved</th>
                <th>Vet Status</th>
                <th>Voucher User</th>
                <th>Voucher Date</th>
                <th>Smart Bill Id</th>
                <th>Category</th>            
                <th>Corporate</th>
                <th>Bill Vet User</th>
                <th>Vet Date</th>
              </tr>
            </thead>
            <tbody>
              {report.map((dt) => {
                let vstatus =
                  dt.vet_status == "0"
                    ? "Un Vetted"
                    : dt.vet_status == "1"
                    ? "Approved"
                    : dt.vet_status == "2"
                    ? "Rejected"
                    : dt.vet_status == "3"
                    ? "Suspended"
                    : "";
                return (
                  <tr key={dt.id}>
                    <td>{dt.claim_no}</td>
                    <td>{dt.provider}</td>
                    <td>{dt.benefit}</td>
                    <td>{dt.service}</td>
                    <td>{dt.invoice_no}</td>
                    <td>{dt.member_no}</td>
                    <td>{dt.invoice_date}</td>
                    <td>{dt.invoiced_amount}</td>
                    <td>{dt.deduction_amount}</td>
                    <td>{dt.amount_payable}</td>
                    <td>{dt.paid}</td>
                    <td>{dt.voucher_no}</td>
                    <td>{dt.payment_no}</td>
                    <td>{dt.batch_no}</td>
                    <td>{dt.payment_date}</td>
                    <td>{dt.bill_user}</td>
                    <td>{dt.date_entered}</td>
                    <td>{dt.anniv}</td>
                    <td>{dt.date_received}</td>
                    <td>{vstatus}</td>
                    <td>{dt.voucher_user}</td>
                    <td>{dt.voucher_date}</td>
                    <td>{dt.smart_bill_id}</td>
                    <td>{dt.category}</td>
                    <td>{dt.corporate}</td>
                    <td>{dt.bill_vet_user}</td>
                    <td>{dt.vet_date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Spinner />
        </div>
      </div>
    </div>
  );
};

export default VettedBills;
