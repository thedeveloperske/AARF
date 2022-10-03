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

const ClaimsExperience = () => {
  const [address, setAddress] = useState([]);
  const [corporate, setCorporate] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedOption2, setSelectedOption2] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
  const [selectedCorporate, setSelectedCorporate] = useState([]);
  const [annivs, setAnnivs] = useState([]);
  const [header, setHeader] = useState([]);
  const [body, setBody] = useState([]);
  const [totals, setTotals] = useState({ invTtl: 0, apTtl: 0 });
  const [hiddenStatus, setHiddenStatus] = useState({
    task: true,
    task2: true,
    options2: true,
    family: true,
    member: true,
    corporate: true,
    annivs: true,
    from: false,
    to: false,
  });

  let invTtl = 0;
  let apTtl = 0;

  useEffect(() => {
    getOneData("fetch_client_address", 4)
      .then((data) => {
        setAddress(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
    getData("fetch_corporates")
      .then((data) => {
        setCorporate(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedCorporate != 0) {
      getOneData("fetch_corp_annivs", selectedCorporate)
        .then((data) => {
          setAnnivs(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedCorporate]);

  useEffect(() => {
    switch (selectedOption) {
      case "0":
        setHiddenStatus({
          task: true,
          task2: true,
          options2: true,
          family: true,
          member: true,
          corporate: true,
          annivs: true,
        });
        break;
      case "1":
        setHiddenStatus({
          task: false,
          task2: true,
          options2: true,
          family: true,
          member: true,
          corporate: false,
          annivs: true,
        });
        break;
      case "2":
        setHiddenStatus({
          task: true,
          task2: true,
          options2: true,
          family: true,
          member: false,
          corporate: true,
          annivs: true,
        });
        break;
      case "3":
        setHiddenStatus({
          task: true,
          task2: true,
          options2: true,
          family: false,
          member: true,
          corporate: true,
          annivs: true,
        });
        break;
      case "4":
        setHiddenStatus({
          task: false,
          task2: true,
          options2: true,
          family: true,
          member: true,
          corporate: true,
          annivs: true,
        });
        break;
      case "5":
        setHiddenStatus({
          task: true,
          task2: true,
          options2: false,
          family: true,
          member: true,
          corporate: true,
          annivs: true,
        });
        break;
    }
  }, [selectedOption]);

  useEffect(() => {
    switch (selectedOption2) {
      case "0":
        setHiddenStatus({
          task: true,
          task2: true,
          family: true,
          member: true,
          corporate: true,
        });
        break;
      case "1":
        setHiddenStatus({
          task: true,
          task2: false,
          family: true,
          member: true,
          corporate: false,
          annivs: true,
        });
        break;
      case "2":
        setHiddenStatus({
          task: true,
          task2: true,
          family: true,
          member: false,
          corporate: true,
          annivs: true,
        });
        break;
      case "3":
        setHiddenStatus({
          task: true,
          task2: true,
          family: false,
          member: true,
          corporate: true,
          annivs: true,
        });
        break;
      case "4":
        setHiddenStatus({
          task: true,
          task2: false,
          family: true,
          member: true,
          corporate: true,
          annivs: true,
        });
        break;
    }
  }, [selectedOption2]);

  useEffect(() => {
    if (selectedOption == 1 && selectedTask == 6) {
      setHiddenStatus({
        ...hiddenStatus,
        corporate: false,
        annivs: false,
        from: true,
        to: true,
      });
    } else if (selectedOption == 1 && selectedTask == 7) {
      setHiddenStatus({
        ...hiddenStatus,
        corporate: true,
        annivs: true,
        from: false,
        to: false,
      });
    } else {
      setHiddenStatus({
        ...hiddenStatus,
        annivs: true,
        from: false,
        to: false,
      });
    }
  }, [selectedTask]);

  const fetchReport = () => {
    setHeader([]);
    setBody([]);
    setTotals({ invTtl: 0, apTtl: 0 });
    let x = "";

    document.getElementById("spinner").style.display = "block";

    const frmData = new FormData(
      document.getElementById("claimsExperienceFrm")
    );

    postData(frmData, "fetch_claims_experience")
      .then((data) => {
        console.log(data);
        setHeader(data.header);

        if (selectedOption == 1 && selectedTask == 6) {
          x = data.body.map((dt) => {
            return (
              <tr>
                <td>{dt.principal_applicant}</td>
                <td>{dt.member_names}</td>
                <td>{dt.member_no}</td>
                <td>{dt.claim_no}</td>
                <td>{dt.invoice_no}</td>
                <td>{dt.invoice_date}</td>
                <td>{dt.benefit}</td>
                <td>{dt.provider}</td>
                <td>{dt.invoiced_amount}</td>
                <td>{dt.amount_payable}</td>
                <td>{dt.total}</td>
                <td>{dt.limit}</td>
                <td>{dt.balance}</td>
              </tr>
            );
          });
          setBody(x);
        } else if (selectedOption == 1 && selectedTask == 7) {
          x = data.body.map((dt) => {
            invTtl += parseFloat(dt.invoiced_amount);
            apTtl += parseFloat(dt.amount_payable);
            return (
              <tr>
                <td>{dt.provider}</td>
                <td>{parseFloat(dt.invoiced_amount).toLocaleString()}</td>
                <td>{parseFloat(dt.amount_payable).toLocaleString()}</td>
              </tr>
            );
          });
          setBody(x);
          setTotals({ invTtl, apTtl });
        } else {
          x = data.body.map((dt) => {
            invTtl += parseFloat(dt.invoiced_amount);
            apTtl += parseFloat(dt.amount_payable);
            return (
              <tr>
                <td>{dt.principal_applicant}</td>
                <td>{dt.member_names}</td>
                <td>{dt.relation}</td>
                <td>{dt.member_no}</td>
                <td>{dt.claim_no}</td>
                <td>{dt.invoice_no}</td>
                <td>{dt.invoice_date}</td>
                <td>{dt.benefit}</td>
                <td>{dt.provider}</td>
                <td>{parseFloat(dt.invoiced_amount).toLocaleString()}</td>
                <td>{parseFloat(dt.amount_payable).toLocaleString()}</td>
              </tr>
            );
          });

          setBody(x);
          setTotals({ invTtl, apTtl });
        }
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
      <p className="text-info h2">Claims Experience</p>
      <hr />
      <form id="claimsExperienceFrm">
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
              <option value="1">Corporate</option>
              <option value="2">Member</option>
              <option value="3">Family</option>
              <option value="4">All</option>
              <option value="5">Smart</option>
            </select>
          </div>
          <div className="col-md-2" hidden={hiddenStatus.options2}>
            <select
              name="options2"
              className="form-control"
              defaultValue="0"
              onChange={(e) => setSelectedOption2(e.target.value)}
            >
              <option disabled value="0">
                Select Options
              </option>
              <option value="1">Corporate</option>
              <option value="2">Member</option>
              <option value="3">Family</option>
              <option value="4">All</option>
            </select>
          </div>
          <div className="col-md-2" hidden={hiddenStatus.task}>
            <select
              name="tasks"
              className="form-control"
              defaultValue="0"
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option disabled value="0">
                Select Task
              </option>
              <option value="1">Out patient</option>
              <option value="2">Benefit Wise</option>
              <option value="3">All Claims</option>
              <option value="4">In Patient</option>
              <option value="5">Claims Co Sharing</option>
              <option value="6">Claims n Balances</option>
              <option value="7">All Claims Summary</option>
            </select>
          </div>
          <div className="col-md-2" hidden={hiddenStatus.task2}>
            <select name="tasks2" className="form-control" defaultValue="0">
              <option disabled value="0">
                Select Task
              </option>
              <option value="1">Out patient</option>
              <option value="2">Benefit Wise</option>
              <option value="3">All Claims</option>
              <option value="4">In Patient</option>
            </select>
          </div>
          <div className="col-md-2" hidden={hiddenStatus.corporate}>
            <select
              name="corporates"
              className="form-control"
              defaultValue="0"
              onChange={(e) => setSelectedCorporate(e.target.value)}
            >
              <option value="0">Select Corporate</option>
              {corporate.map((dt) => {
                return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
              })}
            </select>
          </div>
          <div className="col-md-2" hidden={hiddenStatus.annivs}>
            <select name="anniv" className="form-control" defaultValue="0">
              <option value="0">Select Anniv</option>
              {annivs.map((dt) => {
                return <option value={dt.anniv}>{dt.anniv}</option>;
              })}
            </select>
          </div>
          <div className="col-md-2" hidden={hiddenStatus.member}>
            <input
              className="form-control"
              type="text"
              name="member_no"
              placeholder="Member Number"
            />
          </div>
          <div className="col-md-2" hidden={hiddenStatus.family}>
            <input
              className="form-control"
              type="text"
              name="family_no"
              placeholder="Family Number"
            />
          </div>
          <div className="col-md-2" hidden={hiddenStatus.from}>
            <input className="form-control" type="date" name="from" />
          </div>
          <div className="col-md-2" hidden={hiddenStatus.to}>
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
            table="claims_experience"
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
            id="claims_experience"
          >
            <thead className="thead-dark">
              <tr>
                {header.map((dt) => {
                  return <th>{dt}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {body.map((dt) => {
                return dt;
              })}
            </tbody>
            <tfoot>
              {selectedOption == 1 && selectedTask == 6 ? (
                ""
              ) : selectedOption == 1 && selectedTask == 7 ? (
                <tr>
                  <th>Totals</th>
                  <th>{totals.invTtl.toLocaleString()}</th>
                  <th>{totals.apTtl.toLocaleString()}</th>
                </tr>
              ) : (
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Totals</th>
                  <th>{totals.invTtl.toLocaleString()}</th>
                  <th>{totals.apTtl.toLocaleString()}</th>
                </tr>
              )}
            </tfoot>
          </table>
          <Spinner />
        </div>
      </div>
    </div>
  );
};

export default ClaimsExperience;
