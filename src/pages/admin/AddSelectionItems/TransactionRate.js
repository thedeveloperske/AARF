import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const TransactionRate = () => {
  const [transactionRate, setTransactionRate] = useState([]);
  const [appendedTransactionRate, setAppendedTransactionRate] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_transaction_rates")
      .then((data) => {
        setTransactionRate(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append transaction rate
  const appendTransactionRateRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="code_added[]" disabled />
          </td>
          <td>
            <input type="text" name="description_added[]"  onInput={toInputUpperCase}/>
          </td>
          <td>
            <input type="text" name="rate_added[]" />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeTransactionRate(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedTransactionRate((appendedTransactionRate) => {
      return [...appendedTransactionRate, row];
    });
  };
  //remove transaction rate row
  const removeTransactionRate = async (id, e) => {
    e.preventDefault();
    setAppendedTransactionRate((appendedTransactionRate) => {
      return appendedTransactionRate.filter((row) => row.id !== id);
    });
  };
  //save transaction rate
  const saveTransactionRate = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmTransactionRate"));
    postData(frmData, "save_transaction_rates")
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
      window.location.replace("/transaction-rate");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Transaction Rate</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button
            className="btn btn-success"
            onClick={appendTransactionRateRow}
          >
            Add
          </button>
          <form id="frmTransactionRate" onSubmit={saveTransactionRate}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Rate</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactionRate.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="code[]"
                          style={{ width: "300px" }}
                          defaultValue={dt.code}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="description[]"
                          style={{ width: "300px" }}
                          onInput={toInputUpperCase}
                          defaultValue={dt.description}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="rate[]"
                          style={{ width: "300px" }}
                          defaultValue={dt.rate}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedTransactionRate.map((data) => {
                  return <tr key={data.id}>{data.new}</tr>;
                })}
              </tbody>
            </table>
            <Spinner />
            <p>
              <input
                className="btn btn-info col-2"
                type="submit"
                value="save"
              />
            </p>
          </form>
        </div>
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

export default TransactionRate;
