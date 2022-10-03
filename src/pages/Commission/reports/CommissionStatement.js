import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const CommissionStatement = () => {
  const [address, setAddress] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
  const [report, setReport] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [hidden, setHidden] = useState({
    month: true,
    year: true,
    agent: true,
  });
  let ttl_gross_commis = 0;
  let ttl_wh_tax = 0;
  let ttl_commission = 0;

  useEffect(() => {
    setStartDate("");

    switch (selectedTask) {
      case "0":
         setReport([]);
        setHidden({ month: true, year: true, agent: true });
        break;
      case "1":
         setReport([]);
        setHidden({ month: true, year: false, agent: true });
        break;
      case "2":
         setReport([]);
        setHidden({ month: false, year: true, agent: true });
        break;
      case "3":
         setReport([]);
        setHidden({ month: true, year: true, agent: false });
        break;
    }
  }, [selectedTask]);
  useEffect(() => {
    getOneData("fetch_client_address", 4)
      .then((data) => {
        setAddress(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
    getData("fetch_agents")
      .then((data) => {
        setAgents(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchReport = () => {
     setReport([]);
    document.getElementById("spinner").style.display = "block";
    const frmData = new FormData(
      document.getElementById("commissionStatementFrm")
    );

    postData(frmData, "fetch_commission_statement").then((data) => {
      setReport(data);
         document.getElementById("spinner").style.display = "none";
    }).catch(error => {
      console.log(error)
       document.getElementById("spinner").style.display = "none";
    });
  };

  const printPdf = () => {
    let period = "";
    let date = "";
    switch (selectedTask) {
      case "1":
         date = document.getElementById("year").value;
         period = `<span><p>Period - ${date}</p><p>  Agents' Statement - Annual</p></span>`;
        break;
      case "2":
         date = document.getElementById("month").value;
          period = `<span><p>Period - ${date}</p><p>  Agents' Statement - monthly</p></span>`;
        break;
      case "3":
        let selected = document.getElementById("agent");
        let value = selected.options[selected.selectedIndex].innerHTML;
        period = `Agent - ${value}`;
         period = `<span><p>Agent - ${value} </p><p> Agents' Statement - monthly</p></span>`;
        break;      
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
      <p className="text-info h2">Commission Statement</p>
      <form id="commissionStatementFrm">
        <div className="row">
          <div className="col-md-2">
            <select
              className="form-control"
              defaultValue="0"
              name="task"
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option disabled value="0">
                Select Task
              </option>
              <option value="1">Annual</option>
              <option value="2">Monthly</option>
              <option value="3">Intermediary</option>
            </select>
          </div>
          <div className="col-md-2" hidden={hidden.month}>
            <DatePicker
              name="month"
              id="month"
              className="form-control"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showMonthYearPicker
              dateFormat={"MM/yyyy"}
            />
          </div>
          <div className="col-md-2" hidden={hidden.year}>
            <DatePicker
              name="year"
              id="year"
              className="form-control"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showYearPicker
              dateFormat={"yyyy"}
            />
          </div>
          <div className="col-md-2" hidden={hidden.agent}>
            <select
              className="form-control"
              defaultValue="0"
              name="agent"
              id="agent"
            >
              <option disabled value="0">
                Select Agent
              </option>
              {agents.map((dt) => {
                return <option value={dt.AGENT_ID}>{dt.AGENT_NAME}</option>;
              })}
            </select>
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
            table="commis_statement"
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
            id="commis_statement"
          >
            <thead className="thead-dark">
              <tr>
                <th>Agent Name</th>
                <th>Corporate</th>
                <th>Member Name</th>
                <th>Benefit</th>
                <th>Gross Commis</th>
                <th>Wh Tax</th>
                <th>Commission</th>
                <th>Cheque No</th>
                <th>Cheque Date</th>
              </tr>
            </thead>
            <tbody>
              {report.map((dt) => {
                let gross_commis =
                  parseFloat(dt.commission) + parseFloat(dt.wh_tax);
                ttl_gross_commis += gross_commis;
                ttl_wh_tax += parseFloat(dt.wh_tax);
                ttl_commission += parseFloat(dt.commission);
                return (
                  <tr>
                    <td>{dt.agent_name}</td>
                    <td>{dt.corporate}</td>
                    <td>{dt.member_names}</td>
                    <td></td>
                    <td>{gross_commis.toLocaleString()}</td>
                    <td>{parseFloat(dt.wh_tax).toLocaleString()}</td>
                    <td>{parseFloat(dt.commission).toLocaleString()}</td>
                    <td>{dt.cheque_no}</td>
                    <td>{dt.cheque_date}</td>
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
                <th>{ttl_gross_commis.toLocaleString()}</th>
                <th>{ttl_wh_tax.toLocaleString()}</th>
                <th>{ttl_commission.toLocaleString()}</th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
            <Spinner />          
        </div>
      </div>
    </div>
  );
};

export default CommissionStatement;
