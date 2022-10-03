import React, { useState, useEffect } from "react";
import { getData, getOneData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const ClaimsReserve = () => {
  const [address, setAddress] = useState([]);
  const [claimsReserve, setClaimsReserve] = useState([]);
  const [visibleState, setVisibleState] = useState({
    section: true,
});

  useEffect(() => {
    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
  }, []);

  const fetchReport = () =>{
    setVisibleState({section:false});
    document.getElementById("spinner").style.display = "block";
    getData("fetch_claims_reserves").then((data) => {
      console.log(data);
      setClaimsReserve(data);
      document.getElementById("spinner").style.display = "none";
    }).catch(console.error());
  };

    const printPdf = (e) =>{
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

  let title = 'CLAIMS RESERVE'
  let user = localStorage.getItem("username");
  var tbl = document.getElementById('claims_reserve_report_div').innerHTML

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
        <h4 className="fs-title">Finance Reports - Claims Reserves</h4>
        <hr />
        <div className="col-md-12">
          <div className="form-group row ml-0">
            <div className="col-md-2">
              <button type="submit" className="btn btn-info col-md-2" onClick={fetchReport}>
                Click To Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <section id="claims_reserve" className="project-tab" hidden={visibleState.section}>
        <div className="col-md-4 float-right">
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
              <form id="claims_reserve_report">
                <div className="row" id="claims_reserve_report_div">
                  <table
                    className="table table-bordered table-sm"
                    id="claims_reserve_report_table"
                    style={{ maxHeight: "500px" }}
                  >
                    <thead className="thead-dark">
                      <tr>
                        <th className={"pr-2 pl-2"}>Member Name</th>
                        <th className={"pr-2 pl-2"}>Pre Auth No</th>
                        <th className={"pr-3 pl-3"}>Transaction Type</th>
                        <th className={"pr-5 pl-5"}>Debit</th>
                        <th className={"pr-5 pl-5"}>Credit</th>
                        <th className={"pr-5 pl-5"}>Date Entered</th>
                        <th className={"pr-5 pl-5"}>User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claimsReserve.map((dt) => {
                        return(
                          <tr>
                            <td>{dt.member_names}</td>
                            <td>{dt.pre_auth_no}</td>
                            <td>{dt.trans_type}</td>
                            <td>{dt.debit}</td>
                            <td>{dt.credit}</td>
                            <td>{dt.date_entered}</td>
                            <td>{dt.user_id}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="row">
                    <Spinner />
                  </div>

                <div>
                  <div className="row justify-content-center">
                    <button
                      type="button"
                      className="action-button btn-outline-info btn-sm col-md-1"
                      onClick={printPdf}
                    >
                      Print
                    </button>

                    <button
                      type="button"
                      className="action-button btn-outline-info btn-sm col-md-1"
                    >
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      table="claims_reserve_report_table"
                      filename="tablexls"
                      sheet="tablexls"
                      buttonText="Excel"
                    />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClaimsReserve;
