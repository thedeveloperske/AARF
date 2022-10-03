import React, {useState, useEffect} from 'react'
import {getData, getOneData, postData} from "../../../components/helpers/Data";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal4 from "../../../components/helpers/Modal4";
import CustomModal from "../../../components/helpers/Modal";
import Modal5 from "../../../components/helpers/Modal5";
import {Spinner} from "../../../components/helpers/Spinner";
import Modal6 from "../../../components/helpers/Modal6";
import pdfMake from "pdfmake/build/pdfmake";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";

const PremiumsQuotaShare = () => {
    const [quotaShareData, setQuotaShareData] = useState([]);
    const [premiumData, setPremiumData] = useState([]);
    const [ttlCedePremiumAmt, setTtlCedePremiumAmt] = useState([]);
    const [ttlCommissionAmt, setTtlCommissionAmt] = useState([]);
    const [ttlNetPremiumAmt, setTtlNetPremiumAmt] = useState([]);
    const [ttlRePremiumAmt, setTtlRePremiumAmt] = useState([]);
    const [ttlRetainPremiumAmt, setTtlRetainPremiumAmt] = useState([]);
    const [ttlTaxAmt, setTtlTaxAmt] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isModalOpen, setMessageModalOpen] = useState(false);
    const [message, setMessage] = useState([]);
    const [address, setAddress] = useState([]);
    const [title, setTitle] = useState([]);
    const [reinsurer, setReinsurer] = useState([]);
    const [period, setPeriod] = useState([]);

    useEffect(() => {
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0]);
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    const fetchReinsurers = (e) => {
        e.preventDefault();
        getData('fetch_quota_share_reinsurers').then((data) => {
            console.log(data)
            if (data){
                setQuotaShareData(data);
                setModalOpen(true);
            }else {
                const message = 'Notice ! No Records to retrieve';
                setMessage(message);
                setMessageModalOpen(true)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    //fetch individual reisurers data
    const fetchReinsurerPremiumData = (e) => {
        e.preventDefault();
        //close modal
        setModalOpen(false);
        const frmData = new FormData();
        const arr = [];
        e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
            arr.push(element.textContent);
        });
        frmData.append('date_from', document.getElementById('date_from').value)
        frmData.append('date_to', document.getElementById('date_to').value)
        frmData.append('cede_rate', arr[2])
        frmData.append('commission_rate', arr[3])
        frmData.append('retention_rate', arr[4])
        frmData.append('tax_rate', arr[5])
        frmData.append('period', arr[6])

        setReinsurer(arr[1])
        setPeriod(arr[6])

        //start loader
        document.getElementById('spinner').style.display = 'block';
        postData(frmData, 'fetch_premiums_quota_share_data').then((data) => {
            console.log(data);
            if (data) {
                setPremiumData(data.data);
                setTtlCedePremiumAmt(data.total_cede_prem);
                setTtlCommissionAmt(data.total_commis);
                setTtlNetPremiumAmt(data.total_net_premium);
                setTtlRePremiumAmt(data.total_re_prem);
                setTtlRetainPremiumAmt(data.total_retain_prem);
                setTtlTaxAmt(data.total_tax_amt);
                document.getElementById('spinner').style.display = 'none';
            }
            else{
                document.getElementById('spinner').style.display = 'none';
                const message = 'Notice ! No Records to retrieve';
                setMessage(message);
                setMessageModalOpen(true);
            }
        }).catch((error) => {
            document.getElementById('spinner').style.display = 'none';
            console.log(error);
        });
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
        let title = 'PREMIUM QUOTA SHARE' + ' - ' + reinsurer;
        setTitle(title)
        let user = localStorage.getItem("username");
        var tbl = document.getElementById('quota_share_reinsurers_table_div').innerHTML;

        let j = `
    <div class="row">
    <div class="col-md-4" style="font-weight:bold; text-align: right">${page_header}</div>
    <br><br><br>
    <div class="row">
    <div class="col-md-4" style="font-weight:bold;">${title}</div>
    <div class="col-md-4 ml-auto" style="font-weight:bold; text-align: right">PERIOD: ${period}</div>
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
            pageMargins: [20, 30, 20, 30],
            content: val,
            pageSize: "A3",
        };
        pdfMake.createPdf(dd).download();
    };
    //close modal
    const closeModal = () => {
        setModalOpen(false);
        setMessageModalOpen(false);
    }
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Re-Insurance - Premiums Quota Share</h4>
                <hr/>
                <div className="col-md-12">
                    <form id={"input_form_div"}>
                        <div className="row ml-0">
                            <div className="form-group row">
                                <label htmlFor={"option"}
                                       className="col-form-label col-md-0.5 label-right pr-3 pl-3">Enter Period:
                                </label>
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
                                    <button type={"submit"} className={"btn btn-outline-info btn-sm"}
                                            onClick={fetchReinsurers}>
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
                        <div className="card">
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
                            <form id={"quota_share_form"}>
                                <div className={"row"} id={"quota_share_reinsurers_table_div"}>
                                    <table className="table table-bordered table-sm"
                                           id="quota_share_reinsurers_table" style={{maxHeight: "500px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th>Insured</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Lives</th>
                                            <th>Gross Prem</th>
                                            <th>Retained</th>
                                            <th>Ceded</th>
                                            <th>Tax</th>
                                            <th>Commission</th>
                                            <th>Re-Premium</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {premiumData.map((data) => {
                                            return (
                                                <tr>
                                                    <td>{data.corporate}</td>
                                                    <td>{data.start_date}</td>
                                                    <td>{data.end_date}</td>
                                                    <td>{data.lives}</td>
                                                    <td>{data.net_premium}</td>
                                                    <td>{data.retain_prem}</td>
                                                    <td>{data.cede_prem}</td>
                                                    <td>{data.tax_amt}</td>
                                                    <td>{data.commis}</td>
                                                    <td>{data.re_prem}</td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                        <tfoot>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>Totals</th>
                                            <th>{ttlNetPremiumAmt}</th>
                                            <th>{ttlRetainPremiumAmt}</th>
                                            <th>{ttlCedePremiumAmt}</th>
                                            <th>{ttlTaxAmt}</th>
                                            <th>{ttlCommissionAmt}</th>
                                            <th>{ttlRePremiumAmt}</th>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className={"row mt-2 mb-2"}>
                                    <Spinner/>
                                </div>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-md-1"}>
                                        <ReactHTMLTableToExcel id="test-table-xls-button"
                                                               className="btn btn-outline-success float-right pl-0 pr-0"
                                                               table="quota_share_reinsurers_table"
                                                               filename="premiums_quota_share"
                                                               sheet="Premiums Quota Share "
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
            <Modal6
                style={{marginRight: "-10% !important",}}
                modalIsOpen={modalOpen}
                closeModal={closeModal}
                header={<p id="headers">Reinsurers</p>}
                body={
                    <div>
                        <form id={"reinsurers_form"}>
                            <div className="table-responsive">
                                <table className="table table-bordered table-sm"
                                       id="quota_share_reinsurers_table" style={{maxHeight: "500px"}}>
                                    <thead className="thead-dark">
                                    <tr>
                                        <th hidden={true}>Id</th>
                                        <th>Re-Insurer</th>
                                        <th>Cede (%)</th>
                                        <th>Commission (%)</th>
                                        <th>Retention (%)</th>
                                        <th>Tax (%)</th>
                                        <th>Period</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {quotaShareData.map((data) => {
                                        return (
                                            <tr>
                                                <td hidden={true}>
                                                    <input className={"form-control"} name={"code"}
                                                           value={data.CODE} hidden/>
                                                </td>
                                                <td>{data.RE_INSURER}</td>
                                                <td>{data.ip_rate}</td>
                                                <td>{data.commis_rate}</td>
                                                <td>{data.retain_rate}</td>
                                                <td>{data.tax_rate}</td>
                                                <td>{data.rate_period}</td>
                                                <td>
                                                    <button className={"btn btn-outline-success btn-block"}
                                                            onClick={fetchReinsurerPremiumData}>
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </form>
                        <div className={"row justify-content-center"}>
                            <button className="btn btn-outline-danger"
                                    onClick={(e) => setModalOpen(false)}>Close
                            </button>
                        </div>
                    </div>
                }/>
            <Modal5
                modalIsOpen={isModalOpen}
                closeModal={closeModal}
                header={<p id="headers">Pay Provider</p>}
                body={
                    <div>
                        <div className={"row justify-content-center"}>
                            <p>{message}</p>
                        </div>
                        <div className={"row justify-content-center"}>
                            <button className="btn btn-outline-danger"
                                    onClick={(e) => setMessageModalOpen(false)}>Close
                            </button>
                        </div>
                    </div>
                }/>
        </div>
    );
}

export default PremiumsQuotaShare