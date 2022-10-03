import React, {useEffect, useState} from "react";
import {getData, getOneData, getTwoData, postData} from "../../../../components/helpers/Data";
import {toInputUpperCase} from "../../../../components/helpers/toInputUpperCase";
import {today2} from "../../../../components/helpers/today";
import CustomModal from "../../../../components/helpers/Modal";
import Modal2 from "../../../../components/helpers/Modal4";
import {Spinner} from "../../../../components/helpers/Spinner";
import FormatDate from "../../../../components/helpers/FormatDate";
import {validateDate} from "../../../../components/helpers/validateDate";
import Modal4 from "../../../../components/helpers/Modal4";
import Modal5 from "../../../../components/helpers/Modal5";
import Modal3 from "../../../../components/helpers/Modal5";
import MessageModal from "../../../../components/helpers/Modal2";

const QueryBatch = () => {
    const [choosenOption, setChoosenOption] = useState([]);
    const [provider, setProvider] = useState([]);
    const [benefit, setBenefit] = useState([]);
    const [products, setProducts] = useState([]);
    const [service, setService] = useState([]);
    const [corporates, setCorporates] = useState([]);
    const [billReasons, setBillReasons] = useState([]);
    const [deductionReason, setDeductionReason] = useState([]);
    const [deductionAmt, setDeductionAmt] = useState(0.0);
    const [batchNoDetails, setBatchNumberDetails] = useState([]);
    const [claimsTotal, setClaimTotal] = useState([]);
    const [oneClaimsData, setOneClaimsData] = useState([]);
    const [memberNo, setMemberNo] = useState([]);
    const [modalOneOpen, setModalOneOpen] = useState(false);
    const [memberBenefits, setMemberBenefits] = useState([]);
    const [memberAnniv, setMemberAnniv] = useState([]);
    const [invoiceDate, setInvoiceDate] = useState([]);
    const [batchDateReceived, setBatchDateReceived] = useState([]);
    const [payee, setPayee] = useState([]);
    const [productName, setProductName] = useState([]);
    const [productCode, setProductCode] = useState([]);
    const [fund, setFund] = useState([]);
    const [disabledInput, setDisabledInput] = useState(true);
    const [disableActionBtn, setDisableActionBtn] = useState(false);
    const [preauths, setPreauths] = useState([]);
    const [modal3IsOpen, setModal3IsOpen] = useState(false);
    const [mainBalances, setMainBalances] = useState({
        claims: 0.0, reserves: 0.0, limit: 0.0, balance: 0.0,
    });
    const [claimBalances, setClaimBalances] = useState({
        claims: 0.0, reserves: 0.0, limit: 0.0, balance: 0.0,
    });
    const [preauthNo, setPreauthNo] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    const [diagnosis, setDiagnosis] = useState([]);
    const [modal2IsOpen, setModal2IsOpen] = useState(false);
    const [appendedDiagnosisRow, setAppendedDiagnosisRow] = useState([]);
    const [memberDiagnosis, setMemberDiagnosis] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCorporate, setSelectedCorporate] = useState([]);
    const [memberData, setMemberData] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [response, setResponse] = useState([]);
    const [vetStatus, setVetStatus] = useState([]);
    const [billVetData, setBillVetData] = useState([]);
    const [disable, setDisabled] = useState({save_btn: true});

    //enable editing
    const enableEditing = (e) => {
        if (e.target.checked) {
            setDisabledInput(false);
            setDisabled({save_btn: false})
        } else {
            setDisabledInput(true);
            setDisabled({save_btn: true})
        }
    };
    const closeModal2 = () => {
        setModal2IsOpen(false);
    };

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
        getData('fetch_corporates').then((data) => {
            setCorporates(data);
        });
        getData("fetch_resend_bill_reason").then((data) => {
            setBillReasons(data);
        });
        getData("fetch_deduction_reason").then((data) => {
            setDeductionReason(data);
        });
    }, []);
    //fetch batch details
    const fetchBatchData = (e) => {
        setDisabledInput(true);
        //reset form
        setOneClaimsData([]);
        setVetStatus([]);
        setMemberDiagnosis([]);
        setPreauths([]);
        setMainBalances([]);
        setClaimBalances([]);
        setBatchNumberDetails([]);
        setClaimTotal([]);
        e.preventDefault([]);
        const batch_no = document.getElementById('batch_no_value').value;
        if (!batch_no) {
            setResponse('Notice! Enter Batch Number')
            setIsMessageModal(true)
        } else {
            document.getElementById('spinner').style.display = 'block';
            getOneData('query_batch', batch_no).then((data) => {
                //return console.log(data);
                if (data.claims.length === 0) {
                    //stop loader
                    document.getElementById('spinner').style.display = 'none';
                    setResponse('Notice! No Records to Retrieve. Check Batch Number')
                    setIsMessageModal(true)
                } else {
                    //stop loader
                    document.getElementById('spinner').style.display = 'none';
                    setBatchNumberDetails(data.claims);
                    setClaimTotal(data.totals);
                    document.getElementById('spinner').style.display = 'none';
                }
            }).catch((error) => {
                //stop loader
                document.getElementById('spinner').style.display = 'none';
                console.log(error);
            });
        }
        setDisableActionBtn(false);
    };
    //fetch bill id details
    const getClaimRowData = (e) => {
        e.preventDefault();
        setOneClaimsData([]);
        setVetStatus([]);
        setMemberDiagnosis([]);
        setPreauths([]);
        setMainBalances([]);
        setClaimBalances([]);
        const arr = [];
        let payee = '';
        e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
            arr.push(element.textContent);
        });
        const frmData = new FormData();
        const bill_id = arr[0];
        let member_no = arr[1];
        const anniv = arr[2];
        const benefit_code = arr[3];
        const claim_no = arr[4];
        let invoice_no = arr[5];
        const provider = arr[6];
        const service = arr[8];

        frmData.append("member_no", member_no);
        frmData.append("anniv", anniv);
        frmData.append("benefit", benefit_code);
        frmData.append("claim_no", claim_no);
        frmData.append("invoice_no", invoice_no);
        frmData.append("provider", provider);
        frmData.append("service", service);

        getOneData("fetch_claim_row_by_id", bill_id).then((data) => {
            console.log(data[0]);
            setOneClaimsData(data[0]);
            setVetStatus(data[0].vet_status);
            if (oneClaimsData.payee === null) {
                payee = 'Pay To Provider';
                document.getElementById('payee').defaultValue = '1'
                //setPayee(payee)
            } else if (oneClaimsData.payee === '1') {
                payee = 'Pay To Provider';
                document.getElementById('payee').defaultValue = '1'
                //setPayee(payee)
            } else if (oneClaimsData.payee === '2') {
                payee = 'Re-imburse Corporate';
                document.getElementById('payee').defaultValue = '2'
                //setPayee(payee)
            } else if (oneClaimsData.payee === '3') {
                payee = 'Re-imburse Member';
                document.getElementById('payee').defaultValue = '3'
                //setPayee(payee)
            }
            setMemberNo(data[0].member_no);
            console.log(data[0].member_no, data[0].invoice_date)
            const invoice_date = data[0].invoice_date
            //fetch member benefits to be populated for dropdown
            fetchMemberBenefits(e, member_no, invoice_date)

            postData(frmData, "fetch_member_diagnosis").then((data) => {
                console.log(data)
                setMemberDiagnosis(data);
            }).catch((error) => {console.log(error)});

            postData(frmData, "fetch_main_balance").then((data) => {
                setMainBalances(data[0]);
            }).catch((error) => {console.log(error)});
            postData(frmData, "fetch_claim_balance").then((data) => {
                setClaimBalances(data[0]);
            }).catch((error) => {console.log(error)});
            setDisableActionBtn(true);
        }).catch((error) => {console.log(error)});
        postData(frmData, "fetch_bills_vet_status").then((data) => {
            if (data.length != 0) {
                console.log(data)
                setBillVetData(data[0]);
                setVetStatus(data[0].vet_status);
                if (data[0].vet_status === "3") {
                    setResponse('Notice ! Bill Suspended... Do you want to continue vetting this bill?')
                    setIsMessageModal(true)
                }
            }
        }).catch((error) => {console.log(error)});
    };
    //fetch member benefits for member in current anniversary dates
    const fetchMemberBenefits = (e) => {
        e.preventDefault();
        setInvoiceDate(FormatDate(document.getElementById('invoice_date').value));

        const dt = validateDate(document.getElementById('invoice_date').value);

        if (dt) {
            const frmData = new FormData();
            const member_no = document.getElementById('member_no').value;
            const invoice_date = document.getElementById('invoice_date').value;

            frmData.append('member_no', member_no);
            frmData.append('invoice_date', invoice_date);
            postData(frmData, "fetch_member_benefits").then((data) => {
                console.log(data);
                if (data.benefits.length > 0) {
                    setMemberBenefits(data.benefits);
                    setMemberAnniv(data.anniv);
                    setModalOneOpen(true);
                    document.getElementById('anniv').value = data.anniv;
                    // setMemberAnniv(data.anniv)
                    if (data.ever_cancelled_status > 0) {
                        if (data.ever_cancelled_status === 1) {
                            if (new Date(invoiceDate) >= new Date(data.cancelled_date)) {
                                console.log(new Date(invoiceDate));
                                console.log(new Date(data.cancelled_date));
                                if (data.current_cancelled_status === 1) {
                                    alert('Notice,Member claimed while they were not active !')
                                }
                            }
                        }
                    }
                } else {
                    alert(data.message);
                    document.getElementById('invoice_date').value = ''
                    setMemberBenefits(data.benefits)
                    setMemberAnniv(0);
                }
            });
        }
    }
    //fetch date received from batch number
    const fetchBatchDateReceived = (e) => {

        let batch_no = document.getElementById('batch').value;
        let provider = document.getElementById('provider').value;
        console.log(batch_no, provider);
        if (provider === 0 || !batch_no) {
            alert('Query Batch to get respective Provider')
        } else {
            if (e.key === 'Enter') {
                e.preventDefault();
                //setDisabledInput(!disabledInput);
                getTwoData('fetch_batch_date_received', batch_no, provider).then((data) => {
                    console.log(data);
                    if (data.length !== 0) {
                        setBatchDateReceived(data[0].date_received);
                        document.getElementById('date_received').value = data[0].date_received;

                        let invoice_date = new Date(invoiceDate);
                        let date_received = new Date(batchDateReceived);
                        console.log(invoice_date);
                        console.log(date_received);
                        const diff_in_time = invoice_date.getTime() - date_received.getTime();
                        const diff_in_days = diff_in_time / (1000 * 3600 * 24);
                        console.log(diff_in_days);
                        if (diff_in_days > 90) {
                            alert('Notice, Claim received after 90 days - thus time barred...' + diff_in_days + ' Days')
                        }

                    } else {
                        //empty date received input until the correct batch is selected
                        document.getElementById('date_received').value = null;
                        alert('Notice! No Batch exists for provider');
                    }
                })
            }
        }
    }
    //fetch date received from provider code
    const fetchBatchDateReceivedProvider = (e) => {

        let batch_no = document.getElementById('batch').value;
        let provider = document.getElementById('provider').value;
        console.log(batch_no, provider);
        if (provider === 0 || !batch_no) {
            alert('Query Batch to get respective Provider')
        } else {
            e.preventDefault();
            //setDisabledInput(!disabledInput);
            getTwoData('fetch_batch_date_received', batch_no, provider).then((data) => {
                console.log(data);
                if (data.length !== 0) {
                    setBatchDateReceived(data[0].date_received);
                    document.getElementById('date_received').value = data[0].date_received;

                    let invoice_date = new Date(invoiceDate);
                    let date_received = new Date(batchDateReceived);
                    console.log(invoice_date);
                    console.log(date_received);
                    const diff_in_time = invoice_date.getTime() - date_received.getTime();
                    const diff_in_days = diff_in_time / (1000 * 3600 * 24);
                    console.log(diff_in_days);
                    if (diff_in_days > 90) {
                        alert('Notice, Claim received after 90 days - thus time barred...' + diff_in_days + ' Days')
                    }

                } else {
                    //empty date received input until the correct batch is selected
                    document.getElementById('date_received').value = null;
                    alert('Notice! No Batch exists for provider');
                }
            })
        }
    }
    //fetch product name from the benefit selected
    const fetchProductName = (e) => {
        e.preventDefault();
        const frmData = new FormData();
        const benefit = document.getElementById('benefit').value;
        frmData.append('member_no', memberNo);
        frmData.append('anniv', memberAnniv);
        frmData.append('benefit', benefit);
        frmData.append('provider', document.getElementById('provider').value);
        postData(frmData, 'fetch_product_name_query_batch').then((data) => {
            console.log(data);
            //check if bene if suspended
            if (data.suspended[0] === '1') {
                alert('Notice, Benefit is suspended!');
            }
            //check if member has pre auths
            if (data.pre_auth > 0) {
                //fetch preAuths from pre_authorization
                postData(frmData, "fetch_member_preauth_query_batch").then((data) => {
                    console.log(data)
                    if (data.length != 0) {
                        setPreauths(data);
                        setModal3IsOpen(true);
                    }
                }).catch((error) => {
                    console.log(error)
                });
            }
            //determine if bene is in fund
            setFund(data.fund);
            if (data.fund == '1') {
                document.getElementById('fund').checked = true;
            } else {
                document.getElementById('fund').checked = false;
            }
            //determine product name - set product name and code
            setProductName(data.product.product_name);
            setProductCode(data.product.product_code);
            //ensure the member is claiming after the benefits waiting period
            if (data.waiting_period > 0) {
                let relative_date = new Date(data.cover_start_date);
                relative_date.setDate(relative_date.getDate() + data.waiting_period);
                console.log(relative_date)
                console.log(invoiceDate)
                let invoice_date = new Date(invoiceDate);

                if (invoice_date < relative_date) {
                    setDisabled({save_btn: true})
                    alert('Notice, This member is claiming within the waiting period!');
                } else {
                    setDisabled({save_btn: false})
                }
            }
        }).catch((error) => {
            console.log(error)
        });

    }
    //close modal 3
    const closeModal3 = () => {
        setModal3IsOpen(false);
    };
    //get pre auth no if there
    const getPreauthNo = (e) => {
        e.preventDefault();
        const arr = [];
        e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
            arr.push(element.textContent);
        });

        setPreauthNo(arr[0]);
        console.log(preauthNo)
        setModal3IsOpen(false);
        document.getElementById('pre_auth_no').value = preauthNo;
    };
    const fetchMember = (e) => {
        e.preventDefault([]);
        if (selectedCorporate.length === 0) {
            alert('Enter Corporate');
        }
        const frmData3 = new FormData();
        frmData3.append("task_selected", document.getElementById("task_selected").value);
        frmData3.append("corp_id", document.getElementById("corp_selected").value);
        frmData3.append("member", document.getElementById("member").value);

        postData(frmData3, "fetch_searched_member").then((data) => {
            console.log(data);
            setMemberData(data);

        });
        setModalIsOpen(true);
    }
    const chooseMember = (e) => {
        e.preventDefault([]);
        const arr = [];
        e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
            arr.push(element.children[0].value);
            console.log(element.children[0].value);
        });

        /*getOneData("fetch_claims_by_member_no", arr[0]).then((data) =>{
            console.log(data);
            setClaims(data[0].claims);
            setClaimTotal(data[0]);
        })*/
    }
    const closeModal = () => {
        setModalIsOpen(false);
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
                        <input type="text" hidden name="clm_diagnosis_idx[]" value={arr[0]}/>
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
    //delete added diagnosis claims tab
    const removeDiagnosis = async (id, e) => {
        e.preventDefault();
        setAppendedDiagnosisRow((appendDiagnosisRow) => {
            return appendDiagnosisRow.filter((row) => row.id !== id);
        });
    };
    //deleted fetched diagnosis
    const removeFetchedDiag = (e) => {
        e.preventDefault();
        const arr = [];
        e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
            arr.push(element.textContent);
            console.log(element.textContent);
        });
    }
    //close message modal
    const closeMessageModal = () => {
        setIsMessageModal(false);
    };
    //check if there is an entry of diagnosis on click approve vet
    const checkDiagnosis = (e) => {
        //e.preventDefault();
        console.log(e.target.value);
        console.log(vetStatus);
        const status = e.target.value;
        console.log(status);
        const table_rows = document.getElementById('diagnosis_table').rows.length;
        console.log(table_rows);
        if (status === '1' && table_rows < 2) {
            //e.target.checked = false;
            setResponse('Notice ! Diagnosis missing ! Enter Diagnosis')
            setIsMessageModal(true)
        } else {
            e.target.checked = true;
            setVetStatus(e.target.value)
            if (status === '1') {
                document.getElementById('vet_bill_reason').disabled = true;
                document.getElementById('vet_bill_reason').value = null;
            } else {
                document.getElementById('vet_bill_reason').disabled = false;
            }
        }
    }
    //save/update query batch
    const saveQueryBatch = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById("query_batch_form"));
        const editCheckBox = document.querySelectorAll(".edit");
        const fundCheckBox = document.querySelectorAll(".fund");
        const doctorSignCheckbox = document.querySelectorAll(".doctor_sign");
        const patientSignCheckbox = document.querySelectorAll(".patient_sign");
        if (editCheckBox.checked == true) {
            frmData.append("edit", "1");
        } else {
            frmData.append("edit", "0");
        }
        if (fundCheckBox.checked == true) {
            frmData.append("inv_fund", "1");
        } else {
            frmData.append("inv_fund", "0");
        }
        if (doctorSignCheckbox.checked == true) {
            frmData.append("clm_doctor_sign", "1");
        } else {
            frmData.append("clm_doctor_sign", "0");
        }
        if (patientSignCheckbox.checked == true) {
            frmData.append("clm_patient_sign", "1");
        } else {
            frmData.append("clm_patient_sign", "0");
        }

        frmData.append("id", oneClaimsData.id);
        frmData.append("bill_vet_id", billVetData.id);
        postData(frmData, "update_query_batch").then((data) => {
           if (data.message){
               setResponse(data.message);
               setIsMessageModal(true)
           }else if (data.error){
               setResponse('Error ! Edit Save Failed.');
               setIsMessageModal(true)
           }

        });
    };
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Bill Process - Query Batch</h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0">
                        <div className="form-group row">
                            <label htmlFor={"task"}
                                   className="col-form-label col-sm-1 label-align pr-0 pl-0">
                            </label>
                            <label htmlFor={"task"}
                                   className="col-form-label col-sm-1 label-right pr-2 pl-0">Batch No:
                            </label>

                            <div className="col-md-2">
                                <input type="text" id="batch_no_value"
                                       className="form-control" placeholder="Enter Batch No... (0000)"/>
                            </div>
                            <div className={"col-md-1 pr-0 pl-0"}>
                                <button
                                    className="btn btn-outline-info btn-sm btn-block"
                                    onClick={fetchBatchData}
                                    id="query_batch_btn">
                                    Search
                                </button>
                            </div>
                            <div className={"col-md-2 ml-auto"}>
                                <div className={"row"}>
                                    <label htmlFor="edit_btn"
                                           className="col-form-label col-sm-3 label-right pr-0 pl-0">
                                        Edit
                                    </label>
                                    <input type={"checkbox"} id={"edit_btn"}
                                           className={"form-control col-sm-7 edit"}
                                           onChange={enableEditing}/>
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
                                        <div className="nav nav-tabs nav-fill"
                                             id="nav-tab"
                                             role="tablist">
                                            <a className="nav-item nav-link active"
                                               id="nav-home-tab" data-toggle="tab" href="#nav-invoice" role="tab"
                                               aria-controls="nav-home" aria-selected="true" disabled selected>INVOICE
                                            </a>
                                            <a className="nav-item nav-link"
                                               id="nav-contact-tab" data-toggle="tab" href="#nav-claim"
                                               role="tab" aria-controls="nav-contact" aria-selected="false">CLAIM
                                            </a>
                                            <a className="nav-item nav-link"
                                               id="nav-home-tab" data-toggle="tab" href="#nav-vet" role="tab"
                                               aria-controls="nav-home" aria-selected="true" disabled selected>VET
                                            </a>
                                        </div>
                                    </nav>
                                </div>
                                <div className="card-body">
                                    <form id="query_batch_form" className="" onSubmit={saveQueryBatch}>
                                        <div className="tab-content" id="nav-tabContent">
                                            {/*Invoice tab*/}
                                            <div className="tab-pane fade show active corporate-tab-content"
                                                 id="nav-invoice" role="tabpanel" aria-labelledby="nav-home-tab">
                                                <div id="step-1">
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <div className="form-group row ml-0 ">
                                                                <label htmlFor="claim_no"
                                                                       className="col-form-label col-sm-2 label-align pr-0 pl-0">
                                                                    Claim No:
                                                                    <span className="required">*</span>
                                                                </label>
                                                                <div className="col-sm-4">
                                                                    <input type="text" className="form-control"
                                                                           name="inv_claim_no" id={"claim_no"}
                                                                           defaultValue={oneClaimsData.claim_no}
                                                                           id="claim_no"
                                                                           readOnly/>
                                                                </div>
                                                                <label htmlFor="provider"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Provider:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <select name="inv_provider" id={"provider"}
                                                                            className="form-control"
                                                                            disabled={disabledInput}
                                                                            onChange={fetchBatchDateReceivedProvider}>
                                                                        <option
                                                                            value={oneClaimsData.provider_code}>{oneClaimsData.provider}</option>
                                                                        {provider.map((data) => {
                                                                            return (
                                                                                <option key={data.CODE}
                                                                                        value={data.CODE}>
                                                                                    {data.PROVIDER}
                                                                                </option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label
                                                                    htmlFor="member_no"
                                                                    className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0">Member
                                                                    No:
                                                                </label>
                                                                <div className="col-md-4 col-sm-4 ">
                                                                    <input type="text" className="form-control"
                                                                           name="inv_member_no" id="member_no"
                                                                           defaultValue={oneClaimsData.member_no}
                                                                           disabled={disabledInput}/>
                                                                </div>
                                                                <label htmlFor="invoice_date"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Invoice
                                                                    Date:
                                                                </label>
                                                                <div className="col-md-4 col-sm-4">
                                                                    <input type="date" className="form-control"
                                                                           id="invoice_date" name="inv_invoice_date"
                                                                           maxLength={"4"} max={"9999-12-31"}
                                                                           defaultValue={oneClaimsData.invoice_date}
                                                                           onChange={fetchMemberBenefits}
                                                                           disabled={disabledInput}/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="batch"
                                                                       className="col-form-label col-sm-2 label-align pr-0 pl-0">Batch:
                                                                </label>
                                                                <div className="col-sm-4">
                                                                    <input type="text" className="form-control"
                                                                           name="inv_batch_no"
                                                                           defaultValue={oneClaimsData.batch_no} id="batch"
                                                                           onKeyPress={fetchBatchDateReceived}
                                                                           disabled={disabledInput}/>
                                                                </div>
                                                                <label htmlFor="invoice_no"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Invoice
                                                                    No:
                                                                </label>
                                                                <div className="col-md-4 col-sm-4">
                                                                    <input type="number" className="form-control"
                                                                           id="invoice_no"
                                                                           name="inv_invoice_no"
                                                                           defaultValue={oneClaimsData.invoice_no}
                                                                           disabled={disabledInput}/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="pay_to"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Pay
                                                                    To:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <select name="inv_pay_to" className="form-control"
                                                                            id={"payee"}
                                                                            defaultValue={oneClaimsData.payee}
                                                                            disabled={disabledInput}>
                                                                        {/* <option value={oneClaimsData.payee}>{payee}</option>*/}
                                                                        <option disabled value="0">Select Payee</option>
                                                                        <option value="1">Pay to Provider</option>
                                                                        <option value="2">Re-Imburse Corporate</option>
                                                                        <option value="3">Re-Imburse Member</option>

                                                                    </select>
                                                                </div>
                                                                <label htmlFor="benefit"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">
                                                                    Benefit:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <select name="inv_benefit" className="form-control"
                                                                            id={"benefit"} onChange={fetchProductName}
                                                                            disabled={disabledInput}>
                                                                        <option
                                                                            value={oneClaimsData.benefit_code}>{oneClaimsData.benefit}</option>
                                                                        {memberBenefits.map((data) => {
                                                                            return (
                                                                                <option
                                                                                    value={data.benefit_code}>{data.benefit}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="claim_form"
                                                                       className="col-form-label col-sm-2 label-align pr-0 pl-0">Claim
                                                                    Form:
                                                                </label>
                                                                <div className="col-sm-4">
                                                                    <input type="text" className="form-control"
                                                                           name="inv_claim_form"
                                                                           defaultValue={oneClaimsData.claim_no}
                                                                           id="claim_form" disabled={disabledInput}/>
                                                                </div>
                                                                <label htmlFor="invoiced_amount"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Invoiced
                                                                    Amount:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <input type="text" className="form-control"
                                                                           name="inv_invoiced_amount"
                                                                           value={oneClaimsData.invoiced_amount}
                                                                           id="invoiced_amount"
                                                                           disabled={disabledInput}/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="entrant"
                                                                       className="col-form-label col-sm-2 label-align pr-0 pl-0">Entrant:
                                                                </label>
                                                                <div className="col-sm-4">
                                                                    <input type="text" className="form-control"
                                                                           name="inv_entrant" value={oneClaimsData.user_id}
                                                                           id="entrant" readOnly/>
                                                                </div>
                                                                <label htmlFor="service"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Service:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <select className="form-control" name="inv_service"
                                                                            id={"service"}
                                                                            defaultValue={oneClaimsData.service}
                                                                            disabled={disabledInput}>
                                                                        <option
                                                                            value={oneClaimsData.service_code}>{oneClaimsData.service}</option>
                                                                        {service.map((data) => {
                                                                            return (
                                                                                <option key={data.CODE}
                                                                                        value={data.CODE}>
                                                                                    {data.SERVICE}
                                                                                </option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 pr-0">
                                                            <div className="form-group row ml-0 ">
                                                                <label htmlFor="product_name"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">Product
                                                                    Name:
                                                                </label>
                                                                <div className="col-md-8">
                                                                    <select name="inv_product_name" id={"product_name"}
                                                                            defaultValue={oneClaimsData.product_name}
                                                                            className="form-control" readOnly>
                                                                        <option
                                                                            value={oneClaimsData.product_code}>{oneClaimsData.product_name}
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="smart_bill_id"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">
                                                                    Smart Bill Id:
                                                                </label>
                                                                <div className="col-md-8">
                                                                    <input type="text" className="form-control"
                                                                           name="inv_smart_bill_id"
                                                                           value={oneClaimsData.smart_bill_id}
                                                                           readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="pre_auth_no"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">Pre
                                                                    Auth No:
                                                                </label>
                                                                <div className="col-md-8 col-sm-6">
                                                                    <input type="text" className="form-control"
                                                                           name="inv_pre_auth_no" id="pre_auth_no"
                                                                           value={oneClaimsData.pre_auth_no}
                                                                           disabled={disabledInput}/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="anniv"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">Anniv:
                                                                </label>
                                                                <div className="col-md-8 col-sm-6">
                                                                    <input type="text" className="form-control"
                                                                           name="inv_anniv"
                                                                           defaultValue={oneClaimsData.anniv}
                                                                           id="anniv" readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="date_received"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">Date
                                                                    Received:
                                                                </label>
                                                                <div className="col-md-8 col-sm-6">
                                                                    <input type="date" className="form-control"
                                                                           name="inv_date_received" id="date_received"
                                                                           maxLength={"4"} max={"9999-12-31"}
                                                                           defaultValue={oneClaimsData.date_received}
                                                                           readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="fund"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">Fund:
                                                                </label>
                                                                <div className="col-md-8 col-sm-6">
                                                                    <input type="checkbox" className="form-control fund"
                                                                           id="fund"
                                                                           defaultValue={oneClaimsData.fund}
                                                                           defaultChecked={oneClaimsData.fund === "1" ? "checked" : ""}
                                                                           disabled={disabledInput}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/*Spinner row*/}
                                                        <div className={"row"}>
                                                            <Spinner/>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <hr/>
                                                            <table className="table table-bordered table-sm"
                                                                   id="invoice_table" style={{maxHeight: "300px"}}>
                                                                <thead className="thead-dark">
                                                                <tr>
                                                                    <th hidden={"true"}>Id</th>
                                                                    <th>Member No</th>
                                                                    <th>Anniv</th>
                                                                    <th>Claim No</th>
                                                                    <th>Invoice No</th>
                                                                    <th>Provider</th>
                                                                    <th>Service</th>
                                                                    <th>Member No</th>
                                                                    <th>Invoiced Amount</th>
                                                                    <th>Amount Payable</th>
                                                                    <th>Invoice Date</th>
                                                                    <th>Member Names</th>
                                                                    <th>Vet Status</th>
                                                                    <th>Payee</th>
                                                                    <th>Voucher No</th>
                                                                    <th>Cheque No</th>
                                                                    <th>Cheque Date</th>
                                                                    <th>Pre Auth No</th>
                                                                    <th>Batch No</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {batchNoDetails.map((dt) => {
                                                                    return (
                                                                        <tr key={dt.id}>
                                                                            <td hidden={"true"}>{dt.id}</td>
                                                                            <td>{dt.member_no}</td>
                                                                            <td>{dt.anniv}</td>
                                                                            <td hidden={"true"}>{dt.benefit_code}</td>
                                                                            <td>{dt.claim_no}</td>
                                                                            <td>{dt.invoice_no}</td>
                                                                            <td hidden={"true"}>{dt.provider_code}</td>
                                                                            <td>{dt.provider}</td>
                                                                            <td hidden={"true"}>{dt.service_code}</td>
                                                                            <td>{dt.service}</td>
                                                                            <td>{dt.member_no}</td>
                                                                            <td>{parseFloat(dt.invoiced_amount).toLocaleString()}</td>
                                                                            <td>{parseFloat(dt.amount_payable).toLocaleString()}</td>
                                                                            <td>{dt.invoice_date}</td>
                                                                            <td>{dt.member_names}</td>
                                                                            <td>{dt.vet_status === '1' ? 'Accepted' :
                                                                                dt.vet_status === null ? 'Accepted' :
                                                                                    dt.vet_status === '2' ? 'Deferred' :
                                                                                        dt.vet_status === '3' ? 'Rejected' : ''}</td>
                                                                            <td>{dt.payee === '1' ? 'Pay To Provider' :
                                                                                dt.payee === null ? 'Pay To Provider' :
                                                                                    dt.payee === '2' ? 'Pay to Corporate' :
                                                                                        dt.payee === '3' ? 'Pay to Member' : ''}</td>
                                                                            <td>{dt.voucher_no}</td>
                                                                            <td>{dt.cheque_no}</td>
                                                                            <td>{dt.cheque_date}</td>
                                                                            <td>{dt.pre_auth_no}</td>
                                                                            <td>{dt.batch_no}</td>
                                                                            <td>
                                                                                <button
                                                                                    className="btn btn-success form-control select"
                                                                                    onClick={getClaimRowData}
                                                                                    /*disabled={disableActionBtn}*/>
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
                                                                    <th>{claimsTotal.length !== 0 ? parseFloat(claimsTotal.total_invoiced_amt).toLocaleString() : 0}</th>
                                                                    <th>{claimsTotal.length !== 0 ? parseFloat(claimsTotal.total_amount_payable).toLocaleString() : 0}</th>
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
                                                                </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*Claims tab*/}
                                            <div className="tab-pane fade"
                                                 id="nav-claim" role="tabpanel" aria-labelledby="nav-contact-tab">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-group row ml-0 ">
                                                            <label htmlFor="claim_no"
                                                                   className="col-form-label col-sm-2 label-align pr-0 pl-0">Claim
                                                                No:
                                                                <span className="required">*</span>
                                                            </label>
                                                            <div className="col-sm-4">
                                                                <input type="text" className="form-control"
                                                                       name="clm_claim_no" value={oneClaimsData.claim_no}
                                                                       id="claim_no" readOnly/>
                                                            </div>
                                                            <label htmlFor="visit_date"
                                                                   className="col-form-label label-right col-md-2 col-sm-2 pr-2 pl-0">Visit
                                                                Date:
                                                            </label>
                                                            <div className="col-md-4 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       name="clm_visit_date" id="visit_date"
                                                                       maxLength={"4"} max={"9999-12-31"}
                                                                       defaultValue={oneClaimsData.visit_date}
                                                                       disabled={disabledInput}/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row ml-0">
                                                            <label htmlFor="doctor_date"
                                                                   className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">
                                                                Doctor Date:
                                                            </label>
                                                            <div className="col-md-4 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       id="doctor_date" name="clm_doctor_date"
                                                                       maxLength={"4"} max={"9999-12-31"}
                                                                       defaultValue={oneClaimsData.doctor_date}
                                                                       disabled={disabledInput}/>
                                                            </div>
                                                            <label htmlFor="doctor_signed"
                                                                   className={"col-form-label col-md-2 label-align text-right"}>
                                                                Doctor Signed:
                                                            </label>
                                                            <div className={"col-md-1 pr-0 pl-0"}>
                                                                <input type="checkbox"
                                                                       className={"form-control mt-2 doctor_sign"}
                                                                       id="doctor_signed"
                                                                       defaultValue={oneClaimsData.doctor_sign === '1' ? 'checked' : ''}
                                                                       defaultChecked={oneClaimsData.doctor_sign === '1' ? true :
                                                                           oneClaimsData.doctor_sign === null ? false :
                                                                               oneClaimsData.doctor_sign === '0' ? false : false}
                                                                       disabled={disabledInput}/>
                                                            </div>
                                                            <label htmlFor="patient_signed"
                                                                   className={"col-form-label col-md-2 label-align text-right"}>Patient
                                                                Signed:
                                                            </label>
                                                            <div className={"col-md-1 pr-0 pl-0"}>
                                                                <input type="checkbox"
                                                                       className={"form-control mt-2 patient_sign"}
                                                                       id="patient_signed"
                                                                       defaultValue={oneClaimsData.patient_signed === '1' ? 'checked' : ''}
                                                                       defaultChecked={oneClaimsData.patient_signed === '1' ? true :
                                                                           oneClaimsData.patient_signed === null ? false :
                                                                               oneClaimsData.patient_signed === '0' ? false : false}
                                                                       disabled={disabledInput}/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row ml-0">
                                                            <label htmlFor="date_admitted"
                                                                   className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Date
                                                                Admitted:
                                                            </label>
                                                            <div className="col-md-4 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       name="clm_date_admitted" id="date_admitted"
                                                                       maxLength={"4"} max={"9999-12-31"}
                                                                       defaultValue={oneClaimsData.date_admitted}
                                                                       disabled={disabledInput}/>
                                                            </div>
                                                            <label htmlFor="date_discharged"
                                                                   className="col-form-label label-right col-md-2 col-sm-2 pr-2 pl-0">
                                                                Date Discharged:
                                                            </label>
                                                            <div className="col-md-4 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       name="clm_date_discharged" id="date_discharged"
                                                                       maxLength={"4"} max={"9999-12-31"}
                                                                       defaultValue={oneClaimsData.date_discharged}
                                                                       disabled={disabledInput}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr/>
                                                <div className="row" style={{marginTop: "20px"}}>
                                                    <div className="mx-auto">
                                                        <button className="btn btn-info col-2 form-control"
                                                                onClick={openModal2}>Add Diagnosis
                                                        </button>
                                                        <table className="table table-bordered"
                                                               style={{maxHeight: "300px"}} id={"diagnosis_table"}>
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
                                            {/*Vet tab*/}
                                            <div className="tab-pane fade table-responsive"
                                                 id="nav-vet" role="tabpanel" aria-labelledby="nav-contact-tab">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <p className="h2 text-info">Vet</p>
                                                        <hr/>
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-2">
                                                                <label className="col-form-label label-align">
                                                                    Gender:
                                                                </label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <input type="text" className="form-control" id={"gender"}
                                                                       defaultValue={oneClaimsData.gender} readOnly/>
                                                                <input hidden type="text" className="form-control"
                                                                       name="vet_gender_code" id={"gender_code"}
                                                                       defaultValue={oneClaimsData.gender_code} readOnly/>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label className="col-form-label label-align">
                                                                    Family Title:
                                                                </label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <input type="text" className="form-control"
                                                                       id={"family_title"}
                                                                       defaultValue={oneClaimsData.relation}
                                                                       readOnly/>
                                                                <input hidden type="text" className="form-control"
                                                                       name="vet_family_title_code"
                                                                       defaultValue={oneClaimsData.family_title_code} readOnly/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-2">
                                                                <label className="col-form-label label-align">
                                                                    DOB:
                                                                </label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <input type="text" className="form-control"
                                                                       name="vet_dob" id={"dob"}
                                                                       defaultValue={oneClaimsData.dob} readOnly/>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label className="col-form-label label-align">
                                                                    Claim No:
                                                                </label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <input type="text" className="form-control"
                                                                       name={"vet_claim_no"}
                                                                       defaultValue={oneClaimsData.claim_no} readOnly/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-2">
                                                                <label className="col-form-label">
                                                                    Invoice No:
                                                                </label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <input type="text" className="form-control"
                                                                       name={"vet_invoice_no"}
                                                                       value={oneClaimsData.invoice_no} readOnly/>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label className="col-form-label">
                                                                    Service:
                                                                </label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <select className="form-control" name="vet_service"
                                                                        disabled={disabledInput}>
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
                                                                <select className="form-control" name="vet_provider"
                                                                        disabled={disabledInput}>
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
                                                            <fieldset className="col-md-10 pr-0 pl-0 vet_status"
                                                                      value={vetStatus} name={"vet_status_code"}
                                                                      onChange={checkDiagnosis}>
                                                                <div className={"row"}>
                                                                    <div className={"col-md-4"}>
                                                                        <label htmlFor="approve">
                                                                            <input type="radio" name="vet_status"
                                                                                   value="1" id="approve"
                                                                                   checked={vetStatus === '1'}
                                                                                   disabled={disabledInput}/>
                                                                            Approve
                                                                        </label>
                                                                    </div>
                                                                    <div className={"col-md-4"}>
                                                                        <label htmlFor="reject">
                                                                            <input type="radio" name="vet_status"
                                                                                   value="2" id="reject"
                                                                                   checked={vetStatus === '2'}
                                                                                   disabled={disabledInput}/>
                                                                            Reject
                                                                        </label>
                                                                    </div>
                                                                    <div className={"col-md-4"}>
                                                                        <label htmlFor="reject">
                                                                            <input type="radio" name="vet_status"
                                                                                   value="3" id="suspend"
                                                                                   checked={vetStatus === '3'}
                                                                                   disabled={disabledInput}/>
                                                                            Suspend
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-2">
                                                                <label className="col-form-label">User</label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <input type="text" name="user"
                                                                    className="form-control"
                                                                    value={localStorage.getItem("username")}
                                                                    readOnly/>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <label className="col-form-label">
                                                                    Date Vetted
                                                                </label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <input type="text" className="form-control"
                                                                       name="vet_vetted" id={"date_vetted"}
                                                                       value={today2()} readOnly/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-2">
                                                                <label className="col-form-label">Reason</label>
                                                            </div>
                                                            <div className="col-md-10">
                                                                <select className="form-control" id={"vet_bill_reason"}
                                                                        name="vet_bill_reason" defaultValue={null}
                                                                        disabled={disabledInput}>
                                                                    <option disabled value={null}>
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
                                                                <textarea name="vet_remarks" className="form-control"
                                                                          disabled={disabledInput}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p className="h2 text-info">Deduction</p>
                                                        <hr/>
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-4">
                                                                <label
                                                                    className="col-form-label float-right label-right pr-3">
                                                                    Invoiced Amount
                                                                </label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <input type="number" className="form-control"
                                                                       defaultValue={0} name={"vet_invoiced_amount"}
                                                                       value={oneClaimsData.invoiced_amount} readOnly/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-4">
                                                                <label
                                                                    className="col-form-label float-right label-right pr-3">
                                                                    Deduction Amount
                                                                </label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <input type="number" className="form-control"
                                                                       name="vet_deduction_amount"
                                                                       min={0} defaultValue={0}
                                                                       onChange={(e) =>
                                                                           setDeductionAmt(e.target.value)}/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-4">
                                                                <label
                                                                    className="col-form-label float-right label-right pr-3">
                                                                    Deduction Reason
                                                                </label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <select className="form-control"
                                                                        name="vet_deduction_reason"
                                                                        defaultValue="0">
                                                                    <option disabled value="0">
                                                                        Select deduction reason
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
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-4">
                                                                <label
                                                                    className="col-form-label float-right label-right pr-3">
                                                                    Amount Payable
                                                                </label>
                                                            </div>
                                                            <div className="col-md-8">
                                                                <input type="text" className="form-control"
                                                                       name="vet_amount_payable"
                                                                       value={oneClaimsData.length != 0 ?
                                                                           oneClaimsData.invoiced_amount - deductionAmt : 0.0}
                                                                       readOnly/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row justify-content-center">
                                                            <div className="col-md-4">
                                                                <label
                                                                    className="col-form-label  float-right label-right pr-3">
                                                                    Deduction Notes
                                                                </label>
                                                            </div>
                                                            <div className="col-md-8">
                                                        <textarea name="vet_deduction_notes"
                                                                  className="form-control"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <p className="h2 text-info">Main Benefit</p>
                                                                <hr/>
                                                                <div className="form-group row justify-content-center">
                                                                    <div className="col-md-2">
                                                                        <label className="col-form-label label-align">
                                                                            Limit
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <input type="text"
                                                                               className="form-control text-success"
                                                                               value={parseFloat(mainBalances.limit).toLocaleString()}
                                                                               readOnly/>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row justify-content-center">
                                                                    <div className="col-md-2">
                                                                        <label className="col-form-label label-align">
                                                                            Claims
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <input type="text"
                                                                               className="form-control text-success"
                                                                               value={parseFloat(mainBalances.claims).toLocaleString()}
                                                                               readOnly/>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row justify-content-center">
                                                                    <div className="col-md-2">
                                                                        <label className="col-form-label label-align">
                                                                            Reserves
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <input type="text"
                                                                               className="form-control text-success"
                                                                               value={parseFloat(mainBalances.reserves).toLocaleString()}
                                                                               readOnly/>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row justify-content-center">
                                                                    <div className="col-md-2">
                                                                        <label className="col-form-label label-align">
                                                                            Balance
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <input type="text"
                                                                               className="form-control text-success"
                                                                               value={parseFloat(mainBalances.balance).toLocaleString()}
                                                                               readOnly/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <p className="h2 text-info">Benefits</p>
                                                                <hr/>
                                                                <div className="form-group row justify-content-center">
                                                                    <div className="col-md-2">
                                                                        <label className="col-form-label label-align">
                                                                            Limit
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <input type="text"
                                                                               className="form-control text-success"
                                                                               value={parseFloat(claimBalances.limit).toLocaleString()}
                                                                               readOnly/>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row justify-content-center">
                                                                    <div className="col-md-2">
                                                                        <label className="col-form-label label-align">
                                                                            Claims
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <input type="text"
                                                                               className="form-control text-success"
                                                                               value={parseFloat(claimBalances.claims).toLocaleString()}
                                                                               readOnly/>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row justify-content-center">
                                                                    <div className="col-md-2">
                                                                        <label className="col-form-label label-align">
                                                                            Reserves
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <input type="text"
                                                                               className="form-control text-success"
                                                                               value={parseFloat(claimBalances.reserves).toLocaleString()}
                                                                               readOnly/>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row justify-content-center">
                                                                    <div className="col-md-2">
                                                                        <label className="col-form-label label-align">
                                                                            Balance
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-md-10">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control text-success"
                                                                            value={parseFloat(claimBalances.balance).toLocaleString()}
                                                                            readOnly/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={"row justify-content-center mt-2"}>
                                                            <button type="submit"
                                                                    className="btn btn-outline-success form-control col-2 mt-2"
                                                                    style={{float: "right", position: "sticky"}}
                                                                    disabled={disable.save_btn}>
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
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
            {/*Member Benefits Modal*/}
            <Modal5
                modalIsOpen={modalOneOpen}
                closeModal={closeModal}
                header={<p id="headers">Member Benefits</p>}
                body={
                    <div>
                        <div className="col-md-12">
                            <hr/>
                            <table className="table table-bordered table-sm"
                                   id="invoice_table" style={{maxHeight: "250px"}}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Member No</th>
                                    <th>Health Plan</th>
                                    <th>Benefit</th>
                                    <th>Limit</th>
                                    <th>Sharing</th>
                                    <th>Sub Limit Of</th>
                                    <th>Anniv</th>
                                </tr>
                                </thead>
                                <tbody>
                                {memberBenefits.map((data) => {
                                    return (
                                        <tr>
                                            <td>{data.member_no}</td>
                                            <td>{data.category}</td>
                                            <td>{data.benefit}</td>
                                            <td>{data.limit}</td>
                                            <td>{data.sharing}</td>
                                            <td>{data.sub_limit_of}</td>
                                            <td>{data.anniv}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <button className="btn btn-danger float-right"
                                        onClick={() => setModalOneOpen(false)}>Close
                                </button>
                            </div>
                        </div>

                    </div>
                }/>
            <CustomModal
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                header={<p className="alert alert-info text-lg">Choose Member</p>}
                body={
                    <table
                        id="tblPrincipal"
                        className="table table-bordered table-sm text-center"
                        style={{height: "200px"}}
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

            <Modal2 modalIsOpen={modal2IsOpen}
                    closeModal={closeModal2}
                    body={
                        <div>
                            <div className="row" style={{margin: "10px"}}>
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
                                <Spinner/>
                            </div>
                            <div className="table-responsive">
                                <table
                                    className="table table-bordered table-sm"
                                    style={{maxHeight: "400px", width: "500px"}}
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
            <Modal3
                modalIsOpen={modal3IsOpen}
                closeModal={closeModal3}
                header={
                    <p className="text-info h2 font-weight-bold">
                        Choose Preauthorization
                    </p>
                }
                body={
                    <table
                        className="table table-bordered table-sm"
                        style={{maxHeight: "400px", width: "500px"}}
                    >
                        <thead className="thead-dark">
                        <tr>
                            <th>Code</th>
                            <th>Member No</th>
                            <th>Provider</th>
                            <th>Date Authorized</th>
                            <th>Authority Type</th>
                            <th>Available Limit</th>
                            <th>Admit Days</th>
                            <th>Reserve</th>
                            <th>Batch No</th>
                        </tr>
                        </thead>
                        <tbody>
                        {preauths.map((dt) => {
                            return (
                                <tr key={dt.code}>
                                    <td>{dt.code}</td>
                                    <td>{dt.member_no}</td>
                                    <td>{dt.provider}</td>
                                    <td>{dt.admission_date}</td>
                                    <td>{dt.discharge_date}</td>
                                    <td>{dt.pre_diagnosis}</td>
                                    <td>{dt.authority_type}</td>
                                    <td>
                                        <button
                                            className="btn btn-success form-control select"
                                            onClick={getPreauthNo}
                                        >
                                            Select
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                }
            />
            {/*Message modal*/}
            <MessageModal
                modalIsOpen={messageModal}
                closeModal={closeMessageModal}
                background="#0047AB"
                body={
                    <p className="text-white font-weight-bold h4">{response}</p>
                }
            />
        </div>
    );
}

export default QueryBatch;
