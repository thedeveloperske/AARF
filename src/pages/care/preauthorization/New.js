import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import Modal from "../../../components/helpers/Modal5";
import Modal2 from "../../../components/helpers/Modal4";
import ModalResponse from "../../../components/helpers/Modal2";
import { Spinner } from "../../../components/helpers/Spinner";

import { today } from "../../../components/helpers/today";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const New = () => {
  moment().format();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [hidden, setHidden] = useState({
    corp: true,
    member: true,
    search: true,
  });
  const [reserve, setReserve] = useState(0);

  const [coverHidden, setCoverHidden] = useState(true);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedCorporate, setSelectedCorporate] = useState([]);
  const [corp, setCorp] = useState([]);
  const [hospitalWards, setHospitalWards] = useState([]);
  const [providers, setProviders] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [memberSpecificData, setMemberSpecificData] = useState([]);
  const [memberAnniv, setMemberAnniv] = useState([]);
  const [refNo, setRefNo] = useState([]);
  const [memberBenefits, setMemberBenefits] = useState([]);
  const [selectedBenefit, setSelectedBenefit] = useState([]);
  const [coverDates, setCoverDates] = useState([]);
  const [response, setResponse] = useState([]);

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

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const closeModal2 = () => {
    setModal2IsOpen(false);
  };
  const closeModalResponse = () => {
    setModalResponseIsOpen(false);
  };

  const clearAdminDays = () => {
    document.getElementById("admit_days").value = "";
  };

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

  const dateDiff = () => {
    const admission = document.getElementById("admission").value;
    const discharge = document.getElementById("discharge").value;
    document.getElementById("admit_days").value = "";
    if (admission && discharge) {
      var start = moment(admission);
      var end = moment(discharge);
      var diff = end.diff(start, "days");
      if (diff < 0) {
        setResponse("Admission date cannot be greater than Discharge date");
        setModalResponseIsOpen(true);
      } else {
        if (diff == 0) {
          diff = 1;
        }
        document.getElementById("admit_days").value = diff;
      }
    } else {
      setResponse("select admission date and discharge date!");
      setModalResponseIsOpen(true);
    }
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
  //fetch member method
  const fetchMember = (e) => {
    setCoverHidden(true);
    setMemberDetails([]);
    setMemberSpecificData([]);
    setMemberAnniv([]);
    setMemberBenefits([]);
    setRefNo([]);
    setCoverDates([]);
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
    getOneData("fetch_specific_member_data_preauth", arr[1]).then((data) => {
      if (data.length != 0) {
        setMemberSpecificData(data.member[0]);
        setMemberAnniv(data.anniv);
        setMemberBenefits(data.m_benes);
        setRefNo(data.ref_no);
        setCoverDates(data.member_cover_dates[0]);
        setCoverHidden(false);
      } else {
        setResponse("member cover has expired");
        setModalResponseIsOpen(true);
      }
    });
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (selectedBenefit != 0) {
      document.getElementById("spinner").style.display = "block";
      setMainBalance({ claims: 0.0, reserves: 0.0, limit: 0.0, balance: 0.0 });
      setSubBalance({ claims: 0.0, reserves: 0.0, limit: 0.0, balance: 0.0 });
      const frmData = new FormData();
      frmData.append("member_no", memberSpecificData.member_no);
      frmData.append("anniv", memberAnniv);
      frmData.append("benefit", selectedBenefit);
      //check if optical benefit was used in two consecutive annivs
      postData(frmData, "check_optical_used_consecutively")
        .then((dt) => {
          if (dt[0].optical === "") {
            //fetch main benefit balance
            postData(frmData, "fetch_main_balance")
              .then((dt) => {
                setMainBalance(dt[0]);
              })
              .catch((error) => console.log(error));
            //fetch  benefit balance
            postData(frmData, "fetch_claim_balance")
              .then((dt) => {
                setSubBalance(dt[0]);
                document.getElementById("spinner").style.display = "none";
                setDisabled(false);
              })
              .catch((error) => console.log(error));
          } else {
             document.getElementById("spinner").style.display = "none";
              setDisabled(true);
            setResponse(
              "Frames/Spectacles Cannot be given in two consecutive anniversaries. This member received frames in anniv " +
                dt[0].optical
            );
            setModalResponseIsOpen(true);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [selectedBenefit]);

  const validatePreauth = (e) => {
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
    const provider = document.getElementById("provider").value;
    const ward = document.getElementById("ward").value;
    const date_reported = document.getElementById("date_reported").value;
    const reported_by = document.getElementById("reported_by").value;
    const notes = document.getElementById("notes").value;
    const reserve = document.getElementById("reserve").value;
    const admit_days = document.getElementById("admit_days").value;
    // return console.log(admit_days);
    if (
      provider != 0 &&
      ward != 0 &&
      admit_days != "" &&
      date_reported &&
      reported_by &&
      notes &&
      reserve != 0
    ) {
      //go ahead and save
      savePreauth();
    } else {
      setResponse("Fill in all the details");
      setModalResponseIsOpen(true);
    }
  };

  const savePreauth = () => {
    const frmData = new FormData(document.getElementById("frmPreauth"));
    frmData.append("member_no", memberSpecificData.member_no);
    postData(frmData, "save_preauth")
      .then((data) => {
        if (data.length == 2) {
          if (
            data[0].includes("successfully") &&
            data[1].includes("successfully")
          ) {
            setModal2IsOpen(true);
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
    frmData.append("member_no", memberSpecificData.member_no);
     frmData.append("module", "preauth");
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
            <div className="col-md-12 alert alert-light" hidden={coverHidden}>
              <h4 className="text-info text-center">Member Cover Dates</h4>
              <hr />
              <div className="row">
                <div className="col-md-4">
                  <span className="text-info">Start Date : </span>
                  {coverDates.start_date}
                </div>
                <div className="col-md-4">
                  <span className="text-info">End Date : </span>
                  {coverDates.end_date}
                </div>
                <div className="col-md-4">
                  <span className="text-info">Renewal Date : </span>
                  {coverDates.renewal_date}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card col-md-12">
        <form id="frmPreauth" onSubmit={validatePreauth}>
          <div className="row">
            <div className="col-md-7">
              <div className="form-group row ml-0">
                <p id="headers" className="col-12">
                  Authorization Info
                </p>
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
                <div className="col-sm-4">
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
                <div className="col-md-4 col-sm-4">
                  <select
                    name="authority_type"
                    defaultValue="0"
                    onChange={(e) => setSelectedBenefit(e.target.value)}
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
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="Invoice_date"
                  className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                >
                  Member Name
                </label>
                <div className="col-md-4 col-sm-4 ">
                  <input
                    type="text"
                    className="form-control"
                    value={memberSpecificData.member_name}
                    name="member_name"
                    readOnly
                  />
                </div>
                <label
                  htmlFor="effective_date"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Provider
                </label>
                <div className="col-md-4 col-sm-4">
                  <select
                    id="provider"
                    name="provider"
                    defaultValue="0"
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
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="end_date"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Ward
                </label>
                <div className="col-md-4 col-sm-4">
                  <select id="ward" name="ward" defaultValue="0" required>
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
                <div className="col-md-4 col-sm-4">
                  <input
                    type="date"
                    className="form-control"
                    id="date_reported"
                    name="date_reported"
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="transaction"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Reported By / Dr.
                </label>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    id="reported_by"
                    name="reported_by"
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Anniv
                </label>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    id="anniv"
                    name="anniv"
                    value={memberAnniv}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  admission
                </label>
                <div className="col-md-4">
                  <input
                    type="date"
                    className="form-control"
                    id="admission"
                    name="admission"
                    onChange={clearAdminDays}
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Admit Days
                </label>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    id="admit_days"
                    name="admit_days"
                    onClick={dateDiff}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Discharge
                </label>
                <div className="col-md-4">
                  <input
                    type="date"
                    className="form-control"
                    id="discharge"
                    name="discharge"
                    onChange={clearAdminDays}
                  />
                </div>
                <label
                  htmlFor="business_class"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Doc Fees
                </label>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    id="doc_fees"
                    name="doc_fees"
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
                <div className="col-md-4">
                  <input
                    type="date"
                    value={today()}
                    className="form-control"
                    id="date_autd"
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
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    id="authed_by"
                    name="authed_by"
                    value={localStorage.getItem("username")}
                    readOnly
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                  Diagnosis
                </label>
                <div className="col-md-10">
                  <input
                    type="text"
                    className="form-control"
                    id="diagnosis"
                    name="diagnosis"
                    required="true"
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
                    id="notes"
                    name="notes"
                    className="form-control"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="form-group row ml-0">
                <p id="headers" className="col-12">
                  Member Info
                </p>
                <hr className="col-12" />
              </div>
              <div className="form-group row ml-0 ">
                <label
                  htmlFor="agent_rate"
                  className="col-form-label col-md-3 label-align pl-0 pr-0"
                >
                  Gender
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    name="gender"
                    value={memberSpecificData.gender}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="bdm_rate"
                  className="col-form-label col-md-3 label-align pl-0 pr-0"
                >
                  Date Of Birth
                </label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    name="dob"
                    value={memberSpecificData.dob}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="asst_hos_rate"
                  className="col-form-label col-md-3 label-align pl-0 pr-0"
                >
                  Family Title
                </label>
                <div className="col-md-9 col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    value={memberSpecificData.relation}
                    name="family_title"
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <p id="headers" className="col-12">
                  Limits and Balances
                </p>
                <hr className="col-12" />
                <Spinner />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <p id="headers" className="col-12">
                    Main Benefit
                  </p>
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
                        name="balance_main"
                        value={parseFloat(mainBalance.balance).toLocaleString()}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <p id="headers" className="col-12">
                    Sub Benefit
                  </p>
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
                        name="balance_sub"
                        value={parseFloat(subBalance.balance).toLocaleString()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p>
            <input
              type="submit"
              value="Save"
              className="btn btn-info col-1"
              disabled={disabled}
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
            <p className="font-weight-bold h4">Preath Saved sucessfully.</p>
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

export default New;
