import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const Illness = () => {
  const [illness, setIllness] = useState([]);
  const [appendedIllness, setAppendedIllness] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_illness")
      .then((data) => {
        setIllness(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append illness
  const appendIllnessRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="code_added[]" disabled />
          </td>
          <td>
            <input type="text" name="illness_added[]" />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeIllness(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedIllness((appendedIllness) => {
      return [...appendedIllness, row];
    });
  };
  //remove illness row
  const removeIllness = async (id, e) => {
    e.preventDefault();
    setAppendedIllness((appendedIllness) => {
      return appendedIllness.filter((row) => row.id !== id);
    });
  };
  //save illness
  const saveIllness = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmIllness"));
    postData(frmData, "save_illness")
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
        window.location.replace("/illness");
      });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Illness</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendIllnessRow}>
            Add
          </button>
          <form id="frmIllness" onSubmit={saveIllness}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Illness</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {illness.map((dt) => {
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
                          name="illness[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.illnes}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedIllness.map((data) => {
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

export default Illness;
