import React, {useEffect, useState} from 'react';
import {getOneData, postData} from "../../../components/helpers/Data";
import htmlToPdfmake from "html-to-pdfmake";
import Modal5 from "../../../components/helpers/Modal5";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import pdfMake from "pdfmake/build/pdfmake";
import {Spinner} from "../../../components/helpers/Spinner";

const ClaimsExperienceExtract = () => {
    const [address, setAddress] = useState([]);
    const [reportsData, setClaimsExpReportData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [period, setPeriod] = useState([]);
    const [title, setTitle] = useState([]);
    const [message, setMessage] = useState([]);

    useEffect(() => {
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0]);
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    const fetchClaimsExpExtractReport = (e) => {
        e.preventDefault();
        setPeriod('Period:  ' + document.getElementById('date_from').value + ' - ' + document.getElementById('date_to').value)
        const frmData = new FormData(document.getElementById('input_form'));
        document.getElementById('spinner').style.display = 'block';
        postData(frmData, 'fetch_claims_experience_extract_report').then((data) => {
            console.log(data);
            if (data.length <= 0) {
                const message = 'Notice ! No Records To Recover';
                setMessage(message);
                setModalOpen(true);
                document.getElementById('spinner').style.display = 'none';
            } else {
                if (data) {
                    //setClaimsExpReportData(data);
                    document.getElementById('spinner').style.display = 'none';
                } else if (data.error) {
                    const errors = <p style={{color: "red", fontSize: "20px"}}>Save Failed ! Contact the IT Admin</p>;
                    setMessage(errors);
                    setModalOpen(true);
                    document.getElementById('spinner').style.display = 'none';
                }
            }
        })
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
        let title = 'CLAIMS EXPERIENCE EXTRACT REPORT';
        setTitle(title)
        let user = localStorage.getItem("username");

        var tbl = document.getElementById('claims_exp_report_table_div').innerHTML;

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
                <h4 className="fs-title">Bills Reports - Claims Experience Extract</h4>
                <hr/>
                <div className="col-md-12">
                    <form id="input_form" onSubmit={fetchClaimsExpExtractReport}>
                        <div className="row ml-0">
                            <div className="form-group row">
                                <label htmlFor="period"
                                       className="col-form-label col-md-0.5 label-right pr-3 pl-3">
                                    Period:
                                </label>
                                <div className="col-md-2">
                                    <input type="date" className="form-control" name="date_from"
                                           id="date_from" maxLength="4" max="9999-12-31"/>
                                </div>
                                <div className="col-md-2">
                                    <input type="date" className="form-control" name="date_to"
                                           id="date_to" maxLength="4" max="9999-12-31"/>
                                </div>
                                <div className="col-md-1">
                                    <button type="submit" className="btn btn-outline-info btn-sm">
                                        Run
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <section id="batch_report" className="project-tab">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card mt-0" id="">
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
                            <form id="batch_report_frm">
                                <div className="row mt-4">
                                    <div>
                                        <div>{title}</div>
                                    </div>
                                    <div className="col-md-4 float-right ml-auto">
                                        {period}
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div id="claims_exp_report_table_div" className={"table-responsive"}>
                                        <table className="table table-bordered table-sm"
                                               id="claims_exp_report_table" style={{maxHeight: "500px"}}>
                                            <thead className="thead-dark">
                                            <tr>
                                                <th>Claim No</th>
                                                <th>E-Claim</th>
                                                <th>Provider Code</th>
                                                <th>Provider No</th>
                                                <th>Provider Name</th>
                                                <th>Provider Type</th>
                                                <th>Status</th>
                                                <th>Family Code</th>
                                                <th>Claim</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            </tbody>
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
                                                               table="claims_exp_report_table"
                                                               filename="claims_exp_extract_rpt"
                                                               sheet="Claims Exp Extract"
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
};

export default ClaimsExperienceExtract;
