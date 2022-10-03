import React, { useState, useEffect } from "react";
import { getData, postData } from "../../../components/helpers/Data";
import { toInputUpperCase } from "../../../components/helpers/toInputUpperCase";
import { Spinner } from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";

const SchemeRules = () => {
  const [rules, setRules] = useState([]);
  const [appendedRules, setAppendedRules] = useState([]);
  const [messageModal, setIsMessageModal] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    document.getElementById("spinner").style.display = "block";
    getData("fetch_rules")
      .then((data) => {
        setRules(data);

        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append scheme rules
  const appendRulesRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input
              type="text"
              name="code_added[]"
              style={{ width: "300px" }}
              disabled
            />
          </td>
          <td>
            <input
              type="text"
              name="rule_added[]"
              style={{ width: "400px" }}
              onInput={toInputUpperCase}
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeRule(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedRules((appendedRules) => {
      return [...appendedRules, row];
    });
  };
  //remove scheme rules row
  const removeRule = async (id, e) => {
    e.preventDefault();
    setAppendedRules((appendedRules) => {
      return appendedRules.filter((row) => row.id !== id);
    });
  };
  //save scheme rules
  const saveRules = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmSchemeRules"));
    postData(frmData, "save_rules")
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
      window.location.replace("/scheme-rules");
    });
  };
  return (
    <div>
      <div className="container">
        <div className="container">
          <p className="text-info h2">Scheme Rules</p>
          <hr />
        </div>
        <div className="card col-md-12">
          <button className="btn btn-success" onClick={appendRulesRow}>
            Add
          </button>
          <form id="frmSchemeRules" onSubmit={saveRules}>
            <table
              className="table table-bordered"
              style={{ maxHeight: "300px" }}
            >
              <thead className="thead-dark">
                <tr>
                  <th>Code</th>
                  <th>Rule</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((dt) => {
                  return (
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="code[]"
                          style={{ width: "300px" }}
                          defaultValue={dt.CODE}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="rule[]"
                          style={{ width: "400px" }}
                          onInput={toInputUpperCase}
                          defaultValue={dt.RULE}
                        />
                      </td>
                    </tr>
                  );
                })}
                {appendedRules.map((data) => {
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

export default SchemeRules;
