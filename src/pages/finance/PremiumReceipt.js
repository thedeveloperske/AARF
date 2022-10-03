import {useState, useEffect} from "react";
import {getData, getOneData, getTwoData, postData} from "../../components/helpers/Data";
import {today} from "../../components/helpers/today";
import {Spinner} from "../../components/helpers/Spinner";
import {toInputUpperCase} from "../../components/helpers/toInputUpperCase";
import Modal5 from "../../components/helpers/Modal5";
import {Link} from "react-router-dom";

const PremiumReceipt = () => {
    const [corporates, setCorporates] = useState([]);
    const [individuals, setIndividuals] = useState([]);
    const [paymentModes, setPaymentModes] = useState([]);
    const [banks, setBanks] = useState([]);
    const [financers, setFinancers] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [agents, setAgents] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [fetchedData, setPremiumReceipts] = useState([]);
    const [rate, setRate] = useState([]);
    const [formVariables, setFormVariables] = useState([]);
    const [receipt_no, setReceiptNo] = useState([]);
    const [message, setMessage] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [messageModal, setMessageModal] = useState(false);

    //fetch APIs
    //fetching corporates
    useEffect(() => {
        getData('fetch_corporates').then((data) => {
            setCorporates(data);
        });
    }, []);
    //fetching individuals
    useEffect(() => {
        getData('fetch_individuals').then((data) => {
            setIndividuals(data);
        })
    }, []);
    //fetch payment modes
    useEffect(() => {
        getData('fetch_payment_modes').then((data) => {
            setPaymentModes(data);
        })
    }, []);
    //fetch banks
    useEffect(() => {
        getData('fetch_banks').then((data) => {
            setBanks(data);
        })
    }, []);
    //fetch financers
    useEffect(() => {
        getData('fetch_financers').then((data) => {
            setFinancers(data);
        })
    }, []);
    //fetch currencies
    useEffect(() => {
        getData('fetch_ugx_currencies').then((data) => {
            setCurrencies(data);
        })
    }, []);
    //fetch agents
    useEffect(() => {
        getData('fetch_agents').then((data) => {
            setAgents(data);
        })
    }, []);
    //fetch bank accounts
    useEffect(() => {
        getData('fetch_bank_accounts').then((data) => {
            setBankAccounts(data);
        })
    }, []);
    //function to input uppercase
    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };
    //select among corporate, member number and family number
    const selectOption = () => {
        setPremiumReceipts([]);
        setFormVariables([]);
        if (document.getElementById('corporate_rd').checked) {
            document.getElementById('select_corporate').disabled = false;
            var input_value = document.getElementById('select_corporate').value;
            document.getElementById('select_individual').value = '';
            document.getElementById('select_individual').disabled = true;
            document.getElementById('corporate').value = '';
            document.getElementById('corporate').disabled = false;
            document.getElementById('member_names').value = '';
            document.getElementById('member_names').disabled = true;
            document.getElementById('intermediary').value = '';
            document.getElementById('intermediary').value = '';

        } else if (document.getElementById('member_no_rd').checked) {
            document.getElementById('select_individual').disabled = false;
            var input_value = document.getElementById('select_individual').value;
            document.getElementById('select_corporate').value = '';
            document.getElementById('select_corporate').disabled = true;
            document.getElementById('corporate').value = '';
            document.getElementById('corporate').disabled = true;
            document.getElementById('member_names').disabled = false;
            document.getElementById('intermediary').value = '';
        }
        return input_value;
    }
    //fetch data onchange
    const fetchData = () => {
        //reset form
        document.getElementById('premium_receipts_form').reset();
        const selected_radio_val = document.querySelector('input[name = "selected_radio"]:checked').value;
        const input_value = selectOption();
        console.log(selected_radio_val);
        console.log(input_value);
        //start loader
        document.getElementById('spinner').style.display = "block";
        //fetch data to display
        getTwoData('fetch_premium_receipts_data', selected_radio_val, input_value).then((dt) => {
                console.log(dt);
                dt.corp_data.map((data) => {
                    setFormVariables(data);
                });
                document.getElementById('bank_account').value = 4;
                document.getElementById('currency').value = 1;
            document.getElementById('sys_rate').value = 1;
                const fetchedData = dt.premium_receipts.map((data) => {
                    return (
                        <>
                            <tr>
                                <td>{data.invoice_no}</td>
                                <td>{data.invoice_date}</td>
                                <td>{data.anniv}</td>
                                <td>{data.agent_name}</td>
                                <td>{Number(data.invoice_net).toLocaleString()}</td>
                            </tr>
                        </>
                    )
                });
                setPremiumReceipts(fetchedData);
                //stop loader
                document.getElementById('spinner').style.display = "none";
            }
        );

    }
    //mode of payment
    const modeOfPayment = () => {

        const payment_mode = document.getElementById('payment_mode').value;
        if(payment_mode == 2){
            document.getElementById('cheque_no').disabled = false;
        }
        else {
            document.getElementById('cheque_no').disabled = true;
            document.getElementById('cheque_no').value = '';
        }
    }
//exchange rates
    const exChangeRates = (e) => {
        e.preventDefault();

        const currency = document.getElementById('currency').value;
        const receipt_date = document.getElementById('receipt_date').value;
        if (currency == 1) {
            document.getElementById('user_rate');
            document.getElementById('user_rate').value = "1";
        } else if (currency > 1) {
            document.getElementById('user_rate').readOnly = false;
        }
        if (!receipt_date) {
            //alert("Enter Receipt Date");
            setMessage("Enter Receipt Date")
            setMessageModal(true)
        } else {
            getTwoData('fetch_exchange_rates', currency, receipt_date).then((data) => {
                if (data.rate < 1) {
                    //alert('Notice! No System Rate for the receipt date period. Please select appropriate currency')
                    setMessage("Notice! No System Rate for the receipt date period. Please select appropriate currency")
                    setMessageModal(true)
                }

                document.getElementById('sys_rate').value = data.rate;
                calculateReceiptAmount();
                console.log(data);
                setRate(Number(data.rate[0]));
            });
        }
    }
//calculate receipt amount
    const calculateReceiptAmount = () => {
        const currency = document.getElementById('currency').value;
        const transact_amount = document.getElementById('transact_amount').value;
        //const new_transact_mount = Number(transact_amount).toLocaleString();
        const sys_rate = document.getElementById('sys_rate').value;
        const user_rate = document.getElementById('user_rate').value;
        if (currency == 1) {
            document.getElementById('user_rate').disabled = true;
            document.getElementById('user_rate').value = '';
            var receipt_amount = Number(transact_amount * sys_rate).toLocaleString();

        } else if (currency > 1) {
            document.getElementById('user_rate').disabled = false;
            if (!user_rate) {
                var receipt_amount = Number(transact_amount * sys_rate).toLocaleString();
                // document.getElementById('receipt_amount').value = receipt_amount;
            } else if (user_rate != null) {
                var receipt_amount = Number(transact_amount * user_rate).toLocaleString();
                // document.getElementById('receipt_amount').value = receipt_amount;
            }
        }
        document.getElementById('receipt_amount').value = receipt_amount;


    }
//validate
    const validateFields = async (e) => {
        e.preventDefault();
        const receipt_amount = document.getElementById('receipt_amount').value;
        const bank_account = document.getElementById('bank_account').value;
        const payment_mode = document.getElementById('payment_mode').value;
        if (!receipt_amount) {
            //alert('Notice! Please indicate the Receipt amount')
            setMessage("Notice! Please indicate the Receipt amount")
            setMessageModal(true)
        }
        if (!bank_account) {
            //alert('Notice! Please indicate the account to allocate this payment')
            setMessage("Notice! Please indicate the account to allocate this payment")
            setMessageModal(true)
        }
        if (!payment_mode) {
            //alert('Notice! Please select mode payment')
            setMessage("Notice! Please select mode payment")
            setMessageModal(true)
        }
        //fetch last number receipts
        getData('get_latest_receipt_no').then((data) => {
            console.log(data);
            //setReceiptNo(data.receipt_no);
            document.getElementById('receipt_no').value = data.receipt_no;
        })
    }
//save premium receipts
    const savePremiumReceipts = async (e) => {
        e.preventDefault();

        const frmData = new FormData(document.getElementById('premium_receipts_form'));
        const exemptCommisCheckbox = document.querySelectorAll(".exempt_commis");
        const selected_radio_val = document.querySelector('input[name = "selected_radio"]:checked').value;
        frmData.append('selected_radio', selected_radio_val);
        exemptCommisCheckbox.forEach((element) => {
            if (element.checked == true){
                frmData.append("excempt_commis", "1");
            }
            else if (element.checked == false){
                frmData.append("excempt_commis", "0");
            }
        });
        postData(frmData, 'save_premium_receipts').then((data) => {
            setMessage(data.message)
            setModalOpen(true);

        }).catch((error) => {
            console.log(error);
        })
    }
    //close modal
    const closeModal = (e) => {
        e.preventDefault();
        setModalOpen(false);
        window.location.reload();
    }
    return (
        <div>
            <section id={"tabs"} className={"project-tab m-0"}>
                <div className={"container col-md-12"}>
                    <div className="row ml-0">
                        <div className={"col-md-12"}>
                            <div className={"row ml-0"}>
                                <div className="form-group row ml-0 mb-0">
                                    <div className={"col-md-1 pr-0 pl-0 pt-2"}>
                                        <input type={"radio"} name={"selected_radio"}
                                               className={"form-control pb-2"}
                                               id={"corporate_rd"} value={"1"} onChange={selectOption}/>
                                    </div>
                                    <div className="col-md-1">
                                        <label htmlFor={"select_corporate"}
                                               className="col-form-label label-align">
                                            Corporate:</label>
                                    </div>
                                    <div className="col-md-8 ">

                                        <select className="form-control" id="select_corporate"
                                                name={"corporate_id"} disabled={true} onChange={fetchData}>
                                            <option value="" >Select Corporate</option>
                                            {corporates.map((corporate) => {
                                                return (
                                                    <option key={corporate.CORP_ID}
                                                            value={corporate.CORP_ID}>
                                                        {corporate.CORPORATE}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row ml-0 mb-0">
                                    <div className={"col-md-1 pr-0 pl-0 pt-2"}>
                                        <input type={"radio"} name={"selected_radio"}
                                               className={"form-control pb-2"}
                                               id={"member_no_rd"} value={"2"} onChange={selectOption}/>
                                    </div>
                                    <div className="col-md-1">
                                        <label htmlFor={"member_no_rd"}
                                               className="col-form-label label-align">Member
                                            No:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <select className="form-control" name={"member_no"}
                                                id={"select_individual"} disabled={true}
                                                onChange={fetchData}>
                                            <option value={""}>Select Individual</option>
                                            {individuals.map((individual) => {
                                                const {member_no, principal_names} = individual;
                                                return (
                                                    <option key={member_no} value={member_no}>
                                                        {principal_names + ' - ' + member_no}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form id={"premium_receipts_form"} onSubmit={savePremiumReceipts}>
                        <fieldset>
                            <h4 className={"fs-title"}>Premium Receipt</h4>
                            <hr className={"mb-1 mt-0"}/>
                            <div className="row ml-0">
                                <div className="row ml-0 justify-content-center" style={{border: "1px blue"}}>
                                    {/*Search box*/}
                                    <div className="card col-md-12 mt-0">
                                        <div className="card-body">
                                            <div className="form-group row ml-0">
                                                <label htmlFor={"receipt_no"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Receipt No:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="text" name={"receipt_no"} className={"form-control"}
                                                           id="receipt_no" onInput={toInputUppercase} readOnly/>
                                                </div>
                                                <label htmlFor={"transact_amount"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Transact Amt:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="number" name={"transact_amount"}
                                                           className={"form-control"}
                                                           id="transact_amount" onInput={calculateReceiptAmount}/>
                                                </div>
                                                <label htmlFor={"receipt_date"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Receipt Date:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="date" name={"receipt_date"} className={"form-control"}
                                                           id="receipt_date" maxLength={"4"} max={"9999-12-31"}/>
                                                </div>
                                            </div>
                                            <div className="form-group row ml-0">
                                                <label htmlFor={"payment_mode"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Paym't Mode:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <select className={"form-control"} name={"payment_mode"}
                                                            id={"payment_mode"} onChange={modeOfPayment}>
                                                        <option value={""} > Select Mode of Payment</option>
                                                        {paymentModes.map((mode) => {
                                                            const {code, payment_mode} = mode;
                                                            return (
                                                                <option key={code} value={code}>
                                                                    {payment_mode}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                <label htmlFor={"cheque_no"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Cheque No:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="text" name={"cheque_no"} className={"form-control"}
                                                           id="cheque_no" onInput={toInputUppercase}/>
                                                </div>
                                                <label htmlFor={"bank"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Bank:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <select className={"form-control"} name={"bank"}>
                                                        <option value={""} > Select Bank</option>
                                                        {banks.map((bank) => {
                                                            const {CODE, BANK} = bank;
                                                            return (
                                                                <option key={CODE} value={CODE}>
                                                                    {BANK}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row ml-0">
                                                <label htmlFor={"financer"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Financer:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <select className={"form-control"} name={"financer"}>
                                                        <option value={""} > Select Financer</option>
                                                        {financers.map((data) => {
                                                            const {fin_code, financer} = data;
                                                            return (
                                                                <option key={fin_code} value={fin_code}>
                                                                    {financer}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <label htmlFor={"corporate"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Corporate:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="text" className={"form-control"}
                                                           id="corporate" value={formVariables.corporate}
                                                           onInput={toInputUppercase}/>
                                                           <input hidden name={"corp_id"}
                                                                  value={formVariables.corp_id}/>
                                                </div>
                                                <label htmlFor={"member"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Member:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="text" className={"form-control"}
                                                           id="member_names" value={formVariables.principal_names}
                                                           onInput={toInputUppercase}/>
                                                    <input hidden name={"member_no"}
                                                           value={formVariables.member_no}/>
                                                </div>
                                            </div>
                                            <div className="form-group row ml-0">
                                                <label htmlFor={"intermediary"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Intermediary:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>

                                                    <input type="text" name={"intermediary"}
                                                           className={"form-control"}
                                                           id="intermediary" value={formVariables.agent_name}
                                                           onInput={toInputUppercase}/>
                                                       <input hidden={true} name={"agent_id"}
                                                           value={formVariables.agent_id}/>
                                                </div>
                                                <label htmlFor={"bank_account"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Bank Acc:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <select className={"form-control"} name={"bank_account"}
                                                            id={"bank_account"}>
                                                        <option value={""} > Select Bank Account</option>
                                                        {bankAccounts.map((account) => {
                                                            const {code, bank, bank_account, currency} = account;
                                                            return (
                                                                <option key={code} value={code}>
                                                                    {bank + ' - ' + bank_account + ' - ' + currency}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <label htmlFor={"currency"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Currency:
                                                </label>
                                                <div className={"col-md-1 pr-0 pl-0"}>
                                                    <select className={"form-control"} name={"currency"}
                                                            id={"currency"} onChange={exChangeRates}>
                                                        <option value={""} >Select Currency</option>
                                                        {currencies.map((data) => {
                                                            const {code, currency} = data;
                                                            return (
                                                                <option key={code} value={code}>
                                                                    {currency}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <label htmlFor={"sys_rate"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Sys Rate:
                                                </label>
                                                <div className={"col-md-1 pr-0 pl-0"}>
                                                    <input type="text" name={"sys_rate"} className={"form-control"}
                                                           id="sys_rate"/>
                                                </div>
                                            </div>
                                            <div className="form-group row ml-0">
                                                <label htmlFor={"receipt_amount"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Receipt Amount:
                                                </label>
                                                <div className={"col-md-3 pr-0 pl-0"}>
                                                    <input type="text" name={"receipt_amount"}
                                                           className={"form-control"} id="receipt_amount"/>
                                                </div>
                                                <label htmlFor={"user_rate"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    User Rate:
                                                </label>
                                                <div className={"col-md-1 pr-0 pl-0"}>
                                                    <input type="number" name={"user_rate"} className={"form-control"}
                                                           id="user_rate" readOnly/>
                                                </div>
                                                <label htmlFor={"exempt_commis"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Exempt Commis:
                                                </label>
                                                <div className={"col-md-1 pr-0 pl-0"}>
                                                    <input type="checkbox"
                                                           className={"form-control mt-2 exempt_commis"}
                                                           id="exempt_commis"/>
                                                </div>
                                                <label htmlFor={"date_entered"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    Date Entered:
                                                </label>
                                                <div className={"col-md-1 pr-0 pl-0"}>
                                                    <input type="text" name={"date_entered"} className={"form-control"}
                                                           id="date_entered" value={today()} readOnly/>
                                                </div>
                                                <label htmlFor={"user"}
                                                       className={"col-form-label col-md-1 label-align text-right"}>
                                                    User:
                                                </label>
                                                <div className={"col-md-1 pr-0 pl-0"}>
                                                    <input type="text" className="form-control text-uppercase"
                                                           name="user" id="user"
                                                           value={localStorage.getItem("username")}
                                                           placeholder="User" readOnly/>
                                                </div>
                                            </div>
                                            <hr className={"mt-0 mb-1"}/>
                                            <div className="form-group row ml-0 justify-content-center">
                                                <table className={"table table-responsive table-bordered"}
                                                       style={{maxHeight: "220px"}}>
                                                    <thead style={{position: "sticky", top: "0", zIndex: "2"}}
                                                    className={"thead-dark"}>
                                                    <tr>
                                                        <th>Invoice No</th>
                                                        <th>Invoice Date</th>
                                                        <th>Anniv</th>
                                                        <th>Intermediary</th>
                                                        <th>Invoice Net</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {fetchedData}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className={"row justify-content-center mt-1"}>
                                                <div className={"col-md-2 pr-0 pl-0"}>
                                                    <div className={"col-md-2 pr-0 pl-0"}>
                                                        <button className="btn btn-outline-warning btn-sm btn-block"
                                                                onClick={validateFields}>Validate
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className={"col-md-2 pr-0 pl-1"}>
                                                    <button className="btn btn-outline-success btn-sm btn-block"
                                                            id={"action_button"}
                                                            type={"submit"}>Save
                                                    </button>
                                                </div>
                                                <div className={"col-md-2 pr-0 pl-1"}>
                                                    <Link to={"/premium-statement"}>
                                                        <button className="btn btn-outline-info btn-sm btn-block"
                                                                type={""}>Statement
                                                        </button>
                                                    </Link>

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
                modalIsOpen={isModalOpen}
                closeModal={closeModal}
                header={<p id="headers">Premium Receipting</p>}
                body={
                    <div>
                        <div className={"row justify-content-center"}>
                            <p>{message}</p>
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
};

export default PremiumReceipt
