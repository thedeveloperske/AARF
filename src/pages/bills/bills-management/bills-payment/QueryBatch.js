import {useEffect, useState} from 'react';
import {getData, getOneData, postData} from "../../../../components/helpers/Data";
import {Spinner} from "../../../../components/helpers/Spinner";
import Modal5 from "../../../../components/helpers/Modal5";
import Modal4 from "../../../../components/helpers/Modal4";
import {toInputUpperCase} from "../../../../components/helpers/toInputUpperCase";

const QueryBatch = () => {
    const [batchNumbers, setBatchNumbers] = useState([]);
    const [fetchedClaims, setFetchedClaims] = useState([]);
    const [claimsCount, setClaimsCount] = useState([]);
    const [claimsTotal, setClaimTotal] = useState([]);
    const [message, setMessage] = useState([]);
    const [messageModalState, setMessageModalOpen] = useState(false);

   /* useEffect(() => {
        getData('fetch_all_batch_numbers').then((data) => {
            setBatchNumbers(data);
        })
    }, [])*/
    //fetch claims from batch number
    const fetchBatchClaims = (e) => {
        e.preventDefault();
        const batch_number_value = document.getElementById('batch_number_value').value;
        if (!batch_number_value){
            setMessage('Notice ! Enter Batch Number')
            setMessageModalOpen(true);
        }else {
            document.getElementById('spinner').style.display = 'block';
            getOneData('query_bill_payment_batch', batch_number_value).then((data) => {
                console.log(data);
                if (data.claims.length === 0) {
                    document.getElementById('spinner').style.display = 'none';
                    setMessage('Notice ! Batch Has No Invoices')
                    setMessageModalOpen(true);
                } else {
                    setFetchedClaims(data.claims);
                    setClaimsCount(data.claims_count);
                    setClaimTotal(data.totals);
                    document.getElementById('spinner').style.display = 'none';
                }
            })
        }
    }
    //close modal
    const closeModal = () => {
        setMessageModalOpen(false);
    }
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Bill Payment - Query Batch</h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0">
                        <div className="form-group row">
                            <label htmlFor={"task"}
                                   className="col-form-label col-sm-2 label-right pr-2 pl-0">Batch Number:
                            </label>
                            <div className="col-md-2">
                                <input type={"text"} className={"form-control"} id="batch_number_value"
                                       placeholder={"Enter Batch No ( BAT-#### )"}
                                       onInput={toInputUpperCase}/>
                                {/*<select className="form-control" id="select_provider_dropdown"
                                        onChange={fetchBatchClaims}>
                                    <option disabled selected>Select Batch No</option>
                                    {batchNumbers.map((data) => {
                                        return (
                                            <option key={data.batch_no} value={data.batch_no}>{data.batch_no}</option>
                                        )
                                    })}
                                </select>*/}
                            </div>
                            <button className={"btn btn-sm btn-outline-info"} onClick={fetchBatchClaims}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <section id="pay_provider" className="project-tab">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <form id={"pay_provider_form"}>
                                <div className={"row"}>
                                    <table className="table table-bordered table-sm"
                                           id="pay_provider_claims_table" style={{maxHeight: "500px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th>Claim Id</th>
                                            <th>Claim No</th>
                                            <th>Invoice No</th>
                                            <th>Provider</th>
                                            <th>Service</th>
                                            <th>Benefit</th>
                                            <th>Member No</th>
                                            <th>Member Name</th>
                                            <th>Invoice Date</th>
                                            <th>Invoiced Amt</th>
                                            <th>Deduction Amt</th>
                                            <th>Deduction Reason</th>
                                            <th>Deduction Notes</th>
                                            <th>Reject Reason</th>
                                            <th>Reject Remarks</th>
                                            <th>Amt Payable</th>
                                            <th>Pre Auth No</th>
                                            <th>Voucher No</th>
                                            <th>Cheque No</th>
                                            <th>Cheque Date</th>
                                            <th>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {fetchedClaims.map((data) => {
                                            return (
                                                <tr>
                                                    <td>{data.id}</td>
                                                    <td>{data.claim_no}</td>
                                                    <td>{data.invoice_no}</td>
                                                    <td>{data.provider}</td>
                                                    <td>{data.service}</td>
                                                    <td>{data.benefit}</td>
                                                    <td>{data.member_no}</td>
                                                    <td>{data.member_names}</td>
                                                    <td>{data.invoice_date}</td>
                                                    <td>{data.invoiced_amount}</td>
                                                    <td>{data.deduction_amount}</td>
                                                    <td>{data.deduct_reason}</td>
                                                    <td>{data.deduction_notes}</td>
                                                    <td>{data.reject_reason}</td>
                                                    <td>{data.reject_remarks}</td>
                                                    <td>{data.amount_payable}</td>
                                                    <td>{data.pre_auth_no}</td>
                                                    <td>{data.voucher_no}</td>
                                                    <td>{data.cheque_no}</td>
                                                    <td>{data.cheque_date}</td>
                                                    <td>{data.vet_status === '1' ? 'ACCEPTED' :
                                                        data.vet_status === '2' ? 'DEFERRED' :
                                                            data.vet_status === '2' ? 'REJECTED' : ''}</td>
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
                                            <th>Totals</th>
                                            <th>{claimsTotal.length !== 0 ? parseFloat(claimsTotal.total_invoiced_amt).toLocaleString() : 0}</th>
                                            <th>{claimsTotal.length !== 0 ? parseFloat(claimsTotal.total_deduction_amount).toLocaleString() : 0}</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>{claimsTotal.length !== 0 ? parseFloat(claimsTotal.total_amount_payable).toLocaleString() : 0}</th>
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
                                               value={claimsCount === null ? 0 : claimsCount} readOnly/>
                                    </div>
                                    <label htmlFor="total_amt_payable"
                                           className="col-form-label col-md-1 label-right pr-3 pl-0">
                                        Total Payable:
                                    </label>
                                    <div>
                                        <input className={"form-control col-md-2"}
                                               value={claimsTotal.length !== 0 ?
                                                   parseFloat(claimsTotal.total_amount_payable).toLocaleString() : 0}
                                               readOnly/>
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
                modalIsOpen={messageModalState}
                closeModal={closeModal}
                header={<p id="headers">Query Batch</p>}
                body={
                    <div>
                        <h5 className={"text-center"}>{message}</h5>
                        <div classsName={"row"}>
                            <button onClick={() => setMessageModalOpen(false)}>Close</button>
                        </div>
                    </div>
                }/>
        </div>
    )
}

export default QueryBatch
