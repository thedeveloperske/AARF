import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  getTwoData,
  postData,
} from "../../components/helpers/Data";
import "../../css/policyDoc.css";

const PolicyDocument = () => {
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [retail, setRetail] = useState([]);
  const [smes, setSmes] = useState([]);
  const [selectedCorp, setSelectedCorp] = useState("0");
  const [selectedRetail, setSelectedRetail] = useState("0");
  const [selectedSme, setSelectedSme] = useState("0");
  const [annivs, setAnnivs] = useState([]);
  const [selectedAnniv, setSelectedAnniv] = useState("0");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [productNames, setProductNames] = useState([]);
  const [policyDocs, setPolicyDocs] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState("0");
  const [policyData, setPolicyData] = useState([]);
  const [hidden, setHidden] = useState({
    client_type: true,
    corp: true,
    retail: true,
    sme: true,
    anniv: true,
    category: true,
    product_name: true,
    policy_docs: true,
    search: true,
  });

  useEffect(() => {
    //fetch corporates
    getOneData("fetch_specific_corporate", 1)
      .then((data) => setCorporates(data))
      .catch((error) => console.log(error));
    //fetch smes
    getOneData("fetch_specific_corporate", 3)
      .then((data) => setSmes(data))
      .catch((error) => console.log(error));
    //fetch retail principals
    getData("fetch_individuals")
      .then((data) => setRetail(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    document.getElementById("client_type").value = "0";
    switch (selectedOption) {
      case "0":
        setHidden({
          client_type: true,
          corp: true,
          retail: true,
          sme: true,
          anniv: true,
          category: true,
          product_name: true,
          policy_docs: true,
          search: true,
        });
        break;
      case "1":
        setHidden({
          client_type: false,
          corp: true,
          retail: true,
          sme: true,
          anniv: false,
          category: false,
          product_name: false,
          policy_docs: true,
          search: false,
        });
        break;
      case "2":
        setHidden({
          client_type: false,
          corp: true,
          retail: true,
          sme: true,
          anniv: true,
          category: true,
          product_name: true,
          policy_docs: false,
          search: false,
        });
        break;
    }
  }, [selectedOption]);

  //fetch clients
  useEffect(() => {
    document.getElementById("corporate").value = "0";
    document.getElementById("retail").value = "0";
    document.getElementById("sme").value = "0";
    switch (selectedClient) {
      case "0":
        setHidden({ ...hidden });
        break;
      case "1":
        setHidden({ ...hidden, corp: false, retail: true, sme: true });
        break;
      case "2":
        setHidden({ ...hidden, corp: true, retail: false, sme: true });
        break;
      case "3":
        setHidden({ ...hidden, corp: true, retail: true, sme: false });
        break;
    }
  }, [selectedClient]);

  //fetch corp annivs or policy docs
  useEffect(() => {
    document.getElementById("annivs").value = "0";
    document.getElementById("policy_docs").value = "0";
    if (selectedCorp !== "0") {
      if (selectedOption === "1") {
        getOneData("fetch_corp_annivs", selectedCorp)
          .then((data) => setAnnivs(data))
          .catch((error) => console.log(error));
      } else if (selectedOption === "2") {
        getTwoData("fetch_policy_docs", selectedCorp, "corporate")
          .then((data) => setPolicyDocs(data))
          .catch((error) => console.log(error));
      }
    }
  }, [selectedCorp]);
  //fetch retail annivs or policy docs
  useEffect(() => {
    document.getElementById("annivs").value = "0";
    document.getElementById("policy_docs").value = "0";
    if (selectedRetail !== "0") {
      if (selectedOption === "1") {
        getOneData("fetch_annivs_for_member", selectedRetail)
          .then((data) => setAnnivs(data))
          .catch((error) => console.log(error));
      } else if (selectedOption === "2") {
        getTwoData("fetch_policy_docs", selectedRetail, "retail")
          .then((data) => setPolicyDocs(data))
          .catch((error) => console.log(error));
      }
    }
  }, [selectedRetail]);
  //fetch sme annivs or policy docs
  useEffect(() => {
    document.getElementById("annivs").value = "0";
    document.getElementById("policy_docs").value = "0";
    if (selectedSme !== "0") {
      if (selectedOption === "1") {
        getOneData("fetch_corp_annivs", selectedSme)
          .then((data) => setAnnivs(data))
          .catch((error) => console.log(error));
      } else if (selectedOption === "2") {
        getTwoData("fetch_policy_docs", selectedSme, "sme")
          .then((data) => setPolicyDocs(data))
          .catch((error) => console.log(error));
      }
    }
  }, [selectedSme]);

  //fetch categories
  useEffect(() => {
    document.getElementById("category").value = "0";
    const frmData = new FormData(document.getElementById("frmPolicyDocument"));
    if (selectedAnniv !== "0") {
      postData(frmData, "fetch_corp_or_family_categories")
        .then((data) => {
          console.log(data);
          setCategories(data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedAnniv]);

  //fetch product names
  useEffect(() => {
    document.getElementById("product_name").value = "0";
    const frmData = new FormData(document.getElementById("frmPolicyDocument"));
    if (selectedCategory !== "0") {
      postData(frmData, "fetch_corp_or_family_product_names")
        .then((data) => {
          console.log(data);
          setProductNames(data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedCategory]);

  //fetch policy data
  useEffect(() => {
    if (selectedPolicy !== "0") {
      getOneData("fetch_policy_doc_data", selectedPolicy)
        .then((data) => {
          console.log(data);
          setPolicyData(data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedPolicy]);

  return (
    <div>
      <div className="policyDocument">
        <div className="container">
          <form id="frmPolicyDocument">
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
                  <option value="1">Create</option>
                  <option value="2">Query</option>
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.client_type}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="client_type"
                  id="client_type"
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  <option disabled value="0">
                    Select Client Type
                  </option>
                  <option value="1">Corporate</option>
                  <option value="2">Retail</option>
                  <option value="3">SME</option>
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.corp}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="corporate"
                  id="corporate"
                  onChange={(e) => setSelectedCorp(e.target.value)}
                >
                  <option disabled value="0">
                    Select Corporate
                  </option>
                  {corporates.map((dt) => {
                    return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
                  })}
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.retail}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="retail"
                  id="retail"
                  onChange={(e) => setSelectedRetail(e.target.value)}
                >
                  <option disabled value="0">
                    Select Retail
                  </option>
                  {retail.map((dt) => {
                    return (
                      <option value={dt.member_no}>
                        {dt.principal_names + " - " + dt.member_no}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.sme}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="sme"
                  id="sme"
                  onChange={(e) => setSelectedSme(e.target.value)}
                >
                  <option disabled value="0">
                    Select SME
                  </option>
                  {smes.map((dt) => {
                    return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
                  })}
                </select>
              </div>

              <div className="col-md-3" hidden={hidden.anniv}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="annivs"
                  id="annivs"
                  onChange={(e) => setSelectedAnniv(e.target.value)}
                >
                  <option disabled value="0">
                    Select Anniv
                  </option>
                  {annivs.map((dt) => {
                    return <option value={dt.anniv}>{dt.anniv}</option>;
                  })}
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.category}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="category"
                  id="category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option disabled value="0">
                    Select category
                  </option>
                  {categories.map((dt) => {
                    return <option value={dt.category}>{dt.category}</option>;
                  })}
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.product_name}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="product_name"
                  id="product_name"
                >
                  <option disabled value="0">
                    Select Product Name
                  </option>
                  {productNames.map((dt) => {
                    return <option value={dt.code}>{dt.product_name}</option>;
                  })}
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.policy_docs}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="policy_docs"
                  id="policy_docs"
                  onChange={(e) => setSelectedPolicy(e.target.value)}
                >
                  <option disabled value="0">
                    Select Policy No
                  </option>
                  {policyDocs.map((dt) => {
                    return <option value={dt.policy_no}>{dt.policy_no}</option>;
                  })}
                </select>
              </div>

              <div className="col-md-2" hidden={hidden.search}>
                <button type="submit" className="btn btn-info form-control">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card cardPolicy">
        {/*********************************** start of table one ****************************************/}
        <span className="alert  text-center">Client</span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>Client Name</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.policy_no}
                />
              </td>
            </tr>
            <tr>
              <th>Policy Schedule No</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.policy_no}
                />
              </td>
            </tr>
            <tr>
              <th>Product Option</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.health_plan}
                />
              </td>
            </tr>
            <tr>
              <th>Geographical Zone</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.zone}
                />
              </td>
            </tr>
            <tr>
              <th>Over all Annual Limit</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.overall_annual_limit}
                />
              </td>
            </tr>
            <tr>
              <th>No of Lives</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.lives}
                />
              </td>
            </tr>
            <tr>
              <th>Premium Per Life</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.client_premium}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/*********************************** start of table two ****************************************/}
        <span className="alert  text-center">Value Added Services</span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <textarea
                className="form-control"
                type="text"
                value="Cash Back Scheme: Award to our clients for being in control of their health (Zero claim on outpatient) ten percent of premiums. (For corporates with 65% or less of entire scheme Utilisation)"
              />
             
            </tr>
            <tr>
              <th>Health Promotions (Upon Request from the Client)</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.promotions}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/*********************************** start of table three ****************************************/}
        <span className="alert  text-center">
          Inpatient Benefits (Pre-authorization will be required for inpatient
          cover)
        </span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>Accident hospitalization limit</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.accident_hosp}
                />
              </td>
            </tr>
            <tr>
              <th>Illness hospitalization limit</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.illness_hosp}
                />
              </td>
            </tr>
            <tr>
              <th>
                Admissions to intensive care and high care units for (non
                chronic)
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.admissions_icu}
                />
              </td>
            </tr>
            <tr>
              <th>
                Admissions to intensive care and high care units for chronic
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.admissions_icu_chronic}
                />
              </td>
            </tr>
            <tr>
              <th>
                Admissions to intensive care and high care units for accident
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.admissions_icu_accident}
                />
              </td>
            </tr>
            <tr>
              <th>
                Hospital room limit per night paid within hospitalisation limit
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.room_limit}
                />
              </td>
            </tr>
            <tr>
              <th>
                Preexisting/chronic conditions (min 20 lives in a corporate)
                covered within illness hospitalisation limit
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.preexisting_cond}
                />
              </td>
            </tr>
            <tr>
              <th>
                Oncology tests, drugs, and consultation for chemotherapy and
                radiotherapy
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.oncology_tests}
                />
              </td>
            </tr>
            <tr>
              <th>
                Treatment and admissions to ICU and HCU for Covid-19 and related
                co-morbidities
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.covid19_ip}
                />
              </td>
            </tr>
            <tr>
              <th>Nursing fees, medical expenses and ancillary charges </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.nursing_fees}
                />
              </td>
            </tr>
            <tr>
              <th>
                General surgery, surgeons', consultants', anaesthetists',
                medical practitioners' fees
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.general_surgery}
                />
              </td>
            </tr>
            <tr>
              <th>Reconstructive surgery for illness </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.reconstructive_surgery}
                />
              </td>
            </tr>
            <tr>
              <th>Reconstructive surgery for accident </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.reconstructive_surgery_acc}
                />
              </td>
            </tr>
            <tr>
              <th>Prescribed medicines and drugs </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.prescribed_drugs}
                />
              </td>
            </tr>
            <tr>
              <th>Internal Prostheses </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.internal_prostheses}
                />
              </td>
            </tr>
            <tr>
              <th>
                X-rays, MRI, PET Scans, CT scans, and imaging tests including
                angiography (covered upon doctor's recommendation){" "}
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.xray}
                />
              </td>
            </tr>
            <tr>
              <th>Pathology, diagnostic tests, and procedures </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.pathology}
                />
              </td>
            </tr>
            <tr>
              <th>
                Accidental damage to natural eyes covered within accident
                hospitalisation limit
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.acc_damage_natural_eyes}
                />
              </td>
            </tr>
            <tr>
              <th>
                Accidental damage to natural teeth covered within accident
                hospitalisation limit{" "}
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.acc_damage_natural_teeth}
                />
              </td>
            </tr>
            <tr>
              <th>
                Psychiatric treatment (IP) covered within illness
                hospitalisation limit{" "}
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.psychiatric_treatment}
                />
              </td>
            </tr>
            <tr>
              <th>Physiotherapy </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.physiotherapy}
                />
              </td>
            </tr>
            <tr>
              <th>
                Parent accommodation, member parent within a member child under
                8 years of age in hospital{" "}
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.parent_accomodation}
                />
              </td>
            </tr>
            <tr>
              <th>
                Congenital and genetic conditions defects covered within illness
                hospitalisation limit{" "}
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.congenital_conditions}
                />
              </td>
            </tr>
            <tr>
              <th>
                Inpatient treatment of HIV/AIDS and all opportunistic infections
                covered within chronic illness hospitalisation{" "}
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.inpatient_treatment_hiv}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/*********************************** start of table four ****************************************/}
        <span className="alert  text-center">Rescue and Evacuation</span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>Emergency road ambulance and evacuation </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.evacuation}
                />
              </td>
            </tr>
            <tr>
              <th>
                International emergency medical cover area-up to the first 30
                days of absence from the territory in any membership year. This
                is only for hospitalisation (Pre-authorisation required){" "}
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.international_emergency_medical}
                />
              </td>
            </tr>
            <tr>
              <th>
                International emergency rescue and evacuation (Pre-authorization
                required){" "}
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.international_emergency_rescue}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/*********************************** start of table five ****************************************/}
        <span className="alert  text-center">
          Maternity Cover (For Principal and Spouse only in Uganda) :
          Pre-authorization will be required for cover
        </span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>
                Maternity Overall (Inclusive of Room Limit. Available in Uganda
                only){" "}
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.normal_delivery}
                />
              </td>
            </tr>
            <tr>
              <th>
                Delivery, Antenatal and Postnatal Treatment (Within Maternity
                Overall)
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.caesarian_section}
                />
              </td>
            </tr>
            <tr>
              <th>Premature Cover (Within Maternity Overall)</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.premature_cover}
                />
              </td>
            </tr>
            <tr>
              <th>
                Nursery Care (Treatment of new born baby while still in
                hospital)
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.nursery_care}
                />
              </td>
            </tr>
            <tr>
              <th>Complications of Pregnancy</th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.complications_pregnancy}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <span className="alert  text-center">Outpatient</span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>Overall annual Limit</th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.op_annual_limit}
                />
              </td>
            </tr>
            <tr>
              <th>
                Preexisting/Chronic conditions (Min 20 Lives in a corporate)
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.preexisting_conditions_}
                />
              </td>
            </tr>
            <tr>
              <th>
                Treatment and testing of Covid-19 and related co-morbidities
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.covid19_op}
                />
              </td>
            </tr>
            <tr>
              <th>
                Oncology tests, drugs, and consultation for chemotherapy and
                radiotherapy
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.op_oncology_tests}
                />
              </td>
            </tr>
            <tr>
              <th>General practitioners and specialists' consultation fees</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.general_practitioners}
                />
              </td>
            </tr>
            <tr>
              <th>Prescribed medicines, drugs, and dressings</th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.prescribed_medicines}
                />
              </td>
            </tr>
            <tr>
              <th>Physiotherapy (post trauma, pre-authorization required)</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.op_physiotherapy}
                />
              </td>
            </tr>
            <tr>
              <th>Psychiatric treatment (OP)</th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.op_psychiatric_treatment}
                />
              </td>
            </tr>
            <tr>
              <th>Congenital conditions covered within outpatient limit</th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.op_congenital_conditions}
                />
              </td>
            </tr>
            <tr>
              <th>Post hospitalisation treatment</th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.post_hospitalisation_treatment}
                />
              </td>
            </tr>
            <tr>
              <th>
                Out-patient surgical operations (pre-authorization required)
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.outpatient_surgical_operations}
                />
              </td>
            </tr>
            <tr>
              <th>
                Out-patient treatment of HIV/AIDS and all opportunistic
                infections covered within outpatient limit
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.outpatient_treatment_of_hiv}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <span className="alert text-center">Optometry</span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>Optometry Outpatient Benefit Limit</th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.optometry_limit}
                />
              </td>
            </tr>
            <tr>
              <th>
                Consultation and general eye examinations, eye treatment, and
                simple outer surgeries
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.general_eye_examinations}
                />
              </td>
            </tr>
            <tr>
              <th>
                Frames and lenses (replaced once every year), visual acuity
                tests
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.frames_lenses}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <span className="alert  text-center">Dental</span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>Dental Outpatient Benefit Limit</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.dental_limit}
                />
              </td>
            </tr>
            <tr>
              <th>
                Consultations and treatment, extractions, infections, fillings,
                and minor surgeries, root canal, xrays, non-surgical
                extractions, scaling, and polishing
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.dental_consultation_treatment}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <span className="alert  text-center">Other Benefits</span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>
                Annual Health Checks (Basic Medex): Complete blood count test,
                Random blood sugar test, Breast exam, and VIA for Females above
                30 years, PSA for males above 45 years.
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.annual_health_checks}
                />
              </td>
            </tr>
            <tr>
              <th>
                Personal Accident with Permanent Total Disability Cover - Adult
              </th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.personal_accident}
                />
              </td>
            </tr>
            <tr>
              <th>
                Personal Accident with Permanent Total Disability Cover - Child
              </th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.personal_accident_child}
                />
              </td>
            </tr>
            <tr>
              <th>Last Expenses</th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.last_expense}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <span className="alert  text-center">Waiting Period</span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>Illness Hospitalization</th>
              <td>
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={policyData.illness_hospitalization}
                />
              </td>
            </tr>
            <tr>
              <th>Maternity</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.maternity_wp}
                />
              </td>
            </tr>
            <tr>
              <th>Provider Network</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={policyData.provider_network}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <span className="alert  text-center">Enrollment Notes</span>
        <table className="table-bordered policyDoc">
          <tbody>
            <tr>
              <th>
                <textarea
                  className="form-control"
                  type="text"
                  value={policyData.enroll_one}
                />
              </th>
            </tr>
            <tr>
              <th>
                <textarea
                  className="form-control"
                  type="text"
                  value={policyData.enroll_two}
                />
              </th>
            </tr>{" "}
            <tr>
              <th>
                <textarea
                  className="form-control"
                  type="text"
                  value={policyData.enroll_three}
                />
              </th>
            </tr>
            <tr>
              <th>
                <textarea
                  className="form-control"
                  type="text"
                  value={policyData.enroll_four}
                />
              </th>
            </tr>
            <tr>
              <th>
                <textarea
                  className="form-control"
                  type="text"
                  value={policyData.enroll_five}
                />
              </th>
            </tr>
            <tr>
              <th>
                <textarea
                  className="form-control"
                  type="text"
                  value={policyData.enroll_six}
                />
              </th>
            </tr>
            <tr>
              <th>
                <textarea
                  className="form-control"
                  type="text"
                  value={policyData.enroll_seven}
                />
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <button className="btn btn-success save">Save</button>
        <button className="btn btn-primary print">Print</button>
      </p>
    </div>
  );
};

export default PolicyDocument;
