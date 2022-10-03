import React, {useEffect, useState} from 'react';
import {getData, getOneData, postData} from "../../../components/helpers/Data";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import Modal5 from "../../../components/helpers/Modal5";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {Spinner} from "../../../components/helpers/Spinner";

const RejectedBills = () => {
    const [corporates, setCorporates] = useState([]);
    const [providers, setProviders] = useState([]);
    const [hidden, setHidden] = useState({
        corporate: true, provider: false,
    });
    const [address, setAddress] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [period, setPeriod] = useState([]);
    const [value, setValue] = useState([]);
    const [title, setTitle] = useState([]);
    const [message, setMessage] = useState([]);
    const [reportsData, setRejectedBillsData] = useState([]);
    const [ttlInvoiceAmt, setTotalInvoicedAmt] = useState([]);


    useEffect(() => {
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0]);
        }).catch((error) => {
            console.log(error);
        });
        getData("fetch_corporates").then((data) => {
            setCorporates(data);
        }).catch((error) => {
            console.log(error);
        });
        getData("fetch_providers").then((data) => {
            setProviders(data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const selectedOption = () => {
        const option = document.getElementById('option').value;
        switch (option) {
            case '1':
                setRejectedBillsData([]);
                setTotalInvoicedAmt(0);
                setHidden({
                    corporate: true, provider: false,
                })
                break;
            case '2':
                setRejectedBillsData([]);
                setTotalInvoicedAmt(0);
                setHidden({
                    corporate: false, provider: true,
                })
                break;
            case '3':
                //setRejectedBillsData([]);
                //setTotalInvoicedAmt(0);
                setHidden({
                    corporate: true, provider: true,
                })
                break;
            case '4':
                //setRejectedBillsData([]);
                //setTotalInvoicedAmt(0);
                setHidden({
                    corporate: true, provider: true,
                })
                break;

        }
    }
    const fetchRejectedBillsReport = (e) => {
        e.preventDefault();
        setRejectedBillsData([]);
        setTotalInvoicedAmt(0);
        setPeriod('Period:  ' + document.getElementById('date_from').value + ' - ' + document.getElementById('date_to').value)
        const frmData = new FormData(document.getElementById('input_form_div'));
        document.getElementById('spinner').style.display = 'block';
        postData(frmData, 'fetch_rejected_bills_report').then((data) => {
            console.log(data);
            if (data.length <= 0) {
                const message = 'Notice ! No Records To Recover';
                setMessage(message);
                setModalOpen(true);
                document.getElementById('spinner').style.display = 'none';
            } else {
                if (data) {
                    setRejectedBillsData(data.claims);
                    setTotalInvoicedAmt(data.ttl_invoiced_amount);
                    document.getElementById('spinner').style.display = 'none';
                } else if (data.error) {
                    const errors = <p style={{color: "red", fontSize: "20px"}}>Fetch Failed ! Contact the IT Admin</p>;
                    setMessage(errors);
                    setModalOpen(true);
                    document.getElementById('spinner').style.display = 'none';
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }
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
        var tbl = document.getElementById('rejected_bills_table_div').innerHTML;

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
                <h4 className="fs-title">Bills Reports - Rejected Bills</h4>
                <hr/>
                <div className="col-md-12">
                    <form id={"input_form_div"} onSubmit={fetchRejectedBillsReport}>
                        <div className="row ml-0">
                            <div className="form-group row">
                                <label htmlFor={"option"}
                                       className="col-form-label col-md-0.5 label-right pr-3 pl-3">Select:
                                </label>
                                <div className={"col-md-2"}>
                                    <select className={"form-control"} id={"option"} name={"option"}
                                            onChange={selectedOption}>
                                        <option value={null}>Select Option</option>
                                        <option value={1}>Provider</option>
                                        <option value={2}>Corporate</option>
                                        <option value={3}>All Providers</option>
                                        {/*<option value={4}>All Rejections</option>*/}
                                    </select>
                                </div>
                                <div className={"col-md-4"}>
                                    <select className={"form-control"} id={"corporate"}
                                            name={"corporate"} hidden={hidden.corporate}>
                                        <option value={null}>Select Corporate</option>
                                        {corporates.map((data) => {
                                            return (
                                                <option value={data.CORP_ID}>{data.CORPORATE}</option>
                                            )
                                        })}
                                    </select>
                                    <select className={"form-control"} id={"provider"}
                                            name={"provider"} hidden={hidden.provider}>
                                        <option value={null}>Select Provider</option>
                                        {providers.map((data) => {
                                            return (
                                                <option value={data.CODE}>{data.PROVIDER}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className={"col-md-2"}>
                                    <input type={"date"} className={"form-control"}
                                           name={"date_from"} id={"date_from"} maxLength="4"
                                           max={"9999-12-31"}/>
                                </div>
                                <div className={"col-md-2"}>
                                    <input type={"date"} className={"form-control"}
                                           name={"date_to"} id={"date_to"} maxLength="4"
                                           max={"9999-12-31"}/>
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
                                    <div className="col-md-4 float-right">
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
                                    <div id={"rejected_bills_table_div"} className={"table-responsive"}>
                                        <table className="table table-bordered table-sm"
                                               id="rejected_bills_table" style={{maxHeight: "500px"}}>
                                            <thead className="thead-dark">
                                            <tr>
                                                <th>Member No</th>
                                                <th>Member Name</th>
                                                <th>Provider</th>
                                                <th>Claim No</th>
                                                <th>Invoice No</th>
                                                <th>Service</th>
                                                <th>Invoice Date</th>
                                                <th>Amount</th>
                                                <th>Reason</th>
                                                <th>Remarks</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {reportsData.map((data) => {
                                                return (
                                                    <tr>
                                                        <td>{data.member_no}</td>
                                                        <td>{data.member_name}</td>
                                                        <td>{data.provider}</td>
                                                        <td>{data.claim_no}</td>
                                                        <td>{data.invoice_no}</td>
                                                        <td>{data.service}</td>
                                                        <td>{data.invoice_date}</td>
                                                        <td>{data.invoiced_amount}</td>
                                                        <td>{data.reject_reason}</td>
                                                        <td>{data.remarks}</td>
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
                                                <th>Total:</th>
                                                <th>{ttlInvoiceAmt.length !== 0 ? parseFloat(ttlInvoiceAmt).toLocaleString() : 0}</th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <Spinner/>
                                </div>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-md-1"}>
                                        <ReactHTMLTableToExcel id="test-table-xls-button"
                                                               className="btn btn-outline-success float-right pl-0 pr-0"
                                                               table="rejected_bills_table"
                                                               filename="rejected_bills"
                                                               sheet="Rejected Bills "
                                                               buttonText="Export"/>

                                    </div>
                                    <button type="button"
                                            className="btn btn-outline-warning"
                                            onClick={printPdf}>
                                        Print
                                    </button>
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
export default RejectedBills;
