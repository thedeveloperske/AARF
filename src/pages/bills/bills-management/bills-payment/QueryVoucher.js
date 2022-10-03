import { useEffect, useState } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../../components/helpers/Data";
import { Spinner } from "../../../../components/helpers/Spinner";
import Modal from "../../../../components/helpers/Modal5";

const QueryVoucher = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [voucherData, setVoucherData] = useState([]);
  const [otherData, setOtherData] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [ttlPayable, setTtlPayable] = useState(0.0);
  const [ttlPayableSplit, setTtlPayableSplit] = useState(0.0);
  const [whtax, setWhtax] = useState(0.0);
  const [discount, setDiscount] = useState(0);
  const [response, setResponse] = useState({ status: true, data: "" });

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const openModal = () => {
    setModalIsOpen(true);
  };
  useEffect(() => {
    getData("fetch_voucher_bills_payment")
      .then((data) => {
        setVouchers(data);
      })
      .catch((error) => console.log(error));

    getData("fetch_bank_accounts")
      .then((data) => {
        setBankAccounts(data);
      })
      .catch((error) => console.log(error));

    getData("fetch_payment_modes")
      .then((data) => {
        setPaymentModes(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedVoucher.length != 0) {
      getOneData("fetch_voucher_data", selectedVoucher)
        .then((data) => {
          setVoucherData(data.claims);
          setOtherData(data.others[0]);
          calcTtls();
          setTtlPayableSplit(document.getElementById("ttlPayableMain").value);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedVoucher]);

  const selectAll = (e) => {
    e.preventDefault();
    const payCheckBox = document.querySelectorAll(".pay_split");
    payCheckBox.forEach((element) => {
      element.checked = true;
    });

    calcTtls2();
  };

  const getWhTax = (e) => {
    if (e.target.checked) {
      let tax = 0.06 * ttlPayable;
      setWhtax(tax);
    } else {
      setWhtax(0.0);
    }
  };

  const giveDiscount = (e) => {
    setDiscount(e.target.value);
  };

  const calcTtls = () => {
    let ttlVal = 0.0;
    const tbl = document.querySelector("#tblVouchers tbody").children;
    for (let trs of tbl) {
      const ch = trs.children[5].children[0].checked;
      if (ch == true) {
        const invamt = trs.children[10].children[0].value;
        ttlVal += parseFloat(invamt);
      }
    }
    setTtlPayable(ttlVal);
  };

  const calcTtls2 = () => {
    let ttlVal = 0.0;
    const tbl = document.querySelector("#tblSplit tbody").children;
    for (let trs of tbl) {
      const ch = trs.children[6].children[0].checked;
      if (ch == true) {
        const invamt = trs.children[5].children[0].value;
        ttlVal += parseFloat(invamt);
      }
    }

    setTtlPayableSplit(ttlVal);
  };

  const calculateTotals = () => {
    calcTtls2();
  };

  const splitVouchers = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("frmSplitVoucher"));

    const payCheckBox = document.querySelectorAll(".pay_split");

    payCheckBox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("pay[]", "1");
      } else {
        frmData.append("pay[]", "0");
      }
    });

    postData(frmData, "split_voucher").then((data) => {
      setResponse({ status: false, data: data[0] });
      setModalIsOpen(false);

      setTimeout(function () {
         window.location.replace("/query-voucher");
      }, 6000);
    });
  };

  const updateBill = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("frmQueryVoucher"));

    frmData.append("user", localStorage.getItem("username"));

    postData(frmData, "update_query_voucher").then((data) => {
      setResponse({ status: false, data: data[0] });
      setTimeout(function () {
        window.location.replace("/query-voucher");
      }, 6000);
    });
  };
  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <select
                className="form-control"
                defaultValue="0"
                onChange={(e) => setSelectedVoucher(e.target.value)}
              >
                <option disabled value="0">
                  Select Vouchers
                </option>
                {vouchers.map((data) => {
                  return (
                    <option value={data.voucher_no}>{data.voucher_no}</option>
                  );
                })}
              </select>
            </div>
            <span className="mx-auto text-info font-weight-bolder">
              {otherData.provider}
            </span>
            <span className="alert alert-success" hidden={response.status}>
              {response.data}
            </span>
          </div>
        </div>
      </div>
      <form id="frmQueryVoucher" onSubmit={updateBill}>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group row justify-content-center">
                    <div className="col-md-2">
                      <label className="col-form-label label-align">
                        Payment No
                      </label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        name="payment_no"
                        readOnly
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="col-form-label label-align">
                        Admin Fee
                      </label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        name="admin_fee"
                        readOnly
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="col-form-label">Payrun Date</label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        name="payrun_date"
                        value={otherData.v_date}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group row justify-content-center">
                    <div className="col-md-2">
                      <label className="col-form-label label-align">
                        Provider
                      </label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        name="provider"
                        readOnly
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="col-form-label">Cheque No</label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        name="cheque_no"
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="col-form-label">Member Name</label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        name="member_name"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group row justify-content-center">
                    <div className="col-md-2">
                      <label className="col-form-label label-align">
                        Corporate
                      </label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        name="corporate"
                        readOnly
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="col-form-label">Fund</label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="checkbox"
                        className="form-control"
                        name="fund"
                        disabled="true"
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="col-form-label">Funded By</label>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="text"
                        className="form-control"
                        name="funded_by"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group row justify-content-center">
                    <div className="col-md-2">
                      <label className="col-form-label">Account</label>
                    </div>
                    <div className="col-md-10">
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
                  </div>
                  <div className="form-group row justify-content-center">
                    <div className="col-md-2">
                      <label className="col-form-label">Notes</label>
                    </div>
                    <div className="col-md-10">
                      <textarea className="form-control" name="notes" />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group row justify-content-center">
                    <div className="col-md-4">
                      <label className="col-form-label">Cheque Date</label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="date"
                        className="form-control"
                        name="cheque_date"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="col-form-label label-align">
                        Payment Mode
                      </label>
                    </div>
                    <div className="col-md-8">
                      <select name="payment_mode" defaultValue="0" required>
                        <option value="0">Select Payment Mode</option>
                        {paymentModes.map((data) => {
                          return (
                            <option value={data.code}>
                              {data.payment_mode}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="col-form-label label-align">
                        Amount Payable
                      </label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        name="amount_payable"
                        value={parseFloat(ttlPayable).toLocaleString()}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="col-form-label label-align">
                        Discounts
                      </label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="number"
                        className="form-control"
                        name="discounts"
                        onChange={giveDiscount}
                        defaultValue={0}
                        min={0}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="col-form-label label-align">
                        Tax Deduct
                      </label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="checkbox"
                        className="form-control"
                        name="tax_deduct"
                        value="1"
                        onChange={getWhTax}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="col-form-label label-align">
                        W/H Tax
                      </label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        name="wh_tax"
                        value={whtax.toLocaleString()}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="col-form-label label-align">
                        Cheque Amount
                      </label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        name="cheque_amount"
                        value={(ttlPayable - whtax - discount).toLocaleString()}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card">
            <Spinner />

            <div className="table-responsive">
              <table
                id="tblVouchers"
                className="table table-bordered table-sm"
                style={{ maxHeight: "250px" }}
              >
                <thead>
                  <tr>
                    <th hidden="true"></th>
                    <th>Member No</th>
                    <th>Claim No</th>
                    <th>Invoice No</th>
                    <th>Service</th>
                    <th>Paid</th>
                    <th>Invoiced Amt</th>
                    <th>Deduction</th>
                    <th>Reason</th>
                    <th>Deduction Notes</th>
                    <th>Amount Payable</th>
                    <th>Invoice Date</th>
                    <th>Member Names</th>
                    <th>Foreign</th>
                    <th>Currency</th>
                    <th>Rate</th>
                    <th>Foreign Amount</th>
                  </tr>
                </thead>
                <tbody id="mem_reimburse">
                  {voucherData.map((dt) => {
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
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="member_no[]"
                            value={dt.MEMBER_NO}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="claim_no[]"
                            value={dt.CLAIM_NO}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="invoice_no[]"
                            value={dt.INVOICE_NO}
                            readOnly
                          />
                        </td>
                        <td>
                          <select
                            className="form-control"
                            name="service[]"
                            value={dt.service_code}
                            readOnly
                          >
                            <option value={dt.service_code}>
                              {dt.service}
                            </option>
                          </select>
                        </td>
                        <td>
                          <input
                            className="form-control pay"
                            type="checkbox"
                            value="1"
                            defaultChecked="true"
                            disabled="true"
                          />
                        </td>
                        <td>
                          <input
                            className="form-control inv_amt"
                            type="text"
                            name="invoiced_amount[]"
                            value={dt.INVOICED_AMOUNT}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="deduction_amount[]"
                            value={dt.DEDUCTION_AMOUNT}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="deduction_reason[]"
                            value={dt.DEDUCTION_REASON}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="deduction_notes[]"
                            value={dt.DEDUCTION_NOTES}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            value={dt.AMOUNT_PAYABLE}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="invoice_date[]"
                            value={dt.INVOICE_DATE}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="names[]"
                            value={dt.names}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="foreigns[]"
                            value={dt.foreigns}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="currency[]"
                            value={dt.currency}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="conversion_rate[]"
                            value={dt.conversion_rate}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="foreign_amt[]"
                            value={dt.foreign_amt}
                            readOnly
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="form-group row justify-content-center">
                <div className="col-md-2">
                  <input
                    className="btn btn-info form-control"
                    type="submit"
                    value="Save"
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="btn btn-outline-success form-control"
                    type="button"
                    value="Print"
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="btn btn-outline-warning form-control"
                    type="button"
                    onClick={openModal}
                    value="Split Voucher"
                  />
                </div>
                <div className="col-md-2" style={{ marginLeft: "50px" }}>
                  <label className="font-weight-bolder">Total Payable</label>
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    id="ttlPayableMain"
                    className="form-control text-success font-weight-bolder"
                    value={parseFloat(ttlPayable).toLocaleString()}
                    readOnly
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Modal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        header={
          <p className="text-info h3 font-weight-bolder">Vouchers to Split</p>
        }
        body={
          <div>
            <hr />
            <form id="frmSplitVoucher">
              <table
                className="table table-bordered table-hover table-sm"
                style={{ maxHeight: "350px" }}
                id="tblSplit"
              >
                <thead className="thead-dark">
                  <tr>
                    <th>Voucher No</th>
                    <th>Claim No</th>
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                    <th>Amount Payable</th>
                    <th>Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {voucherData.map((dt) => {
                    return (
                      <tr key={dt.id}>
                        <td hidden="true">
                          <input
                            className="form-control"
                            type="text"
                            name="id[]"
                            value={dt.id}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="voucher_no_split[]"
                            value={dt.voucher_no}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="claim_no_split[]"
                            value={dt.CLAIM_NO}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="invoice_no_split[]"
                            value={dt.INVOICE_NO}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="invoice_date[]"
                            value={dt.INVOICE_DATE}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="amount_payable[]"
                            value={dt.AMOUNT_PAYABLE}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control pay_split"
                            type="checkbox"
                            value="1"
                            onChange={calculateTotals}
                            defaultChecked="true"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </form>
          </div>
        }
        buttons={
          <div className="form-group row justify-content-center">
            <div className="col-md-2">
              <input
                className="btn btn-info form-control"
                type="submit"
                value="Split"
                onClick={splitVouchers}
              />
            </div>

            <div className="col-md-2">
              <input
                type="button"
                onClick={selectAll}
                className="btn btn-outline-success form-control"
                value="Select All"
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="button"
                onClick={closeModal}
                className="btn btn-outline-danger form-control"
                value="Close"
                required
              />
            </div>
            <div className="col-md-2" style={{ marginLeft: "20px" }}>
              <label className="col-form-label label-align">
                Total Payable
              </label>
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control text-success"
                value={ttlPayableSplit.toLocaleString()}
                readOnly
                required
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default QueryVoucher;
