import { useState, useEffect } from "react";
import ImportScripts from "../../../../components/helpers/ImportScripts";
import {
  getData,
  getOneData,
  postData,
} from "../../../../components/helpers/Data";
import Modal2 from "../../../../components/helpers/Modal2";
import { today } from "../../../../components/helpers/today";
import AccessLogs from "../../../../components/helpers/AccessLogs";

const AddPrincipalPortal = () => {
  //save access log
  useEffect(() => {
    const frmData = new FormData();
    frmData.append("username", localStorage.getItem("username"));
    frmData.append("accessed", 4);
    AccessLogs(frmData);
  }, []);
  //module variables
  ImportScripts("/dist/js/claims_stepwise_forms.js");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [feedback, setFeedback] = useState([]);

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
  const [corpSelected, setCorpSelected] = useState([]);
  const [corpData, setCorpData] = useState([]);
  const [mode, setMode] = useState(true);
  const [familySize, setFamilySize] = useState([]);
  const [familyNo, setFamilyNo] = useState([]);
  const [memberNo, setmemberNo] = useState([]);
  const [familyDetails, setFamilyDetails] = useState(true);
  const [choosenHealthPlan, setChoosenHealthPlan] = useState([]);
  const [choosenOption, setChoosenOption] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [illness, setIllness] = useState([]);
  const [appendedIllness, setAppendedIllness] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [appendedDiagnosis, setAppendedDiagnosis] = useState([]);
  const [appendedAllergy, setAppendedAllergy] = useState([]);
  const [relationToPrincipal, setRelationToPrincipal] = useState([]);
  const [principalData, setPrincipalData] = useState([]);
  const [maxid, setMaxId] = useState([]);
  const [bene, setBene] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [readOnlyStatus, setReadOnlyStatus] = useState(true);

  useEffect(() => {
    document.getElementById("start_date").min = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("status_date").min = new Date()
      .toISOString()
      .split("T")[0];
    getData("member_dropdowns").then((data) => {
      setCorp(data.corporate);
      //  setHealthPlan(data.health_plan);
      setAgent(data.agent);
      setBene(data.benefits);
      setOccupation(data.occupation);
      setFamilyTitle(data.family_title);
      setTitle(data.title);
      setBloodGroup(data.blood_group);
      setAllergy(data.allergy);
      setReason(data.reason);
      setMaxId(data.max_id);
      setIllness(data.illness);
      setDiagnosis(data.clinical_diagnosis);
      setFamilyNo("UG" + (parseInt(data.max_id) + 1));
    });
  }, []);

  useEffect(() => {
    if (corpSelected.length !== 0) {
      setHealthPlan([]);
      getOneData("fetch_corporate", corpSelected).then((data) => {
        data.corp.map((dt) => {
          if (dt.corp_id == 14) {
            setReadOnlyStatus(false);
          } else {
            setReadOnlyStatus(true);
          }
          setCorpData(dt);
        });
        setHealthPlan(data.category);
      });
    }
  }, [corpSelected]);

  useEffect(() => {
    if (choosenOption.length !== 0) {
      const frmData = new FormData();
      frmData.append("health_plan", choosenHealthPlan);
      frmData.append("options", choosenOption);
      frmData.append("corp_id", corpSelected);
      frmData.append("anniv", corpData.anniv);
      postData(frmData, "get_benefits").then((data) => {
        setBenefits(data);
      });
    }
  }, [choosenOption]);

  useEffect(() => {
    setProductName([]);
    if (choosenHealthPlan.length !== 0) {
      setBenefits([]);
      const frmData = new FormData();
      frmData.append("healthPlan", choosenHealthPlan);
      frmData.append("corp_id", corpSelected);
      postData(frmData, "get_options_for_corporate").then((data) => {
        setProductName(data);
        document.getElementById("option").value = "0";
      });
    }
  }, [choosenHealthPlan]);

  const appendIllness = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input
              type="text"
              value={memberNo}
              name="member_no_illness[]"
              readOnly
            />
          </td>
          <td>
            <select
              name="illness[]"
              defaultValue="0"
              style={{ width: "300px" }}
            >
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
              value={memberNo}
              name="member_no_diagnosis[]"
              readOnly
            />
          </td>
          <td>
            <select
              name="diagnosis[]"
              defaultValue="0"
              style={{ width: "300px" }}
            >
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

  const validatePrincipal = (e) => {
    e.preventDefault();
    const surname = document.getElementById("surname").value;
    const firstName = document.getElementById("first_name").value;
    const agent = document.getElementById("agent_id").value;
    const healthPlan = document.getElementById("health_plan").value;
    const option = document.getElementById("option").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const title = document.getElementById("title").value;
    const start_date = document.getElementById("start_date").value;
    const end_date = document.getElementById("end_date").value;
    const renewal_date = document.getElementById("renewal_date").value;

    if (
      surname !== "" &&
      firstName !== "" &&
      agent !== "0" &&
      healthPlan !== "0" &&
      option !== "0" &&
      dob !== "" &&
      gender !== "" &&
      title !== "" &&
      start_date !== "" &&
      end_date !== "" &&
      renewal_date !== ""
    ) {
      submitFrm();
    } else {
      setFeedback(["Please fill in all information!"]);
      setModalIsOpen(true);
    }
  };

  const submitFrm = () => {
    const frmData = new FormData(document.getElementById("formMember"));
    frmData.append("module", "principal");
    frmData.append(
      "corp_id",
      document.getElementById("select-corporate-dropdown").value
    );
    document.querySelectorAll(".permanent").forEach((element) => {
      if (element.checked == true) {
        frmData.append("permanent[]", "1");
      } else {
        frmData.append("permanent[]", "0");
      }
    });

    document.querySelectorAll(".capitated").forEach((element) => {
      if (element.checked == true) {
        frmData.append("capitated[]", "1");
      } else {
        frmData.append("capitated[]", "0");
      }
    });
    document.querySelectorAll(".fund").forEach((element) => {
      if (element.checked == true) {
        frmData.append("fund[]", "1");
      } else {
        frmData.append("fund[]", "0");
      }
    });
    postData(frmData, "save_member").then((data) => {
      setFeedback(data);
      setModalIsOpen(true);
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    if (feedback[0] !== "Please fill in all information!") {
      window.location.replace("add-principal-from-portal");
    }
  };
  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="col-md-12">
            <div className="row pr-0">
              <div className="col-md-4">
                <select
                  className="form-control col-md-12"
                  id="select-corporate-dropdown"
                  name="corporate_main"
                  defaultValue="0"
                  onChange={(e) => setCorpSelected(e.target.value)}
                >
                  <option disabled value="0">
                    Select Corporate
                  </option>
                  {corp.map((corporate) => {
                    return (
                      <option key={corporate.corp_id} value={corporate.corp_id}>
                        {corporate.corporate}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
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
                Add Principal From Portal
              </h4>
              <form
                className="claims_form mt-1"
                id="formMember"
                onSubmit={validatePrincipal}
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
                            
                            id="surname"
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
                            
                            id="first_name"
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
                            id="other_names"
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
                            name="tel_no"
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
                            name="mobile_no"
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
                            name="postal_add"
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
                            id="email"
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
                            defaultValue="0"
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
                            id="phy_loc"
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
                            defaultValue="0"
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
                            type="text"
                            name="family_size"
                            id="family_size"
                            value="M"
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
                            defaultValue="0"
                            name="health_plan"
                            onChange={(e) =>
                              setChoosenHealthPlan(e.target.value)
                            }
                            id="health_plan"
                          >
                            <option value="0">Select Health Plan</option>
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
                            onChange={(e) => setChoosenOption(e.target.value)}
                            defaultValue="0"
                            id="option"
                            name="option"
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
                      <div className="form-group row ml-0">
                        <h6 className="header smaller center">
                          AUTO-GENERATED
                        </h6>
                      </div>
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
                            name="family_no"
                            onKeyUp={(e) => setmemberNo(e.target.value + "-00")}
                            onKeyDown={(e) =>
                              setmemberNo(e.target.value + "-00")
                            }
                            onChange={(e) => setFamilyNo(e.target.value)}
                            
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
                            value={memberNo}
                            name="member_no"
                            
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

                  <div className="col-md-12" hidden={familyDetails}>
                    <div style={{ marginTop: "10px" }} id="family_details">
                      <h2 id="headings" className="fs-title">
                        Family Details
                      </h2>
                      <hr />
                    </div>
                    <table
                      className="table table-bordered col-md-12"
                      maxHeight="300px"
                    >
                      <thead>
                        <tr>
                          <th>Family No</th>
                          <th>Member No</th>
                          <th>Member Name</th>
                          <th>Status</th>
                          <th>Relation To Principal</th>
                          <th>Family Title</th>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </table>
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
                          value={familyNo}
                          
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
                          value={memberNo}
                          
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
                          
                          name="relation_to_principal"
                          id="relation_to_principal"
                          value="24"
                          readOnly
                        >
                          <option disabled value="24">
                            PRINCIPAL
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
                          name="dob"
                          id="dob"
                          
                        />
                      </div>
                      <label
                        htmlFor="idno"
                        className="col-form-label col-md-1 label-align pl-0 pr-0"
                      >
                        Id No
                      </label>
                      <div className="col-md-3 col-sm-3">
                        <input type="text" name="idno" id="idno" />
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
                          
                          name="relation_to_principal"
                          id="relation_to_principal"
                          value="24"
                          readOnly
                        >
                          <option disabled value="24">
                            PRINCIPAL
                          </option>
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
                          
                        >
                          <option disabled selected>
                            Select Gender
                          </option>
                          <option value="0">MALE</option>
                          <option value="1">FEMALE</option>
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
                          
                          defaultValue="0"
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
                        >
                          <option disabled selected>
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
                        >
                          <option disabled selected>
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
                      {benefits.map((data) => {
                        return (
                          <tr key={data.idx}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                style={{ width: "200px" }}
                                value={memberNo}
                                name="member_no_benefit[]"
                                readOnly
                              />
                            </td>
                            <td>
                              <select
                                name="category_benefit[]"
                                className="form-control"
                                style={{ width: "200px" }}
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
                                style={{ width: "300px" }}
                              >
                                <option value={data.product_code}>
                                  {data.product_name}
                                </option>
                              </select>
                            </td>
                            <td>
                              <select
                                name="benefit[]"
                                className="form-control"
                                style={{ width: "400px" }}
                              >
                                <option value={data.benefit_code}>
                                  {data.benefit}
                                </option>
                              </select>
                            </td>
                            <td>
                              <select
                                name="sub_limit_of[]"
                                className="form-control"
                                style={{ width: "400px" }}
                                value={data.sub_limit_of}
                              >
                                {bene.map((dt) => {
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
                                className="form-control"
                                style={{ width: "200px" }}
                                name="prorata_days[]"
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                style={{ width: "200px" }}
                                name="limit[]"
                                value={data.limit}
                                readOnly
                              />
                            </td>
                            <td>
                              <select
                                name="sharing[]"
                                className="form-control"
                                style={{ width: "200px" }}
                              >
                                <option value={data.sharing_code}>
                                  {data.sharing}
                                </option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="anniv[]"
                                value={data.anniv}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                className="form-control fund"
                                value={data.fund}
                                checked={data.fund == "1" ? "checked" : ""}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                className="form-control capitated"
                                value={data.capitated}
                                checked={data.capitated == "1" ? "checked" : ""}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                style={{ width: "200px" }}
                                name="suspend_at[]"
                                value={data.suspend_at}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                style={{ width: "200px" }}
                                name="suspend_date[]"
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                style={{ width: "200px" }}
                                name="quantity[]"
                                value={data.quantity}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                style={{ width: "200px" }}
                                name="waiting_period[]"
                                value={data.waiting_period}
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
                              <th>Anniv</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
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
                            value={memberNo}
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
                            value={today()}
                            className="form-control datepicker"
                            id="status_date"
                            name="status_date"
                            readOnly
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
                            style={{ width: "200px" }}
                            type="text"
                            value={memberNo}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            name="start_date"
                            id="start_date"
                            type="date"
                            min={corpData.start_date}
                            defaultValue={corpData.start_date}
                          />
                        </td>
                        <td>
                          <input
                            name="end_date"
                            id="end_date"
                            max={corpData.end_date}
                            defaultValue={corpData.end_date}
                            type="date"
                            onChange={(e) => setEndDate(e.target.value)}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            name="renewal_date"
                            id="renewal_date"
                            type="date"
                            min={endDate !== "" ? endDate : corpData.end_date}
                            max={corpData.renewal_date}
                            defaultValue={corpData.renewal_date}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            name="activation_anniv"
                            id="activation_anniv"
                            type="text"
                            value={corpData.anniv}
                            className="form-control"
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            name="activation_health_plan"
                            type="text"
                            value={choosenHealthPlan}
                            className="form-control"
                            style={{ width: "200px" }}
                            
                            readOnly
                          />
                        </td>
                        <td>
                          <select
                            name="activation_option"
                            type="text"
                            value={choosenOption}
                            className="form-control"
                            style={{ width: "200px" }}
                            
                            readOnly
                          >
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
                            value="1"
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            name="sync"
                            type="checkbox"
                            value="1"
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
                              <th>Sync</th>
                              <th>User</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
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
        body={feedback.map((dt) => {
          return (
            <p className="h4 text-white font-weight-bold text-center">{dt}</p>
          );
        })}
        background={
          feedback.length > 0
            ? feedback[0].includes("Error")
              ? "#d9534f"
              : "#105878"
            : ""
        }
      />
    </div>
  );
};

export default AddPrincipalPortal;
