import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const ExchangeRate = () => {
  const [currency, setCurrency] = useState([]);
  const [exchangeRate, setExchangeRate] = useState([]);
  const [appendedExchangeRate, setAppendedExchangeRate] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_currencies").then((data) => {
      setCurrency(data);
    });

    getData("fetch_exchange_rates")
      .then((data) => {
        setExchangeRate(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // append Exchange Rate
  const appendExchangeRateRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
         <td hidden>
            <input type="text" name="id_added[]" />
          </td>
          <td>
            <input type="date" name="fromdt_added[]" />
          </td>
          <td>
            <input type="date" name="todt_added[]" />
          </td>
          <td>
            <input type="text" name="rate_added[]" />
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
            <button
              className="btn text-danger"
              onClick={(e) => removeExchangeRate(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedExchangeRate((appendedExchangeRate) => {
      return [...appendedExchangeRate, row];
    });
  };
  //remove Exchange Rate row
  const removeExchangeRate = async (id, e) => {
    e.preventDefault();
    setAppendedExchangeRate((appendedExchangeRate) => {
      return appendedExchangeRate.filter((row) => row.id !== id);
    });
  };
  //save exchange rate
  const saveExchangeRate = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmExchangeRate"));
    postData(frmData, "save_exchange_rates")
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
      window.location.replace("/exchange-rate");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Exchange Rate</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendExchangeRateRow}>
            Add
          </button>
          <form id="frmExchangeRate" onSubmit={saveExchangeRate}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th hidden>Id</th>
                  <th>Fromdt</th>
                  <th>Todt</th>
                  <th>Rate</th>
                  <th>Currency</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {exchangeRate.map((dt) => {
                  return (
                    <tr>
                      <td hidden>
                        <input
                          type="text"
                          name="id[]"
                          defaultValue={dt.id}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="fromdt[]"
                          defaultValue={dt.fromdt}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="todt[]"
                          defaultValue={dt.todt}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="rate[]"
                          defaultValue={dt.rate}
                        />
                      </td>
                      <td>
                        <select name="currency[]" defaultValue={dt.currency}>
                          <option value="">Select Bank</option>
                          {currency.map((dt) => {
                            return (
                              <option value={dt.code}>{dt.currency}</option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {appendedExchangeRate.map((data) => {
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

export default ExchangeRate;
