import React, {useState, useEffect} from "react";
import {getData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const RejectionReason = () => {
    const [rejectionReasons, setRejectionReasons] = useState([]);
    const [appendedRejectionReason, setAppendedRejectionReason] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        getData("fetch_rejection_reasons")
            .then((data) => {
                setRejectionReasons(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // append rejection reasons
    const appendRejectionReasonRow = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input type="text" disabled/>
                    </td>
                    <td>
                        <input type="text" name="rejection_reason_added[]"
                               id={"reject_reason_added"}
                               className={"form-control"}
                               onInput={toInputUpperCase}/>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removeRejectionReason(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedRejectionReason((appendedRejectionReason) => {
            return [...appendedRejectionReason, row];
        });
    };
    //remove rejection reason row
    const removeRejectionReason = async (id, e) => {
        e.preventDefault();
        setAppendedRejectionReason((appendedRejectionReason) => {
            return appendedRejectionReason.filter((row) => row.id !== id);
        });
    };
    //save rejection reason
    const saveRejectionReason = (e) => {
        e.preventDefault();
        //const rejection_reason_added[] = document.getElementById("rejection_reason_added").value;
        const errors_arr = [];
        //loop through table and check for null rejection_reason detail entries
        const tbl_length = document.getElementById('rejection_reason_tbl').rows.length;
        console.log(tbl_length)

        const tbl = document.querySelector("#rejection_reason_tbl tbody").children;
        for (let trs of tbl) {
            const rejection_reason_added = trs.children[1].children[0].value;
            if (!rejection_reason_added) {
                errors_arr.push('Notice ! Enter Rejection Reason Details')
            }
        }
        if (errors_arr.length > 0) {
            setMessage("Notice ! Enter Rejection Reason Details");
            setIsMessageModal(true);
        } else {
            const frmData = new FormData(document.getElementById("rejection_reason_form"));
            postData(frmData, "save_add_rejection_reason")
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
                    <p className="text-info h2">Rejection Reasons</p>
                    <hr/>
                </div>
                <div className="card col-md-12">
                    <button className="btn btn-success" onClick={appendRejectionReasonRow}>
                        Add
                    </button>
                    <form id="rejection_reason_form" onSubmit={saveRejectionReason}>
                        <div className={"row justify-content-center"}>
                            <table className="table table-bordered"
                                   style={{maxHeight: "300px"}}
                                   id={"rejection_reason_tbl"}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Code</th>
                                    <th>Rejection Reason</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rejectionReasons.map((dt) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="text" name="code[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.CODE} readOnly/>
                                            </td>
                                            <td>
                                                <input type="text" name="rejection_reason[]"
                                                       className={"form-control"}
                                                       style={{width: "400px"}}
                                                       defaultValue={dt.REJECT_REASON}
                                                       onInput={toInputUpperCase}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {appendedRejectionReason.map((data) => {
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

export default RejectionReason;
