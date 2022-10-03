import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const Bdm = () => {
  const [bdm, setBdm] = useState([]);
  const [appendedBdm, setAppendedBdm] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_bdm")
      .then((data) => {
        setBdm(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append bdm
  const appendBdmRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="code_added[]" disabled />
          </td>
          <td>
            <input type="text" name="name_added[]"  onInput={toInputUpperCase}/>
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeBdm(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedBdm((appendedBdm) => {
      return [...appendedBdm, row];
    });
  };
  //remove bdm row
  const removeBdm = async (id, e) => {
    e.preventDefault();
    setAppendedBdm((appendedBdm) => {
      return appendedBdm.filter((row) => row.id !== id);
    });
  };
  //save bdm
  const saveBdm = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmBdm"));
    postData(frmData, "save_bdm")
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
      window.location.replace("/bdm");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Bdm</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendBdmRow}>
            Add
          </button>
          <form id="frmBdm" onSubmit={saveBdm}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bdm.map((dt) => {
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
                          name="name[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.name}
                          onInput={toInputUpperCase}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedBdm.map((data) => {
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

export default Bdm;
