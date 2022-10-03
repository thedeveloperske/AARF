import {useEffect, useState} from 'react';
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import {getData, getOneData, postData} from "../../../components/helpers/Data";
import {today} from "../../../components/helpers/today";
import Modal5 from "../../../components/helpers/Modal5";
import {Spinner} from "../../../components/helpers/Spinner";

const BatchClaims = () => {
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState([]);
    const [batchNo, setBatchNo] = useState([]);
    const [fetchedData, setFetchedData] = useState([]);
    //fetch providers
    useEffect(() => {
        getData('fetch_providers').then((data) => {
            setProviders(data);
        })
    }, []);
    //change selection option
    const selectionOption = (e) => {
        e.preventDefault();
        const task = document.getElementById('task').value;
        console.log(task);
        if (task === '0') {
            //empty form
            document.getElementById('batch_form').reset();
            document.getElementById('select_provider_dropdown').style.display = 'block';
            document.getElementById('batch_no_input_div').style.display = 'none';
            document.getElementById('query_btn_div').style.display = 'none';
            document.getElementById('provider').value = selectedProvider;
            //empty fields
            document.getElementById('batch_no').value = '';
            document.getElementById('batch_count').value = '';
            document.getElementById('batch_amount').value = '';
            document.getElementById('serial_no').value = '';
            document.getElementById('amount_entered').value = '';
            document.getElementById('date_created').value = today();
            document.getElementById('date_received').value = '';
            document.getElementById('date_entered').value = '';
            document.getElementById('actual_amount').value = '';

        } else if (task === '1') {
            setBatchNo([]);
            document.getElementById('select_provider_dropdown').style.display = 'none';
            document.getElementById('batch_no_input_div').style.display = 'block';
            document.getElementById('query_btn_div').style.display = 'block';
            document.getElementById('batch_no').value = '';
            document.getElementById('batch_count').value = '';
            document.getElementById('batch_amount').value = '';
            document.getElementById('serial_no').value = '';
            document.getElementById('amount_entered').value = '';
            document.getElementById('date_created').value = '';
            document.getElementById('date_received').value = '';
            document.getElementById('date_entered').value = '';
            document.getElementById('actual_amount').value = '';
            document.getElementById('provider').value = null;
        }
    }
    //save batch
    const saveBatch = (e) => {
        e.preventDefault();
        const errors = new Array();
        if (selectedProvider.length === 0){
            errors.push('Notice, Enter Provider from dropdown');
            setMessage('Notice ! Enter Provider from dropdown');
            setIsModalOpen(true);
        }
        else {
            const frmData = new FormData(document.getElementById('batch_form'));
            frmData.append('task', document.getElementById('task').value);
            //start loader
            document.getElementById('spinner').style.display = 'block';
            postData(frmData, 'save_batch_claims').then((data) => {
                //stop loader
                document.getElementById('spinner').style.display = 'none';
                setBatchNo(data.batch_no);
                setMessage(data.message);
                setIsModalOpen(true);
                console.log(data);
            });
        }
       // document.getElementById('batch_form').reset();
    }
    //query batch
    const queryBatch = async(e) => {
        e.preventDefault();
        await selectionOption(e);
        const batch_no = document.getElementById('batch_no_input').value;
        //start loader
        document.getElementById('spinner').style.display = 'block';
        getOneData('query_claims_batch', batch_no).then((data) => {
            console.log(data);
            //setFetchedData(data.response);
            document.getElementById('batch_no').value = data.response.batch_no;
            document.getElementById('batch_count').value = data.response.batch_count;
            document.getElementById('batch_amount').value = data.response.batch_amount;
            document.getElementById('serial_no').value = data.response.serial_no;
            document.getElementById('amount_entered').value = data.response.original_amt;
            document.getElementById('date_created').value = data.response.date_entered;
            document.getElementById('date_received').value = data.response.date_received;
            document.getElementById('date_entered').value = data.response.date_entered;
            document.getElementById('actual_amount').value = data.response.original_amt;
            document.getElementById('provider').value = data.response.provider;
            //stop loader
            document.getElementById('spinner').style.display = 'none';
        })
    }
    //close modal
    const closeModal = () => {
        setIsModalOpen(false);
    }
    return (
        <div>
            <div className="row ml-0">
                <h4 className="fs-title">Claims Batching</h4>
                <hr/>
                <div className="col-md-12">
                    <div className="row ml-0">
                        <div className="form-group row">
                            <label htmlFor={"provider"}
                                   className="col-form-label col-sm-1 label-right pr-0 pl-0 mr-4">Task:</label>
                            <select className={"form-control col-md-2"} name={"task"} id={"task"}
                                    onChange={selectionOption}>
                                <option value={null}>Select Task</option>
                                <option value={0}>Create Batch</option>
                                <option value={1}>Query Batch</option>
                            </select>
                            <div className={"col-md-5 pr-0 pl-2"} id={"select_provider_dropdown"}>
                                <select className={"form-control mb-0"} name={"select_provider_dropdown"}
                                        id={"select_provider_dropdown"}
                                        onChange={(e) => setSelectedProvider(e.target.value)}>
                                    <option value={null}>Select Provider</option>
                                    {providers.map((data) => {
                                        return (
                                            <option value={data.CODE}>{data.PROVIDER}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className={"col-md-2 pr-0 pl-2"} id={"batch_no_input_div"}>
                                <input type="text" className="form-control"
                                       name={"batch_no_input"} id={"batch_no_input"} />
                            </div>
                            <div className={"col-md-1 pl-2"} id={"query_btn_div"}>
                                <button className={"btn btn-outline-primary btn-sm btn-block"}
                                        onClick={queryBatch} >
                                    Query
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section id="" className="project-tab">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <form id="batch_form" className="" onSubmit={saveBatch}>
                                        <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade show active corporate-tab-content"
                                                 id="nav-invoice"
                                                 role="tabpanel" aria-labelledby="nav-home-tab">
                                                <div id="step-1">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group row ml-0 ">
                                                                <label htmlFor="batch_no"
                                                                       className="col-form-label col-md-1 label-align pr-0 pl-0">Batch
                                                                    No:
                                                                </label>
                                                                <div className="col-md-3">
                                                                    <input type="text" className="form-control"
                                                                           name="batch_no" id="batch_no"
                                                                           readOnly value={batchNo}/>
                                                                </div>
                                                                <label htmlFor="batch_count"
                                                                       className="col-form-label label-align col-md-1 col-sm-2 pr-0 pl-0">Batch Count:
                                                                </label>
                                                                <div className="col-md-3">
                                                                    <input type="number" className="form-control" required
                                                                           name="batch_count" id="batch_count" max={"999"}/>
                                                                </div>
                                                                <label htmlFor="batch_amount"
                                                                       className="col-form-label col-md-1 col-sm-2 label-align pr-0 pl-0">Batch
                                                                    Amount:
                                                                </label>
                                                                <div className="col-md-3 col-sm-4 ">
                                                                    <input type="number" className="form-control" required
                                                                           name="batch_amount" id="batch_amount"/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="user_id"
                                                                       className="col-form-label label-align col-md-1 col-sm-2 pr-0 pl-0">User
                                                                    ID:
                                                                </label>
                                                                <div className="col-md-3 col-sm-4">
                                                                    <input type="text" className="form-control"
                                                                           id="user_id" name="user_id"
                                                                           value={localStorage.getItem("username")}/>
                                                                </div>
                                                                <label htmlFor="serial_no"
                                                                       className="col-form-label col-md-1 label-align pr-0 pl-0">Serial
                                                                    No:
                                                                </label>
                                                                <div className="col-md-3">
                                                                    <input type="text" className="form-control"
                                                                           name="serial_no" id="serial_no" required
                                                                           defaultValue={fetchedData.serial_no}
                                                                           onInput={toInputUpperCase}/>
                                                                </div>
                                                                <label htmlFor="amount_entered"
                                                                       className="col-form-label label-align col-md-1 col-sm-2 pr-0 pl-0">Amn't
                                                                    Entered:
                                                                </label>
                                                                <div className="col-md-3 col-sm-4">
                                                                    <input type="number" className="form-control"
                                                                           id="amount_entered" name="amount_entered"
                                                                           defaultValue={fetchedData.actual_amt}/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="date_created"
                                                                       className="col-form-label label-align col-md-1 col-sm-2 pr-0 pl-0">Date
                                                                    Created:
                                                                </label>
                                                                <div className="col-md-3">
                                                                    <input type="date" className="form-control"
                                                                           id="date_created" name="date_created"
                                                                           maxLength={"4"} max={"9999-12-31"}/>
                                                                </div>
                                                                <label htmlFor="date_received"
                                                                       className="col-form-label label-align col-md-1 col-sm-2 pr-0 pl-0">Date
                                                                    Received:
                                                                </label>
                                                                <div className="col-md-3">
                                                                    <input type="date" className="form-control"
                                                                           id="date_received" name="date_received" required
                                                                           maxLength={"4"} max={"9999-12-31"}/>
                                                                </div>
                                                                <label htmlFor="date_entered"
                                                                       className="col-form-label label-align col-md-1 col-sm-2 pr-0 pl-0">Date
                                                                    Entered:
                                                                </label>
                                                                <div className="col-md-3">
                                                                    <input type="date" className="form-control"
                                                                           id="date_entered" name="date_entered"
                                                                           maxLength={"4"} max={"9999-12-31"}/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0">
                                                                <label htmlFor="provider"
                                                                       className="col-form-label col-sm-1 label-align pr-0 pl-0">Provider:
                                                                </label>
                                                                <div className="col-sm-7">
                                                                    <select className="form-control" name="provider"
                                                                            value={selectedProvider} id={"provider"} readOnly>
                                                                        <option value={null}>Select Provider</option>
                                                                        {providers.map((data) => {
                                                                            return (
                                                                                <option
                                                                                    value={data.CODE}>{data.PROVIDER}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </div>
                                                                <label htmlFor="actual_amount"
                                                                       className="col-form-label label-align col-md-1 col-sm-2 pr-0 pl-0">Actual
                                                                    Amn't:
                                                                </label>
                                                                <div className="col-md-3">
                                                                    <input type="number" className="form-control"
                                                                           name="actual_amount" id="actual_amount"/>
                                                                </div>
                                                            </div>
                                                            <div className="form-group row ml-0 justify-content-center">
                                                                <Spinner/>
                                                            </div>
                                                            <div className="form-group row ml-0 justify-content-center">
                                                                <button type={"submit"}
                                                                        className={"btn btn-sm btn-outline-success col-md-1"}>Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*Modal*/}
            <Modal5
                modalIsOpen={isModalOpen}
                closeModal={closeModal}
                header={<p id="headers">Claims Batching</p>}
                body={
                    <div>
                        <div className={"row"}>
                            <p>{message}</p>
                        </div>
                        <div className={"row"}>
                            <button
                                className="btn btn-outline-danger"
                                onClick={(e) => setIsModalOpen(false)}>
                                close
                            </button>
                        </div>
                    </div>
                }/>
        </div>
    )
}

export default BatchClaims;