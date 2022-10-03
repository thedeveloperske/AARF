import {useEffect, useState} from 'react';
import {getData, getOneData, postData} from "../../../../components/helpers/Data";
import {Spinner} from "../../../../components/helpers/Spinner";
import Modal5 from "../../../../components/helpers/Modal5";

const PayProviderFund = () => {
    const [fundCorporates, setFundCorporates] = useState([]);
    const [providers, setProviders] = useState([]);
    const [fetchedClaims, setFetchedClaims] = useState([]);
    const [claimsCount, setClaimsCount] = useState([]);
    const [claimsTotal, setClaimTotal] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState([]);
    const [ttlPayable, setTtlPayable] = useState(0.0);
    const [disableSaveBtn, setDisableSaveBtn] = useState(false);


    useEffect(() => {
        getData('fetch_fund_corporates').then((data) => {
            setFundCorporates(data.fund_corporates);
        });
    }, []);
    //fetch provider for selected corporate
    const selectedCorporate = (e) => {
        e.preventDefault();
        getOneData('fetch_providers_fund', e.target.value).then((data) => {
            setProviders(data.providers);
        });
        //hide corporate dropdown
        document.getElementById('corporate_div').style.display = 'none';
        //display provider dropdown
        document.getElementById('provider_div').style.display = 'inline';

    }
    //go back to corporate div dropdown
    const Back = (e) => {
        e.preventDefault();
        //display corporate dropdown
        document.getElementById('corporate_div').style.display = 'inline';
        //hide provider dropdown
        document.getElementById('provider_div').style.display = 'none';
    }
    //fetch all provider claims
    //fetch all provider claims
    const fetchProviderFundClaims = (e) => {
        e.preventDefault();
        document.getElementById('spinner').style.display = 'block';
        getOneData('fetch_provider_fund_claims', e.target.value).then((data) => {
            console.log(data);
            if (data.claims.length === 0) {
                document.getElementById('spinner').style.display = 'none';
                setFetchedClaims([]);
                setClaimsCount([]);
                setClaimTotal([]);
                alert('Notice ! No Invoices To Pay');
            } else {
                setFetchedClaims(data.claims);
                setClaimsCount(data.claims_count);
                setClaimTotal(data.totals);
                setDisableSaveBtn(false);
                payClaimAmount();
                document.getElementById('spinner').style.display = 'none';
            }

        })
    }
    //select all for payment
    const selectAll = (e) => {
        e.preventDefault();
        const payCheckBox = document.querySelectorAll(".paid");
        payCheckBox.forEach((element) => {
            element.checked = true;
        });

        payClaimAmount();
    };
    //calculate amount payable onchange pay checkbox
    const payClaimAmount = (e) => {
        let ttlAmtPayable = 0.0;
        const tbl = document.querySelector("#pay_provider_form tbody").children;
        for (let trs of tbl) {
            const ch = trs.children[4].children[0].checked;
            if (ch == true) {
                const amtPayable = trs.children[9].children[0].value;
                ttlAmtPayable += parseFloat(amtPayable);
            }
        }
        setTtlPayable(ttlAmtPayable);
    }
    //save pay provider fund
    const savePayProviderFund = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById('pay_provider_form'))
        const paidCheckbox = document.querySelectorAll(".paid");
        var pay_counter = 0;
        paidCheckbox.forEach((element) => {
            if (element.checked == true) {
                pay_counter = pay_counter + 1;
                frmData.append("paid[]", "1");
            } else {
                frmData.append("paid[]", "0");
            }
        });
        console.log(pay_counter);
        if (pay_counter <= 0) {
            alert('Notice ! No claims selected for unvouchering');
        } else {
            postData(frmData, 'save_pay_provider').then((data) => {
                console.log(data);
                if (data.message) {
                    const message = <p style={{color: "green", fontSize: "20px"}}>{data.message}</p>
                    setMessage(message);
                    setModalOpen(true)
                    setDisableSaveBtn(true);
                    //alert(data.message);
                }
                if (data.error) {
                    const errors = <p style={{color: "red",fontSize: "20px"}}>Save Failed ! Contact the IT Admin</p>;
                    setMessage(errors);
                    setModalOpen(true)
                }
            });
        }
    }
    //close modal
    const closeModal = () => {
        setModalOpen(false);
    }
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Pay Provider Fund</h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0">
                        <div className="form-group row">
                            {/*Corporate div*/}
                            <div className={"col-md-10"} id={"corporate_div"}>
                                <div className={"row"}>
                                    <label htmlFor={"task"}
                                           className="col-form-label col-sm-2 label-align pr-2 pl-0">Select Corporate:
                                    </label>
                                    <div className="col-md-5">
                                        <select className="form-control" id="select_corporate_dropdown"
                                                onChange={selectedCorporate}>
                                            <option>Select Corporate</option>
                                            {fundCorporates.map((data) => {
                                                return (
                                                    <option key={data.corp_id}
                                                            value={data.corp_id}>{data.corporate}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/*Provider div*/}
                            <div className={"col-md-10"} id={"provider_div"} style={{display: "none"}}>
                                <div className={"row"}>
                                    <label htmlFor={"task"}
                                           className="col-form-label col-sm-2 label-align pr-2 pl-0">Select Provider:
                                    </label>
                                    <div className="col-md-5">
                                        <select className="form-control mb-0" id="select_provider_dropdown"
                                                onChange={fetchProviderFundClaims}>
                                            <option>Select Provider</option>
                                            {providers.map((data) => {
                                                return (
                                                    <option key={data.code} value={data.code}>{data.provider}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    {/*back button*/}
                                    <button className={"btn btn-outline-info btn-sm col-md-1 p-0"} onClick={Back}>
                                        <i className="far fa-arrow-alt-circle-left pr-2"></i>Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section id="pay_provider" className="project-tab">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <form id={"pay_provider_form"} onSubmit={savePayProviderFund}>
                                <div className={"row"}>
                                    <table className="table table-bordered table-sm"
                                           id="pay_provider_claims_table" style={{maxHeight: "300px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th hidden={true}>Id</th>
                                            <th>Claim No</th>
                                            <th>Invoice No</th>
                                            <th>Service</th>
                                            <th>Pay</th>
                                            <th>Invoiced Amt</th>
                                            <th>Deduction</th>
                                            <th>Reason</th>
                                            <th>Deduction Notes</th>
                                            <th>Amt Payable</th>
                                            <th>Admin Fee</th>
                                            <th>Invoice Date</th>
                                            <th>Member Name</th>
                                            <th>Foreign</th>
                                            <th>Currency</th>
                                            <th>Rate</th>
                                            <th>Foreign Amt</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {fetchedClaims.map((data) => {
                                            return (
                                                <tr>
                                                    <td hidden={true}>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"id[]"}
                                                               value={data.id === null ? '' : data.id}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"claim_no[]"}
                                                               value={data.claim_no === null ? '' : data.claim_no}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"invoice_no[]"}
                                                               value={data.invoice_no === null ? '' : data.invoice_no}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <select className={"form-control"} name={"service[]"} readOnly>
                                                            <option
                                                                value={data.service_code === null ? '' : data.service_code}>
                                                                {data.service}
                                                            </option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input type={"checkbox"} className={"form-control paid"}
                                                               value={data.paid} defaultChecked={true}
                                                               onChange={payClaimAmount}/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"invoiced_amount[]"}
                                                               value={data.invoiced_amount === null ? 0 : parseFloat(data.invoiced_amount).toLocaleString()}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"deduction_amount[]"}
                                                               value={data.deduction_amount === null ? 0 : parseFloat(data.deduction_amount).toLocaleString()}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <select className={"form-control"} name={"deduct_reason[]"}
                                                                readOnly>
                                                            <option
                                                                value={data.deduction_reason_code === null ? '' : data.deduction_reason_code}>
                                                                {data.deduct_reason}
                                                            </option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"deduction_notes[]"}
                                                               value={data.deduction_notes === null ? '' : data.deduction_notes}/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control amount_payable"}
                                                               name={"amount_payable[]"}
                                                               value={data.amount_payable === null ? 0 : data.amount_payable}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control amount_payable"}
                                                               name={"admin_fee[]"}
                                                               value={data.admin_fee === null ? 0 : parseFloat(data.admin_fee).toLocaleString()}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <input type={"date"} className={"form-control"}
                                                               name={"invoice_date[]"}
                                                               value={data.invoice_date === null ? 0 : data.invoice_date}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               value={data.member_names === null ? 0 : data.member_names}
                                                               readOnly/>
                                                        <input value={data.member_no} hidden={true}
                                                               name={"member_no[]"}/>
                                                    </td>
                                                    <td>
                                                        <input type={"checkbox"} className={"form-control"}
                                                               name={"foreigns[]"}
                                                               value={data.foreigns === null ? '' : data.foreigns}
                                                               defaultChecked={data.foreigns === "1" ? "checked" : ""}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <select className={"form-control"} name={"currency[]"}
                                                                readOnly>
                                                            <option
                                                                value={data.currency_code === null ? '' : data.currency_code}>
                                                                {data.currency}
                                                            </option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"rate[]"}
                                                               value={data.rate === null ? '' : data.rate}
                                                               readOnly/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"foreign_amt[]"}
                                                               value={data.foreign_amt === null ? '' : parseFloat(data.foreign_amt).toLocaleString()}
                                                               readOnly/>
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
                                            <th>Totals</th>
                                            <th>{claimsTotal.length !== 0 ? parseFloat(claimsTotal.total_invoiced_amt).toLocaleString() : 0}</th>
                                            <th>{claimsTotal.length !== 0 ? parseFloat(claimsTotal.total_deduction_amount).toLocaleString() : 0}</th>
                                            <th></th>
                                            <th></th>
                                            <th>{claimsTotal.length !== 0 ? parseFloat(claimsTotal.total_amount_payable).toLocaleString() : 0}</th>
                                            <th>{claimsTotal.length !== 0 ? parseFloat(claimsTotal.total_admin_fee).toLocaleString() : 0}</th>
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

                                <Spinner/>
                                <div className={"row justify-content-center mt-3"}>
                                    <label htmlFor="total_amt_payable"
                                           className="col-form-label col-md-1 label-right pr-3 pl-0">
                                        Count:
                                    </label>
                                    <div className={"col-md-1 pr-2"}>
                                        <input className={"form-control "}
                                               value={claimsCount === null ? 0 : claimsCount}/>
                                    </div>
                                    <div className="col-md-1">
                                        <input type="button" className="btn btn-outline-info  form-control"
                                               value="Select All" onClick={selectAll}/>
                                    </div>
                                    <button type={"submit"} className={"btn btn-outline-success btn-sm col-md-1"}
                                    disabled={disableSaveBtn}>
                                        Save
                                    </button>
                                    <label htmlFor="total_amt_payable"
                                           className="col-form-label col-md-1 label-right pr-3 pl-0">
                                        Total Payable:
                                    </label>
                                    <div>
                                        <input className={"form-control col-md-2"}
                                               value={parseFloat(ttlPayable).toLocaleString()}/>
                                    </div>
                                    <label htmlFor="total_amt_payable"
                                           className="col-form-label col-md-1 label-right pr-3 pl-0">
                                        User:
                                    </label>
                                    <div>
                                        <input className={"form-control col-md-2"}
                                               name={"user_id"}
                                               value={localStorage.getItem("username")} readOnly/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Modal5
                modalIsOpen={isModalOpen}
                closeModal={closeModal}
                header={<p id="headers">Pay Provider Fund</p>}
                body={
                    <div>
                        <div className={"row"}>
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

export default PayProviderFund



