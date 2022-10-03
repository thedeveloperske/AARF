import React, { useEffect, useState } from "react";
import { getData, getOneData, postData } from "../../components/helpers/Data";
import Modal from "../../components/helpers/Modal5";
import ModalResponse from "../../components/helpers/Modal2";

const AdmissionVisit = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false);
  const [careVisits, setCareVisits] = useState([]);
  const [users, setUsers] = useState([]);
  const [careAdmissions, setCareAdmissions] = useState([]);
  const [careData, setCareData] = useState(["", "", ""]);
  const [response, setResponse] = useState([]);
  let ttl_incurred = 0.0;
  useEffect(() => {
    getData("fetch_user_names").then((data) => {
      setUsers(data);
    });
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };
    const closeModalResponse = () => {
      setModalResponseIsOpen(false);
    };

  const fetchMember = (e) => {
    e.preventDefault();
    setCareVisits([]);
    setCareAdmissions([]);
    setCareData(["", "", ""]);
    getOneData(
      "fetch_member_care",
      document.getElementById("member").value
    ).then((data) => {
      setCareVisits(data.care_visit);
      setCareAdmissions(data.care_admission);
      setModalIsOpen(true);
    });
  };

  //fetching row contents
  const getRowContents = (e) => {
    e.preventDefault();
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.textContent);
    });
    setCareData(arr);
    setModalIsOpen(false);
  };

  const saveCareVisit = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("frmCareVisit"));
    postData(frmData, "save_care_visit").then((data) => {
      setResponse(data);
      setModalResponseIsOpen(true)
    });
  };

  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <input id="member" type="text" className="form-control" />
            </div>
            <div className="col-md-3">
              <button className="btn btn-info col-4" onClick={fetchMember}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card col-md-12">
        <form id="frmCareVisit" onSubmit={saveCareVisit}>
          <div className="row ">
            <div className="col-md-7 mx-auto">
              <h3
                id="headers"
                className="col-md-12"
                style={{ textAlign: "center" }}
              >
                Previous Care Visits
              </h3>
              <hr className="col-12" />
              <table
                className="table table-sm table-hover table-bordered mx-auto"
                style={{ maxHeight: "200px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    <th>Visit Date</th>
                    <th>Visited By</th>
                    <th>Incurred Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {careVisits.map((dt) => {
                    ttl_incurred += parseFloat(dt.incurred_amt);
                    return (
                      <tr>
                        <td>{dt.visit_date}</td>
                        <td>{dt.visited_by}</td>
                        <td>{parseFloat(dt.incurred_amt).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <th>Total</th>
                    <th>{parseFloat(ttl_incurred).toLocaleString()}</th>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="col-md-12">
              <div className="form-group row ml-0">
                <h3
                  id="headers"
                  className="col-md-12"
                  style={{ textAlign: "center" }}
                >
                  New Care Visit
                </h3>
                <hr className="col-12" />
              </div>
              <div className="form-group row ml-0 ">
                <label
                  htmlFor="surname"
                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                >
                  Visit Date
                </label>
                <div className="col-sm-2">
                  <input
                    type="date"
                    className="form-control"
                    name="visit_date"
                    required="true"
                  />
                </div>
                <label
                  htmlFor="first_name"
                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                >
                  Visited By
                </label>
                <div className="col-md-2 col-sm-2">
                  <select name="visited_by" defaultValue="0" required="true">
                    <option disabled value="0">
                      Select User
                    </option>
                    {users.map((dt) => {
                      return (
                        <option value={dt.user_name}>{dt.user_name}</option>
                      );
                    })}
                  </select>
                </div>
                <label
                  htmlFor="Invoice_date"
                  className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                >
                  Presented
                </label>
                <div className="col-md-2 ">
                  <select name="presented" defaultValue="0" required="true">
                    <option disabled value="0">
                      Select Item
                    </option>
                    <option value="1">card</option>
                    <option value="2">Flowers</option>
                    <option value="3">Card N Flowers</option>
                  </select>
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="effective_date"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Incurred Amt
                </label>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    name="incurred_amt"
                    required="true"
                  />
                </div>
                <label
                  htmlFor="end_date"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Exp Disch Date
                </label>
                <div className="col-md-2">
                  <input
                    type="date"
                    name="exp_disch_date"
                    className="form-control"
                    required="true"
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="effective_date"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Preauth No
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    name="preauth_no"
                    value={careData[1]}
                    readOnly
                    required="true"
                  />
                </div>
                <label
                  htmlFor="end_date"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Member_no
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    name="member_no"
                    className="form-control"
                    value={careData[2]}
                    readOnly
                    required="true"
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="Days"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Care Nurse Comments
                </label>
                <div className="col-md-10">
                  <textarea
                    className="form-control"
                    name="care_nurse_comments"
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="transaction"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Doc Comments
                </label>
                <div className="col-md-10">
                  <textarea className="form-control" name="doc_comments" />
                </div>
              </div>
            </div>
          </div>
          <p>
            <input type="submit" value="Save" className="btn btn-info col-1" />
          </p>
        </form>
      </div>
      <Modal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        header={
          <p className="text-info font-weight-bold h2">Care Admissions</p>
        }
        body={
          <table
            className="table table-sm table-hover table-bordered"
            style={{ maxHeight: "300px", width: "700px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th>Member Name</th>
                <th>Auth No</th>
                <th>Member No</th>
                <th>Provider</th>
                <th>Date Admitted</th>
                <th>Admitting Doc</th>
                <th>Admission No</th>
                <th>Ward</th>
                <th>Room No</th>
                <th>Bed No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {careAdmissions.map((dt) => {
                return (
                  <tr>
                    <td>{dt.names}</td>
                    <td>{dt.pre_auth_no}</td>
                    <td>{dt.member_no}</td>
                    <td>{dt.provider}</td>
                    <td>{dt.date_admitted}</td>
                    <td>{dt.doctor}</td>
                    <td>{dt.admission_no}</td>
                    <td>{dt.ward}</td>
                    <td>{dt.room_no}</td>
                    <td>{dt.bed_no}</td>
                    <td>
                      <input
                        className="btn btn-success"
                        type="button"
                        value="view"
                        onClick={getRowContents}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        }
        buttons={
          <p>
            <button
              className="btn btn-danger"
              onClick={() => setModalIsOpen(false)}
            >
              Close
            </button>
          </p>
        }
      />
      <ModalResponse
        background="#0047AB"
        modalIsOpen={modalResponseIsOpen}
        closeModal={closeModalResponse}
        body={<p className="text-white text-weight-bold h2">{response}</p>}
      />
    </div>
  );
};

export default AdmissionVisit;
