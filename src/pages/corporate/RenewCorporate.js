import {
  postData,
  getData,
  getOneData,
  getTwoData,
} from "../../components/helpers/Data";
import { useState, useEffect } from "react";
import { addDays, addYear } from "../../components/helpers/addDays";
import "../../css/renewCorp.css";
import Modal2 from "../../components/helpers/Modal2";
import Modal3 from "../../components/helpers/Modal3";
import { Spinner } from "../../components/helpers/Spinner";
import AccessLogs from "../../components/helpers/AccessLogs";
import { today } from "../../components/helpers/today";

const RenewCorporate = () => {
  //save access log
  useEffect(() => {
    const frmData = new FormData();
    frmData.append("username", localStorage.getItem("username"));
    frmData.append("accessed", 3);
    AccessLogs(frmData);
  }, []);
  //module variables
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const [modal3IsOpen, setModal3IsOpen] = useState(false);
  const [maxAnnivDates, setMaxAnnivDates] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [agents, setAgents] = useState([]);
  const [corpData, setCorpData] = useState([]);
  const [corpAnnivs, setcorpAnnivs] = useState([]);
  const [corpGroups, setcorpGroups] = useState([]);
  const [adminFees, setAdminFees] = useState([]);
  const [newRegulation, setNewRegulation] = useState([]);
  const [newBenefit, setNewBenefit] = useState([]);
  const [readOnly, setReadOnly] = useState(true);
  const [disabledStatus, setDisabledStatus] = useState(true);
  const [choosenHealthPlan, setChoosenHealthPlan] = useState("0");
  const [productNames, setProductNames] = useState([]);
  const [choosenProductName, setChoosenProductName] = useState([]);
  const [exists, setExists] = useState("");

  const closeModal3 = () => {
    setModal3IsOpen(false);
  };

  //fetching specific product names
  useEffect(() => {
    setProductNames([]);
    if (choosenHealthPlan != "0") {
      getOneData("fetch_specific_product_names", choosenHealthPlan)
        .then((data) => {
          console.log(data);
          setProductNames(data);
        })
        .catch((error) => console.log(error));
    }
  }, [choosenHealthPlan]);

  const validateIfProductsExist = (e) => {
     setExists("");
    e.preventDefault();
    let exists = 0;
    const tbl = document.querySelector("#benefits_table tbody").children;
    for (let i = 0; i < tbl.length; i++) {
      const tr = tbl[i];
      const category = tr.children[1].children[0].value;
      const productName = tr.children[2].children[0].value;
      if (
        (category == choosenHealthPlan) &&
        (productName == choosenProductName)
      ) {
        exists++;
      } 
    }
    if (exists > 0) {
      setExists("Product already exists!")
    } else {
      fetchProduct();
    }
  };

  const fetchProduct = () => {
    getTwoData(
      "fetch_product_benefits",
      choosenHealthPlan,
      choosenProductName
    ).then((data) => {
      const row = data.fetched_benefits.map((dt) => {
        return (
          <tr key={dt.id} id="appended">
            <td>
              <input
                className="form-control"
                value={
                  parseInt(document.getElementById("corporate_anniv").value) + 1
                }
                type="text"
                name="corp_group_anniv[]"
                readOnly
              />
            </td>
            <td>
              <select
                className="form-control"
                style={{ width: "200px" }}
                defaultValue={dt.health_plan}
                type="text"
                name="category[]"
              >
                <option value="0">Select Category</option>
                {corpData.health_plan.map((category) => {
                  return (
                    <option value={category.category}>
                      {category.category}
                    </option>
                  );
                })}
              </select>
            </td>
            <td>
              <select
                className="form-control"
                style={{ width: "300px" }}
                defaultValue={dt.product_code}
                type="text"
                name="product_name[]"
              >
                <option value="0">Select Product Name</option>
                {corpData.product_name.map((pname) => {
                  return (
                    <option value={pname.code}>{pname.product_name}</option>
                  );
                })}
              </select>
            </td>
            <td>
              <select
                className="form-control"
                style={{ width: "400px" }}
                defaultValue={dt.benefit_code}
                type="text"
                name="benefit[]"
              >
                <option value="0">Select Benefit</option>
                {corpData.benefit.map((bene) => {
                  return <option value={bene.code}>{bene.benefit}</option>;
                })}
              </select>
            </td>
            <td>
              <select
                className="form-control"
                style={{ width: "400px" }}
                defaultValue={dt.sub_limit_of_code}
                type="text"
                name="sub_limit_of[]"
              >
                <option value="0">Select Sub Limit Of</option>
                {corpData.benefit.map((bene) => {
                  return <option value={bene.code}>{bene.benefit}</option>;
                })}
              </select>
            </td>
            <td>
              <input
                className="form-control"
                style={{ width: "200px" }}
                defaultValue={dt.limit}
                type="number"
                min="0"
                name="limit[]"
              />
            </td>
            <td>
              <select
                className="form-control"
                style={{ width: "200px" }}
                defaultValue={dt.sharing}
                type="text"
                name="sharing[]"
              >
                <option value="0">Select Sharing</option>
                {corpData.sharing.map((share) => {
                  return <option value={share.CODE}>{share.SHARING}</option>;
                })}
              </select>
            </td>
            <td>
              <input
                className="form-control fund"
                type="checkbox"
                value="1"
                defaultChecked={dt.fund === 1 ? "checked" : ""}
              />
            </td>
            <td>
              <input
                className="form-control capitated"
                type="checkbox"
                value="1"
                defaultChecked={dt.capitated === 1 ? "checked" : ""}
              />
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="0"
                defaultValue={dt.quantity}
                name="quantity[]"
              />
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="0"
                name="waiting_period[]"
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

  //getting all corporates and agents
  useEffect(() => {
    getData("fetch_corporates").then((data) => setCorporates(data));
    getData("fetch_agents").then((data) => setAgents(data));
  }, []);

  //getting renewal data
  const fetchCorporateData = (e) => {
    document.getElementById("start_date").value = "";
    document.getElementById("end_date").value = "";
    document.getElementById("renewal_date").value = "";
    document.getElementById("spinner").style.display = "block";
    setcorpGroups([]);
    setNewBenefit([]);
    setNewRegulation([]);
    setCorpData([]);
    setcorpAnnivs([]);
    setAdminFees([]);

    getOneData("fetch_data", e.target.value)
      .then((data) => {
        setCorpData(data);
        setcorpAnnivs(data.prev_annivs);
        setcorpGroups(data.corp_groups);
        setAdminFees(data.admin_fee);
        setMaxAnnivDates(data.max_prev_annivs);
        //set min dates
        document.getElementById("start_date").min =
          data.max_prev_annivs[0].renewal_date;
        document.getElementById("end_date").min =
          data.max_prev_annivs[0].renewal_date;
        setDisabledStatus(false);
        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => {
        document.getElementById("spinner").style.display = "none";
        console.log(error);
      });
  };

  const chooseHealthPlan = () => {
    setExists("")
    setModal3IsOpen(true);
  };

  const addBenefitLine = (e) => {
    e.preventDefault();
    const row = (
      <tr id="appended">
        <td>
          <input
            className="form-control"
            value={
              parseInt(document.getElementById("corporate_anniv").value) + 1
            }
            type="text"
            name="corp_group_anniv[]"
            readOnly
          />
        </td>
        <td>
          <select
            className="form-control"
            style={{ width: "200px" }}
            defaultValue="0"
            type="text"
            name="category[]"
          >
            <option value="0">Select Category</option>
            {corpData.health_plan.map((category) => {
              return (
                <option value={category.category}>{category.category}</option>
              );
            })}
          </select>
        </td>
        <td>
          <select
            className="form-control"
            style={{ width: "300px" }}
            defaultValue="0"
            type="text"
            name="product_name[]"
          >
            <option value="0">Select Product Name</option>
            {corpData.product_name.map((pname) => {
              return <option value={pname.code}>{pname.product_name}</option>;
            })}
          </select>
        </td>
        <td>
          <select
            className="form-control"
            style={{ width: "400px" }}
            defaultValue="0"
            type="text"
            name="benefit[]"
          >
            <option value="0">Select Benefit</option>
            {corpData.benefit.map((bene) => {
              return <option value={bene.code}>{bene.benefit}</option>;
            })}
          </select>
        </td>
        <td>
          <select
            className="form-control"
            style={{ width: "400px" }}
            defaultValue="0"
            type="text"
            name="sub_limit_of[]"
          >
            <option value="0">Select Sub Limit Of</option>
            {corpData.benefit.map((bene) => {
              return <option value={bene.code}>{bene.benefit}</option>;
            })}
          </select>
        </td>
        <td>
          <input
            className="form-control"
            style={{ width: "200px" }}
            defaultValue="0"
            type="number"
            min="0"
            name="limit[]"
          />
        </td>
        <td>
          <select
            className="form-control"
            style={{ width: "200px" }}
            defaultValue="0"
            type="text"
            name="sharing[]"
          >
            <option value="0">Select Sharing</option>
            {corpData.sharing.map((share) => {
              return <option value={share.CODE}>{share.SHARING}</option>;
            })}
          </select>
        </td>
        <td>
          <input className="form-control fund" type="checkbox" value="1" />
        </td>
        <td>
          <input className="form-control capitated" type="checkbox" value="1" />
        </td>
        <td>
          <input
            className="form-control"
            type="number"
            min="0"
            defaultValue="0"
            name="quantity[]"
          />
        </td>
        <td>
          <input
            className="form-control"
            type="number"
            min="0"
            name="waiting_period[]"
          />
        </td>
      </tr>
    );

    setNewBenefit((newBenefit) => {
      return [...newBenefit, row];
    });
  };

  const appendRegulation = (e) => {
    e.preventDefault();
    getData("fetch_admin_fee").then((data) => {
      const regDropDown = data.map((dt) => {
        return (
          <option key={dt.code} value={dt.code}>
            {dt.admin_fee_type}
          </option>
        );
      });
      const newReg = {
        id: new Date().getTime().toString(),
        new: (
          <>
            <td>
              <input
                className="form-control"
                value={
                  parseInt(document.getElementById("corporate_anniv").value) + 1
                }
                type="number"
                min="1"
                name="admin_fee_anniv"
                readOnly
              />
            </td>
            <td>
              <select
                className="form-control"
                defaultValue="0"
                type="text"
                name="admin_fee_type"
              >
                <option value="0">Select admin fee type</option>
                {regDropDown}
              </select>
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="1"
                name="admin_fee_rate"
              />
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="1"
                name="upfront_copay"
              />
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="1"
                name="agent_commis_rate"
              />
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="1"
                name="commis_whtax_rate"
              />
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="1"
                name="unit_manager_rate"
              />
            </td>
            <td>
              <input
                className="form-control"
                type="number"
                min="1"
                name="bdm_rate"
              />
            </td>
            <td>
              <button
                className="btn text-danger"
                onClick={(e) => removeRow(newReg.id, e)}
              >
                <i className="fas fa-trash fa-lg"></i>
              </button>
            </td>
          </>
        ),
      };
      setNewRegulation([newReg]);
    });
  };

  const getEndDate = () => {
    const date = addYear(document.getElementById("start_date").value);
    const formatedDate = date.toISOString().split("T")[0];
    document.getElementById("end_date").value = formatedDate;

    const date2 = addDays(document.getElementById("end_date").value);
    const formatedDate2 = date2.toISOString().split("T")[0];
    document.getElementById("renewal_date").value = formatedDate2;
  };

  const getRenewalDate = () => {
    const date = addDays(document.getElementById("end_date").value);
    const formatedDate = date.toISOString().split("T")[0];
    document.getElementById("renewal_date").value = formatedDate;
  };
  const filterEndDate = (e) => {
    setReadOnly(false);
    document.getElementById("end_date").value = "";
    // document.getElementById("end_date").min = e.target.value;
  };

  const removeRow = async (id, e) => {
    e.preventDefault();
    setNewRegulation((newRegulation) => {
      return newRegulation.filter((row) => row.id !== id);
    });
  };

  const removeBenefitRow = async (id, e) => {
    e.preventDefault();
    console.log(newBenefit);
    setNewBenefit((newBenefit) => {
      return newBenefit.filter((row) => row.key !== id);
    });
  };

  //renew the corporate

  const corpRenew = async (e) => {
    e.preventDefault();
    const agnt = document.getElementById("agent").value;
    const start_dt = document.getElementById("start_date").value;
    const end_dt = document.getElementById("end_date").value;

    const corp_id = document.getElementById("select-corporate-dropdown").value;
    const frmData = new FormData(document.getElementById("frmRenew"));
    const fundCheckbox = document.querySelectorAll(".fund");
    const capitatedCheckbox = document.querySelectorAll(".capitated");

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

    frmData.append("corp_id", corp_id);
    if (agnt !== "0" && start_dt != "" && end_dt !== "") {
      postData(frmData, "renew_corporate_data").then((data) => {
        setFeedback(data);
        setModal2IsOpen(true);
        setDisabledStatus(true);
      });
    } else {
      setFeedback([
        "Start date, end date, and Intermediary must be selected to continue!",
      ]);
      setModal2IsOpen(true);
    }
  };

  const closeModal2 = () => {
    setModal2IsOpen(false);
    if (feedback.length > 0) {
      if (
        !(
          feedback[0].includes("Error") ||
          feedback[0].includes(
            "Start date, end date, and Intermediary must be selected to continue!"
          )
        )
      ) {
        window.location.replace("renew-corporate");
      }
    }
  };

  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12 col-lg-12">
              <select
                className="form-control"
                id="select-corporate-dropdown"
                defaultValue="0"
                onChange={fetchCorporateData}
              >
                <option disabled value="0">
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
            <Spinner />
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
                        id="nav-home-tab"
                        data-toggle="tab"
                        href="#nav-corporate"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        disabled
                        selected
                      >
                        CORPORATE RENEWAL DETAILS
                      </a>
                      <a
                        className="nav-item nav-link"
                        id="nav-contact-tab"
                        data-toggle="tab"
                        href="#nav-admin-fee-regulation"
                        role="tab"
                        aria-controls="nav-contact"
                        aria-selected="false"
                      >
                        ADMIN FEE REGULATION
                      </a>
                      <a
                        className="nav-item nav-link"
                        id="nav-home-tab"
                        data-toggle="tab"
                        href="#nav-corporate-benefits"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        disabled
                        selected
                      >
                        BENEFITS
                      </a>
                    </div>
                  </nav>
                </div>
                <div className="card-body">
                  <form id="frmRenew" className="" onSubmit={corpRenew}>
                    <div className="tab-content" id="nav-tabContent">
                      <div
                        className="tab-pane fade show active corporate-tab-content"
                        id="nav-corporate"
                        role="tabpanel"
                        aria-labelledby="nav-home-tab"
                      >
                        <div id="step-1">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Corporate
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={corpData.corp_name}
                                    name="corporate"
                                    readOnly
                                    id="corporate_name"
                                  />
                                </div>

                                <div className="col-md-2">
                                  <label className="col-form-label">
                                    Anniv
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="corp_anniv"
                                    value={corpData.max_anniv}
                                    readOnly
                                    id="corporate_anniv"
                                  />
                                </div>
                              </div>

                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Start Date
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="date"
                                    name="start_date"
                                    className="form-control"
                                    id="start_date"
                                    onChange={() => {
                                      filterEndDate();
                                      getEndDate();
                                    }}
                                  />
                                </div>

                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    User
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="user"
                                    value={localStorage.getItem("username")}
                                    className="form-control"
                                    readOnly
                                    id="user_id"
                                  />
                                </div>
                              </div>

                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    End Date
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="date"
                                    name="end_date"
                                    className="form-control"
                                    id="end_date"
                                    onChange={getRenewalDate}
                                    readOnly={readOnly}
                                  />
                                </div>

                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Date Entered
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="date_entered"
                                    className="form-control"
                                    id="date_entered"
                                    value={today()}
                                    readOnly
                                  />
                                </div>
                              </div>

                              <div className="form-group row justify-content-center">
                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Renewal Date
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    name="renewal_date"
                                    className="form-control"
                                    id="renewal_date"
                                    readOnly
                                  />
                                </div>

                                <div className="col-md-2">
                                  <label className="col-form-label label-align">
                                    Intermediary
                                  </label>
                                </div>
                                <div className="col-md-3">
                                  <select
                                    className="form-control"
                                    name="agent"
                                    id="agent"
                                    defaultValue={
                                      corpData.length !== 0
                                        ? corpData.agent_id
                                        : "0"
                                    }
                                  >
                                    <option disabled value="0">
                                      Select Intermediary
                                    </option>
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
                            </div>

                            <div
                              className="col-md-12"
                              style={{ marginTop: "10px" }}
                            >
                              <div>
                                <p className="h1 text-center text-info">
                                  Previous Anniversaries
                                </p>
                              </div>
                              <table
                                className="table table-bordered table-sm"
                                id="prev-anniv-table"
                              >
                                <thead className="thead-dark">
                                  <tr>
                                    <th>Anniv</th>
                                    <th>Agent</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Renewal Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {corpAnnivs.map((data) => {
                                    return (
                                      <tr>
                                        <td>{data.anniv}</td>
                                        <td>{data.agent_name}</td>
                                        <td>{data.start_date}</td>
                                        <td>{data.end_date}</td>
                                        <td>{data.renewal_date}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="nav-admin-fee-regulation"
                        role="tabpanel"
                        aria-labelledby="nav-contact-tab"
                      >
                        <button
                          className="btn btn-info col-md-4"
                          id="btnAppendRegulation"
                          onClick={appendRegulation}
                          style={{ float: "right", marginBottom: "5px" }}
                          disabled={disabledStatus}
                        >
                          Add Regulation
                        </button>
                        <table
                          className="table table-bordered col-md-12"
                          cellSpacing="0"
                          id="admin_fee_table"
                        >
                          <thead>
                            <tr>
                              <th>Anniv</th>
                              <th>Admin Fee Type</th>
                              <th>Admin Fee Rate (%)</th>
                              <th>Upfront Copay (ugx)</th>
                              <th>Agent Commis Rate (%)</th>
                              <th>Commis Whtax Rate</th>
                              <th>Unit Manager Rate</th>
                              <th>Bdm Rate</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminFees.map((fee) => {
                              return (
                                <tr>
                                  <td>{fee.anniv}</td>
                                  <td>{fee.admin_fee_type}</td>
                                  <td>{fee.admin_fee_rate}</td>
                                  <td>{fee.upfront_copay}</td>
                                  <td>{fee.agent_commis_rate}</td>
                                  <td>{fee.commis_whtax_rate}</td>
                                  <td>{fee.unit_manager_rate}</td>
                                  <td>{fee.bdm_rate}</td>
                                  <td></td>
                                </tr>
                              );
                            })}
                            {newRegulation.map((reg) => {
                              return <tr key={reg.id}>{reg.new}</tr>;
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div
                        className="tab-pane fade table-responsive"
                        id="nav-corporate-benefits"
                        role="tabpanel"
                        aria-labelledby="nav-contact-tab"
                      >
                        <div style={{ display: "flex" }}>
                          <button
                            type="button"
                            id="btnAppendBenefit"
                            onClick={chooseHealthPlan}
                            className="btn btn-success form-control col-2"
                            style={{ marginBottom: "10px" }}
                            disabled={disabledStatus}
                          >
                            Add Products
                          </button>
                          <button
                            type="button"
                            id="btnAppendBenefit"
                            onClick={addBenefitLine}
                            className="btn btn-primary form-control col-2"
                            style={{ marginBottom: "10px", marginLeft: "5px" }}
                            disabled={disabledStatus}
                          >
                            Add Benefit Line
                          </button>
                          <button
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
                          </button>
                        </div>
                        <table
                          className="table table-bordered justify-content-center"
                          cellSpacing="0"
                          id="benefits_table"
                          style={{ height: "500px" }}
                        >
                          <thead className="thead-dark">
                            <tr>
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
                            {corpGroups.map((group) => {
                              return (
                                <tr key={group.idx}>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue={
                                        group.anniv !== null
                                          ? parseInt(group.anniv) + 1
                                          : 0
                                      }
                                      type="number"
                                      min="1"
                                      name="corp_group_anniv[]"
                                      readOnly
                                    />
                                  </td>
                                  <td>
                                    <select
                                      className="form-control"
                                      style={{ width: "200px" }}
                                      value={group.category}
                                      type="text"
                                      name="category[]"
                                    >
                                      <option disabled value="0">
                                        Select Health Plan
                                      </option>
                                      {corpData.health_plan.map((category) => {
                                        return (
                                          <option value={category.category}>
                                            {category.category}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </td>
                                  <td>
                                    <select
                                      className="form-control"
                                      style={{ width: "300px" }}
                                      value={group.product_name}
                                      type="text"
                                      name="product_name[]"
                                    >
                                      <option disabled value="0">
                                        Select Product Name
                                      </option>
                                      {corpData.product_name.map((pname) => {
                                        return (
                                          <option value={pname.code}>
                                            {pname.product_name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </td>
                                  <td>
                                    <select
                                      className="form-control"
                                      style={{ width: "400px" }}
                                      value={group.benefit}
                                      type="text"
                                      name="benefit[]"
                                    >
                                      <option disabled value="0">
                                        Select Benefit
                                      </option>
                                      {corpData.benefit.map((bene) => {
                                        return (
                                          <option value={bene.code}>
                                            {bene.benefit}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </td>
                                  <td>
                                    <select
                                      className="form-control"
                                      style={{ width: "400px" }}
                                      value={group.sub_limit_of}
                                      type="text"
                                      name="sub_limit_of[]"
                                    >
                                      <option disabled value="0">
                                        Select Sub Limit Of
                                      </option>
                                      {corpData.benefit.map((bene) => {
                                        return (
                                          <option value={bene.code}>
                                            {bene.benefit}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      style={{ width: "200px" }}
                                      value={
                                        group.limit !== null ? group.limit : 0
                                      }
                                      type="number"
                                      min="0"
                                      name="limit[]"
                                    />
                                  </td>
                                  <td>
                                    <select
                                      className="form-control"
                                      style={{ width: "200px" }}
                                      defaultValue={group.sharing}
                                      type="text"
                                      name="sharing[]"
                                    >
                                      <option disabled value="0">
                                        Select Sharing
                                      </option>
                                      {corpData.sharing.map((share) => {
                                        return (
                                          <option value={share.CODE}>
                                            {share.SHARING}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </td>
                                  <td>
                                    <input
                                      className="form-control fund"
                                      type="checkbox"
                                      value={group.fund !== "1" ? "0" : "1"}
                                      defaultChecked={
                                        group.fund === "1" ? "checked" : ""
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control capitated"
                                      type="checkbox"
                                      value={
                                        group.capitated !== "1" ? "0" : "1"
                                      }
                                      defaultChecked={
                                        group.capitated === "1" ? "checked" : ""
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue={
                                        group.quantity !== null
                                          ? group.quantity
                                          : 0
                                      }
                                      type="number"
                                      min="0"
                                      name="quantity[]"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      defaultValue={
                                        group.waiting_period !== null
                                          ? group.waiting_period
                                          : 0
                                      }
                                      type="number"
                                      min="0"
                                      name="waiting_period[]"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                            {newBenefit.map((benefit) => {
                              return <>{benefit}</>;
                            })}
                          </tbody>
                        </table>
                        <p>
                          <button
                            type="submit"
                            disabled={disabledStatus}
                            className="btn btn-primary form-control col-2"
                          >
                            Renew Corporate
                          </button>
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal2
        modalIsOpen={modal2IsOpen}
        closeModal={closeModal2}
        body={
          <div style={{ maxHeight: "200px" }}>
            {feedback.map((dt) => {
              return (
                <p className="text-white font-weight-bold text-center">{dt}</p>
              );
            })}
          </div>
        }
        background={
          feedback.length > 0
            ? feedback[0].includes("Error")
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
              {corpData.length !== 0
                ? corpData.health_plan.map((dt) => {
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
              {productNames.map((dt) => {
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

export default RenewCorporate;
