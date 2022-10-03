import React, {useState, useEffect} from "react";
import {getOneData, postData} from "../../../../components/helpers/Data";
import {Spinner} from "../../../../components/helpers/Spinner";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import FormatDate3 from "../../../../components/helpers/FormatDate3";
import ResponseModal from "../../../../components/helpers/Modal2";

const PastAdmissions = () => {
    const [report, setReport] = useState([]);
    const [count, setCount] = useState([]);
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
        const frmData = new FormData(document.getElementById("past_admissions"));
        postData(frmData, "fetch_care_past_admissions").then((data) => {
            console.log(data)
            if (data){
                setReport(data.past_admissions);
                setCount(data.count);
                document.getElementById("spinner").style.display = "none";
            }
            if (data.past_admissions.length === 0){
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
    <div style="text-align:center;font-size:40px;">PAST ADMISSIONS</div>    
     <br/>
    <div style="text-align:right;">${page_header}</div>
    <br/>
    <div style="text-align:left;">Period (${period})</div>
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
                <h4 className="fs-title">Care Reports - Past Admissions</h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0">
                        <form id="past_admissions" onSubmit={fetchReport}>
                            <div className="form-group row">
                                <label htmlFor={"task"}
                                       className="col-form-label col-sm-1 label-align pr-2 pl-0">Report:
                                </label>
                            </div>
                            <div className="form-group row">
                                <label htmlFor={"date_from"}
                                       className="col-form-label col-md-0.5 label-right pr-3 pl-3">From:
                                </label>
                                <div className={"col-md-2"}>
                                    <input type={"date"} className={"form-control"} required
                                           id={"date_from"} name={"date_from"} maxLength={"4"} max={"9999-12-31"}/>
                                </div>
                                <label htmlFor={"date_to"}
                                       className="col-form-label col-md-0.5 label-right pr-3 pl-5">To:
                                </label>
                                <div className={"col-md-2"}>
                                    <input type={"date"} className={"form-control"} required
                                           id={"date_to"} name={"date_to"} maxLength={"4"} max={"9999-12-31"}/>
                                </div>
                                <div className={"col-md-1"}>
                                    <button type={"submit"}
                                            className={"btn btn-outline-info btn-sm"}>
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <section>
                <div className="card">
                    {/* insert report table */}
                    <div id="pdf">
                        <table
                            className="table table-sm table-bordered"
                            style={{maxHeight: "500px"}}
                            id="past_admissions_tbl">
                            <thead className="thead-dark">
                            <tr>
                                <th>Corporate</th>
                                <th>Member No.</th>
                                <th>Member Names</th>
                                <th>Pre Auth No</th>
                                <th>Date Admitted</th>
                                <th>Admission No.</th>
                                <th>Ward</th>
                                <th>Room No.</th>
                                <th>Bed No.</th>
                            </tr>
                            </thead>
                            <tbody>
                            {report.map((data) => {
                                return (
                                    <tr>
                                        <td className={"text-left"}>{data.corporate}</td>
                                        <td>{data.member_no}</td>
                                        <td className={"text-left"}>{data.member_name}</td>
                                        <td>{data.pre_auth_no}</td>
                                        <td>{data.date_admitted}</td>
                                        <td>{data.admission_no}</td>
                                        <td>{data.ward}</td>
                                        <td>{data.room_no}</td>
                                        <td>{data.bed_no}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                            <tfoot>
                            <tr>
                                <th></th>
                                <th>{count}</th>
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
                        <Spinner/>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="btn btn-outline-info btn-sm col-1"
                            table="past_admissions_tbl"
                            filename="Past Admissions"
                            sheet="past_admissions"
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
    );
};

export default PastAdmissions;
