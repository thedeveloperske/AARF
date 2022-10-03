import { useEffect,useState } from "react";
import { getData, getOneData, postData } from "../../components/helpers/Data";
import { today } from "../../components/helpers/today";
import Modal2 from "../../components/helpers/Modal2";
import ModalAlert from "../../components/helpers/Modal2";

const ReceiptReversal = () => {
    const[reversalReason, setReversalReason] = useState([]);
    const [agents, setAgents] = useState([]);
    const [banks, setBanks] = useState([]);
    const [bankAccount, setBankAccount] = useState([]);
    const [financers, setFinancers] = useState([]);
    const [paymentMode, setPaymentMode] = useState([]);
    const [currency, setCurrency] = useState([]);
    const [receiptReversal, setReceiptReversal] = useState([]);
    const [reversalNo, setReversalData] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [alertmodalOpen, setAlertModalOpen] = useState(false);
    const [alert, setAlert] = useState([]);
    const [disabled, setDisabled] = useState({reverseBtn: true, saveBtn: true});

  //fetching reversal reason
    useEffect(() => {
        getData('fetch_reversal_reason').then((data)=>{
                setReversalReason(data);
        });
    },[]);
    //fetching agents
    useEffect(() => {
        getData('fetch_agents').then((data) => {
            setAgents(data);
        });
    }, []);
      //fetching banks
      useEffect(() => {
        getData('fetch_banks').then((data) => {
            setBanks(data);
        });
    }, []);
      //fetching bank account
      useEffect(() => {
        getData('fetch_bank_accounts').then((data) => {
            setBankAccount(data);
        });
    }, []);
       //fetching financer
       useEffect(() => {
        getData('fetch_financers').then((data) => {
            setFinancers(data);
        });
    }, []);
      //fetching payment mode
      useEffect(() => {
        getData('fetch_payment_modes').then((data) => {
            setPaymentMode(data);
        });
    }, []);
      //fetching currency
      useEffect(() => {
        getData('fetch_currencies').then((data) => {
            setCurrency(data);
        });
    }, []);
    const generateData = (e) => {
      setReceiptReversal([]);
      e.preventDefault();
      //enable reverse btn upon fetch
      setDisabled({reverseBtn: false, saveBtn: true});

        const input_receipt_no = document.getElementById("receipt_no").value
        getOneData("fetch_receipt_reversal", input_receipt_no)
            .then((data) => {
                data.map(dt => {
                    setReceiptReversal(dt);
                })
            }).catch((error) => console.log(error));
    }
     //set reversal no
     const setReversalNo = () => {
        const frmData = new FormData(document.getElementById("receipt_reversal_form"));
        postData(frmData, "set_reversal_no").then((data) => {
            data.map(dt => {
                setReversalData(dt);
            })
        }).catch((error) => console.log(error));
        setDisabled({reverseBtn: false, saveBtn: true});
    };

    const makeReceiptReversal = () => {
      const reversal_reason = document.getElementById("reversal_reason").value
      if (!reversal_reason) {
        setAlert('Notice! Please select the Reversal Reason')
        setAlertModalOpen(true);
      }else{
        const receipt_amt = document.getElementById("receipt_amount").value
        const reversed_amt = "-" + receipt_amt
        document.getElementById("receipt_amount").value = reversed_amt;
      } 
      setDisabled({reverseBtn: true, saveBtn: false});
    };
    //save receipt reversal
    const saveReceiptReversal = async (e) => {
        e.preventDefault();

        const frmData = new FormData(document.getElementById('receipt_reversal_form'));
        const exemptCommisCheckbox = document.querySelectorAll("exempt_commis");
        exemptCommisCheckbox.forEach((element) => {
            if (element.checked == true){
                frmData.append("excempt_commis", "1");
            }
            else if (element.checked == false){
                frmData.append("excempt_commis", "0");
            }
        });
        postData(frmData, 'save_receipt_reversal').then((data) => {
            setFeedback(data);
            setModalIsOpen(true)
        }) 
        setDisabled({reverseBtn: true, saveBtn: true});
    }
    const closeModal = () => {
      setModalIsOpen(false)
      setTimeout(function () {
        window.location.replace("/receipt-reversal");
      }, 5000);
    }
    const closeAlertModal = () => {
      setAlertModalOpen(false);
    };
  return (
    <div>
      <section id="querycorporatetable" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="row col-md-12" id="step-1">
                <div className="form-group row ml-0">
                  <label
                    className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                    for="member_no"
                  >
                    Receipt No:
                  </label>
                  <div className="col-md-4 col-sm-4 ">
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      name="receipt_no[]"
                      id="receipt_no"
                      placeholder="Enter Receipt No"
                      aria-required="true"
                    />
                  </div>
                  <div className="col-md-1 col-sm-1 ">
                    <button
                      class="btn btn-info ml-auto btn-sm pull-right mr-1 mt-1"
                      style={{ width: "fit - content" }}
                      id="btn_generate" onClick = {generateData}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <hr />
              <form className="claims_form mt-1" id="receipt_reversal_form" onSubmit = {saveReceiptReversal}>
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Receipt Reversal</h2>
                    <hr />
                  </div>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form-group row ml-0"></div>
                      <div className="form-group row ml-0 ">
                        <label
                          htmlFor="receipt_no"
                          className="col-form-label col-sm-2 label-align pr-0 pl-0"
                        >
                          Receipt No:
                          <span className="required">*</span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="text"
                            defaultValue= {reversalNo.reversal_no}
                            className="form-control"
                            name="receipt_no"
                            required="true"
                            id="receipt_no"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="bank_account"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Bank Account:
                        </label>
                        <div className="col-md-4">
                          <select name="bank_account" defaultValue= {receiptReversal.bank_code} className="form-control" readOnly>
                          <option value={receiptReversal.bank_code}>{receiptReversal.bank_account}</option>
                                {bankAccount.map((bank_account) => {
                                    const { bank_id, bank } = bank_account;
                                    return (
                                        <option key={bank_id} value={bank_id}>
                                            {bank}
                                        </option>
                                    );
                                })}
                          </select>
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="receipt_date"
                          className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                        >
                          Receipt Date:
                        </label>
                        <div className="col-md-4 col-sm-4 ">
                          <input
                            type="text"
                            className="form-control"
                            name="receipt_date"
                            defaultValue = {receiptReversal.receipt_date}
                            id="receipt_date"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="date_entered"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Date Entered:
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            type="text"
                            value={today()}
                            className="form-control"
                            id="date_entered"
                            name="date_entered"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                      <label
                          htmlFor="cheque_no"
                          className="col-form-label col-sm-2 label-align pr-0 pl-0"
                        >
                          Cheque No:
                          <span className=""></span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="text"
                            defaultValue = {receiptReversal.cheque_no}
                            className="form-control"
                            name="cheque_no"
                            required="true"
                            id="cheque_no"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="transact_amt"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Transact Amt:
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            type="number"
                            defaultValue= {receiptReversal.trans_amt} 
                            className="form-control"
                            id="transact_amt"
                            name="transact_amt"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="financer"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Financer:
                        </label>
                        <div className="col-md-4">
                          <select name="financer" defaultValue = {receiptReversal.fin_code} className="form-control" readOnly>
                          <option value={receiptReversal.fin_code}>{receiptReversal.financer}</option>
                            {financers.map((fin) => {
                                const { fin_code, financer } = fin;
                                return (
                                    <option key={fin_code} value={fin_code}>
                                        {financer}
                                    </option>
                                );
                            })}
                          </select>
                        </div>
                        <label
                          htmlFor="payment_mode"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Payment Mode:
                        </label>
                        <div className="col-md-4">
                          <select name="payment_mode"  defaultValue = {receiptReversal.mode} className="form-control"  readOnly>
                          <option value={receiptReversal.mode}>{receiptReversal.payment_mode}</option>
                            {paymentMode.map((pay_mode) => {
                                    const { code, payment_mode } = pay_mode;
                                    return (
                                        <option key={code} value={code}>
                                            {payment_mode}
                                        </option>
                                    );
                                })}
                          </select>
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                      <label
                          htmlFor="corporate"
                          className="col-form-label col-sm-2 label-align pr-0 pl-0"
                        >
                          Corporate:
                          <span className=""></span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="text"
                            defaultValue = {receiptReversal.corporate}
                            className="form-control"
                            name="corporate"
                            id="corporate"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="Bank"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Bank:
                        </label>
                        <div className="col-md-4">
                          <select  name="bank" id="bank"  defaultValue = {receiptReversal.receipt_bank} className="form-control" readOnly>
                          <option value={receiptReversal.receipt_bank}>{receiptReversal.bank}</option>
                            {banks.map((banks) => {
                                const { CODE, BANK } = banks;
                                return (
                                    <option key={CODE} value={CODE}>
                                        {BANK}
                                    </option>
                                );
                            })}
                          </select>
                        </div>
                            {/* hidden input corp_id */}
                            <div className="col-sm-4">
                          <input
                            type="text"
                            value = {receiptReversal.corp_id}
                            className="form-control"
                            name="corp_id"
                            id="corp_id"
                            hidden
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                      <label
                          htmlFor="intermediary"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Intermediary:
                        </label>
                        <div className="col-md-4">
                          <select name="intermediary"  defaultValue = {receiptReversal.agent_id} className="form-control" readOnly>
                          <option value={receiptReversal.agent_id}>{receiptReversal.agent_name}</option>
                                {agents.map((agent) => {
                                    const { AGENT_ID, AGENT_NAME } = agent;
                                    return (
                                        <option key={AGENT_ID} value={AGENT_ID}>
                                            {AGENT_NAME}
                                        </option>
                                    );
                                }
                                )}
                          </select>
                        </div>
                        <label
                          htmlFor="member"
                          className="col-form-label col-sm-2 label-align pr-0 pl-0"
                        >
                          Member:
                          <span className=""></span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="text"
                            defaultValue = {receiptReversal.full_name}
                            className="form-control"
                            name="member"
                            id="member"
                            readOnly
                          />
                        </div>
                           {/* hidden input member_no */}
                        <div className="col-sm-4">
                          <input
                            type="text"
                            value = {receiptReversal.member_no}
                            className="form-control"
                            name="member_no"
                            id="member_no"
                            hidden
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group row ml-0"></div>
                      <div className="form-group row ml-0 ">
                      <label
                          htmlFor="currency"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          Currency:
                        </label>
                        <div className="col-md-6">
                          <select name="currency" defaultValue= {receiptReversal.cur_code} className="form-control" readOnly>
                          <option value={receiptReversal.cur_code}>{receiptReversal.currency}</option>
                            {currency.map((cur) => {
                                    const { code, currency } = cur;
                                    return (
                                        <option key={code} value={code}>
                                            {currency}
                                        </option>
                                    );
                                })}
                          </select>
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="sys_rate"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          Sys Rate:
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            defaultValue= {receiptReversal.sys_rate}
                            className="form-control"
                            name="sys_rate"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="receipt_amount"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          Receipt Amt:
                        </label>
                        <div className="col-md-6 col-sm-6">
                          <input
                            type="text"
                            defaultValue= {receiptReversal.receipt_amount}
                            className="form-control"
                            name="receipt_amount"
                            id="receipt_amount"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="user_rate"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          User Rate:
                        </label>
                        <div className="col-md-6 col-sm-6">
                          <input
                            type="text"
                            defaultValue= {receiptReversal.user_rate}
                            className="form-control"
                            name="user_rate"
                            id="user_rate"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="user"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          User:
                        </label>
                        <div className="col-md-6 col-sm-6">
                          <input
                            type="text"
                            defaultValue= {receiptReversal.user_id}
                            className="form-control"
                            name="user"
                            id="user"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="form-group row ml-0">
                        <label
                          htmlFor="exempt_commis"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          Exempt Commis:
                        </label>
                        <div className="col-md-6 col-sm-6">
                          <input
                            type="checkbox"
                            className="form-control"
                            name="exempt_commis"
                            id="exempt_commis"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr/>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form-group row ml-0"></div>
                      <div className="form-group row ml-0">
                      <label
                          htmlFor="reversal"
                          className="col-form-label col-sm-2 label-align pr-0 pl-0"
                        >
                          Reversal No:
                          <span className=""></span>
                        </label>
                        <div className="col-sm-4">
                          <input
                            type="text"
                            defaultValue= {reversalNo.reversal_no}
                            className="form-control"
                            name="reversal[]"
                            required="true"
                            id="reversal"
                            readOnly
                          />
                        </div>
                        <label
                          htmlFor="transaction_no"
                          className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                        >
                          Transaction No:
                        </label>
                        <div className="col-md-4 col-sm-4">
                          <input
                            type="text"
                            defaultValue= {reversalNo.transaction_no}
                            className="form-control"
                            id="transaction_no"
                            name="transaction_no[]"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group row ml-0"></div>
                      <div className="form-group row ml-0 ">
                      <label
                          htmlFor="currency"
                          className="col-form-label col-md-3 label-align pl-0 pr-0"
                        >
                          Reversal Reason:
                        </label>
                        <div className="col-md-9">
                          <select name="reversal_reason[]" id="reversal_reason"  required="true" className="form-control" onChange={setReversalNo}>
                            <option value="" disabled selected>Select  Reversal Reason</option>
                           {reversalReason.map((dt)=>{
                               return(<option  key={dt.code} value={dt.code}>{dt.reason}</option>);
                           })}
                          </select>
                        </div>
                      </div>
                    </div>
                      {/* hidden input receipt_no */}
                    <div className="col-sm-4">
                          <input
                            type="text"
                            value= {receiptReversal.receipt_no}
                            className="form-control"
                            name="receipt"
                            id="receipt"
                            hidden
                          />
                        </div>
                  </div>
                  <hr />
                  {/* Save button */}
                  <input
                    type="button"
                    className="btn btn-info col-md-1 ml-auto"
                    value="Reverse" onClick = {makeReceiptReversal}
                    disabled={disabled.reverseBtn}
                  />
                  <input type="submit"
                    className="btn btn-success col-md-1 ml-auto"
                    value="Save" disabled={disabled.saveBtn}/>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
       {/* Modal */}
       <Modal2
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            body={
            <span className="h4 text-white font-weight-bold text-center">
                {feedback}
            </span>
            }
            background={feedback.length > 0?feedback[0].includes('Error')?"#d9534f":"#105878":""}
          />

        <ModalAlert
        modalIsOpen={alertmodalOpen}
        closeModal={closeAlertModal}
        background="#0047AB"
        body={<p className="text-white h4 font-weight-bold">{alert}</p>}
      />
    </div>
  );
};

export default ReceiptReversal;
