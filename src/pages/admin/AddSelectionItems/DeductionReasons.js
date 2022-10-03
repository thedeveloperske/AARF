import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const DeductionReasons = () => {
  const [deductionReasons, setDeductionReasons] = useState([]);
  const [appendedDeductionReason, setAppendedDeductionReason] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    document.getElementById("spinner").style.display = "block";
    getData("fetch_deduction_reasons")
      .then((data) => {
        setDeductionReasons(data);

        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append deduction reasons
  const appendDeductionReasonRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input
              type="text"
              name="code_added[]"
              style={{ width: "200px" }}
              disabled
            />
          </td>
          <td>
            <input
              type="text"
              name="deduct_reason_added[]"
              style={{ width: "400px" }}
            />
          </td>
          <td>
            <input
              type="text"
              name="category_added[]"
              style={{ width: "200px" }}
              disabled
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeDeductionReason(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedDeductionReason((appendedDeductionReason) => {
      return [...appendedDeductionReason, row];
    });
  };
  //remove deduction reasons row
  const removeDeductionReason = async (id, e) => {
    e.preventDefault();
    setAppendedDeductionReason((appendedDeductionReason) => {
      return appendedDeductionReason.filter((row) => row.id !== id);
    });
  };
  //save save deduction reasons
  const saveDeductionReasons = (e) => {
    e.preventDefault();

    const frmData = new FormData(
      document.getElementById("frmDeductionReasons")
    );
    postData(frmData, "save_deduction_reasons")
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
      window.location.replace("/deduction-reasons");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Deduction Reasons</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button
            className="btn btn-success"
            onClick={appendDeductionReasonRow}
          >
            Add
          </button>
          <form id="frmDeductionReasons" onSubmit={saveDeductionReasons}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Deduct Reason</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {deductionReasons.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="code[]"
                          style={{ width: "200px" }}
                          defaultValue={dt.CODE}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="deduct_reason[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.DEDUCT_REASON}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="category[]"
                          style={{ width: "200px" }}
                          defaultValue={dt.CATEGORY}
                          readOnly
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedDeductionReason.map((data) => {
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

export default DeductionReasons;
