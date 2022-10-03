import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";

import { Spinner } from "../../../components/helpers/Spinner";
import Modal from "../../../components/helpers/Modal2";
const RateSheet = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [corporate, setCorporate] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [familySize, setFamilySize] = useState([]);
  const [relation, setRelation] = useState([]);
  const [clientType, setClientType] = useState([]);
  const [selectedCorporate, setSelectedCorporate] = useState([]);
  const [rateData, setRateData] = useState([]);
  const [corpData, setCorpData] = useState([]);
  const [appendedRates, setAppendedRates] = useState([]);
  const [response, setResponse] = useState([]);

  const closeModal = () => {
    setModalIsOpen(false);
    window.location.replace("/rate-sheet");
  };

  useEffect(() => {
    getData("fetch_corporates")
      .then((data) => {
        setCorporate(data);
      })
      .catch((error) => console.log(error));
    getData("fetch_products")
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.log(error));
    getData("fetch_categories")
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.log(error));
    getData("fetch_family_size")
      .then((data) => {
        setFamilySize(data);
      })
      .catch((error) => console.log(error));
    getData("fetch_rate_sheet_relation")
      .then((data) => {
        setRelation(data);
      })
      .catch((error) => console.log(error));
    getData("fetch_client_types")
      .then((data) => {
        setClientType(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setRateData([]);
    setAppendedRates([]);
    if (selectedCorporate != 0) {
      document.getElementById("spinner").style.display = "block";
      getOneData("fetch_rate_sheet_data", selectedCorporate)
        .then((data) => {
          setRateData(data.client_rates);
          setCorpData(data.corporate[0]);
          document.getElementById("spinner").style.display = "none";
        })
        .catch((error) => {
          document.getElementById("spinner").style.display = "none";
          console.log(error);
        });
    }
  }, [selectedCorporate]);

  const printPdf = (e) => {
    e.preventDefault();
  };

  const appendRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <select name="corp_appended[]">
              <option value={corpData.corp_id}>{corpData.corporate}</option>
            </select>
          </td>
          <td>
            <input type="text" name="family_no_appended[]" />
          </td>
          <td>
            <select defaultValue="" name="health_plan_appended[]">
              <option value="">Select Category</option>
              {categories.map((dt) => {
                return <option value={dt.category}>{dt.category}</option>;
              })}
            </select>
          </td>
          <td>
            <select defaultValue="" name="product_name_appended[]">
              <option value="">Select Product Name</option>
              {products.map((dt) => {
                return <option value={dt.code}>{dt.product_name}</option>;
              })}
            </select>
          </td>
          <td>
            <select defaultValue="" name="family_size_appended[]">
              <option value="">Select Family Size</option>
              {familySize.map((dt) => {
                return <option value={dt.fam_lives}>{dt.fam_size}</option>;
              })}
            </select>
          </td>
          <td>
            <input type="text" name="min_age_appended[]" />
          </td>
          <td>
            <input type="text" name="max_age_appended[]" />
          </td>
          <td>
            <select defaultValue="" name="family_title_appended[]">
              <option value="">Select Family Size</option>
              {relation.map((dt) => {
                return <option value={dt.CODE}>{dt.RELATION}</option>;
              })}
            </select>
          </td>
          <td>
            <input
              type="number"
              name="premium_appended[]"
              min={0}
              step="0.0001"
            />
          </td>
          <td>
            <select defaultValue="" name="client_type_appended[]">
              <option value="">Select Client Type</option>
              {clientType.map((dt) => {
                return <option value={dt.code}>{dt.client_type}</option>;
              })}
            </select>
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeRate(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedRates((appendedRates) => {
      return [...appendedRates, row];
    });
  };

  const removeRate = async (id, e) => {
    e.preventDefault();
    setAppendedRates((appendedRates) => {
      return appendedRates.filter((row) => row.id !== id);
    });
  };

  const saveRateSheet = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmRateSheet"));
    postData(frmData, "save_rate_sheet")
      .then((data) => {
        setResponse(data);
        setModalIsOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="container">
        <p className="text-info h2">Rate Sheet</p>
        <hr />
        <div className="row">
          <div className="col-md-6">
            <select
              className="form-control"
              defaultValue="0"
              onChange={(e) => setSelectedCorporate(e.target.value)}
            >
              <option disabled value="0">
                Select Corporate
              </option>
              {corporate.map((dt) => {
                return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="card col-md-12">
        <button className="btn btn-success" onClick={appendRow}>
          Add
        </button>
        <form id="frmRateSheet" onSubmit={saveRateSheet}>
          <table
            className="table table-bordered"
            id="payCommisTbl"
            style={{ maxHeight: "300px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th className="hidden">idx</th>
                <th>Corporate</th>
                <th>Family No</th>
                <th>Health Plan</th>
                <th>Product Name</th>
                <th>Family Size</th>
                <th>Min Age</th>
                <th>Max Age</th>
                <th>Family Title</th>
                <th>Premium</th>
                <th>Client Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rateData.map((dt) => {
                return (
                  <tr key={dt.idx}>
                    <td className="hidden">
                      <input type="text" name="idx[]" value={dt.idx} />
                    </td>
                    <td>
                      <select
                        name="corporate[]"
                        className="form-control"
                        style={{ width: "400px" }}
                      >
                        <option value={corpData.corp_id}>
                          {corpData.corporate}
                        </option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        style={{ width: "200px" }}
                        name="family_no[]"
                        defaultValue={dt.family_no}
                      />
                    </td>
                    <td>
                      <select
                        name="health_plan[]"
                        className="form-control"
                        style={{ width: "200px" }}
                        defaultValue={
                          dt.health_plan == null ? "" : dt.health_plan
                        }
                      >
                        <option value="">Select Category</option>
                        {categories.map((dt) => {
                          return (
                            <option value={dt.category}>{dt.category}</option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <select
                        name="product_name[]"
                        className="form-control"
                        style={{ width: "300px" }}
                        defaultValue={
                          dt.product_name == null ? "" : dt.product_name
                        }
                      >
                        <option value="">Select Product Name</option>
                        {products.map((dt) => {
                          return (
                            <option value={dt.code}>{dt.product_name}</option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <select
                        name="family_size[]"
                        className="form-control"
                        style={{ width: "200px" }}
                        defaultValue={
                          dt.family_size == null ? "" : dt.family_size
                        }
                      >
                        <option value="">Select Family Size</option>
                        {familySize.map((dt) => {
                          return (
                            <option value={dt.fam_lives}>{dt.fam_size}</option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="min_age[]"
                        className="form-control"
                        style={{ width: "200px" }}
                        defaultValue={dt.min_age}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        style={{ width: "200px" }}
                        name="max_age[]"
                        defaultValue={dt.max_age}
                      />
                    </td>
                    <td>
                      <select
                        name="family_title[]"
                        className="form-control"
                        style={{ width: "200px" }}
                        defaultValue={
                          dt.family_title == null ? "" : dt.family_title
                        }
                      >
                        <option value="">Select Family Size</option>
                        {relation.map((dt) => {
                          return <option value={dt.CODE}>{dt.RELATION}</option>;
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: "200px" }}
                        name="premium[]"
                        min={0}
                        step="0.0001"
                        defaultValue={dt.premium}
                      />
                    </td>
                    <td>
                      <select
                        name="client_type[]"
                        className="form-control"
                        style={{ width: "200px" }}
                        defaultValue={
                          dt.individual == null ? "" : dt.individual
                        }
                      >
                        <option value="">Select Client Type</option>
                        {clientType.map((dt) => {
                          return (
                            <option value={dt.code}>{dt.client_type}</option>
                          );
                        })}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {appendedRates.map((data) => {
                return <tr key={data.id}>{data.new}</tr>;
              })}
            </tbody>
          </table>
          <Spinner />
          <p>
            <input className="btn btn-info col-2" type="submit" value="save" />
            {/* <input
              className="btn btn-success col-2"
              type="button"
              value="print"
              onClick={printPdf}
            /> */}
          </p>
        </form>
      </div>
      <Modal
        background="#0047AB"
        body={response.map((dt) => {
          return <p className="text-white font-weight-bold h4">{dt}</p>;
        })}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
      />
    </div>
  );
};

export default RateSheet;
