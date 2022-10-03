import React from "react";
import { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import { today } from "../../../components/helpers/today";
import { Spinner } from "../../../components/helpers/Spinner";
import Modal5 from "../../../components/helpers/Modal5";
import Modal4 from "../../../components/helpers/Modal4";

const PayHos = () => {
  const [visibleState, setVisibleState] = useState({
    voucher: true,
    cheque: true,
    inputs: true,
  });
  const [selectedOption, setSelectedOption] = useState([]);
  const [payData, setPayData] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [hosVouchers, setHosVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOneOpen, setModalOneOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [disableSaveBtn, setDisableActionBtn] = useState(true);
  const [totalChequeAmount, setTotalChequeAmount] = useState([]);
  const [totalCommission, setTotalCommission] = useState([]);

  useEffect(() => {
    switch (selectedOption) {
      case "1":
        setVisibleState({ voucher: true, cheque: true, inputs: true });
        setDisableActionBtn(true);
        break;
      case "2":
        setVisibleState({ voucher: false, cheque: true, inputs: false });
        setDisableActionBtn(false);
        break;
      case "3":
        setVisibleState({ voucher: true, cheque: false, inputs: true });
        setDisableActionBtn(true);
        break;
    }
  }, [selectedOption]);

  useEffect(() => {
    getData("fetch_bank_accounts")
      .then((data) => {
        setBankAccounts(data);
      })
      .catch((error) => console.log(error));

    getData("fetch_hos_voucher_no").then((data) => {
      setHosVouchers(data);
    });
  }, []);

  useEffect(() => {
    setPayData([]);
    if (selectedOption == 1) {
      document.getElementById("spinner").style.display = "block";
      getData("fetch_hos_debits_not_paid_commission")
        .then((data) => {
          console.log(data);
          setPayData(data);

          document.getElementById("spinner").style.display = "none";
        })
        .catch((error) => console.log(error));
    }
  }, [selectedOption]);

  useEffect(() => {
    setPayData([]);
    if (selectedVoucher != 0) {
      document.getElementById("spinner").style.display = "block";
      getOneData("fetch_hos_debits_per_hos_vno", selectedVoucher).then(
        (data) => {
          console.log(data);
          setPayData(data.debits);
          setTotalChequeAmount(data.total_hos_amt);
          setTotalCommission(data.total_commission);

          document.getElementById("spinner").style.display = "none";
        }
      );
    }
  }, [selectedVoucher]);

  const payHosCommission = (e) => {
    const row = e.target.closest("tr");
    const tds = row.children;
    if (e.target.checked) {
      const arr = [];
      const frmData = new FormData();

      for (let i = 0; i < tds.length; i++) {
        arr.push(tds[i].children[0].value);
        frmData.append(i, tds[i].children[0].value);
      }
      postData(frmData, "fetch_hos_rate").then((dt) => {
        console.log(dt);
        tds[9].children[0].value = dt[0].hos_rate;
        tds[10].children[0].value = dt[0].hos_whtax_rate;
        tds[11].children[0].value = dt[0].hos_whtax;
        tds[12].children[0].value = dt[0].hos_amt;

        setDisableActionBtn(false);
      });
    } else {
       tds[9].children[0].value ="";
       tds[10].children[0].value = "";
       tds[11].children[0].value = "";
       tds[12].children[0].value = "";
    }
  };

  //confirm save to batch
  const confirmSavePayHosInvoices = (e) => {
    e.preventDefault();
    setModalOneOpen(true);
    setDisableActionBtn(false);
  };
  //save pay hos invoices
  const savePayHosInvoices = (e) => {
    // console.log('hi');
    e.preventDefault();
    switch (selectedOption) {
      case "1":
        setModalOneOpen(false);
        const frmData = new FormData(document.getElementById("pay_hos_form"));
        const payCheckbox = document.querySelectorAll(".pay_hos_invoice");
        frmData.append("selected_option", selectedOption);
        payCheckbox.forEach((element) => {
          if (element.checked == true) {
            frmData.append("pay_hos[]", "1");
          } else {
            frmData.append("pay_hos[]", "0");
          }
        });
        postData(frmData, "save_pay_hos_invoices").then((data) => {
          document.getElementById("spinner").style.display = "block";
          console.log(data);
          if (data.message) {
            const message = (
              <p style={{ color: "green", fontSize: "20px" }}>{data.message}</p>
            );
            setMessage(message);
            setModalOpen(true);
            setDisableActionBtn(true);
            document.getElementById("spinner").style.display = "none";
          }
          if (data.error) {
            const errors = (
              <p style={{ color: "red", fontSize: "20px" }}>
                Save Failed ! Contact the IT Admin
              </p>
            );
            setMessage(errors);
            setModalOpen(true);
            document.getElementById("spinner").style.display = "none";
          }
            setTimeout(function () {
              window.location.replace("/pay-hos");
            }, 6000);
        });
        break;

      case "2":
        setModalOneOpen(false);
        const frmData2 = new FormData(document.getElementById("pay_hos_form"));
        frmData2.append("selected_option", selectedOption);
        frmData2.append("voucher_no", selectedVoucher);
        postData(frmData2, "save_pay_hos_invoices").then((data) => {
          document.getElementById("spinner").style.display = "block";
          console.log(data);
          if (data.message) {
            const message = (
              <p style={{ color: "green", fontSize: "20px" }}>{data.message}</p>
            );
            setMessage(message);
            setModalOpen(true);
            setDisableActionBtn(true);
            document.getElementById("spinner").style.display = "none";
          }
          if (data.error) {
            const errors = (
              <p style={{ color: "red", fontSize: "20px" }}>
                Save Failed ! Contact the IT Admin
              </p>
            );
            setMessage(errors);
            setModalOpen(true);
            document.getElementById("spinner").style.display = "none";
          }
            setTimeout(function () {
              window.location.replace("/pay-hos");
            }, 6000);
        });
        break;

      default:
        break;
    }
  };
  //close modal
  const closeModal = (e) => {
    e.preventDefault();
    setModalOpen(false);
    setModalOneOpen(false);
  };
  return (
    <div>
      <div className="row ml-0">
        <h4 className="fs-title">Override Commission Management-Pay Hos</h4>
        <hr />
        <div className="col-md-12">
          <div className="row ml-0">
            <div className="form-group row">
              <label
                htmlFor="task"
                className="col-form-label col-sm-1 label-right pr-0 pl-0 mr-4"
              >
                Override Task:
              </label>
              <div className="col-md-3 pr-0 pl-0">
                <select
                  className="form-control"
                  id="selected_task"
                  onChange={(e) => setSelectedOption(e.target.value)}
                  defaultValue="0"
                >
                  <option disabled value="0">
                    Select Override Task
                  </option>
                  <option value="1">Pay</option>
                  <option value="2">Voucher</option>
                  {/* <option value="3">Cheque</option> */}
                </select>
              </div>

              <div className="col-md-3 pr-0 pl-0" hidden={visibleState.voucher}>
                <select
                  className="form-control"
                  id="voucher"
                  defaultValue="0"
                  onChange={(e) => setSelectedVoucher(e.target.value)}
                >
                  <option>Select Voucher</option>
                  {hosVouchers.map((dt) => {
                    return <option value={dt.hos_vno}>{dt.hos_vno}</option>;
                  })}
                </select>
              </div>
              <div className="col-md-3 pr-0 pl-0" hidden={visibleState.cheque}>
                <select
                  className="form-control"
                  id="cheque"
                  defaultValue="0"
                  // onChange={(e) => setSelectedCheque(e.target.value)}
                >
                  <option>Select Cheque</option>
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
                <form id="pay_hos_form" onSubmit={confirmSavePayHosInvoices}>
                  <div className="row" hidden={visibleState.inputs}>
                    <div className="col-md-12">
                      <div className="card">
                        <div className="form-group row justify-content-center">
                          <div className="col-md-1">
                            <label className="col-form-label label-align">
                              Cheque No:
                              <span className="required">*</span>
                            </label>
                          </div>
                          <div className="col-md-3">
                            {selectedOption == "2" ? (
                              <input
                                type="text"
                                className="form-control"
                                name="cheque_no"
                                id="cheque_no"
                                required="true"
                              />
                            ) : (
                              <input
                                type="text"
                                className="form-control"
                                name="cheque_no"
                              />
                            )}
                          </div>
                          <div className="col-md-1">
                            <label className="col-form-label label-align">
                              Cheque Date:
                            </label>
                          </div>
                          <div className="col-md-3">
                            <input
                              type="date"
                              className="form-control"
                              name="cheque_date"
                              defaultValue={today()}
                            />
                          </div>

                          <div className="col-md-1">
                            <label className="col-form-label">Deduction:</label>
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control"
                              name="deduction"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row justify-content-center">
                          <div className="col-md-1">
                            <label className="col-form-label label-align">
                              Payment:
                            </label>
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control"
                              name="payment"
                              value="AGENT COMMISSION"
                              readOnly
                            />
                          </div>
                          <div className="col-md-1">
                            <label className="col-form-label">
                              Total Commission:
                            </label>
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control"
                              name="total_commission"
                              value={totalCommission}
                              readOnly
                            />
                          </div>

                          <div className="col-md-1">
                            <label className="col-form-label">
                              Cheque Amount:
                            </label>
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control"
                              name="cheque_amount"
                              value={totalChequeAmount}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row justify-content-center">
                          <div className="col-md-1">
                            <label className="col-form-label">Bank:</label>
                          </div>
                          <div className="col-md-11">
                            <select name="account" defaultValue="0" required>
                              <option value="0">Select Account</option>
                              {bankAccounts.map((dt) => {
                                return (
                                  <option value={dt.code}>
                                    {dt.bank +
                                      "-" +
                                      dt.bank_account +
                                      "-" +
                                      dt.currency}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <input
                            type="text"
                            className="form-control text-uppercase"
                            name="user"
                            id="user"
                            value={localStorage.getItem("username")}
                            placeholder="User"
                            readOnly
                            hidden
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <hr />
                      <h6
                        className="font-weight-bold"
                        style={{ textAlign: "right" }}
                      ></h6>
                      <table
                        className="table table-bordered table-sm"
                        id="pay_hos_table"
                        style={{ maxHeight: "500px" }}
                      >
                        <thead className="thead-dark">
                          <tr>
                            <th hidden>Id Key</th>
                            <th hidden>New Renewal</th>
                            <th>Invoice No</th>
                            <th>Corporate</th>
                            <th>Family</th>
                            <th>Net Premium</th>
                            <th>Allocated</th>
                            <th>Allocated Amt</th>
                            <th>Pay</th>
                            <th>Hos Rate</th>
                            <th>Whtax Rate</th>
                            <th>Hos Whtax</th>
                            <th>Hos Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payData.map((dt) => {
                            return (
                              <tr>
                                <td hidden>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="id_key[]"
                                    value={dt.id_key}
                                  />
                                </td>
                                <td hidden>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="new_renewal[]"
                                    value={dt.new_renewal}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="invoice_no[]"
                                    value={dt.invoice_no}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="corporate[]"
                                    value={dt.corporate}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="names[]"
                                    value={dt.names}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="net_premium[]"
                                    value={dt.net_premium}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="checkbox"
                                    defaultValue={
                                      dt.allocated === null ? "" : dt.allocated
                                    }
                                    checked={dt.allocated == 1 ? true : false}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="allocated_amt[]"
                                    value={dt.allocated_amt}
                                  />
                                </td>
                                <td>
                                  {dt.hos_paid === "1" ? (
                                    <input
                                      className="form-control pay_hos_invoice"
                                      type="checkbox"
                                      checked="true"
                                    />
                                  ) : (
                                    <input
                                      className="form-control pay_hos_invoice"
                                      type="checkbox"
                                      onChange={payHosCommission}
                                    />
                                  )}
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="hos_rate[]"
                                    value={dt.hos_rate}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="hos_whtax_rate[]"
                                    value={dt.hos_whtax_rate}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="hos_whtax[]"
                                    value={dt.hos_whtax}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="hos_amt[]"
                                    value={dt.hos_amt}
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
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                  <div className={"row"}>
                    <Spinner />
                  </div>

                  <div className="row justify-content-center mt-3">
                    <input
                      type="submit"
                      className="btn btn-outline-info btn-sm col-md-1"
                      value="Save"
                      disabled={disableSaveBtn}
                    />
                    {/* <input
                      type="button"
                      className="btn btn-outline-success btn-sm col-md-1"
                      value="Print"
                    /> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal4
        modalIsOpen={isModalOneOpen}
        closeModal={closeModal}
        header={<p id="headers">Confirm</p>}
        body={
          <div>
            <div className={"row"}>
              <p>Notice ! Save this batch for approval ? </p>
            </div>
          </div>
        }
        buttons={
          <div className="row">
            <div className="col-md-6">
              <button
                className="btn btn-success float-right"
                onClick={savePayHosInvoices}
              >
                Yes
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-danger float-right"
                onClick={closeModal}
              >
                No
              </button>
            </div>
          </div>
        }
      />
      <Modal5
        modalIsOpen={isModalOpen}
        closeModal={closeModal}
        header={<p id="headers">Override Commission Management-Pay Hos</p>}
        body={
          <div>
            <div className={"row justify-content-center"}>
              <p>{message}</p>
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

export default PayHos;
