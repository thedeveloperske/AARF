import {useState, useEffect} from 'react';
import { getData, getOneData, postData } from "../../../../components/helpers/Data";
import Modal5 from "../../../../components/helpers/Modal5";
import { Spinner } from "../../../../components/helpers/Spinner";

const ReimburseCorporate = () => {
  const [corporates, setCorporates] = useState([]);
  const [selectedCorp, setSelectedCorp] = useState([]);
  const [corpClaimReimburse, setCorpClaimReimburse] = useState([]);
  const [claimsTotal, setClaimTotal] = useState([]);
  const [corp, setCorp] = useState([]);
  const [ttlPayable, setTtlPayable] = useState(0.0);
  const [response, setResponse] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    getData("fetch_corporates_to_reimburse").then((data) => {
      setCorporates(data);
    });
  }, []);

  useEffect(() => {
    if (selectedCorp != 0) {
       document.getElementById("spinner").style.display = "block";
      getOneData("fetch_corp_claim_reimbursement", selectedCorp).then(
        (data) => {
          console.log(data.claims);
          setCorpClaimReimburse(data.claims);
          setClaimTotal(data);
          setCorp(data.claims[0]);
           document.getElementById("spinner").style.display = "none";
        }
      );
    }
  }, [selectedCorp]);

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
    const tbl = document.querySelector("#reimburse_corp_form tbody").children;
    for (let trs of tbl) {
      const ch = trs.children[5].children[0].checked;
      if (ch == true) {
        const amt_payable = trs.children[14].children[0].value;
        ttlVal += parseFloat(amt_payable);
      }
    }
    setTtlPayable(ttlVal);
  };

  const saveReimburseCorp = (e) => {
    e.preventDefault();
    const frmData = new FormData(
      document.getElementById("reimburse_corp_form")
    );

    const paidCheckBox = document.querySelectorAll(".paid");

    paidCheckBox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("paid[]", "1");
      } else {
        frmData.append("paid[]", "0");
      }
    });
    postData(frmData, "save_reimburse_corporate").then((data) => {
      console.log(data);
      if (data.message) {
        setResponse(data.message);
        setModalOpen(true);
      }
      if (data.error) {
        alert("Save Failed");
      }
    });
  };
  //close modal
  const closeModal = () => {
    setModalOpen(false);

     setTimeout(function () {
       window.location.replace("/reimburse-corporate");
     }, 5000);
  };
  return (
    <div>
      <div className="row ml-0">
        <h4 className="fs-title">Reimburse Corporate</h4>
        <hr />
        <div className="col-md-12">
          <div className="row ml-0">
            <div className="form-group row">
              <label
                htmlFor="corporate"
                className="col-form-label col-sm-1 label-right pr-0 pl-0 mr-4"
              >
                Corporate:
              </label>
              <div className="col-md-5 pr-0 pl-0">
                <select
                  className={"form-control"}
                  name="selected_corporate"
                  id="selected_corporate"
                  defaultValue="0"
                  onChange={(e) => setSelectedCorp(e.target.value)}
                >
                  <option>Select Corporate</option>
                  {corporates.map((data) => {
                    return (
                      <option value={data.corp_id}>{data.corporate}</option>
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
                <form id="reimburse_corp_form" onSubmit={saveReimburseCorp}>
                  <div className="row">
                    <div className="col-md-12">
                      <hr />
                      <h6
                        className="font-weight-bold"
                        style={{ textAlign: "right" }}
                      >
                        {corp.corporate}
                      </h6>
                      <table
                        className="table table-bordered table-sm"
                        id="invoice_details_table"
                      >
                        <thead className="thead-dark">
                          <tr>
                            <th hidden="true"></th>
                            <th>Member No</th>
                            <th>Claim No</th>
                            <th>Invoice No</th>
                            <th>Service</th>
                            <th>Pay</th>
                            <th>Invoiced Amt</th>
                            <th>Ded'n Amt</th>
                            <th>Reason</th>
                            <th>Ded'n Notes</th>
                            <th> Currency</th>
                            <th>Foreign</th>
                            <th>Rate</th>
                            <th>Foreign Amt</th>
                            <th>Amt Payable</th>
                            <th>Invoice Date</th>
                            <th>Member Names</th>
                          </tr>
                        </thead>
                        <tbody>
                          {corpClaimReimburse.map((dt) => {
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
                                <td>{dt.currency}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-control"
                                    id="foreigns"
                                    checked={dt.foreigns == 1 ? true : false}
                                    readOnly
                                  />
                                </td>
                                <td>{dt.conversion_rate}</td>
                                <td>{dt.foreign_amt}</td>
                                <td>
                                  <input
                                    className="form-control amt_payable"
                                    type="text"
                                    name="amount_payable[]"
                                    value={dt.amount_payable}
                                    readOnly
                                  />
                                </td>
                                <td>{dt.invoice_date}</td>
                                <td>{dt.names}</td>
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
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>{claimsTotal.payable_total}</th>
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
        header={<p id="headers">Reimburse Corporate</p>}
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

export default ReimburseCorporate;
