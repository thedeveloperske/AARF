import {
  getData,
  getOneData,
  getTwoData,
  postData,
} from "../../components/helpers/Data";
import React, { useEffect, useState } from "react";
import ImportScripts from "../../components/helpers/ImportScripts";
import "../../css/finance.css";
import { today2 } from "../../components/helpers/today";
import Modal4 from "../../components/helpers/Modal4";
import { age } from "../../components/helpers/age";
import jsPDF from "jspdf";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Modal5 from "../../components/helpers/Modal2";
import { Spinner } from "../../components/helpers/Spinner";
import MessageModal from "../../components/helpers/Modal2";

const PremiumDebiting = () => {
  ImportScripts("/dist/js/claims_stepwise_forms.js");
  const [disabled, setDisabled] = useState({
    family: true,
    corporate: true,
    debits: true,
    user: true,
    save_btn: true,
  });
  const [corporate, setCorporate] = useState([]);
  const [individuals, setIndividuals] = useState([]);
  const [choosenOption, setChoosenOption] = useState([]);
  const [businessClass, setBusinessClass] = useState([]);
  const [invoiceType, setInvoiceType] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageModal, setIsMessageModal] = useState(false);
  const [modalFiveOpen, setModalFiveOpen] = useState(false);
  const [memberDetails, setMemberDetails] = useState([]);
  const [anniversaryDates, setAnniversaryDates] = useState([]);
  const [premiumData, setPremiumData] = useState([]);
  const [memberPremiums, setMemberPremiumData] = useState([]);
  const [agentRates, setAgentRates] = useState([]);
  const [products, setProducts] = useState([]);
  const [familyRelation, setFamilyRelation] = useState([]);
  const [referenceNo, setReferenceNo] = useState([]);
  const [otherCharges, setOtherCharges] = useState({
    contingency: "",
    giftItems: "",
    firstAid: "",
    stampDuty: "",
    others: "",
  });
  const [response, setResponse] = useState([]);
  const [address, setAddress] = useState([]);
  const [count, setCount] = useState(0);

  //calculate debit no
  const calculateDebitCount = () => {
    let countDebits = 0;
    const debitCheckbox = document.querySelectorAll(".debit");

    debitCheckbox.forEach((element) => {
      if (element.checked) {
        countDebits++;
      }
    });
    setCount(countDebits);
  };

  //toggle debit select
  const toggleDebitSelect = (e) => {
    let countDebits = 0;
    const checked = e.target.checked;
    const debitCheckbox = document.querySelectorAll(".debit");
    debitCheckbox.forEach((element) => {
      if (checked) {
        element.checked = true;
        countDebits++;
      } else {
        element.checked = false;
        countDebits -= countDebits;
      }
    });

    setCount(countDebits);
  };
  //toggle smart select
  const toggleSmartSelect = (e) => {
    const checked = e.target.checked;
    const smartCheckbox = document.querySelectorAll(".smart_card");
    smartCheckbox.forEach((element) => {
      if (checked) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
  };
  //toggle Access fee select
  const toggleAccessSelect = (e) => {
    const checked = e.target.checked;
    const accessFeeCheckbox = document.querySelectorAll(".access_fee");
    accessFeeCheckbox.forEach((element) => {
      if (checked) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
  };

  useEffect(() => {
    getData("fetch_corporates")
      .then((data) => {
        setCorporate(data);
      })
      .catch((error) => {
        console.log(error);
      });
    getData("fetch_individuals")
      .then((data) => {
        setIndividuals(data);
      })
      .catch((error) => {
        console.log(error);
      });
    getData("fetch_products")
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });
    getData("fetch_family_relation")
      .then((data) => {
        setFamilyRelation(data);
      })
      .catch((error) => {
        console.log(error);
      });
    getOneData("fetch_client_address", 4)
      .then((data) => {
        setAddress(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    switch (choosenOption) {
      case "1":
        setDisabled({
          family: true,
          corporate: false,
          debits: true,
          user: true,
        });
        break;
      case "2":
        setDisabled({
          family: true,
          corporate: false,
          debits: false,
          user: true,
        });
        break;
      case "3":
        setDisabled({
          family: false,
          corporate: true,
          debits: true,
          user: true,
        });
        break;
      case "4":
        setDisabled({
          family: false,
          corporate: true,
          debits: false,
          user: true,
        });
        break;
      case "5":
        setDisabled({
          family: true,
          corporate: false,
          debits: true,
          user: true,
        });
        break;
      case "6":
        setDisabled({
          family: false,
          corporate: true,
          debits: true,
          user: true,
        });
        break;
      default:
        setDisabled({
          family: true,
          corporate: true,
          debits: true,
          user: true,
        });
        break;
    }
  }, [choosenOption]);

  useEffect(() => {
    let countDebits = 0;
    if (businessClass.length > 0) {
      const frmData = new FormData(
        document.getElementById("dropdown_select_form")
      );
      frmData.append("business_class", businessClass);
      frmData.append("family_no", document.getElementById("family_no").value);
      frmData.append(
        "effective_date_main",
        document.getElementById("effective_date_main").value
      );
      postData(frmData, "fetch_corp_population")
        .then((data) => {
          if (data.length !== 0) {
            //return console.log(data)
            if (data.note) {
              setResponse(data.note);
              setIsMessageModal(true);
            } else {
              console.log(data[0]);
              setMemberDetails(data);

              setIsModalOpen(true);
              const debitCheckbox = document.querySelectorAll(".debit");
              debitCheckbox.forEach((element) => {
                countDebits++;
              });
              setCount(countDebits);
            }
          } else {
            setResponse("No members to debit");
            setIsMessageModal(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [businessClass]);

  const closeModal = () => {
    setIsModalOpen(false);
    setModalFiveOpen(false);
  };
  const closeMessageModal = () => {
    setIsMessageModal(false);
  };
  //fetch corporate anniversary dates
  const fetchCorporateData = (e) => {
    e.preventDefault();
    //reset form
    setPremiumData([]);
    setMemberDetails([]);
    setMemberPremiumData([]);
    const select_dropdown = document.getElementById("select_dropdown").value;
    getTwoData(
      "get_corporate_anniversary_dates",
      select_dropdown,
      e.target.value
    ).then((data) => {
      setAnniversaryDates(data);
      setDisabled({ ...disabled, save_btn: "false" });
    });
  };

  const sendMembershipDetails = () => {
    const inv_type = document.getElementById("invoice_type_modal").value;
    if (inv_type !== "0") {
      setOtherCharges({
        contingency: document.getElementById("membership_contigency").value,
        giftItems: document.getElementById("membership_gift_items").value,
        firstAid: document.getElementById("membership_first_aid").value,
        stampDuty: document.getElementById("membership_stamp_duty").value,
        others: document.getElementById("membership_others").value,
      });
      const frmData = new FormData(document.getElementById("frmMemberDetails"));
      const debitCheckbox = document.querySelectorAll(".debit");
      const smartCheckbox = document.querySelectorAll(".smart_card");
      const accessFeeCheckbox = document.querySelectorAll(".access_fee");
      debitCheckbox.forEach((element) => {
        if (element.checked == true) {
          frmData.append("debit[]", "1");
        } else {
          frmData.append("debit[]", "0");
        }
      });
      smartCheckbox.forEach((element) => {
        if (element.checked == true) {
          frmData.append("smart_card[]", "1");
        } else {
          frmData.append("smart_card[]", "0");
        }
      });
      accessFeeCheckbox.forEach((element) => {
        if (element.checked == true) {
          frmData.append("access_fee[]", "1");
        } else {
          frmData.append("access_fee[]", "0");
        }
      });
      frmData.append("corp_id", document.getElementById("corp").value);
      frmData.append(
        "principal_member_no",
        document.getElementById("family_no").value
      );
      frmData.append("days", document.getElementById("days").value);
      frmData.append(
        "transaction",
        document.getElementById("transaction").value
      );
      frmData.append(
        "business_class",
        document.getElementById("business_class").value
      );
      frmData.append("choosen_option", choosenOption);
      frmData.append("family_no", document.getElementById("family_no").value);
      frmData.append("agent_id", anniversaryDates.agent_id);
      frmData.append("max_anniv", anniversaryDates.max_anniv);
      frmData.append("invoice_type", businessClass);
      document.getElementById("spinner").style.display = "block";
      //fetching member premiums
      postData(frmData, "calculate_member_premiums")
        .then((data) => {
          setPremiumData(data);
          setMemberPremiumData(data[0].member_premiums);
          document.getElementById("spinner").style.display = "none";

          //fetching agent commission rates
          const frmData2 = new FormData();
          frmData2.append("choosen_option", choosenOption);
          frmData2.append("loaded_premium", data[0].loaded_prem);
          frmData2.append("corp_id", document.getElementById("corp").value);
          frmData2.append(
            "principal_member_no",
            document.getElementById("family_no").value
          );
          frmData2.append(
            "biz_type",
            document.getElementById("business_class").value
          );
          frmData2.append(
            "invoice_type",
            document.getElementById("invoice_type_modal").value
          );
          frmData2.append("agent_id", anniversaryDates.agent_id);
          postData(frmData2, "get_agent_rates").then((data) => {
            setAgentRates(data);
          });
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.log(error);
          setResponse("Error ! There was an error debiting");
          setIsMessageModal(true);
        });
    } else {
      setResponse("Notice ! Select Invoice Type");
      setIsMessageModal(true);
    }
  };
  //save premium debiting form
  const savePremiumDebiting = (e) => {
    e.preventDefault();
    const frmData3 = new FormData(document.getElementById("formMember"));
    frmData3.append("choosen_option", choosenOption);
    frmData3.append("corp_id", document.getElementById("corp").value);
    frmData3.append(
      "principal_member_no",
      document.getElementById("individual_member_no").value
    );
    document.getElementById("spinner").style.display = "block";
    postData(frmData3, "save_premium_debiting")
      .then((data) => {
        setReferenceNo(data);
        console.log(data);
        document.getElementById("spinner").style.display = "none";
        setResponse(data.response);
        setModalFiveOpen(true);
        setDisabled({ ...disabled, save_btn: "true" });       
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("spinner").style.display = "none";
      });
  };
  //print document
  const printDocument = () => {
    let page_header = `
<div style="display: inline-block;">
<ul style="list-style-type: none; text-align: left; " class="col-md-4 text-left float-left">
        <li>${address.client_name}</li>
        <li>${address.physical_location}</li>
        <li>${address.box_no}</li>
        <li>${address.tel_cell}</li>
        <li>${address.fax}</li>
        <li>${address.email}</li>
        <li>${address.url}</li>
      </ul>
      <ul style="list-style-type: none; text-align: right;" class="col-md-4 text-left float-right">
       <li>Debit Note:</li>
       <li>Tin No: </li>
       <li>Reference No: </li>
       <li>Dated: </li>
       <li>Policy No: </li>
                                                     
       
      </ul>
</div>
      
      
   `;
    let user = localStorage.getItem("username");
    let tbl_head = "";
    let tbl_body = "";

    const header = document.querySelector("#invoice_details_1 thead").children;
    for (let trs of header) {
      tbl_head += `
        <tr>
          <th>${trs.children[0].textContent}</th>
          <th>${trs.children[1].textContent}</th>
          <th>${trs.children[2].textContent}</th>
          <th>${trs.children[3].textContent}</th>
          <th>${trs.children[4].textContent}</th>
          <th>${trs.children[5].textContent}</th>
          <th>${trs.children[6].textContent}</th>
          <th>${trs.children[7].textContent}</th>
          <th>${trs.children[8].textContent}</th>
          <th>${trs.children[9].textContent}</th>
          <th>${trs.children[10].textContent}</th>
          <th>${trs.children[11].textContent}</th>
        
        </tr>
      `;
    }

    const body = document.querySelector("#invoice_details_1 tbody").children;
    for (let trs of body) {
      tbl_body += `
        <tr>
          <td>${trs.children[0].children[0].value}</td>
          <td>${trs.children[1].children[0].value}</td>
          <td>${trs.children[2].children[0].value}</td>
          <td>${trs.children[3].children[0].value}</td>
          <td>${trs.children[4].children[0].value}</td>
          <td>${
            trs.children[5].children[0].options[
              trs.children[5].children[0].selectedIndex
            ].text
          }</td>
          <td>${
            trs.children[6].children[0].value != ""
              ? parseFloat(trs.children[6].children[0].value).toLocaleString()
              : "0.00"
          }</td>
          <td>${
            trs.children[7].children[0].value != ""
              ? parseFloat(trs.children[7].children[0].value).toLocaleString()
              : "0.00"
          }</td>
          <td>${
            trs.children[8].children[0].value != ""
              ? parseFloat(trs.children[8].children[0].value).toLocaleString()
              : "0.00"
          }</td>
          <td>${
            trs.children[9].children[0].value != ""
              ? trs.children[9].children[0].value
              : "0.00"
          }</td> 
          <td>${
            trs.children[10].children[0].value != ""
              ? trs.children[10].children[0].value
              : "0.00"
          }</td>
          <td>${
            trs.children[11].children[0].value != ""
              ? trs.children[11].children[0].value
              : "0.00"
          }</td>
        </tr>
      `;
    }
    const footer = document.querySelector("#invoice_details_1 tfoot").children;
    //return console.log(footer[0].children[5].textContent);
    let tbl_foot = `
        <tr>
          <th>${footer[0].children[0].textContent}</th>
          <th>${footer[0].children[1].textContent}</th>
          <th>${footer[0].children[2].textContent}</th>
          <th>${footer[0].children[3].textContent}</th>
          <th>${footer[0].children[4].textContent}</th>
          <th>${footer[0].children[5].textContent}</th>
          <th>${footer[0].children[6].textContent}</th>
          <th>${footer[0].children[7].textContent}</th>
          <th>${footer[0].children[8].textContent}</th>
          <th>${footer[0].children[9].textContent}</th>
          <th>${footer[0].children[10].textContent}</th>
          <th>${footer[0].children[11].textContent}</th>
        </tr>
      `;
    let html = `
    <div class="row">
    <div style="text-align:right;">${page_header}</div>
    <br><br><br>
     <div><table><thead>${tbl_head}</thead><tbody>${tbl_body}</tbody><tfoot>${tbl_foot}</tfoot></table></div>
    <div></div>
    <br><br><br> 
     <p>Prepared By: ${user}</p>
    <br/>
    <p>Received By: __________________________   Date Received: __________________________</p>  
    </div>
    `;
    var val = htmlToPdfmake(html);
    var dd = {
      pageOrientation: "landscape",
      pageMargins: [40, 60, 40, 60],
      content: val,
      pageSize: "A4",
    };
    pdfMake.createPdf(dd).download();
  };
  //textarea
  const divide = () => {
    var txt;
    txt = document.getElementById("bank_details").value;
    var text = txt.split(".");
    var str = text.join(".</br>");
    document.write(str);
  };
  return (
    <div>
      <div className="querycorporate">
        <div className="">
          <form id={"dropdown_select_form"}>
            <div className="col-md-12">
              <div className="row pr-0">
                <label
                  htmlFor="task"
                  className="col-form-label col-sm-2 label-right pr-2 pl-0"
                >
                  Select Task:
                </label>
                <div className="col-md-3">
                  <select
                    className="form-control col-md-12"
                    id="select_dropdown"
                    name="task"
                    defaultValue="0"
                    onChange={(e) => setChoosenOption(e.target.value)}
                  >
                    <option disabled value="0">
                      Select Option
                    </option>
                    <option value="1">Debit Corporate</option>
                    {/* <option value="2">Query Corporate Debit</option> */}
                    <option value="3">Debit Family</option>
                    {/* <option value="4">Query Family Debit</option> */}
                    {/* <option value="5">Manual Invoice - Corporate</option> */}
                    {/* <option value="6">Manual Invoice - Retail</option> */}
                  </select>
                </div>
                <div className="col-md-4">
                  <select
                    name="corp"
                    id="corp"
                    className={"form-control"}
                    hidden={disabled.corporate}
                    onChange={fetchCorporateData}
                  >
                    <option value="0">Select Corporate</option>
                    {corporate.map((dt) => {
                      return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
                    })}
                  </select>
                  <select
                    name="individual_member_no"
                    id="individual_member_no"
                    className={"form-control"}
                    hidden={disabled.family}
                    onChange={fetchCorporateData}
                  >
                    <option value="0">Select Family</option>
                    {individuals.map((dt) => {
                      return (
                        <option value={dt.member_no}>
                          {dt.principal_names + " - " + dt.member_no}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-3" hidden={disabled.debits}>
                  <select name="debits" className={"form-control"}>
                    <option value="0">Select Debit/Credit</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <section id="member_tabs" className="project-tab">
        <div className="">
          <div className="row">
            <div className="col-md-12">
              <h4
                className="text-info"
                style={{ textAlign: "center", fontWeight: "bolder" }}
              >
                Debiting
              </h4>
              <form className="claims_form mt-1" id="formMember">
                {/* progressbar */}
                <ul id="progressbar" className="col-md-12">
                  <li className="active">Summary</li>
                  <li>Details</li>
                  <li>View Details</li>
                  {/* <li>View Summary</li>
                    <li>Member Schedule</li>
                    <li>Payment Schedule</li> */}
                </ul>
                <fieldset>
                  <div
                    className="row col-md-12 col-sm-12 pr-0 pl-0 ml-0"
                    id="step-1"
                  >
                    <div className="card col-md-12">
                      <div className="row">
                        <div className="col-md-7">
                          <div className="form-group row ml-0">
                            <p id="headers" className="col-12">
                              Summary
                            </p>
                            <hr />
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
                                required="true"
                                id="reference_no"
                                value={
                                  referenceNo !== 0
                                    ? referenceNo.reference_no
                                    : 0
                                }
                                readOnly
                              />
                            </div>
                            <label
                              htmlFor="first_name"
                              className="col-form-label col-sm-2 label-align pr-0 pl-0"
                            >
                              Anniv
                              <span className="required">*</span>
                            </label>
                            <div className="col-md-4 col-sm-4">
                              <input
                                type="number"
                                className="form-control"
                                name="anniv"
                                required="true"
                                value={anniversaryDates.max_anniv}
                                id="anniv"
                              />
                              {/*hidden input field for family number*/}
                              <input
                                type="text"
                                className="form-control"
                                value={anniversaryDates.family_no}
                                id="family_no"
                                style={{ display: "none" }}
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="Invoice_date"
                              className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                            >
                              Invoice Date
                            </label>
                            <div className="col-md-4 col-sm-4 ">
                              <input
                                type="text"
                                className="form-control"
                                name="Invoice_date"
                                id="Invoice_date"
                                value={today2()}
                                readOnly
                              />
                            </div>
                            <label
                              htmlFor="effective_date"
                              className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                            >
                              Effective Date
                            </label>
                            <div className="col-md-4 col-sm-4">
                              <input
                                type="date"
                                className="form-control"
                                id="effective_date_main"
                                name="effective_date_main"
                                value={anniversaryDates.start_date}
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="end_date"
                              className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                            >
                              End Date
                            </label>
                            <div className="col-md-4 col-sm-4">
                              <input
                                type="date"
                                className="form-control"
                                id="end_date"
                                name="end_date"
                                value={anniversaryDates.end_date}
                              />
                            </div>
                            <label
                              htmlFor="Days"
                              className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                            >
                              Days
                            </label>
                            <div className="col-md-4 col-sm-4">
                              <input
                                type="number"
                                className="form-control"
                                id="days"
                                name="days"
                                value={anniversaryDates.days}
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="transaction"
                              className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                            >
                              Transaction
                            </label>
                            <div className="col-md-4">
                              <select
                                name="transaction"
                                id={"transaction"}
                                className="form-control"
                              >
                                <option value="0">Select Transaction</option>
                                <option value="1">Debit Note</option>
                                <option value="2">Credit Note</option>
                              </select>
                            </div>
                            <label
                              htmlFor="business_class"
                              className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                            >
                              Business Class
                            </label>
                            <div className="col-md-4">
                              <select
                                name="business_class"
                                id="business_class"
                                className="form-control"
                                onChange={(e) =>
                                  setBusinessClass(e.target.value)
                                }
                              >
                                <option value="0">Select Business Class</option>
                                <option value="1">New</option>
                                <option value="2">Renewal</option>
                                {/*<option value="3">Addition</option>*/}
                                {/* <option value="4">Deletion</option>*/}
                                {/*<option value="5">Cover Up Grade</option>*/}
                                {/* <option value="6">Cover Down Grade</option>*/}
                                <option value="7">Addition EnMass</option>
                                {/*<option value="8">Cover Extension</option>*/}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="form-group row ml-0">
                            <p id="headers" className="col-12">
                              Agent Rates
                            </p>
                            <hr />
                          </div>
                          <div className="form-group row ml-0 ">
                            <label
                              htmlFor="agent_rate"
                              className="col-form-label col-md-3 label-align pl-0 pr-0"
                            >
                              Agent Rate
                            </label>
                            <div className="col-md-9">
                              <input
                                type="text"
                                className="form-control"
                                name="agent_rate"
                                value={agentRates.commission_rate}
                                required="true"
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="bdm_rate"
                              className="col-form-label col-md-3 label-align pl-0 pr-0"
                            >
                              BDM Rate
                            </label>
                            <div className="col-md-9">
                              <input
                                type="text"
                                className="form-control"
                                name="bdm_rate"
                                value={agentRates.bdm}
                                required="true"
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="asst_hos_rate"
                              className="col-form-label col-md-3 label-align pl-0 pr-0"
                            >
                              Asst Hos Rate
                            </label>
                            <div className="col-md-9 col-sm-9">
                              <input
                                type="text"
                                className="form-control"
                                name="asst_hos_rate"
                                id="asst_hos_rate"
                                value={agentRates.asst_hos}
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="hos_rate"
                              className="col-form-label col-md-3 label-align pl-0 pr-0"
                            >
                              Hos Rate
                            </label>
                            <div className="col-md-9 col-sm-9">
                              <input
                                type="text"
                                className="form-control"
                                name="hos_rate"
                                id="hos_rate"
                                value={agentRates.hos_rate}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card col-md-12">
                      <div className="row">
                        <Spinner />
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <p id="headers">Smart Fee</p>
                          <hr />
                          <div className="form-group row ml-0 ">
                            <label
                              htmlFor="new_cards"
                              className="col-form-label col-md-3 label-align pr-0 pl-0"
                            >
                              New Cards
                            </label>
                            <div className="col-md-8 ">
                              <input
                                type="text"
                                className="form-control"
                                id="new_cards"
                                name="new_cards"
                                value={
                                  premiumData.length !== 0
                                    ? parseFloat(
                                        premiumData[0].total_smart_card_fee
                                      ).toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0 ">
                            <label
                              htmlFor="access_fee"
                              className="col-form-label col-md-3 label-align pr-0 pl-0"
                            >
                              Access Fee
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="access_fee"
                                name="access_fee"
                                value={
                                  premiumData.length !== 0
                                    ? parseFloat(
                                        premiumData[0].total_smart_access_fee
                                      ).toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="notes"
                              className="col-form-label col-md-3 col-sm-2 label-align pr-0 pl-0"
                            >
                              Notes
                            </label>
                            <div className="col-md-8">
                              <textarea
                                className="form-control"
                                id="notes"
                                name="notes"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <p id="headers">Levies</p>
                          <hr />
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="iiu_tax"
                              className="col-form-label col-md-3 label-align pr-0 pl-0"
                            >
                              IIU TAX
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="iiu_tax"
                                name="iiu_tax"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].iiu.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="ira_tax"
                              className="col-form-label col-md-3 label-align pr-0 pl-0"
                            >
                              IRA TAX
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="ira_tax"
                                name="ira_tax"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].ira.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="invoice_type"
                              className="col-form-label col-md-3 label-align pr-0 pl-0"
                            >
                              Invoice Type
                            </label>
                            <div className="col-md-8">
                              <select
                                name="invoice_type_modal"
                                id="invoice_type_modal_front"
                                className="form-control"
                                value={invoiceType}
                              >
                                <option disabled value="0">
                                  Select Invoice Type
                                </option>
                                <option value="1">Addition New</option>
                                <option value="2">Addition Renewal</option>
                                <option value="3">New</option>
                                <option value="4">Organic Growth</option>
                                <option value="5">Renewal</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <p id="headers">Amounts</p>
                          <hr />
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="invoice_total"
                              className="col-form-label col-md-3 col-sm-2 label-align pr-0 pl-0"
                            >
                              Invoice Total
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="invoice_total"
                                name="invoice_total"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].invoice_total.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="premium_net"
                              className="col-form-label col-md-3 col-sm-2 label-align pr-0 pl-0"
                            >
                              Premium Net
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="premium_net"
                                name="premium_net"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].loaded_prem.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0 ">
                            <label
                              htmlFor="invoice_total"
                              className="col-form-label col-md-3 col-sm-2 label-align pr-0 pl-0"
                            >
                              Invoice Net
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="invoice_net"
                                name="invoice_net"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].invoice_total.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card col-md-12">
                      <div className="row">
                        <div className="col-md-8">
                          <p id="headers">Other Charges</p>
                          <hr />

                          <div className="form-group row ml-0">
                            <label
                              htmlFor="contingency"
                              className="col-form-label col-md-2 label-align pr-0 pl-0"
                            >
                              Contingency
                            </label>
                            <div className="col-md-4">
                              <input
                                type="number"
                                className="form-control"
                                id="contingency"
                                name="contingency"
                                value={otherCharges.contingency}
                              />
                            </div>
                            <label
                              htmlFor="gift_items"
                              className="col-form-label col-md-2 label-align pr-0 pl-2"
                            >
                              Gift Items
                            </label>
                            <div className="col-md-4">
                              <input
                                type="number"
                                className="form-control"
                                id="gift_items"
                                name="gift_items"
                                value={otherCharges.giftItems}
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="first_aid"
                              className="col-form-label col-md-2 label-align pr-0 pl-0"
                            >
                              First Aid
                            </label>
                            <div className="col-md-4 ">
                              <input
                                type="text"
                                className="form-control"
                                id="first_aid"
                                name="first_aid"
                                value={otherCharges.firstAid}
                              />
                            </div>
                            <label
                              htmlFor="stamp_duty"
                              className="col-form-label label-align col-md-2 pr-0 pl-2"
                            >
                              Stamp Duty
                            </label>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                id="stamp_duty"
                                name="stamp_duty"
                                value={otherCharges.stampDuty}
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="others"
                              className="col-form-label label-align col-md-2 pr-0 pl-0"
                            >
                              Others
                            </label>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                id="others"
                                name="others"
                                value={otherCharges.others}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <p id="headers">Reinsurance</p>
                          <hr />
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="retained"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              Retained
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="retained"
                                name="retained"
                                value={
                                  premiumData.length !== 0
                                    ? parseFloat(
                                        premiumData[0].retained
                                      ).toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="ceded"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              Ceded
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="ceded"
                                name="ceded"
                                value={
                                  premiumData.length !== 0
                                    ? parseFloat(
                                        premiumData[0].ceded
                                      ).toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div
                            className="form-group row ml-0"
                            hidden={disabled.user}
                          >
                            <label
                              htmlFor="user"
                              className="col-form-label col-md-2 col-sm-2 label-align text-center   pr-0 pl-0"
                            >
                              User:
                              <span className="required">*</span>
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next button */}
                  <input
                    id="invoice_button_next"
                    type="button"
                    name="next"
                    className="next action-button-previous btn-info col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <div>
                    <h2 id="headings" className="fs-title">
                      Details
                    </h2>
                  </div>
                  <hr />

                  <div className="row table-responsive">
                    <table
                      className="table table-bordered"
                      style={{ maxHeight: "300px" }}
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th>Member No</th>
                          <th>Category</th>
                          <th>Principal Name</th>
                          <th>Member Name</th>
                          <th>Product Name</th>
                          <th>Family Size</th>
                          <th>Family Title</th>
                          <th>Age</th>
                          <th>Effective Date</th>
                          <th>End Date</th>
                          <th>Prorata Period</th>
                          <th>Premium</th>
                          <th>Total</th>
                          <th>Prorated Prem</th>
                          <th>Disc %</th>
                          <th>Discounted Prem</th>
                          <th>Load %</th>
                          <th>Loaded Prem</th>
                          <th>Smart Cost</th>
                          <th>Access Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memberPremiums.map((dt) => {
                          return (
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="member_no[]"
                                  value={dt.member_no}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="health_plan[]"
                                  value={dt.health_plan}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="principal_name[]"
                                  value={dt.principal_name}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="member_name[]"
                                  value={dt.member_name}
                                />
                              </td>
                              <td>
                                <select
                                  name="product_name[]"
                                  className="form-control"
                                  defaultValue={dt.h_option}
                                >
                                  {products.map((data) => {
                                    return (
                                      <option key={data.code} value={data.code}>
                                        {data.product_name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td>
                                <select
                                  type="text"
                                  className="form-control"
                                  name="family_size[]"
                                  value={dt.family_size}
                                >
                                  <option value={dt.family_size}>
                                    {dt.family_size > 1
                                      ? "M + " + (dt.family_size - 1)
                                      : "M"}
                                  </option>
                                </select>
                              </td>
                              <td>
                                <select
                                  className="form-control"
                                  name="relation[]"
                                  value={dt.relation}
                                >
                                  {familyRelation.map((data) => {
                                    return (
                                      <option key={data.CODE} value={data.CODE}>
                                        {data.RELATION}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="age[]"
                                  value={dt.age}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="member_effective_date[]"
                                  value={dt.effective_date}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="member_end_date[]"
                                  value={dt.end_date}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="prorata_period[]"
                                  value={dt.prorata_period}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="member_premium[]"
                                  value={
                                    dt.member_premium === null
                                      ? 0
                                      : parseFloat(
                                          dt.member_premium
                                        ).toLocaleString()
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="total_premium[]"
                                  value={
                                    dt.member_premium === null
                                      ? 0
                                      : parseFloat(
                                          dt.member_premium
                                        ).toLocaleString()
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="prorata_premium[]"
                                  value={
                                    dt.prorata_premium === null
                                      ? 0
                                      : parseFloat(
                                          dt.prorata_premium
                                        ).toLocaleString()
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="discount_percent[]"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="discounted_premium[]"
                                  value={
                                    dt.prorata_premium === null
                                      ? 0
                                      : parseFloat(
                                          dt.prorata_premium
                                        ).toLocaleString()
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="load_percent[]"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="loaded_premium[]"
                                  value={
                                    dt.prorata_premium === null
                                      ? 0
                                      : parseFloat(
                                          dt.prorata_premium
                                        ).toLocaleString()
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="smart_cost[]"
                                  value={
                                    dt.smart_cost === null
                                      ? 0
                                      : parseFloat(
                                          dt.smart_cost
                                        ).toLocaleString()
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="access_cost[]"
                                  value={
                                    dt.access_cost === null
                                      ? 0
                                      : parseFloat(
                                          dt.access_cost
                                        ).toLocaleString()
                                  }
                                />
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
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th>Totals</th>
                          <th>
                            {premiumData.length != 0
                              ? parseFloat(
                                  premiumData[0].total_premium
                                ).toLocaleString()
                              : 0}
                          </th>
                          <th>
                            {premiumData.length != 0
                              ? parseFloat(
                                  premiumData[0].loaded_prem
                                ).toLocaleString()
                              : 0}
                          </th>
                          <th></th>
                          <th>
                            {premiumData.length != 0
                              ? parseFloat(
                                  premiumData[0].loaded_prem
                                ).toLocaleString()
                              : 0}
                          </th>
                          <th></th>
                          <th>
                            {premiumData.length != 0
                              ? parseFloat(
                                  premiumData[0].loaded_prem
                                ).toLocaleString()
                              : 0}
                          </th>
                          <th>
                            {premiumData.length != 0
                              ? parseFloat(
                                  premiumData[0].total_smart_card_fee
                                ).toLocaleString()
                              : 0}
                          </th>
                          <th>
                            {premiumData.length != 0
                              ? parseFloat(
                                  premiumData[0].total_smart_access_fee
                                ).toLocaleString()
                              : 0}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div>
                    <h2 id="headings" className="fs-title">
                      Levies
                    </h2>
                    <div className="card">
                      <div className={"row"}>
                        <div className={"col-md-4 mr-0 ml-0 pr-0 pl-0"}>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="contingency"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              Contingency
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="contingency"
                                name="contingency"
                                value={otherCharges.contingency}
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="first_aid"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              First Aid
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="first_aid"
                                name="first_aid"
                                value={otherCharges.firstAid}
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="gift_items"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              Gift Items
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="gift_items"
                                name="gift_items"
                                value={otherCharges.giftItems}
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="others"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              Others
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="others"
                                name="others"
                                value={otherCharges.others}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={"col-md-4 mr-0 ml-0 pr-0 pl-0"}>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="ira_tax"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              IRA Tax
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="ira_tax"
                                name="ira_tax"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].ira.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="iiu_tax"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              IIU Tax
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="iiu_tax"
                                name="iiu_tax"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].iiu.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="new_cards"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              New Cards
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="new_cards"
                                name="new_cards"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].total_smart_card_fee.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="access_fee"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              Access Fee
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="access_fee"
                                name="access_fee"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].total_smart_access_fee.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className={"col-md-4 mr-0 ml-0 pr-0 pl-0"}>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="premium_net"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              Premium Net
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="premium_net"
                                name="premium_net"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].loaded_prem.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="invoice_total"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              Invoice Total
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="invoice_total"
                                name="invoice_total"
                                value={
                                  premiumData.length !== 0
                                    ? premiumData[0].invoice_total.toLocaleString()
                                    : 0
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row ml-0">
                            <label
                              htmlFor="stamp_duty"
                              className="col-form-label label-align col-md-3 pr-0 pl-0"
                            >
                              Stamp Duty
                            </label>
                            <div className="col-md-8">
                              <input
                                type="text"
                                className="form-control"
                                id="stamp_duty"
                                name="stamp_duty"
                                value={otherCharges.stampDuty}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row"></div>
                  {/* Previous button */}
                  <input
                    type="button"
                    name="previous"
                    id="query_previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    defaultValue="Previous"
                  />
                  {/*Save button*/}
                  
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={disabled.save_btn}
                    onClick={savePremiumDebiting}
                    style={{margin:"5px"}}
                  >
                    Save
                  </button>

                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button-previous btn-info col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <div id={"invoice_details_1"}>
                    <h2 className="fs-title">View Details</h2>
                    <div className="row addresses">
                      <div className={"col-md-12"}>
                        <div className="col-md-4 float-right text-left">
                          <h6>{address.client_name}</h6>
                          <h6>{address.physical_location}</h6>
                          <h6>{address.box_no}</h6>
                          <h6>{address.tel_cell}</h6>
                          <h6>{address.fax}</h6>
                          <h6>{address.email}</h6>
                          <h6>{address.url}</h6>
                        </div>
                        <h6 style={{ textAlign: "left" }}>
                          Debit Note <br />
                          Tin No: <br />
                          Reference No: <br />
                          Dated: <br />
                          Policy No: <br />
                          <br />
                          Client: <br />
                          P.O Box: <br />
                          Tel: <br />
                          Cover Period: <br />
                          Class: <br />
                          Underwriter: <br />
                        </h6>
                      </div>
                    </div>
                    <alert className={"bg-light"}>
                      <div className={"row"}>
                        <div className={"col-md-2"}>
                          AAR HEALTH SERVICES(U)LTD.
                        </div>
                        <div className={"col-md-2"}>UGX: 0104012078000.</div>
                        <div className={"col-md-2"}>USD: 8704012078000.</div>
                        <div className={"col-md-2"}>STANDARD CHARTERED.</div>
                        <div className={"col-md-2"}>BRANCH: SPEKE ROAD.</div>
                        <div className={"col-md-2"}>SWIFT CODE: SCBLUGKA</div>
                      </div>
                    </alert>
                    <hr />
                    <div className={"row"}>
                      <table className="table table-bordered">
                        <thead className="thead-dark">
                          <tr>
                            <th>Category</th>
                            <th>Principal Member</th>
                            <th>Family Member</th>
                            <th>Benefit</th>
                            <th>Limit</th>
                            <th>Family Size</th>
                            <th>Premium</th>
                            <th>Prorated</th>
                            <th>Disc %</th>
                            <th>Discounted</th>
                            <th>Load %</th>
                            <th>Loaded</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memberPremiums.map((dt) => {
                            return (
                              <tr>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.health_plan}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.principal_name}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.member_name}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      dt.benefit === null ? "" : dt.benefit
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={dt.bank === null ? "" : dt.bank}
                                  />
                                </td>
                                <td>
                                  <select
                                    type="text"
                                    className="form-control"
                                    value={dt.family_size}
                                  >
                                    <option value={dt.family_size}>
                                      {dt.family_size > 1
                                        ? "M + " + (dt.family_size - 1)
                                        : "M"}
                                    </option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      dt.member_premium === null
                                        ? 0
                                        : parseFloat(
                                            dt.member_premium
                                          ).toLocaleString()
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      dt.prorata_premium === null
                                        ? 0
                                        : parseFloat(
                                            dt.prorata_premium
                                          ).toLocaleString()
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      dt.disc_percent === null
                                        ? ""
                                        : dt.disc_percent
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      dt.prorata_premium === null
                                        ? 0
                                        : parseFloat(
                                            dt.prorata_premium
                                          ).toLocaleString()
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      dt.load_percent === null
                                        ? ""
                                        : dt.load_percent
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      dt.prorata_premium === null
                                        ? 0
                                        : parseFloat(
                                            dt.prorata_premium
                                          ).toLocaleString()
                                    }
                                  />
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
                            <th></th>
                            <th>Totals</th>
                            <th>
                              {premiumData.length != 0
                                ? parseFloat(
                                    premiumData[0].total_premium
                                  ).toLocaleString()
                                : 0}
                            </th>
                            <th>
                              {premiumData.length != 0
                                ? parseFloat(
                                    premiumData[0].loaded_prem
                                  ).toLocaleString()
                                : 0}
                            </th>
                            <th></th>
                            <th>
                              {premiumData.length != 0
                                ? parseFloat(
                                    premiumData[0].loaded_prem
                                  ).toLocaleString()
                                : 0}
                            </th>
                            <th></th>
                            <th>
                              {premiumData.length != 0
                                ? parseFloat(
                                    premiumData[0].loaded_prem
                                  ).toLocaleString()
                                : 0}
                            </th>
                          </tr>
                          {/*<tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            className={"form-control"}
                                                            value={"IIU Tax:"}
                                                            style={{fontWeight: "bold"}}
                                                        />
                                                    </td>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={
                                                                premiumData.length !== 0
                                                                    ? premiumData[0].iiu.toLocaleString()
                                                                    : 0
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            className={"form-control"}
                                                            value={"Prepared By:"}
                                                            style={{fontWeight: "bold"}}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control text-uppercase"
                                                            value={localStorage.getItem("username")}
                                                            placeholder="User"
                                                            style={{fontWeight: "bold"}}
                                                        />
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            className={"form-control"}
                                                            value={"IRA Tax:"}
                                                            style={{fontWeight: "bold"}}
                                                        />
                                                    </td>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={
                                                                premiumData.length !== 0
                                                                    ? premiumData[0].ira.toLocaleString()
                                                                    : 0
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            className={"form-control"}
                                                            style={{fontWeight: "bold"}}
                                                            value={"Authorised By:"}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className={"form-control"}
                                                            style={{borderBottom: "1px solid #000"}}
                                                        />
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            className={"form-control"}
                                                            style={{fontWeight: "bold"}}
                                                            value={"Contigency:"}
                                                        />
                                                    </td>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={
                                                                premiumData.length !== 0
                                                                    ? premiumData[0].iiu.toLocaleString()
                                                                    : 0
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            className={"form-control"}
                                                            value={"Net Premium:"}
                                                            style={{fontWeight: "bold"}}
                                                        />
                                                    </td>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            style={{fontWeight: "bold"}}
                                                            value={
                                                                premiumData.length !== 0
                                                                    ? premiumData[0].total_premium.toLocaleString()
                                                                    : 0
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>*/}
                        </tfoot>
                      </table>
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
                  {/*Print button */}
                  <input
                    type="button"
                    className="action-button btn-success col-md-4 ml-auto"
                    value="Print"
                    onClick={printDocument}
                  />
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next action-button-previous btn-info col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <div>
                    <h2 id="headings" className="fs-title">
                      View Summary
                    </h2>
                  </div>
                  <hr />
                  <div className="col-md-12 col-sm-12"></div>

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
                    className="next action-button-previous btn-info col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <div>
                    <h2 id="headings" className="fs-title">
                      Member Schedule
                    </h2>
                    <hr />
                  </div>
                  <div className="col-md-12">
                    <div className="row">
                      <table className="table table-bordered">
                        <thead className="thead-dark">
                          <tr>
                            <th>Reference No</th>
                            <th>Principal Name</th>
                            <th>Member No</th>
                            <th>Member Name</th>
                            <th>Limit</th>
                            <th>Family Size</th>
                            <th>Premium</th>
                            <th>Prorated</th>
                            <th>Disc %</th>
                            <th>Discounted</th>
                            <th>Load %</th>
                            <th>Loaded</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
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
                    className="next action-button-previous btn-info col-md-4 ml-auto"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <h2 id="headings" className="fs-title">
                    Payment Schedule
                  </h2>
                  <hr />
                  <div className="row ml-0">
                    <table className="table table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th>Payable Date</th>
                          <th>Payable Amt</th>
                          <th>Paid</th>
                          <th>Paid Date</th>
                          <th>Paid Amt</th>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </table>
                  </div>

                  <input
                    type="button"
                    name="previous"
                    className="previous action-button-previous col-md-4 btn-info"
                    value="Previous"
                  />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Modal4
        modalIsOpen={isModalOpen}
        closeModal={closeModal}
        header={<p id="headers">Membership details</p>}
        body={
          <div>
            <form id="frmMemberDetails">
              <div className="table-responsive">
                <table className="table table-bordered" id="member_details">
                  <thead className="thead-dark">
                    <tr>
                      <th>Member No</th>
                      <th>Category</th>
                      <th>Principal Name</th>
                      <th>Member Name</th>
                      <th>Product Name</th>
                      <th>Family Size</th>
                      <th>Family Title</th>
                      <th>DOB</th>
                      <th>Age</th>
                      <th>Effective Date</th>
                      <th>End Date</th>
                      <th>Debit</th>
                      <th>Smart Card</th>
                      <th>Access Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberDetails.map((dt) => {
                      if (dt.health_plan != null) {
                        return (
                          <tr>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="member_no[]"
                                value={dt.member_no}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="health_plan[]"
                                value={dt.health_plan}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="principal_name[]"
                                value={dt.principal_name}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="member_name[]"
                                value={dt.member_name}
                              />
                            </td>
                            <td>
                              <select
                                name="product_name[]"
                                className="form-control"
                                defaultValue={dt.h_option}
                              >
                                <option value={dt.h_option}>
                                  {dt.product_name}
                                </option>
                              </select>
                            </td>
                            <td>
                              <select
                                type="text"
                                className="form-control"
                                name="family_size[]"
                                value={dt.family_size}
                              >
                                <option value={dt.family_size}>
                                  {dt.family_size > 1
                                    ? "M + " + (dt.family_size - 1)
                                    : "M"}
                                </option>
                              </select>
                            </td>
                            <td>
                              <select
                                className="form-control"
                                name="relation[]"
                                value={dt.relation}
                              >
                                <option value={dt.family_title}>
                                  {dt.relation}
                                </option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="dob[]"
                                value={dt.dob}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="age[]"
                                value={age(dt.dob)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="effective_date[]"
                                value={dt.start_date}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                name="end_date[]"
                                value={dt.end_date}
                              />
                            </td>
                            <td>
                              <input
                                className={"debit"}
                                type="checkbox"
                                defaultChecked="true"
                                onChange={calculateDebitCount}
                              />
                            </td>
                            <td>
                              <input
                                className={"smart_card"}
                                type="checkbox"
                                value={dt.smart_sync}
                                defaultChecked={
                                  dt.smart_sync === "1" ? true : false
                                }
                              />
                            </td>
                            <td>
                              <input
                                className={"access_fee"}
                                type="checkbox"
                                value={dt.access_fee}
                                defaultChecked={
                                  dt.access_fee === "1" ? true : false
                                }
                              />
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            </form>
            <div className="row">
              <div className="col-md-4">
                <label
                  htmlFor="invoice_type"
                  className="col-form-label label-align col-md-2 pr-0 pl-0"
                >
                  Invoice Type
                </label>
                <select
                  name="invoice_type_modal"
                  id="invoice_type_modal"
                  className="form-control"
                  defaultValue={"0"}
                  onChange={(e) => setInvoiceType(e.target.value)}
                >
                  <option disabled value="0">
                    Select Invoice Type
                  </option>
                  <option value="1">Addition New</option>
                  <option value="2">Addition Renewal</option>
                  <option value="3">New</option>
                  <option value="4">Organic Growth</option>
                  <option value="5">Renewal</option>
                </select>
              </div>
              <div className="col-md-4">
                <label
                  htmlFor="invoice_type"
                  className="col-form-label label-align col-md-2 pr-0 pl-0"
                >
                  Debit Count
                </label>
                <input
                  className="form-control"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                  type="text"
                  value={count.toLocaleString()}
                  readOnly
                />
              </div>
              <div className="col-md-4" style={{ float: "right" }}>
                <div className="row">
                  <div>
                    <label htmlFor="invoice_type" className="col-md-2 ">
                      debit select
                    </label>
                    <input
                      className="form-control"
                      type="checkbox"
                      id="debit_select"
                      defaultChecked={true}
                      onChange={toggleDebitSelect}
                    />
                  </div>
                  <div>
                    <label htmlFor="invoice_type" className=" col-md-2 ">
                      smart select
                    </label>
                    <input
                      className="form-control"
                      type="checkbox"
                      id="smart_select"
                      defaultChecked={
                        memberDetails.length != 0
                          ? memberDetails[0].smart_sync === "1"
                            ? true
                            : false
                          : false
                      }
                      onChange={toggleSmartSelect}
                    />
                  </div>
                  <div>
                    <label htmlFor="invoice_type" className=" col-md-2 ">
                      access select
                    </label>
                    <input
                      className="form-control"
                      type="checkbox"
                      id="access_select"
                      defaultChecked={
                        memberDetails.length != 0
                          ? memberDetails[0].access_fee === "1"
                            ? true
                            : false
                          : false
                      }
                      onChange={toggleAccessSelect}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p id="headers">Other Charges</p>
              <hr />
              <div className="form-group row ml-0">
                <label
                  htmlFor="contigency"
                  className="col-form-label label-align col-md-1 pr-0 pl-0"
                >
                  Contigency
                </label>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    id="membership_contigency"
                    name="membership_contigency"
                  />
                </div>
                <label
                  htmlFor="stamp_duty"
                  className="col-form-label label-align col-md-1 pr-0 pl-0"
                >
                  Stamp Duty
                </label>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    id="membership_stamp_duty"
                    name="membership_stamp_duty"
                  />
                </div>
                <label
                  htmlFor="gift_items"
                  className="col-form-label label-align col-md-1 pr-0 pl-0"
                >
                  Gift Items
                </label>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    id="membership_gift_items"
                    name="membership_gift_items"
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="others"
                  className="col-form-label label-align col-md-1 pr-0 pl-0"
                >
                  Others
                </label>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    id="membership_others"
                    name="membership_others"
                  />
                </div>
                <label
                  htmlFor="first_aid"
                  className="col-form-label label-align col-md-1 pr-0 pl-0"
                >
                  First Aid
                </label>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    id="membership_first_aid"
                    name="membership_first_aid"
                  />
                </div>
              </div>
            </div>
          </div>
        }
        buttons={
          <div className="row">
            <div className="col-md-6">
              <button
                className="btn btn-danger"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-success"
                onClick={sendMembershipDetails}
              >
                Debit
              </button>
            </div>
          </div>
        }
      />
      <Modal5
        modalIsOpen={modalFiveOpen}
        closeModal={closeModal}
        background="#0047AB"
        header={<p id="headers">Premium Debiting</p>}
        body={
          <div>
            <div className={"row justify-content-center"}>
              <p className={"text-white font-weight-bold h4"}>{response[0]}</p>
            </div>
            <div className={"row justify-content-center"}>
              <p className={"text-white font-weight-bold h4"}>{response[1]}</p>
            </div>
          </div>
        }
      />

      <MessageModal
        modalIsOpen={messageModal}
        closeModal={closeMessageModal}
        background="#0047AB"
        body={<p className="text-white font-weight-bold h4">{response}</p>}
      />
    </div>
  );
};

export default PremiumDebiting;
