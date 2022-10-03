import React from 'react'
import {useEffect, useState} from 'react';
import {getData, getOneData, postData} from "../../../components/helpers/Data";
import Modal5 from "../../../components/helpers/Modal5";
import {Spinner} from "../../../components/helpers/Spinner";

const EnterDeductions = () => {
    const [selectedTask, setSelectedTask] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState([]);
    const [agents, setAgents] = useState([]);
    const [deductionTypes, setAgentDeductionTypes] = useState([]);
    const [appendedDeductions, setAppendedDeductions] = useState([]);
    const [message, setMessage] = useState([]);
    const [isModalOneOpen, setModalOneOpen] = useState(false);
    const [receipts, setFetchedReceipts] = useState([]);
    const [deductions, setFetchedDeductions] = useState([]);

    useEffect(() => {
        getData('fetch_agents').then((data) => {
            setAgents(data);
        });
        getData('fetch_agent_deduction_types').then((data) => {
            setAgentDeductionTypes(data);
        });
        //fetch deduction types
    }, []);
    const selectTask = () => {
        const task =  document.getElementById('task').value;
        setSelectedTask(task);
        console.log(task);
        switch (task){
            case 'add':
                setFetchedReceipts([]);
                setFetchedDeductions([]);
                document.getElementById('add_deductions_btn').style.display = 'block';
                break;
            case 'query':
                setFetchedReceipts([]);
                setFetchedDeductions([]);
                document.getElementById('add_deductions_btn').style.display = 'none';
                break;
            default:
                break;
        }

    }
    const fetchAgentReceipts = () => {
        document.getElementById('spinner').style.display = 'block';
        const agent_id = document.getElementById('select_agent').value;
        console.log(selectedTask);
        if (selectedTask === 'Select Task') {
            alert('Select Task');
        } else {
            switch (selectedTask) {
                case 'add':
                    setFetchedDeductions([]);
                    setFetchedReceipts([]);
                    getOneData('fetch_agent_receipts', agent_id).then((data) => {
                        console.log(data);
                        setFetchedReceipts(data);
                        document.getElementById('spinner').style.display = 'none';
                    });
                    break;
                case 'query':
                    setFetchedDeductions([]);
                    setFetchedReceipts([]);
                    getOneData('fetch_agent_deductions', agent_id).then((data) => {
                        console.log(data);
                        const fetchedDeductions = data.map((dt) => {
                            return (
                                <tr>
                                    <td>
                                        <input className={"form-control text-center"} value={dt.idx}
                                               name={"idx[]"}/>
                                    </td>
                                    <td>
                                        <select className={"form-control"} name={"deduction_type[]"}
                                                value={dt.deduction_type}>
                                            <option value={dt.deduction_type_code}>
                                                {dt.ded_reason}
                                            </option>
                                            <option>Select Deduction Type</option>
                                            {deductionTypes.map((data) => {
                                                return (
                                                    <option value={data.code}>{data.ded_reason}</option>
                                                )
                                            })}
                                        </select>
                                    </td>
                                    <td>
                                        <input className={"form-control"} type={"number"}
                                               name={"amount[]"} defaultValue={dt.amount}/>
                                    </td>
                                </tr>
                            )
                        })
                        setFetchedDeductions(fetchedDeductions);
                        document.getElementById('spinner').style.display = 'none';
                    })
                    getOneData('fetch_agent_receipts', agent_id).then((data) => {
                        console.log(data);
                        setFetchedReceipts(data);
                        document.getElementById('spinner').style.display = 'none';
                    });

            }
        }
    }
    const addDeductions = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input className={"form-control"} name={"idx[]"}/>
                    </td>
                    <td>
                        <select className={"form-control"} name={"deduction_type[]"}
                                id={"deduction_type"}>
                            <option disabled selected>Select Deduction Type</option>
                            {deductionTypes.map((data) => {
                                return (
                                    <option value={data.code}>{data.ded_reason}</option>
                                )
                            })}
                        </select>
                    </td>
                    <td>
                        <input className={"form-control"} type={"number"}
                               name={"amount[]"}/>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removeDeduction(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedDeductions((appendedDeduction) => {
            return [...appendedDeduction, row];
        });
    };
    const removeDeduction = async (id, e) => {
        e.preventDefault();
        setAppendedDeductions((appendedDeduction) => {
            return appendedDeduction.filter((row) => row.id !== id);
        });
    };
    const saveDeductions = (e) => {
        e.preventDefault();
        console.log(selectedAgent);
        const tbl = document.querySelector("#deductions_table tbody").children;
        const agent_id = document.getElementById('select_agent').value;
        console.log(agent_id);
        switch (selectedTask) {
            case 'add':
                if (tbl.length < 1) {
                    alert('Enter at least one deduction entry')
                } else {
                    if (agent_id === 'Select Agent') {
                        alert('Select Agent')
                        console.log('null')
                    } else {
                        const frmData = new FormData(document.getElementById('enter_deductions_form'));
                        frmData.append('agent_id', agent_id);
                        document.getElementById('spinner').style.display = 'block';
                        postData(frmData, 'save_agent_deductions').then((data) => {
                            console.log(data);
                            if (data.error) {
                                const error_msg = <p style={{color: "red"}}>Save Failed !</p>
                                setModalOneOpen(true);
                                setMessage(error_msg);
                                document.getElementById("spinner").style.display = "none";
                            } else {
                                setModalOneOpen(true);
                                setMessage(data.message);
                                document.getElementById("spinner").style.display = "none";
                            }
                        });
                    }
                }
                break;
            case 'query':
                const frmData = new FormData(document.getElementById('enter_deductions_form'));
                frmData.append('agent_id', agent_id);
                document.getElementById('spinner').style.display = 'block';
                postData(frmData, 'update_agent_deductions').then((data) => {
                    console.log(data);
                    if (data.error) {
                        const error_msg = <p style={{color: "red"}}>Save Failed !</p>
                        setModalOneOpen(true);
                        setMessage(error_msg);
                        document.getElementById("spinner").style.display = "none";
                    } else {
                        setModalOneOpen(true);
                        setMessage(data.message);
                        document.getElementById("spinner").style.display = "none";
                    }
                });
        }
    }
    const closeModal = () => {
        setModalOneOpen(false);
        setFetchedDeductions([]);
        setFetchedReceipts([]);
    }
    return (
        <div>
            <div className="container">
                <div className="row ">
                    <div className="row col-md-12">
                        <label htmlFor={"task"}
                               className="col-form-label col-sm-1 label-right pl-0 pr-2">Task:
                        </label>
                        <div className={"col-md-2"}>
                            <select className={"form-control"} id={"task"}
                                    onChange={selectTask}>
                                <option value={"0"}>Select Task</option>
                                <option value={"add"}>Add</option>
                                <option value={"query"}>Query</option>
                            </select>
                        </div>
                        <label htmlFor={"agent"}
                               className="col-form-label col-sm-1 label-right pl-0 pr-2">Agent:
                        </label>
                        <select className="form-control col-md-4" id="select_agent"
                                onChange={fetchAgentReceipts}>
                            <option value={null}>Select Agent</option>
                            {agents.map((data) => {
                                return <option value={data.AGENT_ID}>{data.AGENT_NAME}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <hr/>
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card mt-0">
                            <form id={"enter_deductions_form"} onSubmit={saveDeductions}>
                                <div className="row">
                                    <button id={"add_deductions_btn"}
                                        className="btn btn-info col-sm-3"
                                        onClick={addDeductions}
                                        style={{float: "right", marginBottom: "10px"}}>
                                        Add Deductions
                                    </button>
                                </div>
                                <div className="row">
                                    <table className="table table-responsive table-sm"
                                           id="deductions_table" style={{maxHeight: "400px", minHeight: "100px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Deduction Type</th>
                                            <th>Amount</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {deductions}
                                        {appendedDeductions.map((data) => {
                                            return <tr id="appended"    key={data.id}>{data.new}</tr>;
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={"row"}>
                                    <table className="table table-responsive table-sm"
                                           id="receipts_table" style={{maxHeight: "300px"}}>
                                        <thead className="thead-dark">
                                        <tr>
                                            <th>Receipt No</th>
                                            <th>Receipt Amount</th>
                                            <th>Receipt Date</th>
                                            <th>Payment Mode</th>
                                            <th>Cheque No</th>
                                            <th>Financer</th>
                                            <th>Corporate</th>
                                            <th>Member No</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {receipts.map((data) => {
                                            return (
                                                <tr>
                                                    <td>{data.receipt_no}</td>
                                                    <td>{data.receipt_amount}</td>
                                                    <td>{data.receipt_date}</td>
                                                    <td>{data.payment_mode}</td>
                                                    <td>{data.cheque_no}</td>
                                                    <td>{data.financer}</td>
                                                    <td>{data.corporate}</td>
                                                    <td>{data.member_no}</td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={"row"}>
                                    <div className="col-sm-4">
                                        <input type="text" className="form-control text-uppercase"
                                               name="user" id="user"
                                               value={localStorage.getItem("username")}
                                               placeholder="User" readOnly hidden/>
                                    </div>
                                </div>
                                <Spinner/>
                                <div className={"row justify-content-center mt-3"}>
                                    <button type={"submit"} className={"btn btn-outline-success btn-sm col-md-1"}>
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal5
                modalIsOpen={isModalOneOpen}
                closeModal={closeModal}
                header={<p id="headers">Agent Deductions</p>}
                body={
                    <div>
                        <p>{message}</p>
                        <div classsName={"row"}>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                }/>
        </div>
    )
}

export default EnterDeductions
