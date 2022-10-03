import React, { useState, useEffect } from "react";
import { Spinner } from "../../../components/helpers/Spinner";
import {
  getOneData,
  getData,
  postData,
} from "../../../components/helpers/Data";
import Modal5 from "../../../components/helpers/Modal5";

const SuspendedClaims = () => {
  const [corporates, setCorporates] = useState([]);
  const [providers, setProviders] = useState([]);
  const [address, setAddress] = useState([]);
  const [suspendedBills, setSuspendedBills] = useState([]);
  const [message, setMessage] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [hidden, setHidden] = useState({
    corporate: true,
    provider: true,
  });
  const [visibleState, setVisibleState] = useState({
    address: true,
    print: true,
    excel: true,
  });

  useEffect(() => {
    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
    getData("fetch_corporates").then((data) => {
      setCorporates(data);
    });
    getData("fetch_providers").then((data) => {
      setProviders(data);
    });
  }, []);

  const selectedOption = () => {
    const option = document.getElementById("option").value;
    switch (option) {
      case "1":
        setHidden({
          corporate: true,
          provider: false,
        });
        break;
      case "2":
        setHidden({
          corporate: false,
          provider: true,
        });
        break;
      case "3":
        setHidden({
          corporate: true,
          provider: true,
        });
        break;
      default:
        setHidden({
          corporate: true,
          provider: true,
        });
        break;
    }
  };

  const fetchReport = (e) => {
    e.preventDefault();

    const frmData = new FormData(
      document.getElementById("suspended_bills_form")
    );
    document.getElementById("spinner").style.display = "block";
    postData(frmData, "fetch_suspended_bills")
      .then((data) => {
        console.log(data);
        if(data.length <=0 ){
           const message = "Notice ! No Records To Recover";
           setMessage(message);
           setModalOpen(true);
        } else{
          setSuspendedBills(data);
        }
        
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => console.log(error));
  };
  //close modal
  const closeModal = (e) => {
    e.preventDefault();
    setModalOpen(false);
  };
  return (
    <div>
      <div className="row ml-0">
        <h4 className="fs-title">Bills Reports - Suspended Bills</h4>
        <hr />
        <div className="col-md-12">
          <form id="suspended_bills_form" onSubmit={fetchReport}>
            <div className="row ml-0">
              <div className="form-group row">
                <label
                  htmlFor="select_task"
                  className="col-form-label col-md-0.5 label-right pr-3 pl-3"
                >
                  Task:
                </label>
                <div className="col-md-2">
                  <select
                    className="form-control"
                    id="option"
                    name="option"
                    onChange={selectedOption}
                  >
                    <option value={null}>Select Option</option>
                    <option value={1}>Provider</option>
                    <option value={2}>Corporate</option>
                    <option value={3}>All Providers</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-control"
                    id="provider"
                    name="provider"
                    defaultValue="0"
                    hidden={hidden.provider}
                  >
                    <option disabled value="0">
                      Select Provider
                    </option>
                    {providers.map((data) => {
                      return <option value={data.CODE}>{data.PROVIDER}</option>;
                    })}
                  </select>

                  <select
                    className="form-control"
                    id="corp_id"
                    name="corp_id"
                    defaultValue="0"
                    hidden={hidden.corporate}
                  >
                    <option disabled value="0">
                      Select Corporate
                    </option>
                    {corporates.map((data) => {
                      return (
                        <option value={data.CORP_ID}>{data.CORPORATE}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    id="from"
                    maxLength="4"
                    max="9999-12-31"
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    id="to"
                    maxLength="4"
                    max="9999-12-31"
                  />
                </div>
                <div className="col-md-1">
                  <button type="submit" className="btn btn-outline-info btn-sm">
                    Run
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <section id="suspended_claims" className="project-tab">
        <div className="col-md-4 float-right" hidden={visibleState.address}>
          <h6>{address.client_name}</h6>
          <h6>{address.physical_location}</h6>
          <h6>{address.box_no}</h6>
          <h6>{address.tel_cell}</h6>
          <h6>{address.fax}</h6>
          <h6>{address.email}</h6>
          <h6>{address.url}</h6>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card mt-0" id="">
              <form id="suspended_bills_report">
                <div className="row mt-4">
                  <div>{/* <div>{title}</div> */}</div>
                  <div className="col-md-4 float-right ml-auto">
                    {/* {period} */}
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div
                    id="suspended_bills_div"
                    className="table table-responsive"
                  >
                    <table
                      className="table table-bordered table-sm"
                      id="suspended_bills_table"
                      style={{ maxHeight: "500px" }}
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th className={"pr-2 pl-2"}>Member No</th>
                          <th className={"pr-2 pl-2"}>Member Name</th>
                          <th className={"pr-3 pl-3"}>Provider</th>
                          <th className={"pr-5 pl-5"}>Claim No</th>
                          <th className={"pr-5 pl-5"}>Invoice No</th>
                          <th className={"pr-5 pl-5"}>Service</th>
                          <th className={"pr-5 pl-5"}>Invoice Date</th>
                          <th className={"pr-5 pl-5"}>Amount</th>
                          <th className={"pr-5 pl-5"}>Reason</th>
                          <th className={"pr-5 pl-5"}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suspendedBills.map((dt) => {
                          return (
                            <tr>
                              <td>{dt.member_no}</td>
                              <td>{dt.member_name}</td>
                              <td>{dt.provider}</td>
                              <td>{dt.claim_no}</td>
                              <td>{dt.invoice_no}</td>
                              <td>{dt.service}</td>
                              <td>{dt.invoice_date}</td>
                              <td>{dt.invoiced_amount}</td>
                              <td>{dt.reason[0]}</td>
                              <td>{dt.remarks[0]}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row mb-2">
                  <Spinner />
                </div>
                <div></div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Modal5
        modalIsOpen={isModalOpen}
        closeModal={closeModal}
        header={<p id="headers">Fund Statement Report</p>}
        body={
          <div>
            <div className={"row justify-content-center"}>
              <p>{message}</p>
            </div>
            <div className={"row justify-content-center"}>
              <button
                className="btn btn-outline-danger"
                onClick={(e) => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SuspendedClaims;
