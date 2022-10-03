import React, {useState, useEffect} from "react";
import {getData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const Plan = () => {
    const [plans, setPlans] = useState([]);
    const [appendedPlan, setAppendedPlan] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        getData("fetch_class_group_plans")
            .then((data) => {
                setPlans(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // append plan
    const appendPlanRow = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input type="text" disabled/>
                    </td>
                    <td>
                        <input type="text" name="class_group_desc_added[]"
                               id={"class_group_desc_added"}
                               className={"form-control"}
                               onInput={toInputUpperCase}/>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removePlan(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedPlan((appendedPlan) => {
            return [...appendedPlan, row];
        });
    };
    //remove plan row
    const removePlan = async (id, e) => {
        e.preventDefault();
        setAppendedPlan((appendedPlan) => {
            return appendedPlan.filter((row) => row.id !== id);
        });
    };
    //save plan
    const savePlan = (e) => {
        e.preventDefault();
        //const plan_added[] = document.getElementById("plan_added").value;
        const errors_arr = [];
        //loop through table and check for null plan detail entries
        const tbl_length = document.getElementById('plan_tbl').rows.length;
        console.log(tbl_length)

        const tbl = document.querySelector("#plan_tbl tbody").children;
        for (let trs of tbl) {
            const plan_added = trs.children[1].children[0].value;
            if (!plan_added) {
                errors_arr.push('Notice ! Enter Plan Details')
            }
        }
        if (errors_arr.length > 0) {
            setMessage("Notice ! Enter Plan Details");
            setIsMessageModal(true);
        } else {
            const frmData = new FormData(document.getElementById("plan_form"));
            postData(frmData, "save_add_class_group_plan")
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
                    <p className="text-info h2">Plans</p>
                    <hr/>
                </div>
                <div className="card col-md-12">
                    <button className="btn btn-success" onClick={appendPlanRow}>
                        Add
                    </button>
                    <form id="plan_form" onSubmit={savePlan}>
                        <div className={"row justify-content-center"}>
                            <table className="table table-bordered"
                                   style={{maxHeight: "300px"}}
                                   id={"plan_tbl"}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Class Group</th>
                                    <th>Class Group Description</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {plans.map((dt) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="text" name="class_group[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.class_group} readOnly/>
                                            </td>
                                            <td>
                                                <input type="text" name="class_group_desc[]"
                                                       className={"form-control"}
                                                       style={{width: "400px"}}
                                                       defaultValue={dt.class_group_desc}
                                                       onInput={toInputUpperCase}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {appendedPlan.map((data) => {
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

export default Plan;
