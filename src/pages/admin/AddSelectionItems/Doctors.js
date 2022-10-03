import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [appendedDoctor, setAppendedDoctor] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    document.getElementById("spinner").style.display = "block";
    getData("fetch_doctors")
      .then((data) => {
        setDoctors(data);

        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append doctors
  const appendDoctorRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td hidden>
            <input
              type="text"
              name="code_added[]"
              disabled
            />
          </td>
          <td>
            <input
              type="text"
              name="doctor_added[]"
              style={{ width: "300px" }}
              onInput={toInputUpperCase}
            />
          </td>
          <td>
            <input
              type="text"
              name="tel_no_added[]"
              style={{ width: "200px" }}
            />
          </td>
          <td>
            <input
              type="text"
              name="mobile_no_added[]"
              style={{ width: "200px" }}
            />
          </td>
          <td>
            <input
              type="text"
              name="fax_no_added[]"
              style={{ width: "200px" }}
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeDoctor(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedDoctor((appendedDoctor) => {
      return [...appendedDoctor, row];
    });
  };
  //remove doctors row
  const removeDoctor = async (id, e) => {
    e.preventDefault();
    setAppendedDoctor((appendedDoctor) => {
      return appendedDoctor.filter((row) => row.id !== id);
    });
  };
  //save doctors
  const saveDoctors = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmDoctors"));
    postData(frmData, "save_doctors")
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
      window.location.replace("/doctors");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Doctors</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendDoctorRow}>
            Add
          </button>
          <form id="frmDoctors" onSubmit={saveDoctors}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th hidden>Code</th>
                  <th>Doctor</th>
                  <th>Tel No</th>
                  <th>Mobile No</th>
                  <th>Fax No</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((dt) => {
                  return (
                    <tr>
                      <td hidden>
                        <input
                          type="text"
                          name="code[]"
                          defaultValue={dt.CODE}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="doctor[]"
                          style={{ width: "300px" }}
                          onInput={toInputUpperCase}
                          defaultValue={dt.DOCTOR}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="tel_no[]"
                          style={{ width: "200px" }}
                          defaultValue={dt.TEL_NO}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="mobile_no[]"
                          style={{ width: "200px" }}
                          defaultValue={dt.MOBILE_NO}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="fax_no[]"
                          style={{ width: "200px" }}
                          defaultValue={dt.FAX_NO}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedDoctor.map((data) => {
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

export default Doctors;
