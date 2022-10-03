import React, {useState, useEffect} from "react";
import {getData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const Benefit = () => {
    const [benefits, setBenefits] = useState([]);
    const [appendedBenefit, setAppendedBenefit] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        getData("fetch_benefits")
            .then((data) => {
                setBenefits(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // append benefit
    const appendBenefitRow = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input type="text" disabled/>
                    </td>
                    <td>
                        <input type="text" name="benefit_added[]"
                               id={"benefit_added"}
                               className={"form-control"}
                               onInput={toInputUpperCase}/>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removeBenefit(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedBenefit((appendedBenefit) => {
            return [...appendedBenefit, row];
        });
    };
    //remove benefit row
    const removeBenefit = async (id, e) => {
        e.preventDefault();
        setAppendedBenefit((appendedBenefit) => {
            return appendedBenefit.filter((row) => row.id !== id);
        });
    };
    //save benefit
    const saveBenefit = (e) => {
        e.preventDefault();
        //const benefit_added[] = document.getElementById("benefit_added").value;
        const errors_arr = [];
        //loop through table and check for null benefit detail entries
        const tbl_length = document.getElementById('benefit_tbl').rows.length;
        console.log(tbl_length)

        const tbl = document.querySelector("#benefit_tbl tbody").children;
        for (let trs of tbl) {
            const benefit_added = trs.children[1].children[0].value;
            if (!benefit_added) {
                errors_arr.push('Notice ! Enter Benefit Details')
            }
        }
        if (errors_arr.length > 0) {
            setMessage("Notice ! Enter Benefit Details");
            setIsMessageModal(true);
        } else {
            const frmData = new FormData(document.getElementById("benefit_form"));
            postData(frmData, "save_add_benefit")
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
                    <p className="text-info h2">Benefits</p>
                    <hr/>
                </div>
                <div className="card col-md-12">
                    <button className="btn btn-success" onClick={appendBenefitRow}>
                        Add
                    </button>
                    <form id="benefit_form" onSubmit={saveBenefit}>
                        <div className={"row justify-content-center"}>
                            <table className="table table-bordered"
                                   style={{maxHeight: "300px"}}
                                   id={"benefit_tbl"}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Code</th>
                                    <th>Benefit</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {benefits.map((dt) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="text" name="code[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.CODE} readOnly/>
                                            </td>
                                            <td>
                                                <input type="text" name="benefit[]"
                                                       className={"form-control"}
                                                       style={{width: "400px"}}
                                                       defaultValue={dt.BENEFIT}
                                                       onInput={toInputUpperCase}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {appendedBenefit.map((data) => {
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

export default Benefit;
