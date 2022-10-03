import XLSX from "xlsx";
import React, {useState} from "react";
import {postData} from "../../../../components/helpers/Data";
import {Spinner} from "../../../../components/helpers/Spinner";
import {today} from "../../../../components/helpers/today";
import Modal5 from "../../../../components/helpers/Modal5";

const ImportHospitalBills = () => {
    const [modalIsOpen, setModalOpen] = useState(false);
    const [importedData, setImportedData] = useState([]);
    const [validatedData, setValidatedData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [generatedClaimNumbers, setGeneratedClaimNumbers] = useState([]);
    const [message, setMessage] = useState([]);
    const [disableGenerateBtn, setDisableGenerateBtn] = useState(true);
    const [disableValidateBtn, setDisableValidateBtn] = useState(true);
    const [disableBtn, setDisableBtn] = useState(true);

    //import excel workbook
    const readExcel = (file) => {
        //clear table
        setImportedData([]);
        //start loader
        document.getElementById('spinner').style.display = 'block';
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            if (file){
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;

                    const wb = XLSX.read(bufferArray, {
                        type: "buffer",
                        cellDates: false,
                        cellNF: false,
                        cellText: false,
                    });

                    const wsname = wb.SheetNames[0];

                    //get column names and validate
                    const workbookHeaders = XLSX.read(bufferArray, {
                        sheetRows: 1,
                    });
                    const columns = XLSX.utils.sheet_to_json(
                        workbookHeaders.Sheets[wsname],
                        { header: 1 }
                    )[0];
                    if (
                        (columns[0] === "invoice_no" &&
                            columns[1] === "provider" &&
                            columns[2] === "service" &&
                            columns[3] === "claim_nature" &&
                            columns[4] === "invoiced_amt" &&
                            columns[5] === "invoice_date" &&
                            columns[6] === "date_received" &&
                            columns[7] === "member_no" &&
                            columns[8] === "link" &&
                            columns[9] === "batch_no" &&
                            columns[10] === "claim_no" &&
                            columns[11] === "claim_form_no" &&
                            columns[12] === "user" &&
                            columns[13] === "date_entered" &&
                            columns[14] === "date_admitted" &&
                            columns[15] === "date_discharged" &&
                            columns[16] === "refund" &&
                            columns[17] === "anniv" &&
                            columns[18] === "fund" &&
                            columns[19] === "corp_id" &&
                            columns[20] === "family_no" &&
                            columns[21] === "import" &&
                            columns[22] === "id" &&
                            columns[23] === "entry_notes" &&
                            columns[24] === "category" &&
                            columns[25] === "sub_bene" &&
                            columns[26] === "pri_dep")
                    ){
                        const ws = wb.Sheets[wsname];

                        const data = XLSX.utils.sheet_to_json(ws, {
                            raw: false,
                            dateNF: "YYYY-MM-DD",
                        });
                        setColumns(columns);
                        resolve(data);
                    }
                    else{
                        resolve([]);
                    }
                };

                fileReader.onerror = (error) => {
                    reject(error);
                };
                setDisableValidateBtn(false);
            }
            else {
                document.getElementById("spinner").style.display = "none";
            }
        });
        promise.then((dt) => {
            if (dt.length !== 0){
                console.log(dt);
                document.getElementById("spinner").style.display = "none";
                setImportedData(dt);
                //setButtonHidden({ ...buttonHidden,extraRow:false, generate: false });
            } else {
                document.getElementById("spinner").style.display = "none";
                setMessage("Import Columns not correct");
                setModalOpen(true);
            }
        });
    }
    //convert excel date to javascript data
    const excelDateToJSDate = (excelDate) => {
        if(excelDate){
            var date = new Date(Math.round((excelDate - (25567 + 2)) * 86400 * 1000));
            var converted_date = date.toISOString().split('T')[0];
            return converted_date;
        }else{
            return '';
        }

    }
    //validate imported data
    const validateImportedData = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById('imported_data_form'));
        //start loader
        document.getElementById('spinner').style.display = 'block';
        postData(frmData, 'validate_imported_hospital_bills').then((data) =>{
            console.log(data);

            const tbl = document.querySelector(
                "#imported_data_table tbody"
            ).children;
            for (let i = 0; i < tbl.length; i++) {
                const tr = tbl[i];
                // tr.children[10].children[0].value = data[i].claim_no;
                // tr.children[11].children[0].value = data[i].claim_no;
                tr.children[16].children[0].value = 0;
                tr.children[17].children[0].value = data[i].ll_anniv;
                tr.children[18].children[0].value = data[i].corp_id;
                tr.children[19].children[0].value = data[i].family_no;
                tr.children[20].children[0].value = 1;
                tr.children[22].children[0].value = data[i].error;
            }
            document.getElementById('spinner').style.display = 'none';
            setDisableGenerateBtn(false);

        })
            .catch((error) => console.log(error));

    }
    //generate claim number
    const generateClaimNo = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById('imported_data_form'));
        postData(frmData, 'generate_claim_no_for_imported_hospital_bills').then((data) => {
            console.log(data);
            setGeneratedClaimNumbers(data);
            setDisableGenerateBtn(true);
            const tbl = document.querySelector(
                "#imported_data_table tbody"
            ).children;
            for (let i = 0; i < tbl.length; i++) {
                const tr = tbl[i];
                tr.children[10].children[0].value = data[i].claim_no;
                tr.children[11].children[0].value = data[i].claim_no;
                // tr.children[16].children[0].value = 0;
                // tr.children[17].children[0].value = data[i].ll_anniv;
                // tr.children[18].children[0].value = data[i].corp_id;
                // tr.children[19].children[0].value = data[i].family_no;
                // tr.children[20].children[0].value = 1;
            }
            setDisableBtn(false);
        })
            .catch((error) => console.log(error));

    }
    //save hospital claims
    const saveImportHospitalBills = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById('imported_data_form'))
        postData(frmData, 'save_imported_hospital_cash_bills').then((data) => {
            console.log(data);
            setModalOpen(true);
            setMessage(data.message);
            setDisableBtn(true);
        })
    }
    const closeModal = () => {
        setModalOpen(false);
    }
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Bills - Import Hospital Cash Bills</h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0 ml-5">
                        <div className="form-group row">
                            <label htmlFor={"date_from"}
                                   className="col-form-label col-md-0.5 label-right pr-3 pl-3">Import File:
                            </label>
                            <div className="col-md-4 col-sm-4 ">
                                <input type="file" className="form-control" name="import_preloaded_members"
                                       id="import_preloaded_members"
                                       placeholder="Choose File" aria-required="true" onChange={(e) => {
                                    const file = e.target.files[0];
                                    readExcel(file);
                                }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section id="pay_provider" className="project-tab">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card mt-0">
                            <div className={"row"}>
                                <h4 className="fs-title">Bills</h4>
                                <hr/>
                            </div>
                            <form id={"imported_data_form"}>
                                <div className={"row"}>
                                    <table className={"table table-responsive mt-2"} id={"imported_data_table"}
                                           style={{maxHeight: "500px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th>Invoice No</th>
                                            <th>Provider</th>
                                            <th>Service</th>
                                            <th>Claims Nature</th>
                                            <th>Invoiced Amount</th>
                                            <th>Invoiced Date</th>
                                            <th>Date Received</th>
                                            <th>Member No</th>
                                            <th>Link</th>
                                            <th>Batch No</th>
                                            <th>Claim No</th>
                                            <th>Claim Form No</th>
                                            <th>User</th>
                                            <th>Date Entered</th>
                                            <th>Date Admitted</th>
                                            <th>Date Discharged</th>
                                            <th>Refund</th>
                                            <th>Anniv</th>
                                            <th>Corp Id</th>
                                            <th>Family No</th>
                                            <th>Import</th>
                                            <th>Id</th>
                                            <th className={"pr-5 pl-5"}>Entry Notes</th>
                                            <th>Category</th>
                                            <th>Sub Bene</th>
                                            <th>Pri Dep</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {importedData.map((data) => {
                                            return (
                                                <tr key={data.id}>
                                                    <td><input className={"form-control"} type={"text"}
                                                               name={"invoice_no[]"}
                                                               value={data.invoice_no}/>
                                                    </td>
                                                    <td><input className={"form-control"} type={"text"}
                                                               name={"provider[]"}
                                                               value={data.provider}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"service[]"}
                                                               value={data.service}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"claim_nature[]"}
                                                               value={data.claim_nature}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control text-right"} type={"text"}
                                                               name={"invoiced_amt[]"}
                                                               value={data.invoiced_amt}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"invoice_date[]"}
                                                               defaultValue={excelDateToJSDate(data.invoice_date)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"date_received[]"}
                                                               value={excelDateToJSDate(data.date_received)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"member_no[]"}
                                                               value={data.member_no}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control text-center"} type={"text"}
                                                               name={"link[]"}
                                                               value={data.link}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"batch_no[]"}
                                                               value={data.batch_no}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"claim_no[]"}
                                                               value={data.claim_no}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"claim_form_no[]"}
                                                               value={data.claim_form_no}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"user[]"}
                                                               value={localStorage.getItem("username")}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"date_entered[]"}
                                                               value={today()}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"date_admitted[]"}
                                                               value={excelDateToJSDate(data.date_admitted)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"date_discharged[]"}
                                                               value={excelDateToJSDate(data.date_discharged)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"refund[]"}
                                                               value={data.refund}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"anniv[]"}
                                                               value={data.anniv}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"corp_id[]"}
                                                               value={data.corp_id}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"family_no[]"}
                                                               value={data.family_no}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"import[]"}
                                                               value={data.import}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               value={data.id}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control text-danger"} type={"text"}
                                                               value={data.entry_notes}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"category[]"}
                                                               value={data.category}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"checkbox"}
                                                               name={"sub_bene[]"}
                                                               value={data.sub_benefit}
                                                               defaultChecked={data.sub_benefit === 1 ? 'checked' : ''}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"pri_dep[]"}
                                                               value={data.pri_dep}/>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={"row"}>
                                    <h4 className="fs-title">Claims Form</h4>
                                    <hr/>
                                </div>
                                <div className="row ml-0 justify-content-center">
                                    <table className={"table table-responsive mt-2"} id={"claims_form_tbl"}
                                    style={{maxHeight: "500px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th>Claim No</th>
                                            <th>Visit Date</th>
                                            <th>Doctor Signed</th>
                                            <th>Doctor Date</th>
                                            <th>Member Signed</th>
                                            <th>Date Admitted</th>
                                            <th>Date Discharged</th>
                                            <th>User Id</th>
                                            <th>Date Entered</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {generatedClaimNumbers.map((data) => {
                                            return(
                                                <tr>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"claim_form_claim_no[]"}
                                                               value={data.claim_no}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"claim_form_visit_date[]"}
                                                               value={data.visit_date}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"checkbox"}
                                                               name={"claim_form_doctor_sign[]"}
                                                               value={data.doctor_sign}
                                                               defaultChecked={data.doctor_sign === 1 ? "checked" : ""}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"claim_form_doctor_date[]"}
                                                               value={data.doctor_date}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"checkbox"}
                                                               name={"claim_form_claim_form_signed[]"}
                                                               value={data.claim_form_signed}
                                                               defaultChecked={data.claim_form_signed === 1 ? "checked" : ""}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"claim_form_date_admitted[]"}
                                                               value={data.date_admitted}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"claim_form_date_discharged[]"}
                                                               value={data.date_discharged}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"claim_form_user_id[]"}
                                                               value={data.user_id}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"date"}
                                                               name={"claim_form_date_entered[]"}
                                                               value={data.date_entered}/>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="row ml-0 justify-content-center mb-2">
                                    <Spinner/>
                                </div>
                                <div className="row ml-0 justify-content-center">
                                    <button type={"button"} className={"btn btn-sm btn-outline-warning col-md-1 mr-1 "}
                                            onClick={validateImportedData} disabled={disableValidateBtn}>
                                        Validate
                                    </button>
                                    <button type={"button"} className={"btn btn-sm btn-outline-primary col-md-2 mr-1"}
                                            onClick={generateClaimNo} disabled={disableGenerateBtn}>
                                        Generate Claims
                                    </button>
                                    <button type={"submit"} className={"btn btn-sm btn-outline-success col-md-1"}
                                            onClick={saveImportHospitalBills} disabled={disableBtn}>
                                        Save
                                    </button>
                                </div>
                                {/*<table className={"table table-responsive mt-2"} id={"errors_table"}>
                                    <thead>
                                    <tr>
                                        <th>Member No</th>
                                        <th>Health Plan</th>
                                        <th>Health Option</th>
                                        <th>Error</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {validatedData.map((data) => {
                                        return (
                                            <tr>
                                                <td><input className={"form-control"} type={"text"}
                                                           name={""} value={data.member_no}/></td>
                                                <td><input className={"form-control"} type={"text"}
                                                           name={""} value={data.health_plan}/></td>
                                                <td><input className={"form-control"} type={"text"}
                                                           name={""} value={data.option}/></td>
                                                <td><input className={"form-control"} type={"text"}
                                                           name={""} value={data.errors}/></td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>*/}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Modal5
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                header={<p id="headers">Import Hospital Cash Bills</p>}
                body={
                    <div>
                        <p>{message}</p>
                        <div classsName={"row justify-content-center"}>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                }/>
        </div>
    )
}
export default ImportHospitalBills;