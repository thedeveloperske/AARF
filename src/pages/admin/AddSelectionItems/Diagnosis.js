import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const Diagnosis = () => {
  const [diagnosis, setDiagnosis] = useState([]);
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

    document.getElementById("spinner").style.display = "block";
    getData("fetch_admin_diagnosis")
      .then((data) => {
        setDiagnosis(data);

        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append diagnosis
  const appendDiagnosisRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="diag_code_added[]" />
          </td>
          <td>
            <select name="diagnosis_class_added[]" style={{ width: "300px" }}>
              <option value="">Select Diagnosis Class</option>
              {diagnosisClass.map((dt) => {
                return <option value={dt.diagnosis_class}>{dt.class_description}</option>;
              })}
            </select>
          </td>
          <td>
            <input type="text" name="clinical_diagnosis_added[]" style={{ width: "500px" }}/>
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

    const frmData = new FormData(document.getElementById("frmDiagnosis"));
    postData(frmData, "save_admin_diagnosis")
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
      window.location.replace("/diagnosis");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Diagnosis</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendDiagnosisRow}>
            Add
          </button>
          <form id="frmDiagnosis" onSubmit={saveDiagnosis}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Diag Code</th>
                  <th>Diagnosis Class</th>
                  <th>Clinical Diagnosis</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {diagnosis.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="diag_code[]"
                          defaultValue={dt.diag_code}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="diagnosis_class[]"
                          style={{ width: "300px" }}
                          defaultValue={dt.diagnosis_class}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="clinical_diagnosis[]"
                          style={{ width: "500px" }}
                          defaultValue={dt.clinical_diagnosis}
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

export default Diagnosis;
