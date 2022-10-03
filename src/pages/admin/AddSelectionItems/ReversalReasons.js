import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const ReversalReasons = () => {
  const [reversalReasons, setReversalReasons] = useState([]);
  const [appendedReversalReason, setAppendedReversalReason] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_reversal_reasons")
      .then((data) => {
        setReversalReasons(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append reversal reasons
  const appendReversalReasonRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="code_added[]" disabled />
          </td>
          <td>
            <input type="text" name="reason_added[]" onInput={toInputUpperCase}/>
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeReversalReason(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedReversalReason((appendedReversalReason) => {
      return [...appendedReversalReason, row];
    });
  };
  //remove Reversal Reason row
  const removeReversalReason = async (id, e) => {
    e.preventDefault();
    setAppendedReversalReason((appendedReversalReason) => {
      return appendedReversalReason.filter((row) => row.id !== id);
    });
  };
  //save reversal reason
  const saveReversalReason = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmReversalReasons"));
    postData(frmData, "save_reversal_reasons")
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
      window.location.replace("/reversal-reasons");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Reversal Reasons</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendReversalReasonRow}>
            Add
          </button>
          <form id="frmReversalReasons" onSubmit={saveReversalReason}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Reasons</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reversalReasons.map((dt) => {
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
                          name="reason[]"
                          style={{ width: "400px" }}
                          onInput={toInputUpperCase}
                          defaultValue={dt.reason}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedReversalReason.map((data) => {
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

export default ReversalReasons;
