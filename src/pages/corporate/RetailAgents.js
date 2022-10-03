import React, { useState, useEffect } from "react";
import { getData, getOneData } from "../../components/helpers/Data";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const RetailAgents = () => {
  const [agents, setCorporateAgents] = useState([]);
  const [address, setAddress] = useState([]);
  const [visibleState, setVisibleState] = useState({
    address: true,
    print: true,
    excel: true,
  });

  useEffect(() => {
    let agents = getData("retail_agents").then((data) =>
      setCorporateAgents(data)
    );
    setVisibleState({ address: false, save: false, excel: false });
    console.warn(agents);
  }, []);

  useEffect(() => {
    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
  }, []);

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
    <p>
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
      <div className="row">  
        <div className="col-md-12">
        <p className="text-info h2">Retail Agents</p>  
        <hr />
          <div className="table-responsive">
            <div className="row" style={{ margin: "20px" }}>
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="btn btn-info col-1"
                table="retail_agents_table"
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
            <div id="pdf">
              <table
                className="table table-sm table-bordered"
                cellSpacing="0"
                id="retail_agents_table"
                style={{ height: "500px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    <th>Member Name</th>
                    <th>Anniv</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Agent Name</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => {
                    return (
                      <tr>
                        <td>{agent.member_name}</td>
                        <td>{agent.anniv}</td>
                        <td>{agent.start_date}</td>
                        <td>{agent.end_date}</td>
                        <td>{agent.agent_name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailAgents;
