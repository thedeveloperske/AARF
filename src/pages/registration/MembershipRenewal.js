import {useState, useEffect} from "react";
import {getData, getOneData, postData} from "../../components/helpers/Data";
import XLSX from 'xlsx';
import CustomModal from "../../components/helpers/Modal";
import {Spinner} from "../../components/helpers/Spinner";
import CoverDates from "../../components/helpers/CoverDates";
import "../../css/main_css.css";
import Modal4 from "../../components/helpers/Modal4";
import Modal6 from "../../components/helpers/Modal6";
import Modal5 from "../../components/helpers/Modal5";

const MembershipRenewal = () => {
    const [corporates, setCorporates] = useState([]);
    const [individuals, setIndividuals] = useState([]);
    const [modalIsOpen, setModalState] = useState(false);
    const [importedData, setImportedData] = useState([]);
    const [validatedData, setValidatedData] = useState([]);
    const [validateErrors, setValidateErrors] = useState([]);
    const [individualData, setIndividualData] = useState([]);
    const [benefitsRowData, setNewBenefitsRowData] = useState([]);
    const [anniversaryRowData, setNewAnniversaryRowData] = useState([]);
    const [hidden, setHidden] = useState({
        corp_table: false, individual_table: true, import_table1: false, error_table2: true,
        corporate_dropdown: false, individual_dropdown: true
    });
    const [memberColumns, setMemberColumns] = useState([]);
    const [memberInfo, setMemberInfo] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [selectedCorporate, setSelectedCorporate] = useState([]);
    const [selectedIndividual, setSelectedIndividual] = useState([]);
    const [disabled, setDisabled] = useState({generateBtn: true});
    const [renewalAnnivs, setRenewalAnniv] = useState([]);
    const [renewalBenefits, setRenewalBenefits] = useState([]);
    const [message, setMessage] = useState([]);
    const [isModalFiveOpen, setModalFiveOpen] = useState(false);
    const [checkRenewalModal, setCheckRenewalModal] = useState(false);
    const [messageModal, setMessageModal] = useState(false);
    const [confirmRenewalModal, setConfirmRenewalModal] = useState(false);


    //fetching corporates
    useEffect(() => {
        getData('fetch_corporates').then((data) => {
            setCorporates(data);
        });
    }, []);
    //fetching individuals
    useEffect(() => {
        getData('fetch_individuals').then((data) => {
            setIndividuals(data);
        })
    }, []);
    const selectOption = () => {
        const option = document.getElementById('option').value;
        setSelectedOption(option)
        switch (option) {
            case '1':
                setMemberInfo([]);
                setHidden({
                    corp_table: false, individual_table: true, corporate_dropdown: false, individual_dropdown: true
                });
                break;
            case '2':
                setHidden({
                    corp_table: true, individual_table: false, corporate_dropdown: true, individual_dropdown: false
                });
                break
            default:
                setHidden({
                    corp_table: false, individual_table: true, corporate_dropdown: false, individual_dropdown: true
                })
                break;
        }
    }
    //import excel workbook
    const readExcel = (file) => {
        document.getElementById('individual_table').style.display = 'none';
        const promise = new Promise((resolve, reject) => {

            const fileReader = new FileReader();
            if (file) {
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;

                    const wb = XLSX.read(bufferArray, {type: "buffer"});

                    const wsname = wb.SheetNames[0];

                    //get column names and validate
                    const workbookHeaders = XLSX.read(bufferArray, {
                        sheetRows: 1,
                    });
                    const columns = XLSX.utils.sheet_to_json(
                        workbookHeaders.Sheets[wsname],
                        {header: 1}
                    )[0];
                    if ((
                        columns[0] === "member_no" &&
                        columns[1] === "category" &&
                        columns[2] === "option")
                    ) {
                        const ws = wb.Sheets[wsname];
                        const data = XLSX.utils.sheet_to_json(ws);

                        setMemberColumns(columns);
                        resolve(data);
                    } else {
                        resolve([]);
                    }
                };

                fileReader.onerror = (error) => {
                    reject(error);
                };
            } else {
                document.getElementById("spinner").style.display = "none";
            }

        });
        promise.then((dt) => {
            if (dt.length !== 0) {
                document.getElementById("spinner").style.display = "none";
                console.log(dt);
                setImportedData(dt);
                setModalState(true);
                setHidden({import_table1: false, error_table2: true, individual_table: true});
            } else {
                document.getElementById("spinner").style.display = "none";
                //alert("Notice ! Import Error..Check your import file against the template for consistency");
                setMessage("Notice ! Import Error... Check your import file against the template for consistency");
                setMessageModal(true)
            }
        });
    }
    const validateImportedData = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById('imported_data_form'));
        frmData.append('corp_id', document.getElementById('corporate_dropdown').value);
        postData(frmData, 'validate_imported_data').then((validated_data) => {
            console.log(validated_data);
            setValidatedData(validated_data.response);
            setValidateErrors(validated_data.errors);
            setMemberInfo(validated_data.member_info);
            if (selectedOption === '1') {
                setHidden({import_table1: true, error_table2: false, individual_table: true})
            } else if (selectedOption === '2') {
                setHidden({import_table1: true, error_table2: false, individual_table: false})
            }

        });
        //check if table has any rows
        const table = document.getElementById('validate_import_tbl');
        const rowCount = table.rows.length;
        if (rowCount < 2) {
            //alert('There should be atleast one row');
            setMessage("There should be atleast one row");
            setMessageModal(true)
        } else {
            setDisabled({generateBtn: false})
        }
    }
    //check if imported data has errors
    const checkErrors = (e) => {
        e.preventDefault();
        //errors array
        const errors = [];
        console.log(validateErrors.length);
        console.log(validateErrors);

        for (let i = 0; i < validateErrors.length; i++) {
            if (validateErrors[i] !== null) {
                errors.push('Please rectify the errors !');
            }
        }
        if (errors.length > 0) {
            //alert('Please rectify the errors !')
            setMessage("Please rectify the errors !");
            setMessageModal(true)
        } else {
            setModalState(false);
            // setTableData()
        }

    }
    const closeModal = () => {
        setImportedData([]);
        setValidatedData([]);
        setModalState(false);
    };
    const getCorporateData = () => {
        const option = document.getElementById('option').value;
        const corp_id = document.getElementById('corporate_dropdown').value;
        if (!option) {
            //alert('Enter Renewal Selection Option')
            setMessage("Enter Renewal Selection Option");
            setMessageModal(true)
        } else {
            setImportedData([]);
            setSelectedCorporate(corp_id);
            //display errors table
            setModalState(true);
            setHidden({import_table1: false, error_table2: true, individual_table: true, individual_dropdown: true})
        }
    }
    const getIndividualData = (e) => {
        e.preventDefault();
        setSelectedIndividual(e.target.value);
        const option = document.getElementById('option').value;
        if (!option) {
            //alert('Enter Renewal Selection Option')
            setMessage("Enter Renewal Selection Option");
            setMessageModal(true)
        } else {
            setHidden({
                corp_table: true,
                import_table1: false,
                error_table2: true,
                individual_table: false,
                corporate_dropdown: true
            })
            let individual_member_no = e.target.value;
            //start load spinner
            document.getElementById('spinner').style.display = 'block';
            //fetch individual family details
            getOneData('fetch_individual_data', individual_member_no).then((data) => {
                console.log(data);
                if (data) {
                    setDisabled({generateBtn: false})
                    setIndividualData(data);
                    //stop spinner
                    document.getElementById('spinner').style.display = 'none'
                } else if (data.length <= 0) {
                    setMessage('Notice ! No Records to Retrieve');
                    setModalFiveOpen(true);
                }

            }).catch((error) => console.log(error));
        }
    }
    //fetch benefits for the renewal for the new anniv
    const fetchRenewalBenefits = (e) => {
        e.preventDefault();
        setRenewalAnniv([]);
        setRenewalBenefits([]);
        document.getElementById('spinner').style.display = 'block';
        if (selectedOption === '1') {
            const tbl_row = document.getElementById('corp_table_renew_table').rows.length

            if (tbl_row < 2) {
                alert('No members in table. Import File')
            } else {
                const frmData = new FormData(document.getElementById('corp_table_renew_form'))
                frmData.append('corp_id', selectedCorporate)
                frmData.append('selected_option', selectedOption)
                postData(frmData, 'fetch_member_benefits_for_renewal').then((data) => {
                    console.log(data)
                    if (data) {
                        document.getElementById('spinner').style.display = 'none';
                        setRenewalAnniv(data.member_anniversary);
                        for(let i = 0; i < data.member_benefits.length; i++){
                            data.member_benefits[i].map((dt) => {
                                //console.log(dt)
                                //setRenewalBenefits([{...renewalBenefits, dt}]);
                                setRenewalBenefits((renewalBenefits)=> {
                                    return [...renewalBenefits, dt]
                                });
                            });
                        }
                        document.getElementById('spinner').style.display = 'none';
                    }
                }).catch((error) => {
                    console.log(error);
                    document.getElementById('spinner').style.display = 'none';
                })
            }
        } else if (selectedOption === '2') {
            console.log(selectedOption);
            const renewCheckbox = document.querySelectorAll(".renew");
            const frmData = new FormData(document.getElementById('individual_table_renew_form'))
            frmData.append('selected_option', selectedOption)
            frmData.append('principal_member_no', selectedIndividual)
            renewCheckbox.forEach((element) => {
                if (element.checked == true) {
                    frmData.append("renew[]", "1");
                } else {
                    frmData.append("renew[]", "0");
                }
            });
            postData(frmData, 'fetch_member_benefits_for_renewal').then((data) => {
                console.log(data)
                if (data) {

                    setRenewalAnniv(data.member_anniversary);
                    for(let i = 0; i < data.member_benefits.length; i++){
                        data.member_benefits[i].map((dt) => {
                            //console.log(dt)
                            //setRenewalBenefits([{...renewalBenefits, dt}]);
                            setRenewalBenefits((renewalBenefits)=> {
                                return [...renewalBenefits, dt]
                            });
                        });
                    }
                    document.getElementById('spinner').style.display = 'none';
                }
            }).catch((error) => {
                console.log(error);
                document.getElementById('spinner').style.display = 'none';
            })
        }
    }
    //save imported and validated benefits
    const saveRenewal = (e) => {
        e.preventDefault();
        const benefits_tbl_row = document.getElementById('benefits_table').rows.length
        const anniv_tbl_row = document.getElementById('anniv_table').rows.length
        console.log(anniv_tbl_row)
        if (benefits_tbl_row < 2 || anniv_tbl_row < 2) {
            alert('No Member Anniversary or Benefit Details for Renewal.Check Import File')
        } else {
            const frmData = new FormData(document.getElementById('renewal_submit_form'))
            const smartCheckbox = document.querySelectorAll(".smart_sync");
            const syncCheckbox = document.querySelectorAll(".sync");
            const fundCheckbox = document.querySelectorAll(".fund");
            const capitatedCheckbox = document.querySelectorAll(".capitated");
            const suspendedCheckbox = document.querySelectorAll(".suspended");
            smartCheckbox.forEach((element) => {
                if (element.checked == true) {
                    frmData.append("renew_smart_sync[]", "1");
                } else {
                    frmData.append("renew_smart_sync[]", "0");
                }
            });
            syncCheckbox.forEach((element) => {
                if (element.checked == true) {
                    frmData.append("renew_sync[]", "1");
                } else {
                    frmData.append("renew_sync[]", "0");
                }
            });
            fundCheckbox.forEach((element) => {
                if (element.checked == true) {
                    frmData.append("renew_benefit_fund[]", "1");
                } else {
                    frmData.append("renew_benefit_fund[]", "0");
                }
            });
            capitatedCheckbox.forEach((element) => {
                if (element.checked == true) {
                    frmData.append("renew_benefit_capitated[]", "1");
                } else {
                    frmData.append("renew_benefit_capitated[]", "0");
                }
            });
            suspendedCheckbox.forEach((element) => {
                if (element.checked == true) {
                    frmData.append("renew_benefit_suspended[]", "1");
                } else {
                    frmData.append("renew_benefit_suspended[]", "0");
                }
            });
            frmData.append('corp_id', selectedCorporate);
            frmData.append('user_id', localStorage.getItem("username"));
            document.getElementById('spinner').style.display = 'block';
            postData(frmData, 'save_imported_membership_renewal').then((data) => {
                console.log(data);
                if (data) {
                    document.getElementById('spinner').style.display = 'none';
                    setMessage(data);
                    setModalFiveOpen(true);
                } else {
                    document.getElementById('spinner').style.display = 'none';
                    setMessage(data);
                }
            }).catch((error) => {
                document.getElementById('spinner').style.display = 'none';
                console.log(error);
            })
        }
    }
    //check annivs - if corporate has been renwed to latest anniv
    const checkRenewal = (e) => {
        e.preventDefault();
        const option = document.getElementById('option').value;
        const corporate_dropdown = document.getElementById('corporate_dropdown').value;
        const individual_dropdown = document.getElementById('individual_dropdown').value;
        const frmData = new FormData(document.getElementById('input_form'));
        console.log(option);
        console.log(corporate_dropdown);
        console.log(individual_dropdown);
        if (!option || !corporate_dropdown && !individual_dropdown) {
            console.log('either one missing')
            setMessage("Enter Renewal Selection and Select Client")
            setMessageModal(true)
        } else {
            postData(frmData, 'check_annivs_for_renew_enmass').then((data) => {
                if (data.length > 0) {
                    console.log(data);
                    setMessage(data.message);
                    setMessageModal(true)
                } else if (data.length === 0) {
                    switch (option) {
                        case '1':
                            setMessage("Notice ! You are about to renew members of this corporate with the new corporate benefits !");
                            setConfirmRenewalModal(true)
                            break;
                        case '2':
                            setMessage("Notice ! You are about to renew members of this family with the new corporate benefits !");
                            setConfirmRenewalModal(true)
                            break;
                        default:
                            break;
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    }
    const RenewEnmass = (e) => {
        e.preventDefault();
        setConfirmRenewalModal(false);
        const frmData = new FormData(document.getElementById('input_form'));
        frmData.append("user", localStorage.getItem("username"));
        postData(frmData, 'renew_enmass').then((data) => {
            console.log(data);
            if (data) {
                setMessage(data.message);
                setModalFiveOpen(true);
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    //close response modal
    const closeModalFive = (e) => {
        e.preventDefault();
        setModalFiveOpen(false);
        //window.location.reload();
    }
    return (
        <div>
            <div className={"container col-md-12"}>
                <form id={"input_form"}>
                    <div className="row ml-0">
                        <div className={"col-md-4 "}>
                            <div className={"row ml-0"}>
                                <label htmlFor={"option"}
                                       className="col-form-label col-md-4 col-sm-2 label-align text-center  pr-0 pl-0">
                                    Renewal Selection
                                </label>
                                <div className={"col-md-8 pr-0 pl-0"}>
                                    <select className={"form-control"} id={"option"} name={"option"}
                                            onChange={selectOption}>
                                        <option value={""}>SELECT OPTION</option>
                                        <option value={"1"}>CORPORATES AND SMEs</option>
                                        <option value={"2"}>INDIVIDUAL</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 ">
                            <select className="form-control"
                                    id={"corporate_dropdown"} name={"corp_id"} hidden={hidden.corporate_dropdown}
                                    onChange={getCorporateData}>
                                <option value="" disabled selected>SELECT CORPORATE</option>
                                {corporates.map((corporate) => {
                                    const {CORP_ID, CORPORATE} = corporate;
                                    return (
                                        <option key={CORP_ID} value={CORP_ID}>
                                            {CORPORATE}
                                        </option>
                                    );
                                })}
                            </select>
                            <select className="form-control" id="individual_dropdown" name="member_no"
                                    hidden={hidden.individual_dropdown}
                                    onChange={getIndividualData}>
                                <option value={""}>SELECT INDIVIDUAL</option>
                                {individuals.map((individual) => {
                                    const {member_no, principal_names} = individual;
                                    return (
                                        <option key={member_no} value={member_no}>
                                            {principal_names + ' - ' + member_no}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className={"col-md-2"}>
                            <button className={"btn btn-outline-primary btn-block btn-sm"} onClick={checkRenewal}>
                                Renew En-mass
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <section className="project-tab" id={"querycorporatetable"}>
                <div className={"container"}>
                    <div className={"row"}>
                        <div className={"col-md-12"}>
                            <div className={"card"}>
                                <div className={"card-header"}>
                                    <nav>
                                        <div className="nav nav-tabs nav-fill col-md-4"
                                             id="nav-tab" role="tablist">
                                            <a className="nav-item nav-link active"
                                               id="nav-home-tab" data-toggle="tab" href="#nav-member" role="tab"
                                               aria-controls="nav-home" aria-selected="true" disabled selected>
                                                Member
                                            </a>
                                            <a className="nav-item nav-link"
                                               id="nav-home-tab" data-toggle="tab" href="#nav-benefits" role="tab"
                                               aria-controls="nav-home" aria-selected="true" disabled selected>
                                                Benefits
                                            </a>
                                        </div>
                                    </nav>
                                </div>
                                <div className={""}>
                                    <fieldset>
                                        <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade show active corporate-tab-content"
                                                 id="nav-member" role="tabpanel" aria-labelledby="nav-member-tab">
                                                <div id="step-1">
                                                    <div className="row">
                                                        <form id={"corp_table_renew_form"}>
                                                            <div hidden={hidden.corp_table} className={"table-responsive"}>
                                                                <table className={"table table-bordered"}
                                                                       id={"corp_table_renew_table"}
                                                                       style={{maxHeight: "300px"}}>
                                                                    <thead className={"thead-dark"}>
                                                                    <tr>
                                                                        <th>Family No</th>
                                                                        <th>Member No</th>
                                                                        <th>Member Names</th>
                                                                        <th>Relation</th>
                                                                        <th>Family Title</th>
                                                                        <th>Category</th>
                                                                        <th>Option</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {memberInfo.map((data) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           className={"form-control"}
                                                                                           name={"corp_family_no[]"}
                                                                                           value={data.family_no}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           className={"form-control"}
                                                                                           name={"member_no[]"}
                                                                                           value={data.member_no}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           className={"form-control"}
                                                                                           value={data.member_name}
                                                                                           style={{width: "200px"}}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           className={"form-control"}
                                                                                           value={data.relation_to_principal}
                                                                                           style={{width: "200px"}}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           className={"form-control"}
                                                                                           value={data.family_relation}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           className={"form-control"}
                                                                                           value={data.category}
                                                                                           name={"category[]"}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           className={"form-control"}
                                                                                           value={data.health_option}
                                                                                           style={{width: "200px"}}/>
                                                                                    <input type={"number"} hidden
                                                                                           className={"form-control"}
                                                                                           value={data.product_name}
                                                                                           name={"product_name[]"}
                                                                                           style={{width: "200px"}}/>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </form>
                                                        <form id={"individual_table_renew_form"}
                                                              className={"table-responsive"}>
                                                            <div hidden={hidden.individual_table}>
                                                                <table className={"table table-bordered"}
                                                                       id={"individual_table"}
                                                                       style={{maxHeight: "300px"}}>
                                                                    <thead className={"thead-dark"}>
                                                                    <tr>
                                                                        <th>Renew</th>
                                                                        <th>Family No</th>
                                                                        <th>Member No</th>
                                                                        <th>Member Names</th>
                                                                        <th>Relation</th>
                                                                        <th>Family Title</th>
                                                                        <th>Category</th>
                                                                        <th>Option</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {individualData.map((data) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>
                                                                                    <input type={"checkbox"}
                                                                                           className={"checkbox-inline renew"}
                                                                                           id={"renew_checkbox"}
                                                                                           defaultChecked={"checked"}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           name={"renew_family_no[]"}
                                                                                           className={"form-control"}
                                                                                           value={data.family_no}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           name={"member_no[]"}
                                                                                           className={"form-control"}
                                                                                           value={data.member_no}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           className={"form-control"}
                                                                                           value={data.full_name}
                                                                                           style={{width: "300px"}}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           name={"renew_relation[]"}
                                                                                           className={"form-control"}
                                                                                           value={data.relation}
                                                                                           style={{width: "200px"}}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           name={"renew_family_title"}
                                                                                           className={"form-control"}
                                                                                           value={data.family_title}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           name={"renew_category"}
                                                                                           className={"form-control"}
                                                                                           value={data.category}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"text"}
                                                                                           name={"renew_product_name"}
                                                                                           className={"form-control"}
                                                                                           value={data.product_name}
                                                                                           style={{width: "200px"}}/>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </form>
                                                        <div className={"row justify-content-center"}>
                                                            <button
                                                                className={"btn btn-outline-warning col-2"}
                                                                onClick={fetchRenewalBenefits}
                                                                disabled={disabled.generateBtn}>
                                                                Generate Benefits
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="nav-benefits"
                                                 role="tabpanel" aria-labelledby="nav-benefit-tab">
                                                <div id="step-1">
                                                    <form id={"renewal_submit_form"}>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <table
                                                                    className={"table table-responsive table-bordered"}
                                                                    id={"anniv_table"} style={{maxHeight: "300px"}}>
                                                                    <thead className={"thead-dark"}>
                                                                    <tr>
                                                                        <th>Member Names</th>
                                                                        <th>Member No</th>
                                                                        <th>Start Date</th>
                                                                        <th>End Date</th>
                                                                        <th>Renewal Date</th>
                                                                        <th>Anniv</th>
                                                                        <th>Health Plan</th>
                                                                        <th>Option</th>
                                                                        <th>Smart</th>
                                                                        <th>Sync'd</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {renewalAnnivs.map((data) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>
                                                                                    <input
                                                                                        className={"form-control"}
                                                                                        value={data.member_name}
                                                                                        style={{width: "300px"}}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className={"form-control"}
                                                                                        name={"renew_member_no[]"}
                                                                                        value={data.member_no}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className={"form-control"}
                                                                                        name={"renew_start_date[]"}
                                                                                        value={data.start_date}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className={"form-control"}
                                                                                        name={"renew_end_date[]"}
                                                                                        value={data.end_date}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className={"form-control"}
                                                                                        name={"renew_renewal_date[]"}
                                                                                        value={data.renewal_date}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input typ={"number"}
                                                                                           className={"form-control"}
                                                                                           name={"renew_anniv[]"}
                                                                                           value={data.anniv === null ? '' : data.anniv}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className={"form-control"}
                                                                                        name={"renew_health_plan[]"}
                                                                                        value={data.health_plan}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        className={"form-control"}
                                                                                        value={data.product_name}
                                                                                        style={{width: "200px"}}/>
                                                                                    <input hidden
                                                                                           name={"renew_product_name[]"}
                                                                                           value={data.h_option_code}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"checkbox"}
                                                                                           className={"form-control smart_sync"}
                                                                                           value={data.smart_sync === null ? '' : data.smart_sync}
                                                                                           defaultChecked={data.smart_sync === "1" ? "checked" : ""}/>
                                                                                </td>
                                                                                <td>
                                                                                    <input type={"checkbox"}
                                                                                           className={"form-control sync"}
                                                                                           value={data.sync === null ? '' : data.sync}
                                                                                           defaultChecked={data.sync === "1" ? "checked" : ""}/>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <table
                                                                    className={"table table-responsive table-bordered"}
                                                                    id={"benefits_table"}
                                                                    style={{maxHeight: "300px"}}>
                                                                    <thead className={"thead-dark"} style={{
                                                                        position: "sticky",
                                                                        top: "0",
                                                                        zIndex: "2"
                                                                    }}>
                                                                    <tr>
                                                                        <th>Member Names</th>
                                                                        <th>Member No</th>
                                                                        <th>Category</th>
                                                                        <th>Product Name</th>
                                                                        <th>Benefit</th>
                                                                        <th>Sub Limit Of</th>
                                                                       {/* <th>Prorate Days</th>*/}
                                                                        <th>Limit</th>
                                                                        <th>Sharing</th>
                                                                        <th>Anniv</th>
                                                                        <th>Fund</th>
                                                                        <th>Capitate</th>
                                                                        <th>Suspend</th>
                                                                       {/* <th>Suspend Date</th>*/}
                                                                        <th>Quantity</th>
                                                                        <th>Waiting Period</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {/*{console.log(renewalBenefits)}*/}
                                                                    {renewalBenefits.map((data) => {
                                                                            return(
                                                                                <tr key={data.id}>
                                                                                    <td>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               value={data.member_name === null ? '' : data.member_name}
                                                                                               style={{width: "300px"}}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_member_no[]"}
                                                                                               value={data.member_no === null ? '' : data.member_no}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_category[]"}
                                                                                               value={data.category === null ? '' : data.category}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               value={data.product_name === null ? '' : data.product_name}
                                                                                               style={{width: "200px"}}/>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_product_name[]"}
                                                                                               hidden
                                                                                               value={data.product_code === null ? '' : data.product_code}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               value={data.benefit === null ? '' : data.benefit}
                                                                                               style={{width: "400px"}}/>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_benefit[]"}
                                                                                               hidden
                                                                                               value={data.benefit_code === null ? '' : data.benefit_code}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               value={data.sub_limit_of === null ? '' : data.sub_limit_of}
                                                                                               style={{width: "400px"}}/>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_sub_limit_of[]"}
                                                                                               hidden
                                                                                               value={data.sub_limit_of_code === null ? '' : data.sub_limit_of_code}/>
                                                                                    </td>
                                                                                    {/*<td>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_prorata_days[]"}
                                                                                               value={data.prorata_days === null ? '' : data.prorata_days}/>
                                                                                    </td>*/}
                                                                                    <td>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_limit[]"}
                                                                                               value={data.limit === null ? '' : data.limit}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               value={data.sharing === null ? '' : data.sharing}/>
                                                                                        <input type={"text"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_sharing[]"}
                                                                                               hidden
                                                                                               value={data.sharing_code === null ? '' : data.sharing_code}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"number"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_anniv[]"}
                                                                                               value={data.anniv === null ? '' : data.anniv}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"checkbox"}
                                                                                               className={"form-control fund"}
                                                                                               value={data.fund === null ? '' : data.fund}
                                                                                               defaultChecked={data.fund === "1" ? "checked" : ""}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"checkbox"}
                                                                                               className={"form-control capitated"}
                                                                                               value={data.capitated === null ? '' : data.capitated}
                                                                                               defaultChecked={data.capitated === "1" ? "checked" : ""}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"checkbox"}
                                                                                               className={"form-control suspended"}
                                                                                               value={data.suspend_at === null ? '' : data.suspend_at}
                                                                                               defaultChecked={data.suspend_at !== null ? "checked" : ""}/>
                                                                                    </td>
                                                                                    {/*<td>
                                                                                        <input type={"date"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_suspended_date[]"}
                                                                                               value={data.suspended_date === null ? '' : data.suspended_date}/>
                                                                                    </td>*/}
                                                                                    <td>
                                                                                        <input type={"number"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_quantity[]"}
                                                                                               value={data.quantity === null ? '' : parseFloat(data.quantity).toLocaleString()}/>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type={"number"}
                                                                                               className={"form-control"}
                                                                                               name={"renew_benefit_waiting_period[]"}
                                                                                               value={data.waiting_period === null ? '' : parseFloat(data.waiting_period).toLocaleString()}/>
                                                                                    </td>
                                                                                </tr>
                                                                            )

                                                                    })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="row justify-content-center">
                                                            <button type={"button"}
                                                                    className={"btn btn-outline-success btn-sm"}
                                                                    onClick={saveRenewal}>
                                                                Save
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className={"row justify-content-center"}>
                                        <Spinner/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*import table modal section*/}
            <Modal6
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                style={{position: 'absolute !important', marginRight: '0% !important'}}
                body={
                    <div className={"row"}>
                        <div className="row col-md-4 col-sm-4 ">
                            <input type="file" className="form-control" name="import_preloaded_members"
                                   id="import_preloaded_members"
                                   placeholder="Choose File" aria-required="true" onChange={(e) => {
                                const file = e.target.files[0];
                                readExcel(file);
                            }}
                            />
                        </div>
                        <div className={"row ml-0 justify-content-center"}>
                            <form id={"imported_data_form"} onSubmit={validateImportedData}>
                                <div hidden={hidden.import_table1}>
                                    <table className={"table table-responsive mt-2"}
                                           id={"validate_import_tbl"}
                                           style={{maxHeight: "300px"}}>
                                        <thead className={"thead-dark"}>
                                        <tr>
                                            <th>Member No</th>
                                            <th>Health Plan</th>
                                            <th>Health Option</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {importedData.map((data) => {
                                            return (
                                                <tr key={data.id}>
                                                    <td><input className={"form-control"} type={"text"}
                                                               name={"member_no[]"}
                                                               value={data.member_no}/>
                                                    </td>
                                                    <td><input className={"form-control"} type={"text"}
                                                               name={"health_plan[]"}
                                                               value={data.category}/>
                                                    </td>
                                                    <td>
                                                        <input className={"form-control"} type={"text"}
                                                               name={"option[]"}
                                                               value={data.option}/>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                    <div className={"row justify-content-center"}>
                                        <button className={"col-md-1 btn btn-outline-danger btn-sm mr-2"}
                                                onClick={closeModal}>
                                            Close
                                        </button>
                                        <button type={"submit"} className={"col-md-1.5 btn btn-outline-primary btn-sm"}>
                                            Validate
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <form>
                                <div hidden={hidden.error_table2}>
                                    <table className={"table table-responsive mt-2"} id={"errors_table"}
                                           style={{maxHeight: "300px"}}>
                                        <thead className={"thead-dark"}>
                                        <tr>
                                            <th>Member No</th>
                                            <th>Health Plan</th>
                                            <th>Health Option</th>
                                            <th className={"pr-5 pl-5"}>Error</th>
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
                                                    <td><input className={"form-control text-danger"} type={"text"}
                                                               name={""} value={data.errors}
                                                               style={{width: "500px"}}/></td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                    <div className={"row justify-content-center"}>
                                        <button className={"col-md-1 btn btn-outline-danger btn-sm mr-2"}
                                                onClick={closeModal}>
                                            Close
                                        </button>
                                        <button className={"col-md-1 btn btn-outline-primary btn-sm mr-2"}
                                                onClick={checkErrors}>
                                            Check
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            />
            {/*notices modal*/}
            <Modal5
                modalIsOpen={messageModal}
                closeModal={closeModal}
                header={<p id="headers">Notice Message</p>}
                body={
                    <div className={"row justify-content-center"}>
                        <h5 className={"col-md-12 text-center"}>{message}</h5>
                        <div classsName={"row"}>
                            <button className={"btn btn-outline-danger btn-sm mt-3"}
                                    onClick={() => setMessageModal(false)}>Close
                            </button>
                        </div>
                    </div>
                }/>
            {/*backend response onclick refresh window*/}
            <Modal5
                modalIsOpen={isModalFiveOpen}
                closeModal={closeModal}
                header={<p id="headers">Membership Renewal</p>}
                body={
                    <div>
                        <div className={"row justify-content-center"}>
                            <h5 className={"col-md-12 text-center"}>{message}</h5>
                        </div>
                        <div className={"row justify-content-center"}>
                            <button className="btn btn-outline-danger"
                                    onClick={closeModalFive}>Close
                            </button>
                        </div>
                    </div>
                }/>
            {/*confirm renewal of client modal*/}
            <Modal4
                modalIsOpen={confirmRenewalModal}
                closeModal={closeModal}
                header={<p id="headers">Confirm Renewal</p>}
                body={
                    <div className={"row justify-content-center"}>
                        <h5 className={"col-md-12 text-center"}>{message}</h5>
                    </div>
                }
                buttons={
                    <div className="row">
                        <div className="col-md-6">
                            <button className="btn btn-success"
                                    onClick={RenewEnmass}>Yes
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-danger float-right"
                                    onClick={() => setConfirmRenewalModal(false)}>No
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    )
}

export default MembershipRenewal;