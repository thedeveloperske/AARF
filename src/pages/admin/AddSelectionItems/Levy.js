import React, {useState, useEffect} from "react";
import {getData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const Levy = () => {
    const [levies, setLevies] = useState([]);
    const [appendedLevy, setAppendedLevy] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        getData("fetch_levies")
            .then((data) => {
                setLevies(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // append levy
    const appendLevyRow = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input type="text" disabled/>
                    </td>
                    <td>
                        <input type="number" name="rate_added[]"
                               id={"rate_added"}
                               className={"form-control text-center"}/>
                    </td>
                    <td>
                        <input type="text" name="levy_added[]"
                               id={"levy_added"}
                               className={"form-control"}
                               onInput={toInputUpperCase}/>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removeLevy(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedLevy((appendedLevy) => {
            return [...appendedLevy, row];
        });
    };
    //remove levy row
    const removeLevy = async (id, e) => {
        e.preventDefault();
        setAppendedLevy((appendedLevy) => {
            return appendedLevy.filter((row) => row.id !== id);
        });
    };
    //save levies
    const saveLevy = (e) => {
        e.preventDefault();
        //const levy_added[] = document.getElementById("levy_added").value;
        const errors_arr = [];
        //loop through table and check for null levy detail entries
        const tbl_length = document.getElementById('levy_tbl').rows.length;
        console.log(tbl_length)

        const tbl = document.querySelector("#levy_tbl tbody").children;
        for (let trs of tbl) {
            const levy_added = trs.children[1].children[0].value;
            if (!levy_added) {
                errors_arr.push('Notice ! Enter Levy Details')
            }
        }
        if (errors_arr.length > 0) {
            setMessage("Notice ! Enter Levy Details");
            setIsMessageModal(true);
        } else {
            const frmData = new FormData(document.getElementById("levy_form"));
            postData(frmData, "save_add_levy")
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
                    <p className="text-info h2">Levies</p>
                    <hr/>
                </div>
                <div className="card col-md-12">
                    <button className="btn btn-success" onClick={appendLevyRow}>
                        Add
                    </button>
                    <form id="levy_form" onSubmit={saveLevy}>
                        <div className={"row justify-content-center"}>
                            <table className="table table-bordered"
                                   style={{maxHeight: "300px"}}
                                   id={"levy_tbl"}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Code</th>
                                    <th>Rate</th>
                                    <th>Levy</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {levies.map((dt) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="text" name="code[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.code} readOnly/>
                                            </td>
                                            <td>
                                                <input type="number" name="rate[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.rate}/>
                                            </td>
                                            <td>
                                                <input type="text" name="levy[]"
                                                       className={"form-control"}
                                                       style={{width: "400px"}}
                                                       defaultValue={dt.levy}
                                                       onInput={toInputUpperCase}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {appendedLevy.map((data) => {
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

export default Levy;
