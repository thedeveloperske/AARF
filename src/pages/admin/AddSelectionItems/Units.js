import React, {useState, useEffect} from "react";
import {getData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const Units = () => {
    const [units, setUnits] = useState([]);
    const [appendedUnit, setAppendedUnit] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        getData("fetch_units")
            .then((data) => {
                setUnits(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // append units
    const appendUnitRow = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input type="text" disabled/>
                    </td>
                    <td>
                        <input type="text" name="unit_added[]"
                               id={"unit_added"}
                               className={"form-control"}
                               onInput={toInputUpperCase}/>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removeUnit(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedUnit((appendedUnit) => {
            return [...appendedUnit, row];
        });
    };
    //remove units row
    const removeUnit = async (id, e) => {
        e.preventDefault();
        setAppendedUnit((appendedUnit) => {
            return appendedUnit.filter((row) => row.id !== id);
        });
    };
    //save unit
    const saveUnit = (e) => {
        e.preventDefault();
        //const unit_added[] = document.getElementById("unit_added").value;
        const errors_arr = [];
        //loop through table and check for null unit detail entries
        const tbl_length = document.getElementById('unit_tbl').rows.length;
        console.log(tbl_length)

        const tbl = document.querySelector("#unit_tbl tbody").children;
        for (let trs of tbl) {
            const unit_added = trs.children[1].children[0].value;
            if (!unit_added) {
                errors_arr.push('Notice ! Enter Unit Details')
            }
        }
        if (errors_arr.length > 0) {
            setMessage("Notice ! Enter Unit Details");
            setIsMessageModal(true);
        } else {
            const frmData = new FormData(document.getElementById("unit_form"));
            postData(frmData, "save_add_unit")
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
                    <p className="text-info h2">Units</p>
                    <hr/>
                </div>
                <div className="card col-md-12">
                    <button className="btn btn-success" onClick={appendUnitRow}>
                        Add
                    </button>
                    <form id="unit_form" onSubmit={saveUnit}>
                        <div className={"row justify-content-center"}>
                            <table className="table table-bordered"
                                   style={{maxHeight: "300px"}}
                                   id={"unit_tbl"}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Code</th>
                                    <th>Unit</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {units.map((dt) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="text" name="code[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.code} readOnly/>
                                            </td>
                                            <td>
                                                <input type="text" name="unit[]"
                                                       className={"form-control"}
                                                       style={{width: "400px"}}
                                                       defaultValue={dt.name}
                                                       onInput={toInputUpperCase}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {appendedUnit.map((data) => {
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

export default Units;
