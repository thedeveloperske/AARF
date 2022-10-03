import React, {useState, useEffect} from 'react';
import {Spinner} from "../../../components/helpers/Spinner";
import Modal5 from "../../../components/helpers/Modal5";
import {getOneData, getData, postData} from "../../../components/helpers/Data";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "jspdf-autotable";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import "../../../css/print.css";

const PremiumStatement = () => {
    const [corporates, setCorporates] = useState([]);
    const [principals, setPrincipals] = useState([]);
    const [agents, setAgents] = useState([]);
    const [premiumStatements, setFetchedPremiumStatement] = useState([]);
    const [message, setMessage] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [address, setAddress] = useState([]);
    const [hidden, setHidden] = useState({
        corporate: false, principal: true, agent: true, opt1_tbl: false, opt2_tbl: true, opt3_tbl: true,
        opt1_tbl_all: false, opt2_tbl_all: true, excl_opt1: false, excl_opt2: true, excl_opt3: true,
    });
    const [visibleState, setVisibleState] = useState({
        save: true, print: true,
    });
    const [invoices, setInvoices] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [invoicettl, setInvoicesTtl] = useState([]);
    const [receiptsttl, setReceiptsTtl] = useState([]);
    const [balanceAmt, setBalanceAmt] = useState([]);
    const [option_val, setOption] = useState([]);
    const [period, setPeriod] = useState([]);
    const [value, setValue] = useState([]);
    const [title, setTitle] = useState([]);

    useEffect(() => {
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0]);
        });
        getData("fetch_corporates").then((data) => {
            setCorporates(data);
        });
        getData("fetch_principal_members").then((data) => {
            setPrincipals(data);
        });
        getData("fetch_agents").then((data) => {
            setAgents(data);
        });
    }, [])

    const selectedOption = () => {
        const option = document.getElementById('option').value;
        setOption(option);
        setInvoices([])
        setReceipts([])
        setInvoicesTtl([])
        setReceiptsTtl([])
        setBalanceAmt([])
        switch (option) {
            case '1':
                setHidden({
                    corporate: false, principal: true, agent: true, opt1_tbl: false, opt2_tbl: true, opt3_tbl: true,
                    opt1_tbl_all: false, opt2_tbl_all: false, excl_opt1: false, excl_opt2: true, excl_opt3: true,
                })
                break;
            case '2':
                setHidden({
                    corporate: true, principal: false, agent: true, opt1_tbl: false, opt2_tbl: true, opt3_tbl: true,
                    opt1_tbl_all: false, excl_opt1: false, excl_opt2: true, excl_opt3: true,
                })
                break;
            case '3':
                setHidden({
                    corporate: true, principal: true, agent: true, opt1_tbl: true, opt2_tbl: false, opt3_tbl: true,
                    excl_opt1: true, excl_opt2: false, excl_opt3: true, opt2_tbl_all: false,
                })
                break;
            case '4':
                setHidden({
                    corporate: true, principal: true, agent: false, opt1_tbl: true, opt2_tbl: true, opt3_tbl: false,
                    excl_opt1: true, excl_opt2: true, excl_opt3: false,
                })
                break;
            case '5':
                setHidden({
                    corporate: false, principal: true, agent: true, opt1_tbl: false, opt2_tbl: true, opt3_tbl: true,
                    opt1_tbl_all: true, excl_opt1: false, excl_opt2: true, excl_opt3: true,
                })
                break;
            case '6':
                setHidden({
                    corporate: true, principal: true, agent: true, opt1_tbl: true, opt2_tbl: false, opt3_tbl: true,
                    opt2_tbl_all: true, excl_opt1: true, excl_opt2: false, excl_opt3: true,
                })
                break;
            default:
                setHidden({
                    corporate: true, principal: true, agent: true, opt1_tbl: true, opt2_tbl: true, opt3_tbl: true,
                    excl_opt1: false, excl_opt2: true, excl_opt3: true,
                })
                break;

        }
    }
    const fetchPremiumStatementReport = (e) => {
        e.preventDefault();
        setInvoices([])
        setReceipts([])
        setInvoicesTtl([])
        setReceiptsTtl([])
        setBalanceAmt([])
        setValue([])
        setPeriod([])
        const frmData = new FormData(document.getElementById('input_form'));
        document.getElementById('spinner').style.display = 'block';
        postData(frmData, 'fetch_premium_statement_report').then((data) => {
            setPeriod('Period:  ' + document.getElementById('date_from').value + ' - ' + document.getElementById('date_to').value)
            console.log(data);
            if (data.invoices.length <= 0 && data.receipts.length <= 0) {
                const message = 'Notice ! No Records To Recover';
                setMessage(message);
                setModalOpen(true);
                document.getElementById('spinner').style.display = 'none';
            } else {
                value = '';
                if (data) {
                    setInvoices(data.invoices)
                    setReceipts(data.receipts)
                    setInvoicesTtl(data.invoice_ttl)
                    setReceiptsTtl(data.receipts_ttl)
                    setBalanceAmt(data.balance_amt)
                    switch (option_val) {
                        case '1':
                            var value = data.invoices[0].corporate
                            console.log(value);
                            console.log(option_val);
                            setValue(value);
                            break;
                        case '2':
                            var value = data.invoices[0].member_name
                            setValue(value);
                            break;
                        case '3':
                            var value = 'ALL CLIENTS'
                            setValue(value);
                            break;
                        case '4':
                            var value = data.invoices[0].agent_name
                            setValue(value);
                            break;
                        case '5':
                            var value = data.invoices[0].corporate + ' - ALL'
                                setValue(value);
                            break;
                        case '6':
                            var value = 'RECORDED'
                            setValue(value);
                            break;
                    }
                    let title = 'PREMIUM STATEMENT' + ' - ' + value;
                    setTitle(title)
                    setVisibleState({save: false, print: false})
                    document.getElementById('spinner').style.display = 'none';
                } else if (data.error) {
                    const errors = <p style={{color: "red", fontSize: "20px"}}>Save Failed ! Contact the IT Admin</p>;
                    setMessage(errors);
                    setModalOpen(true);
                    document.getElementById('spinner').style.display = 'none';
                }
            }
        }).catch((error) => console.log(error));

    }
    //close modal
    const closeModal = (e) => {
        e.preventDefault();
        setModalOpen(false);
    }
    //print to pdf
    const printPdf = (e) => {
        e.preventDefault();

        let page_header = `
      <ul style="list-style-type: none;">
        <li>${address.client_name}</li>
        <li>${address.physical_location}</li>
        <li>${address.box_no}</li>
        <li>${address.tel_cell}</li>
        <li>${address.fax}</li>
        <li>${address.email}</li>
        <li>${address.url}</li>
      </ul>
   `;
        let title = 'PREMIUM STATEMENT' + ' - ' + value;
        setTitle(title)
        let user = localStorage.getItem("username");
        const option = document.getElementById('option').value;
        switch (option) {
            case '1':
            case '2':
            case '5':
                var tbl = document.getElementById('opt1_tbl').innerHTML;
                break;
            case '3':
            case '6':
                var tbl = document.getElementById('opt2_tbl').innerHTML;
                break;
            case '4':
                var tbl = document.getElementById('opt3_tbl').innerHTML;
                break;
            default :
                break;
        }

        let j = `
    <div class="row">
    <div class="col-md-4" style="font-weight:bold; text-align: right">${page_header}</div>
    <br><br><br>
    <div class="row">
    <div class="col-md-4" style="font-weight:bold;">${title}</div>
    <div class="col-md-4 ml-auto" style="font-weight:bold; text-align: right">${period}</div>
    </div>
    <div>${tbl}</div>
    <br><br><br>
    <p>Prepared By: ${user}</p>
    <br/>
    <p>Received By: __________________________   Date Received: __________________________</p>
    </div>
    `;

        var val = htmlToPdfmake(j);
        var dd = {
            pageOrientation: "landscape",
            pageMargins: [40, 60, 40, 60],
            content: val,
            pageSize: "A4",
        };
        pdfMake.createPdf(dd).download();
    };
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Finance Reports - Premium Statement</h4>
                <hr/>
                <div className="col-md-12">
                    <form id={"input_form"} onSubmit={fetchPremiumStatementReport}>
                        <div className="row ml-0">
                            <div className="form-group row">
                                <label htmlFor={"select_task"}
                                       className="col-form-label col-md-0.5 label-right pr-3 pl-3">Select:
                                </label>
                                <div className={"col-md-2"}>
                                    <select className={"form-control"} id={"option"} name={"option"}
                                            onChange={selectedOption} required={true}>
                                        <option value={null}>Select Option</option>
                                        <option value={1}>Corporate</option>
                                        <option value={2}>Member</option>
                                        <option value={3}>All Clients</option>
                                        <option value={4}>Intermediary</option>
                                        <option value={5}>Corporate Premium Recorded</option>
                                        <option value={6}>All Corporates Premium Recorded</option>
                                    </select>
                                </div>
                                <div className={"col-md-4"}>
                                    <select className={"form-control"} id={"corporate"}
                                            name={"corporate"} hidden={hidden.corporate} required={true}>
                                        <option value={null}>Select Corporate</option>
                                        {corporates.map((data) => {
                                            return (
                                                <option value={data.CORP_ID}>{data.CORPORATE}</option>
                                            )
                                        })}
                                    </select>
                                    <select className={"form-control"} id={"principal"}
                                            name={"principal"} hidden={hidden.principal} required={true}>
                                        <option value={null}>Select Principal</option>
                                        {principals.map((data) => {
                                            return (
                                                <option value={data.member_no}>{data.principal_name}</option>
                                            )
                                        })}
                                    </select>
                                    <select className={"form-control"} id={"agent"}
                                            name={"agent"} hidden={hidden.agent} required={true}>
                                        <option value={null}>Select Agent</option>
                                        {agents.map((data) => {
                                            return (
                                                <option value={data.AGENT_ID}>{data.AGENT_NAME}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className={"col-md-2"}>
                                    <input type={"date"} className={"form-control"}
                                           name={"date_from"} id={"date_from"} maxLength="4"
                                           max={"9999-12-31"} required={true}/>
                                </div>
                                <div className={"col-md-2"}>
                                    <input type={"date"} className={"form-control"}
                                           name={"date_to"} id={"date_to"} maxLength="4"
                                           max={"9999-12-31"} required={true}/>
                                </div>
                                <div className={"col-md-1"}>
                                    <button type={"submit"} className={"btn btn-outline-info btn-sm"}>
                                        Run
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <section id="pay_provider" className="project-tab">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card mt-0" id={""}>
                            <div className={"row "}>
                                <div className={"col-md-12"}>
                                    <div className="col-md-4 float-right" hidden={visibleState.address}>
                                        <h6>{address.client_name}</h6>
                                        <h6>{address.physical_location}</h6>
                                        <h6>{address.box_no}</h6>
                                        <h6>{address.tel_cell}</h6>
                                        <h6>{address.fax}</h6>
                                        <h6>{address.email}</h6>
                                        <h6>{address.url}</h6>
                                    </div>
                                </div>

                            </div>
                            <form id={"valid_list_report"}>
                                <div className={"row mt-4"}>
                                    <div>
                                        <div>{title}</div>
                                    </div>
                                    <div className={"col-md-4 float-right ml-auto"}>
                                        {period}
                                    </div>
                                </div>
                                <div className={"row justify-content-center"} id={"card"}>
                                    {/*table 1 -- Corporates, Members, Corporate Premium Recorded opt 1, 2, 5 */}
                                    <div hidden={hidden.opt1_tbl} id={"opt1_tbl"}>
                                        <table className="table table-bordered table-sm"
                                               id="premium_statement_opt1_tbl" style={{maxHeight: "320px"}}>
                                            <thead className="thead-dark">
                                            <tr>
                                                <th className={"pr-2 pl-2"}>Corporate</th>
                                                <th className={"pr-2 pl-2"}>Intermediary</th>
                                                <th className={"pr-2 pl-2"}>Transaction Date</th>
                                                <th className={"pr-2 pl-2"}>Transaction</th>
                                                <th className={"pr-3 pl-3"}>Debit</th>
                                                <th className={"pr-5 pl-5"}>Credit</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {/*map invoices */}
                                            {invoices.map((data) => {
                                                return (
                                                    <tr>
                                                        <td>{data.corporate === null ? '' : data.corporate}</td>
                                                        <td>{data.agent_name === null ? '' : data.agent_name}</td>
                                                        <td>{data.invoice_date === null ? '' : data.invoice_date}</td>
                                                        <td>{data.invoice_no === null ? '' : data.invoice_no}</td>
                                                        <td className={"text-right"}>{data.debit === null ? 0 : parseFloat(data.debit).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.credit === null ? 0 : parseFloat(data.credit).toLocaleString()}</td>
                                                    </tr>
                                                )
                                            })}
                                            {/* map receipts after invoices*/}
                                            {receipts.map((data) => {
                                                return (
                                                    <tr>
                                                        <td className={"text-center"}>{data.corporate === null ? '' : data.corporate}</td>
                                                        <td className={"text-center"}>{data.agent_name === null ? '' : data.agent_name}</td>
                                                        <td>{data.receipt_date === null ? '' : data.receipt_date}</td>
                                                        <td className={"text-center pl-2"}>{data.transaction_receipt_no === null ? '' : data.transaction_receipt_no}</td>
                                                        <td className={"text-right"}>{data.debit === null ? 0 : parseFloat(data.debit).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.credit === null ? 0 : parseFloat(data.credit).toLocaleString()}</td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th>Totals:</th>
                                                <th className={"text-right"}>{invoicettl.length !== 0 ? parseFloat(invoicettl).toLocaleString() : 0}</th>
                                                <th className={"text-right"}>{receiptsttl.length !== 0 ? parseFloat(receiptsttl).toLocaleString() : 0}</th>
                                            </tr>
                                            <tr hidden={hidden.opt1_tbl_all}>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th>Balance:</th>
                                                <th className={"text-right"}>{balanceAmt.length !== 0 ? parseFloat(balanceAmt).toLocaleString() : 0}</th>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    {/*table 2 -- All Clients and All Corporate Premium Recorded opt 3, 6*/}
                                    <div hidden={hidden.opt2_tbl} id={"opt2_tbl"}>
                                        <table className="table table-bordered table-sm"
                                               id="premium_statement_opt2_tbl" style={{maxHeight: "320px"}}>
                                            <thead className="thead-dark">
                                            <tr>
                                                <th className={"pr-2 pl-2"}>Intermediary</th>
                                                <th className={"pr-2 pl-2"}>Client</th>
                                                <th className={"pr-3 pl-3"}>Transaction Date</th>
                                                <th className={"pr-3 pl-3"}>Transaction</th>
                                                <th className={"pr-5 pl-5"}>Debit</th>
                                                <th className={"pr-5 pl-5"}>Credit</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {/*map invoices */}
                                            {invoices.map((data) => {
                                                return (
                                                    <tr>
                                                        <td className={"text-left"}>{data.agent_name === null ? '' : data.agent_name}</td>
                                                        <td className={"text-left"}>{data.client_name === null ? '' : data.client_name}</td>
                                                        <td className={"text-center"}>{data.invoice_date === null ? '' : data.invoice_date}</td>
                                                        <td>{data.invoice_no === null ? '' : data.invoice_no}</td>
                                                        <td className={"text-right"}>{data.debit === null ? 0 : parseFloat(data.debit).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.credit === null ? 0 : parseFloat(data.credit).toLocaleString()}</td>
                                                    </tr>
                                                )
                                            })}
                                            {/* map receipts after invoices*/}
                                            {receipts.map((data) => {
                                                return (
                                                    <tr>
                                                        <td className={"text-left"}>{data.agent_name === null ? '' : data.agent_name}</td>
                                                        <td className={"text-left"}>{data.client_name === null ? '' : data.client_name}</td>
                                                        <td className={"text-center"}>{data.receipt_date === null ? '' : data.receipt_date}</td>
                                                        <td>{data.transaction_receipt_no === null ? '' : data.transaction_receipt_no}</td>
                                                        <td className={"text-right"}>{data.debit === null ? 0 : parseFloat(data.debit).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.credit === null ? 0 : parseFloat(data.credit).toLocaleString()}</td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th>Totals:</th>
                                                <th className={"text-right"}>{invoicettl.length !== 0 ? parseFloat(invoicettl).toLocaleString() : 0}</th>
                                                <th className={"text-right"}>{receiptsttl.length !== 0 ? parseFloat(receiptsttl).toLocaleString() : 0}</th>
                                            </tr>
                                            <tr hidden={hidden.opt2_tbl_all}>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th>Balance:</th>
                                                <th className={"text-right"}>{balanceAmt.length !== 0 ? parseFloat(balanceAmt).toLocaleString() : 0}</th>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    {/*table 3 -- Intermediary Option 4 */}
                                    <div hidden={hidden.opt3_tbl} id={"opt3_tbl"}>
                                        <table className="table table-bordered table-sm"
                                               id="premium_statement_opt3_tbl" style={{maxHeight: "320px"}}
                                               hidden={hidden.opt3_tbl}>
                                            <thead className="thead-dark">
                                            <tr>
                                                <th className={"pr-2 pl-2"}>Corporate</th>
                                                <th className={"pr-3 pl-3"}>Transaction Date</th>
                                                <th className={"pr-3 pl-3"}>Transaction</th>
                                                <th className={"pr-3 pl-3"}>Debit Gross</th>
                                                <th className={"pr-5 pl-5"}>Phcf</th>
                                                <th className={"pr-5 pl-5"}>TL</th>
                                                <th className={"pr-5 pl-5"}>SD</th>
                                                <th className={"pr-5 pl-5"}>Debit</th>
                                                <th className={"pr-5 pl-5"}>Credit</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {/*map invoices */}
                                            {invoices.map((data) => {
                                                return (
                                                    <tr>
                                                        <td>{data.client_name === null ? '' : data.client_name}</td>
                                                        <td>{data.invoice_date === null ? '' : data.invoice_date}</td>
                                                        <td>{data.invoice_no === null ? '' : data.invoice_no}</td>
                                                        <td className={"text-right"}>{data.debit_gross === null ? 0 : parseFloat(data.debit_gross).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.phcf === null ? 0 : parseFloat(data.phcf).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.tl === null ? 0 : parseFloat(data.tl).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.stamp_duty === null ? 0 : parseFloat(data.stamp_duty).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.debit === null ? 0 : parseFloat(data.debit).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.credit === null ? 0 : parseFloat(data.credit).toLocaleString()}</td>
                                                    </tr>
                                                )
                                            })}
                                            {/* map receipts after invoices*/}
                                            {receipts.map((data) => {
                                                return (
                                                    <tr>
                                                        <td>{data.client_name === null ? '' : data.client_name}</td>
                                                        <td>{data.receipt_date === null ? '' : data.receipt_date}</td>
                                                        <td className={"text-left pl-2"}>{data.transaction_receipt_no === null ? '' : data.transaction_receipt_no}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td className={"text-right"}>{data.debit === null ? 0 : parseFloat(data.debit).toLocaleString()}</td>
                                                        <td className={"text-right"}>{data.credit === null ? 0 : parseFloat(data.credit).toLocaleString()}</td>
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
                                                <th>Totals:</th>
                                                <th className={"text-right"}>{invoicettl.length !== 0 ? parseFloat(invoicettl).toLocaleString() : 0}</th>
                                                <th className={"text-right"}>{receiptsttl.length !== 0 ? parseFloat(receiptsttl).toLocaleString() : 0}</th>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div className={"row mb-2"}>
                                    <Spinner/>
                                </div>
                                <div>
                                    <div className={"row justify-content-center"}>
                                        <div hidden={hidden.excl_opt1} className={"col-md-1"}>
                                            <ReactHTMLTableToExcel id="test-table-xls-button"
                                                                   className="btn btn-outline-success float-right pl-0 pr-0"
                                                                   table="premium_statement_opt1_tbl"
                                                                   filename="premium_statement"
                                                                   sheet="Corporates/Members "
                                                                   buttonText="Export" disabled={visibleState.save}/>

                                        </div>
                                        <div hidden={hidden.excl_opt2} className={"col-md-1"}>
                                            <ReactHTMLTableToExcel id="test-table-xls-button"
                                                                   className="btn btn-outline-success float-right pl-0 pr-0"
                                                                   table="premium_statement_opt2_tbl"
                                                                   filename="premium_statement"
                                                                   sheet="All Clients "
                                                                   buttonText="Export" disabled={visibleState.save}/>

                                        </div>
                                        <div hidden={hidden.excl_opt3} className={"col-md-1"}>
                                            <ReactHTMLTableToExcel id="test-table-xls-button"
                                                                   className="btn btn-outline-success float-right pl-0 pr-0"
                                                                   table="premium_statement_opt3_tbl"
                                                                   filename="premium_statement"
                                                                   sheet="Intermediary"
                                                                   buttonText="Export" disabled={visibleState.save}/>
                                        </div>
                                        <button type="button"
                                                className="btn btn-outline-warning"
                                                onClick={printPdf}>
                                            Print
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Modal5 modalIsOpen={isModalOpen}
                    closeModal={closeModal}
                    header={<p id="headers">Valid List Report</p>}
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
    );
}
export default PremiumStatement;