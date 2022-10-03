import React, { useState } from "react";
import { getOneData, getTwoData, postData } from '../../../components/helpers/Data';
import Modal2 from "../../../components/helpers/Modal2";
import {today} from "../../../components/helpers/today"

const ProductChange = () => {
    const [productChange, setProductChange] = useState([]);
    const [newHealthPlan, setNewHealthPlan] = useState([]);
    const [newProduct, setNewProduct] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [feedback, setFeedback] = useState([]);


    const generateData = () => {
        const input_member_no = document.getElementById("member_no").value
        getOneData("fetch_product_change", input_member_no)
            .then((data) => {
                data.product_change.map(dt => {
                    setProductChange(dt);
                })
                setNewHealthPlan(data.new_health_plan);
            }).catch((error) => console.log(error));
    }
    //get new product on change
    const getNewProduct = (e) => {
        const input_member_no = document.getElementById("member_no").value
        getTwoData("fetch_new_product_change", input_member_no, e.target.value)
            .then((data) => {

                setNewProduct(data.new_product);
            })
            .catch((error) => console.log(error));
    };
    const saveProductChange = (e) => {
        e.preventDefault();
        const frmData = new FormData(document.getElementById('product_change_form'));
        postData(frmData, 'save_product_change').then((data) =>{
            setFeedback(data);
            setModalIsOpen(true)
        }).catch((error) => console.log(error));
    };
    const closeModal = () => {
        setModalIsOpen(false)
    window.location.replace("/product-change")
      }
    return (
        <div>
            <section id="querycorporatetable" className="project-tab">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row col-md-12" id="step-1">
                                <div className="form-group row ml-0">
                                    <label className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                                        for="member_no">Member No:
                                    </label>
                                    <div className="col-md-4 col-sm-4 ">
                                        <input type="text" className="form-control text-uppercase" name="member_no" id="member_no"
                                            placeholder="Enter Member No" aria-required="true"
                                        />
                                    </div>
                                    <div className="col-md-1 col-sm-1 ">
                                        <button class="btn btn-info ml-auto btn-sm pull-right mr-1 mt-1" style={{ width: "fit - content" }} id="btn_generate" onClick={generateData}>Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <form className="claims_form mt-1" id='product_change_form' onSubmit={saveProductChange} >
                                <fieldset>
                                    <div id="invoice_details_1">
                                        <h2 className="fs-title">Product Change</h2>
                                        <hr />
                                    </div>
                                    <div className="row col-md-12" id="step-1">
                                        <div className="form-group row ml-0">
                                            <label for="member_name"
                                                className="col-form-label col-md-3 label-align text-center pr-0 pl-0">Member Name:
                                            </label>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="member_name" value={productChange.full_name} id="member_name"
                                                    placeholder="Corporate" aria-required="true" disabled
                                                />
                                            </div>
                                            {/* hidden input mamber_no */}
                                            <div className="col-md-4 col-sm-4 ">
                                                <input type="text" className="form-control" name="member_no" value={productChange.member_no} id="member_no"
                                                    placeholder="Enter Member No" hidden
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row ml-0">
                                            <label for="Corporate"
                                                className="col-form-label col-md-3 label-align text-center pr-0 pl-0">Corporate
                                            </label>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="corporate" value={productChange.corporate} id="corporate"
                                                    placeholder="Corporate" aria-required="true" disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row ml-0">
                                            <label for="current_health_plan"
                                                className="col-form-label col-md-3 label-align text-center pr-0 pl-0">Current HealthPlan:
                                            </label>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="current_health_plan" value={productChange.health_plan} id="current_health_plan"
                                                    placeholder="Current Health Plan" aria-required="true" readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row ml-0">
                                            <label for="current_product"
                                                className="col-form-label col-md-3 label-align text-center pr-0 pl-0">Current Product:
                                            </label>
                                            <div className="col-md-9">
                                                <input type="text" className="form-control" name="current_product" value={productChange.product_name} id="current_product"
                                                    placeholder="Current Product" aria-required="true" disabled
                                                />
                                            </div>
                                            {/* hidden input product_id */}
                                            <div className="col-md-4 col-sm-4 ">
                                                <input type="text" className="form-control" name="h_option" value={productChange.h_option} id="h_option"
                                                    placeholder="Current Product Id" hidden
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group row ml-0">
                                            <label className="col-form-label col-md-3 label-align text-center pr-0 pl-0"
                                                for="new_health_plan">New HealthPlan:
                                            </label>
                                            <div className="col-md-9">
                                                <select className="form-control" name="new_health_plan" id="new_health_plan" required="true" onChange={getNewProduct}>
                                                    <option value="" disabled selected>Select HealthPlan</option>
                                                    {newHealthPlan.map((category) => {
                                                        const { health_plan } = category;
                                                        return (
                                                            <option key={health_plan} value={health_plan}>{health_plan}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row ml-0">
                                            <label className="col-form-label col-md-3 label-align text-center pr-0 pl-0"
                                                for="new_product">New Product:
                                            </label>
                                            <div className="col-md-9">
                                                <select className="form-control" name="new_product" id="new_product" required="true">
                                                    <option value="" disabled selected>Select New Product</option>
                                                    {newProduct.map((product) => {
                                                        const { code, product_name } = product;
                                                        return (
                                                            <option key={code} value={code}>{product_name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row ml-0">
                                            <label for="date"
                                                className="col-form-label col-md-3 label-align text-center pr-0 pl-0">Date:
                                            </label>
                                            <div className="col-md-9">
                                                <input type="date" className="form-control" name="date" id="date" value={today()}
                                                    placeholder="Date" aria-required="true" disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    {/* Save button */}
                                    <input type="submit"
                                        className="action-button btn-success col-md-4 ml-auto"
                                        value="Save" />
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </section >

            {/* Modal */}
            <Modal2
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                body={
                <span className="h4 text-white font-weight-bold text-center">
                    {feedback}
                </span>
                }
                background={feedback.length > 0?feedback[0].includes('Error')?"#d9534f":"#105878":""}
            />
        </div >
    )
}

export default ProductChange
