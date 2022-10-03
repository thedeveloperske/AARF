import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import { today } from "../../../components/helpers/today";
import { useState, useEffect } from "react";
import Modal2 from "../../../components/helpers/Modal2";

const SmartRequest = () => {
  const [choosenRequestType, setChoosenRequestType] = useState("");
  const [requestType, setRequestType] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [response, setResponse] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
    window.location.replace("/smart-request");
  };

  useEffect(() => {
    getData("fetch_hais_triggers")
      .then((data) => {
        setRequestType(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const setChoosenValue = () => {
    setChoosenRequestType("");
    var sel = document.getElementById("request_type");
    var selected = sel.options[sel.selectedIndex];
    var extra = selected.dataset.type;
    setChoosenRequestType(extra);
  };

  const fetchData = (e) => {
    e.preventDefault();

    getOneData(
      "smart_request_data",
      document.getElementById("member_no").value
    ).then((data) => {
      if (data.length != 0) {
        setUserInfo(data[0]);
      }
    });
  };
  const saveSmartRequest = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("smartFrm"));
    frmData.append("member_no", userInfo.member_no);
    frmData.append("user", localStorage.getItem("username"));
    postData(frmData, "save_smart_request").then((data) => {
      setResponse(data[0]);
      setModalIsOpen(true);
    });
  };
  return (
    <div>
      <div className="row form-group">
        <label
          htmlFor="surname"
          className="col-form-label col-sm-1 label-align pr-0 pl-0"
        >
          Member No
        </label>
        <div className="col-sm-4">
          <input
            type="text"
            className="form-control"
            name="member_no"
            id="member_no"
            required="true"
            id="member_no"
          />
        </div>
        <div className="col-sm-2">
          <input
            type="button"
            className="btn btn-info"
            value="Run"
            onClick={fetchData}
          />
        </div>       
      </div>

      <div className="card">
        <p className="text-info font-weight-bold text-info h3">
          Smart Card Request
        </p>
        <hr />
        <div className="col-md-12">
          <div className="row">
            <form
              id="smartFrm"
              onSubmit={saveSmartRequest}
              className="col-md-12"
            >
              <label
                htmlFor="member_name"
                className="col-form-label col-sm-4 label-align pr-0 pl-0"
              >
                Member Name
              </label>
              <div className="col-sm-12">
                <input
                  type="text"
                  className="form-control"
                  name="member_name"
                  required
                  value={userInfo.length !== 0 ? userInfo.names : ""}
                  readOnly
                />
              </div>
              <label
                htmlFor="corporate"
                className="col-form-label col-sm-4 label-align pr-0 pl-0"
              >
                Corporate
              </label>
              <div className="col-sm-12">
                <input
                  type="text"
                  className="form-control"
                  name="corporate"
                  required
                  value={userInfo.length !== 0 ? userInfo.corporate : ""}
                  readOnly
                />
              </div>
              <label
                htmlFor="request_type"
                className="col-form-label col-sm-4 label-align pr-0 pl-0"
              >
                Request Type
              </label>
              <div className="col-sm-12">
                <select
                  type="text"
                  className="form-control"
                  name="request_type"
                  id="request_type"
                  required
                  defaultValue="0"
                  onChange={setChoosenValue}
                >
                  <option disabled value="0">
                    Select Request Type
                  </option>
                  {requestType.map((data) => {
                    return (
                      <option data-type={data.descr} value={data.idx}>
                        {data.descr}
                      </option>
                    );
                  })}
                </select>
              </div>
              <label
                htmlFor="reason"
                className="col-form-label col-sm-4 label-align pr-0 pl-0"
              >
                Reason
              </label>
              <div className="col-sm-12">
                <textarea
                  className="form-control"
                  name="reason"
                  onChange={(e) => setChoosenRequestType(e.target.value)}
                  value={choosenRequestType}
                  required
                />
              </div>
              <label
                htmlFor="Date"
                className="col-form-label col-sm-4 label-align pr-0 pl-0"
              >
                Date
              </label>
              <div className="col-sm-12">
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  id="date"
                  value={today()}
                  disabled="true"
                />
              </div>
              <p>
                <input
                  type="submit"
                  className="btn btn-info form-control col-1"
                  value="Save"
                  style={{ marginTop: "20px" }}
                />
              </p>
            </form>
          </div>
        </div>
      </div>
      {/* Modal */}
      <Modal2
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        body={
          <span className="h4 text-white font-weight-bold text-center">
            {response}
          </span>
        }
        background="#105878"
      />
    </div>
  );
};

export default SmartRequest;
