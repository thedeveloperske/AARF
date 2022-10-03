import React, {useEffect, useState} from 'react'
import {getData, getOneData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import Modal5 from "../../../components/helpers/Modal5";
import Modal4 from "../../../components/helpers/Modal4";
import {today2, today} from "../../../components/helpers/today";

const PayOverideBdm = () => {
    const [selectedOption, setSelectedOption] = useState([]);
    const [hideVoucher, setVoucherHidden] = useState([]);
    const [hidePay, setPayHidden] = useState([]);
    const [bdms, setBDM] = useState([]);
    const [fetchedPayBDMInvoices, setFetchedPayBDMInvoices] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalOneOpen, setModalOneOpen] = useState(false);
    const [message, setMessage] = useState(false);
    const [disableSaveBtn, setDisableActionBtn] = useState(true);
    const [fetchedVoucherBDMInvoices, setFetchedVoucherBDMInvoicesByOVNo] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [payeeTypes, setPayeeTypes] = useState([]);
    const [total_bdm, setTotalBDM] = useState([]);
    const [total_whtax_amt, setTotalWhtaxAmt] = useState([]);
    const [total_commission, setTotalCommission] = useState([]);

    useEffect(() => {
        switch (selectedOption) {
            case "0":
                setFetchedPayBDMInvoices([]);
                setFetchedVoucherBDMInvoicesByOVNo([]);
                setVoucherHidden(true);
                setPayHidden(true);
                setDisableActionBtn(true);
                break;
            case "1":
                setFetchedPayBDMInvoices([]);
                setFetchedVoucherBDMInvoicesByOVNo([]);
                setVoucherHidden(true);
                setPayHidden(false);
                setDisableActionBtn(true);
                break;
            case "2":
                setFetchedPayBDMInvoices([]);
                setFetchedVoucherBDMInvoicesByOVNo([]);
                setVoucherHidden(false);
                setPayHidden(true);
                setDisableActionBtn(false);
                break;
            case "3":
                setFetchedPayBDMInvoices([]);
                setFetchedVoucherBDMInvoicesByOVNo([]);
                setVoucherHidden(true);
                setPayHidden(true);
                setDisableActionBtn(true);
                break;
            default:
                setFetchedPayBDMInvoices([]);
                setFetchedVoucherBDMInvoicesByOVNo([]);
                setVoucherHidden(true);
                setPayHidden(true);
                setDisableActionBtn(true);
                break;
        }
    }, [selectedOption]);

    useEffect(() => {
        getData('fetch_bdm').then((data) => {
            setBDM(data);
        });
        getData('fetch_all_bdm_voucher_number').then((data) => {
            //setBDM(data);
        });
        getData('fetch_bank_accounts').then((data) => {
            setBankAccounts(data);
        });
        getData('fetch_payee_types').then((data) => {
            setPayeeTypes(data);
        });
    }, []);

    const fetchBDMInvoices = () => {
        setFetchedPayBDMInvoices([]);
        const bdm = document.getElementById('select_bdm').value;
        console.log(bdm)
        document.getElementById('spinner').style.display = 'block';
        getOneData('fetch_bdm_invoices', bdm).then((data) => {
            console.log(data);
            if (data.length === 0) {
                alert('No Override Commission To Pay');
                document.getElementById('spinner').style.display = 'none';
            } else {
                setFetchedPayBDMInvoices(data);
                document.getElementById('spinner').style.display = 'none';
            }
        });
    }
    //when pay is ticked - pay invoice row-wise
    const fetchBDMRate = (e) => {
        const arr = [];
        const frmData = new FormData();
        const row = e.target.closest("tr");
        const tds = row.children;
        if (e.target.checked) {
            for (let i = 0; i < tds.length; i++) {
                arr.push(tds[i].children[0].value);
                frmData.append(i, tds[i].children[0].value);
            }
            postData(frmData, 'fetch_bdm_whtax_rate').then((data) => {
                console.log(data);
                tds[9].children[0].value = data.bdm_rate;
                tds[10].children[0].value = data.bdm_whtax_rate;
                tds[11].children[0].value = data.bdm_whtax;
                tds[12].children[0].value = data.bdm_amt;
                setDisableActionBtn(false);
            }).catch((error) => console.log(error));
        } else {
            tds[9].children[0].value = '';
            tds[10].children[0].value = '';
            tds[11].children[0].value = '';
            tds[12].children[0].value = '';
        }
    }
    //confirm save to batch
    const confirmSavePayBDMInvoices = (e) => {
        e.preventDefault();
        setModalOneOpen(true);
    }
    //save pay bdm invoices
    const savePayBDMInvoices = (e) => {
        e.preventDefault();
        switch (selectedOption){
            case '1':
                setModalOneOpen(false);
                const frmData = new FormData(document.getElementById('pay_override_bdm_form'));
                frmData.append("task", selectedOption);
                frmData.append("cheque_amount", total_bdm);
                frmData.append("total_commission", total_commission);
                const payCheckbox = document.querySelectorAll(".pay_bdm_invoice");
                payCheckbox.forEach((element) => {
                    if (element.checked == true) {
                        frmData.append("pay_bdm[]", "1");
                    } else {
                        frmData.append("pay_bdm[]", "0");
                    }
                });
                postData(frmData, 'save_pay_bdm_invoices').then((data) => {
                    document.getElementById('spinner').style.display = 'block';
                    console.log(data);
                    if (data.message) {
                        const message = <p style={{color: "green", fontSize: "20px"}}>{data.message}</p>
                        setMessage(message);
                        setModalOpen(true);
                        setDisableActionBtn(true);
                        document.getElementById('spinner').style.display = 'none';
                    }
                    if (data.error) {
                        const errors = <p style={{color: "red", fontSize: "20px"}}>Save Failed ! Contact the IT Admin</p>;
                        setMessage(errors);
                        setModalOpen(true);
                        document.getElementById('spinner').style.display = 'none';
                    }
                })
                break;
            case '2':
                const voucher_no = document.getElementById('select_voucher_no').value;
                if (!(document.getElementById('cheque_no').value)){
                    alert('Enter Cheque No');
                    setModalOneOpen(false);
                }
                else {
                    setModalOneOpen(false);
                    const frmData = new FormData(document.getElementById('pay_override_bdm_form'));
                    frmData.append("task", selectedOption);
                    frmData.append("voucher_no", voucher_no);
                    frmData.append("cheque_amount", total_bdm);
                    frmData.append("total_commission", total_commission);
                    postData(frmData, 'save_pay_bdm_invoices').then((data) => {
                        document.getElementById('spinner').style.display = 'block';
                        console.log(data);
                        if (data.message) {
                            const message = <p style={{color: "green", fontSize: "20px"}}>{data.message}</p>
                            setMessage(message);
                            setModalOpen(true);
                            setDisableActionBtn(true);
                            document.getElementById('spinner').style.display = 'none';
                        }
                        if (data.error) {
                            const errors = <p style={{color: "red", fontSize: "20px"}}>Save Failed ! Contact the IT Admin</p>;
                            setMessage(errors);
                            setModalOpen(true);
                            document.getElementById('spinner').style.display = 'none';
                        }
                    })
                }
                break;
            default:
                break;
        }
    }
    //close modal
    const closeModal = (e) => {
        e.preventDefault();
        setModalOpen(false);
        setModalOneOpen(false);
    }
    //select voucher option
    const fetchVoucherInvoicesByOVNumber = () => {
        const voucher_no = document.getElementById('select_voucher_no').value;
        document.getElementById('spinner').style.display = 'block';
        getOneData('fetch_voucher_bdm_invoices_by_ov_number', voucher_no).then((data) => {
            console.log(data);
            setFetchedVoucherBDMInvoicesByOVNo(data.data);
            setTotalBDM(data.total_bdm_amt)
            setTotalWhtaxAmt(data.total_whtax_amt)
            setTotalCommission(data.total_commiss)
            document.getElementById('spinner').style.display = 'none';
        })
    }
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">
                    Override Commission Management - Pay BDM
                </h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0">
                        <div className="form-group row">
                            <label
                                htmlFor="task"
                                className="col-form-label col-sm-1 label-right pr-0 pl-0 mr-4">
                                Override Task:
                            </label>
                            <div className="col-md-3 pr-0 pl-0">
                                <select className="form-control" id="selected_task"
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        defaultValue="0">
                                    <option disabled value="0">
                                        Select Override Task
                                    </option>
                                    <option value="1">Pay</option>
                                    <option value="2">Voucher</option>
                                    {/*<option value="3">Cheque</option>*/}
                                </select>
                            </div>

                            <div>
                                <div className="col-md-3 pr-0 pl-0 pl-2">
                                    <select className="form-control" id="select_bdm"
                                            hidden={hidePay} onChange={fetchBDMInvoices}>
                                        <option>Select BDM</option>
                                        {bdms.map((data) => {
                                            return (
                                                <option value={data.code}>{data.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>

                            </div>
                            <div className="col-md-2 pr-0 pl-0">
                                <input type="text" className="form-control" id="select_voucher_no"
                                       hidden={hideVoucher}/>
                            </div>
                            <div className={"col-md-1 ml-2"}>
                                <button className={"btn btn-outline-info btn-sm"}
                                        onClick={fetchVoucherInvoicesByOVNumber} hidden={hideVoucher}>
                                    Search
                                </button>
                            </div>
                            {/*<select className="form-control" */}
                            {/*        defaultValue="0"*/}
                            {/*    // onChange={(e) => setSelectedBatch(e.target.value)}*/}
                            {/*        hidden={hideVoucher} onChange={fetchVoucherInvoicesByOVNumber}>*/}
                            {/*    <option>Select Voucher</option>*/}
                            {/*</select>*/}
                        </div>
                    </div>
                </div>
            </div>

            <section id="" className="project-tab">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card mt-0">
                            <div className="card-body">
                                <form id="pay_override_bdm_form" onSubmit={confirmSavePayBDMInvoices}>
                                    <div className="row" hidden={hideVoucher}>
                                        <div className="col-md-12">
                                            <div className="card">
                                                <div className="form-group row justify-content-center">
                                                    <div className="col-md-1">
                                                        <label className="col-form-label label-align">
                                                            Cheque No:
                                                        </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <input type="text" className="form-control"
                                                               id={"cheque_no"} name="cheque_no"/>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <label className="col-form-label label-align">
                                                            Cheque Date:
                                                        </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <input type="date" className="form-control"
                                                               name="cheque_date" defaultValue={today()}/>
                                                    </div>

                                                    <div className="col-md-1">
                                                        <label className="col-form-label">
                                                            Deduction:
                                                        </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <input type="text" className="form-control"
                                                            name="deduction" readOnly/>
                                                    </div>
                                                </div>
                                                <div className="form-group row justify-content-center">
                                                    <div className="col-md-1">
                                                        <label className="col-form-label label-align">
                                                            Payment:
                                                        </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <select className={"form-control"} name="payee_type"
                                                        disabled selected>
                                                            {payeeTypes.map((data) => {
                                                                return(
                                                                    <option value={data.CODE}>{data.PAYEE}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <label className="col-form-label">
                                                            Total Commission:
                                                        </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <input type="text" className="form-control"
                                                            name="total_commission" value={total_commission} readOnly/>
                                                    </div>

                                                    <div className="col-md-1">
                                                        <label className="col-form-label">
                                                            Cheque Amount:
                                                        </label>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <input type="text" className="form-control"
                                                            name="cheque_amount" value={total_bdm} readOnly/>
                                                    </div>
                                                </div>
                                                <div className="form-group row justify-content-center">
                                                    <div className="col-md-1">
                                                        <label className="col-form-label">
                                                            Bank:
                                                        </label>
                                                    </div>
                                                    <div className="col-md-11">
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
                                                    <input type="text"
                                                           className="form-control text-uppercase"
                                                           name="user" id="user"
                                                           value={localStorage.getItem("username")}
                                                           placeholder="User" readOnly hidden/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <hr/>
                                            <h6 className="font-weight-bold" style={{textAlign: "right"}}></h6>
                                            <div hidden={hidePay}>
                                                <table className="table table-bordered table-sm"
                                                       id="pay_override_bdm_table" style={{maxHeight: "400px"}}
                                                >
                                                    <thead className="thead-dark">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Invoice No</th>
                                                        <th>Corporate</th>
                                                        <th>Family</th>
                                                        <th>Net Premium</th>
                                                        <th>Allocated</th>
                                                        <th>Allocated Amt</th>
                                                        <th>Pay</th>
                                                        <th>Bdm Rate</th>
                                                        <th>Bdm Whtax Rate</th>
                                                        <th>Bdm Whtax</th>
                                                        <th>Bdm Amt</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {fetchedPayBDMInvoices.map((data) => {
                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <input type={"text"} className={"form-control"}
                                                                           name={"id_key[]"}
                                                                           defaultValue={data.id_key === null ? '' : data.id_key}/>
                                                                </td>
                                                                <td hidden={true}>
                                                                    <input type={"text"} className={"form-control"}
                                                                           defaultValue={data.new_renewal === null ? '' : data.new_renewal}/>
                                                                </td>
                                                                <td>
                                                                    <input type={"text"} className={"form-control"}
                                                                           name={"invoice_no[]"}
                                                                           defaultValue={data.invoice_no === null ? '' : data.invoice_no}/>
                                                                </td>
                                                                <td>
                                                                    <input type={"text"} className={"form-control"}
                                                                           defaultValue={data.corporate === null ? '' : data.corporate}/>
                                                                </td>
                                                                <td>
                                                                    <input type={"text"} className={"form-control"}
                                                                           defaultValue={data.member_names === null ? '' : data.member_names}/>
                                                                </td>
                                                                <td>
                                                                    <input type={"text"} className={"form-control"}
                                                                           defaultValue={data.net_premium === null ? '' : data.net_premium}/>
                                                                </td>
                                                                <td>
                                                                    <input type="checkbox" className="form-control"
                                                                           defaultValue={data.allocated === null ? '' : data.allocated}
                                                                           checked={data.allocated == 1 ? true : false}/>
                                                                </td>
                                                                <td>
                                                                    <input type="text" className="form-control text-right"
                                                                           defaultValue={data.allocated_amt === null ? '' : data.allocated_amt}/>
                                                                </td>
                                                                <td>
                                                                    <input type="checkbox"
                                                                           className="form-control pay_bdm_invoice"
                                                                           onChange={fetchBDMRate}/>
                                                                </td>
                                                                <td>
                                                                    <input type={"text"} className={"form-control"}
                                                                           name={"bdm_rate[]"}/>
                                                                </td>
                                                                <td>
                                                                    <input type={"text"} className={"form-control"}
                                                                           name={"bdm_whtax_rate[]"}/>
                                                                </td>
                                                                <td>
                                                                    <input type={"text"} className={"form-control"}
                                                                           name={"bdm_whtax[]"}/>
                                                                </td>
                                                                <td>
                                                                    <input type={"text"} className={"form-control"}
                                                                           name={"bdm_amt[]"}/>
                                                                </td>
                                                            </tr>
                                                        )
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
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                            {/*voucher option - Second table */}
                                            <div hidden={hideVoucher}>
                                                <table className="table table-bordered table-sm"
                                                       id="voucher_bdm_table" style={{maxHeight: "400px"}} >
                                                    <thead className="thead-dark">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Agent</th>
                                                        <th>Corporate</th>
                                                        <th>Member Name</th>
                                                        <th>Allocated Amt</th>
                                                        <th>Pay</th>
                                                        <th>Bdm Rate</th>
                                                        <th>Bdm Whtax Rate</th>
                                                        <th>Bdm Whtax</th>
                                                        <th>Bdm Amt</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {fetchedVoucherBDMInvoices.map((data) => {
                                                        return (
                                                            <tr>
                                                                <td><input className={"form-control"} value={data.id_key} name={"id_key_t2[]"}/></td>
                                                                <td>{data.agent_name}</td>
                                                                <td>{data.corporate}</td>
                                                                <td>{data.member_names}</td>
                                                                <td>{data.allocated_amt}</td>
                                                                <td><input className={"form-control"} type={"checkbox"}
                                                                           value={data.bdm_paid}
                                                                           defaultChecked={data.bdm_paid === '1' ? "checked" : ""} checked={true}/></td>
                                                                <td>{data.bdm_rate}</td>
                                                                <td>{data.bdm_whtax_rate}</td>
                                                                <td>{data.bdm_whtax}</td>
                                                                <td>{data.bdm_amt}</td>
                                                            </tr>
                                                        )
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
                                                        <th>{total_whtax_amt}</th>
                                                        <th>{total_bdm}</th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                            <div className={"row"}>
                                                <Spinner/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row justify-content-center mt-3">
                                        <input
                                            type="submit"
                                            className="btn btn-outline-info btn-sm col-md-1"
                                            value="Save" disabled={disableSaveBtn}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal4
                modalIsOpen={isModalOneOpen}
                closeModal={closeModal}
                header={<p id="headers">Confirm</p>}
                body={
                    <div>
                        <div className={"row"}>
                            <p>Notice ! Save this batch for approval ? </p>
                        </div>
                    </div>
                }
                buttons={
                    <div className="row">
                        <div className="col-md-6">
                            <button className="btn btn-outline-success float-right"
                                    onClick={savePayBDMInvoices}>Yes
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-outline-danger float-right"
                                    onClick={closeModal}>No
                            </button>
                        </div>
                    </div>
                }/>
            <Modal5
                modalIsOpen={isModalOpen}
                closeModal={closeModal}
                header={<p id="headers">Pay Override BDM</p>}
                body={
                    <div>
                        <div className={"row justify-content-center"}>
                            <p>{message}</p>
                        </div>
                        <div className={"row justify-content-center"}>
                            <button className="btn btn-outline-danger"
                                    onClick={(e) => setModalOpen(false)}>Close
                            </button>
                        </div>
                    </div>
                }/>
        </div>
    )
}

export default PayOverideBdm
