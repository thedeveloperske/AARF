import React, { useEffect, useState } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import Modal from "../../../components/helpers/Modal2";
import { Spinner } from "../../../components/helpers/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReinsurerExcessOfLoss = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reinsurer, setReinsurer] = useState([]);
  const [appendedRow, setAppendedRow] = useState([]);
  const [response, setResponse] = useState([]);

  useEffect(() => {
    getData("fetch_excess_of_loss")
      .then((data) => {
        setReinsurer(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
    window.location.replace("/reinsurance-excess-of-loss");
  };

  const appendRow = () => {
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="re_insurer_appended[]" />
          </td>
          <td>
            <input type="number" name="upper_limit_appended[]" min={0} />
          </td>

          <td>           
            <input type="number" name="rate_period_appended[]" min={0} />
          </td>
          <td>
            <input
              type="button"
              className="btn btn-danger"
              value="Remove"
              onClick={(e) => removeRow(row.id, e)}
            />
          </td>
        </>
      ),
    };

    setAppendedRow((appendedRow) => {
      return [...appendedRow, row];
    });
  };

  //remove selected row
  const removeRow = (id, e) => {
    e.preventDefault();
    setAppendedRow((appendedRow) => {
      return appendedRow.filter((row) => row.id !== id);
    });
  };

  const saveExcessOfLoss = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmExcessOfLoss"));

    postData(frmData, "save_excess_of_loss")
      .then((data) => {
        if (data.length == 1) {
          setResponse(data);
          setModalIsOpen(true);
        } else {
          setResponse("There was an error saving reinsurance!");
          setModalIsOpen(true);
          console.log(data);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <div className="container">
        <p className="text-info h2">Excess Of Loss</p>
        <hr />
      </div>
      <div className="card col-md-12">
        <button className="btn btn-info" onClick={appendRow}>
          Add
        </button>
        <form id="frmExcessOfLoss" onSubmit={saveExcessOfLoss}>
          <table
            className="table table-bordered"
            id="quotaShare"
            style={{ maxHeight: "300px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th className="hidden">Code</th>
                <th>Re Insurer</th>
                <th>Upper Limit</th>
                <th>Period</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reinsurer.map((dt) => {
                return (
                  <tr key={dt.code}>
                    <td className="hidden">
                      <input
                        type="number"
                        name="code[]"
                        value={dt.code}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="re_insurer[]"
                        defaultValue={dt.re_insurer}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        name="upper_limit[]"
                        defaultValue={dt.upper_limit}
                      />
                    </td>
                    <td>                    
                      <input
                        type="number"
                        min={0}
                        name="rate_period[]"
                        defaultValue={dt.rate_period}
                      />
                    </td>
                  </tr>
                );
              })}
              {appendedRow.map((dt) => {
                return <tr key={dt.id}>{dt.new}</tr>;
              })}
            </tbody>
          </table>
          <Spinner />
          <p>
            <input className="btn btn-info col-2" type="submit" value="save" />
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

export default ReinsurerExcessOfLoss;
