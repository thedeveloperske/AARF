import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { today2 } from "../../../components/helpers/today";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const PriceList = () => {
  const [providers, setProviders] = useState([]);
  const [priceListYear, setPriceListYear] = useState([]);
  const [serviceItemData, setServiceItemData] = useState([]);
  const [oneServiceItemData, setOneServiceItemData] = useState([]);
  const [appendedPriceList, setAppendedPriceList] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);
  const [code, setCode] = useState([]);

  useEffect(() => {
    getData("fetch_providers")
      .then((data) => {
        setProviders(data);
      })
      .catch((error) => console.log(error));
    getData("fetch_price_list_year")
      .then((data) => {
        setPriceListYear(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchServiceItems = (e) => {
    e.preventDefault([]);
    setServiceItemData([]);

    const frmData = new FormData(document.getElementById("frmServiceItem"));
    document.getElementById("spinner").style.display = "block";
    postData(frmData, "fetch_service_item_data")
      .then((data) => {
        if (data.length != 0) {
          console.log(data);
          setServiceItemData(data);
        } else {
          setResponse(["Could not find Service in the provider"]);
          setIsMessageModal(true);
        }
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => console.log(error));
  };

  const getServiceItemRowData = (e) => {
    e.preventDefault();
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.children[0].value);
    });
    document.getElementById("spinner").style.display = "block";
    setCode(arr[5]);
    getOneData("fetch_service_item_by_item_code", arr[0])
      .then((data) => {
        console.log(data);
        setOneServiceItemData(data);

        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => console.log(error));
  };
  // append price list row
  const appendPriceListRow = (e) => {
    e.preventDefault();
    setServiceItemData([]);
    setOneServiceItemData([]);
    let user = localStorage.getItem("username");
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="item_code_added[]" disabled />
          </td>
          <td>
            <input
              type="text"
              name="category_added[]"
              onInput={toInputUpperCase}
            />
          </td>
          <td>
            <input
              type="text"
              name="service_items_added[]"
              onInput={toInputUpperCase}
            />
          </td>
          <td>
            <input
              type="text"
              name="unit_of_measure_added[]"
              onInput={toInputUpperCase}
            />
          </td>
          <td>
            <input type="text" name="price_added[]" />
          </td>
          <td>
            <select name="provider_added[]" style={{ width: "300px" }}>
              <option value="">Select provider</option>
              {providers.map((dt) => {
                return <option value={dt.CODE}>{dt.PROVIDER}</option>;
              })}
            </select>
          </td>
          <td>
            <select name="year_added[]">
              <option value="">Select year</option>
              {priceListYear.map((dt) => {
                return <option value={dt.code}>{dt.year}</option>;
              })}
            </select>
          </td>
          <td>
            <input type="date" name="updated_added[]" />
          </td>
          <td>
            <input type="text" name="user_id_added[]" value={user} readOnly />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removePriceList(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedPriceList((appendedPriceList) => {
      return [...appendedPriceList, row];
    });
  };
  //remove price list row
  const removePriceList = async (id, e) => {
    e.preventDefault();
    setAppendedPriceList((appendedPriceList) => {
      return appendedPriceList.filter((row) => row.id !== id);
    });
  };
  //save price list
  const savePriceList = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmPriceList"));
    frmData.append('code', code);
    postData(frmData, "save_service_items")
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
      window.location.replace("/price-list");
    });
  };
  return (
    <div>
      <div className="container">
        <p className="text-info h2">Price List</p>
        <hr />
        <form id="frmServiceItem" onSubmit={fetchServiceItems}>
          <div className="row">
            <div className="col-md-4">
              <select
                className="form-control"
                name="provider"
                id="provider"
                defaultValue="0"
              >
                <option disabled value="0">
                  Select Provider
                </option>
                {providers.map((dt) => {
                  return <option value={dt.CODE}>{dt.PROVIDER}</option>;
                })}
              </select>
            </div>
            <div className="col-md-3">
              <input
                className="form-control col-md-12"
                type="text"
                id="service"
                name="service"
                placeholder="Service Item"
                onInput={toInputUpperCase}
                required="true"
              />
            </div>
            <div id="get_item" className="col-md-3">
              <button type="submit" className="btn btn-info col-md-6">
                Search Item
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="card col-md-12">
        <button className="btn btn-success" onClick={appendPriceListRow}>
          Add
        </button>
        <form id="frmPriceList" onSubmit={savePriceList}>
          <p className="text-info h5">New/Query Service Item</p>
          <table
            className="table table-bordered"
            style={{ maxHeight: "300px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th>Item Code</th>
                <th>Category</th>
                <th>Service Items</th>
                <th>Unit Of Measure</th>
                <th>Price</th>
                <th>Provider</th>
                <th>Year</th>
                <th>Date Updated</th>
                <th>User Id</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {serviceItemData.map((dt) => {
                return (
                  <tr>
                    <td>
                      <input
                        type="text"
                        name="item_code[]"
                        defaultValue={dt.item_code}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="category[]"
                        defaultValue={dt.category}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="service_items[]"
                        style={{ width: "300px" }}
                        defaultValue={dt.service_items}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="unit_of_measure[]"
                        defaultValue={dt.unit_of_measure}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="price[]"
                        defaultValue={dt.price}
                      />
                    </td>
                    <td>
                      <select
                        name="provider[]"
                        style={{ width: "300px" }}
                        defaultValue={dt.provider == null ? "" : dt.provider}
                      >
                        <option value="">Select provider</option>
                        {providers.map((dt) => {
                          return <option value={dt.CODE}>{dt.PROVIDER}</option>;
                        })}
                      </select>
                    </td>
                    <td>
                      <select
                        name="year[]"
                        defaultValue={dt.year == null ? "" : dt.year}
                      >
                        <option value="">Select year</option>
                        {priceListYear.map((dt) => {
                          return <option value={dt.code}>{dt.year}</option>;
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        name="updated[]"
                        defaultValue={dt.updated}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="user_id[]"
                        defaultValue={dt.user_id}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-success form-control select"
                        onClick={getServiceItemRowData}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                );
              })}
              {appendedPriceList.map((data) => {
                return <tr key={data.id}>{data.new}</tr>;
              })}
            </tbody>
          </table>
          <Spinner />

          <p className="text-info h5">Add To All Providers</p>
          <table
            className="table table-bordered"
            style={{ maxHeight: "300px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th>Item Code</th>
                <th>Category</th>
                <th>Service Items</th>
                <th>Unit Of Measure</th>
                <th>Price</th>
                <th>Provider</th>
                <th>Year</th>
                <th>Date Updated</th>
                <th>User Id</th>
              </tr>
            </thead>
            <tbody>
              {oneServiceItemData.map((dt) => {
                return (
                  <tr>
                    <td>
                      <input
                        type="text"
                        name="item_code_all[]"
                        value={dt.item_code}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="category_all[]"
                        value={dt.category}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="service_items_all[]"
                        style={{ width: "300px" }}
                        value={dt.service_items}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="unit_of_measure_all[]"
                        value={dt.unit_of_measure}
                        readOnly
                      />
                    </td>
                    <td>
                      {dt.code === dt.provider_code ? (
                        <input
                          type="text"
                          name="price_all[]"
                          defaultValue={dt.price}
                        />
                      ) : (
                        <input type="text" name="price_all[]" defaultValue="0" />
                      )}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="provider_all[]"
                        style={{ width: "300px" }}
                        value={dt.provider}
                        readOnly
                      />
                    </td>
                    <td>
                      <select
                        name="year_all[]"
                        value={dt.year == null ? "" : dt.year}
                        readOnly
                      >
                        <option value="">Select year</option>
                        {priceListYear.map((dt) => {
                          return <option value={dt.code}>{dt.year}</option>;
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        name="updated_all[]"
                        value={dt.updated}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="user_id_all[]"
                        value={dt.user_id}
                        readOnly
                      />
                    </td>
                    <td hidden>
                      <input
                        type="text"
                        name="provider_code[]"
                        value={dt.provider_code}
                        readOnly
                      />
                    </td>
                  </tr>
                );
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

export default PriceList;
