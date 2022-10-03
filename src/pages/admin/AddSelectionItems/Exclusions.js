import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const Exclusions = () => {
  const [exclusions, setExclusions] = useState([]);
  const [appendedExclusions, setAppendedExclusions] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_exclusions")
      .then((data) => {
        setExclusions(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append exclusions
  const appendExclusionRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="code_added[]" disabled />
          </td>
          <td>
            <input type="text" name="exclusions_added[]" />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeExclusion(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedExclusions((appendedExclusions) => {
      return [...appendedExclusions, row];
    });
  };
  //remove exclusion row
  const removeExclusion = async (id, e) => {
    e.preventDefault();
    setAppendedExclusions((appendedExclusions) => {
      return appendedExclusions.filter((row) => row.id !== id);
    });
  };
  //save illness
  const saveExclusions = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmExclusions"));
    postData(frmData, "save_exclusions")
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
      window.location.replace("/exclusions");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Exclusions</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendExclusionRow}>
            Add
          </button>
          <form id="frmExclusions" onSubmit={saveExclusions}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Exclusions</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {exclusions.map((dt) => {
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
                          name="exclusions[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.exclusion}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedExclusions.map((data) => {
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

export default Exclusions;
