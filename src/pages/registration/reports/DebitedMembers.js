import React, {useState, useEffect} from "react";
import {getData, getOneData, postData} from "../../../components/helpers/Data";
import Modal5 from "../../../components/helpers/Modal5";
import {Spinner} from "../../../components/helpers/Spinner";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const DebitedMembers = () => {
    const [corporates, setCorporates] = useState([]);
    const [disableSelectCorpDiv, setDisableSelectCorpDiv] = useState(true);
    const [selectedRdOption, setSelectedOption] = useState([]);
    const [debitedMembers, setFetchedDebitedMembers] = useState([]);
    const [message, setMessage] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [visibleState, setVisibleState] = useState({
        save: true,
        print: true,
    });
    const [address, setAddress] = useState([]);
    const [title, setTitle] = useState([]);
    const [value, setValue] = useState([]);

    useEffect(() => {
        getData('fetch_corporates').then((data) => {
            setCorporates(data);
        });
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0]);
        });
    }, []);

    const selectedOption = () => {
        const selected_radio = document.querySelectorAll('.select_radio_option').value;
        if (document.getElementById('all_clients_rd_option').checked) {
            setSelectedOption(document.getElementById('all_clients_rd_option').value);
            document.getElementById('corp_id').value = null;
            setDisableSelectCorpDiv(true);
        } else if (document.getElementById('per_client_rd_option').checked) {
            setSelectedOption(document.getElementById('per_client_rd_option').value);
            setDisableSelectCorpDiv(false);
        }
    }

    const fetchDebitedMembersReport = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById('input_form'));
        const corp_id = document.getElementById('corp_id').value;
        document.getElementById('spinner').style.display = 'block';
        console.log(selectedRdOption)
        switch (selectedRdOption) {
            case '1':
                //fetch
                postData(frmData, 'fetch_debited_members_report').then((data) => {
                    console.log(data);
                    console.log(data.length);
                    if (data.length <= 0) {
                        const message = 'Notice ! No Records To Recover';
                        setMessage(message);
                        setModalOpen(true);
                        document.getElementById('spinner').style.display = 'none';
                    } else {
                        if (data) {
                            setFetchedDebitedMembers(data);
                            setVisibleState({save: false, print: false})
                            document.getElementById('spinner').style.display = 'none';
                            setValue('ALL CLIENTS ')
                            let title = 'DEBITED MEMBERS' + ' - ' + value;
                            setTitle(title)
                        } else if (data.error) {
                            const errors = <p style={{color: "red", fontSize: "20px"}}>Save Failed ! Contact the IT
                                Admin</p>;
                            setMessage(errors);
                            setModalOpen(true);
                            document.getElementById('spinner').style.display = 'none';
                        }
                    }
                });
                break;
            case '2':
                if (!corp_id) {
                    alert('Select Corporate');
                } else {
                    //fetch
                    postData(frmData, 'fetch_debited_members_report').then((data) => {
                        console.log(data);
                        console.log(data.length);
                        if (data.length <= 0) {
                            const message = 'Notice ! No Records To Recover';
                            setMessage(message);
                            setModalOpen(true);
                            document.getElementById('spinner').style.display = 'none';
                        } else {
                            if (data) {
                                setFetchedDebitedMembers(data);
                                setVisibleState({save: false, print: false})
                                document.getElementById('spinner').style.display = 'none';
                                setValue('PER CLIENT '+ ' - ' + data[0].corporate)
                                let title = 'DEBITED MEMBERS' + ' - ' + value;
                                setTitle(title)
                            } else if (data.error) {
                                const errors = <p style={{color: "red", fontSize: "20px"}}>Save Failed ! Contact the IT
                                    Admin</p>;
                                setMessage(errors);
                                setModalOpen(true);
                                document.getElementById('spinner').style.display = 'none';
                            }
                        }
                    });
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
        let title = 'DEBITED MEMBERS' + ' - ' + value;
        let user = localStorage.getItem("username");
        var tbl = document.getElementById('debited_members_report_table_div').innerHTML;

        let j = `
    <div class="row">
    <div class="col-md-4" style="font-weight:bold; text-align: right">${page_header}</div>
    <br><br><br>
    <div class="row">
    <div class="col-md-4" style="font-weight:bold;">${title}</div>
    <div class="col-md-4 ml-auto" style="font-weight:bold; text-align: right"></div>
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
                <h4 className="fs-title">Registration Reports - Debited Members</h4>
                <hr/>
                <div className="col-md-12">
                    <form id={"input_form"} onSubmit={fetchDebitedMembersReport}>
                        <div className="row ml-0">
                            <div className="form-group row ml-2">
                                <label htmlFor={"all_clients_rd_option"}
                                       className="col-form-label col-sm-1.5 label-align pr-0 pl-0">All
                                    Clients </label>
                                <div className={"col-md-1 pr-0 pl-0"}>
                                    <input type={"radio"} className={"form-control mt-2"}
                                           name={"select_radio_option"} id={"all_clients_rd_option"}
                                           value={1} onChange={selectedOption}/>
                                </div>
                                <label htmlFor={"per_client_rd_option"}
                                       className="col-form-label col-sm-1.5 label-align pr-0 pl-0">Per
                                    Clients </label>
                                <div className={"col-md-1 pr-0 pl-0"}>
                                    <input type={"radio"} className={"form-control mt-2"}
                                           name={"select_radio_option"} id={"per_client_rd_option"}
                                           value={2} onChange={selectedOption}/>
                                </div>
                                <div id={"corporate_dropdown"}>
                                    <select className={"form-control"} name={"corp_id"} id={"corp_id"}
                                            disabled={disableSelectCorpDiv}>
                                        <option value={null} disabled selected>Select Corporate</option>
                                        {corporates.map((data) => {
                                            return (<option value={data.CORP_ID}>{data.CORPORATE}</option>)
                                        })}
                                    </select>
                                </div>
                                <div className={"col-md-1"}>
                                    <button type={"submit"} className={"btn btn-outline-info btn-sm ml-2"}>
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
                            <div className={"row"}>
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
                                    <div>{title}</div>
                                </div>
                                <div className={"row"} id={"debited_members_report_table_div"}>
                                    <table className="table table-bordered table-sm"
                                           id="debited_members_report_table" style={{maxHeight: "320px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th className={"pr-2 pl-2"}>Corporate</th>
                                            <th className={"pr-2 pl-2"}>Principal Name</th>
                                            <th className={"pr-3 pl-3"}>Member Name</th>
                                            <th className={"pr-5 pl-5"}>Member No.</th>
                                            <th className={"pr-5 pl-5"}>Anniv</th>
                                            <th className={"pr-5 pl-5"}>Debit No.</th>
                                            <th className={"pr-5 pl-5"}>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {debitedMembers.map((data) => {
                                            return (
                                                <tr>
                                                    <td>{data.corporate === null ? '' : data.corporate}</td>
                                                    <td>{data.principal_name === null ? '' : data.principal_name}</td>
                                                    <td>{data.member_name === null ? '' : data.member_name}</td>
                                                    <td>{data.member_no === null ? '' : data.member_no}</td>
                                                    <td>{data.anniv === null ? '' : data.anniv}</td>
                                                    <td>{data.invoice_no === null ? '' : data.invoice_no}</td>
                                                    <td>{data.dob === null ? '' : data.dob}</td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={"row mb-2"}>
                                    <Spinner/>
                                </div>
                                <div className={"row justify-content-center"}>
                                    <div className={"col-md-1"}>
                                        <ReactHTMLTableToExcel id="test-table-xls-button"
                                                               className="btn btn-outline-success float-right pl-0 pr-0"
                                                               table="debited_members_report_table"
                                                               filename="debited_members"
                                                               sheet="Debited Members "
                                                               buttonText="Export" disabled={visibleState.save}/>

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
    );
}
export default DebitedMembers;