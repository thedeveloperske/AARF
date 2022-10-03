import React, {useState, useEffect} from "react";
import {getOneData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import ResponseModal from "../../../components/helpers/Modal2";
import FormatDate3 from "../../../components/helpers/FormatDate3";

const DeleteLogList = () => {
    const [report, setReport] = useState([]);
    const [address, setAddress] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [response, setResponse] = useState([]);

    useEffect(() => {
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0])
        }).catch((error) => console.log(error));
    }, []);

    //fetch past admissions report data
    const fetchReport = (e) => {
        e.preventDefault();
        //const date_from = document.getElementById('date_from').value;
        //const date_to = document.getElementById('date_to').value;
        setReport([]);
        document.getElementById("spinner").style.display = "block";
        const frmData = new FormData(document.getElementById("input_form"));
        postData(frmData, "fetch_delete_user_log_list").then((data) => {
            console.log(data)
            if (data) {
                setReport(data.data);
                document.getElementById("spinner").style.display = "none";
            }
            if (data.data.length === 0) {
                document.getElementById("spinner").style.display = "none";
                setResponse('Notice ! No Records to retrieve')
                setModalIsOpen(true)
            }
        }).catch((error) => console.log(error));
    };
    //print to pdf
    const printPdf = () => {
        let from = document.getElementById("date_from").value;
        let to = document.getElementById("date_to").value;
        let period = `${FormatDate3(from)} - ${FormatDate3(to)}`;

        let page_header = `
    <ul style="list-style-type: none">
      <li>${address.client_name}</li>
      <li>${address.physical_location}</li>
      <li>${address.box_no}</li>
      <li>${address.tel_cell}</li>
      <li>${address.fax}</li>
      <li>${address.email}</li>
      <li>${address.url}</li>
    </ul>
  `;


        const doc = document.getElementById("pdf").innerHTML;
        let html = `
    <div style="text-align:center;font-size:40px;">DELETED LOG LIST</div>    
     <br/>
    <div style="text-align:right;">${page_header}</div>
    <br/>
    <div style="text-align:left;">Deleted Period (${period})</div>
    <br/><br/>
    <div>${doc}</div>
    `;
        var val = htmlToPdfmake(html);
        var dd = {
            pageOrientation: "landscape",
            pageMargins: [40, 60, 40, 60],
            content: val,
            pageSize: "A4",
        };
        pdfMake.createPdf(dd).download();
    };
    //close modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Delete Log List</h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0">
                        <div className="form-group row">
                            <label htmlFor={"task"}
                                   className="col-form-label col-sm-1 label-align pr-2 pl-0">Select Period:
                            </label>
                        </div>
                        <div className={"row"}>
                            <form id={"input_form"} className={"col-md-12"} onSubmit={fetchReport}>
                                <div className="form-group row">
                                    <label htmlFor={"date_from"}
                                           className="col-form-label col-md-0.5 label-right pr-3 pl-3">From:
                                    </label>
                                    <div className={"col-md-2"}>
                                        <input type={"date"} className={"form-control"}
                                               id={"date_from"} name={"date_from"} required
                                               maxLength={"4"} max={"9999-12-31"}/>
                                    </div>
                                    <label htmlFor={"date_to"}
                                           className="col-form-label col-md-0.5 label-right pr-3 pl-5">To:
                                    </label>
                                    <div className={"col-md-2"}>
                                        <input type={"date"} className={"form-control"}
                                               id={"date_to"} name={"date_to"} required
                                               maxLength={"4"} max={"9999-12-31"}/>
                                    </div>
                                    <div className={"col-md-1"}>
                                        <button className={"btn btn-outline-info btn-sm"}
                                                type={"submit"}>
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <section>
                <div className="card">
                    {/* insert report table */}
                    <div id="pdf" className={"row justify-content-center"}>
                        <table
                            className="table table-sm table-bordered"
                            style={{maxHeight: "500px"}}
                            id="past_admissions_tbl">
                            <thead className="thead-dark">
                            <tr>
                                <th>Deleted Info</th>
                                <th>User</th>
                                <th>Date Deleted</th>
                                <th>Deleted Item</th>

                            </tr>
                            </thead>
                            <tbody>
                            {report.map((data) => {
                                return (
                                    <tr>
                                        <td className={"text-left"}>{data.deleted_info}</td>
                                        <td>{data.user_id}</td>
                                        <td>{data.date_deleted}</td>
                                        <td>{data.delete_reason}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className={"row justify-content-center"}>
                        <Spinner/>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="btn btn-outline-info btn-sm col-1"
                            table="past_admissions_tbl"
                            filename="Delete Log List"
                            sheet="delete_log_list"
                            buttonText="Excel"
                        />
                        <button
                            className="btn btn-outline-warning btn-sm col-1"
                            onClick={printPdf}
                            style={{marginLeft: "20px"}}>
                            Print
                        </button>
                    </div>
                </div>
            </section>
            <ResponseModal
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                background="#0047AB"
                body={<p className="text-white h5 text-weight-bold">{response}</p>}
            />
        </div>
    )
}
export default DeleteLogList;