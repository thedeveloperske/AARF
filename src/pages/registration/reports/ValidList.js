import React, {useState, useEffect} from "react";
import {getData, getOneData, postData} from "../../../components/helpers/Data";
import Modal5 from "../../../components/helpers/Modal5";
import {Spinner} from "../../../components/helpers/Spinner";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import ReactHTMLTableToExcel from "react-html-table-to-excel";


const ValidList = () => {
    const [corporates, setCorporates] = useState([]);
    const [validList, setFetchedValidList] = useState([]);
    const [message, setMessage] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [address, setAddress] = useState([]);
    const [visibleState, setVisibleState] = useState({
        save: true,
        print: true,
    });
    const [title, setTitle] = useState([]);

    useEffect(() => {
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0]);
        }).catch((error) => {console.log(error)});
        //fetch corporates
        getData('fetch_corporates').then((data) => {
            setCorporates(data);
        })
    }, [])
    const fetchValidListReport = (e) => {
        e.preventDefault();
        if (document.getElementById('corp_id').value === 'Select Corporate'){
            setMessage('Notice ! Select Corporate.')
            setModalOpen(true);
        }else{
            const frmData = new FormData(document.getElementById('input_form'));
            document.getElementById('spinner').style.display = 'block';
            postData(frmData,'fetch_valid_list_report').then((data) => {
                console.log(data);
                if (data.length <= 0){
                    const message = 'Notice ! No Records To Recover';
                    setMessage(message);
                    setModalOpen(true);
                    document.getElementById('spinner').style.display = 'none';
                }
                else{
                    if (data){
                        setFetchedValidList(data);
                        setVisibleState({save:false, print: false})
                        document.getElementById('spinner').style.display = 'none';
                    }
                    else if (data.error){
                        const errors = <p style={{color: "red", fontSize: "20px"}}>Retrieve Failed ! Contact the IT Admin</p>;
                        setMessage(errors);
                        setModalOpen(true);
                        document.getElementById('spinner').style.display = 'none';
                    }
                }
            })
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
        let title = 'VALID LIST'
        setTitle(title)
        let user = localStorage.getItem("username");
        var tbl = document.getElementById('valid_list_report_table_div').innerHTML

        // const option = document.getElementById('option').value;
        // switch (option) {
        //     case '1':
        //     case '2':
        //     case '5':
        //         var tbl = document.getElementById('opt1_tbl').innerHTML;
        //         break;
        //     case '3':
        //     case '6':
        //         var tbl = document.getElementById('opt2_tbl').innerHTML;
        //         break;
        //     case '4':
        //         var tbl = document.getElementById('opt3_tbl').innerHTML;
        //         break;
        //     default :
        //         break;
        // }

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
            pageSize: "A3",
        };
        pdfMake.createPdf(dd).download();
    };
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Registration Reports - Valid List</h4>
                <hr/>
                <div className="col-md-12">
                    <form id={"input_form"} onSubmit={fetchValidListReport}>
                        <div className="row ml-0">
                            <div className="form-group row">
                                <label htmlFor={"date_from"}
                                       className="col-form-label col-md-0.5 label-right pr-3 pl-3"> Corporate:
                                </label>
                                <div className={"col-md-4"}>
                                    <select className={"form-control"} name={"corp_id"} id={"corp_id"}>
                                        <option>Select Corporate</option>
                                        {corporates.map((data) => {
                                            return (<option value={data.CORP_ID}>{data.CORPORATE}</option>)
                                        })}
                                    </select>
                                </div>
                                <label htmlFor={"date"}
                                       className="col-form-label col-md-0.5 label-right pr-3 pl-3">As at:
                                </label>
                                <div className={"col-md-2"}>
                                    <input type={"date"} className={"form-control"}
                                           name={"date"} id={"date"} maxLength="4"
                                           max={ "9999-12-31" }  required/>
                                </div>
                                <div className={"col-md-1"}>
                                    <button  type={"submit"} className={"btn btn-outline-info btn-sm"}>
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
                        <div className="card mt-0">
                            <form id={"valid_list_report"}>
                                <div className={"row"} id={"valid_list_report_table_div"}>
                                    <table className="table table-bordered table-sm"
                                           id="valid_list_report_table" style={{maxHeight: "500px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th className={"pr-2 pl-2"}>Client No</th>
                                            <th className={"pr-2 pl-2"}>Client Name</th>
                                            <th className={"pr-3 pl-3"}>Corporate</th>
                                            <th className={"pr-5 pl-5"}>Relation</th>
                                            <th className={"pr-5 pl-5"}>Start Date</th>
                                            <th className={"pr-5 pl-5"}>End Date</th>
                                            <th className={"pr-5 pl-5"}>Status</th>
                                            <th className={"pr-5 pl-5"}>D.O.B</th>
                                            <th className={"pr-5 pl-5"}>Gender</th>
                                            <th className={"pr-5 pl-5"}>Health Plan</th>
                                            <th className={"pr-5 pl-5"}>Product Name</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {validList.map((data) => {
                                            return (
                                                <tr>
                                                    <td>{data.member_no === null ? '':data.member_no}</td>
                                                    <td>{data.client_name === null ? '':data.client_name}</td>
                                                    <td>{data.corporate === null ? '':data.corporate}</td>
                                                    <td>{data.relation === null ? '': data.relation === '24' ? 'PRINCIPAL': 'DEPENDANT'}</td>
                                                    <td>{data.start_date === null ? '':data.start_date}</td>
                                                    <td>{data.end_date === null ? '':data.end_date}</td>
                                                    <td>{data.status_name === null ? '':data.status_name}</td>
                                                    <td>{data.dob === null ? '':data.dob}</td>
                                                    <td>{data.gender === null ? '':data.gender}</td>
                                                    <td>{data.health_plan === null ? '':data.health_plan}</td>
                                                    <td>{data.product_name === null ? '':data.product_name}</td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={"row mb-2"}>
                                    <Spinner/>
                                </div>
                                <div>
                                    <div className={"row justify-content-center"}>
                                        <div className={"col-md-1"}>
                                            <ReactHTMLTableToExcel id="test-table-xls-button"
                                                                   className="btn btn-outline-success float-right pl-0 pr-0"
                                                                   table="valid_list_report_table"
                                                                   filename="valid_list"
                                                                   sheet="Valid List "
                                                                   buttonText="Export" disabled={visibleState.save}/>

                                        </div>
                                        <button type="button"
                                                className="btn btn-outline-warning"
                                                onClick={printPdf}>
                                            Print
                                        </button>
                                            {/*<input*/}
                                            {/*    className="btn btn-info col-2"*/}
                                            {/*    type="submit"*/}
                                            {/*    value="Save Excel"*/}
                                            {/*    disabled={visibleState.save}*/}
                                            {/*/>*/}
                                            {/*<input*/}
                                            {/*    className="btn btn-success col-2"*/}
                                            {/*    type="button"*/}
                                            {/*    value="print"*/}

                                            {/*    disabled={visibleState.print}/>*/}
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
export default ValidList;