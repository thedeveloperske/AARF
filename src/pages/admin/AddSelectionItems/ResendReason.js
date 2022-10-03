import React, {useState, useEffect} from "react";
import {getData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const ResendReason = () => {
    const [resendReasons, setResendReasons] = useState([]);
    const [appendedResendReason, setAppendedResendReason] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        getData("fetch_resend_reasons")
            .then((data) => {
                setResendReasons(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // append resend reasons
    const appendResendReasonRow = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input type="text" disabled/>
                    </td>
                    <td>
                        <input type="text" name="resend_reason_added[]"
                               id={"resend_reason_added"}
                               className={"form-control"}
                               onInput={toInputUpperCase}/>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removeResendReason(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedResendReason((appendedResendReason) => {
            return [...appendedResendReason, row];
        });
    };
    //remove resend reason row
    const removeResendReason = async (id, e) => {
        e.preventDefault();
        setAppendedResendReason((appendedResendReason) => {
            return appendedResendReason.filter((row) => row.id !== id);
        });
    };
    //save resend reason
    const saveResendReason = (e) => {
        e.preventDefault();
        //const resend_reason_added[] = document.getElementById("resend_reason_added").value;
        const errors_arr = [];
        //loop through table and check for null resend_reason detail entries
        const tbl_length = document.getElementById('resend_reason_tbl').rows.length;
        console.log(tbl_length)

        const tbl = document.querySelector("#resend_reason_tbl tbody").children;
        for (let trs of tbl) {
            const resend_reason_added = trs.children[1].children[0].value;
            if (!resend_reason_added) {
                errors_arr.push('Notice ! Enter Resend Reason Details')
            }
        }
        if (errors_arr.length > 0) {
            setMessage("Notice ! Enter Resend Reason Details");
            setIsMessageModal(true);
        } else {
            const frmData = new FormData(document.getElementById("resend_reason_form"));
            postData(frmData, "save_add_resend_reason")
                .then((data) => {
                    console.log(data);
                    setResponse(data[0]);
                    setResponseModal(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };
    //close message modal
    const closeMessageModal = () => {
        setResponseModal(false);
        window.location.reload();
    };
    return (
        <div>
            <div className="container">
                <div className="container">
                    <p className="text-info h2">Resend Reasons</p>
                    <hr/>
                </div>
                <div className="card col-md-12">
                    <button className="btn btn-success" onClick={appendResendReasonRow}>
                        Add
                    </button>
                    <form id="resend_reason_form" onSubmit={saveResendReason}>
                        <div className={"row justify-content-center"}>
                            <table className="table table-bordered"
                                   style={{maxHeight: "300px"}}
                                   id={"resend_reason_tbl"}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Code</th>
                                    <th>Resend Reason</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {resendReasons.map((dt) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="text" name="code[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.code} readOnly/>
                                            </td>
                                            <td>
                                                <input type="text" name="resend_reason[]"
                                                       className={"form-control"}
                                                       style={{width: "400px"}}
                                                       defaultValue={dt.resend_reason}
                                                       onInput={toInputUpperCase}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {appendedResendReason.map((data) => {
                                    return <tr key={data.id}>{data.new}</tr>;
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div className={"row justify-content-center"}>
                            <Spinner/>
                        </div>
                        <div className={"row justify-content-center"}>
                            <button className="btn btn-primary col-md-1"
                                    type="submit">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/*Message modal*/}
            <Modal5
                modalIsOpen={messageModal}
                // background="#0047AB"
                body={
                    <div>
                        <div className={"row"}>
                            <p className="text-blue font-weight-bold h4">{message}</p>
                        </div>

                    </div>
                }
                buttons = {
                    <div className={"row"}>
                        <button className="btn btn-outline-danger btn-sm"
                                onClick={() => setIsMessageModal(false)}>
                            OK
                        </button>
                    </div>
                }
            />
            {/*Response modal*/}
            <MessageModal
                modalIsOpen={responseModal}
                closeModal={closeMessageModal}
                background="#0047AB"
                body={<p className="text-white font-weight-bold h4">{response}</p>}
            />
        </div>
    );
};

export default ResendReason;
