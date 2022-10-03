import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  getTwoData,
  postData,
} from "../../components/helpers/Data";
import ImportScript from "../../components/helpers/ImportScripts";
import FormatDate from "../../components/helpers/FormatDate";
import { Spinner } from "../../components/helpers/Spinner";
import CustomModal from "../../components/helpers/Modal";
import Modal2 from "../../components/helpers/Modal2";
import Modal from "../../components/helpers/Modal";
import Modal3 from "../../components/helpers/Modal3";
import AccessLogs from "../../components/helpers/AccessLogs";
import Modal5 from "../../components/helpers/Modal5";
import XLSX from "xlsx";

const AddCorporate = (props) => {
  //save access log
  useEffect(() => {
    const frmData = new FormData();
    frmData.append("username", localStorage.getItem("username"));
    frmData.append("accessed", 1);
    AccessLogs(frmData);
  }, []);
  //module variables
  ImportScript("/dist/js/claims_stepwise_forms.js");
  const [agents, setAgents] = useState([]);
  const [towns, setTowns] = useState([]);
  const [titles, setTitles] = useState([]);
  const [contactRelations, setContactRelations] = useState([]);
  const [adminFeeTypes, setAdminFeeTypes] = useState([]);
  const [healthPlan, setHealthPlan] = useState([]);
  const [products, setProducts] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [sharing, setSharing] = useState([]);
  const [providers, setProviders] = useState([]);
  const [newContactPersonRow, setNewContactPersonRow] = useState([]);
  const [newAdminFeeRegulationTypeRow, setNewAdminFeeRegulationType] = useState(
    []
  );
  const [newBenefitRow, setNewBenefitRow] = useState([]);
  const [newProviderRow, setNewProviderRow] = useState([]);
  const [fetchedBenefits, setFetchedBenefits] = useState([]);
  const [modalIsOpen, setModalState] = useState(false);
  const [modal3IsOpen, setModal3IsOpen] = useState(false);
  const [message, setMessage] = useState([]);
  const [successModal, setSuccessModal] = useState(false);
  const [importedProviders, setImportedProviders] = useState([]);
  const [newRenewDate, setNewRenewDate] = useState("");
  const [hidden, setHidden] = useState({ import_providers_input: true });
   const [exists, setExists] = useState("");


  //fetching agents
  useEffect(() => {
    getData("fetch_agents")
      .then((data) => {
        setAgents(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //fetching towns
  useEffect(() => {
    getData("fetch_agents")
      .then((data) => {
        setTowns(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //fetching contact person titles
  useEffect(() => {
    getData("fetch_titles")
      .then((data) => {
        setTitles(data);
      })
      .catch((error) => {
        console.log(error);
      });
    //fetching contact relations
    getData("fetch_contact_relations")
      .then((data) => {
        setContactRelations(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //fetching admin fee type
  useEffect(() => {
    getData("fetch_all_admin_fee_types")
      .then((data) => {
        setAdminFeeTypes(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //fetching categories/health plan
  useEffect(() => {
    getData("fetch_categories")
      .then((data) => {
        setHealthPlan(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //fetching product names
  useEffect(() => {
    getData("fetch_products")
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //fetching benefits
  useEffect(() => {
    getData("fetch_benefits")
      .then((data) => {
        setBenefits(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //fetch sharing
  useEffect(() => {
    getData("fetch_sharing")
      .then((data) => {
        setSharing(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //fetch all providers
  useEffect(() => {
    getData("fetch_providers")
      .then((data) => {
        setProviders(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //modal return messages ... div props

  //populate intermediary in corp-anniversary from one selected in agent dropdown
  const setUnderwriter = () => {
    const selected_agent = document.getElementById("agent_id").value;
    console.log(selected_agent);
    //fill in corp anniversary table
    document.getElementById("intermediary").value = selected_agent;
  };
  //populate cover dates.. autofill
  const coverDates = (date) => {
    //get input date and add 1 yr
    let new_date = new Date(date.target.value);
    new_date.setFullYear(new_date.getFullYear() + 1);
    new_date.setDate(new_date.getDate() - 1);

    let new_renew_date = new Date(date.target.value);
    new_renew_date.setFullYear(new_renew_date.getFullYear() + 1);

    //inject new date to renewal date and end date
    var renewal_date = document.getElementById("renewal_date");
    var end_date = document.getElementById("end_date");
    //modified by jamo to check max end date
    setNewRenewDate(FormatDate(new_date));

    end_date.value = FormatDate(new_date);
    renewal_date.value = FormatDate(new_renew_date);
  };
  //populate end date from renewal dates
  const renewalCoverDates = (date) => {
    //get input date and add 1 yr
    let new_date = new Date(date.target.value);
    new_date.setDate(new_date.getDate() + 1);

    //inject new date to renewal date and end date
    var renewal_date = document.getElementById("renewal_date");

    renewal_date.value = FormatDate(new_date);
  };
  //function to add another contact person row
  const addContactPersonRow = () => {
    const contactPersonRow = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <select
              className="form-control"
              name="corp_contact_person_title[]"
              id="corp_contact_person_title"
            >
              <option value={""} disabled selected>
                Select Title
              </option>
              {titles.map((title) => {
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
              id="corp_contact_person_surname"
              className="form-control col"
              type="text"
              name="corp_contact_person_surname[]"
              placeholder="Surname"
              onInput={toInputUppercase}
            />
          </td>
          <td>
            <input
              id="corp_contact_person_first_name"
              className="form-control col"
              type="text"
              name="corp_contact_person_first_name[]"
              placeholder="First Name"
              onInput={toInputUppercase}
            />
          </td>
          <td>
            <input
              id="corp_contact_person_other_names"
              className="form-control col"
              type="text"
              name="corp_contact_person_other_names[]"
              placeholder="Other Names"
              onInput={toInputUppercase}
            />
          </td>
          <td>
            <select
              className="form-control"
              name="corp_contact_person_relation[]"
              id="corp_contact_person_relation"
            >
              <option value={""} disabled selected>
                Select Job Title
              </option>
              {contactRelations.map((contact_relation) => {
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
              id="corp_contact_person_mobile_no"
              className="form-control col"
              type="tel"
              name="corp_contact_person_mobile_no[]"
              placeholder="Mobile No"
            />
          </td>
          <td>
            <input
              id="corp_contact_person_tel_no"
              className="form-control col"
              type="tel"
              name="corp_contact_person_tel_no[]"
              placeholder="Telephone No"
              onInput="this.value = this.value.toUpperCase()"
            />
          </td>
          <td>
            <input
              id="corp_contact_person_email"
              className="form-control col"
              type="text"
              name="corp_contact_person_email[]"
              placeholder="johndoe@gmail.com"
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              type={"button"}
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
  //function to add another corp fee regulation row
  const addAdminFeeRegulationRow = () => {
    const adminFeeRegulationTypeRow = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input
              className="form-control col text-center"
              type="number"
              name="corp_admin_fee_reg_anniv[]"
              id="corp_admin_fee_reg_anniv"
              value={"1"}
              placeholder="Anniv"
              disabled="true"
            />
          </td>
          <td>
            <select
              className="form-control"
              name="corp_admin_fee_reg_admin_fee_type[]"
              id="corp_admin_fee_reg_admin_fee_type"
            >
              <option value="" disabled selected>
                Select Admin Fee Type
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
              className="form-control col"
              type="number"
              name="corp_admin_fee_reg_admin_fee_rate[]"
              id="corp_admin_fee_reg_admin_fee_rate"
              placeholder="00.00%"
            />
          </td>
          <td>
            <input
              className="form-control col"
              type="number"
              name="corp_admin_fee_reg_upfront_copay[]"
              id="corp_admin_fee_reg_upfront_copay"
              placeholder="00.00%"
            />
          </td>
          <td>
            <input
              className="form-control col"
              type="number"
              name="corp_admin_fee_reg_agent_commis_rate[]"
              id="corp_admin_fee_reg_agent_commis_rate"
              placeholder="00.00%"
            />
          </td>
          <td>
            <input
              className="form-control col"
              type="number"
              name="corp_admin_fee_reg_commis_whtax_rate[]"
              id="corp_admin_fee_reg_commis_whtax_rate"
              placeholder="00.00"
            />
          </td>
          <td>
            <input
              className="form-control col"
              type="number"
              name="corp_admin_fee_reg_unit_manager_rate[]"
              id="corp_admin_fee_reg_unit_manager_rate"
              placeholder="00.00"
            />
          </td>
          <td>
            <input
              className="form-control col"
              type="number"
              name="corp_admin_fee_reg_bdm_rate[]"
              id="corp_admin_fee_reg_bdm_rate"
              placeholder="00.00"
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              type={"button"}
              onClick={(e) =>
                removeCorpAdminFeeRegulationTypeRow(
                  adminFeeRegulationTypeRow.id,
                  e
                )
              }
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };
    setNewAdminFeeRegulationType((newAdminFeeRegulationTypeRow) => {
      return [...newAdminFeeRegulationTypeRow, adminFeeRegulationTypeRow];
    });
    //remove corp admin fee regulation type
    const removeCorpAdminFeeRegulationTypeRow = (id, e) => {
      e.preventDefault();
      setNewAdminFeeRegulationType((newAdminFeeRegulationTypeRow) => {
        return newAdminFeeRegulationTypeRow.filter((row) => row.id !== id);
      });
    };
  };
  //function to add benefit rows
  const addBenefitRow = async (e) => {
    e.preventDefault();
    setModal3IsOpen(true);
  };
  //function to add provider row
  const addProviderRow = () => {
    setHidden({ import_providers_input: true });
    const addedProviderRow = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input
              className="form-control text-center"
              type="number"
              name="anniv[]"
              id="anniv"
              disabled="true"
              value={"1"}
            />
          </td>
          <td>
            <select className="form-control" name="provider[]" id="provider">
              <option value="" disabled selected>
                Select Provider
              </option>
              {providers.map((provider) => {
                const { CODE, PROVIDER } = provider;
                return (
                  <option key={CODE} value={CODE}>
                    {PROVIDER}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <input
              className="form-control col"
              type="text"
              name="copay_amount[]"
              id="copay_amount"
              placeholder=""
              pattern="\d*"
              maxlength="5"
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              type={"button"}
              onClick={(e) => removeProviderRow(addedProviderRow.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };
    setNewProviderRow((newProviderRow) => {
      return [...newProviderRow, addedProviderRow];
    });
    //remove selected row
    const removeProviderRow = (id, e) => {
      e.preventDefault();
      setNewProviderRow((newProviderRow) => {
        return newProviderRow.filter((row) => row.id !== id);
      });
    };
  };
  //import provider
  const importProviders = (e) => {
    e.preventDefault();
    setHidden({ import_providers_input: false });
  };
  //import excel workbook
  const readExcel = (file) => {
    //clear table
    setImportedProviders([]);
    //start loader
    document.getElementById("spinner").style.display = "block";
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      if (file) {
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
          const bufferArray = e.target.result;

          const wb = XLSX.read(bufferArray, {
            type: "buffer",
            cellDates: false,
            cellNF: false,
            cellText: false,
          });

          const wsname = wb.SheetNames[0];

          //get column names and validate
          const workbookHeaders = XLSX.read(bufferArray, {
            sheetRows: 1,
          });
          const columns = XLSX.utils.sheet_to_json(
            workbookHeaders.Sheets[wsname],
            { header: 1 }
          )[0];
          if (columns[1] === "provider" && columns[2] === "copay_amount") {
            const ws = wb.Sheets[wsname];

            const data = XLSX.utils.sheet_to_json(ws, {
              raw: false,
              dateNF: "YYYY-MM-DD",
            });
            resolve(data);
          } else {
            resolve([]);
          }
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        document.getElementById("spinner").style.display = "none";
      }
    });
    promise.then((dt) => {
      if (dt.length !== 0) {
        console.log(dt);
        document.getElementById("spinner").style.display = "none";
        setImportedProviders(dt);
        //setButtonHidden({ ...buttonHidden,extraRow:false, generate: false });
      } else {
        document.getElementById("spinner").style.display = "none";
        setMessage("Import columns not correct");
        setModalState(true);
      }
    });
  };
  //populate benefits based on product given
  const fetchProductBenefits = async (e) => {
    e.preventDefault();
    setModal3IsOpen(false);
    const errors = new Array();
    let product_name = document.getElementById("product_name").value;
    //check if health plan is selected
    let health_plan = document.getElementById("health_plan").value;
    if (health_plan == null && product_name == null) {
      const message = "Please Select Health Plan First";
      setMessage(message);
      setModalState(true);
    } else {
      const tbl = document.querySelector("#benefits_table tbody").children;
      //loop through table check if combination already entered
      for (let trs of tbl) {
        const ch_health_plan = trs.children[1].children[0].value;
        const ch_product_name = trs.children[2].children[0].value;
        console.log(ch_health_plan, ch_product_name);

        if (
          health_plan === ch_health_plan &&
          product_name === ch_product_name
        ) {
          errors.push("Error. Same Combination");
        }
      }
      if (errors.length > 0) {
        setMessage(
          "Notice ! Product Combination already selected for this Client."
        );
        setModalState(true);
      } else {
        //display loader
        document.getElementById("spinner").style.display = "block";
        //fetch data from api
        getTwoData("fetch_product_benefits", health_plan, product_name)
          .then((datum) => {
          //  return console.log(datum);
            const healthPlanDropDown = datum.health_plan.map((data) => {
              return (
                <option key={data.category} value={data.category}>
                  {data.category}
                </option>
              );
            });
            const productNameDropDown = datum.product_name.map((data) => {
              return (
                <option key={data.code} value={data.code}>
                  {data.product_name}
                </option>
              );
            });
            const benefitDropDown = datum.benefit.map((data) => {
              return (
                <option key={data.code} value={data.code}>
                  {data.benefit}
                </option>
              );
            });
            const sharingDropDown = datum.sharing.map((data) => {
              return (
                <option key={data.CODE} value={data.CODE}>
                  {data.SHARING}
                </option>
              );
            });
            //benefits loaded and to be placed in table
            if (datum.fetched_benefits.length <= 0) {
              const message = "Notice ! No products for the combination";
              setMessage(message);
              setModalState(true);
            } else {
              const rowData = datum.fetched_benefits.map((data) => {
                return (
                  <>
                    <tr key={data.id}>
                      <td>
                        <input
                          className="form-control col text-center"
                          type="number"
                          name="anniv[]"
                          id="anniv"
                          value={"1"}
                          placeholder=""
                          disabled="true"
                          readOnly
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          defaultValue={data.health_plan}
                          type="text"
                          name="health_plan[]"
                          // onChange={getValue}
                          style={{ width: "200px" }}
                        >
                          <option value={data.health_plan}>
                            {data.health_plan}
                          </option>
                          {healthPlanDropDown}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          defaultValue={data.product_code}
                          type="text"
                          name="product_name[]"
                          style={{ width: "200px" }}
                          // onChange={getValue}
                        >
                          <option value={data.product_code}>
                            {data.product_name}
                          </option>
                          {productNameDropDown}
                        </select>
                      </td>
                      <td>
                        <select
                          defaultValue={data.benefit_code}
                          className="form-control"
                          type="text"
                          name="benefit[]"
                          style={{ width: "400px" }}
                          // onChange={getValue}
                        >
                          <option value={data.benefit_code}>
                            {data.benefit}
                          </option>
                          {benefitDropDown}
                        </select>
                      </td>
                      <td>
                        <select
                          defaultValue={data.sub_limit_of_code}
                          className="form-control"
                          type="text"
                          name="sub_limit_of[]"
                          style={{ width: "400px" }}
                        >
                          <option value={data.sub_limit_of_code}>
                            {data.sub_limit_of}
                          </option>
                          {benefitDropDown}
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="number"
                          name="limit[]"
                          style={{ width: "200px" }}
                          defaultValue={data.limit !== null ? data.limit : ""}
                        />
                      </td>
                      <td>
                        <select
                          defaultValue={data.sharing_code}
                          className="form-control"
                          type="text"
                          name="sharing[]"
                          style={{ width: "300px" }}
                          // onChange={getValue}
                        >
                          <option value={data.sharing_code}>
                            {data.sharing}
                          </option>
                          {sharingDropDown}
                        </select>
                      </td>
                      <td>
                        <input
                          className="form-control checkbox-inline fund"
                          type="checkbox"
                          name="fund[]"
                          value={data.fund !== "1" ? "0" : "1"}
                          defaultChecked={data.fund === "1" ? "checked" : ""}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control checkbox-inline capitated"
                          type="checkbox"
                          name="capitated[]"
                          value={data.capitated !== "1" ? "0" : "1"}
                          defaultChecked={
                            data.capitated === "1" ? "checked" : ""
                          }
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          defaultValue={
                            data.quantity !== null ? data.quantity : ""
                          }
                          type="number"
                          name="quantity[]"
                        />
                      </td>
                      <td>
                        <input
                          id="waiting_period"
                          className="form-control col"
                          type="number"
                          name="waiting_period[]"
                          placeholder=""
                        />
                      </td>
                      <td>
                        <button
                          className="btn text-danger"
                          type={"button"}
                          onClick={(e) => removeBenefitRow(rowData.id, e)}
                        >
                          <i className="fas fa-trash fa-lg"></i>
                        </button>
                      </td>
                    </tr>
                  </>
                );
              });
              const exBenefits = {
                id: new Date().getTime().toString(),
                new: <>{rowData}</>,
              };
              setFetchedBenefits((fetchedBenefits) => {
                return [...fetchedBenefits, exBenefits];
              });
            }
            //remove benefit row
            const removeBenefitRow = async (id, e) => {
              e.preventDefault();
              setFetchedBenefits((fetchedBenefits) => {
                return fetchedBenefits.filter((row) => row.id !== id);
              });
            };
            //stop loader
            document.getElementById("spinner").style.display = "none";
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
  //function to input uppercase
  const toInputUppercase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };
  //validate input fields
  const validateCorporateData = (e) => {
    e.preventDefault();
    const corporate = document.getElementById("corporate").value;
    const class_type = document.getElementById("class_type").value;
    const start_date = document.getElementById("start_date").value;
    const corp_contact_person_relation = document.getElementById(
      "corp_contact_person_relation"
    ).value;
    const provider = document.getElementById("provider").value;
    //errors array
    const errors = [];

    if (!corporate) {
      errors.push(
        <div className={"row ml-0"}>
          <h6 style={{ color: "red", marginTop: "10px", marginBottom: "10px" }}>
            Corporate Tab: Enter Corporate Name !
          </h6>
        </div>
      );
    }
    if (!class_type) {
      errors.push(
        <div className={"row ml-0"}>
          <h6 style={{ color: "red", marginTop: "10px", marginBottom: "10px" }}>
            Corporate Tab: Enter Class !
          </h6>
        </div>
      );
    }
    if (!start_date) {
      errors.push(
        <div className={"row ml-0"}>
          <h6 style={{ color: "red", marginTop: "10px", marginBottom: "10px" }}>
            Corporate Anniversary Tab: Enter Corp Anniversary Start Date !
          </h6>
        </div>
      );
    }
    if (!corp_contact_person_relation) {
      errors.push(
        <div className={"row ml-0"}>
          <h6 style={{ color: "red", marginTop: "10px", marginBottom: "10px" }}>
            Corporate Contact Person Tab: Enter Contact Person Relation !
          </h6>
        </div>
      );
    }
    if (!provider) {
      errors.push(
        <div className={"row ml-0"}>
          <h6 style={{ color: "red", marginTop: "10px", marginBottom: "10px" }}>
            Provider Tab: Enter provider !
          </h6>
        </div>
      );
    }
    console.log(errors);
    setMessage(errors);
    {
      message.map((data) => {
        return { data };
      });
    }
    //show error modal
    if (errors.length > 0) {
      setModalState(true);
    } else {
      saveAddCorporate();
    }
  };
  //save corporate data
  const saveAddCorporate = () => {
    const frmData = new FormData(document.getElementById("add_corp_form"));
    //if checkboxes are checked pass value = 1 to database
    const smartCheckbox = document.querySelectorAll(".smart");
    const fundCheckbox = document.querySelectorAll(".fund");
    const capitatedCheckbox = document.querySelectorAll(".capitated");
    console.log(frmData);
    smartCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("smart", "1");
      } else {
        frmData.append("smart", "0");
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
    //post data to db
    postData(frmData, "save_add_corporate_data")
      .then((data) => {
        console.log([data.message]);
        setMessage([data.message]);
        setSuccessModal(true);
      })
      .catch((error) => console.log(error));
  };
  const closeModal = (e) => {
    e.preventDefault();
    setModalState(false);
  };
  const closeSuccessModal = (e) => {
    e.preventDefault();
    setSuccessModal(false);
    window.location.reload();
  };
  const closeModal3 = () => {
    setModal3IsOpen(false);
  };
  return (
    <div>
      <section id={"tabs"} className={"project-tab"}>
        <div className="container">
          <form
            className="claims_form mt-1"
            id={"add_corp_form"}
            onSubmit={validateCorporateData}
          >
            {/*progressbar*/}
            <ul id={"progressbar"}>
              <li className="active">Corporate</li>
              <li>Contact Person</li>
              <li>Regulation</li>
              <li>Benefits</li>
              <li>Provider</li>
            </ul>
            {/*Corporate Tab*/}
            <fieldset>
              <div id="">
                <h2 className="fs-title">Corporate</h2>
                <hr />
              </div>
              <div className="row col-md-12" id="step-1">
                <div className="col-md-12">
                  <div className="form-group row ml-0">
                    <label
                      className="col-form-label col-md-2 col-sm-2 label-align text-center  pr-0 pl-0"
                      htmlFor="corp_id"
                    >
                      Corp ID:
                    </label>
                    <div className="col-md-4 col-sm-4 ">
                      <input
                        type="text"
                        className="form-control"
                        name="corp_id"
                        id="corp_id"
                        placeholder="Corporate ID"
                        readOnly
                      />
                    </div>
                    <label
                      className="col-form-label col-md-2 col-sm-2 label-align text-center  pr-0 pl-0"
                      htmlFor="corp_code"
                    >
                      Corp Code:
                    </label>
                    <div className="col-md-4 col-sm-4 ">
                      <input
                        type="text"
                        className="form-control"
                        name="corp_code"
                        id="corp_code"
                        onInput={toInputUppercase}
                        placeholder="Corp Code"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className={"form-group row ml-0"}>
                    <label
                      htmlFor="corporate"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center  pr-0 pl-0"
                    >
                      Corporate:
                      <span className="required">*</span>
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        id="corporate"
                        name="corporate"
                        placeholder="Corporate"
                        onInput={toInputUppercase}
                      />
                    </div>
                    <label
                      htmlFor="identity"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center  pr-0 pl-0"
                    >
                      Identity:
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        name="identity"
                        id="identity"
                        placeholder="Identity"
                        onInput={toInputUppercase}
                      />
                    </div>
                  </div>
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="tel_no"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                    >
                      Tel No:
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <input
                        type="tel"
                        className="form-control text-uppercase"
                        name="tel_no"
                        id="tel_no"
                        placeholder=" --- --- ---"
                      />
                    </div>
                    <label
                      htmlFor="fax_no"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                    >
                      Fax No:
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        name="fax_no"
                        id="fax_no"
                        placeholder="Fax No"
                        onInput={toInputUppercase}
                      />
                    </div>
                  </div>
                  <div className={"form-group row ml-0"}>
                    <label
                      htmlFor="mobile_no"
                      className="col-form-label col-md-2 col-sm-1 label-align text-center  pr-0 pl-0"
                    >
                      Mobile:
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <input
                        type="text"
                        className="form-control text-uppercase"
                        name="mobile_no"
                        id="mobile_no"
                        placeholder="+256 ..."
                      />
                    </div>
                    <label
                      htmlFor="postal_add"
                      className="col-form-label col-md-2 col-sm-1 label-align text-center  pr-0 pl-0"
                    >
                      Postal Add:
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        name="postal_add"
                        id="postal_add"
                        placeholder="Postal Add"
                        onInput={toInputUppercase}
                      />
                    </div>
                  </div>
                  <div className="form-group row ml-0">
                    <label
                      htmlFor="town"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center   pr-0 pl-0"
                    >
                      Town:
                      <span className="">*</span>
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <select
                        className="form-control"
                        name="town"
                        required=""
                        id="town"
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
                      htmlFor="email"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                    >
                      Email:
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        id="email"
                        placeholder="johndoe@gmail.com"
                      />
                    </div>
                  </div>
                  <div className={"row form-group ml-0"}>
                    <label
                      htmlFor="phy_loc"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center   pr-0 pl-0"
                    >
                      Phy Loc:
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        name="phy_loc"
                        id="phy_loc"
                        placeholder="Location"
                        onInput={toInputUppercase}
                      />
                    </div>
                    <label
                      htmlFor="class"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                    >
                      Class:
                      <span className="required">*</span>
                    </label>
                    <div className="col-md-4 col-sm-4">
                      <select
                        className="form-control"
                        name="class_type"
                        id="class_type"
                      >
                        <option value={""} disabled selected>
                          Select Class
                        </option>
                        <option value={"1"}>CORPORATE</option>
                        <option value={"2"}>INDIVIDUAL</option>
                        <option value={"3"}>SME</option>
                      </select>
                    </div>
                  </div>
                  <div className={"row form-group ml-0"}>
                    <label
                      htmlFor="agent"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center   pr-0 pl-0"
                    >
                      Agent:
                      <span className="required">*</span>
                    </label>
                    <div className="col-md-4 col-sm-4">
                      {/*Select class dropdown field from api */}
                      <select
                        className="form-control"
                        name="agent_id"
                        required="true"
                        onChange={setUnderwriter}
                        id="agent_id"
                      >
                        <option value={"0"}>Select Agent</option>
                        {agents.map((agent) => {
                          const { AGENT_ID, AGENT_NAME } = agent;
                          return (
                            <option key={AGENT_ID} value={AGENT_ID}>
                              {AGENT_NAME}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className={"row form-group ml-0"}>
                    <label
                      htmlFor="user"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center   pr-0 pl-0"
                    >
                      User:
                    </label>
                    <div className="col-md-4 col-sm-4">
                      {/*Select class dropdown field*/}
                      <input
                        type="text"
                        className="form-control text-uppercase"
                        name="user"
                        id="user"
                        value={localStorage.getItem("username")}
                        placeholder="User"
                        readOnly
                      />
                    </div>
                    <label
                      htmlFor="date_entered"
                      className="col-form-label col-md-2 col-sm-2 label-align text-center   pr-0 pl-0"
                    >
                      Date Entered:
                    </label>
                    <div className="col-md-4 col-sm-4">
                      {/*Select class dropdown field*/}
                      <input
                        type="date"
                        className="form-control"
                        name="date_entered"
                        id="date_entered"
                        placeholder="User"
                        max={"9999-12-31"}
                        maxLength={"4"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              {/*Corporate Activation Row*/}
              <div id="">
                <h2 className="fs-title">Cover Details</h2>
                <hr />
              </div>
              <div className={"row "}>
                <div className={"col-md-12"}>
                  <table className={"table"}>
                    <thead className={"thead-dark"}>
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
                      <tr>
                        <td>
                          <input
                            className="form-control col"
                            type="date"
                            name="start_date"
                            id="start_date"
                            maxLength={"4"}
                            max={"9999-12-31"}
                            onChange={coverDates}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control col"
                            type="date"
                            name="end_date"
                            id="end_date"
                            onChange={renewalCoverDates}
                            maxLength={"4"}
                            max={newRenewDate}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control col"
                            type="date"
                            name="renewal_date"
                            id="renewal_date"
                            maxLength={"4"}
                            max={"9999-12-31"}
                          />
                        </td>
                        <td>
                          {/*Select dropdown for agents*/}
                          <select
                            className={"form-control"}
                            id={"intermediary"}
                            name={""}
                            disabled
                            selected
                          >
                            <option disabled selected>
                              Select Underwriter
                            </option>
                            {agents.map((underwriter) => {
                              const { AGENT_ID, AGENT_NAME } = underwriter;
                              return (
                                <option key={AGENT_ID} value={AGENT_ID}>
                                  {AGENT_NAME}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td>
                          <input
                            className="form-control text-center"
                            type="number"
                            name="anniv"
                            id="anniv"
                            placeholder=""
                            readOnly
                            value={"1"}
                          />
                        </td>
                        <td>
                          {/*Checkbox for smart*/}
                          <input
                            className="form-control col smart"
                            type="checkbox"
                            name="smart"
                            id="smart"
                            placeholder=""
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/*Next button */}
              <input
                id="invoice_button_next"
                type="button"
                name="next"
                className="next action-button btn-success col-md-4 ml-auto"
                value="Next"
              />
            </fieldset>
            {/*Corp Contact Person*/}
            <fieldset>
              <h2 className="fs-title">Contact Person</h2>
              <hr />
              <div className="row col-md-12 col-sm-12 mb-2">
                <button
                  onClick={addContactPersonRow}
                  type={"button"}
                  className="btn btn-info col-md-2 ml-auto"
                  id="add_contact_person_btn"
                  style={{
                    float: "right",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  Add Contact Person
                </button>
              </div>
              <div className={"row col-md-12 m-0"}>
                <table
                  className="table"
                  cellSpacing="0"
                  id="contact_person_table"
                >
                  <thead className={"thead-dark"}>
                    <tr>
                      <th>Title</th>
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
                    <tr>
                      <td>
                        <select
                          className="form-control"
                          name="corp_contact_person_title[]"
                          id="corp_contact_person_title"
                        >
                          <option value="" disabled selected>
                            Select Title
                          </option>
                          {titles.map((title) => {
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
                          id="corp_contact_person_surname"
                          className="form-control col text-uppercase"
                          type="text"
                          name="corp_contact_person_surname[]"
                          placeholder="Surname"
                          onInput={toInputUppercase}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control col"
                          type="text"
                          name="corp_contact_person_first_name[]"
                          id="corp_contact_person_first_name"
                          placeholder="First Name"
                          onInput={toInputUppercase}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control col"
                          type="text"
                          name="corp_contact_person_other_names[]"
                          id="corp_contact_person_other_names"
                          placeholder="Other Names"
                          onInput={toInputUppercase}
                        />
                      </td>
                      <td>
                        <select
                          className="form-control"
                          name="corp_contact_person_relation[]"
                          id="corp_contact_person_relation"
                        >
                          <option value="" disabled selected>
                            Select Job Title
                          </option>
                          {contactRelations.map((contact_relation) => {
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
                          id="corp_contact_person_mobile_no"
                          className="form-control col text-uppercase"
                          type="tel"
                          name="corp_contact_person_mobile_no[]"
                          placeholder="+256 ..."
                        />
                      </td>
                      <td>
                        <input
                          id="corp_contact_person_tel_no"
                          className="form-control col text-uppercase"
                          type="tel"
                          name="corp_contact_person_tel_no[]"
                          placeholder="Telephone No"
                        />
                      </td>
                      <td>
                        <input
                          id="corp_contact_person_email"
                          className="form-control col"
                          type="text"
                          name="corp_contact_person_email[]"
                          placeholder="john@gmail.com"
                        />
                      </td>
                    </tr>
                    {/*This appends additional row giving each an id*/}
                    {newContactPersonRow.map((newRow) => {
                      {
                        return <tr key={newRow.id}>{newRow.new}</tr>;
                      }
                    })}
                  </tbody>
                </table>
              </div>
              <hr />
              {/*Previous button*/}
              <input
                type="button"
                name="previous"
                id="query_previous"
                className="previous action-button-previous col-md-4 btn-info"
                value="Previous"
              />
              {/*Next button*/}
              <input
                type="button"
                name="next"
                className="next action-button btn-success col-md-4 ml-auto"
                value="Next"
              />
            </fieldset>
          
                        {/*Corp Admin Fee Regulation*/}
                        <fieldset>
                            <h2 className="fs-title">Admin Fee Regulation</h2>
                            <hr/>
                            {/*<div className={"row col-md-12 mb-2"}>
                                <button className={"btn btn-md btn-info col-md-2 ml-auto"}
                                        id={"add_admin_fee_tye_btn"}
                                        type={"button"}
                                        onClick={addAdminFeeRegulationRow}
                                        style={{
                                            float: "right",
                                            color: "white",
                                            fontSize: "12px"
                                        }} disabled={disabled.admin_fee_type_btn}>
                                    Add Admin Fee Type
                                </button>
                            </div>*/}
              <table
                className="table"
                cellSpacing="0"
                id={"admin_fee_type_table"}
              >
                <thead className={"thead-dark"}>
                  <tr>
                    <th>Anniv</th>
                    <th>Admin Fee Type</th>
                    <th>Admin Fee Rate (%)</th>
                    <th>Upfront Copay (ugx)</th>
                    <th>Agent Commis Rate (%)</th>
                    <th>Commis Whtax Rate (%)</th>
                    <th>Unit Manager Rate</th>
                    <th>Bdm Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        className="form-control col text-center"
                        type="number"
                        name="corp_admin_fee_reg_anniv"
                        id="corp_admin_fee_reg_anniv"
                        value={"1"}
                        placeholder="Anniv"
                        disabled="true"
                      />
                    </td>
                    <td>
                      <select
                        className="form-control"
                        name="corp_admin_fee_reg_admin_fee_type"
                        id="corp_admin_fee_reg_admin_fee_type"
                      >
                        <option value="" disabled selected>
                          Select Admin Fee Type
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
                        className="form-control col"
                        type="number"
                        name="corp_admin_fee_reg_admin_fee_rate"
                        id="corp_admin_fee_reg_admin_fee_rate"
                        placeholder="00.00%"
                      />
                    </td>
                    <td>
                      <input
                        className="form-control col"
                        type="number"
                        name="corp_admin_fee_reg_upfront_copay"
                        id="corp_admin_fee_reg_upfront_copay"
                        placeholder="00.00%"
                      />
                    </td>
                    <td>
                      <input
                        className="form-control col"
                        type="number"
                        name="corp_admin_fee_reg_agent_commis_rate"
                        id="corp_admin_fee_reg_agent_commis_rate"
                        placeholder="00.00%"
                      />
                    </td>
                    <td>
                      <input
                        className="form-control col"
                        type="number"
                        name="corp_admin_fee_reg_commis_whtax_rate"
                        id="corp_admin_fee_reg_commis_whtax_rate"
                        placeholder="00.00"
                      />
                    </td>
                    <td>
                      <input
                        className="form-control col"
                        type="number"
                        name="corp_admin_fee_reg_unit_manager_rate"
                        id="corp_admin_fee_reg_unit_manager_rate"
                        placeholder="00.00"
                      />
                    </td>
                    <td>
                      <input
                        className="form-control col"
                        type="number"
                        name="corp_admin_fee_reg_bdm_rate"
                        id="corp_admin_fee_reg_bdm_rate"
                        placeholder="00.00"
                      />
                    </td>
                  </tr>
                  {/*Add new admin fee regulation row here down */}
                  {newAdminFeeRegulationTypeRow.map((newRow) => {
                    {
                      return <tr key={newRow.id}>{newRow.new}</tr>;
                    }
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
              {/*Next button */}
              <input
                type="button"
                name="next"
                className="next action-button btn-success col-md-4 ml-auto"
                value="Next"
              />
            </fieldset>
            {/*Corp Groups/Benefits*/}
            <fieldset>
              <h2 className="fs-title">Benefits</h2>
              <hr />
              <div className={"row col-md-12 mb-2"}>
                <button
                  className={"btn btn-md btn-info col-md-2 ml-auto"}
                  id={"add_admin_fee_tye_btn"}
                  type={"button"}
                  onClick={addBenefitRow}
                  style={{
                    float: "right",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  Add Benefit Row
                </button>
              </div>
              <div className={"row col-md-12 m-0"}>
                <table
                  className="table"
                  cellSpacing="0"
                  id="benefits_table"
                  style={{ maxHeight: "400px", overflow: "auto" }}
                >
                  <thead
                    style={{ position: "sticky", top: "0", zIndex: "2" }}
                    className={"thead-dark"}
                  >
                    <tr>
                      <th>Anniv</th>
                      <th>Health Plan</th>
                      <th>Option</th>
                      <th>Benefit</th>
                      <th>Sub Limit Of</th>
                      <th>Limit</th>
                      <th>Sharing</th>
                      <th>Fund</th>
                      <th>Capitated</th>
                      <th>Quantity</th>
                      <th>Waiting Period</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/*On select product name. populate with fetched benefits*/}
                    {fetchedBenefits.map((newFetchedBenefits) => {
                      return <>{newFetchedBenefits.new}</>;
                    })}
                    {/*Append new benefit row here */}
                    {/*{newBenefitRow.map((newRow) => {
                                        {
                                            return <tr key={newRow.id}>{newRow.new}</tr>
                                        }
                                    })}*/}
                  </tbody>
                </table>
              </div>

              {/*Previous button*/}
              <input
                type="button"
                name="previous"
                id="query_previous"
                className="previous action-button-previous col-md-4 btn-info"
                value="Previous"
              />
              {/*Next button */}
              <input
                type="button"
                name="next"
                className="next action-button btn-success col-md-4 ml-auto"
                value="Next"
              />
            </fieldset>
            {/*Corp Providers*/}
            <fieldset>
              <h2 className="fs-title">Provider</h2>
              <hr />
              <div className="row col-md-12 col-sm-12 mb-2 text-right">
                <button
                  onClick={addProviderRow}
                  type={"button"}
                  className="btn btn-info col-md-2 mr-2"
                  id="add_contact_person_btn"
                >
                  Add Provider
                </button>
                {/*<button type={"button"} className="btn btn-warning col-md-2 mr-2"
                                        onClick={importProviders}>
                                    Import Providers
                                </button>
                                <div className={"col-md-3"}>
                                    <input type="file" className="form-control"
                                           name="import_providers"
                                           id="import_providers" hidden={hidden.import_providers_input}
                                           placeholder="Choose File" aria-required="true" onChange={(e) => {
                                               const file = e.target.files[0];
                                               readExcel(file);
                                           }}
                                    />
                                </div>*/}
              </div>
              <div className={"row justify-content-center"}>
                <table className="table" cellSpacing="0" id="provider_table">
                  <thead className={"thead-dark"}>
                    <tr>
                      <th>Anniv</th>
                      <th>Provider</th>
                      <th>Copay Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedProviders.map((data) => {
                      return (
                        <tr>
                          <td>
                            <input
                              className={"form-control text-center"}
                              type={"number"}
                              name={"imported_anniv[]"}
                              value={"1"}
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              className={"form-control"}
                              type={"text"}
                              name={"imported_provider[]"}
                              value={data.provider}
                            />
                          </td>
                          <td>
                            <input
                              className={"form-control"}
                              type={"text"}
                              name={"imported_copay_amount[]"}
                              value={data.copay_amount}
                              pattern="\d*"
                              maxlength="5"
                            />
                          </td>
                        </tr>
                      );
                    })}
                    {newProviderRow.map((newRow) => {
                      {
                        return <tr key={newRow.id}>{newRow.new}</tr>;
                      }
                    })}
                  </tbody>
                </table>
              </div>
              <hr />
              {/*Previous button*/}
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
                value={"Save"}
              />
            </fieldset>
          </form>
          <Spinner />                
        </div>
      </section>
      <Modal3
        modalIsOpen={modal3IsOpen}
        closeModal={closeModal3}
        header={<p className="alert alert-secondary">Choose Product</p>}
        body={
          <form onSubmit={fetchProductBenefits}>
            <select
              className="form-control"
              name="health_plan"
              defaultValue="0"
              id="health_plan"
            >
              <option disabled value="0">
                Select Health Plan
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
            >
              <option disabled value="0">
                Select Product Name
              </option>
              {products.length !== 0
                ? products.map((dt) => {
                    return <option value={dt.code}>{dt.product_name}</option>;
                  })
                : ""}
            </select>
            <input
              type="submit"
              value="Submit"
              className="btn btn-info form-control"
            />
          </form>
        }
      />
      <Modal5
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        style={{ width: "50%" }}
        body={<h4 style={{ textDecorationColor: "forestgreen" }}>{message}</h4>}
        buttons={
          <div className="row pt-4 pb-4 pr-4 pl-4">
            <div className="col-md-12 text-center">
              <button className="btn btn-danger mt-3" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        }
      />
      <Modal5
        modalIsOpen={successModal}
        closeModal={closeSuccessModal}
        style={{ width: "50%" }}
        body={<h4 style={{ textDecorationColor: "forestgreen" }}>{message}</h4>}
        buttons={
          <div className="row pt-4 pb-4 pr-4 pl-4">
            <div className="col-md-12 text-center">
              <button
                className="btn btn-danger mt-3"
                onClick={closeSuccessModal}
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

export default AddCorporate;
