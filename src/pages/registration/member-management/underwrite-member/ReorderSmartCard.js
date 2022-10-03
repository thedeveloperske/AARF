import { useState, useEffect } from "react";
import ImportScripts from "../../../../components/helpers/ImportScripts";
import {
  getData,
  getOneData,
  postData,
} from "../../../../components/helpers/Data";
import "../../../../css/index.css";
import Modal2 from "../../../../components/helpers/Modal2"

const ReorderSmartCard = () => {
  ImportScripts("/dist/js/claims_stepwise_forms.js");
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [feedback, setFeedback] = useState([])
  const [memberData, setMemberData] = useState([]);
  const [memberMedical, setMemberMedical] = useState([]);
  const [memberAcceptance, setMemberAcceptance] = useState([]);
  const [memberAllergy, setMemberAllergy] = useState([]);
  const [memberBenefits, setMemberBenefits] = useState([]);
  const [memberExclusions, setMemberExclusions] = useState([]);
  const [memberAnniversary, setMemberAnniversary] = useState([]);

  const [reprintReason, setReprintReason] = useState([]);
  const [status, setStatus] = useState(true);
  const [corp, setCorp] = useState([]);
  const [productName, setProductName] = useState([]);
  const [healthPlan, setHealthPlan] = useState([]);
  const [agent, setAgent] = useState([]);
  const [occupation, setOccupation] = useState([]);
  const [familyTitle, setFamilyTitle] = useState([]);
  const [title, setTitle] = useState([]);
  const [bloodGroup, setBloodGroup] = useState([]);
  const [allergy, setAllergy] = useState([]);
  const [reason, setReason] = useState([]);
  const [corpData, setCorpData] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [illness, setIllness] = useState([]);
  const [appendedIllness, setAppendedIllness] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [appendedDiagnosis, setAppendedDiagnosis] = useState([]);
  const [appendedAllergy, setAppendedAllergy] = useState([]);
  const [benefitSharing, setBenefitSharing] = useState([]);
  const [principal, setPrincipal] = useState({
    SURNAME: "",
    FIRST_NAME: "",
    OTHER_NAMES: "",
    TEL_NO: "",
    MOBILE_NO: "",
    POSTAL_ADD: "",
    EMAIL: "",
    AGENT_ID: "0",
    PHY_LOC: "",
    marital_satus: "0",
    PRINCIPAL: "",
    category: "0",
    marital_status: "0",
    plan: "0",
    FAMILY_SIZE: "",
    FAMILY_NO: "",
    MEMBER_NO: "",
  });

  const closeModal = () => {
    setModalIsOpen(false)
  }

  useEffect(() => {
    document.getElementById("start_date").min = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("status_date").min = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("info_to_printer_reorder").min = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("card_from_printer_reorder").min = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("card_to_member_reorder").min = new Date()
      .toISOString()
      .split("T")[0];
    getData("member_dropdowns").then((data) => {
      setCorp(data.corporate);
      setHealthPlan(data.health_plan);
      setAgent(data.agent);
      setOccupation(data.occupation);
      setFamilyTitle(data.family_title);
      setTitle(data.title);
      setBloodGroup(data.blood_group);
      setAllergy(data.allergy);
      setReason(data.reason);
      setIllness(data.illness);
      setDiagnosis(data.clinical_diagnosis);
      setProductName(data.product_name);
      setBenefits(data.benefits);
      setBenefitSharing(data.benefit_sharing);
      setReprintReason(data.card_reprint_reason);
    });
  }, []);

  const appendIllness = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input
              type="text"
              value={
                principal.FAMILY_NO
                  ? principal.FAMILY_NO + "-" + principal.FAMILY_SIZE
                  : ""
              }
              name="member_no_illness[]"
              readOnly
            />
          </td>
          <td>
            <select name="illness[]" defaultValue="0">
              <option value="0" disabled>
                Select Illness
              </option>
              {illness.map((data) => {
                return (
                  <option key={data.code} value={data.code}>
                    {data.illnes}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <input type="date" name="condition_date[]" />
          </td>
          <td>
            <input
              type="text"
              name="anniv_illness[]"
              value={corpData.anniv}
              readOnly
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeIllness(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedIllness((appendedIllness) => {
      return [...appendedIllness, row];
    });
  };

  const appendDiagnosis = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input
              type="text"
              value={
                principal.FAMILY_NO
                  ? principal.FAMILY_NO + "-" + principal.FAMILY_SIZE
                  : ""
              }
              name="member_no_diagnosis[]"
              readOnly
            />
          </td>
          <td>
            <select name="diagnosis[]" defaultValue="0">
              <option value="0" disabled>
                Select Diagnosis
              </option>
              {diagnosis.map((data) => {
                return (
                  <option key={data.idx} value={data.diag_code}>
                    {data.clinical_diagnosis}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <input
              type="date"
              className="form-control"
              name="diagnosis_date[]"
            />
          </td>
          <td>
            <input type="date" className="form-control" name="excl_from[]" />
          </td>
          <td>
            <input type="date" className="form-control" name="excl_to[]" />
          </td>
          <td>
            <input
              type="checkbox"
              className="form-control permanent"
              value="1"
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeDiagnosis(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedDiagnosis((appendedDiagnosis) => {
      return [...appendedDiagnosis, row];
    });
  };

  const appendAllergy = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <select name="allergy[]" defaultValue="0">
              <option value="0" disabled>
                Select Allergy
              </option>
              {allergy.map((data) => {
                return (
                  <option key={data.CODE} value={data.CODE}>
                    {data.ALLERGY}
                  </option>
                );
              })}
            </select>
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

  const removeIllness = async (id, e) => {
    e.preventDefault();
    setAppendedIllness((appendedIllness) => {
      return appendedIllness.filter((row) => row.id !== id);
    });
  };

  const removeDiagnosis = async (id, e) => {
    e.preventDefault();
    setAppendedDiagnosis((appendedDiagnosis) => {
      return appendedDiagnosis.filter((row) => row.id !== id);
    });
  };

  const removeAllergy = async (id, e) => {
    e.preventDefault();
    setAppendedAllergy((appendedAllergy) => {
      return appendedAllergy.filter((row) => row.id !== id);
    });
  };

  const chooseMember = (e) => {
    e.preventDefault();
    setPrincipal({
      SURNAME: "",
      FIRST_NAME: "",
      OTHER_NAMES: "",
      TEL_NO: "",
      MOBILE_NO: "",
      POSTAL_ADD: "",
      EMAIL: "",
      AGENT_ID: "0",
      PHY_LOC: "",
      marital_satus: "0",
      PRINCIPAL: "",
      category: "0",
      marital_status: "0",
      plan: "0",
      FAMILY_SIZE: "",
      FAMILY_NO: "",
      MEMBER_NO: "",
    });

    setMemberData({
      FAMILY_NO: "",
      MEMBER_NO: "",
      SURNAME: "",
      FIRST_NAME: "",
      OTHER_NAMES: "",
      DOB: "",
      OCCUPATION: "0",
      ID_PP_NO: "",
      BLOOD_GROUP: "0",
      RELATION_TO_PRINCIPAL: "",
      USER_ID: "",
      DATE_ENTERED: "",
      FAMILY_TITLE: "0",
      DEALING_USER: "",
      CANCELLED: "",
      EMPLOYMENT_NO: "",
      gender: "0",
      card_to_member: "",
      passport_no: "",
      nhif_card_no: "",
      height: "",
      weight: "",
      photo_n_form: "",
      photo_no: "",
      info_to_printer: "",
      card_from_printer: "",
      app_form_date: "",
      marital_status: "",
      date_employed: "",
      card_serial_no: "",
      family_size: "",
      corp_id: "",
      corp_code: "",
      join_date: "",
      nov: "",
      member_id: "",
      care_picked: "",
      mem_pin: "",
      single_parent: "",
      age: "",
      excempt_cut: "",
      title: "0",
      is_vip: "",
    });
    setMemberAcceptance({
      MEMBER_NO: "",
      STATUS: "",
      STATUS_DATE: "",
      COMMENTS: "",
      USER_ID: "",
      DATE_ENTERED: "",
      DEF_REJ: "0",
    });
    setMemberAnniversary({
      member_no: "",
      start_date: "",
      end_date: "",
      renewal_date: "",
      anniv: "",
      user_id: "",
      date_entered: "",
      sync: "",
      renewal_notified: "",
      smart_sync: "",
      nov: null,
      agent_commis_rate: "",
      commis_whtax_rate: "",
      health_plan: "",
      h_option: "0",
    });
    setMemberMedical([]);
    setMemberAllergy([]);
    setMemberBenefits([]);
    setMemberExclusions([]);

    getOneData(
      "fetch_one_member_data",
      document.getElementById("member_no").value
    ).then((data) => {
      data.member_info.map((dt) => {
        setMemberData(dt);
        getOneData("fetch_corporate", dt.corp_id).then((data) => {
          data.corp.map((dt) => {
            setCorpData(dt);
          });
        });

        getOneData("fetch_one_principal_data", dt.FAMILY_NO + "-00").then(
          (data) => {
            data.map((dt) => {
              setPrincipal(dt);
            });
          }
        );
      });
      data.member_acceptance.map((dt) => {
        setMemberAcceptance(dt);
      });
      data.member_anniversary.map((dt) => {
        setMemberAnniversary(dt);
      });
      setMemberMedical(data.member_medical);
      setMemberAllergy(data.member_allergy);
      setMemberBenefits(data.member_benefits);
      setMemberExclusions(data.member_exclusions);
    });
  };

  const submitFrm = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("formMember"));
    frmData.append("module", "reorder_photocards");
    postData(frmData, "save_member").then((data) => {
      setFeedback(data);
      setModalIsOpen(true)
    });
  };
  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="col-md-12">
            <form id="mainFrm" onSubmit={chooseMember}>
              <div className="row pr-0">
                <div id="get_principal" className="col-md-4">
                  <input
                    className="form-control col-md-12"
                    type="text"
                    id="member_no"
                    name="member_no"
                    placeholder="Member No"
                    required="true"
                  />
                </div>
                <div id="get_principal" className="col-md-4">
                  <button type="submit" className="btn btn-info col-md-6">
                    Search Member
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <section id="member_tabs" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h4
                className="text-info"
                style={{ textAlign: "center", fontWeight: "bolder" }}
              >
                Reorder Smart Card
              </h4>
              <form
                className="claims_form mt-1"
                id="formMember"
                onSubmit={submitFrm}
              >
                {/* progressbar */}
                <ul id="progressbar" className="col-md-12">
                  <li className="active">Principal</li>
                  <li>Personal</li>
                  <li>Benefits</li>
                  <li>Medical</li>
                  <li>Vetting</li>
                  <li>Activation</li>
                  <li>Misc</li>
                </ul>
                <fieldset>
                  <div>
                    <h2 id="headings" className="fs-title">
                      Principal Details
                    </h2>
                    <hr />
                  </div>
                  <div
                    className="row col-md-12 col-sm-12 pr-0 pl-0 ml-0"
                    id="step-1"
                  >
                    <div className="col-md-8 col-sm-8">
                      <div className="form-group row ml-0 ">
                        <label
                          htmlFor="surname"
                          className="col-form-label col-sm-2 label-align pr-0 pl-0"
                        >
                          Surname
                          <span className="required">*</span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="text"
                            className="form-control"
                            name="surname"
                            required="true"
                            value={principal.SURNAME}
                            id="surname"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="first_name"
                          className="col-form-label col-sm-2 label-align pr-0 pl-0"
                        >
                          First Name
                          <span className="required">*</span>
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            type="text"
                            className="form-control"
                            name="first_name"
                            required="true"
                            value={principal.FIRST_NAME}
                            id="first_name"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0 ">
                        <label
                          htmlFor="other_names"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Other Names
                        </label>
                        <div className="col-md-4 col-sm-4 ">
                          <input
                            type="text"
                            className="form-control"
                            name="other_names"
                            value={principal.OTHER_NAMES}
                            id="other_names"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="tel_no"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Telephone No.
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            type="text"
                            className="form-control"
                            id="tel_no"
                            value={principal.TEL_NO}
                            name="tel_no"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="form-group row ml-0">
                        <label
                          htmlFor="mobile_no"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Mobile No.
                        </label>
                        <div className="col-md-4 col-sm-4 ">
                          <input
                            type="text"
                            className="form-control"
                            id="mobile_no"
                            value={principal.MOBILE_NO}
                            name="mobile_no"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="postal_add"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Postal Address
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            type="text"
                            className="form-control"
                            id="postal_add"
                            value={principal.POSTAL_ADD}
                            name="postal_add"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0 ">
                        <label
                          htmlFor="email"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Email
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={principal.EMAIL}
                            id="email"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="agent_id"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Agent
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <select
                            className="form-control"
                            name="agent_id"
                            id="agent_id"
                            value={principal.AGENT_ID}
                            readOnly
                          >
                            <option disabled value="0">
                              Select Agent
                            </option>
                            {agent.map((data) => {
                              return (
                                <option
                                  key={data.agent_id}
                                  value={data.agent_id}
                                >
                                  {data.agent_name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="phy_loc"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Physical Loc.
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            type="text"
                            className="form-control"
                            name="phy_loc"
                            value={principal.PHY_LOC}
                            id="phy_loc"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="marital_status"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Marital Status
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <select
                            className="form-control"
                            name="marital_status"
                            id="marital_status"
                            value={principal.marital_status}
                            readOnly
                          >
                            <option value="0" disabled>
                              Select marital status
                            </option>
                            <option value="1">MARRIED</option>
                            <option value="2">NOT MARRIED</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row ml-0 ">
                        <label
                          htmlFor="class"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Class
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            type="text"
                            value={corpData.client_type}
                            readOnly
                            className="form-control"
                          />
                        </div>
                        <label
                          htmlFor="family_size"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Family Size
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            className="form-control"
                            type="text"
                            name="family_size"
                            id="family_size"
                            value={
                              principal.FAMILY_SIZE
                                ? principal.FAMILY_SIZE != 1
                                  ? "M + " +
                                    (parseInt(principal.FAMILY_SIZE) - 1)
                                  : "M"
                                : ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0 ">
                        <label
                          htmlFor="health_plan"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Health Plan
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <select
                            className="form-control"
                            value={principal.category}
                            defaultValue="0"
                            name="health_plan"
                            id="health_plan"
                            readOnly
                          >
                            <option disabled value="0">
                              Select Health Plan
                            </option>
                            {healthPlan.map((data) => {
                              return (
                                <option
                                  key={data.category}
                                  value={data.category}
                                >
                                  {data.category}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <label
                          htmlFor="option"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Option
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <select
                            className="form-control"
                            value={principal.plan}
                            id="option"
                            name="option"
                            readOnly
                          >
                            <option disabled value="0">
                              Select Option
                            </option>
                            {productName.map((data) => {
                              return (
                                <option key={data.code} value={data.code}>
                                  {data.product_name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-4 ">
                      <div className="form-group row ml-0 ">
                        <label
                          htmlFor="family_no"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          Family No.
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            value={principal.FAMILY_NO}
                            name="family_no"
                            required="true"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="member_no"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          Member No.
                        </label>
                        <div className="col-md-9">
                          <input
                            type="text"
                            className="form-control"
                            value={principal.MEMBER_NO}
                            name="member_no"
                            required="true"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="underwriter"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          Underwriter
                        </label>
                        <div className="col-md-9 col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="underwriter"
                            id="underwriter"
                            value={localStorage.getItem("username")}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="corporate"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          Corporate
                        </label>
                        <div className="col-md-9 col-sm-9">
                          <input
                            type="text"
                            className="form-control"
                            name="corporate"
                            id="corporate"
                            value={corpData.corporate}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next button */}
                  <input
                    id="invoice_button_next"
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <div>
                    <h2 id="headings" className="fs-title">
                      Personal Details
                    </h2>
                    <hr />
                  </div>
                  <div className="col-md-12">
                    <div className="form-group row ml-0">
                      <label
                        htmlFor="family_no_personal"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Family No
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="text"
                          name="family_no_personal"
                          id="family_no_personal"
                          value={memberData.FAMILY_NO}
                          required="true"
                          readOnly
                        />
                      </div>
                      <label
                        htmlFor="member_no_personal"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Member No
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="text"
                          name="member_no_personal"
                          value={memberData.MEMBER_NO}
                          required="true"
                          id="member_no_personal"
                          readOnly
                        />
                      </div>
                      <label
                        htmlFor="relation_to_principal"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Relation To Principal
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <select
                          className="form-control"
                          required="true"
                          name="relation_to_principal"
                          id="relation_to_principal"
                          value="25"
                          readOnly
                        >
                          <option disabled value="25">
                            DEPENDANT
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        htmlFor="corporate_personal"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Corporate
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="text"
                          value={corpData.corporate}
                          name="corporate_personal"
                          id="corporate_personal"
                          readOnly
                        />
                      </div>
                      <label
                        htmlFor="dob"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        D.O.B
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="date"
                          value={memberData.DOB}
                          name="dob"
                          id="dob"
                          required="true"
                        />
                      </div>
                      <label
                        htmlFor="idno"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Id No
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="text"
                          name="idno"
                          id="idno"
                          value={memberData.ID_PP_NO}
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        htmlFor="surname_personal"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Surname
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          name="surname_personal"
                          value={memberData.SURNAME}
                          required="true"
                          id="surname_personal"
                        />
                      </div>
                      <label
                        htmlFor="first_name_personal"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        First Name
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          name="first_name_personal"
                          value={memberData.FIRST_NAME}
                          required="true"
                          id="first_name_personal"
                        />
                      </div>
                      <label
                        htmlFor="other_names_personal"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Other Names
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="text"
                          value={memberData.OTHER_NAMES}
                          className="form-control"
                          name="other_names_personal"
                          id="other_names_personal"
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        htmlFor="family_title"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Family Title
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <select
                          className="form-control"
                          name="family_title"
                          required="true"
                          id="family_title"
                          value={memberData.FAMILY_TITLE}
                        >
                          <option disabled value="0">
                            Select family Title
                          </option>
                          {familyTitle.map((data) => {
                            return (
                              <option value={data.code}>{data.relation}</option>
                            );
                          })}
                        </select>
                      </div>
                      <label
                        htmlFor="gender"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Gender
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <select
                          className="form-control"
                          id="gender"
                          name="gender"
                          value={memberData.gender}
                          required="true"
                        >
                          <option disabled value="0">
                            Select Gender
                          </option>
                          <option value="1">MALE</option>
                          <option value="2">FEMALE</option>
                        </select>
                      </div>
                      <label
                        htmlFor="passport_no"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Passport No.
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          value={memberData.passport_no}
                          name="passport_no"
                          id="passport_no"
                        />
                      </div>
                    </div>

                    <div className="form-group row ml-0">
                      <label
                        htmlFor="employment_no"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Employment No
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          name="employment_no"
                          value={memberData.EMPLOYMENT_NO}
                          id="employment_no"
                        />
                      </div>
                      <label
                        htmlFor="title"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Title
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <select
                          name="title"
                          id="title"
                          required="true"
                          value={memberData.title}
                        >
                          <option disabled value="0">
                            Select Title
                          </option>
                          {title.map((data) => {
                            return (
                              <option value={data.CODE}>{data.TITLE}</option>
                            );
                          })}
                        </select>
                      </div>
                      <label
                        htmlFor="height"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Height
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="number"
                          className="form-control"
                          name="height"
                          value={memberData.height}
                          id="height"
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        htmlFor="weight"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Weight
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="number"
                          className="form-control"
                          name="weight"
                          value={memberData.weight}
                          id="weight"
                        />
                      </div>
                      <label
                        htmlFor="blood_group"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Blood Group
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <select
                          className="form-control"
                          id="blood_group"
                          name="blood_group"
                          value={memberData.BLOOD_GROUP}
                        >
                          <option disabled value="0">
                            Select Blood Group
                          </option>
                          {bloodGroup.map((data) => {
                            return (
                              <option key={data.CODE} value={data.CODE}>
                                {data.blood_group}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <label
                        htmlFor="occupation"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Occupation
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <select
                          className="form-control"
                          id="occupation"
                          name="occupation"
                          value={memberData.OCCUPATION}
                        >
                          <option disabled value="0">
                            Select Occupation
                          </option>
                          {occupation.map((data) => {
                            return (
                              <option key={data.CODE} value={data.CODE}>
                                {data.OCCUPATION}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        htmlFor="join_date"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Join Date
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input
                          type="date"
                          className="form-control"
                          name="join_date"
                          id="join_date"
                          value={memberData.join_date}
                        />
                      </div>
                      <label
                        htmlFor="is_vip"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Is VIP
                      </label>
                      <div className="col-md-2 col-sm-2">
                        <input
                          type="checkbox"
                          className="form-control"
                          value="1"
                          checked={memberData.is_vip == "1" ? "checked" : ""}
                          name="is_vip"
                          id="is_vip"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: "30px" }}>
                    <div className="col-md-6">
                      <div>
                        <h2 id="headings" className="fs-title">
                          Smart/Photo Card Follow up
                        </h2>
                        <hr />
                      </div>
                      <div className="col-md-12">
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="photo_availed"
                            className="col-form-label col-md-4 label-align pl-0 pr-0"
                          >
                            Photo Availed
                          </label>
                          <div className="col-md-8">
                            <input
                              type="checkbox"
                              className="form-control"
                              name="photo_availed"
                            />
                          </div>
                          <label
                            htmlFor="card_serial_no"
                            className="col-form-label col-md-4 label-align pl-0 pr-0"
                          >
                            Card Serial No
                          </label>
                          <div className="col-md-8">
                            <input
                              type="text"
                              className="form-control"
                              name="card_serial_no"
                              id="card_serial_no"
                              value={memberData.card_serial_no}
                            />
                          </div>
                          <label
                            htmlFor="application_form_date"
                            className="col-form-label col-md-4 label-align pl-0 pr-0"
                          >
                            Application Form Date
                          </label>
                          <div className="col-md-8">
                            <input
                              type="date"
                              className="form-control"
                              name="application_form_date"
                              id="application_form_date"
                              value={memberData.app_form_date}
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="info_to_printer"
                            className="col-form-label col-md-4 label-align pl-0 pr-0"
                          >
                            Info To Printer
                          </label>
                          <div className="col-md-8">
                            <input
                              type="date"
                              className="form-control"
                              name="info_to_printer"
                              id="info_to_printer"
                              value={memberData.info_to_printer}
                            />
                          </div>
                          <label
                            htmlFor="card_from_printer"
                            className="col-form-label col-md-4 label-align pl-0 pr-0"
                          >
                            Card From Printer
                          </label>
                          <div className="col-md-8">
                            <input
                              type="date"
                              className="form-control"
                              name="card_from_printer"
                              id="card_from_printer"
                              value={memberData.card_from_printer}
                            />
                          </div>
                          <label
                            htmlFor="card_to_member"
                            className="col-form-label col-md-4 label-align pl-0 pr-0"
                          >
                            Card To Member
                          </label>
                          <div className="col-md-8">
                            <input
                              type="date"
                              className="form-control"
                              name="card_to_member"
                              id="card_to_member"
                              value={memberData.card_to_member}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h2 id="headings" className="fs-title">
                        Allergies
                      </h2>
                      <hr />
                      <div className="col-md-12 table-responsive">
                        <button
                          className="btn btn-info col-sm-3"
                          onClick={appendAllergy}
                          style={{ float: "right", marginBottom: "10px" }}
                        >
                          Add Allergy
                        </button>
                        <table
                          className="table table-bordered col-md-12"
                          style={{ maxHeight: "150px" }}
                        >
                          <thead>
                            <tr>
                              <th>Allergy</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberAllergy.map((dt) => {
                              return (
                                <tr key={dt.code}>
                                  <td>{dt.allergy}</td>
                                  <td></td>
                                </tr>
                              );
                            })}
                            {appendedAllergy.map((data) => {
                              return <tr key={data.id}>{data.new}</tr>;
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* Previous button */}
                  <input
                    type="button"
                    name="previous"
                    id="query_previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    defaultValue="Previous"
                  />
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <h2 id="headings" className="fs-title">
                    Benefits
                  </h2>
                  <hr />
                  <div className="col-md-12 col-sm-12"></div>
                  <table
                    className="table table-responsive table-bordered col-md-12"
                    id="benefits_table"
                    style={{ maxHeight: "400px" }}
                  >
                    <thead>
                      <tr>
                        <th>Member No</th>
                        <th>Category</th>
                        <th>Product Name</th>
                        <th>Benefit</th>
                        <th>Sub limit Of</th>
                        <th>Prorata Days</th>
                        <th>Limit</th>
                        <th>Sharing</th>
                        <th>Anniv</th>
                        <th>Fund</th>
                        <th>Capitated</th>
                        <th>Suspend</th>
                        <th>Suspend Date</th>
                        <th>Quantity</th>
                        <th>Waiting Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberBenefits.map((data) => {
                        return (
                          <tr>
                            <td>
                              <input
                                type="text"
                                value={data.member_no}
                                name="member_no_benefit[]"
                                className="form-control"
                                readOnly
                              />
                            </td>
                            <td>
                              <select
                                name="category_benefit[]"
                                className="form-control"
                                readOnly
                              >
                                <option value={data.category}>
                                  {data.category}
                                </option>
                              </select>
                            </td>
                            <td>
                              <select
                                name="product_name_benefit[]"
                                className="form-control"
                                value={data.product_name}
                                readOnly
                              >
                                {productName.map((dt) => {
                                  return (
                                    <option value={dt.code}>
                                      {dt.product_name}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <select
                                name="benefit[]"
                                className="form-control"
                                value={data.benefit}
                                readOnly
                              >
                                {benefits.map((dt) => {
                                  return (
                                    <option value={dt.code}>
                                      {dt.benefit}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <select
                                name="sub_limit_of[]"
                                className="form-control"
                                value={data.sub_limit_of}
                                readOnly
                              >
                                {benefits.map((dt) => {
                                  return (
                                    <option value={dt.code}>
                                      {dt.benefit}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="prorata_days[]"
                                className="form-control"
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="limit[]"
                                value={data.limit}
                                className="form-control"
                                readOnly
                              />
                            </td>
                            <td>
                              <select
                                name="sharing[]"
                                className="form-control"
                                value={data.sharing}
                                readOnly
                              >
                                {benefitSharing.map((dt) => {
                                  return (
                                    <option value={dt.CODE}>
                                      {dt.SHARING}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                name="anniv[]"
                                value={data.anniv}
                                className="form-control"
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                className="form-control"
                                name="fund[]"
                                value={data.fund}
                                checked={data.fund == "1" ? "checked" : ""}
                                className="form-control"
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                className="form-control"
                                name="capitated[]"
                                value={data.capitated}
                                checked={data.capitated == "1" ? "checked" : ""}
                                className="form-control"
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="suspend_at[]"
                                value={data.suspend_at}
                                className="form-control"
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="suspend_date[]"
                                className="form-control"
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="quantity[]"
                                value={data.quantity}
                                className="form-control"
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="waiting_period[]"
                                value={data.waiting_period}
                                className="form-control"
                                readOnly
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* Previous button */}
                  <input
                    type="button"
                    name="previous"
                    id="query_previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    defaultValue="Previous"
                  />
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <div className="col-md-12">
                    <div className="row" id="step_4">
                      <div className="col-md-6">
                        <h2 id="headings" className="fs-title">
                          Medical Condition
                        </h2>
                        <hr />
                        <button
                          className="btn btn-info col-md-4"
                          onClick={appendIllness}
                          style={{ float: "left", margin: "10px" }}
                        >
                          Add Condition
                        </button>
                        <table
                          className="table table-bordered col-md-12"
                          style={{ maxHeight: "300px" }}
                        >
                          <thead>
                            <tr>
                              <th>Member No</th>
                              <th>Medical Condition</th>
                              <th>Condition Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberMedical.map((dt) => {
                              return (
                                <tr>
                                  <td>{dt.member_no}</td>
                                  <td>{dt.illnes}</td>
                                  <td>{dt.conditiondt}</td>
                                </tr>
                              );
                            })}
                            {appendedIllness.map((data) => {
                              return <tr key={data.id}>{data.new}</tr>;
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-6">
                        <h2 id="headings" className="fs-title">
                          Medical Diagnosis
                        </h2>
                        <hr />
                        <button
                          className="btn btn-info col-md-4"
                          onClick={appendDiagnosis}
                          style={{ float: "right", margin: "10px" }}
                        >
                          Add diagnosis
                        </button>

                        <table
                          className="table table-bordered col-md-12"
                          style={{ maxHeight: "300px" }}
                        >
                          <thead>
                            <tr>
                              <th>Member No</th>
                              <th>Exclusion</th>
                              <th>Diagnosis Date</th>
                              <th>Exclusion From</th>
                              <th>Exclusion To</th>
                              <th>Permanent</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberExclusions.map((dt) => {
                              return (
                                <tr>
                                  <td>{dt.member_no}</td>
                                  <td>{dt.clinical_diagnosis}</td>
                                  <td>{dt.diagnosisdt}</td>
                                  <td>{dt.exclfromdt}</td>
                                  <td>{dt.excltodt}</td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      className="form-control"
                                      readOnly
                                      checked={
                                        dt.permanent == "1" ? "checked" : ""
                                      }
                                    />
                                  </td>
                                  <td></td>
                                </tr>
                              );
                            })}
                            {appendedDiagnosis.map((data) => {
                              return <tr key={data.id}>{data.new}</tr>;
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* Previous button */}
                  <input
                    type="button"
                    name="previous"
                    id="query_previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    defaultValue="Previous"
                  />
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <h2 id="headings" className="fs-title">
                    Vetting
                  </h2>
                  <hr />
                  <div className="row ml-0" id>
                    <div className="col-md-12 align-items-center">
                      <div className="form-group row ml-0 justify-content-center">
                        <label
                          htmlFor="reason"
                          className="col-form-label col-md-2 label-align"
                        >
                          Member No
                        </label>
                        <div className="col-md-8 pr-0 pl-0">
                          <input
                            type="text"
                            value={memberAcceptance.MEMBER_NO}
                            className="form-control"
                            name="member_no_vetting"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0 justify-content-center">
                        <label
                          htmlFor="status"
                          className="col-form-label col-md-2 label-align"
                        >
                          Status
                        </label>
                        <div className="col-md-4 mr-0 form-check-inline form-control">
                          <label className="col-form-label label-align">
                            Accepted
                          </label>
                          <input
                            type="radio"
                            className="form-control"
                            name="vetting_status"
                            value="1"
                            checked={
                              memberAcceptance.STATUS == "1" ? "checked" : ""
                            }
                            onClick={() => setStatus(true)}
                          />
                          <label className="col-form-label label-align">
                            Suspend
                          </label>
                          <input
                            type="radio"
                            className="form-control"
                            name="vetting_status"
                            value="2"
                            checked={
                              memberAcceptance.STATUS == "2" ? "checked" : ""
                            }
                            onClick={() => setStatus(false)}
                          />
                          <label
                            htmlFor="rejected"
                            className="col-form-label label-align"
                          >
                            Rejected
                          </label>
                          <input
                            type="radio"
                            className="form-control"
                            name="vetting_status"
                            value="3"
                            checked={
                              memberAcceptance.STATUS == "3" ? "checked" : ""
                            }
                            onClick={() => setStatus(false)}
                          />
                        </div>
                        <label
                          htmlFor="status_date"
                          className="col-form-label col-md-2 label-align label-right "
                        >
                          Status Date
                        </label>
                        <div className="col-md-2 col-sm-2 pr-0">
                          <input
                            type="date"
                            className="form-control datepicker"
                            id="status_date"
                            value={memberAcceptance.STATUS_DATE}
                            name="status_date"
                            readOnly="true"
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0 justify-content-center">
                        <label
                          htmlFor="reason"
                          className="col-form-label col-md-2 label-align"
                        >
                          Reason:
                        </label>
                        <div className="col-md-8 pr-0 pl-0">
                          <select
                            className="form-control"
                            id="reason"
                            name="reason"
                            defaultValue="0"
                            value={memberAcceptance.DEF_REJ}
                            disabled={status}
                          >
                            <option disabled value="0">
                              Select Reason
                            </option>
                            {reason.map((data) => {
                              return (
                                <option key={data.CODE} value={data.CODE}>
                                  {data.REASON}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="form-group row ml-0 justify-content-center">
                        <label
                          htmlFor="comment"
                          className="col-form-label col-md-2 label-align"
                        >
                          Comments:
                        </label>
                        <div className="col-md-8 pr-0 pl-0">
                          <textarea
                            type
                            className="form-control"
                            name="comment"
                            value={memberAcceptance.COMMENTS}
                            id="comment"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />

                  <input
                    type="button"
                    name="previous"
                    id="query_previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    defaultValue="Previous"
                  />
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <h2 id="headings" className="fs-title">
                    Activation
                  </h2>
                  <hr />
                  <table className="table table-responsive table-bordered">
                    <tbody>
                      <tr>
                        <th>Member No</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Renewal Date</th>
                        <th>Anniv</th>
                        <th>Health Plan</th>
                        <th>Option</th>
                        <th>Smart</th>
                        <th>Sync'd</th>
                      </tr>
                    </tbody>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            name="member_no_activation"
                            className="form-control"
                            type="text"
                            value={memberAnniversary.member_no}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            name="start_date"
                            id="start_date"
                            value={memberAnniversary.start_date}
                            type="date"
                            readOnly="true"
                          />
                        </td>
                        <td>
                          <input
                            name="end_date"
                            id="end_date"
                            value={memberAnniversary.end_date}
                            type="text"
                            className="form-control"
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            name="renewal_date"
                            id="renewal_date"
                            type="text"
                            value={memberAnniversary.renewal_date}
                            className="form-control"
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            name="activation_anniv"
                            id="activation_anniv"
                            type="text"
                            value={memberAnniversary.anniv}
                            className="form-control"
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            name="activation_health_plan"
                            type="text"
                            value={memberAnniversary.health_plan}
                            className="form-control"
                            required="true"
                            readOnly
                          />
                        </td>
                        <td>
                          <select
                            name="activation_option"
                            type="text"
                            value={memberAnniversary.h_option}
                            className="form-control"
                            required="true"
                            readOnly
                          >
                            <option value="0">Select Product Name</option>
                            {productName.map((data) => {
                              return (
                                <option key={data.code} value={data.code}>
                                  {data.product_name}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td>
                          <input
                            name="smart_sync"
                            type="checkbox"
                            value={memberAnniversary.smart_sync}
                            checked={
                              memberAnniversary.smart_sync == "1"
                                ? "checked"
                                : ""
                            }
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            name="sync"
                            type="checkbox"
                            value={memberAnniversary.sync}
                            checked={
                              memberAnniversary.sync == "1" ? "checked" : ""
                            }
                            className="form-control"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <input
                    type="button"
                    name="previous"
                    id="query_previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    defaultValue="Previous"
                  />
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <div className="col-md-12">
                    <div className="row" id="step_4">
                      <div className="col-md-12" style={{ margin: "10px" }}>
                        <h2 id="headings" className="fs-title">
                          Cancellations
                        </h2>
                        <hr />

                        <table
                          className="table table-bordered col-md-12"
                          maxHeight="300px"
                        >
                          <thead>
                            <tr>
                              <th>Member No</th>
                              <th>Status</th>
                              <th>Date Cancelled</th>
                              <th>Anniv</th>
                              <th>Reason</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                      <div className="col-md-12" style={{ margin: "10px" }}>
                        <h2 id="headings" className="fs-title">
                          Membership Smart Card Reprint / Replacement
                        </h2>
                        <hr />

                        <table
                          className="table table-bordered col-md-12"
                          maxHeight="300px"
                        >
                          <thead>
                            <tr>
                              <th>Member No</th>
                              <th>Info To Printer</th>
                              <th>Card From Printer</th>
                              <th>Card To Member</th>
                              <th>Anniv</th>
                              <th>User</th>
                              <th>Reorder Reason</th>
                              <th>Serial No</th>
                              <th>Sync</th>
                              <th>Smart Sync</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="member_no_reorder"
                                  value={memberData.MEMBER_NO}
                                  required="true"
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  name="info_to_printer_reorder"
                                  id="info_to_printer_reorder"
                                  className="form-control"
                                  type="date"
                                  required="true"
                                />
                              </td>
                              <td>
                                <input
                                  name="card_from_printer_reorder"
                                  id="card_from_printer_reorder"
                                  className="form-control"
                                  type="date"
                                />
                              </td>

                              <td>
                                <input
                                  name="card_to_member_reorder"
                                  id="card_to_member_reorder"
                                  className="form-control"
                                  type="date"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  name="anniv_reorder"
                                  type="text"
                                  value={corpData.anniv}
                                  readOnly
                                />
                              </td>

                              <td>
                                <input
                                  className="form-control"
                                  name="user_reorder"
                                  type="text"
                                  value={localStorage.getItem("username")}
                                  readOnly
                                />
                              </td>
                              <td>
                                <select
                                  className="form-control"
                                  name="reason_reorder"
                                  id=""
                                  defaultValue="0"
                                >
                                  <option disabled value="0">
                                    Select Reason
                                  </option>
                                  {reprintReason.map((data) => {
                                    return (
                                      <option value={data.code}>
                                        {data.reprint_reason}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td>
                                <input
                                  name="serial_no_reorder"
                                  className="form-control"
                                  type="text"
                                />
                              </td>
                              <td>
                                <input
                                  name="sync_reorder"
                                  className="form-control"
                                  type="checkbox"
                                  value="1"
                                />
                              </td>
                              <td>
                                <input
                                  className="form-control"
                                  name="smart_sync_reorder"
                                  value="1"
                                  type="checkbox"
                                  checked="true"
                                  readOnly="true"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-12" style={{ margin: "10px" }}>
                        <h2 id="headings" className="fs-title">
                          Membership Info Edit(s) and Smart Card Reprint
                        </h2>
                        <hr />

                        <table
                          className="table table-bordered col-md-12"
                          maxHeight="300px"
                        >
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Member No</th>
                              <th>Card Reprint</th>
                              <th>Edit Date</th>
                              <th>User Id</th>
                              <th>Sync</th>
                              <th>Card Serial No</th>
                              <th>Print Date</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/*previous button*/}
                  <input
                    type="button"
                    name="previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    value="Previous"
                  />
                  {/*Submit button*/}
                  <input
                    type="submit"
                    className="action-button btn-success col-md-4 ml-auto"
                    value="Save"
                  />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Modal2
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        body={
          <span className="h4 text-white font-weight-bold text-center">
            {feedback}
          </span>
        }
        background={feedback.length > 0?feedback[0].includes('Error')?"#d9534f":"#105878":""}
      />
    </div>
  );
};

export default ReorderSmartCard;
