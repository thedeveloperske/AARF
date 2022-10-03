import React, {useState, useEffect} from "react";
import {getOneData, postData} from "../../../../components/helpers/Data";
import {Spinner} from "../../../../components/helpers/Spinner";

import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import FormatDate3 from "../../../../components/helpers/FormatDate3";
import ResponseModal from "../../../../components/helpers/Modal2";

const TasksFollowUp = () => {
    const [report, setReport] = useState([]);
    const [address, setAddress] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [response, setResponse] = useState([]);
    const [option, setOption] = useState([]);
    const [optionValue, setOptionValue] = useState([]);

    useEffect(() => {
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0])
        }).catch((error) => console.log(error));
    }, []);

    //toggle option
    const selectOption = (e) => {
        setReport([]);
        switch (e.target.value) {
            case '1':
                setOptionValue(e.target.value);
                setOption('Completed');
                break;
            case '2':
                setOptionValue(e.target.value);
                setOption('Pending');
                break;
            default:
                break;
        }
    }
    //fetch tasks followup report data
    const fetchReport = (e) => {
        e.preventDefault();
        //setReport([]);
        if (!optionValue) {
            setResponse('Notice ! Select Option')
            setModalIsOpen(true)
        } else {
            document.getElementById("spinner").style.display = "block";
            const frmData = new FormData(document.getElementById("tasks_follow_up_frm"));
            postData(frmData, "fetch_care_task_followups").then((data) => {
                console.log(data)
                if (data) {
                    setReport(data.response);
                    document.getElementById("spinner").style.display = "none";
                }
                if (data.response.length === 0) {
                    document.getElementById("spinner").style.display = "none";
                    setResponse('Notice ! No Records to retrieve')
                    setModalIsOpen(true)
                }
            }).catch((error) => console.log(error));
        }
    };
    //print to pdf
    const printPdf = () => {
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
    <div style="text-align:center;font-size:40px;">${option} Tasks</div>    
     <br/>
    <div style="text-align:right;">${page_header}</div>
  
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
                <h4 className="fs-title">Care Reports - Tasks Followup</h4>
                <hr/>
                <div className="row ml-0">
                    <div className="col-md-12">
                        <form id="tasks_follow_up_frm" onSubmit={fetchReport}>
                            <div className="form-group row">
                                <label htmlFor={"task"}
                                       className="col-form-label col-sm-1 label-align pr-2 pl-0">Report:
                                </label>
                            </div>
                            <div className="row ml-5">
                                <fieldset className="col-md-10 pr-0 pl-0 option" onChange={selectOption}>
                                    <div className={"row"}>
                                        <label htmlFor="completed">
                                            Completed
                                        </label>
                                        <div className={"col-md-1 mr-2"}>
                                            <input type="radio" name={"option"}
                                                   value="1" id="completed" defaultChecked={true}/>
                                        </div>
                                        <label htmlFor="pending">
                                            Pending
                                        </label>
                                        <div className={"col-md-1 mr-2"}>
                                            <input type="radio" name={"option"}
                                                   value="2" id="pending"/>
                                        </div>
                                        <div className={"col-md-1"}>
                                            <button type={"submit"}
                                                    className={"btn btn-outline-info btn-sm"}>
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>
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
                            id="tasks_followup_tbl">
                            <thead className="thead-dark">
                            <tr>
                                <th>Corporate</th>
                                <th>Visit Date</th>
                                <th>Visited By</th>
                                <th>Issue</th>
                                <th>Assign To</th>
                                <th>To Complete By</th>
                                <th>Completed On</th>
                            </tr>
                            </thead>
                            <tbody>
                            {report.map((data) => {
                                return (
                                    <tr>
                                        <td className={"text-left"}>{data.corporate}</td>
                                        <td>{data.visit_date}</td>
                                        <td>{data.visited_by}</td>
                                        <td className={"text-left"}>{data.comments}</td>
                                        <td>{data.assign_to}</td>
                                        <td>{data.complete_by}</td>
                                        <td>{data.completed_on}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        <Spinner/>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="btn btn-outline-info btn-sm col-1"
                            table="tasks_followup_tbl"
                            filename="Task FollowUps"
                            sheet="task_followup"
                            buttonText="Excel"
                        />
                        <button
                            className="btn btn-outline-warning btn-sm col-1"
                            onClick={printPdf}
                            style={{marginLeft: "20px"}}
                        >
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

export default TasksFollowUp;
