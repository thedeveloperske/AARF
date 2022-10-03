import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const SuspendRejectReasons = () => {
  const [suspendRejectReason, setSuspendRejectReason] = useState([]);
  const [appendedSuspendReject, setAppendedSuspendReject] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_suspend_reject_reasons")
      .then((data) => {
        setSuspendRejectReason(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append suspend reject
  const appendSuspendRejectRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="code_added[]" disabled />
          </td>
          <td>
            <input
              type="text"
              name="reason_added[]"
              onInput={toInputUpperCase}
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeSuspendReject(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedSuspendReject((appendedSuspendReject) => {
      return [...appendedSuspendReject, row];
    });
  };
  //remove suspend reject row
  const removeSuspendReject = async (id, e) => {
    e.preventDefault();
    setAppendedSuspendReject((appendedSuspendReject) => {
      return appendedSuspendReject.filter((row) => row.id !== id);
    });
  };
  //save suspend reject reasons
  const saveSuspendReject = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmSuspendReject"));
    postData(frmData, "save_suspend_reject_reasons")
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
      window.location.replace("/suspend-reject-reasons");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Suspend/Reject Reasons</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendSuspendRejectRow}>
            Add
          </button>
          <form id="frmSuspendReject" onSubmit={saveSuspendReject}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {suspendRejectReason.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="code[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.CODE}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="reason[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.REASON}
                          onInput={toInputUpperCase}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedSuspendReject.map((data) => {
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

export default SuspendRejectReasons;
