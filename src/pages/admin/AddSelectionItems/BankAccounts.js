import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const BankAccounts = () => {
  const [banks, setBanks] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [bankAccount, setBankAccount] = useState([]);
  const [appendedBanAccount, setAppendedBankAccount] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_banks").then((data) => {
      setBanks(data);
    });
    getData("fetch_currencies").then((data) => {
      setCurrency(data);
    });
    getData("fetch_accounts").then((data) => {
      setBankAccount(data);
    });
  }, []);
  // append bank account
  const appendBankAccountRow = (e) => {
    e.preventDefault();
    let user = localStorage.getItem("username");
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="code_added[]" disabled />
          </td>
          <td>
            <input type="text" name="bank_code_added[]" />
          </td>
          <td>
            <select style={{ width: "200px" }} name="bank_id_added[]">
              <option value="">Select Bank</option>
              {banks.map((dt) => {
                return <option value={dt.CODE}>{dt.BANK}</option>;
              })}
            </select>
          </td>
          <td>
            <input type="text" name="bank_account_added[]" />
          </td>
          <td>
            <select name="currency_added[]">
              <option value="">Select Bank</option>
              {currency.map((dt) => {
                return <option value={dt.code}>{dt.currency}</option>;
              })}
            </select>
          </td>
          <td>
            <input
              type="text"
              name="status_added[]"
              value={"Active"}
              readOnly
            />
          </td>
          <td>
            <input type="date" name="inactive_date_added[]" readOnly />
          </td>
          <td>
            <input type="text" name="user_id_added[]" value={user} readOnly />
          </td>
          <td>
            <input type="date" name="date_entered_added[]" readOnly />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeBankAccount(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedBankAccount((appendedBanAccount) => {
      return [...appendedBanAccount, row];
    });
  };
  //remove bank account row
  const removeBankAccount = async (id, e) => {
    e.preventDefault();
    setAppendedBankAccount((appendedBanAccount) => {
      return appendedBanAccount.filter((row) => row.id !== id);
    });
  };
  //save bank accounts
  const saveBankAccounts = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmBankAccounts"));
    postData(frmData, "save_bank_accounts")
      .then((data) => {
        console.log(data);
        setResponse(data[0]);
        setIsMessageModal(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //close message modal
  const closeMessageModal = () => {
    setIsMessageModal(false);
    setTimeout(function () {
      window.location.replace("/bank-accounts");
    });
  };
  return (
    <div>
      <div className="container">
        <p className="text-info h2">Bank Accounts</p>
        <hr />
      </div>
      <div className="card col-md-12">
        <button className="btn btn-success" onClick={appendBankAccountRow}>
          Add
        </button>
        <form id="frmBankAccounts" onSubmit={saveBankAccounts}>
          <table
            className="table table-bordered"
            style={{ maxHeight: "300px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th>Code</th>
                <th>Bank Code</th>
                <th>Bank Name</th>
                <th>Bank Account</th>
                <th>CurrencyId</th>
                <th>Status</th>
                <th>Inactive Date</th>
                <th>User Id</th>
                <th>Date Entered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bankAccount.map((dt) => {
                return (
                  <tr>
                    <td>
                      <input
                        type="text"
                        name="code[]"
                        defaultValue={dt.code}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="bank_code[]"
                        defaultValue={dt.bank_code}
                      />
                    </td>
                    <td>
                      <select
                        style={{ width: "200px" }}
                        name="bank_id[]"
                        defaultValue={dt.bank_id}
                      >
                        <option value="">Select Bank</option>
                        {banks.map((dt) => {
                          return <option value={dt.CODE}>{dt.BANK}</option>;
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="bank_account[]"
                        defaultValue={dt.bank_account}
                      />
                    </td>
                    <td>
                      <select name="currency[]" defaultValue={dt.currencyid}>
                        <option value="">Select Bank</option>
                        {currency.map((dt) => {
                          return <option value={dt.code}>{dt.currency}</option>;
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="status[]"
                        defaultValue={
                          dt.status === "0"
                            ? "Active"
                            : dt.status === null
                            ? "Active"
                            : "Inactive"
                        }
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="inactive_date[]"
                        defaultValue={dt.inactive_date}
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="user_id[]"
                        defaultValue={dt.user_id}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="date_entered[]"
                        defaultValue={dt.date_entered}
                        readOnly
                      />
                    </td>
                  </tr>
                );
              })}
              {appendedBanAccount.map((data) => {
                return <tr key={data.id}>{data.new}</tr>;
              })}
            </tbody>
          </table>
          <Spinner />
          <p>
            <input className="btn btn-info col-2" type="submit" value="save" />
          </p>
        </form>
      </div>
      {/*Message modal*/}
      <MessageModal
        modalIsOpen={messageModal}
        closeModal={closeMessageModal}
        background="#0047AB"
        body={<p className="text-white font-weight-bold h4">{response}</p>}
      />
    </div>
  );
};

export default BankAccounts;
