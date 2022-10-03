import React, { useEffect, useState } from "react";
import Modal from "../../../components/helpers/Modal2";
import { Spinner } from "../../../components/helpers/Spinner";
import { getData, postData } from "../../../components/helpers/Data";

const ReinsurerQuotaShare = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reinsurer, setReinsurer] = useState([]);
  const [appendedRow, setAppendedRow] = useState([]);
  const [response, setResponse] = useState([]);

  useEffect(() => {
    getData("fetch_quota_share")
      .then((data) => {
        setReinsurer(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
    window.location.replace('/reinsurance-quota-share')
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
            <input type="number" name="ip_rate_appended[]" min={0} />
          </td>
          <td>
            <input type="number" name="commis_rate_appended[]" min={0} />
          </td>
          <td>
            <input type="number" name="tax_rate_appended[]" min={0} />
          </td>
          <td>
            <input type="number" name="retain_rate_appended[]" min={0} />
          </td>
          <td>
            <input type="number" name="rate_period_appended[]" min={0} />
          </td>
          <td>
            <input type="text" name="physical_location_appended[]" />
          </td>
          <td>
            <input type="text" name="address_appended[]" />
          </td>
          <td>
            <input
              type="checkbox"
              className="form-control re_broker_appended"
            />
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

  const saveQuotaShare = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmQuotaShare"));
    const reBroker = document.querySelectorAll(".re_broker");
    const reBrokerAppended = document.querySelectorAll(".re_broker_appended");

     reBroker.forEach((element) => {
       if (element.checked == true) {
         frmData.append("re_broker[]", "1");
       } else {
         frmData.append("re_broker[]", "0");
       }
     });
     reBrokerAppended.forEach((element) => {
       if (element.checked == true) {
         frmData.append("re_broker_appended[]", "1");
       } else {
         frmData.append("re_broker_appended[]", "0");
       }
     });
    postData(frmData, "save_quota_share")
      .then((data) => {
        if (data.length == 1) {
          setResponse(data)
          setModalIsOpen(true)
        } else {
          setResponse("There was an error saving reinsurance!")
          setModalIsOpen(true)
          console.log(data)
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <div className="container">
        <p className="text-info h2">Quota Share</p>
        <hr />
      </div>
      <div className="card col-md-12">
        <button className="btn btn-info" onClick={appendRow}>
          Add
        </button>
        <form id="frmQuotaShare" onSubmit={saveQuotaShare}>
          <table
            className="table table-bordered"
            id="quotaShare"
            style={{ maxHeight: "300px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th className="hidden">Code</th>
                <th>Re Insurer</th>
                <th>Cede (%)</th>
                <th>Commission(%)</th>
                <th>Tax(%)</th>
                <th>Retention(%)</th>
                <th>Period</th>
                <th>Physical Location</th>
                <th>Address</th>
                <th>Re Broker</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reinsurer.map((dt) => {
                return (
                  <tr key={dt.CODE}>
                    <td className="hidden">
                      <input
                        type="number"
                        name="code[]"
                        value={dt.CODE}
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="re_insurer[]"
                        defaultValue={dt.RE_INSURER}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min={0}
                        name="ip_rate[]"
                        defaultValue={dt.ip_rate}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        name="commis_rate[]"
                        defaultValue={dt.commis_rate}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min={0}
                        name="tax_rate[]"
                        defaultValue={dt.tax_rate}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        name="retain_rate[]"
                        defaultValue={dt.retain_rate}
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
                    <td>
                      <input type="text" name="address[]" value={dt.address} />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="physical_location[]"
                        defaultValue={dt.physical_location}
                      />
                    </td>

                    <td>
                      <input
                        type="checkbox"
                        className="form-control re_broker"
                        defaultValue={dt.re_broker}
                        defaultChecked={dt.re_broker === "1" ? "checked" : ""}
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

export default ReinsurerQuotaShare;
