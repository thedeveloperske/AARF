import { useEffect, useState } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../../components/helpers/Data";
import Modal from "../../../../components/helpers/Modal5";
import Modal2 from "../../../../components/helpers/Modal4";
import Modal3 from "../../../../components/helpers/Modal5";
import ModalResponse from "../../../../components/helpers/Modal2";

import { Spinner } from "../../../../components/helpers/Spinner";
import { today2 } from "../../../../components/helpers/today";
import "../../../../css/vetBill.css";

const AddAnInvoice = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const [modal3IsOpen, setModal3IsOpen] = useState(false);
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false);
  const [billReasons, setBillReasons] = useState([]);
  const [deductionReason, setDeductionReason] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [total, setTotal] = useState([]);
  const [oneClaimsData, setOneClaimsData] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [appendedDiagnosisRow, setAppendedDiagnosisRow] = useState([]);
  const [deductionAmt, setDeductionAmt] = useState(0.0);
  const [memberDiagnosis, setMemberDiagnosis] = useState([]);
  const [preauths, setPreauths] = useState([]);
  const [preauthNo, setPreauthNo] = useState([]);
  const [services, setServices] = useState([]);
  const [claimBalances, setClaimBalances] = useState({
    claims: 0.0,
    reserves: 0.0,
    limit: 0.0,
    balance: 0.0,
  });
  const [mainBalances, setMainBalances] = useState({
    claims: 0.0,
    reserves: 0.0,
    limit: 0.0,
    balance: 0.0,
  });
  const [response, setResponse] = useState([]);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeModal2 = () => {
    setModal2IsOpen(false);
  };

  const closeModal3 = () => {
    setModal3IsOpen(false);
  };

  const closeModalResponse = () => {
    setModalResponseIsOpen(false);
  };

  useEffect(() => {
    getData("fetch_services").then((data) => {
      setServices(data);
    });
  }, []);

  useEffect(() => {
    getData("fetch_resend_bill_reason").then((data) => {
      setBillReasons(data);
    });
    getData("fetch_deduction_reason").then((data) => {
      setDeductionReason(data);
    });
  }, []);

  const fetchClaims = (e) => {
    e.preventDefault();
    setClaimData([]);

    let claimsValue = document.getElementById("claim_no").value;
    getOneData("fetch_claims_per_claim_no_add_invoice", claimsValue).then(
      (data) => {
        setClaimData(data.claims);
        setTotal(data.total);
        setModalIsOpen(true);
      }
    );
  };

  const getRowData = (e) => {
    e.preventDefault();
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.textContent);
    });
    setModalIsOpen(false);
    getOneData("fetch_claim_by_id_add_invoice", arr[0]).then((data) => {
      console.log(data[0]);
      setOneClaimsData(data[0]);
      const frmData = new FormData();
      frmData.append("claim_no", data[0].claim_no);
      frmData.append("member_no", data[0].member_no);
      frmData.append("anniv", data[0].anniv);
      frmData.append("benefit", data[0].benefit_code);

      postData(frmData, "fetch_member_diagnosis").then((data) => {
        setMemberDiagnosis(data);
      });

      postData(frmData, "fetch_preauth_bills").then((data) => {
        if (data.length != 0) {
          setPreauths(data);
          setModal3IsOpen(true);
        }
      });

      postData(frmData, "fetch_main_balance").then((data) => {
        setMainBalances(data[0]);
      });
      postData(frmData, "fetch_claim_balance").then((data) => {
        setClaimBalances(data[0]);
      });
    });
  };

  const getPreauthNo = (e) => {
    e.preventDefault();
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.textContent);
    });

    setPreauthNo(arr[0]);
    setModal3IsOpen(false);
  };

  const fetchDiagnosis = (e) => {
    setDiagnosis([]);
    document.getElementById("spinner").style.display = "block";
    e.preventDefault();
    getOneData(
      "search_diagnosis",
      document.getElementById("txtDiagnosis").value
    ).then((data) => {
      setDiagnosis(data);
      document.getElementById("spinner").style.display = "none";
    });
  };

  const openModal2 = (e) => {
    setDiagnosis([]);
    e.preventDefault();
    setModal2IsOpen(true);
  };

  const appendDiagnosis = (e) => {
    e.preventDefault();
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.textContent);
    });

    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>{oneClaimsData.claim_no}</td>
          <td>{oneClaimsData.member_no}</td>
          <td>
            <input type="text" hidden name="diagnosis_idx[]" value={arr[0]} />
            {arr[2]}
          </td>
          <td>
            <i
              className="fas fa-trash text-danger"
              onClick={() => removeDiagnosis(row.id, e)}
            ></i>
          </td>
        </>
      ),
    };

    setAppendedDiagnosisRow((appendDiagnosisRow) => {
      return [...appendDiagnosisRow, row];
    });
  };

  const removeDiagnosis = async (id, e) => {
    e.preventDefault();
    setAppendedDiagnosisRow((appendDiagnosisRow) => {
      return appendDiagnosisRow.filter((row) => row.id !== id);
    });
  };

  const saveAddInvoice = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("frmAddInvoice"));
    frmData.append("id", oneClaimsData.id);
    frmData.append("category", oneClaimsData.category);
    frmData.append("integ", oneClaimsData.integ);
    frmData.append("integ_date", oneClaimsData.integ_date);
    postData(frmData, "save_add_invoice").then((data) => {
      setResponse(data);
      setModalResponseIsOpen(true);
    });
  };

  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                id="claim_no"
                className="form-control"
                placeholder="Claim No"
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-info form-control"
                onClick={fetchClaims}
              >
                Fetch Claims
              </button>
            </div>           
          </div>
        </div>
      </div>
      <section id="querycorporatetable" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <nav>
                    <div
                      className="nav nav-tabs nav-fill"
                      id="nav-tab"
                      role="tablist"
                    >
                      <a
                        className="nav-item nav-link active"
                        data-toggle="tab"
                        href="#invoice"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        disabled
                        selected
                      >
                        Invoice
                      </a>
                      <a
                        className="nav-item nav-link"
                        data-toggle="tab"
                        href="#claimtab"
                        role="tab"
                        aria-controls="nav-contact"
                        aria-selected="true"
                        disabled
                        selected
                      >
                        Claim
                      </a>
                      <a
                        className="nav-item nav-link"
                        data-toggle="tab"
                        href="#vet"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        disabled
                        selected
                      >
                        Vet
                      </a>
                    </div>
                  </nav>
                </div>
                <div className="card-body">
                  <form id="frmAddInvoice" onSubmit={saveAddInvoice}>
                    <div className="tab-content" id="nav-tabContent">
                      <div
                        className="tab-pane fade show active corporate-tab-content"
                        id="invoice"
                        role="tabpanel"
                        aria-labelledby="nav-home-tab"
                      >
                        <div id="step-1">
                          <div className="row">
                            <div className="col-md-12">
                              <p className="text-info h4">Invoice Details</p>
                              <hr />
                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Claim No
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="claim_no"
                                    value={oneClaimsData.claim_no}
                                    readOnly
                                    required
                                  />
                                </div>

                                <div className="col-md-2">
                                  <label className="col-form-label">
                                    provider
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <select
                                    className="form-control"
                                    name="provider"
                                    defaultValue="0"
                                    readOnly
                                  >
                                    <option value={oneClaimsData.provider_code}>
                                      {oneClaimsData.provider}
                                    </option>
                                  </select>
                                </div>
                              </div>

                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Member No
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="member_no"
                                    value={oneClaimsData.member_no}
                                    className="form-control"
                                    readOnly
                                    required
                                  />
                                </div>
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Date Received
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="date_received"
                                    className="form-control"
                                    value={oneClaimsData.invoice_date}
                                    readOnly
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Product Name
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <select
                                    className="form-control"
                                    defaultValue="0"
                                    name="product_name"
                                    readOnly
                                  >
                                    <option value={oneClaimsData.product_code}>
                                      {oneClaimsData.product_name}
                                    </option>
                                  </select>
                                </div>
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Batch
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="batch"
                                    className="form-control"
                                    value={oneClaimsData.batch_no}
                                    readOnly
                                    required
                                  />
                                </div>
                              </div>

                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Claim Form
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="claim_form"
                                    className="form-control"
                                    readOnly
                                    required
                                  />
                                </div>
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Smart Bill ID
                                  </label>
                                </div>

                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="smart_bill_id"
                                    value={oneClaimsData.smart_bill_id}
                                    className="form-control"
                                    readOnly
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Pay To
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <select
                                    className="form-control"
                                    name="pay_to"
                                    value="1"
                                    readOnly
                                    required
                                  >
                                    <option disabled value="0">
                                      Select Option
                                    </option>
                                    <option disabled value="1">
                                      Pay Provider
                                    </option>
                                  </select>
                                </div>
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Benefit
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <select
                                    className="form-control"
                                    defaultValue="0"
                                    name="benefit"
                                    readOnly
                                  >
                                    <option value={oneClaimsData.benefit_code}>
                                      {oneClaimsData.benefit}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Anniv
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="anniv"
                                    value={oneClaimsData.anniv}
                                    className="form-control"
                                    readOnly
                                    required
                                  />
                                </div>
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Pre Auth No
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="pre_auth_no"
                                    className="form-control"
                                    readOnly
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Fund
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="checkbox"
                                    name="fund"
                                    className="form-control"
                                    disabled="true"
                                    required
                                  />
                                </div>
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Invoice Date
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="invoice_date"
                                    className="form-control"
                                    value={oneClaimsData.invoice_date}
                                    readOnly
                                    required
                                  />
                                </div>
                              </div>
                              <p className="text-info h4">
                                Add Invoice Details
                              </p>
                              <hr />
                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Invoice No
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="invoice_no"
                                    className="form-control"
                                    required
                                  />
                                </div>
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Invoice Amt
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="number"
                                    name="invoice_amt"
                                    className="form-control"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Service
                                  </label>
                                </div>
                                <div className="col-md-8">
                                  <select
                                    name="service"
                                    defaultValue="0"
                                    required
                                  >
                                    <option value="0">Select Service</option>
                                    {services.map((data) => {
                                      return (
                                        <option value={data.CODE}>
                                          {data.SERVICE}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p>
                          <button
                            type="submit"
                            className="btn btn-primary form-control col-1 mx-auto"
                          >
                            Save
                          </button>
                        </p>
                      </div>
                      <div
                        className="tab-pane fade table-responsive"
                        id="claimtab"
                        role="tabpanel"
                        aria-labelledby="nav-contact-tab"
                      >
                        <div className="row">
                          <div className="col-md-12">
                            <p className="text-info h4">Claim Form</p>
                            <hr />
                            <div className="form-group row justify-content-center">
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Claim No
                                </label>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={oneClaimsData.claim_no}
                                  readOnly
                                  required
                                />
                              </div>

                              <div className="col-md-2">
                                <label className="col-form-label">
                                  Visit Date
                                </label>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="visit_date"
                                  value={oneClaimsData.visit_date}
                                  readOnly
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group row justify-content-center">
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Doctor Date
                                </label>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  name="doctor_date"
                                  value={oneClaimsData.doctor_date}
                                  className="form-control"
                                  disabled="true"
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Date Admitted
                                </label>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="date"
                                  name="date_addmitted"
                                  className="form-control"
                                  disabled="true"
                                  defaultValue={oneClaimsData.date_admitted}
                                />
                              </div>
                            </div>
                            <div className="form-group row justify-content-center">
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Date Discharged
                                </label>
                              </div>
                              <div className="col-md-8">
                                <input
                                  type="date"
                                  name="date_discharged"
                                  className="form-control"
                                  disabled="true"
                                  defaultValue={oneClaimsData.date_discharged}
                                />
                              </div>
                            </div>
                            <div className="form-group row justify-content-center">
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Doctor Signed
                                </label>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="checkbox"
                                  name="doctor_signed"
                                  checked={
                                    oneClaimsData.doctor_sign == 1
                                      ? true
                                      : false
                                  }
                                  className="form-control"
                                  disabled="true"
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Patient Signed
                                </label>
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="checkbox"
                                  name="patient_signed"
                                  checked={
                                    oneClaimsData.claim_form_signed == 1
                                      ? true
                                      : false
                                  }
                                  className="form-control"
                                  disabled="true"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-info h4">Member Diagnosis</p>
                        <hr />
                        <div className="row" style={{ marginTop: "20px" }}>
                          <div className="mx-auto">
                            <button
                              className="btn btn-info col-2 form-control"
                              onClick={openModal2}
                              disabled="true"
                            >
                              Add Diagnosis
                            </button>
                            <table
                              className="table table-bordered"
                              style={{ maxHeight: "300px" }}
                            >
                              <thead className="thead-dark">
                                <tr>
                                  <th>Claim No</th>
                                  <th>Member No</th>
                                  <th>Diagnosis</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {memberDiagnosis.map((data) => {
                                  return (
                                    <tr>
                                      <td>{data.claim_no}</td>
                                      <td>{data.member_no}</td>
                                      <td>{data.clinical_diagnosis}</td>
                                    </tr>
                                  );
                                })}
                                {appendedDiagnosisRow.map((dt) => {
                                  return (
                                    <tr className="appendedDiag" key={dt.id}>
                                      {dt.new}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade table-responsive"
                        id="vet"
                        role="tabpanel"
                        aria-labelledby="nav-contact-tab"
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <p className="h2 text-info">Vet</p>
                            <hr />
                            <div className="form-group row justify-content-center">
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Gender
                                </label>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="gender"
                                  value={oneClaimsData.gender}
                                  readOnly
                                  required
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Family Title
                                </label>
                              </div>
                              <div className="col-md-4">
                                <select
                                  className="form-control"
                                  name="family_title"
                                  readOnly
                                >
                                  <option
                                    value={oneClaimsData.family_relation_code}
                                  >
                                    {oneClaimsData.relation}
                                  </option>
                                </select>
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  DOB
                                </label>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="dob"
                                  value={oneClaimsData.dob}
                                  readOnly
                                  required
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Claim No
                                </label>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={oneClaimsData.claim_no}
                                  readOnly
                                  required
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label label-align">
                                  Entrant
                                </label>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  name="entrant"
                                  className="form-control"
                                  value={localStorage.getItem("username")}
                                  readOnly
                                  required
                                />
                              </div>

                              <div className="col-md-2">
                                <label className="col-form-label">
                                  Service
                                </label>
                              </div>
                              <div className="col-md-4">
                                <select
                                  className="form-control"
                                  disabled="true"
                                >
                                  <option value={oneClaimsData.service_code}>
                                    {oneClaimsData.service}
                                  </option>
                                </select>
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label">
                                  Provider
                                </label>
                              </div>
                              <div className="col-md-4">
                                <select
                                  className="form-control"
                                  disabled="true"
                                >
                                  <option value={oneClaimsData.provider_code}>
                                    {oneClaimsData.provider}
                                  </option>
                                </select>
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label">
                                  Vet Status
                                </label>
                              </div>
                              <div className="col-md-4">
                                <select
                                  className="form-control"
                                  name="vet_status"
                                  disabled="true"
                                  value={oneClaimsData.vet_status}
                                >
                                  <option disabled value="0">
                                    Select Vet Status
                                  </option>
                                  <option value="1">Approve</option>
                                  <option value="2">Suspend</option>
                                  <option value="3">Reject</option>
                                  <option value="4">Pending</option>
                                </select>
                              </div>

                              <div className="col-md-2">
                                <label className="col-form-label">User</label>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  name="user"
                                  disabled="true"
                                  className="form-control"
                                  value={localStorage.getItem("username")}
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label">
                                  Date Vetted
                                </label>
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  disabled="true"
                                  name="date_vetted"
                                  value={today2()}
                                  className="form-control"
                                />
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label">Reason</label>
                              </div>
                              <div className="col-md-10">
                                <select
                                  className="form-control"
                                  name="bill_reason"
                                  defaultValue="0"
                                  disabled="true"
                                >
                                  <option disabled value="0">
                                    Select reason
                                  </option>
                                  {billReasons.map((dt) => {
                                    return (
                                      <option value={dt.code}>
                                        {dt.resend_reason}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label">
                                  Remarks
                                </label>
                              </div>
                              <div className="col-md-10">
                                <textarea
                                  name="remarks"
                                  className="form-control"
                                  disabled="true"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <p className="h2 text-info">Deduction</p>
                            <hr />
                            <div className="form-group row justify-content-center">
                              <div className="col-md-4">
                                <label className="col-form-label label-align">
                                  Invoiced Amount
                                </label>
                              </div>
                              <div className="col-md-8">
                                <input
                                  type="number"
                                  className="form-control"
                                  defaultValue={0}
                                  value={oneClaimsData.invoiced_amount}
                                  readOnly
                                  required
                                />
                              </div>

                              <div className="col-md-4">
                                <label className="col-form-label">
                                  Deduction Amount
                                </label>
                              </div>
                              <div className="col-md-8">
                                <input
                                  type="number"
                                  min={0}
                                  defaultValue={0}
                                  className="form-control"
                                  name="deduction_amount"
                                  onChange={(e) =>
                                    setDeductionAmt(e.target.value)
                                  }
                                  disabled="true"
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="col-form-label">
                                  Deduction Reason
                                </label>
                              </div>
                              <div className="col-md-8">
                                <select
                                  className="form-control"
                                  name="deduction_reason"
                                  defaultValue="0"
                                  disabled="true"
                                >
                                  <option disabled value="0">
                                    Select deduction reason
                                  </option>
                                  {deductionReason.map((dt) => {
                                    return (
                                      <option value={dt.code}>
                                        {dt.deduct_reason}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="col-form-label">
                                  Amount Payable
                                </label>
                              </div>
                              <div className="col-md-8">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="amount_payable"
                                  value={
                                    oneClaimsData.length != 0
                                      ? oneClaimsData.invoiced_amount -
                                        deductionAmt
                                      : 0.0
                                  }
                                  readOnly
                                  required
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="col-form-label">
                                  Deduction Notes
                                </label>
                              </div>
                              <div className="col-md-8">
                                <textarea
                                  disabled="true"
                                  name="deduction_notes"
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-md-6">
                                <p className="h2 text-info">Main Benefit</p>
                                <hr />
                                <div className="form-group row justify-content-center">
                                  <div className="col-md-2">
                                    <label className="col-form-label label-align">
                                      Limit
                                    </label>
                                  </div>
                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      value={parseFloat(
                                        mainBalances.limit
                                      ).toLocaleString()}
                                      className="form-control text-success"
                                      readOnly
                                    />
                                  </div>
                                  <div className="col-md-2">
                                    <label className="col-form-label label-align">
                                      Claims
                                    </label>
                                  </div>
                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      value={parseFloat(
                                        mainBalances.claims
                                      ).toLocaleString()}
                                      className="form-control text-success"
                                      readOnly
                                    />
                                  </div>
                                  <div className="col-md-2">
                                    <label className="col-form-label label-align">
                                      Reserves
                                    </label>
                                  </div>
                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      value={parseFloat(
                                        mainBalances.reserves
                                      ).toLocaleString()}
                                      className="form-control text-success"
                                      readOnly
                                    />
                                  </div>
                                  <div className="col-md-2">
                                    <label className="col-form-label label-align">
                                      Balance
                                    </label>
                                  </div>
                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      value={parseFloat(
                                        mainBalances.balance
                                      ).toLocaleString()}
                                      className="form-control text-success"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <p className="h2 text-info">Benefit</p>
                                <hr />
                                <div className="form-group row justify-content-center">
                                  <div className="col-md-2">
                                    <label className="col-form-label label-align">
                                      Limit
                                    </label>
                                  </div>
                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      value={parseFloat(
                                        claimBalances.limit
                                      ).toLocaleString()}
                                      className="form-control text-success"
                                      readOnly
                                    />
                                  </div>
                                  <div className="col-md-2">
                                    <label className="col-form-label label-align">
                                      Claims
                                    </label>
                                  </div>
                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      value={parseFloat(
                                        claimBalances.claims
                                      ).toLocaleString()}
                                      className="form-control text-success"
                                      readOnly
                                    />
                                  </div>
                                  <div className="col-md-2">
                                    <label className="col-form-label label-align">
                                      Reserves
                                    </label>
                                  </div>
                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      value={parseFloat(
                                        claimBalances.reserves
                                      ).toLocaleString()}
                                      className="form-control text-success"
                                      readOnly
                                    />
                                  </div>
                                  <div className="col-md-2">
                                    <label className="col-form-label label-align">
                                      Balance
                                    </label>
                                  </div>
                                  <div className="col-md-10">
                                    <input
                                      type="text"
                                      value={parseFloat(
                                        claimBalances.balance
                                      ).toLocaleString()}
                                      className="form-control text-success"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        header={<p className="text-info h2 font-weight-bold">Choose Claim</p>}
        body={
          <table
            className="table table-bordered table-sm"
            style={{ maxHeight: "400px", width: "800px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th hidden="true">ID</th>
                <th>Claim No</th>
                <th>Invoice No</th>
                <th>Provider</th>
                <th>Service</th>
                <th>Member No</th>
                <th>Invoiced Amount</th>
                <th>Amount Payable</th>
                <th>Invoice Date</th>
                <th>Member Name</th>
                <th>Payee</th>
                <th>Voucher No</th>
                <th>Cheque No</th>
                <th>Cheque Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {claimData.map((dt) => {
                return (
                  <tr key={dt.id}>
                    <td hidden="true">{dt.id}</td>
                    <td>{dt.claim_no}</td>
                    <td>{dt.invoice_no}</td>
                    <td>{dt.provider}</td>
                    <td>{dt.service}</td>
                    <td>{dt.member_no}</td>
                    <td>{parseFloat(dt.invoiced_amount).toLocaleString()}</td>
                    <td>{dt.amount_payable}</td>
                    <td>{dt.invoice_date}</td>
                    <td>{dt.names}</td>
                    <td>{dt.payee}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <button
                        className="btn btn-success form-control select"
                        onClick={getRowData}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Total</th>
                <th>{total}</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        }
      />

      <Modal2
        modalIsOpen={modal2IsOpen}
        closeModal={closeModal2}
        body={
          <div>
            <div className="row" style={{ margin: "10px" }}>
              <div className="col-md-10">
                <input
                  type="text"
                  placeholder="Type diagnosis or diagnosis code"
                  className="form-control"
                  id="txtDiagnosis"
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-info form-control"
                  onClick={fetchDiagnosis}
                >
                  Search
                </button>
              </div>
              <Spinner />
            </div>
            <div className="table-responsive">
              <table
                className="table table-bordered table-sm"
                style={{ maxHeight: "400px", width: "500px" }}
                id="diagnosisTbl"
              >
                <thead className="thead-dark">
                  <tr>
                    <th className="hidden">idx</th>
                    <th>Code</th>
                    <th>Diagnosis</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnosis.map((data) => {
                    return (
                      <tr>
                        <td className="hidden">{data.idx}</td>
                        <td>{data.diag_code}</td>
                        <td>{data.clinical_diagnosis}</td>
                        <td>
                          <button
                            className="btn btn-success form-group"
                            onClick={appendDiagnosis}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              className="btn btn-info"
              onClick={(e) => setModal2IsOpen(false)}
            >
              close
            </button>
          </div>
        }
      />

      <Modal3
        modalIsOpen={modal3IsOpen}
        closeModal={closeModal3}
        header={
          <p className="text-info h2 font-weight-bold">
            Choose Preauthorization
          </p>
        }
        body={
          <table
            className="table table-bordered table-sm"
            style={{ maxHeight: "400px", width: "500px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th>Code</th>
                <th>Anniv</th>
                <th>Member No</th>
                <th>Provider</th>
                <th>Admission Date</th>
                <th>Discharge Date</th>
                <th>Diagnosis</th>
                <th>Benefit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {preauths.map((dt) => {
                return (
                  <tr key={dt.code}>
                    <td>{dt.code}</td>
                    <td>{dt.anniv}</td>
                    <td>{dt.member_no}</td>
                    <td>{dt.provider}</td>
                    <td>{dt.admission_date}</td>
                    <td>{dt.discharge_date}</td>
                    <td>{dt.pre_diagnosis}</td>
                    <td>{dt.authority_type}</td>
                    <td>
                      <button
                        className="btn btn-success form-control select"
                        onClick={getPreauthNo}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

export default AddAnInvoice;
