import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import Modal6 from "../../../components/helpers/Modal6";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

const ClaimsPaymentsSchedule = () => {
  const [quotaShareData, setQuotaShareData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [claimsPayment, setClaimsPayment] = useState([]);
  const [reservePayment, setReservePayment] = useState([]);
  const [totalPaid, setTotalPaid] = useState([]);
  const [totalUnpaid, setTotalUnpaid] = useState([]);
  const [totalCede, setTotalCede] = useState([]);
  const [address, setAddress] = useState([]);
  const [reinsurer, setReinsurer] = useState([]);
  const [period, setPeriod] = useState([]);
  const [title, setTitle] = useState([]);
  const [visibleState, setVisibleState] = useState({
    address: true,
    print: true,
    excel: true,
  });

  useEffect(() => {
    getOneData("fetch_client_address", 4)
      .then((data) => {
        setAddress(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchReinsurers = (e) => {
    e.preventDefault();
    getData("fetch_quota_share_reinsurers")
      .then((data) => {
        console.log(data);
        setQuotaShareData(data);
        setModalOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  const fetchClaimsData = (e) => {
    e.preventDefault();
    //close modal
    setModalOpen(false);
    const frmData = new FormData();
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.textContent);
      console.log(element.textContent);
    });
    frmData.append("cede_rate", arr[2]);
    frmData.append("commis_rate", arr[3]);
    frmData.append("retain_rate", arr[4]);
    frmData.append("tax_rate", arr[5]);
    frmData.append("period", arr[6]);
    frmData.append("date_from", document.getElementById("date_from").value);
    frmData.append("date_to", document.getElementById("date_to").value);

    setReinsurer(arr[1]);
    setPeriod(arr[6]);

    //start loader
    document.getElementById("spinner").style.display = "block";
    postData(frmData, "fetch_claims_payment_schedule")
      .then((data) => {
        console.log(data);
        setClaimsPayment(data.claims);
        setReservePayment(data.reserves);
        setTotalPaid(data);
        setTotalUnpaid(data);
        setTotalCede(data);
        setVisibleState({ address: false, print: false, excel: false });
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => console.log(error));
  };
  //print to pdf
  const printPdf = (e) => {
    e.preventDefault();

    let page_header = `
      <ul style="list-style-type: none;">
        <li>${address.client_name}</li>
        <li>${address.physical_location}</li>
        <li>${address.box_no}</li>
        <li>${address.tel_cell}</li>
        <li>${address.fax}</li>
        <li>${address.email}</li>
        <li>${address.url}</li>
      </ul>
   `;
    let title = "RE-INSURANCE CLAIMS LIST" + " - " + reinsurer;
    setTitle(title);
    let user = localStorage.getItem("username");
    var tbl = document.getElementById("claims_schedule_div").innerHTML;

    let j = `
    <div class="row">
    <div class="col-md-4" style="font-weight:bold; text-align: right">${page_header}</div>
    <br><br><br>
    <div class="row">
    <div class="col-md-4" style="font-weight:bold;">${title}</div>
    <div class="col-md-4 ml-auto" style="font-weight:bold; text-align: right">PERIOD: ${period}</div>
    </div>
    <div>${tbl}</div>
    <br><br><br>
    <p>Prepared By: ${user}</p>
    <br/>
    <p>Received By: __________________________   Date Received: __________________________</p>
    </div>
    `;

    var val = htmlToPdfmake(j);
    var dd = {
      pageOrientation: "landscape",
      pageMargins: [20, 30, 20, 30],
      content: val,
      pageSize: "A3",
    };
    pdfMake.createPdf(dd).download();
  };

  return (
    <div>
      <div className="row ml-0">
        <h4 className="fs-title">Re-Insurance - Claims Payments Schedule</h4>
        <hr />
        <div className="col-md-12">
          <form id="input_form">
            <div className="row ml-0">
              <div className="form-group row">
                <label
                  htmlFor="option"
                  className="col-form-label col-md-0.5 label-right pr-3 pl-3"
                >
                  Enter Period:
                </label>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    id="date_from"
                    maxLength="4"
                    max="9999-12-31"
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    id="date_to"
                    maxLength="4"
                    max="9999-12-31"
                  />
                </div>
                <div className="col-md-1">
                  <button
                    type="submit"
                    className="btn btn-outline-info btn-sm"
                    onClick={fetchReinsurers}
                  >
                    Run
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <section id="pay_provider" className="project-tab">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className={"row "}>
                <div className={"col-md-12"}>
                  <div className="col-md-4 float-right" hidden={visibleState.address}>
                    <h6>{address.client_name}</h6>
                    <h6>{address.physical_location}</h6>
                    <h6>{address.box_no}</h6>
                    <h6>{address.tel_cell}</h6>
                    <h6>{address.fax}</h6>
                    <h6>{address.email}</h6>
                    <h6>{address.url}</h6>
                  </div>
                </div>
              </div>
              <form id="claims_schedule_form">
                <div className="row" id="claims_schedule_div">
                  <table
                    className="table table-bordered table-sm"
                    id="claims_schedule_reinsurance_table"
                    style={{ maxHeight: "500px" }}
                  >
                    <thead className="thead-dark">
                      <tr>
                        <th>Corporate</th>
                        <th>Member No</th>
                        <th>Member Name</th>
                        <th>Claim No</th>
                        <th>Claim Date</th>
                        <th>Provider</th>
                        <th>Cover Dates</th>
                        <th>Paid Amt</th>
                        <th>Unpaid Amt</th>
                        <th>Re Cede</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* map claims */}
                      {claimsPayment.map((dt) => {
                        return (
                          <tr>
                            <td>{dt.corporate}</td>
                            <td>{dt.member_no}</td>
                            <td>{dt.member_name}</td>
                            <td>{dt.claim_no}</td>
                            <td>{dt.invoice_date}</td>
                            <td>{dt.provider}</td>
                            <td>
                              {dt.start_date}-{dt.end_date}
                            </td>
                            <td>
                              {dt.payment_no !== null
                                ? parseFloat(dt.amount_payable).toLocaleString()
                                : ""}
                            </td>
                            <td>
                              {dt.payment_no === null
                                ? parseFloat(
                                    dt.invoiced_amount
                                  ).toLocaleString()
                                : ""}
                            </td>
                            <td>{parseFloat(dt.cede_amt).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      {/* map reserves */}
                      {reservePayment.map((dt) => {
                        return (
                          <tr>
                            <td>{dt.corporate}</td>
                            <td>{dt.member_no}</td>
                            <td>{dt.member_name}</td>
                            <td>{dt.claim}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              {parseFloat(dt.reserve_amt).toLocaleString()}
                            </td>
                            <td>{parseFloat(dt.cede_amt).toLocaleString()}</td>
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
                        <th>
                          {totalPaid.length !== 0
                            ? parseFloat(totalPaid.total_paid).toLocaleString()
                            : ""}
                        </th>
                        <th>
                          {totalUnpaid.length !== 0
                            ? parseFloat(
                                totalUnpaid.total_unpaid
                              ).toLocaleString()
                            : ""}
                        </th>
                        <th>
                          {totalCede.length !== 0
                            ? parseFloat(totalCede.total_cede).toLocaleString()
                            : ""}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="row mt-2 mb-2">
                  <Spinner />
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-1" hidden={visibleState.excel}>
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="btn btn-outline-success float-right pl-0 pr-0"
                      table="claims_schedule_reinsurance_table"
                      filename="claims_payment_schedule"
                      sheet="Claims Payment Schedule"
                      buttonText="Export"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={printPdf}
                    hidden={visibleState.print}
                  >
                    Print
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Modal6
        style={{ marginRight: "-10% !important" }}
        modalIsOpen={modalOpen}
        closeModal={closeModal}
        header={<p id="headers">Reinsurers</p>}
        body={
          <div>
            <form id={"reinsurers_form"}>
              <div className="table-responsive">
                <table
                  className="table table-bordered table-sm"
                  id="quota_share_reinsurers_table"
                  style={{ maxHeight: "500px" }}
                >
                  <thead className="thead-dark">
                    <tr>
                      <th hidden={true}>Id</th>
                      <th>Re-Insurer</th>
                      <th>Cede (%)</th>
                      <th>Commission (%)</th>
                      <th>Retention (%)</th>
                      <th>Tax (%)</th>
                      <th>Period</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotaShareData.map((data) => {
                      return (
                        <tr>
                          <td hidden={true}>
                            <input
                              className={"form-control"}
                              name={"code"}
                              value={data.CODE}
                              hidden
                            />
                          </td>
                          <td>{data.RE_INSURER}</td>
                          <td>{data.ip_rate}</td>
                          <td>{data.commis_rate}</td>
                          <td>{data.retain_rate}</td>
                          <td>{data.tax_rate}</td>
                          <td>{data.rate_period}</td>
                          <td>
                            <button
                              className={"btn btn-outline-success btn-block"}
                              onClick={fetchClaimsData}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </form>
            <div className={"row justify-content-center"}>
              <button
                className="btn btn-outline-danger"
                onClick={(e) => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ClaimsPaymentsSchedule;
