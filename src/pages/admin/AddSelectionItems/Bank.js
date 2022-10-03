import React, {useState, useEffect} from "react";
import {getData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const Bank = () => {
    const [banks, setBanks] = useState([]);
    const [appendedBank, setAppendedBank] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        getData("fetch_banks")
            .then((data) => {
                setBanks(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // append bank
    const appendBankRow = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input type="text" disabled/>
                    </td>
                    <td>
                        <input type="text" name="bank_added[]"
                               id={"bank_added"}
                               className={"form-control"}
                               onInput={toInputUpperCase}/>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removeBank(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedBank((appendedBank) => {
            return [...appendedBank, row];
        });
    };
    //remove bank row
    const removeBank = async (id, e) => {
        e.preventDefault();
        setAppendedBank((appendedBank) => {
            return appendedBank.filter((row) => row.id !== id);
        });
    };
    //save bank
    const saveBank = (e) => {
        e.preventDefault();
        //const bank_added[] = document.getElementById("bank_added").value;
        const errors_arr = [];
        //loop through table and check for null bank detail entries
        const tbl_length = document.getElementById('bank_tbl').rows.length;
        console.log(tbl_length)

        const tbl = document.querySelector("#bank_tbl tbody").children;
        for (let trs of tbl) {
            const bank_added = trs.children[1].children[0].value;
            if (!bank_added) {
                errors_arr.push('Notice ! Enter Bank Details')
            }
        }
        if (errors_arr.length > 0) {
            setMessage("Notice ! Enter Bank Details");
            setIsMessageModal(true);
        } else {
            const frmData = new FormData(document.getElementById("bank_form"));
            postData(frmData, "save_add_bank")
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
                    <p className="text-info h2">Banks</p>
                    <hr/>
                </div>
                <div className="card col-md-12">
                    <button className="btn btn-success" onClick={appendBankRow}>
                        Add
                    </button>
                    <form id="bank_form" onSubmit={saveBank}>
                        <div className={"row justify-content-center"}>
                            <table className="table table-bordered"
                                   style={{maxHeight: "300px"}}
                                   id={"bank_tbl"}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Code</th>
                                    <th>Bank</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {banks.map((dt) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="text" name="code[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.CODE} readOnly/>
                                            </td>
                                            <td>
                                                <input type="text" name="bank[]"
                                                       className={"form-control"}
                                                       style={{width: "400px"}}
                                                       defaultValue={dt.BANK}
                                                       onInput={toInputUpperCase}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {appendedBank.map((data) => {
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

export default Bank;
