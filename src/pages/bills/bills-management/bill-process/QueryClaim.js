import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  getTwoData,
  postData,
} from "../../../../components/helpers/Data";
import { toInputUpperCase } from "../../../../components/helpers/toInputUpperCase";
import { today2 } from "../../../../components/helpers/today";
import Modal2 from "../../../../components/helpers/Modal4";
import { Spinner } from "../../../../components/helpers/Spinner";
import CustomModal from "../../../../components/helpers/Modal";
import Modal5 from "../../../../components/helpers/Modal2";
import MessageModal from "../../../../components/helpers/Modal2";

const QueryClaim = () => {
  const [disabled, setDisabled] = useState({
    claim: true,
    invoice: true,
    member: true,
    search: true,
    fetch: true,
    corporate: true,
  });
  const [choosenOption, setChoosenOption] = useState([]);
  const [provider, setProvider] = useState([]);
  const [benefit, setBenefit] = useState([]);
  const [products, setProducts] = useState([]);
  const [service, setService] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [billReasons, setBillReasons] = useState([]);
  const [deductionReason, setDeductionReason] = useState([]);
  const [deductionAmt, setDeductionAmt] = useState(0.0);
  const [claims, setClaims] = useState([]);
  const [claimsTotal, setClaimTotal] = useState([]);
  const [oneClaimsData, setOneClaimsData] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const [appendedDiagnosisRow, setAppendedDiagnosisRow] = useState([]);
  const [memberDiagnosis, setMemberDiagnosis] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCorporate, setSelectedCorporate] = useState([]);
  const [memberData, setMemberData] = useState([]);
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

  const [disabledInput, setDisabledInput] = useState(true);
  const [response, setResponse] = useState(false);
  const [isModal5Open, setModal5Open] = useState(false);
  const [messageModal, setIsMessageModal] = useState(false);
  const [vetStatus, setVetStatus] = useState([]);
  const [invoiceDate, setInvoiceDate] = useState([]);
  const [batchDateReceived, setBatchDateReceived] = useState([]);

  //enable editing
  const enableEditing = (e) => {
    if (e.target.checked) {
      setDisabledInput(false);
    } else {
      setDisabledInput(true);
    }
  };
  const closeModal2 = () => {
    setModal2IsOpen(false);
  };

  useEffect(() => {
    switch (choosenOption) {
      case "1":
        setDisabled({
          claim: false,
          invoice: true,
          member: true,
          search: false,
          fetch: true,
          corporate: true,
        });
        break;

      case "2":
        setDisabled({
          claim: true,
          invoice: false,
          member: true,
          search: false,
          fetch: true,
          corporate: true,
        });
        break;
      case "3":
        setDisabled({
          claim: true,
          invoice: true,
          member: false,
          search: true,
          fetch: false,
          corporate: false,
        });
        break;
    }
  }, [choosenOption]);

  useEffect(() => {
    getData("fetch_providers").then((data) => {
      setProvider(data);
    });
    getData("fetch_benefits").then((data) => {
      setBenefit(data);
    });
    getData("fetch_products").then((data) => {
      setProducts(data);
    });
    getData("fetch_services").then((data) => {
      setService(data);
    });
    getData("fetch_corporates").then((data) => {
      setCorporates(data);
    });
    getData("fetch_resend_bill_reason").then((data) => {
      setBillReasons(data);
    });
    getData("fetch_deduction_reason").then((data) => {
      setDeductionReason(data);
    });
  }, []);

  const fetchClaim = (e) => {
    setClaims([]);
    setClaimTotal([]);
    e.preventDefault([]);
    const task = document.getElementById("task_selected").value;
    const claim_no = document.getElementById("claim").value;
    const invoice_no = document.getElementById("invoice").value;
    if (task === "1" && !claim_no) {
      setResponse("Notice! Enter Claim Number");
      setIsMessageModal(true);
    } else if (task === "2" && !invoice_no) {
      setResponse("Notice! Enter Invoice Number");
      setIsMessageModal(true);
    } else {
      const frmData2 = new FormData();
      frmData2.append(
        "task_selected",
        document.getElementById("task_selected").value
      );
      frmData2.append("claim", document.getElementById("claim").value);
      frmData2.append("invoice", document.getElementById("invoice").value);
      document.getElementById("spinner").style.display = "block";
      postData(frmData2, "fetch_claims")
        .then((data) => {
          if (data[0].claims.length === 0) {
            //stop loader
            document.getElementById("spinner").style.display = "none";
            setResponse("Notice! No Records to Retrieve. Check Batch Number");
            setIsMessageModal(true);
          } else {
            setClaims(data[0].claims);
            setClaimTotal(data[0]);

            document.getElementById("spinner").style.display = "none";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const fetchMember = (e) => {
    setMemberData([]);
    e.preventDefault([]);
    if (selectedCorporate.length === 0) {
      setResponse("Enter Corporate");
      setIsMessageModal(true);
    }
    const frmData3 = new FormData();
    frmData3.append(
      "task_selected",
      document.getElementById("task_selected").value
    );
    frmData3.append("corp_id", document.getElementById("corp_selected").value);
    frmData3.append("member", document.getElementById("member").value);

    postData(frmData3, "fetch_searched_member").then((data) => {
      console.log(data);
      setMemberData(data);
    });
    setModalIsOpen(true);
  };

  const chooseMember = (e) => {
    e.preventDefault([]);
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.children[0].value);
      console.log(element.children[0].value);
    });

    getOneData("fetch_claims_by_member_no", arr[0]).then((data) => {
      console.log(data);
      setClaims(data[0].claims);
      setClaimTotal(data[0]);
    });
    setModalIsOpen(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getClaimRowData = (e) => {
    setOneClaimsData([]);
    setMemberDiagnosis([]);
    setMainBalances([]);
    setClaimBalances([]);
    e.preventDefault();
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.textContent);
    });
    getOneData("fetch_claim_row_by_id", arr[0]).then((data) => {
      console.log(data[0]);
      setOneClaimsData(data[0]);
      setVetStatus(data[0].vet_status);

      const frmData = new FormData();
      frmData.append("claim_no", data[0].claim_no);
      frmData.append("member_no", data[0].member_no);
      frmData.append("anniv", data[0].anniv);
      frmData.append("benefit", data[0].benefit_code);

      postData(frmData, "fetch_member_diagnosis").then((data) => {
        setMemberDiagnosis(data);
      });

      postData(frmData, "fetch_main_balance").then((data) => {
        console.log(data[0]);
        setMainBalances(data[0]);
      });

      postData(frmData, "fetch_claim_balance").then((data) => {
        setClaimBalances(data[0]);
      });
    });
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
  //check if there is an entry of diagnosis on click approve vet
  const checkDiagnosis = (e) => {
    //e.preventDefault();
    console.log(e.target.value);
    console.log(vetStatus);
    const status = e.target.value;
    console.log(status);
    const table_rows = document.getElementById("diagnosis_table").rows.length;
    console.log(table_rows);
    if (status === "1" && table_rows < 2) {
      //e.target.checked = false;
      setResponse("Notice ! Diagnosis missing ! Enter Diagnosis");
      setIsMessageModal(true);
    } else {
      e.target.checked = true;
      setVetStatus(e.target.value);
      if (status === "1") {
        document.getElementById("vet_bill_reason").disabled = true;
        document.getElementById("vet_bill_reason").value = null;
      } else {
        document.getElementById("vet_bill_reason").disabled = false;
      }
    }
  };
  //close message modal
  const closeMessageModal = () => {
    setIsMessageModal(false);
  };
  //fetch date received from batch number
  const fetchBatchDateReceived = (e) => {
    let batch_no = document.getElementById("batch_no").value;
    let provider = document.getElementById("provider").value;
    console.log(batch_no, provider);
    if (provider === 0 || !batch_no) {
      setResponse("Query Batch to get respective Provider");
      setIsMessageModal(true);
    } else {
      if (e.key === "Enter") {
        e.preventDefault();
        //setDisabledInput(!disabledInput);
        getTwoData("fetch_batch_date_received", batch_no, provider).then(
          (data) => {
            console.log(data);
            if (data.length !== 0) {
              setBatchDateReceived(data[0].date_received);
              document.getElementById("date_received").value =
                data[0].date_received;

              let invoice_date = new Date(invoiceDate);
              let date_received = new Date(batchDateReceived);
              console.log(invoice_date);
              console.log(date_received);
              const diff_in_time =
                invoice_date.getTime() - date_received.getTime();
              const diff_in_days = diff_in_time / (1000 * 3600 * 24);
              console.log(diff_in_days);
              if (diff_in_days > 90) {
                setResponse(
                  "Notice, Claim received after 90 days - thus time barred..." +
                    diff_in_days +
                    " Days"
                );
                setIsMessageModal(true);
              }
            } else {
              //empty date received input until the correct batch is selected
              document.getElementById("date_received").value = null;
              setResponse("Notice! No Batch exists for provider");
              setIsMessageModal(true);
            }
          }
        );
      }
    }
  };
  //fetch date received from provider code
  const fetchBatchDateReceivedProvider = (e) => {
    let batch_no = document.getElementById("batch_no").value;
    let provider = document.getElementById("provider").value;
    console.log(batch_no, provider);
    if (provider === 0 || !batch_no) {
      setResponse("Query Batch to get respective Provider");
      setIsMessageModal(true);
      document.getElementById("provider").value = null;
    } else {
      e.preventDefault();
      getTwoData("fetch_batch_date_received", batch_no, provider).then(
        (data) => {
          console.log(data);
          if (data.length !== 0) {
            setBatchDateReceived(data[0].date_received);
            document.getElementById("date_received").value =
              data[0].date_received;

            let invoice_date = new Date(invoiceDate);
            let date_received = new Date(batchDateReceived);
            console.log(invoice_date);
            console.log(date_received);
            const diff_in_time =
              invoice_date.getTime() - date_received.getTime();
            const diff_in_days = diff_in_time / (1000 * 3600 * 24);
            console.log(diff_in_days);
            if (diff_in_days > 90) {
              setResponse(
                "Notice, Claim received after 90 days - thus time barred..." +
                  diff_in_days +
                  " Days"
              );
              setIsMessageModal(true);
            }
          } else {
            //empty date received input until the correct batch is selected
            document.getElementById("date_received").value = null;
            setResponse("Notice! No Batch exists for provider");
            setIsMessageModal(true);
          }
        }
      );
    }
  };

  const saveQueryClaim = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("query_claim_form"));
    frmData.append("id", oneClaimsData.id);
    postData(frmData, "update_query_claims").then((data) => {
      setResponse(data[0]);
      setModal5Open(true);
    });
  };

  //close modal5
  const closeModal5 = () => {
    setModal5Open(false);

    setTimeout(function () {
      window.location.replace("/query-claim");
    }, 5000);
  };

  return (
    <div>
      <div className="row ml-0">
        <h4 className="fs-title">Query Claim</h4>
        <hr />
        <div className="col-md-12">
          <div className="row ml-0">
            <div className="form-group row">
              <div className="col-md-2">
                <select
                  id="task_selected"
                  defaultValue="0"
                  className="form-control"
                  required="true"
                  onChange={(e) => setChoosenOption(e.target.value)}
                >
                  <option disabled value="0">
                    Select Task
                  </option>
                  <option value="1">Query By Claim No</option>
                  <option value="2">Query By Invoice No</option>
                  <option value="3">Query By Member Name</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  id="corp_selected"
                  defaultValue="0"
                  className="form-control"
                  required="true"
                  hidden={disabled.corporate}
                  onChange={(e) => setSelectedCorporate(e.target.value)}
                >
                  <option disabled value="0">
                    Select Corporate
                  </option>
                  {corporates.map((data) => {
                    return (
                      <option value={data.CORP_ID}>{data.CORPORATE}</option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  id="claim"
                  className="form-control"
                  placeholder="Enter Claim No"
                  hidden={disabled.claim}
                  onInput={toInputUpperCase}
                />
                <input
                  type="text"
                  id="invoice"
                  className="form-control"
                  placeholder="Enter Invoice No"
                  hidden={disabled.invoice}
                  onInput={toInputUpperCase}
                />
                <input
                  type="text"
                  id="member"
                  className="form-control"
                  placeholder="Enter Member Name"
                  hidden={disabled.member}
                  onInput={toInputUpperCase}
                />
              </div>
              <div className={"col-md-1 pr-0 pl-0"}>
                <button
                  className="btn btn-outline-info btn-sm btn-block"
                  onClick={fetchClaim}
                  id="search"
                  hidden={disabled.search}
                >
                  Search
                </button>
                <button
                  className="btn btn-info form-control"
                  onClick={fetchMember}
                  id="fetch"
                  hidden={disabled.fetch}
                >
                  Fetch Member
                </button>
              </div>
              <div className={"col-md-2 ml-auto"}>
                <div className={"row"}>
                  <label
                    htmlFor="edit_btn"
                    className="col-form-label col-sm-3 label-right pr-0 pl-0"
                  >
                    Edit
                  </label>
                  <input
                    type={"checkbox"}
                    id={"edit_btn"}
                    name={"edit_btn"}
                    className={"form-control col-sm-7"}
                    onChange={enableEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section id="queryclaims" className="project-tab">
        <div className="">
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
                        href="#nav-invoice"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        disabled
                        selected
                      >
                        INVOICE
                      </a>
                      <a
                        className="nav-item nav-link"
                        id="nav-contact-tab"
                        data-toggle="tab"
                        href="#nav-claim"
                        role="tab"
                        aria-controls="nav-contact"
                        aria-selected="false"
                      >
                        CLAIM
                      </a>
                      <a
                        className="nav-item nav-link"
                        id="nav-home-tab"
                        data-toggle="tab"
                        href="#nav-vet"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        disabled
                        selected
                      >
                        VET
                      </a>
                    </div>
                  </nav>
                </div>
                <div className="row mb-2">
                  <Spinner />
                </div>
                <div className="card-body">
                  <form id="query_claim_form" onSubmit={saveQueryClaim}>
                    <div className="tab-content" id="nav-tabContent">
                      <div
                        className="tab-pane fade show active corporate-tab-content"
                        id="nav-invoice"
                        role="tabpanel"
                        aria-labelledby="nav-home-tab"
                      >
                        <div id="step-1">
                          <div className="row">
                            <div className="col-md-8">
                              <div className="form-group row ml-0"></div>
                              <div className="form-group row ml-0 ">
                                <label
                                  htmlFor="claim_no"
                                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                                >
                                  Claim No:
                                  <span className="required">*</span>
                                </label>
                                <div className="col-sm-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="claim_no"
                                    value={oneClaimsData.claim_no}
                                    required="true"
                                    id="claim_no"
                                    readOnly
                                  />
                                </div>
                                <label
                                  htmlFor="provider"
                                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                >
                                  Provider:
                                </label>
                                <div className="col-md-4">
                                  <select
                                    name="provider"
                                    id="provider"
                                    defaultValue={oneClaimsData.provider}
                                    className="form-control"
                                    onChange={fetchBatchDateReceivedProvider}
                                    disabled={disabledInput}
                                  >
                                    <option value={oneClaimsData.provider_code}>
                                      {oneClaimsData.provider}
                                    </option>
                                    {provider.map((data) => {
                                      return (
                                        <option
                                          key={data.CODE}
                                          value={data.CODE}
                                        >
                                          {data.PROVIDER}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="member_no"
                                  className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                                >
                                  Member No:
                                </label>
                                <div className="col-md-4 col-sm-4 ">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="member_no"
                                    value={oneClaimsData.member_no}
                                    id="member_no"
                                    disabled={disabledInput}
                                  />
                                </div>
                                <label
                                  htmlFor="invoice_date"
                                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                >
                                  Invoice Date:
                                </label>
                                <div className="col-md-4 col-sm-4">
                                  <input
                                    type="date"
                                    className="form-control"
                                    id="invoice_date"
                                    value={oneClaimsData.invoice_date}
                                    name="invoice_date"
                                    disabled={disabledInput}
                                  />
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="batch"
                                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                                >
                                  Batch:
                                  <span className=""></span>
                                </label>
                                <div className="col-sm-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="batch_no"
                                    defaultValue={oneClaimsData.batch_no}
                                    required="true"
                                    id="batch_no"
                                    onKeyPress={fetchBatchDateReceived}
                                    disabled={disabledInput}
                                  />
                                </div>
                                <label
                                  htmlFor="invoice_no"
                                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                >
                                  Invoice No:
                                </label>
                                <div className="col-md-4 col-sm-4">
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="invoice_no"
                                    value={oneClaimsData.invoice_no}
                                    name="invoice_no"
                                    disabled={disabledInput}
                                  />
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="pay_to"
                                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                >
                                  Pay To:
                                </label>
                                <div className="col-md-4">
                                  <select
                                    name="pay_to"
                                    id="payee"
                                    defaultValue={oneClaimsData.payee}
                                    className="form-control"
                                    disabled={disabledInput}
                                  >
                                    <option>Select Payee</option>
                                    <option value="1">Pay to Provider</option>
                                    <option value="2">
                                      Re-Imburse Corporate
                                    </option>
                                    <option value="3">Re-Imburse Member</option>
                                  </select>
                                </div>
                                <label
                                  htmlFor="benefit"
                                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                >
                                  Benefit:
                                </label>
                                <div className="col-md-4">
                                  <select
                                    name="benefit"
                                    defaultValue={oneClaimsData.benefit}
                                    className="form-control"
                                    disabled={disabledInput}
                                  >
                                    <option value={oneClaimsData.code}>
                                      {oneClaimsData.benefit}
                                    </option>
                                    {benefit.map((data) => {
                                      return (
                                        <option
                                          key={data.CODE}
                                          value={data.CODE}
                                        >
                                          {data.BENEFIT}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="claim_form"
                                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                                >
                                  Claim Form:
                                  <span className=""></span>
                                </label>
                                <div className="col-sm-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="claim_form"
                                    value={oneClaimsData.claim_form}
                                    id="claim_form"
                                    disabled={disabledInput}
                                  />
                                </div>
                                <label
                                  htmlFor="invoiced_amount"
                                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                >
                                  Invoiced Amount:
                                </label>
                                <div className="col-md-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="invoiced_amount"
                                    value={oneClaimsData.invoiced_amount}
                                    id="invoiced_amount"
                                    disabled={disabledInput}
                                  />
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="entrant"
                                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                                >
                                  Entrant:
                                  <span className=""></span>
                                </label>
                                <div className="col-sm-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="user_id"
                                    value={oneClaimsData.user_id}
                                    id="user_id"
                                    readOnly
                                  />
                                </div>

                                <label
                                  htmlFor="service"
                                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                >
                                  Service:
                                </label>
                                <div className="col-md-4">
                                  <select
                                    name="service"
                                    defaultValue={oneClaimsData.service}
                                    className="form-control"
                                    disabled={disabledInput}
                                  >
                                    <option value={oneClaimsData.service_code}>
                                      {oneClaimsData.service}
                                    </option>
                                    {service.map((data) => {
                                      return (
                                        <option
                                          key={data.CODE}
                                          value={data.CODE}
                                        >
                                          {data.SERVICE}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-group row ml-0"></div>
                              <div className="form-group row ml-0 ">
                                <label
                                  htmlFor="product_name"
                                  className="col-form-label col-md-3 label-align pl-0 pr-0"
                                >
                                  Product Name:
                                </label>
                                <div className="col-md-6">
                                  <select
                                    name="product_name"
                                    defaultValue={oneClaimsData.product_name}
                                    className="form-control"
                                    readOnly
                                  >
                                    <option value={oneClaimsData.product_code}>
                                      {oneClaimsData.product_name}
                                    </option>
                                    {products.map((data) => {
                                      return (
                                        <option
                                          key={data.code}
                                          value={data.code}
                                        >
                                          {data.product_name}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="smart_bill_id"
                                  className="col-form-label col-md-3 label-align pl-0 pr-0"
                                >
                                  Smart Bill Id:
                                </label>
                                <div className="col-md-6">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="smart_bill_id"
                                    value={oneClaimsData.smart_bill_id}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="pre_auth_no"
                                  className="col-form-label col-md-3 label-align pl-0 pr-0"
                                >
                                  Pre Auth No:
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="pre_auth_no"
                                    value={oneClaimsData.pre_auth_no}
                                    id="pre_auth_no"
                                    disabled={disabledInput}
                                  />
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="anniv"
                                  className="col-form-label col-md-3 label-align pl-0 pr-0"
                                >
                                  Anniv:
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="anniv"
                                    value={oneClaimsData.anniv}
                                    id="anniv"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="date_received"
                                  className="col-form-label col-md-3 label-align pl-0 pr-0"
                                >
                                  Date Received:
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="date_received"
                                    value={oneClaimsData.date_received}
                                    id="date_received"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="form-group row ml-0">
                                <label
                                  htmlFor="fund"
                                  className="col-form-label col-md-3 label-align pl-0 pr-0"
                                >
                                  Fund:
                                </label>
                                <div className="col-md-6 col-sm-6">
                                  <input
                                    type="checkbox"
                                    className="form-control"
                                    name="fund"
                                    id="fund"
                                    defaultValue={oneClaimsData.fund}
                                    defaultChecked={oneClaimsData.fund === "1" ? "checked" : ""}
                                    disabled={disabledInput}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-md-12">
                              <hr />
                              <table
                                className="table table-bordered table-sm"
                                id="invoice_table"
                                style={{ maxHeight: "500px" }}
                              >
                                <thead className="thead-dark">
                                  <tr>
                                    <th>Bills Id</th>
                                    <th>Claim No</th>
                                    <th>Invoice No</th>
                                    <th>Provider</th>
                                    <th>Service</th>
                                    <th>Member No</th>
                                    <th>Invoiced Amount</th>
                                    <th>Amount Payable</th>
                                    <th>Invoice Date</th>
                                    <th>Member Names</th>
                                    <th>Payee</th>
                                    <th>Voucher No</th>
                                    <th>Cheque No</th>
                                    <th>Cheque Date</th>
                                    <th>Pre Auth No</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {claims.map((dt) => {
                                    return (
                                      <tr key={dt.id}>
                                        <td> {dt.id}</td>
                                        <td>{dt.claim_no}</td>
                                        <td>{dt.invoice_no}</td>
                                        <td>{dt.provider}</td>
                                        <td>{dt.service}</td>
                                        <td>{dt.member_no}</td>
                                        <td>
                                          {parseFloat(
                                            dt.invoiced_amount
                                          ).toLocaleString()}
                                        </td>
                                        <td>{dt.amount_payable}</td>
                                        <td>{dt.invoice_date}</td>
                                        <td>{dt.names}</td>
                                        <td>{dt.payee}</td>
                                        <td>{dt.voucher_no}</td>
                                        <td>{dt.cheque_no}</td>
                                        <td>{dt.cheque_date}</td>
                                        <td>{dt.pre_auth_no}</td>
                                        <td>
                                          <button
                                            className="btn btn-success form-control select"
                                            onClick={getClaimRowData}
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
                                    <th>Totals</th>
                                    <th>{claimsTotal.total}</th>
                                    <th>{claimsTotal.total}</th>
                                    <th></th>
                                    <th></th>
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
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade"
                        id="nav-claim"
                        role="tabpanel"
                        aria-labelledby="nav-contact-tab"
                      >
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group row ml-0"></div>
                            <div className="form-group row ml-0 ">
                              <label
                                htmlFor="claim_no"
                                className="col-form-label col-sm-2 label-align pr-0 pl-0"
                              >
                                Claim No:
                                <span className="required">*</span>
                              </label>
                              <div className="col-sm-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="claim_no"
                                  value={oneClaimsData.claim_no}
                                  required="true"
                                  id="claim_no"
                                  readOnly
                                />
                              </div>
                              <label
                                htmlFor="visit_date"
                                className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                              >
                                Visit Date:
                              </label>
                              <div className="col-md-4 col-sm-4">
                                <input
                                  type="date"
                                  className="form-control"
                                  id="visit_date"
                                  value={oneClaimsData.visit_date}
                                  name="visit_date"
                                  disabled={disabledInput}
                                />
                              </div>
                            </div>
                            <div className="form-group row ml-0">
                              <label
                                htmlFor="doctor_date"
                                className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                              >
                                Doctor Date:
                              </label>
                              <div className="col-md-4 col-sm-4">
                                <input
                                  type="date"
                                  className="form-control"
                                  id="doctor_date"
                                  value={oneClaimsData.doctor_date}
                                  name="doctor_date"
                                  disabled={disabledInput}
                                />
                              </div>
                              <label
                                htmlFor="doctor_signed"
                                className={
                                  "col-form-label col-md-2 label-align text-right"
                                }
                              >
                                Doctor Signed:
                              </label>
                              <div className={"col-md-1 pr-0 pl-0"}>
                                <input
                                  type="checkbox"
                                  className={"checkbox-inline mt-2"}
                                  id="doctor_signed"
                                  checked={
                                    oneClaimsData.doctor_sign == 1
                                      ? true
                                      : false
                                  }
                                  disabled={disabledInput}
                                />
                              </div>
                              <label
                                htmlFor="patient_signed"
                                className={
                                  "col-form-label col-md-2 label-align text-right"
                                }
                              >
                                Patient Signed:
                              </label>
                              <div className={"col-md-1 pr-0 pl-0"}>
                                <input
                                  type="checkbox"
                                  className={"checkbox-inline mt-2"}
                                  id="patient_signed"
                                  checked={
                                    oneClaimsData.patient_signed == 1
                                      ? true
                                      : false
                                  }
                                  disabled={disabledInput}
                                />
                              </div>
                            </div>
                            <div className="form-group row ml-0">
                              <label
                                htmlFor="date_admitted"
                                className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                              >
                                Date Admitted:
                              </label>
                              <div className="col-md-4 col-sm-4">
                                <input
                                  type="date"
                                  className="form-control"
                                  id="date_admitted"
                                  value={oneClaimsData.date_admitted}
                                  name="date_admitted"
                                  disabled={disabledInput}
                                />
                              </div>
                              <label
                                htmlFor="date_discharged"
                                className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                              >
                                Date Discharged:
                              </label>
                              <div className="col-md-4 col-sm-4">
                                <input
                                  type="date"
                                  className="form-control"
                                  id="date_discharged"
                                  value={oneClaimsData.date_discharged}
                                  name="date_discharged"
                                  disabled={disabledInput}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="row" style={{ marginTop: "20px" }}>
                          <div className="mx-auto">
                            <button
                              className="btn btn-info col-2 form-control"
                              onClick={openModal2}
                            >
                              Add Diagnosis
                            </button>
                            <table
                              className="table table-bordered"
                              style={{ maxHeight: "300px" }}
                              id="diagnosis_table"
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
                        id="nav-vet"
                        role="tabpanel"
                        aria-labelledby="nav-contact-tab"
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <p className="h2 text-info">Vet</p>
                            <hr />
                            <div className="form-group row justify-content-center">
                              <div className="form-group row">
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
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="family_title"
                                    value={oneClaimsData.relation}
                                    readOnly
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
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
                              </div>
                              <div className="form-group row">
                                <div className="col-md-2">
                                  <label className="col-form-label">
                                    Invoice No
                                  </label>
                                </div>
                                <div className="col-md-4">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={oneClaimsData.invoice_no}
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
                                    name="service"
                                    readOnly
                                  >
                                    <option value={oneClaimsData.service_code}>
                                      {oneClaimsData.service}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col-md-2">
                                  <label className="col-form-label">
                                    Provider
                                  </label>
                                </div>
                                <div className="col-md-10">
                                  <select
                                    className="form-control"
                                    name="provider"
                                    readOnly
                                  >
                                    <option value={oneClaimsData.provider_code}>
                                      {oneClaimsData.provider}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col-md-2">
                                  <label className="col-form-label">
                                    Vet Status
                                  </label>
                                </div>
                                <fieldset
                                  className="col-md-10 pr-0 pl-0 vet_status"
                                  value={vetStatus}
                                  onChange={checkDiagnosis}
                                >
                                  <div className={"row"}>
                                    <div className={"col-md-4"}>
                                      <label htmlFor="approve_">
                                        <input
                                          type="radio"
                                          name="vet_status"
                                          value="1"
                                          id="approve"
                                          checked={vetStatus === "1"}
                                          disabled={disabledInput}
                                        />
                                        Approve
                                      </label>
                                    </div>
                                    <div className={"col-md-4"}>
                                      <label htmlFor="reject">
                                        <input
                                          type="radio"
                                          name="vet_status"
                                          value="2"
                                          id="reject"
                                          checked={vetStatus === "2"}
                                          disabled={disabledInput}
                                        />
                                        Reject
                                      </label>
                                    </div>
                                    <div className={"col-md-4"}>
                                      <label htmlFor="reject">
                                        <input
                                          type="radio"
                                          name="vet_status"
                                          value="3"
                                          id="suspend"
                                          checked={vetStatus === "3"}
                                          disabled={disabledInput}
                                        />
                                        Suspend
                                      </label>
                                    </div>
                                  </div>
                                </fieldset>
                              </div>
                              <div className="form-group row">
                                <div className="col-md-2">
                                  <label className="col-form-label">User</label>
                                </div>
                                <div className="col-md-4">
                                  <input
                                    type="text"
                                    name="user"
                                    className="form-control"
                                    value={oneClaimsData.user_id}
                                    readOnly
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
                                    name="date_vetted"
                                    value={today2()}
                                    className="form-control"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-md-2">
                                <label className="col-form-label">Reason</label>
                              </div>
                              <div className="col-md-10">
                                <select
                                  className="form-control"
                                  name="bill_reason"
                                  id="vet_bill_reason"
                                  defaultValue="0"
                                  disabled={disabledInput}
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
                                  disabled={disabledInput}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <p className="h2 text-info">Deduction</p>
                            <hr />
                            <div className="form-group row justify-content-center">
                              <div className="form-group row">
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
                              </div>

                              <div className="form-group row">
                                <div className="col-md-4">
                                  <label className="col-form-label">
                                    Deduction Amount
                                  </label>
                                </div>
                                <div className="col-md-8">
                                  <input
                                    type="number"
                                    min={0}
                                    value={oneClaimsData.deduction_amount}
                                    className="form-control"
                                    name="deduction_amount"
                                    onChange={(e) =>
                                      setDeductionAmt(e.target.value)
                                    }
                                    disabled={disabledInput}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <div className="col-md-4">
                                  <label className="col-form-label">
                                    Deduction Reason
                                  </label>
                                </div>
                                <div className="col-md-8">
                                  <select
                                    className="form-control"
                                    name="deduction_reason"
                                    defaultValue={
                                      oneClaimsData.deduction_reason
                                    }
                                    disabled={disabledInput}
                                  >
                                    <option
                                      value={oneClaimsData.deduction_reason}
                                    >
                                      {oneClaimsData.deduct_reason}
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
                              </div>
                              <div className="form-group row">
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
                              </div>
                              <div className="form-group row">
                                <div className="col-md-4">
                                  <label className="col-form-label">
                                    Deduction Notes
                                  </label>
                                </div>
                                <div className="col-md-8">
                                  <textarea
                                    name="deduction_notes"
                                    value={oneClaimsData.deduction_notes}
                                    className="form-control"
                                    disabled={disabledInput}
                                  />
                                </div>
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
                                      className="form-control"
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
                                      className="form-control"
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
                                      className="form-control"
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
                                      className="form-control"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <p className="h2 text-info">Benefits</p>
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
                                      className="form-control"
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
                                      className="form-control"
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
                                      className="form-control"
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
                                      className="form-control"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={"row justify-content-center mt-2"}>
                          <button
                            type="submit"
                            className="btn btn-primary form-control col-2"
                            style={{ float: "right", position: "sticky" }}
                          >
                            Save
                          </button>
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

      <CustomModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        header={<p className="alert alert-info text-lg">Choose Member</p>}
        body={
          <table
            id="tblPrincipal"
            className="table table-bordered table-sm text-center"
            style={{ height: "200px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th scope="col">Member No</th>
                <th scope="col">Member Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {memberData.map((data) => {
                return (
                  <tr>
                    <td>
                      <input
                        type="text"
                        id="modal_member_no"
                        value={data.member_no}
                        className="form-control"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={data.full_name}
                        className="form-control"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="button"
                        value="View"
                        className="btn btn-info btn-sm"
                        onClick={chooseMember}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
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
      <Modal5
        modalIsOpen={isModal5Open}
        closeModal={closeModal5}
        header={<p id="headers">Query Claim</p>}
        background="#0047AB"
        body={<p className="text-white font-weight-bold h4">{response}</p>}
      />
      {/*Message modal*/}
      <MessageModal
        modalIsOpen={messageModal}
        closeModal={closeMessageModal}
        background="#0047AB"
        body={<p className="text-white font-weight-bold h4">{response}</p>}
      />
    </div>
  );
};

export default QueryClaim;
