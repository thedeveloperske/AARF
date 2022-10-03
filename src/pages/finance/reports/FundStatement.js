import React, { useState, useEffect } from "react";
import { getData, getOneData } from "../../../components/helpers/Data";
import Modal5 from "../../../components/helpers/Modal5";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const FundStatement = () => {
  const [corporates, setCorporates] = useState([]);
  const [selectedCorporate, setSelectedCorporate] = useState([]);
  const [address, setAddress] = useState([]);
  const [credits, setCredits] = useState([]);
  const [debits, setDebits] = useState([]);
  const [message, setMessage] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [visibleState, setVisibleState] = useState({
    address: true,
    print: true,
    excel: true,
  });

  useEffect(() => {
    getData("fetch_corporates").then((data) => setCorporates(data));

    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedCorporate != 0) {
      getOneData("fetch_fund_statement", selectedCorporate).then((data) =>{
        console.log(data);
        if(data.credits.length <= 0){
          const message = 'Notice ! No Records To Recover';
          setMessage(message);
          setModalOpen(true);

        } else{
          setCredits(data.credits);
          setDebits(data.debits);
          setVisibleState({address:false, save:false, excel:false});
        }
      }).catch(console.error());
    }
    
  }, [selectedCorporate]);

    //close modal
    const closeModal = (e) => {
      e.preventDefault();
      setModalOpen(false);
  }

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
    let tbl_head = "";
    let tbl_body = "";

    const header = document.querySelector("#fund_statement_report_table thead").children;
    for(let trs of header){
      tbl_head += `
      <tr>        
        <th>${trs.children[0].textContent}</th>
        <th>${trs.children[1].textContent}</th>
        <th>${trs.children[2].textContent}</th>
        <th>${trs.children[3].textContent}</th>
        <th>${trs.children[4].textContent}</th>
        <th>${trs.children[5].textContent}</th>
        <th>${trs.children[6].textContent}</th>
      </tr>
    `;
    }

    const body = document.querySelector("#fund_statement_report_table tbody").children;
    for(let trs of body){
      tbl_body += `
      <tr>         
        <td>${trs.children[0].children[0].value}</td>
        <td>${trs.children[1].children[0].value}</td>
        <td>${trs.children[2].children[0].value}</td>
        <td>${trs.children[3].children[0].value}</td>
        <td>${trs.children[4].children[0].value}</td>
        <td>${trs.children[5].children[0].value}</td>
        <td>${trs.children[6].children[0].value}</td>
      </tr>
    `;
    }
    let title = 'FUND STATEMENT'
    let user = localStorage.getItem("username");
    let j = `
    <div class="row">
    <div class="col-md-4" style="font-weight:bold;">${page_header}</div>
    <br><br><br>
    <div class="row">
    <div class="col-md-4" style="font-weight:bold;">${title}</div>
    <div class="col-md-4 ml-auto" style="font-weight:bold; text-align: right"></div>
    </div>
    <div><table><thead>${tbl_head}</thead><tbody>${tbl_body}</tbody><tfoot></table></div>
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
        <h4 className="fs-title">Finance Reports - Fund Statement</h4>
        <hr />
        <div className="col-md-12">
          <div className="form-group row ml-0">
            <label
              className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
              for="corporate"
            >
              Corporates:
            </label>
            <div className="col-md-3 col-sm-3 ">
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
        </div>
      </div>
      <section id="fund_statement" className="project-tab">
        <div className="col-md-4 float-right" hidden={visibleState.address}>
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
              <form id="fund_statement_report">
                <div className="row">
                  <table
                    className="table table-bordered table-sm"
                    id="fund_statement_report_table"
                    style={{ maxHeight: "500px" }}
                  >
                    <thead className="thead-dark">
                      <tr>
                        <th className={"pr-2 pl-2"}>Cheque Date</th>
                        <th className={"pr-2 pl-2"}>Cheque No</th>
                        <th className={"pr-3 pl-3"}>Payee</th>
                        <th className={"pr-5 pl-5"}>Debit</th>
                        <th className={"pr-5 pl-5"}>Admin Fee</th>
                        <th className={"pr-5 pl-5"}>Total</th>
                        <th className={"pr-5 pl-5"}>Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* map credits */}
                      {credits.map((dt) =>{
                        return(
                          <tr>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="cheque_date"
                                value={dt.date_credited}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="cheque_no"
                                value={dt.cheque_no}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="transaction"
                                value={dt.transaction}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="debit"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="admin_fee"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="total"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="credit"
                                value={dt.fund_amount === null ? 0 : parseFloat(dt.fund_amount).toLocaleString()}
                              />
                            </td>
                          </tr>
                        )
                      })}
                          {/* map debits */}
                      {debits.map((dt) =>{
                        return(
                          <tr>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="cheque_date"
                                value={dt.cheque_date}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="cheque_no"
                                value={dt.cheque_no}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="payee"
                                value={dt.payee}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="debit"
                                value={dt.cheque_amount === null ? 0 :parseFloat(dt.cheque_amount).toLocaleString()}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="admin_fee"
                                value={dt.admin_fee}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="total"
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="credit"
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

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
                      table="fund_statement_report_table"
                      filename="tablexls"
                      sheet="tablexls"
                      buttonText="Excel"
                    />
                    </button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Modal5 modalIsOpen={isModalOpen}
            closeModal={closeModal}
            header={<p id="headers">Fund Statement Report</p>}
            body={
                <div>
                    <div className={"row justify-content-center"}>
                        <p>{message}</p>
                    </div>
                    <div className={"row justify-content-center"}>
                        <button className="btn btn-outline-danger"
                                onClick={(e) => setModalOpen(false)}>Close
                        </button>
                    </div>
                </div>
            }/>
    </div>
  );
};

export default FundStatement;
