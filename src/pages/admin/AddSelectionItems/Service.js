import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const Service = () => {
  const [service, setService] = useState([]);
  const [appendedService, setAppendedService] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    document.getElementById("spinner").style.display = "block";
    getData("fetch_service")
      .then((data) => {
        setService(data);

        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append service
  const appendServiceRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input
              type="text"
              name="code_added[]"
              style={{ width: "300px" }}
              disabled
            />
          </td>
          <td>
            <input
              type="text"
              name="service_added[]"
              style={{ width: "400px" }}
              onInput={toInputUpperCase}
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeService(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedService((appendedService) => {
      return [...appendedService, row];
    });
  };
  //remove service row
  const removeService = async (id, e) => {
    e.preventDefault();
    setAppendedService((appendedService) => {
      return appendedService.filter((row) => row.id !== id);
    });
  };
  //save service
  const saveService = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmService"));
    postData(frmData, "save_service")
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
      window.location.replace("/service");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Service</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendServiceRow}>
            Add
          </button>
          <form id="frmService" onSubmit={saveService}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Service</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {service.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="code[]"
                          style={{ width: "300px" }}
                          defaultValue={dt.CODE}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="service[]"
                          style={{ width: "400px" }}
                          onInput={toInputUpperCase}
                          defaultValue={dt.SERVICE}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedService.map((data) => {
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

export default Service;
