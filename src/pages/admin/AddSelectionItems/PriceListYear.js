import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const PriceListYear = () => {
  const [priceListYear, setPriceListYear] = useState([]);
  const [appendedPriceListYear, setAppendedPriceListYear] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_price_list_year")
      .then((data) => {
        setPriceListYear(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append price list year row
  const appendPriceListYearRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="code_added[]" disabled />
          </td>
          <td>
            <input type="text" name="year_added[]" />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removePriceListYear(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedPriceListYear((appendedPriceListYear) => {
      return [...appendedPriceListYear, row];
    });
  };
  //remove price list year row
  const removePriceListYear = async (id, e) => {
    e.preventDefault();
    setAppendedPriceListYear((appendedPriceListYear) => {
      return appendedPriceListYear.filter((row) => row.id !== id);
    });
  };
  //save price list year
  const savePriceListYear = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmPriceListYear"));
    postData(frmData, "save_price_list_year")
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
      window.location.replace("/price-list-year");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Price List Year</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendPriceListYearRow}>
            Add
          </button>
          <form id="frmPriceListYear" onSubmit={savePriceListYear}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Year</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {priceListYear.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="code[]"
                          style={{ width: "400px" }}
                            defaultValue={dt.code}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="year[]"
                          style={{ width: "400px" }}
                            defaultValue={dt.year}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedPriceListYear.map((data) => {
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

export default PriceListYear;
