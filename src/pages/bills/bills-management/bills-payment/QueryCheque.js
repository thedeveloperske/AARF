import { useState, useEffect } from "react";
import { getData, getOneData } from "../../../../components/helpers/Data";
import { Spinner } from "../../../../components/helpers/Spinner";

import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const QueryCheque = () => {
  const [clientAddress, setClientAddress] = useState([]);
  const [selectedCheque, setSelectedCheque] = useState([]);
  const [cheques, setCheques] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [claimsTotal, setClaimTotal] = useState([]);
  const [oneClaim, setOneClaim] = useState([]);
   const [visibleState, setVisibleState] = useState({
     address: true,
     print: true,
     excel: true,
   });

  useEffect(() => {
    getOneData("fetch_client_address", 4).then((data) => {
      setClientAddress(data[0]);
    });

    getData("fetch_cheques").then((data) => {
      setCheques(data);
    });
  }, []);

  useEffect(() => {
    setClaimData([]);
      if(selectedCheque !=0){
        document.getElementById("spinner").style.display = "block";
        getOneData("fetch_claims_per_cheque_no", selectedCheque).then((data)=>{
            console.log(data.claims);
            setClaimData(data.claims);
            setClaimTotal(data);
            setOneClaim(data.claims[0]);
            setVisibleState({ address: false, save: false, excel: false });
            document.getElementById("spinner").style.display = "none";
        });
      }
  }, [selectedCheque]);

  const printPdf = (e) => {
    e.preventDefault();

    let page_header = `
      <ul style="list-style-type: none">
        <li>${clientAddress.client_name}</li>
        <li>${clientAddress.physical_location}</li>
        <li>${clientAddress.box_no}</li>
        <li>${clientAddress.tel_cell}</li>
        <li>${clientAddress.fax}</li>
        <li>${clientAddress.email}</li>
        <li>${clientAddress.url}</li>
      </ul>
   `;
    let user = localStorage.getItem("username");
    let cheque_details = `<ul><li>Cheque Amount : ${parseFloat(oneClaim.cheque_amount).toLocaleString()}</li><li>Cheque No : ${oneClaim.cheque_no}</li>
    <li>Cheque Date : ${oneClaim.cheque_date}</li><li>Voucher No : ${ oneClaim.voucher_no}</ul>`;
    let tbl_head = "";
    let tbl_body = "";

    const header = document.querySelector("#invoice_details_table thead").children;
    for (let trs of header) {
      tbl_head += `
        <tr>
          <th>${trs.children[0].textContent}</th>
          <th>${trs.children[1].textContent}</th>
          <th>${trs.children[2].textContent}</th>
          <th>${trs.children[3].textContent}</th>
          <th>${trs.children[4].textContent}</th>
          <th>${trs.children[5].textContent}</th>
          <th>${trs.children[6].textContent}</th>
          <th>${trs.children[7].textContent}</th>
          <th>${trs.children[8].textContent}</th>
          <th>${trs.children[9].textContent}</th>
          <th>${trs.children[10].textContent}</th>
          <th>${trs.children[11].textContent}</th>
          <th>${trs.children[12].textContent}</th>
        </tr>
      `;
    }

    const body = document.querySelector("#invoice_details_table tbody").children;
    for (let trs of body) {
      tbl_body += `
        <tr>
          <td>${trs.children[0].children[0].value}</td>
          <td>${trs.children[1].children[0].value}</td>
          <td>${trs.children[2].children[0].value}</td>
          <td>${trs.children[3].children[0].value}</td>
          <td>${trs.children[4].children[0].value}</td>
          <td>${trs.children[5].children[0].value}</td>
          <td>${trs.children[6].children[0].value}</td>
          <td>${trs.children[7].children[0].value}</td>
          <td>${trs.children[8].children[0].value}</td>
          <td>${trs.children[9].children[0].value}</td>
          <td>${trs.children[10].children[0].value}</td>
          <td>${trs.children[11].children[0].value}</td>
          <td>${trs.children[12].children[0].value}</td>
        </tr>
      `;
    }

    var footer = document.querySelector("#invoice_details_table tfoot").children;
    footer = footer[0].children;
    let tbl_foot = `
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th>${footer[7].textContent}</th>
          <th>${footer[8].children[0].value}</th>
          <th>${footer[9].children[0].value}</th>
          <th></th>
          <th></th>
          <th>${footer[12].children[0].value}</th>
        </tr>
      `;

    let j = `
    <div className="row">
    <div style="text-align:right;">${page_header}</div>
    <br><br><br>
    <br>
    <div style="list-style-type: none">${cheque_details}</div>
    <div><table><thead>${tbl_head}</thead><tbody>${tbl_body}</tbody><tfoot>${tbl_foot}</tfoot></table></div>
    </div>
    <br><br><br>
    <p>Prepared By: ${user}</p>
    <p>Received By: __________________________   Date Received: __________________________</p>
    </div>
    `;

    var val = htmlToPdfmake(j);
    var dd = { pageOrientation: "landscape", content: val };
    pdfMake.createPdf(dd).download();
  };

  return (
    <div>
      <section id="querycorporatetable" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="row col-md-12" id="step-1">
                <div className="form-group row ml-0">
                  <label
                    className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                    for="cheque_no"
                  >
                    Cheque No:
                  </label>
                  <div className="col-md-4 col-sm-4 ">
                    <select
                      className={"form-control"}
                      name="selected_cheque"
                      id="selected_cheque"
                      defaultValue="0"
                      onChange={(e) => setSelectedCheque(e.target.value)}
                    >
                      <option>Select Cheque</option>
                      {cheques.map((dt) => {
                        return (
                          <option key={dt.cheque_no} value={dt.cheque_no}>
                            {dt.cheque_no}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <hr />
              <form className="claims_form mt-1" id="receipt_reversal_form">
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Receipt</h2>
                    <div className="addresses">
                      <h6
                        className="font-weight-bold"
                        style={{ float: "left", textAlign: "left" }}
                      >
                        {clientAddress.client_name} <br />
                        {clientAddress.physical_location} <br />
                        {clientAddress.box_no} <br />
                        {clientAddress.tel_cell} <br />
                        {clientAddress.fax} <br />
                        {clientAddress.email} <br />
                        {clientAddress.url}
                      </h6>

                      <h6
                        className="font-weight-bold"
                        style={{ textAlign: "right" }}
                      >
                        <br /><br /><br /><br /><br />
                        Provider:{oneClaim.provider} <br />
                      </h6>
                    </div>

                    <div className="col-md-12" id="query_cheque_div">
                      <hr />
                      <h6
                        className="font-weight-bold"
                        style={{ textAlign: "right" }}
                      >
                        Cheque Amount:
                        {parseFloat(oneClaim.cheque_amount).toLocaleString()}
                      </h6>
                      <table
                        className="table table-bordered table-sm"
                        id="invoice_details_table"
                        style={{ maxHeight: "500px" }}
                      >
                        <thead className="thead-dark">
                          <tr>
                            <th>Principal Member</th>
                            <th>Claim No</th>
                            <th>Member Name</th>
                            <th>Member No</th>
                            <th>Invoice No</th>
                            <th>Invoice Date</th>
                            <th>Claim Nature</th>
                            <th>Paid</th>
                            <th>Invoiced Amt</th>
                            <th>Ded'n Amt</th>
                            <th>Reason</th>
                            <th>Ded'n Notes</th>
                            <th>Amt Payable</th>
                          </tr>
                        </thead>
                        <tbody>
                          {claimData.map((dt) => {
                            return (
                              <tr key={dt.id}>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.principal_names}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.claim_no}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.member_names}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.member_no}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.invoice_no}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.invoice_date}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.benefit}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-control"
                                    id="paid"
                                    checked={dt.paid == 1 ? true : false}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.invoiced_amount}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.deduction_amount}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.deduction_reason}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.deduction_notes}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.amount_payable}
                                  />
                                </td>
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
                            <th></th>
                            <th></th>
                            <th>Totals</th>
                            <th>
                              <input
                                type="text"
                                className="form-control"
                                value={claimsTotal.invoiced_total}
                              />
                            </th>
                            <th>
                              <input
                                type="text"
                                className="form-control"
                                value={claimsTotal.deduction_total}
                              />
                            </th>
                            <th></th>
                            <th></th>
                            <th>
                              <input
                                type="text"
                                className="form-control"
                                value={claimsTotal.payable_total}
                              />
                            </th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div className="row mb-2">
                      <Spinner />
                    </div>
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
                        table="invoice_details_table"
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

export default QueryCheque;
