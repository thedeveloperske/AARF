import {useState, useEffect} from 'react'
import {toInputUpperCase} from "../../../../components/helpers/toInputUpperCase";
import Modal4 from "../../../../components/helpers/Modal4";
import {getData, getOneData, getTwoData, postData} from "../../../../components/helpers/Data";
import FormatDate from "../../../../components/helpers/FormatDate";
import {validateDate} from "../../../../components/helpers/validateDate";
import Modal5 from "../../../../components/helpers/Modal5";
import {Spinner} from "../../../../components/helpers/Spinner";
import Modal6 from "../../../../components/helpers/Modal6";

const EnterBill = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
    const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
    const [isFourthModalOpen, setFourthModalOpen] = useState(false);
    const [messageModal, setMessageModal] = useState(false);
    const [corporates, setCorporates] = useState([]);
    const [memberDetailsTable, setMemberDetailsTable] = useState([]);
    const [selectedMemberDetails, setSelectedMemberDetails] = useState([]);
    const [selectedCorporate, setSelectedCorporate] = useState([]);
    const [familyRelationDropwdown, setFamilyRelationDropdown] = useState([]);
    const [memberCoverDates, setMemberCoverDates] = useState([]);
    const [providers, setProviders] = useState([]);
    const [selectedProviders, setSelectedProvider] = useState([]);
    const [memberBenefits, setMemberBenefits] = useState([]);
    const [memberAnniv, setMemberAnniv] = useState([]);
    const [services, setServices] = useState([]);
    const [invoiceDate, setInvoiceDate] = useState([]);
    const [batchDateReceived, setBatchDateReceived] = useState([]);
    const [productName, setProductName] = useState([]);
    const [productCode, setProductCode] = useState([]);
    const [fund, setFund] = useState([]);
    const [message, setMessage] = useState([]);
    const [providerBatchNumbers, setProviderBatchNumbers] = useState([]);
    useEffect(() => {
        setIsModalOpen(true);
    }, []);
    //close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setIsSecondModalOpen(false);
        setIsThirdModalOpen(false);
        setFourthModalOpen(false);
    }
    useEffect(() => {
        getData('fetch_corporates').then((data) => {
            setCorporates(data);
        })
    }, []);
    useEffect(() => {
        getData('fetch_family_relation').then((data) => {
            setFamilyRelationDropdown(data);
        })
    }, [])
    useEffect(() => {
        getData('fetch_providers').then((data) => {
            setProviders(data);
        })
    }, [])
    useEffect(() => {
        getData('fetch_services').then((data) => {
            setServices(data);
        })
    }, [])
    //search member
    const searchMember = (e) => {
        e.preventDefault();
        const selected_radio = document.querySelectorAll('.select_radio_option').value;
        console.log(selected_radio);
        //start loader
        document.getElementById('spinner').style.display = 'block';
        const frmData = new FormData(document.getElementById('search_member_form'));
        postData(frmData, 'enter_bill_search_member').then((data) => {
            if (data.length === 0) {
                //alert('Member does not exist in corporate');
                //stop loader
                document.getElementById('spinner').style.display = 'none';
                setMessage('Member does not exist');
                setFourthModalOpen(true)
            } else {
                //stop loader
                document.getElementById('spinner').style.display = 'none';
                setMemberDetailsTable(data);
            }
        });

    }
    //get selected member details
    const getRowData = (e) => {
        e.preventDefault();
        const arr = [];
        e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
            arr.push(element.textContent);
            //console.log(element.textContent);
        });
        //setIsModalOpen(false);
        getOneData("fetch_member_details", arr[2]).then((data) => {
            console.log(data);
            setSelectedMemberDetails(data[0]);
            setIsSecondModalOpen(true);
        });
    }
    const confirmYes = () => {
        setIsSecondModalOpen(false);
        const member_no = selectedMemberDetails.member_no;
        getOneData('fetch_member_cover_dates', member_no).then((data) => {
            console.log(data);
            setMemberCoverDates(data[0]);
            setIsThirdModalOpen(true);
        })
    }
    //show form and set provider
    const setProvider = (e) => {
        e.preventDefault();
        //start loader
        document.getElementById('spinner').style.display = 'block';
        setSelectedProvider(e.target.value);

        //fetch all batch numbers for provider
        getOneData('fetch_all_provider_batch_numbers', e.target.value).then((data) => {
            console.log(data)
            setProviderBatchNumbers(data);
            //stop loader
            document.getElementById('spinner').style.display = 'none';
            //show from
            document.getElementById('paragraph_div').style.display = 'none';
            document.getElementById('container_div').style.display = 'block';
        }).catch((error) => {
            console.log(error)
            //stop loader
            document.getElementById('spinner').style.display = 'none';
        })

    }
    //fetch member benefits for member in current anniversary dates
    const fetchMemberBenefits = (e) => {
        e.preventDefault();
        setInvoiceDate(FormatDate(document.getElementById('invoice_date').value));

        const dt = validateDate(document.getElementById('invoice_date').value);
        console.log(dt);
        const frmData = new FormData();
        frmData.append('member_no', selectedMemberDetails.member_no);
        frmData.append('invoice_date', document.getElementById('invoice_date').value);
        if (dt) {
            postData(frmData, "fetch_member_benefits").then((data) => {
                console.log(data);
                if (data.benefits.length > 0) {
                    setMemberBenefits(data.benefits)
                    setMemberAnniv(data.anniv)
                    if (data.ever_cancelled_status > 0) {
                        if (data.ever_cancelled_status === 1) {
                            if (new Date(invoiceDate) >= new Date(data.cancelled_date)) {
                                console.log(new Date(invoiceDate));
                                console.log(new Date(data.cancelled_date));
                                if (data.current_cancelled_status === 1) {
                                    //alert('Notice,Member claimed while they were not active !')
                                    setMessage('Notice ! Member claimed while they were not active !')
                                    setMessageModal(true);
                                }
                            }
                        }
                    }
                } else {
                    //alert(data.message);
                    setMessage(data.message)
                    setMessageModal(true)
                    setMemberBenefits(data.benefits)
                    setMemberAnniv(0);
                }
            });
        }
    }
    //fetch date received from batch number
    const fetchBatchDateReceived = (e) => {

        //e.preventDefault();
        let batch_no = document.getElementById('batch').value;
        if (e.key === 'Enter') {
            if (selectedProviders.length === 0 || !batch_no) {
                //alert('Select Provider and the respective Batch')
                setMessage('Select Provider and the respective Batch');
                setMessageModal(true);
            } else {
                //batch_no = JSON.stringify(batch_no);
                batch_no = batch_no + '';
                console.log(batch_no);
                console.log(providerBatchNumbers);
                //check if batch number exists in provider batches array
                if (providerBatchNumbers.indexOf(batch_no) !== -1) {
                    console.log('true')
                    getTwoData('fetch_batch_date_received', batch_no, selectedProviders).then((data) => {
                        console.log(data);
                        if (data.length !== 0) {
                            setBatchDateReceived(data[0].date_received);
                            let invoice_date = new Date(invoiceDate);
                            let date_received = new Date(batchDateReceived);
                            console.log(invoice_date);
                            console.log(date_received);
                            const diff_in_time = invoice_date.getTime() - date_received.getTime();
                            const diff_in_days = diff_in_time / (1000 * 3600 * 24);
                            console.log(diff_in_days);
                            if (diff_in_days > 90) {
                                //alert('Notice, Claim received after 90 days - thus time barred...' + diff_in_days + ' Days')
                                setMessage('Notice ! Claim received after 90 days - thus time barred...' + diff_in_days + ' Days');
                                setMessageModal(true);
                            }

                        } else {
                            //alert('Notice! No Batch exists for provider');
                            setMessage('Notice ! No Batch Date recorder for provider');
                            setMessageModal(true);
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                } else {
                    //alert('Notice! No Batch exists for provider');
                    setMessage('Notice ! No Batch exists for provider');
                    setMessageModal(true);
                }
            }

        }
    }
    //fetch product name from the benefit selected
    const fetchProductName = (e) => {
        e.preventDefault();
        const frmData = new FormData();
        const benefit = document.getElementById('benefit').value;
        frmData.append('member_no', selectedMemberDetails.member_no);
        frmData.append('anniv', memberAnniv);
        frmData.append('benefit', benefit);
        frmData.append('provider', selectedProviders);
        postData(frmData, 'fetch_product_name').then((data) => {
            console.log(data);
            if (data.pre_auth.length > 0) {
                //open pre_auth modal
            }
            if (data.product.suspended === '1') {
                //alert('Notice, Benefit is suspended!');
                setMessage('Notice ! Benefit is suspended!');
                setMessageModal(true);
            }
            //ensure the member is claiming after the benefits waiting period
            if (data.waiting_period > 0) {
                let relative_date = new Date(data.cover_start_date);
                relative_date.setDate(relative_date.getDate() + data.waiting_period);
                console.log(relative_date)
                console.log(invoiceDate)
                let invoice_date = new Date(invoiceDate);

                if (invoice_date < relative_date) {
                    //alert('Notice, This member is claiming within the waiting period!');
                    setMessage('Notice ! This member is claiming within the waiting period!');
                    setMessageModal(true);
                }
            }
            if (data.product.suspended === '0') {
                setProductName(data.product.product_name);
                setProductCode(data.product.product_code);
                setFund(data.fund);
                if (fund === '1') {
                    document.getElementById('fund').checked = true;
                } else {
                    document.getElementById('fund').checked = false;
                }
            }
        })
    }
    //check for frames 
    const fetchFrames = (e) => {
        const benefit = document.getElementById('benefit').value
        const service = document.getElementById('service').value
        if (!(benefit > 0)) {
            setMessage('Notice ! Select Member Benefit');
            setMessageModal(true);
        } else {
            if (service === '40') {
                e.preventDefault();
                const frmData = new FormData();
                frmData.append('member_no', selectedMemberDetails.member_no);
                frmData.append('benefit', document.getElementById('benefit').value);
                frmData.append('service', service);
                frmData.append('anniv', memberAnniv);

                postData(frmData, 'fetch_frames_services').then((data) => {
                    console.log(data);
                    //alert(data.message)
                    setMessage(data.message);
                    setMessageModal(true);
                });
            }
        }
    }
    //save enter bill
    const saveEnterBill = (e) => {
        e.preventDefault();
        const errors = new Array();
        if (!(document.getElementById('invoiced_amount').value)) {
            errors.push('Notice! Enter Invoiced Amount');
            //alert('Notice! Enter Invoiced Amount');
            setMessage('Notice ! Enter Invoiced Amount');
            setMessageModal(true);
        }
        if (document.getElementById('smart_bill_id').value === null) {
            if (document.getElementById('batch').value === null) {
                errors.push('Notice, Indicate the Batch Number');
                //alert('Notice, Indicate the Batch Number');
                setMessage('Notice ! Indicate the Batch Number');
                setMessageModal(true);
            }
        }
        if (invoiceDate > batchDateReceived) {
            errors.push('Notice, Invoice date cannot be greater then date received. Please update');
            //alert('Notice, Invoice date cannot be greater then date received. Please update');
            setMessage('Notice ! Invoice date cannot be greater then date received. Please update');
            setMessageModal(true);
        }
        //check if errorrs is empty
        if (errors.length > 0) {
            //alert('Notice! Check Claim Form for Errors')
            setMessage('Notice ! Check Claims Form for Errors');
            setMessageModal(true);
        } else {
            const fundCheckbox = document.querySelectorAll(".fund");
            const doctorSignCheckbox = document.querySelectorAll(".doctor");
            const patientSignCheckbox = document.querySelectorAll(".patient");
            const frmData = new FormData(document.getElementById('enter_bill_form'));
            fundCheckbox.forEach((element) => {
                if (element.checked == true) {
                    frmData.append("fund", "1");
                } else {
                    frmData.append("fund", "0");
                }
            });
            doctorSignCheckbox.forEach((element) => {
                if (element.checked == true) {
                    frmData.append("doctor_signed", "1");
                } else {
                    frmData.append("doctor_signed", "0");
                }
            });
            patientSignCheckbox.forEach((element) => {
                if (element.checked == true) {
                    frmData.append("patient_signed", "1");
                } else {
                    frmData.append("patient_signed", "0");
                }
            });
            postData(frmData, 'save_enter_bill').then((data) => {
                console.log(data);
                if (data){
                    setMessage(data.message);
                    setFourthModalOpen(true);
                }
                else if (data.error){
                    setMessage('Notice ! Error Saving Manual Bill');
                    setFourthModalOpen(true);
                }
            }).catch((error) => { console.log(error)} )
        }
    }
    return (
        <div>
            {/*Member authenticity modal*/}
            <Modal6
                modalIsOpen={isModalOpen}
                closeModal={closeModal}
                header={<p id="headers">Membership Authenticity</p>}
                body={
                    <div>
                        <form id={"search_member_form"} onSubmit={searchMember}>
                            <div className="col-md-12">
                                <div className="row ml-0">
                                    <label>Search Member</label>
                                    <div className="form-group row">
                                        {/*<label htmlFor={"select_corporate_dropdown"}
                                               className="col-form-label col-sm-1 label-align pr-0 pl-0">Corporate</label>
                                        <div className={"col-md-4"}>
                                            <select className={"form-control"} name={"corp_id"} id={"corp_id"}
                                                    onChange={(e) => setSelectedCorporate(e.target.value)}>
                                                <option>Select Corporate</option>
                                                {corporates.map((data) => {
                                                    return (<option value={data.CORP_ID}>{data.CORPORATE}</option>)
                                                })}
                                            </select>
                                        </div>*/}
                                        <div className={"col-md-1 pr-0 pl-0"}>
                                            <input type={"radio"} className={"form-control mt-2"}
                                                   name={"select_radio_option"} id={"member_name_rd_option"}
                                                   value={"1"}/>
                                        </div>
                                        <label htmlFor={"member_name_rd_option"}
                                               className="col-form-label col-sm-1.5 label-align pr-0 pl-0">Member
                                            Name</label>
                                        <div className={"col-md-1 pr-0 pl-0"}>
                                            <input type={"radio"} className={"form-control mt-2"}
                                                   name={"select_radio_option"} id={"member_no_rd_option"}
                                                   value={"2"}/>
                                        </div>
                                        <label htmlFor={"member_no_rd_option"}
                                               className="col-form-label col-sm-1.5 label-align pr-2 pl-0">Member
                                            No</label>
                                        <div className={"col-md-2 pr-0 pl-0"}>
                                            <input className={"form-control"} type={"text"} onInput={toInputUpperCase}
                                                   name={"search_value"}/>
                                        </div>
                                        <div className={"col-md-1 pr-0 pl-2"}>
                                            <button type={"submit"}
                                                    className="btn btn-outline-info btn-sm btn-block">Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form>
                            <div className="table-responsive">
                                <table className="table table-bordered" id="member_details"
                                       style={{maxHeight: '250px'}}>
                                    <thead className="thead-dark">
                                    <tr>
                                        <th>Principal Name</th>
                                        <th>Family No</th>
                                        <th>Member No</th>
                                        <th>Member Name</th>
                                        <th>Gender</th>
                                        <th>D.O.B</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {memberDetailsTable.map((data) => {
                                        return (
                                            <tr>
                                                <td>{data.principal_name}</td>
                                                <td>{data.family_no}</td>
                                                <td>{data.member_no}</td>
                                                <td>{data.member_name}</td>
                                                <td>{data.gender === '1' ? 'MALE' : data.gender === '2' ? 'FEMALE' : null}</td>
                                                <td>{data.dob}</td>
                                                <td>
                                                    <button className="btn btn-outline-info btn-sm btn-block"
                                                            onClick={getRowData}>
                                                        Select
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <Spinner/>
                            </div>
                            <div className={"row"}>
                                <label>Verify Member</label>
                                <div className={"col-md-12"} style={{border: "1px solid grey"}}>
                                    <div className={"form-group row justify-content-center mt-2"}>
                                        <label htmlFor={"family_no"}
                                               className="col-form-label col-sm-2 label-align pr-0 pl-0">
                                            Family No:
                                        </label>
                                        <div className={"col-md-3 pr-0 pl-0"}>
                                            <input type={"text"} className={"form-control"}
                                                   value={selectedMemberDetails.family_no} readOnly/>
                                        </div>
                                        <label htmlFor={"member_no"}
                                               className="col-form-label col-sm-2 label-align label-right pr-2 pl-0">
                                            Member No:
                                        </label>
                                        <div className={"col-md-3 pr-0 pl-0"}>
                                            <input type={"text"} className={"form-control"} id={"member_no_modal"}
                                                   value={selectedMemberDetails.member_no} readOnly/>
                                        </div>
                                    </div>
                                    <div className={"form-group row justify-content-center"}>
                                        <label htmlFor={"member_names"}
                                               className="col-form-label col-sm-2 label-align pr-0 pl-0">
                                            Member Names:
                                        </label>
                                        <div className={"col-md-8 pr-0 pl-0"}>
                                            <input type={"text"} className={"form-control"}
                                                   value={selectedMemberDetails.member_name} readOnly/>
                                        </div>
                                    </div>
                                    <div className={"form-group row justify-content-center"}>
                                        <label htmlFor={"relation_to_principal"}
                                               className="col-form-label col-sm-2 label-align pr-0 pl-0">
                                            Relation to Principal:
                                        </label>
                                        <div className={"col-md-3 pr-0 pl-0"}>
                                            <select className="form-control" name="relation[]"
                                                    value={selectedMemberDetails.relation_to_principal} readOnly>
                                                <option></option>
                                                {familyRelationDropwdown.map((data) => {
                                                    return (
                                                        <option key={data.CODE} value={data.CODE}>
                                                            {data.RELATION}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                        <label htmlFor={"family_title"}
                                               className="col-form-label col-sm-2 label-align label-right pr-2 pl-0">
                                            Family Title:
                                        </label>
                                        <div className={"col-md-3 pr-0 pl-0"}>
                                            <select className="form-control" name="relation[]"
                                                    value={selectedMemberDetails.family_title} readOnly>
                                                <option></option>
                                                {familyRelationDropwdown.map((data) => {
                                                    return (
                                                        <option key={data.CODE} value={data.CODE}>
                                                            {data.RELATION}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={"form-group row justify-content-center"}>
                                        <label htmlFor={"principal_name"}
                                               className="col-form-label col-sm-2 label-align pr-0 pl-0">
                                            Principal Names:
                                        </label>
                                        <div className={"col-md-8 pr-0 pl-0"}>
                                            <input type={"text"} className={"form-control"}
                                                   value={selectedMemberDetails.principal_name} readOnly/>
                                        </div>
                                    </div>
                                    <div className={"form-group row justify-content-center"}>
                                        <label htmlFor={"corporate"}
                                               className="col-form-label col-sm-2 label-align pr-0 pl-0">
                                            Corporate:
                                        </label>
                                        <div className={"col-md-8 pr-0 pl-0"}>
                                            <input type={"text"} className={"form-control"}
                                                   value={selectedMemberDetails.corporate} readOnly/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <Modal4
                            modalIsOpen={isSecondModalOpen}
                            closeModal={closeModal}
                            header={<p id="headers">Membership Authenticity</p>}
                            body={
                                <div>
                                    <p>Is this the correct member ?</p>
                                </div>
                            }
                            buttons={
                                <div className="row">
                                    <div className="col-md-6">
                                        <button className="btn btn-success"
                                                onClick={confirmYes}>Yes
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <button className="btn btn-danger float-right"
                                                onClick={() => setIsSecondModalOpen(false)}>No
                                        </button>
                                    </div>
                                </div>
                            }
                        />
                        <Modal4
                            modalIsOpen={isThirdModalOpen}
                            closeModal={closeModal}
                            header={<p id="headers">Membership Cover Dates</p>}
                            body={
                                <div>
                                    <div className={"row"}>
                                        <div className={"col-md-12"}>
                                            <div className={"form-group row"}>
                                                <label className={"pr-2 mb-0"}>Start Date:</label>
                                                <div>{memberCoverDates.start_date}</div>
                                            </div>
                                            <div className={"form-group row"}>
                                                <label className={"pr-2 mb-0"}>End Date:</label>
                                                <div>{memberCoverDates.end_date}</div>
                                            </div>
                                            <div className={"form-group row"}>
                                                <label className={"pr-2 mb-0"}>Renewal Date:</label>
                                                <div>{memberCoverDates.renewal_date}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            buttons={
                                <div className="row">
                                    <div className="col-md-6">
                                        <button className="btn btn-danger float-right"
                                                onClick={closeModal}>Close
                                        </button>
                                    </div>
                                </div>
                            }/>
                    </div>
                }/>
            <div className="row ml-0">
                <h4 className="fs-title">Enter Claim</h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0">
                        <div className="form-group row">
                            <label htmlFor={"provider"}
                                   className="col-form-label col-sm-1 label-right pr-0 pl-0 mr-4">Provider:</label>
                            <div className={"col-md-5 pr-0 pl-0"}>
                                <select className={"form-control"} name={"select_provider_dropdown"}
                                        id={"select_provider_dropdown"}
                                        onChange={setProvider}>
                                    <option value={null}>Select Provider</option>
                                    {providers.map((data) => {
                                        return (
                                            <option value={data.CODE}>{data.PROVIDER}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section id="" className="project-tab">
                <div className={"row justify-content-center"} id={"paragraph_div"}>
                    <h4 style={{color: "forestgreen"}}>Select Provider</h4>
                </div>
                <div className="container" id={"container_div"} style={{display: "none"}}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <nav>
                                        <div className="nav nav-tabs nav-fill" id="nav-tab"
                                             role="tablist">
                                            <a className="nav-item nav-link active" id="nav-home-tab"
                                               data-toggle="tab" href="#nav-invoice" role="tab" aria-controls="nav-home"
                                               aria-selected="true" disabled selected>INVOICE
                                            </a>
                                            <a className="nav-item nav-link" id="nav-contact-tab"
                                               data-toggle="tab" href="#nav-claim" role="tab"
                                               aria-controls="nav-contact" aria-selected="false">CLAIM
                                            </a>
                                        </div>
                                    </nav>
                                </div>
                                <div className="card-body">
                                    <form id="enter_bill_form" className="">
                                        <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade show active corporate-tab-content"
                                                 id="nav-invoice"
                                                 role="tabpanel" aria-labelledby="nav-home-tab">
                                                <div id="step-1">
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <div className="form-group row ml-0 ">
                                                                <label htmlFor="claim_no"
                                                                       className="col-form-label col-sm-2 label-align pr-0 pl-0">Claim
                                                                    No:
                                                                </label>
                                                                <div className="col-sm-4">
                                                                    <input type="text" className="form-control"
                                                                           name="claim_no" required="true" id="claim_no"
                                                                           readOnly/>
                                                                </div>
                                                                <label htmlFor="provider"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Provider:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <select className="form-control" name="provider"
                                                                            value={selectedProviders}>
                                                                        <option>Select Provider</option>
                                                                        {providers.map((data) => {
                                                                            return (
                                                                                <option
                                                                                    value={data.CODE}>{data.PROVIDER}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="member_no"
                                                                       className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0">Member
                                                                    No:
                                                                </label>
                                                                <div className="col-md-4 col-sm-4 ">
                                                                    <input type="text" className="form-control"
                                                                           name="member_no"
                                                                           id="member_no"
                                                                           value={selectedMemberDetails.member_no}
                                                                           readOnly/>
                                                                </div>
                                                                <label htmlFor="invoice_date"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Invoice
                                                                    Date:
                                                                </label>
                                                                <div className="col-md-4 col-sm-4">
                                                                    <input type="date" className="form-control"
                                                                           id="invoice_date" name="invoice_date"
                                                                           maxLength={"4"} max={"9999-12-31"}
                                                                           onChange={fetchMemberBenefits}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="batch"
                                                                       className="col-form-label col-sm-2 label-align pr-0 pl-0">Batch:
                                                                </label>
                                                                <div className="col-sm-4">
                                                                    <input type="text" className="form-control"
                                                                           name="batch" required="true" id="batch"
                                                                           placeholder={"Enter Batch No #(0000) and Press Enter"}
                                                                           onInput={toInputUpperCase}
                                                                           onKeyPress={fetchBatchDateReceived}/>
                                                                </div>
                                                                <label htmlFor="invoice_no"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Invoice
                                                                    No:
                                                                </label>
                                                                <div className="col-md-4 col-sm-4">
                                                                    <input type="text" className="form-control"
                                                                           id="invoice_no" name="invoice_no"/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="pay_to"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Pay
                                                                    To:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <select name="pay_to"
                                                                            className="form-control">
                                                                        <option disabled value="0">Select Payee</option>
                                                                        <option value="1">Re-Imburse Corporate</option>
                                                                        <option value="2">Re-Imburse Member</option>
                                                                        <option value="3">Pay to Provider</option>
                                                                    </select>
                                                                </div>
                                                                <label htmlFor="benefit"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Benefit:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <select name="benefit" className="form-control"
                                                                            id={"benefit"} onChange={fetchProductName}>
                                                                        <option disabled selected value={"0"}>Select
                                                                            Member Benefit
                                                                        </option>
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
                                                                           name="claim_form" id="claim_form"
                                                                           readOnly/>
                                                                </div>
                                                                <label htmlFor="invoiced_amount"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Invoiced
                                                                    Amount:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <input type="number" className="form-control"
                                                                           name="invoiced_amount" id="invoiced_amount"/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="entrant"
                                                                       className="col-form-label col-sm-2 label-align pr-0 pl-0">Entrant:
                                                                </label>
                                                                <div className="col-sm-4">
                                                                    <input type="text"
                                                                           className="form-control text-uppercase"
                                                                           name="user"
                                                                           id="user"
                                                                           value={localStorage.getItem("username")}
                                                                           placeholder="User" readOnly/>
                                                                </div>
                                                                <label htmlFor="service"
                                                                       className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Service:
                                                                </label>
                                                                <div className="col-md-4">
                                                                    <select name="service" className="form-control"
                                                                            id={"service"}
                                                                            onChange={fetchFrames}>
                                                                        <option>Select Service</option>
                                                                        {services.map((data) => {
                                                                            return (
                                                                                <option
                                                                                    value={data.CODE}>{data.SERVICE}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group row ml-0 ">
                                                                <label htmlFor="product_name"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">
                                                                    Product Name:
                                                                </label>
                                                                <div className="col-md-8 pr-0 pl-0">
                                                                    <select className={"form-control"}
                                                                            name="product_name"
                                                                            readOnly>
                                                                        <option
                                                                            value={productCode}>{productName}</option>
                                                                    </select>
                                                                    {/*<input className="form-control"
                                                                           />*/}
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="smart_bill_id"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">
                                                                    Smart Bill Id:
                                                                </label>
                                                                <div className="col-md-8 pr-0 pl-0">
                                                                    <input type="text" className="form-control"
                                                                           name="smart_bill_id" id={"smart_bill_id"}
                                                                           readOnly/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="pre_auth_no"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">Pre
                                                                    Auth No:
                                                                </label>
                                                                <div className="col-md-8 pr-0 pl-0">
                                                                    <input type="text" className="form-control"
                                                                           name="pre_auth_no" id="pre_auth_no"/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="anniv"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">Anniv:
                                                                </label>
                                                                <div className="col-md-8 pr-0 pl-0">
                                                                    <input type="text" className="form-control"
                                                                           name="anniv" id="anniv" readonly
                                                                           value={memberAnniv}/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="date_received"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">Date
                                                                    Received:
                                                                </label>
                                                                <div className="col-md-8 pr-0 pl-0">
                                                                    <input type="date" className="form-control"
                                                                           name="date_received" id="date_received"
                                                                           value={batchDateReceived}/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="fund"
                                                                       className="col-form-label col-md-4 label-align pl-0 pr-0">Fund:
                                                                </label>
                                                                <div className="col-md-8 pr-0 pl-0">
                                                                    <input type="checkbox" className="form-control fund"
                                                                           name="fund" id="fund"
                                                                           defaultValue={fund}
                                                                           defaultChecked={fund === "0" ? "checked" : ""}/>
                                                                </div>
                                                            </div>
                                                        </div>

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
                                                    </div>
                                                </div>
                                            </div>
                                            {/*Claims Tab*/}
                                            <div className="tab-pane fade"
                                                 id="nav-claim"
                                                 role="tabpanel"
                                                 aria-labelledby="nav-contact-tab">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-group row ml-0 ">
                                                            <label htmlFor="claim_no"
                                                                   className="col-form-label col-sm-2 label-align pr-0 pl-0">Claim
                                                                No:
                                                            </label>
                                                            <div className="col-sm-4">
                                                                <input type="text" className="form-control"
                                                                       name="claim_no" required="true" id="claim_no"
                                                                       readOnly/>
                                                            </div>
                                                            <label htmlFor="visit_date"
                                                                   className="col-form-label label-right col-md-2 pr-2 pl-0">Visit
                                                                Date:
                                                            </label>
                                                            <div className="col-md-4 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       id="visit_date" name="visit_date"
                                                                       value={invoiceDate}/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row ml-0">
                                                            <label htmlFor="doctor_date"
                                                                   className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Doctor
                                                                Date:
                                                            </label>
                                                            <div className="col-md-4 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       id="doctor_date" name="doctor_date"
                                                                       value={invoiceDate}/>
                                                            </div>
                                                            <label htmlFor="doctor_signed"
                                                                   className={"col-form-label col-md-2 label-align text-right"}>Doctor
                                                                Signed:
                                                            </label>
                                                            <div className={"col-md-1 pr-0 pl-0"}>
                                                                <input type="checkbox"
                                                                       className={"checkbox-inline mt-2 doctor"}
                                                                       id="doctor_signed" defaultChecked={true}/>
                                                            </div>
                                                            <label htmlFor="patient_signed"
                                                                   className={"col-form-label col-md-2 label-align text-right"}>Patient
                                                                Signed:
                                                            </label>
                                                            <div className={"col-md-1 pr-0 pl-0"}>
                                                                <input type="checkbox"
                                                                       className={"checkbox-inline mt-2 patient"}
                                                                       id="patient_signed" defaultChecked={true}/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row ml-0">
                                                            <label htmlFor="date_admitted"
                                                                   className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0">Date
                                                                Admitted:
                                                            </label>
                                                            <div className="col-md-4 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       id="date_admitted" name="date_admitted"/>
                                                            </div>
                                                            <label htmlFor="date_discharged"
                                                                   className="col-form-label label-right col-md-2 col-sm-2 pr-2 pl-0">Date
                                                                Discharged:
                                                            </label>
                                                            <div className="col-md-4 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       id="date_discharged" name="date_discharged"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"row justify-content-center mt-4"}>
                                                    <button type="button"
                                                            className="action-button btn-outline-success btn-sm col-md-1"
                                                            onClick={saveEnterBill}>Save
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
                <div>
                    <Spinner/>
                </div>
            </section>
            <Modal5
                modalIsOpen={isFourthModalOpen}
                closeModal={closeModal}
                header={<p id="headers">Membership Authenticity</p>}
                body={
                    <div>
                        <h5 className={"text-center"}>{message}</h5>
                        <div classsName={"row"}>
                            <button onClick={() => setFourthModalOpen(false)}>Close</button>
                        </div>
                    </div>
                }/>
            <Modal5
                modalIsOpen={messageModal}
                closeModal={closeModal}
                header={<p id="headers">Notice Message</p>}
                body={
                    <div>
                        <h5 className={"text-center"}>{message}</h5>
                        <div classsName={"row"}>
                            <button onClick={() => setMessageModal(false)}>Close</button>
                        </div>
                    </div>
                }/>
        </div>
    );
}

export default EnterBill
