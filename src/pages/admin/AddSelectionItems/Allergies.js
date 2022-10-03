import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const Allergies = () => {
  const [allergies, setAllergies] = useState([]);
  const [appendedAllergy, setAppendedAllergy] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    getData("fetch_allergies")
      .then((data) => {
        setAllergies(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append allergy
  const appendAllergyRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="code_added[]" disabled />
          </td>
          <td>
            <input type="text" name="allergy_added[]" onInput={toInputUpperCase}/>
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeAllergy(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedAllergy((appendedAllergy) => {
      return [...appendedAllergy, row];
    });
  };
  //remove allergy row
  const removeAllergy = async (id, e) => {
    e.preventDefault();
    setAppendedAllergy((appendedAllergy) => {
      return appendedAllergy.filter((row) => row.id !== id);
    });
  };
  //save allergy
  const saveAllergy = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmAllergies"));
    postData(frmData, "save_allergies")
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
      window.location.replace("/allergies");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Allergies</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendAllergyRow}>
            Add
          </button>
          <form id="frmAllergies" onSubmit={saveAllergy}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Allergy</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allergies.map((dt) => {
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
                          name="allergy[]"
                          style={{ width: "400px" }}
                          onInput={toInputUpperCase}
                          defaultValue={dt.allergy}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedAllergy.map((data) => {
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

export default Allergies;
