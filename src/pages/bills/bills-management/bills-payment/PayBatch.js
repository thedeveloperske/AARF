import {useState, useEffect} from 'react';
import { getData, getOneData, postData } from '../../../../components/helpers/Data';
import Modal5 from "../../../../components/helpers/Modal5";
import { Spinner } from "../../../../components/helpers/Spinner";

const PayBatch = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [batch, setBatch] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [claimsTotal, setClaimTotal] = useState([]);
  const [oneClaim, setOneClaim] = useState([]);
  const [ttlPayable, setTtlPayable] = useState(0.0);
  const [response, setResponse] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getData("fetch_providers").then((data) => {
      setProviders(data);
    });
  }, []);

  useEffect(() => {
    setBatch([]);
    if (selectedProvider != 0) {
      getOneData("fetch_batch_per_provider", selectedProvider).then((data) => {
        setBatch(data);
      });
    }
  }, [selectedProvider]);

  useEffect(() => {
    const frmData = new FormData();
    if (selectedBatch != 0) {
       document.getElementById("spinner").style.display = "block";
      frmData.append(
        "selected_provider",
        document.getElementById("selected_provider").value
      );
      frmData.append("batch", document.getElementById("batch").value);
      postData(frmData, "fetch_claims_per_batch_no").then((data) => {
        console.log(data);
        setClaimData(data.claims);
        setClaimTotal(data);
        setOneClaim(data.claims[0]);

         document.getElementById("spinner").style.display = "none";
      });
    }
  }, [selectedBatch]);

  const calculateTotals = () => {
    calcTtls();
  };

  //select all for payment
  const selectAll = (e) => {
    e.preventDefault();
    const payCheckBox = document.querySelectorAll(".paid");
    payCheckBox.forEach((element) => {
      element.checked = true;
    });

    calcTtls();
  };

  const calcTtls = () => {
    let ttlVal = 0.0;
    const tbl = document.querySelector("#pay_batch_form tbody").children;
    for (let trs of tbl) {
      const ch = trs.children[5].children[0].checked;
      if (ch == true) {
        const amt_payable = trs.children[10].children[0].value;
        ttlVal += parseFloat(amt_payable);
      }
    }
    setTtlPayable(ttlVal);
  };

  const savePayBatch = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("pay_batch_form"));

    const paidCheckBox = document.querySelectorAll(".paid");

    paidCheckBox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("paid[]", "1");
      } else {
        frmData.append("paid[]", "0");
      }
    });
    postData(frmData, "save_pay_batch").then((data) => {
      console.log(data);
      if (data.message) {
        setResponse(data.message);
        setModalOpen(true);
      }
      if (data.error) {
        alert("Save Failed");
      }
       setTimeout(function () {
         window.location.replace("/pay-batch");
       }, 6000);
    });
  };
  //close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <div className="row ml-0">
        <h4 className="fs-title">Pay Batch</h4>
        <hr />
        <div className="col-md-12">
          <div className="row ml-0">
            <div className="form-group row">
              <label
                htmlFor="provider"
                className="col-form-label col-sm-1 label-right pr-0 pl-0 mr-4"
              >
                Provider:
              </label>
              <div className="col-md-3 pr-0 pl-0">
                <select
                  className={"form-control"}
                  id="selected_provider"
                  defaultValue="0"
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
                  <option>Select Provider</option>
                  {providers.map((dt) => {
                    return (
                      <option key={dt.CODE} value={dt.CODE}>
                        {dt.PROVIDER}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="col-md-3 pr-0 pl-0">
                <select
                  className={"form-control"}
                  id="batch"
                  defaultValue="0"
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option>Select Batch</option>
                  {batch.map((dt) => {
                    return (
                      <option key={dt.batch_no} value={dt.batch_no}>
                        {dt.batch_no}
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
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <form id="pay_batch_form" onSubmit={savePayBatch}>
                  <div className="row">
                    <div className="col-md-12">
                      <hr />
                      <h6
                        className="font-weight-bold"
                        style={{ textAlign: "right" }}
                      >
                        {oneClaim.provider}
                      </h6>
                      <table
                        className="table table-bordered table-sm"
                        id="invoice_details_table"
                        style={{ maxHeight: "500px" }}
                      >
                        <thead className="thead-dark">
                          <tr>
                            <th hidden="true"></th>
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
                                <td hidden="true">
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="id[]"
                                    value={dt.id}
                                    readOnly
                                  />
                                </td>
                                <td>{dt.member_no}</td>
                                <td>{dt.claim_no}</td>
                                <td>{dt.invoice_no}</td>
                                <td>{dt.service}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-control paid"
                                    id="paid"
                                    value="1"
                                    onChange={calculateTotals}
                                    defaultChecked={true}
                                    readOnly
                                  />
                                </td>
                                <td>{dt.invoiced_amount}</td>
                                <td>{dt.deduction_amount}</td>
                                <td>{dt.deduction_reason}</td>
                                <td>{dt.deduction_notes}</td>
                                <td>
                                  <input
                                    className="form-control amt_payable"
                                    type="text"
                                    name="amount_payable[]"
                                    value={dt.amount_payable}
                                    readOnly
                                  />
                                </td>
                                <td>{dt.admin_fee}</td>
                                <td>{dt.invoice_date}</td>
                                <td>{dt.names}</td>
                                <td>{dt.pre_auth_no}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-control"
                                    id="foreigns"
                                    checked={dt.foreigns == 1 ? true : false}
                                    readOnly
                                  />
                                </td>
                                <td>{dt.currency}</td>
                                <td>{dt.conversion_rate}</td>
                                <td>{dt.foreign_amt}</td>
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
                            <th>{claimsTotal.invoiced_total}</th>
                            <th>{claimsTotal.deduction_total}</th>
                            <th></th>
                            <th></th>
                            <th>{claimsTotal.payable_total}</th>
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
                  </div>

                  <div className="row justify-content-center mt-3">
                    <label
                      htmlFor="total_amt_payable"
                      className="col-form-label col-md-1 label-right pr-3 pl-0"
                    >
                      Count:
                    </label>
                    <div className="col-md-1 pr-2">
                      <input
                        className="form-control "
                        value={claimsTotal.claims_count}
                      />
                    </div>
                    <div className="col-md-1">
                      <input
                        type="button"
                        className="btn btn-outline-info  form-control"
                        value="Select All"
                        onClick={selectAll}
                      />
                    </div>
                    <input
                      type="submit"
                      className="btn btn-outline-info btn-sm col-md-1"
                      value="Save"
                    />
                    <label
                      htmlFor="total_amt_payable"
                      className="col-form-label col-md-1 label-right pr-3 pl-0"
                    >
                      Total Payable:
                    </label>
                    <div>
                      <input
                        className="form-control col-md-2"
                        value={parseFloat(ttlPayable).toLocaleString()}
                        readOnly
                      />
                    </div>
                    <label
                      htmlFor="total_amt_payable"
                      className="col-form-label col-md-1 label-right pr-3 pl-0"
                    >
                      User:
                    </label>
                    <div>
                      <input
                        className="form-control col-md-2"
                        name="user_id"
                        value={localStorage.getItem("username")}
                        readOnly
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal5
        modalIsOpen={isModalOpen}
        closeModal={closeModal}
        header={<p id="headers">Pay Batch</p>}
        body={
          <div>
            <div className={"row"}>
              <p>{response}</p>
            </div>
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

export default PayBatch;
