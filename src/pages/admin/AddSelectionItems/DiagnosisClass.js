import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const DiagnosisClass = () => {
  const [diagnosisClass, setDiagnosisClass] = useState([]);
  const [appendedDiagnosis, setAppendedDiagnosis] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_diagnosis_class")
      .then((data) => {
        setDiagnosisClass(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append diagnosis class
  const appendDiagnosisRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="diagnosis_class_added[]"/>
          </td>
          <td>
            <input type="text" name="class_description_added[]" />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeDiagnosis(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedDiagnosis((appendedDiagnosis) => {
      return [...appendedDiagnosis, row];
    });
  };
  //remove diagnosis row
  const removeDiagnosis = async (id, e) => {
    e.preventDefault();
    setAppendedDiagnosis((appendedDiagnosis) => {
      return appendedDiagnosis.filter((row) => row.id !== id);
    });
  };
  //save diagnosis
  const saveDiagnosis = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmDiagnosisClass"));
    postData(frmData, "save_diagnosis_class")
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
      window.location.replace("/diagnosis-class");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Diagnosis Class</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendDiagnosisRow}>
            Add
          </button>
          <form id="frmDiagnosisClass" onSubmit={saveDiagnosis}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Diagnosis Class</th>
                  <th>Class Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {diagnosisClass.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="diagnosis_class[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.diagnosis_class}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="class_description[]"
                          style={{ width: "400px" }}
                          defaultValue={dt.class_description}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedDiagnosis.map((data) => {
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

export default DiagnosisClass;
