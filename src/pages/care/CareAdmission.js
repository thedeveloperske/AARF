import React from 'react'
import {useEffect, useState} from 'react';
import {getData, getOneData, postData} from "../../components/helpers/Data";
import {toInputUpperCase} from "../../components/helpers/toInputUpperCase";
import {Spinner} from "../../components/helpers/Spinner";
import Modal4 from "../../components/helpers/Modal4";
import Modal5 from "../../components/helpers/Modal5";

const CareAdmission = () => {
    const [providers, setProviders] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [preAuths, setPreAuths] = useState([]);
    const [preAuthDetails, setSelectedPreAuthDetails] = useState([]);
    const [isFirstModalOpen, setFirstModalOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState([]);
    const [disableSaveBtn, setDisableSaveBtn] = useState(false);

    useEffect(() => {
        getData('fetch_providers').then((data) => {
            setProviders(data);
        });
        getData('fetch_all_admitting_doctors').then((data) => {
            setDoctors(data);
        });
    }, [])
    const fetchMemberCareAdmissions = () => {
        const member_no = document.getElementById('member_no_value').value;

        getOneData('fetch_member_care_admissions', member_no).then((data) => {
            console.log(data);
            setFirstModalOpen(true);
            //start loader
            document.getElementById('spinner').style.display = 'block';
            setPreAuths(data.pre_auths);
            setDisableSaveBtn(false);
            //stop loader
            document.getElementById('spinner').style.display = 'none';
        })
    }
    //get selected member details
    const getRowData = (e) => {
        e.preventDefault();
        const arr = [];
        e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
            arr.push(element.textContent);
            //console.log(element.textContent);
        });
        //setIsModalOpen(false);
        getOneData("fetch_care_admission_details_by_code", arr[0]).then((data) => {
            console.log(data);
            setSelectedPreAuthDetails(data.response);
            setDisableSaveBtn(false);
        });
    }
    //save care admissions
    const saveCareAdmission = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById('care_admission_form'));
        postData(frmData, 'save_care_admission').then((data) => {
            console.log(data);
            if (data.message) {
                setMessage(data.message);
                setModalOpen(true)
                setDisableSaveBtn(true);
                //alert(data.message);
            }
            if (data.error) {
                alert('Save Failed');
            }
        })
    }
    //close modal
    const closeModal = () => {
        setFirstModalOpen(false);
    }
    return (
        <div>
            <section id="pay_provider" className="project-tab">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card">
                            <div className={"row"}>
                                <h4 className="fs-title">Care - Care Admission</h4>
                                <hr/>
                                <div className="col-md-12">
                                    <div className="row ml-0">
                                        <div className="form-group row m-0">
                                            <label htmlFor={"task"}
                                                   className="col-form-label col-sm-1 label-align pr-2 pl-0">Member
                                            </label>
                                        </div>
                                        <hr/>
                                        <div className="form-group row ml-5">
                                            <label htmlFor={"task"}
                                                   className="col-form-label col-sm-1 label-align pr-2 pl-0">Member No:
                                            </label>
                                            <div className="col-md-2">
                                                <input type={"text"} className={"form-control"}
                                                       id={"member_no_value"}
                                                       onInput={toInputUpperCase}/>
                                            </div>
                                            <div className={"col-md-1"}>
                                                <button className={"btn btn-outline-info btn-sm"}
                                                        onClick={fetchMemberCareAdmissions}>
                                                    Search
                                                </button>
                                            </div>
                                            <div className={"col-md-4"}>
                                                <input className={"form-control"}/>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                    {/*admissions table*/}
                                    <div className={"row"}>
                                        <div className="form-group row m-0">
                                            <label htmlFor={"task"}
                                                   className="col-form-label label-align pr-2 pl-0">
                                                Admission Authorisations
                                            </label>
                                        </div>
                                        <div className="form-group row m-0">
                                            <table className="table table-bordered table-sm"
                                                   id="pay_provider_claims_table" style={{maxHeight: "300px"}}>
                                                <thead className="thead-dark">
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Member Name</th>
                                                    <th>Provider</th>
                                                    <th>Date Reported</th>
                                                    <th>Reported By</th>
                                                    <th>Date Authorized</th>
                                                    <th>Authorized By</th>
                                                    <th>Action </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {preAuths.map((data) => {
                                                    return (
                                                        <tr>
                                                            <td>{data.code}</td>
                                                            <td>{data.member_names}</td>
                                                            <td>{data.provider}</td>
                                                            <td>{data.date_reported}</td>
                                                            <td>{data.reported_by}</td>
                                                            <td>{data.date_authorized}</td>
                                                            <td>{data.authorized_by}</td>
                                                            <td>
                                                                <button className="btn btn-outline-info btn-sm btn-block"
                                                                        onClick={getRowData}>
                                                                    Select
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <Spinner/>
                                    <hr/>
                                    {/*admissions form*/}
                                    <div className={"row"}>
                                        <div className="form-group row m-0">
                                            <label htmlFor={"task"}
                                                   className="col-form-label label-align pr-2 pl-0">
                                                Admission
                                            </label>
                                        </div>
                                        <div className={"row ml-0"}>
                                            <form id={"care_admission_form"} className={"col-md-12"}
                                                  onSubmit={saveCareAdmission}>
                                                <div className={"row"}>
                                                    <div className="col-md-12">
                                                        <div className="form-group row ml-0 ">
                                                            <label htmlFor="member_no"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Member
                                                                No:
                                                            </label>
                                                            <div className="col-md-2 col-sm-4">
                                                                <input type="text" className="form-control"
                                                                       name="member_no" id="member_no" 
                                                                       defaultValue={preAuthDetails.member_no}/>
                                                            </div>
                                                            <label htmlFor="authorisation_no"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Authorisation
                                                                No:
                                                            </label>
                                                            <div className="col-md-2 col-sm-4">
                                                                <input type="text" className="form-control"
                                                                       name="authorisation_no" id="authorisation_no"
                                                                       defaultValue={preAuthDetails.code} onInput={toInputUpperCase}/>
                                                            </div>
                                                            <label htmlFor="date_admitted"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Date
                                                                Admitted:
                                                            </label>
                                                            <div className="col-md-2 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       name="date_admitted" id="date_admitted"/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row ml-0 ">
                                                            <label htmlFor="provider"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">
                                                                Provider:
                                                            </label>
                                                            <div className={"col-md-10 pr-0 pl-0"}>
                                                                <select className={"form-control"} name={"provider"}
                                                                        id={"provider"}>
                                                                    <option value={preAuthDetails.provider_code}>{preAuthDetails.provider}</option>
                                                                    <option value={null}>Select Provider</option>
                                                                    {providers.map((data) => {
                                                                        return (
                                                                            <option
                                                                                value={data.CODE}>{data.PROVIDER}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row ml-0 ">
                                                            <label htmlFor="admitting_doc"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Admitting Doc:
                                                            </label>
                                                            <div className={"col-md-2 COL-SM-4 pr-0 pl-0"}>
                                                                <select className={"form-control"} name={"admitting_doc"}
                                                                        id={"admitting_doc"}>
                                                                    <option value={null}>Select Admitting Doctor</option>
                                                                    {doctors.map((data) => {
                                                                        return (
                                                                            <option value={data.CODE}>{data.DOCTOR}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                            </div>
                                                            <label htmlFor="admission_no"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Admission
                                                                No:
                                                            </label>
                                                            <div className="col-md-2 col-sm-4">
                                                                <input type="text" className="form-control"
                                                                       name="admission_no" id="admission_no"/>
                                                            </div>
                                                            <label htmlFor="date_discharged"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Date
                                                                Discharged:
                                                            </label>
                                                            <div className="col-md-2 col-sm-4">
                                                                <input type="date" className="form-control"
                                                                       name="date_discharged" id="date_discharged"/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row ml-0 ">
                                                            <label htmlFor="ward"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Ward:
                                                            </label>
                                                            <div className="col-md-2 col-sm-4">
                                                                <input type="text" className="form-control"
                                                                       name="ward" id="ward"
                                                                       onInput={toInputUpperCase}/>
                                                            </div>
                                                            <label htmlFor="room_no"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Room  No:
                                                            </label>
                                                            <div className="col-md-2 col-sm-4">
                                                                <input type="text" className="form-control"
                                                                       name="room_no" id="room_no"
                                                                       onInput={toInputUpperCase}/>
                                                            </div>
                                                            <label htmlFor="bed_no"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Bed No:
                                                            </label>
                                                            <div className="col-md-2 col-sm-4">
                                                                <input type="text" className="form-control"
                                                                       name="bed_no" id="bed_no"
                                                                       onInput={toInputUpperCase}/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row ml-0 ">
                                                            <label htmlFor="diagnosis"
                                                                   className="col-form-label col-sm-2 label-right pr-3 pl-0">Diagnosis:
                                                            </label>
                                                            <div className="col-md-10 col-sm-12">
                                                                <textarea type="text" className="form-control"
                                                                       name="diagnosis" id="diagnosis" onInput={toInputUpperCase}>
                                                                </textarea>
                                                            </div>
                                                        </div>
                                                        <div className="form-group row ml-0 justify-content-center mt-3">
                                                            <button type={"submit"} className={"btn btn-outline-success btn-sm col-md-1"}
                                                                    disabled={disableSaveBtn}>
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal4
                modalIsOpen={isFirstModalOpen}
                closeModal={closeModal}
                header={<p id="headers">Membership Authenticity</p>}
                body={
                    <div>
                        <p>Is this the correct member ?</p>
                    </div>
                }
                buttons={
                    <div className="row">
                        <div className="col-md-6">
                            <button className="btn btn-success"
                                    onClick={closeModal}>Yes
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-danger float-right"
                                    onClick={() => setFirstModalOpen(false)}>No
                            </button>
                        </div>
                    </div>
                }
            />
            <Modal5
                modalIsOpen={isModalOpen}
                closeModal={closeModal}
                header={<p id="headers">Care Admission</p>}
                body={
                    <div>
                        <div className={"row"}>
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
    )
}

export default CareAdmission
