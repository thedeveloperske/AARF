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
import AccessLogs from "../../../components/helpers/AccessLogs";

const CorporatePopulation = () => {
  //save access log
  useEffect(() => {
    const frmData = new FormData();
    frmData.append("username", localStorage.getItem("username"));
    frmData.append("accessed", 172);
    AccessLogs(frmData);
  }, []);
  //module variables
  const [corporates, setCorporates] = useState([]);
  const [selectedCorporate, setSelectedCorporate] = useState([]);
  const [population, setPopulation] = useState([]);
  const [members, setMembers] = useState([]);
  const [corpPopulation, setCorpPopulation] = useState([]);
  const [address, setAddress] = useState([]);
  const [visibleState, setVisibleState] = useState({
    address: true,
    print: true,
    excel: true,
  });

  //getting all corporates
  useEffect(() => {
    getData("fetch_corporates").then((data) => setCorporates(data));

    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
  }, []);

  //Get corporate data
  useEffect(() => {
    if (selectedCorporate != 0) {
      getOneData("corporate_population", selectedCorporate).then((data) => {
        console.log(data);
        setPopulation(data);
        setMembers(data.members);
      });
    }
  }, [selectedCorporate]);

  const fetchReport = () => {
    const frmData = new FormData(document.getElementById("population_form"));
    document.getElementById("spinner").style.display = "block";
    postData(frmData, "all_corporates_population")
      .then((data) => {
        console.log(data);
        setCorpPopulation(data);
        setVisibleState({ address: false, save: false, excel: false });
        document.getElementById("spinner").style.display = "none";
      })
      .catch(console.error());
  };

  const tableStyle = {
    border: "1px solid black",
    fontWeight: "bold",
    fontSize: "30px",
  };

  const printPdf = (e) => {
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

    let title = "CORPORATE POPULATION";
    let user = localStorage.getItem("username");
    var tbl = document.getElementById("corporate_population_div").innerHTML;

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
      <section id="population_table" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-8" id="step-1">
              <div className="form-group row ml-0">
                <label
                  className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                  for="corporate"
                >
                  Corporates:
                </label>
                <div className="col-md-8 col-sm-8 ">
                  <select
                    className="form-control"
                    id="select-corporate-dropdown"
                    defaultValue="0"
                    name="corp_id"
                    onChange={(e) => setSelectedCorporate(e.target.value)}
                  >
                    <option disabled value="0">
                      Select Corporate
                    </option>
                    {corporates.map((corporate) => {
                      const { CORP_ID, CORPORATE } = corporate;
                      return (
                        <option key={CORP_ID} value={CORP_ID}>
                          {CORPORATE}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                  for="members"
                >
                  Members:
                </label>
                <div className="col-md-8 col-sm-8 ">
                  <select
                    className="form-control"
                    id="select-members"
                    defaultValue="0"
                    name="members"
                  >
                    {members.map((dt) => {
                      return <option value={dt.names}>{dt.names}</option>;
                    })}
                  </select>
                </div>
              </div>
              <form id="population_form">
                <div className="form-group row ml-0">
                  <label
                    className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                    for="date"
                  >
                    As At:
                  </label>
                  <div className="col-md-3 col-sm-3 ">
                    <input type="date" className="form-control" name="as_at" />
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
            </div>
            <div className="col-md-4">
              <table>
                <tbody>
                  <tr>
                    <td style={tableStyle}>Principals:</td>
                    <td style={tableStyle}>{population.principals}</td>
                  </tr>
                  <tr>
                    <td style={tableStyle}>Dependants:</td>
                    <td style={tableStyle}>{population.dependants}</td>
                  </tr>
                  <tr>
                    <td style={tableStyle}>Total:</td>
                    <td style={tableStyle}>{population.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-12">
              <hr />
              <form className="claims_form mt-1" id="corporate_population_form">
                <div
                  className="col-md-4 float-right"
                  hidden={visibleState.address}
                >
                  <h6>{address.client_name}</h6>
                  <h6>{address.physical_location}</h6>
                  <h6>{address.box_no}</h6>
                  <h6>{address.tel_cell}</h6>
                  <h6>{address.fax}</h6>
                  <h6>{address.email}</h6>
                  <h6>{address.url}</h6>
                </div>
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Corporate Population</h2>
                    <hr />
                  </div>
                  <div
                    className={"row justify-content-center"}
                    id="corporate_population_div"
                  >
                    <table
                      className="table table"
                      cellspacing="0"
                      id="corporate_population_table"
                      style={{ maxHeight: "500px" }}
                    >
                      <thead>
                        <tr>
                          <th>Corporate</th>
                          <th>Principals</th>
                          <th>Dependants</th>
                          <th>Total Lives</th>
                        </tr>
                      </thead>
                      <tbody>
                        {corpPopulation.map((dt) => {
                          return (
                            <tr>
                              <td>{dt.corporate}</td>
                              <td>{dt.principals}</td>
                              <td>{dt.dependants}</td>
                              <td>{dt.total_lives}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="row">
                    <Spinner />
                  </div>
                  <hr />

                  <div className="row justify-content-center">
                    <button
                      type="button"
                      className="action-button btn-outline-info btn-sm col-md-1"
                      onClick={printPdf}
                      hidden={visibleState.print}
                    >
                      Print
                    </button>
                    <button
                      type="button"
                      className="action-button btn-outline-info btn-sm col-md-1"
                      hidden={visibleState.excel}
                    >
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        table="corporate_population_table"
                        filename="tablexls"
                        sheet="tablexls"
                        buttonText="Excel"
                      />
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporatePopulation;
