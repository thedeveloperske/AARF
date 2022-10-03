import React, {useState, useEffect} from 'react';
import {Spinner} from "../../../components/helpers/Spinner";
import Modal5 from "../../../components/helpers/Modal5";
import {getData, getOneData, postData} from "../../../components/helpers/Data";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";

const Utilization = () => {
    const [corporates, setCorporates] = useState([]);
    const [address, setAddress] = useState([]);
    const [option_val, setOption] = useState([]);
    const [selectedCorp, setSelectedCorp] = useState([]);

    const [annivs, setAnnivs] = useState([]);
    const [familyAnnivs, setFamilyAnniv] = useState([]);
    const [memberAnnivs, setMemberAnniv] = useState([]);
    const [memberDetails, setMemberDetails] = useState([]);


    const [hidden, setHidden] = useState({
        corporate: false, family_no: true, member_no: true, family_no_value: true, member_no_value: true,
        corp_anniv: false, family_anniv: true, member_anniv: true
    });

    useEffect(() => {
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0]);
        });
        getData("fetch_corporates").then((data) => {
            setCorporates(data);
        });
    }, []);
    //fetch corp annivs
    useEffect(() => {
        if (selectedCorp != 0) {
            getOneData("fetch_corp_annivs", selectedCorp).then((data) => {
                setAnnivs(data);
            });
        }
    }, [selectedCorp]);

    const selectedOption = () => {
        const option = document.getElementById('option').value;
        setOption(option);
        setAnnivs([]);
        setFamilyAnniv([]);
        setMemberAnniv([]);
        setMemberDetails([]);
        switch (option) {
            case '1':
                setHidden({
                    corporate: false, family_no: true, member_no: true, family_no_value: true, member_no_value: true,
                    corp_anniv: false, family_anniv: true, member_anniv: true
                })
                document.getElementById('family_no').value = null;
                document.getElementById('family_no_value').value = null;
                document.getElementById('member_no').value = null;
                document.getElementById('member_no_value').value = null;
                break;
            case '2':
                setHidden({
                    corporate: true, family_no: false, member_no: true, family_no_value: true, member_no_value: true,
                    corp_anniv: true, family_anniv: false, member_anniv: true
                })
                document.getElementById('corporate').value = null;
                document.getElementById('family_no_value').value = null;
                document.getElementById('member_no').value = null;
                document.getElementById('member_no_value').value = null;
                break;
            case '3':
                setHidden({
                    corporate: true, family_no: true, member_no: false, family_no_value: true, member_no_value: true,
                    corp_anniv: true, family_anniv: true, member_anniv: false
                })
                document.getElementById('corporate').value = null;
                document.getElementById('family_no_value').value = null;
                document.getElementById('family_no').value = null;
                document.getElementById('member_no_value').value = null;
                break;
            case '4':
                setHidden({
                    corporate: true, family_no: true, member_no: true, family_no_value: true, member_no_value: true,
                    corp_anniv: true, family_anniv: true, member_anniv: true
                })
                document.getElementById('corporate').value = null;
                document.getElementById('family_no').value = null;
                document.getElementById('family_no_value').value = null;
                document.getElementById('member_no').value = null;
                document.getElementById('member_no_value').value = null;
                document.getElementById('anniv').value = null;
                break;
            default:
                setHidden({
                    corporate: false, family_no: true, member_no: true, family_no_value: true, member_no_value: true,
                    corp_anniv: false, family_anniv: true, member_anniv: true
                })
                break;

        }
    }
    //fetch  family annivs
    const fetchFamilyAnnivs = (e) => {
        const family_no = document.getElementById('family_no').value;
        const member_no = family_no +'-00';
        console.log('Hi Family')
        if (e.key === 'Enter') {
            getOneData('fetch_family_annivs', family_no).then((data) => {
                console.log(data);
                if (data.length <= 0) {
                    setFamilyAnniv([]);
                    alert('Enter a Valid Family No and Press Enter');
                } else {
                    setFamilyAnniv(data);
                }
            }).catch((error) => {
                console.log(error);
            });
            getOneData('fetch_member_details', member_no).then((data) => {
                console.log(data);
                if (data.length <= 0){
                    alert('Enter a Valid Member No and Press Enter');
                    setMemberDetails([]);
                }else {
                    setMemberDetails(data[0]);
                    setHidden({corporate: true, family_no: false, member_no: true, family_no_value: false, member_no_value: true,
                        corp_anniv: true, family_anniv: false, member_anniv: true
                    });
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }
    //fetch member annivs
    const fetchMemberAnnivs = (e) => {
        const member_no = document.getElementById('member_no').value;
        if (e.key === 'Enter') {
            getOneData('fetch_annivs_for_member', member_no).then((data) => {
                console.log(data);
                if (data.length <= 0) {
                    setMemberAnniv([]);
                    alert('Enter a Valid Member No and Press Enter');
                } else {
                    setMemberAnniv(data);
                }
            }).catch((error) => {
                console.log(error);
            });
            getOneData('fetch_member_details', member_no).then((data) => {
                console.log(data);
                if (data.length <= 0){
                    alert('Enter a Valid Member No and Press Enter');
                    setMemberDetails([]);
                    setHidden({corporate: true, family_no: true, member_no: false, family_no_value: true,
                        member_no_value: true, corp_anniv: true, family_anniv: true, member_anniv: false
                    });
                }else {
                    setMemberDetails(data[0]);
                    setHidden({corporate: true, family_no: true, member_no: false, family_no_value: true,
                        member_no_value: false, corp_anniv: true, family_anniv: true, member_anniv: false});
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }
    //fetch report
    const fetchUtilizationReport = (e) => {
        e.preventDefault();
        const formData = new FormData(document.getElementById('input_form'))
        postData(formData, 'fetch_utilization_report').then((data) => {
            console.log(data);
        })
    }
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Bills Reports - Utilization</h4>
                <hr/>
                <div className="col-md-12">
                    <form id={"input_form"}>
                        <div className="row ml-0">
                            <div className="form-group row">
                                <label htmlFor={"select_task"}
                                       className="col-form-label col-md-0.5 label-right pr-3 pl-3">Select:
                                </label>
                                <div className={"col-md-2"}>
                                    <select className={"form-control"} id={"option"} name={"option"}
                                            onChange={selectedOption}>
                                        <option value={null}>Select Option</option>
                                        <option value={1}>Corporate</option>
                                        <option value={2}>Family</option>
                                        <option value={3}>Member</option>
                                        <option value={4}>All Corporates</option>
                                    </select>
                                </div>
                                <div className={"col-md-5"}>
                                    <select className={"form-control"} id={"corporate"}
                                            name={"corporate"} hidden={hidden.corporate}
                                            onChange={(e) => setSelectedCorp(e.target.value)}>
                                        <option value={null}>Select Corporate</option>
                                        {corporates.map((data) => {
                                            return (
                                                <option value={data.CORP_ID}>{data.CORPORATE}</option>
                                            )
                                        })}
                                    </select>
                                    {/*Family No*/}
                                    <div className={"row"}>
                                        <input type={"text"} className={"form-control col-md-4 mr-0 ml-0 pr-1"}
                                               name={"family_no"} id={"family_no"} hidden={hidden.family_no}
                                               onInput={toInputUpperCase}
                                               onKeyPress={fetchFamilyAnnivs}/>
                                        <input type={"text"} className={"form-control col-md-8 mr-0 ml-0"}
                                               id={"family_no_value"} hidden={hidden.family_no_value}
                                               value={memberDetails.principal_name + ' OF ' + memberDetails.corporate}/>
                                    </div>
                                    {/*Member No*/}
                                    <div className={"row"}>
                                        <input type={"text"} className={"form-control col-md-4 mr-0 ml-0 pr-1"}
                                               name={"member_no"} id={"member_no"} hidden={hidden.member_no}
                                               onInput={toInputUpperCase}
                                               onKeyPress={fetchMemberAnnivs}/>
                                        <input type={"text"} className={"form-control col-md-8 mr-0 ml-0"} id={"member_no_value"}
                                               hidden={hidden.member_no_value}
                                               value={memberDetails.member_name + ' OF ' + memberDetails.corporate}/>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <select className="form-control" defaultValue="0" name="anniv" id={"anniv"}
                                            hidden={hidden.corp_anniv}
                                            onChange={() => setHidden({
                                                ...hidden, submit: false,
                                            })}>
                                        <option disabled value="0">
                                            Select Corporate Anniv
                                        </option>
                                        {annivs.map((dt) => {
                                            return <option value={dt.anniv}>{dt.anniv}</option>;
                                        })}
                                    </select>
                                    <select className="form-control" defaultValue="0" name="family_anniv"
                                            id={"family_anniv"} hidden={hidden.family_anniv}
                                            onChange={() => setHidden({
                                                ...hidden, submit: false,
                                            })}>
                                        <option disabled value="0">
                                            Select Family Anniv
                                        </option>
                                        {familyAnnivs.map((dt) => {
                                            return <option value={dt.anniv}>{dt.anniv}</option>;
                                        })}
                                    </select>
                                    <select className="form-control" defaultValue="0" name="member_anniv"
                                            id={"member_anniv"} hidden={hidden.member_anniv}
                                            onChange={() => setHidden({
                                                ...hidden, submit: false,
                                            })}>
                                        <option disabled value="0">
                                            Select Member Anniv
                                        </option>
                                        {memberAnnivs.map((dt) => {
                                            return <option value={dt.anniv}>{dt.anniv}</option>;
                                        })}
                                    </select>
                                </div>
                                <div className={"col-md-1"}>
                                    <button type={"button"} className={"btn btn-outline-info btn-sm"}
                                            onClick={fetchUtilizationReport}>
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
                        <div className="card mt-0" id={""}>
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
                            <form id={"valid_list_report"}>
                                <div className={"row mt-4"}>
                                    <div>
                                        {/*<div>{title}</div>*/}
                                    </div>
                                    <div className={"col-md-4 float-right ml-auto"}>
                                        {/*{period}*/}
                                    </div>
                                </div>
                                <div className={"row justify-content-center"} id={"card"}>
                                    {/*table 1 -- Corporates, Members, Corporate Premium Recorded opt 1, 2, 5 */}
                                    <div id={"opt1_tbl"} className={"table table-responsive"}>
                                        <table className="table table-bordered table-sm"
                                               id="utilization_report_opt1_tbl" style={{maxHeight: "320px"}}>
                                            <thead className="thead-dark">
                                            <tr>
                                                <th className={"pr-2 pl-2"}>Principal</th>
                                                <th className={"pr-2 pl-2"}>Member No</th>
                                                <th className={"pr-3 pl-3"}>Member Names</th>
                                                <th className={"pr-5 pl-5"}>Benefit</th>
                                                <th className={"pr-5 pl-5"}>Limit</th>
                                                <th className={"pr-5 pl-5"}>Sharing</th>
                                                <th className={"pr-5 pl-5"}>Expenditure</th>
                                                <th className={"pr-5 pl-5"}>Balance</th>
                                                <th className={"pr-5 pl-5"}>Percent</th>
                                                <th className={"pr-5 pl-5"}>Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Utilization;
