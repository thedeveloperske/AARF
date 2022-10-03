import React, { useEffect, useState } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import Modal from "../../../components/helpers/Modal5";
import Modal2 from "../../../components/helpers/Modal4";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import ModalResponse from "../../../components/helpers/Modal2";
import { Spinner } from "../../../components/helpers/Spinner";

const Extension = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false);
  const [response, setResponse] = useState([]);
  const [disabledStatus, setDisabledStatus] = useState(true);
  const [selectedCorporate, setSelectedCorporate] = useState([]);
  const [corp, setCorp] = useState([]);
  const [hospitalWards, setHospitalWards] = useState([]);
  const [providers, setProviders] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [memberSpecificData, setMemberSpecificData] = useState([]);
  const [memberAnniv, setMemberAnniv] = useState([]);
  const [refNo, setRefNo] = useState([]);
  const [memberBenefits, setMemberBenefits] = useState([]);
  const [memberPreauths, setMemberPreauths] = useState([]);
  const [memberPreauthData, setMemberPreauthData] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [reserve, setReserve] = useState(0);
  const [mainBalance, setMainBalance] = useState({
    claims: 0.0,
    reserves: 0.0,
    limit: 0.0,
    balance: 0.0,
  });
  const [subBalance, setSubBalance] = useState({
    claims: 0.0,
    reserves: 0.0,
    limit: 0.0,
    balance: 0.0,
  });
   const [hidden, setHidden] = useState({
     corp: true,
     member: true,
     search: true,
   });

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeModal2 = () => {
    setModal2IsOpen(false);
  };

  const closeModalResponse = () => {
    setModalResponseIsOpen(false);
  };

  useEffect(() => {
    getData("fetch_corporates").then((data) => {
      setCorp(data);
    });
    getData("fetch_hospital_wards").then((data) => {
      setHospitalWards(data);
    });
    getData("fetch_providers").then((data) => {
      setProviders(data);
    });
  }, []);

  useEffect(() => {
    if (selectedOption != 0) {
      switch (selectedOption) {
        case "0":
          setHidden({ corp: true, member: true, search: true });
          document.getElementById("corporate").value = "0";
          document.getElementById("member").value = "";
          document.getElementById("member").placeholder = "";
          break;
        case "1":
          setHidden({ corp: false, member: false, search: false });
          document.getElementById("corporate").value = "0";
          document.getElementById("member").value = "";
          document.getElementById("member").placeholder =
            "Type member name or number";
          break;
        case "2":
          setHidden({ corp: true, member: false, search: false });
          document.getElementById("corporate").value = "0";
          document.getElementById("member").value = "";
          document.getElementById("member").placeholder = "Type member number";
          break;
      }
    }
  }, [selectedOption]);

  //fetch member method
  const fetchMember = (e) => {
    setMemberDetails([]);
    setMemberSpecificData([]);
    setMemberAnniv([]);
    setMemberBenefits([]);
    setRefNo([]);
    e.preventDefault();

    const frmData = new FormData();
    frmData.append("option", selectedOption);
    frmData.append("corp", selectedCorporate);
    frmData.append("member", document.getElementById("member").value);

    postData(frmData, "fetch_member_preauth").then((data) => {
      if (data.length != 0) {
        setMemberDetails(data);
        setModalIsOpen(true);
      } else {
        setResponse("Member does not exist!");
        setModalResponseIsOpen(true);
      }
    });
  };

  const getRowContents = (e) => {
    e.preventDefault();
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.textContent);
    });
    getOneData("fetch_member_preauths", arr[1]).then((data) => {
      setMemberPreauths(data);
    });
    getOneData("fetch_specific_member_data_preauth", arr[1]).then((data) => {
      if (data.length != 0) {
        setMemberSpecificData(data.member[0]);
        setMemberAnniv(data.anniv);
        setMemberBenefits(data.m_benes);
        setRefNo(data.ref_no);
      } else {
        setResponse("member cover has expired");
        setModalResponseIsOpen(true);
      }
    });
    setModalIsOpen(false);
  };

  const getPreauthContent = (e) => {
    e.preventDefault();
        document.getElementById("spinner").style.display = "block";
    setMemberPreauthData([]);
    setMemberSpecificData([]);
    setMainBalance({
      claims: 0.0,
      reserves: 0.0,
      limit: 0.0,
      balance: 0.0,
    });
    setSubBalance({
      claims: 0.0,
      reserves: 0.0,
      limit: 0.0,
      balance: 0.0,
    });

    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.textContent);
    });

    getOneData("fetch_member_preauth_data", arr[0]).then((data) => {
      setMemberPreauthData(data[0]);
      const frmData = new FormData();
      frmData.append("member_no", data[0].member_no);
      frmData.append("anniv", data[0].anniv);
      frmData.append("benefit", data[0].authority_type);

      postData(frmData, "fetch_main_balance").then((dt) => {
        setMainBalance(dt[0]);
      });
      postData(frmData, "fetch_claim_balance").then((dt) => {
        setSubBalance(dt[0]);
        document.getElementById("spinner").style.display = "none";
        setDisabledStatus(false);
      });
    });
  };

  const validateExtension = (e) => {
    e.preventDefault();
     const reserve = parseFloat(document.getElementById("reserve").value);
     const main_balance = parseFloat(mainBalance.balance);
     const sub_balance = parseFloat(subBalance.balance);

   if (main_balance > 0) {
     if (sub_balance > 0) {
       if (main_balance >= sub_balance) {
         //use sub balance as checker

         if (sub_balance >= reserve) {
           //validate inputs
           validateInputs();
         } else {
           //limit up to should not exceed checker(sub balance)
           setResponse("Limit or Reserve should not exceed balance!");
           setModalResponseIsOpen(true);
         }
       } else {
         //use main balance as checker
         if (main_balance >= reserve) {
           //validate inputs
           validateInputs();
         } else {
           //limit up to should not exceed checker(main balance)
           setResponse("Limit or Reserve should not exceed balance!");
           setModalResponseIsOpen(true);
         }
       }
     } else {
       setResponse(
         "The member has exhausted their cover for the particular benefit!"
       );
       setModalResponseIsOpen(true);
     }
   } else {
     //the member has exhausted their cover
     setResponse("The member has exhausted their cover for the main benefit!");
     setModalResponseIsOpen(true);
   }
  };

    const validateInputs = () => {
      const reserve = document.getElementById("reserve").value;
      // return console.log(admit_days);
      if (
        reserve != 0
      ) {
        //go ahead and save
        saveExtension();
      } else {
        setResponse("Reserve/Limit should be greater than zero!");
        setModalResponseIsOpen(true);
      }
    };

  const saveExtension = () => {
    const frmData = new FormData(document.getElementById("frmPreauth"));
    frmData.append("member_no", memberPreauthData.member_no);
    frmData.append("auth_batch_no", memberPreauthData.auth_batch_no);
    postData(frmData, "save_extension_preauth")
      .then((data) => {
        if (data.length == 3) {
          if (
            data[1].includes("successfully") &&
            data[2].includes("successfully")
          ) {
            setRefNo(data[0]);
            setModal2IsOpen(true);
            setDisabledStatus(true);
          } else {
            console.log(data);
          }
        } else {
          console.log(data);
        }
      })
      .catch((error) => console.log(error));
  };

  const printPdf = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("frmPreauth"));
    frmData.append("member_no", memberPreauthData.member_no);
    frmData.append("module", "extension");
    postData(frmData, "generate_pdf").then((data) => {
      setModal2IsOpen(false);
      var val = htmlToPdfmake(data.doc);
      var dd = { content: val };
      pdfMake.createPdf(dd).download();
    });
  };
  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <select
                className="form-control"
                defaultValue="0"
                name="options"
                id="options"
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option disabled value="0">
                  Select Option
                </option>
                <option value="1">Search by corporate</option>
                <option value="2">Search by member number</option>
              </select>
            </div>
            <div className="col-md-3" hidden={hidden.corp}>
              <select
                className="form-control"
                defaultValue="0"
                id="corporate"
                onChange={(e) => setSelectedCorporate(e.target.value)}
              >
                <option disabled value="0">
                  Select Corporate
                </option>
                {corp.map((data) => {
                  return <option value={data.CORP_ID}>{data.CORPORATE}</option>;
                })}
              </select>
            </div>
            <div className="col-md-3" hidden={hidden.member}>
              <input id="member" type="text" className="form-control" />
            </div>
            <div className="col-md-2" hidden={hidden.search}>
              <button
                className="btn btn-info form-control"
                onClick={fetchMember}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card col-md-12">
        <form id="frmPreauth" onSubmit={validateExtension}>
          <div className="row">
            <div className="col-md-7">
              <h3
                id="headers"
                className="col-md-12"
                style={{ textAlign: "center" }}
              >
                Past Pre-authorizations
              </h3>
              <hr className="col-12" />
              <table
                className="table table-hover table-bordered table-sm"
                style={{ maxHeight: "200px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    <th>Code</th>
                    <th>Provider</th>
                    <th>Authority Type</th>
                    <th>Available Limit</th>
                    <th>Reserve Amt</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {memberPreauths.map((dt) => {
                    return dt.auth_batch_no === dt.code ? (
                      <tr>
                        <td>{dt.code}</td>
                        <td>{dt.provider}</td>
                        <td>{dt.benefit}</td>
                        <td>{dt.available_limit}</td>
                        <td>{dt.reserve}</td>
                        <td>New Preauth</td>
                        <td>
                          <input
                            className="btn btn-success form-control"
                            type="button"
                            value="view"
                            onClick={getPreauthContent}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr className="bg-secondary text-white">
                        <td>{dt.code}</td>
                        <td>{dt.provider}</td>
                        <td>{dt.benefit}</td>
                        <td>{dt.available_limit}</td>
                        <td>{dt.reserve}</td>
                        <td>Extension</td>
                        <td></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-md-5">
                  <Spinner/>
              <div className="row">
                <div className="col-md-6">
                  <h3
                    id="headers"
                    className="col-md-12"
                    style={{ textAlign: "center" }}
                  >
                    Main Benefit
                  </h3>
                  <hr className="col-12" />
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="asst_hos_rate"
                      className="col-form-label col-md-4 label-align pl-0 pr-0"
                    >
                      Limit
                    </label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        value={parseFloat(mainBalance.limit).toLocaleString()}
                      />
                    </div>
                  </div>
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="asst_hos_rate"
                      className="col-form-label col-md-4 label-align pl-0 pr-0"
                    >
                      Claims
                    </label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        value={parseFloat(mainBalance.claims).toLocaleString()}
                      />
                    </div>
                  </div>
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="asst_hos_rate"
                      className="col-form-label col-md-4 label-align pl-0 pr-0"
                    >
                      Reserves
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={parseFloat(
                          mainBalance.reserves
                        ).toLocaleString()}
                      />
                    </div>
                  </div>
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="asst_hos_rate"
                      className="col-form-label col-md-4 label-align pl-0 pr-0"
                    >
                      Balance
                    </label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        value={parseFloat(mainBalance.balance).toLocaleString()}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <h3
                    id="headers"
                    className="col-md-12"
                    style={{ textAlign: "center" }}
                  >
                    Sub Benefit
                  </h3>
                  <hr className="col-12" />
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="asst_hos_rate"
                      className="col-form-label col-md-4 label-align pl-0 pr-0"
                    >
                      Limit
                    </label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        value={parseFloat(subBalance.limit).toLocaleString()}
                      />
                    </div>
                  </div>
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="asst_hos_rate"
                      className="col-form-label col-md-4 label-align pl-0 pr-0"
                    >
                      Claims
                    </label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        value={parseFloat(subBalance.claims).toLocaleString()}
                      />
                    </div>
                  </div>
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="asst_hos_rate"
                      className="col-form-label col-md-4 label-align pl-0 pr-0"
                    >
                      Reserves
                    </label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        value={parseFloat(subBalance.reserves).toLocaleString()}
                      />
                    </div>
                  </div>
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="asst_hos_rate"
                      className="col-form-label col-md-4 label-align pl-0 pr-0"
                    >
                      Balance
                    </label>
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        value={parseFloat(subBalance.balance).toLocaleString()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group row ml-0">
                <h3
                  id="headers"
                  className="col-md-12"
                  style={{ textAlign: "center" }}
                >
                  Authorization Info
                </h3>
                <hr className="col-12" />
              </div>
              <div className="form-group row ml-0 ">
                <label
                  htmlFor="surname"
                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                >
                  Reference No
                  <span className="required">*</span>
                </label>
                <div className="col-sm-2">
                  <input
                    type="text"
                    className="form-control"
                    name="reference_no"
                    value={refNo}
                    readOnly
                  />
                </div>
                <label
                  htmlFor="first_name"
                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                >
                  Authority Type
                </label>
                <div className="col-md-2 col-sm-2">
                  <select
                    name="authority_type"
                    defaultValue="0"
                    value={memberPreauthData.authority_type}
                    required="true"
                  >
                    <option disabled value="0">
                      Select Benefit
                    </option>
                    {memberBenefits.map((dt) => {
                      return <option value={dt.code}>{dt.benefit}</option>;
                    })}
                  </select>
                </div>
                <label
                  htmlFor="Invoice_date"
                  className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                >
                  Member Name
                </label>
                <div className="col-md-2 ">
                  <input
                    type="text"
                    className="form-control"
                    value={memberSpecificData.member_name}
                    name="member_name"
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="effective_date"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Provider
                </label>
                <div className="col-md-2">
                  <select
                    name="provider"
                    id="provider"
                    defaultValue="0"
                    value={memberPreauthData.provider}
                    required="true"
                  >
                    <option disabled value="0">
                      Select Provider
                    </option>
                    {providers.map((dt) => {
                      return <option value={dt.CODE}>{dt.PROVIDER}</option>;
                    })}
                  </select>
                </div>
                <label
                  htmlFor="end_date"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Ward
                </label>
                <div className="col-md-2">
                  <select
                    name="ward"
                    id="ward"
                    defaultValue="0"
                    value={memberPreauthData.ward}
                  >
                    <option disabled value="0">
                      Select Ward
                    </option>
                    {hospitalWards.map((dt) => {
                      return <option value={dt.code}>{dt.ward}</option>;
                    })}
                  </select>
                </div>
                <label
                  htmlFor="Days"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Date Reported
                </label>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    name="date_reported"
                    id="date_reported"
                    value={memberPreauthData.date_reported}
                  />
                </div>
              </div>
              <div className="form-group row ml-0"></div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="transaction"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Reported By / Dr.
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    name="reported_by"
                    id="reported_by"
                    value={memberPreauthData.reported_by}
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Anniv
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    name="anniv"
                    value={memberPreauthData.anniv}
                    readOnly
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  admission
                </label>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    name="admission"
                    id="admission"
                    value={memberPreauthData.admission_date}
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Admit Days
                </label>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    name="admit_days"
                    value={memberPreauthData.admit_days}
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Discharge
                </label>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    name="discharge"
                    value={memberPreauthData.discharge_date}
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Doc Fees
                </label>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    name="doc_fees"
                    value={memberPreauthData.doc_fee}
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Date Autd
                </label>
                <div className="col-md-2">
                  <input
                    type="date"
                    value={memberPreauthData.date_authorized}
                    className="form-control"
                    name="date_autd"
                    readOnly
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Auth'ed By
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    name="authed_by"
                    value={localStorage.getItem("username")}
                    readOnly
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Diagnosis
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    name="diagnosis"
                    required="true"
                    value={memberPreauthData.pre_diagnosis}
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Reserve
                </label>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    name="reserve"
                    id="reserve"
                    required="true"
                    min={0}
                    defaultValue={0}
                    onChange={(e) => setReserve(e.target.value)}
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Limit Up To (ugx)
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    name="limit_up_to"
                    id="limit_up_to"
                    required="true"
                    value={
                      reserve !== "" ? parseFloat(reserve).toLocaleString() : ""
                    }
                    readOnly
                  />
                </div>
              </div>

              <div className="form-group row ml-0">
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Notes
                </label>
                <div className="col-md-10">
                  <textarea
                    name="notes"
                    className="form-control"
                    defaultValue={memberPreauthData.notes}
                    required="true"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <p>
            <input
              disabled={disabledStatus}
              type="submit"
              value="Save"
              className="btn btn-info col-1"
            />
          </p>
        </form>
      </div>
      <Modal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        header={<p className="text-info font-weight-bold h2">Choose Member</p>}
        body={
          <table
            className="table table-bordered table-hover table-sm"
            style={{ maxHeight: "300px", width: "700px" }}
          >
            <thead>
              <tr>
                <th>Family No</th>
                <th>Member No</th>
                <th>Principal Name</th>
                <th>Member Name</th>
                <th>Gender</th>
                <th>Dob</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {memberDetails.map((dt) => {
                return (
                  <tr>
                    <td>{dt.family_no}</td>
                    <td>{dt.member_no}</td>
                    <td>{dt.principal_name}</td>
                    <td>{dt.member_name}</td>
                    <td>{dt.gender}</td>
                    <td>{dt.dob}</td>
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

      <Modal2
        modalIsOpen={modal2IsOpen}
        closeModal={closeModal2}
        body={
          <div>
            <p className="font-weight-bold h4">Extension Saved sucessfully.</p>
            <p className="font-weight-bold h4">
              Do you want to print Preauthorization letter?
            </p>
          </div>
        }
        buttons={
          <p>
            <button
              className="btn btn-success"
              onClick={printPdf}
              style={{ marginRight: "10px" }}
            >
              YES
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => setModal2IsOpen(false)}
            >
              NO
            </button>
          </p>
        }
      />
      <ModalResponse
        background="#0047AB"
        modalIsOpen={modalResponseIsOpen}
        closeModal={closeModalResponse}
        body={<p className="text-white text-weight-bold">{response}</p>}
      />
    </div>
  );
};

export default Extension;
