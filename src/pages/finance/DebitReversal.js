import {useState, useEffect} from "react";
import {Spinner} from "../../components/helpers/Spinner";
import {getData, getOneData, postData} from "../../components/helpers/Data";
import {toInputUpperCase} from "../../components/helpers/toInputUpperCase";
import {today} from "../../components/helpers/today";
import Modal2 from "../../components/helpers/Modal2";
import CustomModal from "../../components/helpers/Modal";
import Modal5 from "../../components/helpers/Modal5";

const DebitReversal = () => {
    const [reversalReason, setReversalReason] = useState([]);
    const [invoiceNoData, setFetchedInvoiceNoData] = useState([]);
    const [modalIsOpen, setModalState] = useState(false);
    const [response, setResponse] = useState([]);
    let [new_renewal, setRenewalType] = useState([]);
    const [disabled, setDisabled] = useState({reverseBtn: false});
    const [messageModal, setMessageModal] = useState(false);
    const [message, setMessage] = useState([]);

    //fetching reversal reason
    useEffect(() => {
        getData('fetch_reversal_reason').then((data) => {
            setReversalReason(data);
        });
    }, []);
    //fetch invoice number details
    const fetchDebitNumberDetails = (e) => {
        e.preventDefault();
        if (!document.getElementById('debit_no').value) {
            setMessage('Notice ! Please Enter Valid Debit Number')
            setMessageModal(true);
        } else {
            //enable reverse btn upon fetch
            setDisabled({reverseBtn: false});
            //reset form first
            setFetchedInvoiceNoData([]);
            document.getElementById('debit_reversal_form').reset();
            const invoice_no = document.getElementById('debit_no').value;
            getOneData('fetch_debit_number_details', invoice_no).then((dt) => {
                console.log(dt);
                // if (dt.data.length ==)
                if (dt.data.length === 0) {
                    //alert(dt.message);
                    setMessage(dt.message);
                    setMessageModal(true)
                    document.getElementById('card_hidden').style.display = 'none';
                } else {
                    setFetchedInvoiceNoData(dt.data);
                    switch (dt.data.new_renewal) {
                        case '1':
                            new_renewal = 'NEW'
                            break;
                        case '2':
                            new_renewal = 'RENEW'
                            break;
                        case '3':
                            new_renewal = 'DELETION'
                            break;
                        case '4':
                            new_renewal = 'COVER UPGRADE'
                            break;
                        case '5':
                            new_renewal = 'COVER DOWNGRADE'
                            break;
                        case '6':
                            new_renewal = 'COVER EXTENSION'
                            break;
                        case '7':
                            new_renewal = 'ADDITION EN-MASS'
                            break;
                    }
                    setRenewalType(new_renewal)
                    document.getElementById('card_hidden').style.display = 'block';
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }
    //reverse amounts of invoice
    const reverseInvoiceNo = (e) => {
        e.preventDefault();
        //disable reverse btn after click once

        const fetched_invoice_no = document.getElementById('fetched_invoice_no').value;
        console.log(fetched_invoice_no);
        const reversal_no = fetched_invoice_no.replace('DBT', 'REV');
        console.log(reversal_no);
        document.getElementById('reference_no').value = reversal_no;
        document.getElementById('reversal_no').value = reversal_no;
        document.getElementById('transaction_no').value = fetched_invoice_no;
        //do reversal insert -ve value before values
        var rev_new_cards_amt = parseFloat(document.getElementById('new_cards_amt').value);
        if (rev_new_cards_amt > 0) {
            rev_new_cards_amt = 0 - rev_new_cards_amt;
        } else {
            rev_new_cards_amt = rev_new_cards_amt;
        }
        document.getElementById('new_cards_amt').value = rev_new_cards_amt;

        var rev_access_fee_amt = parseFloat(document.getElementById('access_fee_amt').value);
        if (rev_access_fee_amt > 0) {
            rev_access_fee_amt = 0 - rev_access_fee_amt;
        } else {
            rev_access_fee_amt = rev_access_fee_amt;
        }
        document.getElementById('access_fee_amt').value = rev_access_fee_amt;

        var rev_iiu_tax_amt = parseFloat(document.getElementById('iiu_tax_amt').value);
        if (rev_iiu_tax_amt > 0) {
            rev_iiu_tax_amt = 0 - rev_iiu_tax_amt;
        } else {
            rev_iiu_tax_amt = rev_iiu_tax_amt;
        }
        document.getElementById('iiu_tax_amt').value = rev_iiu_tax_amt;

        var rev_ira_tax_amt = parseFloat(document.getElementById('ira_tax_amt').value);
        if (rev_ira_tax_amt > 0) {
            rev_ira_tax_amt = 0 - rev_ira_tax_amt;
        } else {
            rev_ira_tax_amt = rev_ira_tax_amt;
        }
        document.getElementById('ira_tax_amt').value = rev_ira_tax_amt;

        var rev_contigency_amt = parseFloat(document.getElementById('contigency_amt').value);
        if (rev_contigency_amt > 0) {
            rev_contigency_amt = 0 - rev_contigency_amt;
        } else {
            rev_contigency_amt = rev_contigency_amt;
        }
        document.getElementById('contigency_amt').value = rev_contigency_amt;

        var rev_gift_items_amt = parseFloat(document.getElementById('gift_items_amt').value);
        if (rev_gift_items_amt > 0) {
            rev_gift_items_amt = 0 - rev_gift_items_amt;
        } else {
            rev_gift_items_amt = rev_gift_items_amt;
        }
        document.getElementById('gift_items_amt').value = rev_gift_items_amt;

        var rev_first_aid_amt = parseFloat(document.getElementById('first_aid_amt').value);
        if (rev_first_aid_amt > 0) {
            rev_first_aid_amt = 0 - rev_first_aid_amt;
        } else {
            rev_first_aid_amt = rev_first_aid_amt;
        }
        document.getElementById('first_aid_amt').value = rev_first_aid_amt;

        setDisabled({reverseBtn: true});
    }
    //save debit reversal 
    const saveDebitReversal = async (e) => {
        e.preventDefault();
        const reversal_reason = document.getElementById('reversal_reason').value;
        console.log(reversal_reason)
        if (!reversal_reason) {
            //alert('Notice! Please indicate the reversal reason');
            setMessage("Notice ! Please indicate the reversal reason");
            setMessageModal(true);
        } else {
            //serialize form
            const frmData = new FormData(document.getElementById('debit_reversal_form'))
            postData(frmData, 'save_debit_reversal').then((data) => {
                console.log(data);
                setResponse(data.message);
                setModalState(true);
            }).catch((error) => {
                console.log(error);
            })
        }
    }
    //close modal
    const closeModal = (e) => {
        e.preventDefault();
        setModalState(false);
        //window.location.reload();
    }
    return (
        <div>
            <section id={"tabs"} className={"project-tab"}>
                <div className={"container col-md-12"}>
                    <div className="row ml-0">
                        <h4 className={"fs-title"}>Debit Reversal</h4>
                        <hr className={"mt-0 mb-1"}/>
                        <div className={"col-md-12"}>
                            <div className={"row ml-0"}>
                                <div className="form-group row">
                                    <label htmlFor={"debit_no"}
                                           className="col-form-label col-md-1 label-align text-right">
                                        Debit No:
                                    </label>
                                    <div className="col-md-2">
                                        <input type={"text"} id={"debit_no"} className={"form-control"}
                                               placeholder={"DBT-0000"}
                                               onInput={toInputUpperCase}/>
                                    </div>
                                    <div className={"col-md-1 pr-0 pl-0"}>
                                        <button className="btn btn-outline-info btn-sm btn-block"
                                                onClick={fetchDebitNumberDetails}>
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form id={"debit_reversal_form"} onSubmit={saveDebitReversal}>
                        <fieldset>
                            <div className="row ml-0">
                                <div className="row ml-0 justify-content-center" style={{border: "1px blue"}}>
                                    {/*Search box*/}
                                    <div className="card col-md-12 mt-0">
                                        <div className="card-body" id={"card_hidden"} style={{display: 'none'}}>
                                            <h6>Summary</h6>
                                            <hr className={"mt-0 mb-1"}/>
                                            <div className="form-group row ml-0">
                                                <label htmlFor={"reference_no"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Reference No:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="text" name={"reference_no"} className={"form-control"}
                                                           id="reference_no" readOnly/>
                                                </div>
                                                <label htmlFor={"anniv"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Anniv:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="number" name={"anniv"} className={"form-control"}
                                                           id="anniv" readOnly value={invoiceNoData.anniv}/>
                                                </div>
                                                <label htmlFor={"invoice_date"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Invoice Date:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="date" name={"invoice_date"} className={"form-control"}
                                                           id="invoice_date" readOnly value={today()}/>
                                                </div>
                                                {/*fetched invoice number hidden for security*/}
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="text" className={"form-control"}
                                                           id="fetched_invoice_no" hidden
                                                           value={invoiceNoData.invoice_no}/>
                                                </div>
                                            </div>
                                            <div className="form-group row ml-0">
                                                <label htmlFor={"effective_date"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Effective Date:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="date" name={"effective_date"}
                                                           className={"form-control"}
                                                           id="effective_date" readOnly
                                                           value={invoiceNoData.cover_start_date}/>
                                                </div>
                                                <label htmlFor={"end_date"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    End Date:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="date" name={"end_date"} className={"form-control"}
                                                           id="end_date" readOnly
                                                           value={invoiceNoData.end_date}/>
                                                </div>
                                                <label htmlFor={"days"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Prorate Days:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="text" name={"prorate_days"} className={"form-control"}
                                                           id="days" readOnly value={invoiceNoData.days}/>
                                                </div>
                                            </div>
                                            <div className="form-group row ml-0">
                                                <label htmlFor={"transaction"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Transaction:
                                                </label>
                                                <div className="col-md-3 mr-0 pr-0 pl-0 form-check-inline form-control">
                                                    <input type="radio" className="form-control col-md-1 pr-0 pl-0"
                                                           name="selected_rd" id={"credit_note_rd"} disabled/>
                                                    <label htmlFor={"credit_note_rd"}
                                                           className="col-form-label label-align col-md-5 pr-0 pl-0 text-left">
                                                        Debit Note
                                                    </label>
                                                    <input type="radio" className="form-control col-md-1 pr-0 pl-0"
                                                           name="selected_rd" id={"credit_note_rd"}
                                                           checked={"checked"} readOnly={true}/>
                                                    <label htmlFor={"credit_note_rd"}
                                                           className="col-form-label col-md-5 pr-0 pl-0 label-align">
                                                        Credit Note
                                                    </label>
                                                </div>
                                                <label htmlFor={"business_class"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Business Class:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="text" className={"form-control"}
                                                           id="business_class" readOnly
                                                           value={new_renewal}/>
                                                </div>
                                            </div>
                                            <hr className={"mt-0 mb-1"}/>
                                            <div className={"row ml-0"}>
                                                <div className="col-md-8 pr-0 pl-0">
                                                    <h6>Smart Fee</h6>
                                                    <div className={"form-group row ml-0"}>
                                                        <label htmlFor={"new_cards_amt"}
                                                               className={"col-form-label col-md-2 label-align text-right"}>
                                                            New Cards:
                                                        </label>
                                                        <div className={"col-md-4 pr-0 pl-0"}>
                                                            <input type="text" name={"new_cards_amt"}
                                                                   className={"form-control"} id="new_cards_amt"
                                                                   readOnly
                                                                   defaultValue={invoiceNoData.length !== 0 ?
                                                                       invoiceNoData.smart_cost : 0}/>
                                                        </div>
                                                        <label htmlFor={"access_fee_amt"}
                                                               className={"col-form-label col-md-2 label-align text-right"}>
                                                            Access Fee:
                                                        </label>
                                                        <div className={"col-md-4 pr-0 pl-0"}>
                                                            <input type="text" name={"access_fee_amt"}
                                                                   className={"form-control"} id="access_fee_amt"
                                                                   readOnly
                                                                   defaultValue={invoiceNoData.length !== 0 ?
                                                                       invoiceNoData.access_fee : 0}/>
                                                        </div>
                                                    </div>
                                                    <hr className={"mt-0 mb-1"}/>
                                                    <h6>Levies</h6>
                                                    {/*Levies*/}
                                                    <div className="form-group row ml-0">
                                                        <label htmlFor={"iiu_tax_amt"}
                                                               className={"col-form-label col-md-2 label-align text-right"}>
                                                            IIU Tax:
                                                        </label>
                                                        <div className={"col-md-4 pr-0 pl-0"}>
                                                            <input type="text" name={"iiu_tax_amt"}
                                                                   className={"form-control"} id="iiu_tax_amt" readOnly
                                                                   defaultValue={invoiceNoData.length !== 0 ?
                                                                       invoiceNoData.phcf : 0}/>
                                                        </div>
                                                        <label htmlFor={"ira_tax_amt"}
                                                               className={"col-form-label col-md-2 label-align text-right"}>
                                                            IRA Tax:
                                                        </label>
                                                        <div className={"col-md-4 pr-0 pl-0"}>
                                                            <input type="text" name={"ira_tax_amt"}
                                                                   className={"form-control"}
                                                                   id="ira_tax_amt" readOnly
                                                                   defaultValue={invoiceNoData.length !== 0 ?
                                                                       invoiceNoData.tl : 0}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label htmlFor={"invoice_type"}
                                                               className={"col-form-label col-md-2 label-align text-right"}>
                                                            Invoice Type:
                                                        </label>
                                                        <div className={"col-md-4 pr-0 pl-0"}>
                                                            <input type="text" name={"invoice_type"}
                                                                   className={"form-control"} id="invoice_type"
                                                                   value={new_renewal}
                                                                   readOnly/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 pr-0 pl-0">
                                                    <h6>Other Charges</h6>
                                                    <div className="form-group row ml-0">
                                                        <label htmlFor={"contigency_amt"}
                                                               className={"col-form-label col-md-3 label-align text-right"}>
                                                            Contigency:
                                                        </label>
                                                        <div className="col-md-9 mr-0 pr-0 pl-0">
                                                            <input type="text" className="form-control"
                                                                   name="contigency_amt" id={"contigency_amt"} readOnly
                                                                   value={invoiceNoData.length !== 0 ?
                                                                       invoiceNoData.contigency : 0}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label htmlFor={"gift_items_amt"}
                                                               className={"col-form-label col-md-3 label-align text-right"}>
                                                            Gift Items:
                                                        </label>
                                                        <div className="col-md-9 mr-0 pr-0 pl-0">
                                                            <input type="text" className="form-control"
                                                                   name="gift_items_amt" id={"gift_items_amt"} readOnly
                                                                   value={invoiceNoData.length !== 0 ?
                                                                       invoiceNoData.gift_items : 0}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label htmlFor={"first_aid_amt"}
                                                               className={"col-form-label col-md-3 label-align text-right"}>
                                                            First Aid:
                                                        </label>
                                                        <div className="col-md-9 mr-0 pr-0 pl-0">
                                                            <input type="text" className="form-control"
                                                                   name="first_aid_amt" id={"first_aid_amt"} readOnly
                                                                   defaultValue={invoiceNoData.length !== 0 ?
                                                                       invoiceNoData.first_aid : 0}/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label htmlFor={"stamp_duty_amt"}
                                                               className={"col-form-label col-md-3 label-align text-right"}>
                                                            Stamp Duty:
                                                        </label>
                                                        <div className="col-md-9 mr-0 pr-0 pl-0">
                                                            <input type="text" className="form-control"
                                                                   name="stamp_duty_amt" id={"stamp_duty_amt"}
                                                                   readOnly/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label htmlFor={"others_amt"}
                                                               className={"col-form-label col-md-3 label-align text-right"}>
                                                            Others:
                                                        </label>
                                                        <div className="col-md-9 mr-0 pr-0 pl-0">
                                                            <input type="text" className="form-control"
                                                                   name="others_amt" id={"others_amt"}
                                                                   readOnly/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*hidden inputs*/}
                                            <div hidden>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"corp_id"} readOnly
                                                       value={invoiceNoData.corp_id}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"member_no"} readOnly
                                                       value={invoiceNoData.member_no}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"invoice_total"} readOnly
                                                       value={'-' + invoiceNoData.invoice_total}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"user"} readOnly
                                                       value={localStorage.getItem("username")}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"invoice_net"} readOnly
                                                       value={'-' + invoiceNoData.invoice_net}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"agent_id"} readOnly
                                                       value={invoiceNoData.agent_id}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"premium_net"} readOnly
                                                       value={'-' + invoiceNoData.premium_net}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"insurer"} readOnly
                                                       value={invoiceNoData.insurer}/>
                                                <input hidden type="date" className={"form-control"}
                                                       name={"cover_start_date"} readOnly
                                                       value={invoiceNoData.cover_start_date}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"new_renewal"} readOnly
                                                       value={invoiceNoData.new_renewal}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"new_renewal"} readOnly
                                                       value={invoiceNoData.new_renewal}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"prorate_days_month"} readOnly
                                                       value={invoiceNoData.prorate_days_month}/>
                                                <input hidden type="date" className={"form-control"}
                                                       name={"end_date"} readOnly
                                                       value={invoiceNoData.end_date}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"days"} readOnly
                                                       value={invoiceNoData.days}/>
                                                <input hidden type="text" className={"form-control"}
                                                       name={"sync"} readOnly
                                                       value={invoiceNoData.sync}/>
                                                <input hidden type="date" className={"form-control"}
                                                       name={"integ_date"} readOnly
                                                       value={invoiceNoData.integ_date}/>
                                            </div>
                                            <hr className={"mt-0 mb-1"}/>
                                            {/*Reversal Reason*/}
                                            <div className={"row ml-0"}>
                                                <div className={"col-md-8 pr-0 pl-0"}>
                                                    <div className="form-group row ml-0">
                                                        <label htmlFor={"reversal_no"}
                                                               className={"col-form-label col-md-2 label-align text-right"}>
                                                            Reversal No:
                                                        </label>
                                                        <div className={"col-md-4 pr-0 pl-0"}>
                                                            <input type="text" name={"reversal_no"}
                                                                   className={"form-control"} id="reversal_no"
                                                                   readOnly/>
                                                        </div>
                                                        <label htmlFor={"transaction_no"}
                                                               className={"col-form-label col-md-2 label-align text-right"}>
                                                            Transaction No:
                                                        </label>
                                                        <div className={"col-md-4 pr-0 pl-0"}>
                                                            <input type="text" name={"transaction_no"}
                                                                   className={"form-control"}
                                                                   id="transaction_no" readOnly/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label htmlFor={"reversal_no"}
                                                               className={"col-form-label col-md-2 label-align text-right"}>
                                                            Reversal Reason:
                                                        </label>
                                                        <div className={"col-md-10 pr-0 pl-0"}>
                                                            <select className={"form-control"} name={"reversal_reason"}
                                                                    id={"reversal_reason"}>
                                                                <option></option>
                                                                {reversalReason.map((reason) => {
                                                                    return (
                                                                        <option key={reason.code} value={reason.code}>
                                                                            {reason.reason}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"row justify-content-center mt-1"}>
                                                <div className={"col-md-2 pr-0 pl-0"}>
                                                    <div className={"col-md-2 pr-0 pl-0"}>
                                                        <button
                                                            className="btn btn-outline-dark btn-sm btn-block"
                                                            onClick={reverseInvoiceNo}
                                                            disabled={disabled.reverseBtn}>Reverse
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className={"col-md-2 pr-0 pl-1"}>
                                                    <button className="btn btn-outline-success btn-sm btn-block"
                                                            id={"action_button"}
                                                            type={"submit"}>Save
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                    <Spinner/>
                </div>
            </section>
            <Modal5
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                header={<p id="headers">Debit Reversal</p>}
                body={
                    <div>
                        <div className={"row justify-content-center"}>
                            <p>{response}</p>
                        </div>
                        <div className={"row justify-content-center"}>
                            <button className="btn btn-outline-danger"
                                    onClick={closeModal}>Close
                            </button>
                        </div>
                    </div>
                }/>
            {/*notices modal*/}
            <Modal5
                modalIsOpen={messageModal}
                closeModal={closeModal}
                header={<p id="headers">Notice Message</p>}
                body={
                    <div className={"row justify-content-center"}>
                        <h5 className={"col-md-12 text-center"}>{message}</h5>
                        <div classsName={"row"}>
                            <button className={"btn btn-outline-danger btn-sm mt-3"}
                                    onClick={() => setMessageModal(false)}>Close
                            </button>
                        </div>
                    </div>
                }/>
        </div>
    )
}

export default DebitReversal
