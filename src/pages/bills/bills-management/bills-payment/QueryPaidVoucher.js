import {useState, useEffect} from 'react';
import { getData, getOneData } from '../../../../components/helpers/Data';
import { Spinner } from "../../../../components/helpers/Spinner";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
const QueryPaidVoucher = () => {
    const [selectedVoucher, setSelectedVoucher] = useState([]);
    const[vouchers, setVouchers] = useState([]);
    const [claimData, setClaimData] = useState([]);
    const [claimsTotal, setClaimTotal] = useState([]);
    const [voucherClaimData, setVoucherClaimData] = useState([]);
    const [clientAddress, setClientAddress] = useState([]);
    const [visibleState, setVisibleState] = useState({
       address: true,
       print: true,
       excel: true,
     });

    useEffect(() => {
      getData('fetch_paid_vouchers').then((data)=>{
          setVouchers(data);
      });

      getOneData("fetch_client_address", 4).then((data) => {
        setClientAddress(data[0]);
      });
    }, [])

    useEffect(() => {
        setClaimData([]);
        if(selectedVoucher !=0){
          document.getElementById("spinner").style.display = "block";
            getOneData('fetch_claims_per_voucher_no', selectedVoucher).then((data)=>{
                setClaimData(data.claims);
                setClaimTotal(data);
                console.log(data.claims[0]);
                setVoucherClaimData(data.claims[0]);

                setVisibleState({ address: false, save: false, excel: false });
                document.getElementById("spinner").style.display = "none";
            });
        }
      
    }, [selectedVoucher]);

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
    let title = "PAID VOUCHERS";
    let user = localStorage.getItem("username");
    let tbl_head = "";
    let tbl_body = "";

    const header = document.querySelector("#paid_vouchers_table thead").children;
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
          <th>${trs.children[13].textContent}</th>
          <th>${trs.children[14].textContent}</th>
          <th>${trs.children[15].textContent}</th>
          <th>${trs.children[16].textContent}</th>
          <th>${trs.children[17].textContent}</th>
        </tr>
      `;
    }

    const body = document.querySelector("#paid_vouchers_table tbody").children;
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
          <td>${trs.children[13].children[0].value}</td>
          <td>${trs.children[14].children[0].value}</td>
          <td>${trs.children[15].children[0].value}</td>
          <td>${trs.children[16].children[0].value}</td>
          <td>${trs.children[17].children[0].value}</td>
        </tr>
      `;
    }

    var footer = document.querySelector("#paid_vouchers_table tfoot").children;
    footer = footer[0].children;
    let tbl_foot = `
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th>${footer[4].textContent}</th>
          <th>${footer[5].children[0].value}</th>
          <th>${footer[6].textContent}</th>
          <th></th>
          <th></th>
          <th>${footer[9].children[0].value}</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      `;

    let j = `
    <div className="row">
    <div style="text-align:right;">${page_header}</div>
    <br><br><br>
    <div class="row">
    <div class="col-md-4" style="font-weight:bold;">${title}</div>
    <div class="col-md-4 ml-auto" style="font-weight:bold; text-align: right"></div>
  </div>
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
      <div className="row ml-0">
        <h4 className="fs-title">Query Paid Voucher</h4>
        <hr />
        <div className="col-md-12">
          <div className="row ml-0">
            <div className="form-group row">
              <label
                htmlFor="voucher"
                className="col-form-label col-sm-1 label-right pr-0 pl-0 mr-4"
              >
                Voucher:
              </label>
              <div className="col-md-3 pr-0 pl-0">
                <select
                  className={"form-control"}
                  name="selected_voucher"
                  id="selected_voucher"
                  defaultValue="0"
                  onChange={(e) => setSelectedVoucher(e.target.value)}
                >
                  <option>Select Voucher</option>
                  {vouchers.map((dt) => {
                    return (
                      <option key={dt.voucher_no} value={dt.voucher_no}>
                        {dt.voucher_no}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <form id="paid_voucher_form" className="">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="form-group row ml-0"></div>
                        <div className="form-group row ml-0 ">
                          <label
                            htmlFor="payment_no"
                            className="col-form-label col-sm-2 label-align pr-0 pl-0"
                          >
                            Payment No:
                            <span className="required"></span>
                          </label>
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control"
                              name="payment_no"
                              required="true"
                              id="payment_no"
                              value={voucherClaimData.payment_no}
                              readOnly
                            />
                          </div>
                          <label
                            htmlFor="cheque_no"
                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                          >
                            Cheque No:
                          </label>
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control"
                              id="cheque_no"
                              name="cheque_no"
                              value={voucherClaimData.cheque_no}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="provider"
                            className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                          >
                            Provider:
                          </label>
                          <div className="col-md-4 col-sm-4 ">
                            <input
                              type="text"
                              className="form-control"
                              name="provider"
                              id="provider"
                              value={voucherClaimData.provider}
                              readOnly
                            />
                          </div>
                          <label
                            htmlFor="cheque_date"
                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                          >
                            Cheque Date:
                          </label>
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control"
                              id="cheque_date"
                              name="cheque_date"
                              value={voucherClaimData.cheque_date}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="member_name"
                            className="col-form-label col-sm-2 label-align pr-0 pl-0"
                          >
                            Member Name:
                            <span className=""></span>
                          </label>
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control"
                              name="member_name"
                              required="true"
                              id="member_name"
                              readOnly
                            />
                          </div>
                          <label
                            htmlFor="account"
                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                          >
                            Account:
                          </label>
                          <div className="col-md-4 col-sm-4">
                            <select
                              name="account"
                              className="form-control"
                              defaultValue={voucherClaimData.bank}
                              readOnly
                            >
                              <option value={voucherClaimData.bank_account}>
                                {voucherClaimData.bank}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="fund"
                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                          >
                            Fund:
                          </label>
                          <div className="col-md-4">
                            <input
                              type="checkbox"
                              className="form-control"
                              name="fund"
                              id="fund"
                              checked={
                                voucherClaimData.fund == 1 ? true : false
                              }
                              readOnly
                            />
                          </div>
                          <label
                            htmlFor="corporate"
                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                          >
                            Corporate:
                          </label>
                          <div className="col-md-4 col-sm-4">
                            <select
                              name="corporate"
                              className="form-control"
                              readOnly
                            >
                              <option></option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="funded_by"
                            className="col-form-label col-sm-2 label-align pr-0 pl-0"
                          >
                            Funded By:
                            <span className=""></span>
                          </label>
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control"
                              name="funded_by"
                              id="funded_by"
                              readOnly
                            />
                          </div>
                          <label
                            htmlFor="admin_fee"
                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                          >
                            Admin Fee:
                          </label>
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control"
                              name="admin_fee"
                              id="admin_fee"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="notes"
                            className="col-form-label col-sm-2 label-align pr-0 pl-0"
                          >
                            Notes:
                            <span className=""></span>
                          </label>
                          <div className="col-sm-4">
                            <textarea
                              type="text"
                              className="form-control"
                              name="notes"
                              id="notes"
                              readOnly
                            />
                          </div>

                          <label
                            htmlFor="payrun_date"
                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                          >
                            Payrun Date:
                          </label>
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control"
                              name="payrun_date"
                              id="payrun_date"
                              value={voucherClaimData.payrun_date}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group row ml-0"></div>
                        <div className="form-group row ml-0 ">
                          <label
                            htmlFor="payment_mode"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            Payment Mode:
                          </label>
                          <div className="col-md-6">
                            <select
                              name="payment_mode"
                              className="form-control"
                              defaultValue={voucherClaimData.payment_mode}
                              readOnly
                            >
                              <option value={voucherClaimData.payment_code}>
                                {voucherClaimData.payment_mode}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="amount_payable"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            Amount Payable:
                          </label>
                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              name="amount_payable"
                              value={claimsTotal.payable_total}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="discounts"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            Discounts:
                          </label>
                          <div className="col-md-6 col-sm-6">
                            <input
                              type="text"
                              className="form-control"
                              name="discounts"
                              id="discounts"
                              value={voucherClaimData.discounts}
                              readOnly
                            />
                          </div>
                        </div>
                        {/* <div className="form-group row ml-0">
                          <label
                            htmlFor="tax_deduct"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            Tax Deduct:
                          </label>
                          <div className="col-md-6 col-sm-6">
                            <input
                              type="checkbox"
                              className="form-control"
                              name="tax_deduct"
                              id="tax_deduct"
                            />
                          </div>
                        </div> */}
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="w/t_tax"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            W/H Tax:
                          </label>
                          <div className="col-md-6 col-sm-6">
                            <input
                              type="text"
                              className="form-control"
                              name="w_tax"
                              id="w_tax"
                              value={voucherClaimData.wtax}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="cheque_amount"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            Cheque Amount:
                          </label>
                          <div className="col-md-6 col-sm-6">
                            <input
                              type="text"
                              className="form-control"
                              name="cheque_amount"
                              id="cheque_amount"
                              value={voucherClaimData.cheque_amount}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <hr />
                        <table
                          className="table table-bordered table-sm"
                          id="paid_vouchers_table"
                          style={{ maxHeight: "500px" }}
                        >
                          <thead className="thead-dark">
                            <tr>
                              <th>Member No</th>
                              <th>Claim No</th>
                              <th>Invoice No</th>
                              <th>Service</th>
                              <th>Paid</th>
                              <th>Invoiced Amt</th>
                              <th>Ded'n Amt</th>
                              <th>Reason</th>
                              <th>Ded'n Notes</th>
                              <th>Amt Payable</th>
                              <th> Admin Fee</th>
                              <th>Invoice Date</th>
                              <th>Member Names</th>
                              <th>Pre Auth No</th>
                              <th>Foreign</th>
                              <th>Currency</th>
                              <th>Rate</th>
                              <th>Foreign Amt</th>
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
                                      value={dt.member_no}
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
                                      value={dt.invoice_no}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={dt.service}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      className="form-control"
                                      id="paid"
                                      checked={dt.paid == 1 ? true : false}
                                      readOnly
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
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={dt.admin_fee}
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
                                      value={dt.names}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={dt.pre_auth_no}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      className="form-control"
                                      id="foreigns"
                                      checked={dt.foreigns == 1 ? true : false}
                                      readOnly
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={dt.currency}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={dt.conversion_rate}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={dt.foreign_amt}
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
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="row mb-2">
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
                            table="paid_vouchers_table"
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default QueryPaidVoucher;
