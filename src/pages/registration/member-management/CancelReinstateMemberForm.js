import {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {getData, getTwoData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import CustomModal from "../../../components/helpers/Modal2";
import Modal2 from "../../../components/helpers/Modal2";
import "../../../css/index.css";
import {userGroups} from "../../../components/helpers/UserGroups";
import NotAuthorized from "../../../components/helpers/NotAuthorized";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const CancelReinstateMemberForm = (props) => {
    const history = useHistory();
    const [corporates, setCorporates] = useState([]);
    const [cancellation_reason, setCancellationReason] = useState([]);
    const [fetchedData, setFetchedData] = useState([]);
    const [status, setFetchedStatus] = useState([]);
    const [modalIsOpen, setModalState] = useState(false);
    const [message, setMessage] = useState([]);
    const [notice, setNoticeMessage] = useState(false);
    const [input_value, setInputValue] = useState([]);
    const [messageModal, setMessageModal] = useState(false);

    //fetch corporates
    useEffect(() => {
        getData("fetch_corporates").then((data) => {
            setCorporates(data);
        });
    }, []);
    //fetch cancellation reasons
    useEffect(() => {
        getData("fetch_cancellation_reasons").then((data) => {
            setCancellationReason(data);
        });
    }, []);
    //switch between reinstate and cancel
    useEffect(() => {
        switch (props.module) {
            case "cancel":
                setFetchedData([]);
                setFetchedStatus([]);
                /**/
                break;
            case "reinstate":
                setFetchedData([]);
                setFetchedStatus([]);
                break;
            default:
                break;
        }
    }, []);
    //select among corporate, member number and family number
    const selectOption = () => {
        if (document.getElementById("corporate_rd").checked) {
            setFetchedData([]);
            setFetchedStatus([]);
            setInputValue([]);
            //document.getElementById('select_corporate').value = '';
            document.getElementById("member_no").value = "";
            document.getElementById("family_no").value = "";
            document.getElementById("select_corporate").disabled = false;
            document.getElementById("member_no").disabled = true;
            document.getElementById("family_no").disabled = true;
            document.getElementById("corporate_table_div").style.display = "block";
            document.getElementById("member_table_div").style.display = "none";
        } else if (document.getElementById("member_no_rd").checked) {
            setFetchedData([]);
            setFetchedStatus([]);
            setInputValue([]);
            document.getElementById("select_corporate").value = "";
            //document.getElementById('member_no').value = '';
            document.getElementById("family_no").value = "";
            document.getElementById("select_corporate").disabled = true;
            document.getElementById("member_no").disabled = false;
            document.getElementById("family_no").disabled = true;
            document.getElementById("corporate_table_div").style.display = "none";
            document.getElementById("member_table_div").style.display = "block";
        } else if (document.getElementById("family_no_rd").checked) {
            setFetchedData([]);
            setFetchedStatus([]);
            setInputValue([]);
            document.getElementById("select_corporate").value = "";
            document.getElementById("member_no").value = "";
            //document.getElementById('family_no').value = '';
            document.getElementById("select_corporate").disabled = true;
            document.getElementById("member_no").disabled = true;
            document.getElementById("family_no").disabled = false;
            document.getElementById("corporate_table_div").style.display = "none";
            document.getElementById("member_table_div").style.display = "block";
        }
        ;

    };
    //fetch data
    const fetchData = (e) => {
        e.preventDefault();
        const selected_radio_val = document.querySelector(
            'input[name = "selected_radio"]:checked'
        ).value;
        if (document.getElementById("corporate_rd").checked) {
            var input_value = document.getElementById("select_corporate").value;
            setInputValue(input_value);
        } else if (document.getElementById("member_no_rd").checked) {
            var input_value = document.getElementById("member_no").value;
            setInputValue(input_value);
        } else if (document.getElementById("family_no_rd").checked) {
            var input_value = document.getElementById("family_no").value;
            setInputValue(input_value);
        }
        console.log(selected_radio_val);
        console.log(input_value);
        if (!selected_radio_val || !input_value) {
            //alert("Select option and enter value !");
            setNoticeMessage('Notice ! Select option and enter value.');
            setMessageModal(true);
        } else {
            document.getElementById("spinner").style.display = "block";
            //fetch data to display
            getTwoData("fetch_cancel_member_data", selected_radio_val, input_value)
                .then((data) => {
                    console.log(data);
                    if (data.length > 0) {
                        document.getElementById("spinner").style.display = "none";
                        setFetchedData(data);
                        setFetchedStatus(data[0].cancelled);
                    } else if (data.length <= 0) {
                        document.getElementById("spinner").style.display = "none";
                        setNoticeMessage('Client Does Not Exist');
                        setMessageModal(true);
                    }
                })
                .catch((error) => console.log(error));
        }
    };
    //save cancel -reinstate member
    const saveCancelReinstateMember = (e) => {
        e.preventDefault();
        // if (userGroups().includes("1") || userGroups().includes("9")) {
            const reason_value = document.getElementById("reason_value").value;
            if (!reason_value) {
                //alert("Notice", "Please select a reason");
                setNoticeMessage('Notice ! Please Select Cancellation Reason.');
                setMessageModal(true);
            }
            else {
                var table_row_count = parseInt(
                    document.getElementById("member_table").rows.length - 1
                );
                var member_count = parseInt(document.getElementById("member_no_tb"));

                const selected_radio_val = document.querySelector(
                    'input[name = "selected_radio"]:checked'
                ).value;

                const formData = new FormData(
                    document.getElementById("cancel_reinstate_form")
                );
                formData.append("module", props.module);
                formData.append("table_row_count", table_row_count);
                formData.append("selected_radio", selected_radio_val);
                formData.append("user", localStorage.getItem("username"));
                console.log(status);
                switch (props.module) {
                    case "cancel":
                        if (status === "1") {
                            //alert("Notice ! Client is cancelled ");
                            setNoticeMessage('Notice ! Client is Already Cancelled')
                            setMessageModal(true);
                        } else {
                            //start loader
                            document.getElementById("spinner").style.display = "block";
                            postData(formData, "save_cancel_reinstate").then((data) => {
                                console.log(data);
                                document.getElementById("spinner").style.display = "none";
                                //alert('Client Save Ok');
                                setMessage(data.message);
                                setModalState(true);

                            }).catch((error) => {
                                console.log(error);
                                document.getElementById('spinner').style.display = "none";
                                //alert('Client Save Fail');
                                //setMessage('Client Save Fail');
                                setMessage(error.message);
                                setModalState(true);
                            });
                        }
                        break;
                    case "reinstate":
                        if (status === "0" || status === null) {
                            //alert("Notice ! Client is active");
                            setNoticeMessage('Notice ! Client is Active')
                            setMessageModal(true);
                        } else {
                            //start loader
                            document.getElementById("spinner").style.display = "block";
                            postData(formData, "save_cancel_reinstate").then((data) => {
                                console.log(data);
                                document.getElementById("spinner").style.display = "none";
                                //alert('Client Save Ok');

                                setMessage(data.message);
                                setModalState(true);

                            }).catch((error) => {
                                console.log(error);
                                document.getElementById('spinner').style.display = "none";
                                //alert('Client Save Fail');
                                //setMessage('Client Save Fail');
                                setMessage(error.message);
                                setModalState(true);
                            });
                        }

                        break;
                    default:
                        break;
                }
            }
        // } else {
        //     history.push("/not-authorized");
        // }
    };
    const closeModal = () => {
        setModalState(false);
        window.location.reload();
    };
    return (
        <div>
            <div className="container" style={{position: "relative"}}>
                <form
                    className="claims_form"
                    id={"cancel_reinstate_form"}
                    onSubmit={saveCancelReinstateMember}
                >
                    <fieldset>
                        <h4 className="fs-title">{props.header}</h4>
                        <hr/>
                        <div className="row">
                            <div className="col-md-5 col-sm-12" style={{border: "1px blue"}}>
                                {/*Search box*/}
                                <div className="">
                                    <form>
                                        <div className="card-header">
                                            <div className="">
                                                <h6 style={{color: "#69AA46"}}>
                                                    Select a Corporate or Member to Search{" "}
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="form-group row">
                                                <div className="col-md-2 pr-0 pl-0">
                                                    <label
                                                        htmlFor={"corporate_rd"}
                                                        className="col-form-label label-align"
                                                    >
                                                        Corporate:
                                                    </label>
                                                </div>
                                                <div className={"col-md-1 pr-0 pl-0 pt-2"}>
                                                    <input
                                                        type="radio"
                                                        name={"selected_radio"}
                                                        className="form-control pb-2"
                                                        id="corporate_rd"
                                                        value="1"
                                                        onChange={selectOption}
                                                    />
                                                </div>
                                                <div className="col-md-8 offset-0.5">
                                                    <select
                                                        className="form-control"
                                                        id="select_corporate"
                                                        name={"corporate_id"}
                                                        disabled={true}
                                                    >
                                                        <option value="" disabled selected>
                                                            Select Corporate
                                                        </option>
                                                        {corporates.map((corporate) => {
                                                            return (
                                                                <option
                                                                    key={corporate.CORP_ID}
                                                                    value={corporate.CORP_ID}
                                                                >
                                                                    {corporate.CORPORATE}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-md-2">
                                                    <label
                                                        htmlFor={"member_no_rd"}
                                                        className="col-form-label label-align"
                                                    >
                                                        Member No:
                                                    </label>
                                                </div>
                                                <div className={"col-md-1 pr-0 pl-0 pt-2"}>
                                                    <input
                                                        type={"radio"}
                                                        name={"selected_radio"}
                                                        className={"form-control pb-2"}
                                                        id={"member_no_rd"}
                                                        value={"2"}
                                                        onChange={selectOption}
                                                    />
                                                </div>
                                                <div className="col-md-8">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="member_no"
                                                        name={"member_no"}
                                                        placeholder="Enter Member No."
                                                        disabled={true}
                                                        onInput={toInputUpperCase}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-md-2">
                                                    <label
                                                        htmlFor={"family_no_rd"}
                                                        className="col-form-label label-align"
                                                    >
                                                        Family No:
                                                    </label>
                                                </div>
                                                <div className={"col-md-1 pr-0 pl-0 pt-2"}>
                                                    <input
                                                        type={"radio"}
                                                        name={"selected_radio"}
                                                        className={"form-control pb-2"}
                                                        id={"family_no_rd"}
                                                        value={"3"}
                                                        onChange={selectOption}
                                                    />
                                                </div>
                                                <div className="col-md-8">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="family_no"
                                                        name={"family_no"}
                                                        placeholder="Enter Family No."
                                                        disabled={true}
                                                        onInput={toInputUpperCase}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-md-3">
                                                    <label
                                                        htmlFor={"user_id"}
                                                        className="col-form-label label-align"
                                                    >
                                                        User ID:
                                                    </label>
                                                </div>
                                                <div className="col-md-8">
                                                    {/*Select class dropdown field*/}
                                                    <input
                                                        type="text"
                                                        className="form-control text-uppercase"
                                                        name="user"
                                                        id="user"
                                                        value={localStorage.getItem("username")}
                                                        placeholder="User"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <a
                                                    className="btn btn-outline-primary btn-block btn-sm col-md-2"
                                                    onClick={fetchData}
                                                >
                                                    Search
                                                </a>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-7 col-sm-12 pr-0">
                                {/*Search results card*/}
                                <div className="" id="search_results">
                                    <div className="card-header">
                                        <div className="">
                                            <h6 style={{color: "#69AA46"}}>Search Results</h6>
                                        </div>
                                    </div>

                                    <div className="card-body pr-0 pl-0">

                                        {/*Corporate */}
                                        <div className={"row"} id={"corporate_table_div"}>
                                            <div className={"table table-responsive"}>
                                                <table
                                                    className="table table-bordered table-responsive table-sm"
                                                    id="member_info_table"
                                                    style={{maxWidth: "100% !important", maxHeight: "180px"}}
                                                >
                                                    <thead className={"thead-dark"}>
                                                    <tr className="cancel_table_th">
                                                        <th>CORP ID</th>
                                                        <th className={"pr-5 pl-5"}>CORPORATE</th>
                                                        <th>ANNIV</th>
                                                        <th>STATUS</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {fetchedData.map((data) => {
                                                        //const cancelled = data.cancelled == '0' ? 'ACTIVE' : data.cancelled == '1' ? 'CANCELLED' : '';
                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <input
                                                                        className={"form-control text-center"}
                                                                        id={"corp_id"}
                                                                        type={"number"}
                                                                        name={"corp_id"}
                                                                        value={data.corp_id}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className={"form-control"}
                                                                        id={"corporate_name"}
                                                                        type={"text"}
                                                                        name={"corporate_name"}
                                                                        value={data.corporate}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className={"form-control text-center"}
                                                                        id={"corp_anniv"}
                                                                        type={"number"}
                                                                        name={"corp_anniv"}
                                                                        value={data.anniv}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className={"form-control text-center"}
                                                                        id={"cancelled"}
                                                                        type={"text"}
                                                                        name={"cancelled"}
                                                                        value={
                                                                            data.cancelled === "1" ? "CANCELLED"
                                                                                : data.cancelled === "0" ? "ACTIVE"
                                                                                : data.cancelled === null ? "ACTIVE"
                                                                                    : "ACTIVE"
                                                                        }
                                                                        readOnly
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {/*Member and Family No*/}
                                        <div className={"row"} id={"member_table_div"} style={{display: "none"}}>
                                            <div className={"table table-responsive"}>
                                                <table
                                                    className="table table-bordered table-sm"
                                                    id="member_table"
                                                    style={{maxHeight: "180px"}}
                                                >
                                                    <thead className={"thead-dark"}>
                                                    <tr className="cancel_table_th">
                                                        <th className={"pr-5 pl-5"}>NAME</th>
                                                        <th className={"pr-0"}>FAMILY NO</th>
                                                        <th className={"pr-2 pl-2"}>MEMBER NO</th>
                                                        <th className={"pr-2 pl-2"}>RELATION</th>
                                                        <th className={"pr-0"}>CORP ID</th>
                                                        <th className={"pr-5 pl-5"}>CORPORATE</th>
                                                        <th className={"pr-0"}>STATUS</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {fetchedData.map((data) => {
                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <input
                                                                        className={"form-control"}
                                                                        id={"full_name"}
                                                                        type={"text"}
                                                                        value={data.full_name}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className={"form-control"}
                                                                        id={"family_no"}
                                                                        type={"text"}
                                                                        name={"family_no[]"}
                                                                        value={data.family_no}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className={"form-control"}
                                                                        id={"member_no_tb"}
                                                                        type={"text"}
                                                                        name={"member_no[]"}
                                                                        value={data.member_no}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className={"form-control"}
                                                                        id={"relation_tb"}
                                                                        type={"text"}
                                                                        name={"relation[]"}
                                                                        value={data.relation}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className={"form-control text-center"}
                                                                        id={"corp_id_tb"}
                                                                        type={"text"}
                                                                        name={"corp_id"}
                                                                        value={data.corp_id}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className={"form-control"}
                                                                        id={"corporate_tb"}
                                                                        type={"text"}
                                                                        name={"corporate"}
                                                                        value={data.corporate}
                                                                        readOnly
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        className={"form-control"}
                                                                        id={"cancelled"}
                                                                        type={"text"}
                                                                        name={"cancelled[]"}
                                                                        value={
                                                                            data.cancelled === "1" ? "CANCELLED"
                                                                                : data.cancelled === "0" ? "ACTIVE"
                                                                                : data.cancelled === null ? "ACTIVE"
                                                                                    : ""
                                                                        }
                                                                        readOnly
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"row col-md-12 mt-5"}>
                                        <label
                                            htmlFor={"reason"}
                                            className="col-md-2 pr-0 pl-0 col-form-label label-align"
                                            id={"reason"}
                                        >
                                            {props.reason}
                                        </label>
                                        <div className={"col-md-4"}>
                                            <select
                                                className={"form-control"}
                                                name={"reason"}
                                                id={"reason_value"}
                                            >
                                                <option disabled selected>
                                                </option>
                                                {cancellation_reason.map((reason) => {
                                                    return (
                                                        <option key={reason.CODE} value={reason.CODE}>
                                                            {reason.CANCEL_REASON}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <label
                                            htmlFor={"date"}
                                            className="col-md-2 pr-0 pl-4 col-form-label label-align"
                                            id={"date"}
                                        >
                                            {props.date}
                                        </label>
                                        <div className={"col-md-4 pr-0 pl-0"}>
                                            <input
                                                className={"form-control"}
                                                type={"date"} name={"date"}
                                                id={"date"} maxLength={"4"} max={"9999-12-31"}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={"row justify-content-center mt-3"}>
                                        <div className={"col-md-2"}>
                                            <button
                                                className="btn btn-outline-danger btn-sm btn-block"
                                                id={"action_button"}
                                                type={"submit"}
                                            >
                                                {props.action_button}
                                            </button>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            {/*Selected Member Card*/}
                            {/*Date box--}}*/}
                        </div>
                        <div className={"row justify-content-center"}>
                            <Spinner/>
                        </div>
                    </fieldset>
                </form>
            </div>
            <Modal5
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                header={<p id="headers">Notice Message</p>}
                body={
                    <div className={"row justify-content-center"}>
                        <h5 className={"col-md-12 text-center"}>{message}</h5>
                        <div classsName={"row"}>
                            <button className={"btn btn-outline-danger btn-sm mt-3"}
                                    onClick={closeModal}>Close
                            </button>
                        </div>
                    </div>
                }
            />
            <Modal5
                modalIsOpen={messageModal}
                closeModal={closeModal}
                header={<p id="headers">Notice Message</p>}
                body={
                    <div className={"row justify-content-center"}>
                        <h5 className={"col-md-12 text-center"}>{notice}</h5>
                        <div classsName={"row"}>
                            <button className={"btn btn-outline-danger btn-sm mt-3"}
                                    onClick={() => setMessageModal(false)}>Close
                            </button>
                        </div>
                    </div>
                }/>
        </div>
    );
}
export default CancelReinstateMemberForm;
