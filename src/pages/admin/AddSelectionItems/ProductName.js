import React, {useState, useEffect} from "react";
import {getData, postData} from "../../../components/helpers/Data";
import {Spinner} from "../../../components/helpers/Spinner";
import MessageModal from "../../../components/helpers/Modal2";
import {toInputUpperCase} from "../../../components/helpers/toInputUpperCase";
import Modal5 from "../../../components/helpers/Modal5";

const ProductName = () => {
    const [productNames, setProductNames] = useState([]);
    const [appendedProductName, setAppendedProductName] = useState([]);
    const [messageModal, setIsMessageModal] = useState(false);
    const [responseModal, setResponseModal] = useState(false);
    const [response, setResponse] = useState(false);
    const [message, setMessage] = useState(false);

    useEffect(() => {
        getData("fetch_product_names")
            .then((data) => {
                setProductNames(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    // append product names
    const appendProductNameRow = (e) => {
        e.preventDefault();
        const row = {
            id: new Date().getTime().toString(),
            new: (
                <>
                    <td>
                        <input type="text" disabled/>
                    </td>
                    <td>
                        <input type="text" name="product_name_added[]"
                               id={"product_name_added"}
                               className={"form-control"}
                               onInput={toInputUpperCase}/>
                    </td>
                    <td>
                        <button
                            className="btn text-danger"
                            onClick={(e) => removeProductName(row.id, e)}
                        >
                            <i className="fas fa-trash fa-lg"></i>
                        </button>
                    </td>
                </>
            ),
        };

        setAppendedProductName((appendedProductName) => {
            return [...appendedProductName, row];
        });
    };
    //remove product name row
    const removeProductName = async (id, e) => {
        e.preventDefault();
        setAppendedProductName((appendedProductName) => {
            return appendedProductName.filter((row) => row.id !== id);
        });
    };
    //save product name
    const saveProductName = (e) => {
        e.preventDefault();
        //const product_name_added[] = document.getElementById("product_name_added").value;
        const errors_arr = [];
        //loop through table and check for null product_name detail entries
        const tbl_length = document.getElementById('product_name_tbl').rows.length;
        console.log(tbl_length)

        const tbl = document.querySelector("#product_name_tbl tbody").children;
        for (let trs of tbl) {
            const product_name_added = trs.children[1].children[0].value;
            if (!product_name_added) {
                errors_arr.push('Notice ! Enter Product Name Details')
            }
        }
        if (errors_arr.length > 0) {
            setMessage("Notice ! Enter Product Name Details");
            setIsMessageModal(true);
        } else {
            const frmData = new FormData(document.getElementById("product_name_form"));
            postData(frmData, "save_add_product_name")
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
                    <p className="text-info h2">Product Names</p>
                    <hr/>
                </div>
                <div className="card col-md-12">
                    <button className="btn btn-success" onClick={appendProductNameRow}>
                        Add
                    </button>
                    <form id="product_name_form" onSubmit={saveProductName}>
                        <div className={"row justify-content-center"}>
                            <table className="table table-bordered"
                                   style={{maxHeight: "300px"}}
                                   id={"product_name_tbl"}>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Code</th>
                                    <th>Product Name</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {productNames.map((dt) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input type="text" name="code[]"
                                                       className={"form-control text-center"}
                                                       defaultValue={dt.code} readOnly/>
                                            </td>
                                            <td>
                                                <input type="text" name="product_name[]"
                                                       className={"form-control"}
                                                       style={{width: "400px"}}
                                                       defaultValue={dt.product_name}
                                                       onInput={toInputUpperCase}/>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {appendedProductName.map((data) => {
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

export default ProductName;
