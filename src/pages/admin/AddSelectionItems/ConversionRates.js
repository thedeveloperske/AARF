import React, {useState, useEffect} from "react";
import {getData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const ConversionRates = () => {
    const [rates, setRates] = useState([]);
    const [appendedRate, setAppendedRate] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        getData("fetch_conversion_rates").then((data) => {
            setRates(data);
        }).catch((error) => { console.log(error)});
    }, []);
    // append rate
    const appendRateRow = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input type="text" disabled/>
                    </td>
                    <td>
                        <input type="text" name="currency_added[]"
                               className={"form-control text-center"}
                               onInput={toInputUpperCase}/>
                    </td>
                    <td>
                        <input type="number" name="value_added[]"
                               className={"form-control text-center"}/>
                    </td>
                    <td>
                        <select name="operation_added[]">
                            <option value={null}>Select Operation</option>
                            <option value="1">Multiply</option>
                            <option value="2">Divide</option>

                        </select>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removeRate(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedRate((appendedRate) => {
            return [...appendedRate, row];
        });
    };
    //remove rate row
    const removeRate = async (id, e) => {
        e.preventDefault();
        setAppendedRate((appendedRate) => {
            return appendedRate.filter((row) => row.id !== id);
        });
    };
    //save rates
    const saveConversionRates = (e) => {
        e.preventDefault();
        //const rate_added[] = document.getElementById("rate_added").value;
        const errors_arr = [];
        //loop through table and check for null rate detail entries
        const tbl_length = document.getElementById('rate_tbl').rows.length;
        console.log(tbl_length)

        const tbl = document.querySelector("#rate_tbl tbody").children;
        for (let trs of tbl) {
            const currency_added = trs.children[1].children[0].value;
            const value_added = trs.children[2].children[0].value;
            const operation = trs.children[3].children[0].value;
            if (!currency_added || !value_added || operation === 'Select Operation') {
                errors_arr.push('Notice ! Enter Conversion Rate Details')
            }
        }
        if (errors_arr.length > 0) {
            setMessage("Notice ! Enter Conversion Rate Details");
            setIsMessageModal(true);
        } else {
            const frmData = new FormData(document.getElementById("rate_form"));
            postData(frmData, "save_add_conversion_rate")
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
                    <p className="text-info h2">Conversion Rates</p>
                    <hr/>
                </div>
                <div className="card col-md-12">
                    <button className="btn btn-success" onClick={appendRateRow}>
                        Add
                    </button>
                    <form id="rate_form" onSubmit={saveConversionRates}>
                        <div className={"row justify-content-center"}>
                            <table className="table table-bordered"
                                   style={{maxHeight: "300px"}}
                                   id={"rate_tbl"}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Code</th>
                                    <th>Currency</th>
                                    <th>Rate</th>
                                    <th>Operation</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rates.map((dt) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="text" name="idx[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.idx} readOnly/>
                                            </td>
                                            <td>
                                                <input type="text" name="currency[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.currency}/>
                                            </td>
                                            <td>
                                                <input type="number" name="value[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.value}/>
                                            </td>
                                            <td>
                                                <select name="operation[]" defaultValue={dt.operation}>
                                                    <option value={null}>Select Operation</option>
                                                    <option value="1">Multiply</option>
                                                    <option value="2">Divide</option>

                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {appendedRate.map((data) => {
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
                buttons={
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

export default ConversionRates;
