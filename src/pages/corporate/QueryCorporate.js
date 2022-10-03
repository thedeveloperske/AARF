import { data } from "jquery";
import React, { useEffect, useState } from "react";
import {
  getData,
  getOneData,
  getTwoData,
  postData,
} from "../../components/helpers/Data";
import ImportScript from "../../components/helpers/ImportScripts";
import { Spinner } from "../../components/helpers/Spinner";
import Modal2 from "../../components/helpers/Modal2";
import AccessLogs from "../../components/helpers/AccessLogs";
import Modal3 from "../../components/helpers/Modal3";

const QueryCorporate = () => {
  //save access log
  useEffect(() => {
    const frmData = new FormData();
    frmData.append("username", localStorage.getItem("username"));
    frmData.append("accessed", 2);
    AccessLogs(frmData);
  }, []);
  //module variables
  ImportScript("/dist/js/claims_stepwise_forms.js");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modal3IsOpen, setModal3IsOpen] = useState(false);
  const [response, setResponse] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [agents, setAgents] = useState([]);
  const [towns, setTowns] = useState([]);
  const [clientTypes, setClientTypes] = useState([]);
  const [queryCorpData, setQueryCorpData] = useState([]);
  const [corpAnnivs, setcorpAnnivs] = useState([]);
  const [corpContactPerson, setcorpContactPerson] = useState([]);
  const [adminFees, setAdminFees] = useState([]);
  const [corpGroups, setcorpGroups] = useState([]);
  const [corpProvider, setCorpProvider] = useState([]);
  const [healthPlan, setHealthPlan] = useState([]);
  const [productName, setProductName] = useState([]);
  const [benefit, setBenefit] = useState([]);
  const [sharing, setSharing] = useState([]);
  const [agent, setAgent] = useState([]);
  const [title, setTitle] = useState([]);
  const [contact_relation, setContactRelation] = useState([]);
  const [adminFeeTypes, setAdminFeeTypes] = useState([]);
  const [newContactPersonRow, setNewContactPersonRow] = useState([]);
  const [newBenefit, setNewBenefit] = useState([]);
  const [disabledStatus, setDisabledStatus] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [visibleState, setVisibleState] = useState({
    updatebtn: true,
  });
  const [choosenHealthPlan, setChoosenHealthPlan] = useState("0");
  const [modalProductNames, setModalProductNames] = useState([]);
  const [choosenProductName, setChoosenProductName] = useState([]);
  const [exists, setExists] = useState("");

  const closeModal = () => {
    setModalIsOpen(false);

    // setTimeout(function () {
    //   window.location.replace("/query-corporate");
    // },);
  };
  const closeModal3 = () => {
    setModal3IsOpen(false);
  };

  //fetching specific product names
  useEffect(() => {
    setModalProductNames([]);
    if (choosenHealthPlan != "0") {
      getOneData("fetch_specific_product_names", choosenHealthPlan)
        .then((data) => {
          console.log(data);
          setModalProductNames(data);
        })
        .catch((error) => console.log(error));
    }
  }, [choosenHealthPlan]);

  //enable editing
  const toogleState = (e) => {
    if (e.target.checked) {
      setDisabled(true);
      setVisibleState({ updatebtn: true });
    } else {
      setDisabled(false);
      setVisibleState({ updatebtn: false });
    }
  };
  //getting all corporates
  useEffect(() => {
    getData("fetch_corporates").then((data) => {
      setCorporates(data);
    });

    getData("fetch_client_types").then((data) => {
      setClientTypes(data);
    });
  }, []);
  //getting all agents
  useEffect(() => {
    getData("fetch_agents").then((data) => setAgents(data));
  }, []);
  //fetch all towns
  useEffect(() => {
    getData("fetch_towns").then((data) => setTowns(data));
  }, []);
  //query corporate data
  const queryCorporateData = (e) => {
    document.getElementById("spinner").style.display = "block";
    setDisabledStatus(false);
    setcorpAnnivs([]);
    setcorpContactPerson([]);
    setAdminFees([]);
    setcorpGroups([]);
    setCorpProvider([]);
    setHealthPlan([]);
    setProductName([]);
    setBenefit([]);
    setSharing([]);
    setAgent([]);
    setTitle([]);
    setContactRelation([]);
    setAdminFeeTypes([]);
    setQueryCorpData([]);
    getOneData("query_corporate", e.target.value)
      .then((data) => {
        console.log(data);
        data.corporate.map((dt) => {
          setQueryCorpData(dt);
        });
        setcorpAnnivs(data.prev_annivs);
        setcorpContactPerson(data.corp_contact_person);
        setAdminFees(data.admin_fee);
        setcorpGroups(data.corp_groups);
        setCorpProvider(data.corp_provider);
        setHealthPlan(data.health_plan);
        setProductName(data.product_name);
        setBenefit(data.benefit);
        setSharing(data.sharing);
        setAgent(data.agent);
        setTitle(data.title);
        setContactRelation(data.contact_relation);
        setAdminFeeTypes(data.admin_fee_types);
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        document.getElementById("spinner").style.display = "none";
        console.log(error);
      });
  };

  const chooseHealthPlan = () => {
    setExists("");
    setModal3IsOpen(true);
  };
  //function to add new contact person row
  const addContactPersonRow = () => {
    const contactPersonRow = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <select className="form-control" name="title_added[]" id="title">
              <option value={""} disabled selected>
                -- SELECT TITLE --
              </option>
              {title.map((title) => {
                const { CODE, TITLE } = title;
                return (
                  <option key={CODE} value={CODE}>
                    {TITLE}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <input
              id="surname"
              className="form-control"
              type="text"
              name="surname_added[]"
              placeholder="Surname"
              onInput={toInputUppercase}
            />
          </td>
          <td>
            <input
              id="first_name"
              className="form-control"
              type="text"
              name="first_name_added[]"
              placeholder="First Name"
              onInput={toInputUppercase}
            />
          </td>
          <td>
            <input
              id="other_names"
              className="form-control"
              type="text"
              name="other_names_added[]"
              placeholder="Other Names"
              onInput={toInputUppercase}
            />
          </td>
          <td>
            <select
              className="form-control"
              name="contact_relation_added[]"
              id="contact_relation"
              style={{ width: "200px" }}
            >
              <option value={""} disabled selected>
                -- SELECT JOB TITLE --
              </option>
              {contact_relation.map((contact_relation) => {
                const { CODE, RELATION } = contact_relation;
                return (
                  <option key={CODE} value={CODE}>
                    {RELATION}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <input
              id="contact_mobile_no"
              className="form-control"
              type="tel"
              name="contact_mobile_no_added[]"
              placeholder="Mobile No"
              onInput={toInputUppercase}
            />
          </td>
          <td>
            <input
              id="contact_tel_no"
              className="form-control"
              type="text"
              name="contact_tel_no_added[]"
              placeholder="Telephone No"
              onInput={toInputUppercase}
            />
          </td>
          <td>
            <input
              id="contact_email"
              className="form-control"
              type="email"
              name="contact_email_added[]"
              placeholder="johndoe@gmail.com"
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeContactPersonRow(contactPersonRow.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };
    setNewContactPersonRow((newContactPersonRow) => {
      return [...newContactPersonRow, contactPersonRow];
    });
    //remove selected row
    const removeContactPersonRow = (id, e) => {
      e.preventDefault();
      setNewContactPersonRow((newContactPersonRow) => {
        return newContactPersonRow.filter((row) => row.id !== id);
      });
    };
  };

  //check if products added already exists
  const validateIfProductsExist = (e) => {
    setExists("");
    e.preventDefault();
    let exists = 0;
    const tbl = document.querySelector("#benefits_table tbody").children;
    const maxAnniv = tbl[0].children[1].children[0].value;
    for (let i = 0; i < tbl.length; i++) {
      const tr = tbl[i];

      const anniv = tr.children[1].children[0].value;
      const category = tr.children[2].children[0].value;
      const productName = tr.children[3].children[0].value;
      if (
        category === choosenHealthPlan &&
        productName === choosenProductName &&
        maxAnniv === anniv
      ) {
        exists++;
      }
    }
    if (exists > 0) {
      setExists("Product already exists!");
    } else {
      addBenefitsRow();
    }
  };

  //function to add new benefit row
  const addBenefitsRow = () => {
    getTwoData(
      "fetch_product_benefits",
      choosenHealthPlan,
      choosenProductName
    ).then((data) => {
      const row = data.fetched_benefits.map((dt) => {
        return (
          <tr key={dt.id} id="appended">
            <td hidden>
              <input
                className="form-control"
                type="text"
                name="idx[]"
                readOnly
              />
            </td>
            <td>
              <input
                className="form-control"
                value={parseInt(
                  document.getElementById("corporate_anniv").value
                )}
                type="text"
                name="corp_group_anniv[]"
                readOnly
              />
            </td>
            <td>
              <select
                className="form-control"
                defaultValue={dt.health_plan}
                type="text"
                name="health_plan_added[]"
              >
                <option value="0">Select Category</option>
                {healthPlan.map((cat) => {
                  return <option value={cat.category}>{cat.category}</option>;
                })}
              </select>
            </td>
            <td>
              <select
                className="form-control"
                defaultValue={dt.product_code}
                type="text"
                name="product_name_added[]"
                style={{ width: "200px" }}
              >
                <option value="0">Select Product Name</option>
                {productName.map((pname) => {
                  return (
                    <option value={pname.code}>{pname.product_name}</option>
                  );
                })}
              </select>
            </td>
            <td>
              <select
                className="form-control"
                defaultValue={dt.benefit_code}
                type="text"
                name="benefit_added[]"
                style={{ width: "300px" }}
              >
                <option value="0">Select Benefit</option>
                {benefit.map((bene) => {
                  return <option value={bene.CODE}>{bene.BENEFIT}</option>;
                })}
              </select>
            </td>
            <td>
              <select
                className="form-control"
                defaultValue={dt.sub_limit_of_code}
                type="text"
                name="sub_limit_of_added[]"
                style={{ width: "300px" }}
              >
                <option value="0">Select Sub Limit Of</option>
                {benefit.map((bene) => {
                  return <option value={bene.CODE}>{bene.BENEFIT}</option>;
                })}
              </select>
            </td>
            <td>
              <input
                className="form-control"
                defaultValue={dt.limit}
                type="number"
                min="0"
                name="limit_added[]"
                style={{ width: "150px" }}
              />
            </td>
            <td>
              <select
                className="form-control"
                defaultValue={dt.sharing}
                type="text"
                name="sharing_added[]"
                style={{ width: "150px" }}
              >
                <option value="0">Select Sharing</option>
                {sharing.map((share) => {
                  return <option value={share.CODE}>{share.SHARING}</option>;
                })}
              </select>
            </td>
            <td>
              <input
                className="form-control fund_added"
                type="checkbox"
                defaultChecked={dt.fund === 1 ? "checked" : ""}
              />
            </td>
            <td>
              <input
                className="form-control capitated_added"
                type="checkbox"
                defaultChecked={dt.capitated === 1 ? "checked" : ""}
              />
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="0"
                defaultValue={dt.quantity}
                name="quantity_added[]"
              />
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="0"
                name="waiting_period_added[]"
              />
            </td>
          </tr>
        );
      });

      setNewBenefit((newBenefit) => {
        return [...newBenefit, row];
      });
    });
    setModal3IsOpen(false);
  };
  //function to get value
  function getValue(e) {
    console.log(e.target.value);
  }
  //function to input uppercase
  const toInputUppercase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };
  //save query corporate data
  const saveQueryCorporate = async (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("query_corp_form"));

    const smartCheckbox = document.querySelectorAll(".smart");
    const fundCheckbox = document.querySelectorAll(".fund");
    const capitatedCheckbox = document.querySelectorAll(".capitated");
    const fund_addedCheckbox = document.querySelectorAll(".fund_added");
    const capitated_addedCheckbox =
      document.querySelectorAll(".capitated_added");

    smartCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("smart_sync[]", "1");
      } else {
        frmData.append("smart_sync[]", "0");
      }
    });

    fundCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("fund[]", "1");
      } else {
        frmData.append("fund[]", "0");
      }
    });

    capitatedCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("capitated[]", "1");
      } else {
        frmData.append("capitated[]", "0");
      }
    });

    fund_addedCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("fund_added[]", "1");
      } else {
        frmData.append("fund_added[]", "0");
      }
    });

    capitated_addedCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("capitated_added[]", "1");
      } else {
        frmData.append("capitated_added[]", "0");
      }
    });

    postData(frmData, "save_query_corporate_data")
      .then((data) => {
        console.log(data);
        setResponse(data);
        setModalIsOpen(true);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <select
                className="form-control"
                id="select-corporate-dropdown"
                onChange={queryCorporateData}
              >
                <option value="" disabled selected>
                  Select Corporate
                </option>
                {corporates.map((corporate) => {
                  const { CORP_ID, CORPORATE } = corporate;
                  return (
                    <option key={CORP_ID} value={CORP_ID}>
                      {CORPORATE}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-md-2">
              <div className="form-group row ml-5 ">
                <label
                  htmlFor="other_names"
                  className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                >
                  Edit
                </label>
                <div className="col-md-4 col-sm-4 ">
                  <input
                    type="checkbox"
                    className="form-control"
                    defaultChecked="true"
                    onChange={toogleState}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="querycorporatetable" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <form
                className="claims_form mt-1"
                id="query_corp_form"
                onSubmit={saveQueryCorporate}
              >
                {/* progressbar */}
                <ul id="progressbar">
                  <li className="active">Corporate</li>
                  <li>Contact Person</li>
                  <li>Regulation</li>
                  <li>Benefits</li>
                  <li>Provider</li>
                </ul>
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Corporate</h2>
                    <hr />
                    <Spinner />
                  </div>
                  <div className="row col-md-12" id="step-1">
                    <div className="form-group row ml-0">
                      <label
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                        for="corp_id"
                      >
                        Corp ID
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-4 col-sm-4 ">
                        <input
                          type="text"
                          className="form-control"
                          value={queryCorpData.CORP_ID}
                          name="corp_id"
                          id="corp_id"
                          placeholder="Corp Id"
                          aria-required="true"
                          readOnly
                          onInput={toInputUppercase}
                        />
                      </div>
                      <label
                        for="corp_code"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Corp Code
                        <span className="required"></span>
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="text"
                          className="form-control"
                          name="corp_code"
                          id="corp_code"
                          value={queryCorpData.corp_code}
                          placeholder="corp code"
                          disabled={disabled}
                          onInput={toInputUppercase}
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="Corporate"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Corporate
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="text"
                          className="form-control"
                          value={queryCorpData.CORPORATE}
                          name="corporate"
                          id="corporate"
                          placeholder="Corporate"
                          aria-required="true"
                          disabled={disabled}
                          onInput={toInputUppercase}
                        />
                      </div>
                      <label
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                        for="Identity"
                      >
                        Identity
                        <span className="required"></span>
                      </label>
                      <div className="col-md-4 col-sm-4 ">
                        <input
                          type="text"
                          className="form-control"
                          name="identity"
                          id="identity"
                          value={queryCorpData.corporate_identity}
                          placeholder="Identity"
                          disabled={disabled}
                          oninput="this.value = this.value.toUpperCase()"
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="telephone_no"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0 "
                      >
                        Tel No
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="text"
                          className="form-control"
                          name="corp_tel_no"
                          id="corp_tel_no"
                          defaultValue={queryCorpData.TEL_NO}
                          placeholder="Telephone No"
                          disabled={disabled}
                          onChange={getValue}
                        />
                      </div>
                      <label
                        for="fax_no"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Fax No
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="text"
                          className="form-control"
                          name="fax_no"
                          id="fax_no"
                          defaultValue={queryCorpData.FAX_NO}
                          placeholder="Fax No"
                          disabled={disabled}
                          onChange={getValue}
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="mobile_no"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Mobile No
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="text"
                          className="form-control"
                          name="corp_mobile_no"
                          id="corp_mobile_no"
                          defaultValue={queryCorpData.MOBILE_NO}
                          placeholder="Mobile No"
                          disabled={disabled}
                          onChange={getValue}
                          onInput={toInputUppercase}
                        />
                      </div>
                      <label
                        for="Postal_address"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Postal Add
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={queryCorpData.POSTAL_ADD}
                          name="postal_add"
                          id="postal_add"
                          placeholder="Postal Address"
                          disabled={disabled}
                          onChange={getValue}
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="town"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Town
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <select
                          className="form-control"
                          value={queryCorpData.CODE}
                          name="town"
                          id="town"
                          disabled={disabled}
                          onChange={getValue}
                        >
                          <option value="" disabled selected>
                            Select Town
                          </option>
                          {towns.map((town) => {
                            const { CODE, NAME } = town;
                            return (
                              <option key={CODE} value={CODE}>
                                {NAME}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <label
                        for="email"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Email
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={queryCorpData.EMAIL}
                          name="corp_email"
                          id="corp_email"
                          placeholder="johndoe@gmail.com"
                          onChange={getValue}
                          disabled={disabled}
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="physical_location"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Physical Loc
                        <span className="required"></span>
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={queryCorpData.PHY_LOC}
                          name="phy_loc"
                          id="phy_loc"
                          placeholder="Physical Location"
                          disabled={disabled}
                          onChange={getValue}
                          onInput={toInputUppercase}
                        />
                      </div>
                      <label
                        for="class"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Class
                        <span className="required"></span>
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <select
                          className="form-control"
                          name="class"
                          id="class"
                          value={queryCorpData.individual}
                          disabled={disabled}
                          defaultValue="0"
                        >
                          <option disabled value="0">
                            Select Client Type
                          </option>
                          {clientTypes.map((dt) => {
                            return (
                              <option value={dt.code}>{dt.client_type}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                        for="agent"
                      >
                        Agent
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-10 col-sm-10 ">
                        <select
                          className="form-control"
                          value={queryCorpData.AGENT_ID}
                          name="agent_id"
                          id="agent_id"
                          onChange={getValue}
                          required="true"
                          disabled={disabled}
                        >
                          <option value=""> Select Agent </option>
                          {agents.map((agent) => {
                            return (
                              <option value={agent.AGENT_ID}>
                                {agent.AGENT_NAME}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="user"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        User<span className="required"></span>
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="text"
                          value={localStorage.getItem("username")}
                          className="form-control"
                          name="user"
                          id="user"
                          placeholder="Select User"
                          disabled={disabled}
                          onInput={toInputUppercase}
                        />
                      </div>
                      <label
                        for="date entered"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Date Entered
                        <span className="required"></span>
                      </label>
                      <div className="col-md-4 col-sm-4">
                        <input
                          type="date"
                          className="form-control"
                          defaultValue={queryCorpData.date_entered}
                          name="date_entered"
                          id="date_entered"
                          placeholder="Date Entered"
                          disabled={disabled}
                          onChange={getValue}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/*Corporate Activation Row*/}
                  <table
                    className="table"
                    cellspacing="0"
                    id="query_corp_cover_dates_table"
                  >
                    <thead>
                      <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Renewal Date</th>
                        <th>Intermediary</th>
                        <th>Anniv</th>
                        <th>Smart</th>
                      </tr>
                    </thead>
                    <tbody>
                      {corpAnnivs.map((data) => {
                        return (
                          <tr>
                            <td>
                              <input
                                type="date"
                                className="form-control"
                                defaultValue={data.start_date}
                                name="start_date[]"
                                id="start_date"
                                placeholder="Start Date"
                                aria-required="true"
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control"
                                defaultValue={data.end_date}
                                name="end_date[]"
                                id="end_date"
                                placeholder="End Date"
                                aria-required="true"
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control"
                                defaultValue={data.renewal_date}
                                name="renewal_date[]"
                                id="renewal_date"
                                placeholder="Renewal Date"
                                aria-required="true"
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                defaultValue={data.agent_id}
                                name="intermediary[]"
                                id="intermediary"
                                style={{ width: "300px" }}
                                onChange={getValue}
                              >
                                <option value={data.agent_id}>
                                  {data.agent_name}
                                </option>
                                {agent.map((data2) => {
                                  return (
                                    <option value={data2.AGENT_ID}>
                                      {data2.AGENT_NAME}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <input
                                id="anniv"
                                className="form-control"
                                type="number"
                                name="anniv[]"
                                placeholder="Anniv"
                                defaultValue={data.anniv}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                className="form-control smart"
                                type="checkbox"
                                id="smart_sync"
                                value="1"
                                checked={data.smart_sync == 1 ? true : false}
                                readOnly
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Next button */}
                  <input
                    id="invoice_button_next"
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    value="Next"
                  />
                </fieldset>
                {/* Contact person row */}
                <fieldset>
                  <h2 className="fs-title">Contact Person</h2>
                  <hr />
                  <div className="row col-md-12 col-sm-12 mb-2">
                    <button
                      onClick={addContactPersonRow}
                      className="btn btn-info col-md-2 ml-auto"
                      id="add_contact_person_btn"
                      type="button"
                      style={{
                        float: "right",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      Add Contact Person
                    </button>
                  </div>
                  <table
                    className="table"
                    cellspacing="0"
                    id="query_contact_person_table"
                  >
                    <thead>
                      <tr>
                        <th> Title</th>
                        <th>Surname</th>
                        <th>First Name</th>
                        <th>Other Names</th>
                        <th>Job Title</th>
                        <th>Mobile No</th>
                        <th>Tel No</th>
                        <th>Email</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {corpContactPerson.map((data) => {
                        return (
                          <tr>
                            <td>
                              <select
                                className="form-control"
                                defaultValue={data.CODE}
                                name="title[]"
                                id="title"
                                onChange={getValue}
                              >
                                <option value={data.CODE}>{data.TITLE}</option>
                                {title.map((data2) => {
                                  const { CODE, TITLE } = data2;
                                  return (
                                    <option key={CODE} value={CODE}>
                                      {TITLE}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <input
                                id="surname"
                                className="form-control"
                                type="text"
                                name="surname[]"
                                placeholder="Surname"
                                defaultValue={data.SURNAME}
                                onChange={getValue}
                                onInput={toInputUppercase}
                              />
                            </td>
                            <td>
                              <input
                                id="first_name"
                                className="form-control"
                                type="text"
                                name="first_name[]"
                                placeholder="First Name"
                                defaultValue={data.FIRST_NAME}
                                onChange={getValue}
                                onInput={toInputUppercase}
                              />
                            </td>
                            <td>
                              <input
                                id="other_names"
                                className="form-control"
                                type="text"
                                name="other_names[]"
                                placeholder="Other Names"
                                defaultValue={data.OTHER_NAME}
                                onChange={getValue}
                                onInput={toInputUppercase}
                              />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                defaultValue={data.JOB_TITLE}
                                name="contact_relation[]"
                                id="contact_relation"
                                style={{ width: "200px" }}
                                onChange={getValue}
                              >
                                <option value={data.JOB_TITLE}>
                                  {data.RELATION}
                                </option>
                                {contact_relation.map((data3) => {
                                  const { CODE, RELATION } = data3;
                                  return (
                                    <option key={CODE} value={CODE}>
                                      {RELATION}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <input
                                id="contact_mobile_no"
                                className="form-control"
                                type="text"
                                name="contact_mobile_no[]"
                                placeholder="Mobile No"
                                defaultValue={data.MOBILE_NO}
                                onChange={getValue}
                                onInput={toInputUppercase}
                              />
                            </td>
                            <td>
                              <input
                                id="contact_tel_no"
                                className="form-control"
                                type="text"
                                name="contact_tel_no[]"
                                placeholder="Telephone No"
                                defaultValue={data.TEL_NO}
                                onChange={getValue}
                                onInput={toInputUppercase}
                              />
                            </td>
                            <td>
                              <input
                                id="contact_email"
                                className="form-control"
                                type="text"
                                name="contact_email[]"
                                placeholder="johndoe@gmail.com"
                                defaultValue={data.EMAIL}
                                onChange={getValue}
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {/*This appends additional row giving each an id*/}
                      {newContactPersonRow.map((newRow) => {
                        {
                          return <tr key={newRow.id}>{newRow.new}</tr>;
                        }
                      })}
                    </tbody>
                  </table>

                  <hr />

                  {/* Previous button */}
                  <input
                    type="button"
                    name="previous"
                    id="query_previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    value="Previous"
                  />
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    value="Next"
                  />
                </fieldset>

                <fieldset>
                  <h2 className="fs-title">Regulations</h2>
                  <hr />
                  <table className="table" cellspacing="0" id="admin_fee_table">
                    <thead>
                      <tr>
                        <th>Anniv</th>
                        <th>Admin Fee Type</th>
                        <th>Admin Fee Rate</th>
                        <th>Upfront Copay (ugx)</th>
                        <th>Agent commis Rate (%)</th>
                        <th>Commis Whtax Rate (%)</th>
                        <th>Unit Manager Rate (%)</th>
                        <th>Bdm Rate (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminFees.map((data) => {
                        return (
                          <tr>
                            <td>
                              <input
                                id="anniv"
                                className="form-control"
                                type="number"
                                name="anniv[]"
                                placeholder="Anniv"
                                value={data.anniv}
                              />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                name="admin_fee_type[]"
                                id="admin_fee_type"
                                defaultValue={data.code}
                                onChange={getValue}
                              >
                                <option value={data.code}>
                                  {data.admin_fee_type}
                                </option>
                                {adminFeeTypes.map((adminFeeType) => {
                                  const { code, admin_fee_type } = adminFeeType;
                                  return (
                                    <option key={code} value={code}>
                                      {admin_fee_type}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <input
                                id="admin_fee_rate"
                                className="form-control"
                                type="number"
                                name="admin_fee_rate[]"
                                placeholder="Admin Fee Rate"
                                defaultValue={data.admin_fee_rate}
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                id="upfront_copay"
                                className="form-control"
                                type="number"
                                name="upfront_copay[]"
                                placeholder="Upfront Copay"
                                defaultValue={data.upfront_copay}
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                id="agent_commis_rate"
                                className="form-control"
                                type="number"
                                name="agent_commis_rate[]"
                                placeholder="Agent Commis Rate"
                                defaultValue={data.agent_commis_rate}
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                id="commis_whtax_rate"
                                className="form-control"
                                type="number"
                                name="commis_whtax_rate[]"
                                placeholder="Commis Whtax Rate"
                                defaultValue={data.commis_whtax_rate}
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                id="unit_manager_rate"
                                className="form-control"
                                type="number"
                                name="unit_manager_rate[]"
                                placeholder="Unit Manager Rate"
                                defaultValue={data.unit_manager_rate}
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                id="bdm_rate"
                                className="form-control"
                                type="number"
                                name="bdm_rate[]"
                                placeholder="Bdm Rate"
                                defaultValue={data.bdm_rate}
                                onChange={getValue}
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
                    value="Previous"
                  />
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    value="Next"
                  />
                </fieldset>

                <fieldset>
                  <h2 className="fs-title">Benefits</h2>
                  <hr />
                  <div style={{ display: "flex" }}>
                    <button
                      type="button"
                      id="btnAppendBenefit"
                      onClick={chooseHealthPlan}
                      className="btn btn-success form-control col-2"
                      style={{ marginBottom: "10px" }}
                      disabled={disabledStatus}
                    >
                      Add Benefits
                    </button>
                    {/* <button
                      type="button"
                      id="btnAppendBenefit"
                      onClick={() => {
                        setcorpGroups([]);
                        setNewBenefit([]);
                      }}
                      className="btn btn-danger form-control col-2"
                      style={{ marginBottom: "10px", marginLeft: "5px" }}
                      disabled={disabledStatus}
                    >
                      Remove Benefits
                    </button> */}
                  </div>
                  <table
                    className="table table"
                    cellspacing="0"
                    id="benefits_table"
                    style={{ height: "500px" }}
                  >
                    <thead>
                      <tr>
                        <th hidden>Idx</th>
                        <th>Anniv</th>
                        <th>Health Plan</th>
                        <th>Option</th>
                        <th>Benefit</th>
                        <th>Sublimit Of</th>
                        <th>Limit</th>
                        <th>Sharing</th>
                        <th>Fund</th>
                        <th>Capitated</th>
                        <th>Quantity</th>
                        <th>Waiting Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {corpGroups.map((data) => {
                        return (
                          <tr key={data.idx}>
                            <td hidden>
                              <input
                                id="idx"
                                className="form-control"
                                type="number"
                                name="idx[]"
                                value={data.idx}
                              />
                            </td>
                            <td>
                              <input
                                id="corporate_anniv"
                                className="form-control"
                                type="number"
                                name="anniv[]"
                                placeholder="Anniv"
                                value={data.anniv}
                              />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                defaultValue={data.category}
                                name="health_plan[]"
                                onChange={getValue}
                              >
                                <option value={data.category}>
                                  {data.category}
                                </option>
                                {healthPlan.map((data2) => {
                                  const { category } = data2;
                                  return (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-control"
                                defaultValue={data.code}
                                name="product_name[]"
                                style={{ width: "200px" }}
                                onChange={getValue}
                              >
                                <option value={data.code}>
                                  {data.product_name}
                                </option>
                                {productName.map((data3) => {
                                  const { code, product_name } = data3;
                                  return (
                                    <option key={code} value={code}>
                                      {product_name}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-control"
                                defaultValue={data.CODE}
                                id="benefit"
                                name="benefit[]"
                                style={{ width: "300px" }}
                                onChange={getValue}
                              >
                                <option value={data.CODE}>
                                  {data.BENEFIT}
                                </option>
                                {benefit.map((data4) => {
                                  const { CODE, BENEFIT } = data4;
                                  return (
                                    <option key={CODE} value={CODE}>
                                      {BENEFIT}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-control"
                                value={data.sub_limit_of}
                                id="sub_limit_of"
                                name="sub_limit_of[]"
                                style={{ width: "300px" }}
                                onChange={getValue}
                              >
                                {benefit.map((data5) => {
                                  const { CODE, BENEFIT } = data5;
                                  return (
                                    <option key={CODE} value={CODE}>
                                      {BENEFIT}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                id="limit"
                                name="limit[]"
                                min="0"
                                style={{ width: "150px" }}
                                defaultValue={
                                  data.limit !== null ? data.limit : ""
                                }
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <select
                                className="form-control"
                                defaultValue={data.CODE}
                                id="sharing"
                                name="sharing[]"
                                style={{ width: "150px" }}
                                onChange={getValue}
                              >
                                <option value={data.CODE}>
                                  {data.SHARING}
                                </option>
                                {sharing.map((data6) => {
                                  const { CODE, SHARING } = data6;
                                  return (
                                    <option key={CODE} value={CODE}>
                                      {SHARING}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td>
                              <input
                                className="form-control fund"
                                type="checkbox"
                                id="fund"
                                defaultChecked={
                                  data.fund === "1" ? "checked" : ""
                                }
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control capitated"
                                type="checkbox"
                                id="capitated"
                                defaultChecked={
                                  data.capitated === "1" ? "checked" : ""
                                }
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                defaultValue={
                                  data.quantity !== null ? data.quantity : ""
                                }
                                type="text"
                                id="quantity"
                                name="quantity[]"
                                onChange={getValue}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                defaultValue={
                                  data.waiting_period !== null
                                    ? data.waiting_period
                                    : ""
                                }
                                type="text"
                                name="waiting_period[]"
                                onChange={getValue}
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {/*Add new benefit row here down */}
                      {newBenefit.map((benefit) => {
                        return <>{benefit}</>;
                      })}
                    </tbody>
                  </table>

                  {/* Previous button */}
                  <input
                    type="button"
                    name="previous"
                    id="query_previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    value="Previous"
                  />
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button btn-success col-md-4 ml-auto"
                    value="Next"
                  />
                </fieldset>

                <fieldset>
                  <h2 className="fs-title">Provider</h2>
                  <hr />
                  <div
                    className="table-responsive col-md-12"
                    style={{ height: "500px" }}
                  >
                    <table
                      className="table mx-auto"
                      cellspacing="0"
                      id="provider_table"
                    >
                      <thead>
                        <tr>
                          <th hidden>code</th>
                          <th>Provider</th>
                          <th>Copay Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {corpProvider.map((data) => {
                          return (
                            <tr>
                              <td hidden>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="provider_code[]"
                                  value={data.provider_code}
                                />
                              </td>
                              <td>
                                <input
                                  id="provider"
                                  className="form-control"
                                  type="text"
                                  name="provider[]"
                                  placeholder="Provider"
                                  value={data.provider}
                                />
                              </td>
                              <td>
                                <input
                                  id="copay_amt"
                                  className="form-control"
                                  type="text"
                                  name="copay_amt[]"
                                  placeholder="00.00"
                                  value={data.copay_amt}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <hr />

                  {/* Previous button */}
                  <input
                    type="button"
                    name="previous"
                    id="query_previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    value="Previous"
                  />
                  {/* Save button */}
                  <input
                    type="submit"
                    className="action-button btn-success col-md-4 ml-auto"
                    value="Update"
                    hidden={visibleState.updatebtn}
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
            {response}
          </span>
        }
        background={
          response.length > 0
            ? response[0].includes("Error")
              ? "#d9534f"
              : "#105878"
            : ""
        }
      />
      <Modal3
        modalIsOpen={modal3IsOpen}
        closeModal={closeModal3}
        header={<p className="alert alert-secondary">Choose Product</p>}
        body={
          <form onSubmit={validateIfProductsExist}>
            <select
              className="form-control"
              name="health_plan"
              defaultValue="0"
              id="health_plan"
              onChange={(e) => setChoosenHealthPlan(e.target.value)}
            >
              <option disabled value="0">
                Select Healthplan
              </option>
              {healthPlan.length !== 0
                ? healthPlan.map((dt) => {
                    return <option value={dt.category}>{dt.category}</option>;
                  })
                : ""}
            </select>
            <select
              className="form-control"
              name="options"
              defaultValue="0"
              id="product_name"
              onChange={(e) => setChoosenProductName(e.target.value)}
            >
              <option disabled value="0">
                Select product name
              </option>
              {modalProductNames.map((dt) => {
                return <option value={dt.code}>{dt.product_name}</option>;
              })}
            </select>
            <input
              type="submit"
              value="submit"
              className="btn btn-info form-control"
            />
            <p className="text-danger h4 font-weight-bold">{exists}</p>
          </form>
        }
      />
    </div>
  );
};

export default QueryCorporate;
