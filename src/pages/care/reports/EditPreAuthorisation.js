import React from "react";
import {useEffect, useState} from 'react';
import {getData, getOneData, getTwoData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const EditPreAuthorisation = () => {
    const [providers, setProviders] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [wards, setWards] = useState([]);
    const [co_signee, setCoSignees] = useState([]);
    const [preAuths, setPreAuths] = useState([]);
    const [disableSaveBtn, setDisableActionBtn] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [cancelPreAuthModal, setCancelPreAuthModalOpen] = useState(false);
    const [message, setMessage] = useState(false);
    const [preAuthCode, setPreAuthCode] = useState([]);


    useEffect(() => {
        getData('fetch_providers').then((data) => {
            setProviders(data);
        });
        getData('fetch_benefits').then((data) => {
            setBenefits(data);
        });
        getData('fetch_ward').then((data) => {
            setWards(data);
        });
        getData('fetch_all_usernames').then((data) => {
            setCoSignees(data);
        });
    }, [])
    const fetchPreAuths = () => {
        const date_from = document.getElementById('date_from').value;
        const date_to = document.getElementById('date_to').value;
        //start loader
        document.getElementById('spinner').style.display = 'block';
        getTwoData('fetch_pre_auths_to_edit', date_from, date_to).then((data) => {
            console.log(data);
            if (data.response.length === 0) {
                alert('No Previous PreAuthorizations');
                setPreAuths([]);
                setDisableActionBtn(false);
                //stop loader
                document.getElementById('spinner').style.display = 'none';
            } else {
                setPreAuths(data.response);
                setDisableActionBtn(false);
                //stop loader
                document.getElementById('spinner').style.display = 'none';
            }
        })
    }

    //get selected pre_auth fro cancellation - release resere amount
    const getRowData = (e) => {
        e.preventDefault();
        const arr = [];
        e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
            arr.push(element.children[0].value);
        });
        setCancelPreAuthModalOpen(true);
        console.log(arr[0]);
        setPreAuthCode(arr[0])

    }
    //open cancel preauth modal
    const cancelPreAuth = () => {
        setCancelPreAuthModalOpen(false);
        document.getElementById('spinner').style.display = 'block';
        getOneData('cancel_pre_auth_to_release_reserve', preAuthCode).then((data) => {
            console.log(data);
            if (data.message) {
                const message = <p style={{color: "green", fontSize: "20px"}}>{data.message}</p>
                setMessage(message);
                setModalOpen(true)
                document.getElementById('spinner').style.display = 'none';
            }
            if (data.error) {
                const errors = <p style={{color: "red", fontSize: "20px"}}>Cancellation Failed ! Contact the IT Admin</p>;
                setMessage(errors);
                setModalOpen(true);
                document.getElementById('spinner').style.display = 'none';
            }
        })
    }
    const savePreAuthEdit = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById('edit_pre_auth_form'));
        postData(frmData, 'save_pre_auth_edit').then((data) => {
            console.log(data);
            if (data.message) {
                const message = <p style={{color: "green", fontSize: "20px"}}>{data.message}</p>
                setMessage(message);
                setModalOpen(true)
                setDisableActionBtn(true);
                //alert(data.message);
            }
            if (data.error) {
                const errors = <p style={{color: "red", fontSize: "20px"}}>Save Failed ! Contact the IT Admin</p>;
                setMessage(errors);
                setModalOpen(true)
            }
        })
    }
    //close modal
    const closeModal = () => {
        setModalOpen(false);
    }
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Care Reports - Edit PreAuthorization</h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0">
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
                                <input type={"date"} className={"form-control"}
                                       id={"date_from"} maxLength={"4"} max={"9999-12-31"}/>
                            </div>
                            <label htmlFor={"date_to"}
                                   className="col-form-label col-md-0.5 label-right pr-3 pl-5">To:
                            </label>
                            <div className={"col-md-2"}>
                                <input type={"date"} className={"form-control"}
                                       id={"date_to"} maxLength={"4"} max={"9999-12-31"}/>
                            </div>
                            <div className={"col-md-1"}>
                                <button className={"btn btn-outline-info btn-sm"}
                                        onClick={fetchPreAuths}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section id="pay_provider" className="project-tab">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <form id={"edit_pre_auth_form"} onSubmit={savePreAuthEdit}>
                                <div className={"row"}>
                                    <table className="table table-bordered table-sm"
                                           id="pay_provider_claims_table" style={{maxHeight: "500px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th className={"pr-2 pl-2"}>Code</th>
                                            <th className={"pr-2 pl-2"}>Member No</th>
                                            <th className={"pr-3 pl-3"}>Member Name</th>
                                            <th className={"pr-5 pl-5"}>Provider</th>
                                            <th className={"pr-0 pl-0"}>Date Reported</th>
                                            <th className={"pr-0 pl-0"}>Date Authorized</th>
                                            <th className={"pr-3 pl-3"}>Pre Diagnosis</th>
                                            <th className={"pr-4 pl-4"}>Corporate</th>
                                            <th className={"pr-5 pl-5"}>Authority Type</th>
                                            <th className={"pr-5 pl-5"}>Ward</th>
                                            <th className={"pr-0 pl-0"}>Available Limit</th>
                                            <th className={"pr-0 pl-0"}>Admit Days</th>
                                            <th className={"pr-3 pl-3"}>Reserve</th>
                                            <th className={"pr-5 pl-5"}>Pre Authorization Notes</th>
                                            <th className={"pr-4 pl-4"}>Co Signee</th>
                                            <th className={"pr-0 pl-0"}>Admission Date</th>
                                            <th className={"pr-0 pl-0"}>Discharge Date</th>
                                            <th className={"pr-3 pl-3"}>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {preAuths.map((data) => {
                                            return (
                                                <tr>
                                                    <td><input type="text" className="form-control" name='code[]' value={data.code === null ? '' : data.code}/></td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"member_no[]"}
                                                               defaultValue={data.member_no === null ? '' : data.member_no}/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"} readOnly
                                                               defaultValue={data.member_names === null ? '' : data.member_names}/>
                                                    </td>
                                                    <td>
                                                        <select className={"form-control"} name={"provider[]"}
                                                                id={"provider"}>
                                                            <option value={data.provider_code}>{data.provider}</option>
                                                            <option value={null}>Change Provider</option>
                                                            {providers.map((data) => {
                                                                return (
                                                                    <option
                                                                        value={data.CODE}>{data.PROVIDER}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input type={"date"} className={"form-control"}
                                                               name={"date_reported[]"}
                                                               defaultValue={data.date_reported === null ? '' : data.date_reported}/>
                                                    </td>
                                                    <td>
                                                        <input type={"date"} className={"form-control"}
                                                               name={"date_authorized[]"}
                                                               defaultValue={data.date_authorized === null ? '' : data.date_authorized}/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"pre_diagnosis[]"}
                                                               defaultValue={data.pre_diagnosis === null ? '' : data.pre_diagnosis}
                                                               onInput={toInputUpperCase}/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control"}
                                                               value={data.corporate === null ? '' : data.corporate}
                                                               readOnly/>
                                                        <input type={"text"} className={"form-control"}
                                                               name={"corp_id[]"} hidden
                                                               value={data.corp_id === null ? '' : data.corp_id}/>
                                                    </td>
                                                    <td>
                                                        <select className={"form-control"} name={"authority_type[]"}
                                                                id={"authority_type"}>
                                                            <option value={data.authority_type}>{data.benefit}</option>
                                                            <option value={null}>Select Authority Type</option>
                                                            {benefits.map((data) => {
                                                                return (
                                                                    <option
                                                                        value={data.CODE}>{data.BENEFIT}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select className={"form-control"} name={"ward[]"}
                                                                id={"ward"}>
                                                            <option value={data.ward_code}>{data.ward}</option>
                                                            <option value={null}>Change Ward</option>
                                                            {wards.map((data) => {
                                                                return (
                                                                    <option
                                                                        value={data.code}>{data.ward}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control text-right"}
                                                               name={"available_limit[]"}
                                                               defaultValue={data.available_limit === null ? '' : data.available_limit}/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control text-center"}
                                                               name={"admit_days[]"}
                                                               defaultValue={data.admit_days === null ? '' : data.admit_days}/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control text-right"}
                                                               name={"reserve[]"}
                                                               defaultValue={data.reserve === null ? '' : data.reserve}/>
                                                    </td>
                                                    <td>
                                                        <input type={"text"} className={"form-control text-left"}
                                                               name={"notes[]"}
                                                               defaultValue={data.notes === null ? '' : data.notes}
                                                               onInput={toInputUpperCase}/>
                                                    </td>
                                                    <td>
                                                        <select className={"form-control"} name={"co_signee[]"}
                                                                id={"co_signee"}>
                                                            <option value={data.co_signee}>{data.co_signee}</option>
                                                            <option value={null}>Select Co-Signee</option>
                                                            {co_signee.map((data) => {
                                                                return (
                                                                    <option
                                                                        value={data.user_name}>{data.user_name}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input type={"date"} className={"form-control"}
                                                               name={"admission_date[]"}
                                                               defaultValue={data.admission_date === null ? '' : data.admission_date}/>
                                                    </td>
                                                    <td>
                                                        <input type={"date"} className={"form-control"}
                                                               name={"discharge_date[]"}
                                                               defaultValue={data.discharge_date === null ? '' : data.discharge_date}/>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-outline-danger btn-sm btn-block"
                                                                onClick={getRowData}>
                                                            Cancel PreAuth
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={"row"}>
                                    <Spinner/>
                                </div>
                                <div className={"row mt-3 justify-content-center"}>
                                    <button type={"submit"} className={"btn btn-outline-success btn-sm col-md-1"}
                                            disabled={disableSaveBtn}>Save
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
                header={<p id="headers">Care Misc Reports - Edit PreAuthorization</p>}
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
            <Modal5
                modalIsOpen={cancelPreAuthModal}
                closeModal={closeModal}
                header={<p id="headers">Care Misc Reports - Cancel PreAuthorization</p>}
                body={
                    <div>
                        <div className={"row justify-content-center"}>
                            <p>Cancel this Admission Authorisation ? </p>
                        </div>
                        <div className={"row justify-content-center"}>
                            <p>The PreAuth will be cancelled <br/> and the reserved ammount will be released...<br/>
                                Sure to Continue ? </p>
                        </div>
                    </div>
                }
                buttons={
                    <div className="row">
                        <div className="col-md-6">
                            <button className="btn btn-success" onClick={cancelPreAuth}>Yes
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-danger float-right"
                                    onClick={() => setCancelPreAuthModalOpen(false)}>No
                            </button>
                        </div>
                    </div>
                }/>
        </div>
    )
}
export default EditPreAuthorisation;