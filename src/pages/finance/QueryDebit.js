import {Spinner} from "../../components/helpers/Spinner";
import ImportScripts from "../../components/helpers/ImportScripts";
import React, {useEffect, useState} from "react";
import {getData, getOneData, getTwoData} from "../../components/helpers/Data";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import Modal5 from "../../components/helpers/Modal5";

const QueryDebit = () => {
    ImportScripts("/dist/js/claims_stepwise_forms.js");
    const [disabled, setDisabled] = useState({
        family: true,
        corporate: true,
        debits: true,
        user: true,
    });
    const [corporate, setCorporate] = useState([]);
    const [individuals, setIndividuals] = useState([]);
    const [choosenOption, setChoosenOption] = useState([]);
    const [businessClass, setBusinessClass] = useState([]);
    const [products, setProducts] = useState([]);
    const [familyRelation, setFamilyRelation] = useState([]);
    const [address, setAddress] = useState([]);
    const [debitNumbers, setFetchedPremiumDebits] = useState([]);
    const [message, setMessage] = useState([]);
    const [messageModal, setMessageModal] = useState(false);
    const [summaryData, setDebitSummaryData] = useState([]);
    const [memberPremiums, setMemberPremiums] = useState([]);
    const [totalTtl, seTotalTtl] = useState([]);
    const [totalProratedPrem, setTotalProratedPrem] = useState([]);
    const [totalDiscountPrem, setTotalDiscountedPrem] = useState([]);
    const [totalLoadedPrem, setTotalLoadedPrem] = useState([]);
    const [totalSmartCost, setTotalSmartCost] = useState([]);
    const [totalAccessFee, setTotalAccessFee] = useState([]);

    useEffect(() => {
        getData("fetch_corporates").then((data) => {
            setCorporate(data);
        });
        getData("fetch_individuals").then((data) => {
            setIndividuals(data);
        });
        getData("fetch_products").then((data) => {
            setProducts(data);
        });
        getData("fetch_family_relation").then((data) => {
            setFamilyRelation(data);
        });
        getOneData("fetch_client_address", 4).then((data) => {
            setAddress(data[0]);
        });
    }, []);

    //switch between options
    useEffect(() => {
        switch (choosenOption) {
            case "1":
                setDisabled({
                    family: true,
                    corporate: false,
                    debits: true,
                    user: true,
                });
                break;
            case "2":
                setDisabled({
                    family: false,
                    corporate: true,
                    debits: true,
                    user: true,
                });
                break;
        }
    }, [choosenOption]);

    //fetch corporate debits
    const fetchClientDebits = (e) => {
        e.preventDefault();
        switch (choosenOption) {
            case '1':
                //fetch client debits
                const corp_id = document.getElementById('corp_id').value;
                getTwoData('fetch_premium_debits', choosenOption, corp_id).then((data) => {
                    console.log(data);
                    if (data.length > 0) {
                        setDisabled({family: true, corporate: false, debits: false, user: true,});
                        setFetchedPremiumDebits(data);
                    } else if (data.length === 0) {
                        setMessage('Notice ! Client has no Debits.')
                        setMessageModal(true);
                    }
                }).catch((error) => {
                    console.log(error);
                });
                break;
            case '2':
                const individual_no = document.getElementById('individual_no').value;
                getTwoData('fetch_premium_debits', choosenOption, individual_no).then((data) => {
                    console.log(data);
                    if (data) {
                        setDisabled({family: false, corporate: true, debits: false, user: true,});
                        setFetchedPremiumDebits(data);
                    } else if (data.length === 0) {
                        setMessage('Notice ! Client has no Debits.')
                        setMessageModal(true);
                    }
                }).catch((error) => {
                    console.log(error);
                });
                break;
            default:
                break;
        }
    }

    //fetch debit details
    const fetchDebitsDetails = (e) => {
        e.preventDefault();
        const debit_no = document.getElementById('debit_no').value;
        getOneData('fetch_debit_details', debit_no).then((data) => {
            console.log(data);

            if (data.length === 0) {
                setMessage('Debit No. has no details')
                setMessageModal(true);
            } else {
                setDebitSummaryData(data.summary_data);
                setMemberPremiums(data.details_data);
                seTotalTtl(data.total_ttl);
                setTotalProratedPrem(data.prorated_prem_ttl);
                setTotalDiscountedPrem(data.discounted_prem_ttl);
                setTotalLoadedPrem(data.loaded_prem_ttl);
                setTotalSmartCost(data.smart_cost_ttl);
                setTotalAccessFee(data.access_fee_ttl);
            }
        }).catch((error) => {
            console.log(error)
        })

    }
    //print functionality - print document
    const printPdf = () => {
        let page_header = `
<div class="row">
<ul style="list-style-type: none" class="col-md-4 text-left float-left">
        <li>${address.client_name}</li>
        <li>${address.physical_location}</li>
        <li>${address.box_no}</li>
        <li>${address.tel_cell}</li>
        <li>${address.fax}</li>
        <li>${address.email}</li>
        <li>${address.url}</li>
      </ul>
      <ul style="list-style-type: none" class="col-md-4 text-left float-right">
        <li>${address.client_name}</li>
        <li>${address.physical_location}</li>
        <li>${address.box_no}</li>
        <li>${address.tel_cell}</li>
        <li>${address.fax}</li>
        <li>${address.email}</li>
        <li>${address.url}</li>
      </ul>
</div>
      
      
   `;
        let user = localStorage.getItem("username");
        let tbl_head = "";
        let tbl_body = "";

        const header = document.querySelector("#view_details_tbl thead").children;
        for (let trs of header) {
            tbl_head += `
        <tr>
          <th>${trs.children[0].textContent}</th>
          <th>${trs.children[1].textContent}</th>
          <th>${trs.children[2].textContent}</th>
          <th>${trs.children[3].textContent}</th>
          <th>${trs.children[4].textContent}</th>
          <th>${trs.children[5].textContent}</th>
          <th>${trs.children[6].textContent}</th>
          <th>${trs.children[7].textContent}</th>
          <th>${trs.children[8].textContent}</th>
          <th>${trs.children[9].textContent}</th>
          <th>${trs.children[10].textContent}</th>
          <th>${trs.children[11].textContent}</th>
        
        </tr>
      `;
        }

        const body = document.querySelector("#view_details_tbl tbody").children;
        for (let trs of body) {
            tbl_body += `
        <tr>
          <td>${trs.children[0].children[0].value}</td>
          <td>${trs.children[1].children[0].value}</td>
          <td>${trs.children[2].children[0].value}</td>
          <td>${trs.children[3].children[0].value}</td>
          <td>${trs.children[4].children[0].value}</td>
          <td>${
                trs.children[5].children[0].options[
                    trs.children[5].children[0].selectedIndex
                    ].text
            }</td>
          <td>${
                trs.children[6].children[0].value != ""
                    ? parseFloat(trs.children[6].children[0].value).toLocaleString()
                    : "0.00"
            }</td>
          <td>${
                trs.children[7].children[0].value != ""
                    ? parseFloat(trs.children[7].children[0].value).toLocaleString()
                    : "0.00"
            }</td>
          <td>${
                trs.children[8].children[0].value != ""
                    ? parseFloat(trs.children[8].children[0].value).toLocaleString()
                    : "0.00"
            }</td>
          <td>${
                trs.children[9].children[0].value != ""
                    ? trs.children[9].children[0].value
                    : "0.00"
            }</td> 
          <td>${
                trs.children[10].children[0].value != ""
                    ? trs.children[10].children[0].value
                    : "0.00"
            }</td>
          <td>${
                trs.children[11].children[0].value != ""
                    ? trs.children[11].children[0].value
                    : "0.00"
            }</td>
        </tr>
      `;
        }
        const footer = document.querySelector("#view_details_tbl tfoot").children;
        let tbl_foot = `
        <tr>
          <th>${footer[0].textContent}</th>
          <th>${footer[1].textContent}</th>
          <th>${footer[2].textContent}</th>
          <th>${footer[3].textContent}</th>
          <th>${footer[4].textContent}</th>
          <th>${footer[5].textContent}</th>
          <th>${footer[6].children[0].value}</th>
          <th>${footer[7].children[0].value}</th>
          <th>${footer[8].textContent}</th>
          <th>${footer[9].children[0].value}</th>
          <th>${footer[10].textContent}</th>
          <th>${footer[11].children[0].value}</th>
        </tr>
      `;
        let html = `
    <div class="row">
    <div style="text-align:right;">${page_header}</div>
    <br><br><br>
     <div><table><thead>${tbl_head}</thead><tbody>${tbl_body}</tbody><tfoot>${tbl_foot}</tfoot></table></div>
    <div></div>
    <br><br><br> 
     <p>Prepared By: ${user}</p>
    <br/>
    <p>Received By: __________________________   Date Received: __________________________</p>  
    </div>
    `;
        var val = htmlToPdfmake(html);
        var dd = {
            pageOrientation: "landscape",
            pageMargins: [40, 60, 40, 60],
            content: val,
            pageSize: "A4",
        };
        pdfMake.createPdf(dd).download();
    };

    //textarea
    const divide = () => {
        var txt;
        txt = document.getElementById("bank_details").value;
        var text = txt.split(".");
        var str = text.join(".</br>");
        document.write(str);
    };

    return (
        <div>
            <div className="">
                <form id={"input_form"}>
                    <div className="col-md-12">
                        <div className="row pr-0">
                            <label htmlFor="task"
                                   className="col-form-label col-sm-2 label-right pr-2 pl-0">
                                Select Task:
                            </label>
                            <div className="col-md-2">
                                <select
                                    className="form-control col-md-12"
                                    id="select_dropdown"
                                    name="task"
                                    defaultValue="0"
                                    onChange={(e) => setChoosenOption(e.target.value)}>
                                    <option disabled value="0">
                                        Select Option
                                    </option>
                                    <option value="1">Query Corporate Debit</option>
                                    <option value="2">Query Family Debit</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select
                                    name="corp_id"
                                    id="corp_id"
                                    className={"form-control"}
                                    hidden={disabled.corporate}
                                    onChange={fetchClientDebits}
                                >
                                    <option value="0">Select Corporate</option>
                                    {corporate.map((dt) => {
                                        return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
                                    })}
                                </select>
                                <select
                                    name="individual_no"
                                    id="individual_no"
                                    className={"form-control"}
                                    hidden={disabled.family}
                                    onChange={fetchClientDebits}
                                >
                                    <option value="0">Select Family</option>
                                    {individuals.map((dt) => {
                                        return (
                                            <option value={dt.member_no}>
                                                {dt.principal_names + " - " + dt.member_no}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="col-md-2" hidden={disabled.debits}>
                                <select name="debits" className={"form-control"}
                                        onChange={fetchDebitsDetails} id={"debit_no"}>
                                    <option disabled selected>Select Debit/Credit</option>
                                    {debitNumbers.map((data) => {
                                        return (
                                            <option value={data.invoice_no}>{data.invoice_no}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <section id="member_tabs" className="project-tab">
                <div className="">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="text-info"
                                style={{textAlign: "center", fontWeight: "bolder"}}>
                                Query Debit
                            </h4>
                            <form className="claims_form mt-1" id="formMember">
                                {/* progressbar */}
                                <ul id="progressbar" className="col-md-12">
                                    <li className="active">Summary</li>
                                    <li>Details</li>
                                    <li>View Details</li>
                                    {/* <li>View Summary</li>
                                    <li>Member Schedule</li>
                                    <li>Payment Schedule</li> */}
                                </ul>
                                <fieldset>
                                    <div
                                        className="row col-md-12 col-sm-12 pr-0 pl-0 ml-0"
                                        id="step-1">
                                        <div className="card col-md-12">
                                            <div className="row">
                                                <div className="col-md-7">
                                                    <div className="form-group row ml-0">
                                                        <p id="headers" className="col-12">
                                                            Summary
                                                        </p>
                                                        <hr/>
                                                    </div>
                                                    <div className="form-group row ml-0 ">
                                                        <label
                                                            htmlFor="surname"
                                                            className="col-form-label col-sm-2 label-align pr-0 pl-0">
                                                            Reference No
                                                            <span className="required">*</span>
                                                        </label>
                                                        <div className="col-sm-4">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="reference_no"
                                                                id="reference_no"
                                                                defaultValue={summaryData.invoice_no}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <label
                                                            htmlFor="first_name"
                                                            className="col-form-label col-sm-2 label-align pr-0 pl-0">
                                                            Anniv
                                                            <span className="required">*</span>
                                                        </label>
                                                        <div className="col-md-4 col-sm-4">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="anniv"
                                                                id="anniv"
                                                                value={summaryData.anniv} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="Invoice_date"
                                                            className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0">
                                                            Invoice Date
                                                        </label>
                                                        <div className="col-md-4 col-sm-4 ">
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                name="Invoice_date"
                                                                id="Invoice_date"
                                                                value={summaryData.invoice_date} 
                                                                readOnly
                                                            />
                                                        </div>
                                                        <label
                                                            htmlFor="effective_date"
                                                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                                        >
                                                            Effective Date
                                                        </label>
                                                        <div className="col-md-4 col-sm-4">
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                id="effective_date"
                                                                name="effective_date"
                                                                value={summaryData.cover_start_date} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="end_date"
                                                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                                        >
                                                            End Date
                                                        </label>
                                                        <div className="col-md-4 col-sm-4">
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                id="end_date"
                                                                name="end_date"
                                                                value={summaryData.cover_end_date} readOnly
                                                            />
                                                        </div>
                                                        <label
                                                            htmlFor="Days"
                                                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                                        >
                                                            Days
                                                        </label>
                                                        <div className="col-md-4 col-sm-4">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="days"
                                                                name="days"
                                                                value={summaryData.days} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="transaction"
                                                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                                        >
                                                            Transaction
                                                        </label>
                                                        <div
                                                            className="col-md-4 col-sm-4 mr-0 pr-2 pl-0 form-check-inline">
                                                            <input type="radio"
                                                                   className="form-control col-md-2 pr-0 pl-0"
                                                                   name="selected_rd" id={"credit_note_rd"}
                                                                   checked={summaryData.credit_note === "1" ? true : false}/>
                                                            <label htmlFor={"credit_note_rd"}
                                                                   className="col-form-label label-align col-md-4 pr-0 pl-0 text-left">
                                                                Debit Note
                                                            </label>
                                                            <input type="radio"
                                                                   className="form-control col-md-2 pr-0 pl-0"
                                                                   name="selected_rd" id={"credit_note_rd"}
                                                                   checked={summaryData.credit_note === "2" ? true : false}
                                                                   readOnly={true}/>
                                                            <label htmlFor={"credit_note_rd"}
                                                                   className="col-form-label col-md-4 pr-0 pl-0 label-align">
                                                                Credit Note
                                                            </label>
                                                        </div>
                                                        <label
                                                            htmlFor="business_class"
                                                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                                                        >
                                                            Business Class
                                                        </label>
                                                        <div className="col-md-4">
                                                            <select
                                                                name="business_class"
                                                                id="business_class"
                                                                className="form-control"
                                                                value={summaryData.new_renewal} readOnly>
                                                                <option value="0">Select Business Class</option>
                                                                <option value="1">New</option>
                                                                <option value="2">Renewal</option>
                                                                <option value="3">Addition EnMass</option>
                                                                <option value="4">Deletion</option>
                                                                <option value="5">Cover Up Grade</option>
                                                                <option value="6">Cover Down Grade</option>
                                                                <option value="7">Addition</option>
                                                                <option value="8">Cover Extension</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-5">
                                                    <div className="form-group row ml-0">
                                                        <p id="headers" className="col-12">
                                                            Agent Rates
                                                        </p>
                                                        <hr/>
                                                    </div>
                                                    <div className="form-group row ml-0 ">
                                                        <label
                                                            htmlFor="agent_rate"
                                                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                                                        >
                                                            Agent Rate
                                                        </label>
                                                        <div className="col-md-9">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="agent_rate"
                                                                value={summaryData.agent_rate} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="bdm_rate"
                                                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                                                        >
                                                            BDM Rate
                                                        </label>
                                                        <div className="col-md-9">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="bdm_rate"
                                                                value={summaryData.bdm_rate} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="asst_hos_rate"
                                                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                                                        >
                                                            Asst Hos Rate
                                                        </label>
                                                        <div className="col-md-9 col-sm-9">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="asst_hos_rate"
                                                                id="asst_hos_rate"
                                                                value={summaryData.ass_hos_rate} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="hos_rate"
                                                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                                                        >
                                                            Hos Rate
                                                        </label>
                                                        <div className="col-md-9 col-sm-9">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="hos_rate"
                                                                id="hos_rate"
                                                                value={summaryData.hos_rate} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card col-md-12">
                                            <div className="row">
                                                <Spinner/>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <p id="headers">Smart Fee</p>
                                                    <hr/>
                                                    <div className="form-group row ml-0 ">
                                                        <label
                                                            htmlFor="new_cards"
                                                            className="col-form-label col-md-3 label-align pr-0 pl-0"
                                                        >
                                                            New Cards
                                                        </label>
                                                        <div className="col-md-8 ">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="new_cards"
                                                                name="new_cards"
                                                                value={summaryData.smart_cost} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0 ">
                                                        <label
                                                            htmlFor="access_fee"
                                                            className="col-form-label col-md-3 label-align pr-0 pl-0"
                                                        >
                                                            Access Fee
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="access_fee"
                                                                name="access_fee"
                                                                value={summaryData.access_fee} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="notes"
                                                            className="col-form-label col-md-3 col-sm-2 label-align pr-0 pl-0"
                                                        >
                                                            Notes
                                                        </label>
                                                        <div className="col-md-8">
                                                            <textarea className="form-control" id="notes" name="notes"
                                                                      value={summaryData.notes} readOnly/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <p id="headers">Levies</p>
                                                    <hr/>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="iiu_tax"
                                                            className="col-form-label col-md-3 label-align pr-0 pl-0"
                                                        >
                                                            IIU TAX
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="iiu_tax"
                                                                name="iiu_tax"
                                                                value={summaryData.phcf} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="ira_tax"
                                                            className="col-form-label col-md-3 label-align pr-0 pl-0"
                                                        >
                                                            IRA TAX
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="ira_tax"
                                                                name="ira_tax"
                                                                value={summaryData.tl} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="invoice_type"
                                                            className="col-form-label col-md-3 label-align pr-0 pl-0"
                                                        >
                                                            Invoice Type
                                                        </label>
                                                        <div className="col-md-8">
                                                            <select
                                                                name="invoice_type_modal"
                                                                id="invoice_type_modal"
                                                                className="form-control"
                                                                value={summaryData.new_renewal} disabled selected
                                                            >
                                                                <option disabled value="0">
                                                                    Select Invoice Type
                                                                </option>
                                                                <option value="1">New</option>
                                                                <option value="2">Renewal</option>
                                                                <option value="3">Addition New</option>
                                                                <option value="4">Organic Growth</option>
                                                                <option value="5">Addition Renewal</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <p id="headers">Amounts</p>
                                                    <hr/>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="invoice_total"
                                                            className="col-form-label col-md-3 col-sm-2 label-align pr-0 pl-0"
                                                        >
                                                            Invoice Total
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="invoice_total"
                                                                name="invoice_total"
                                                                value={summaryData.invoice_total} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="premium_net"
                                                            className="col-form-label col-md-3 col-sm-2 label-align pr-0 pl-0"
                                                        >
                                                            Premium Net
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="premium_net"
                                                                name="premium_net"
                                                                value={summaryData.premium_net} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0 ">
                                                        <label
                                                            htmlFor="invoice_total"
                                                            className="col-form-label col-md-3 col-sm-2 label-align pr-0 pl-0"
                                                        >
                                                            Invoice Net
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="invoice_net"
                                                                name="invoice_net"
                                                                value={summaryData.invoice_net} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card col-md-12">
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <p id="headers">Other Charges</p>
                                                    <hr/>

                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="contingency"
                                                            className="col-form-label col-md-2 label-align pr-0 pl-0"
                                                        >
                                                            Contingency
                                                        </label>
                                                        <div className="col-md-4">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="contigency"
                                                                name="contigency"
                                                                value={summaryData.contigency} readOnly
                                                            />
                                                        </div>
                                                        <label
                                                            htmlFor="gift_items"
                                                            className="col-form-label col-md-2 label-align pr-0 pl-2"
                                                        >
                                                            Gift Items
                                                        </label>
                                                        <div className="col-md-4">
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                id="gift_items"
                                                                name="gift_items"
                                                                value={summaryData.gift_items} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="first_aid"
                                                            className="col-form-label col-md-2 label-align pr-0 pl-0"
                                                        >
                                                            First Aid
                                                        </label>
                                                        <div className="col-md-4 ">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="first_aid"
                                                                name="first_aid"
                                                                value={summaryData.first_aid} readOnly
                                                            />
                                                        </div>
                                                        <label
                                                            htmlFor="stamp_duty"
                                                            className="col-form-label label-align col-md-2 pr-0 pl-2"
                                                        >
                                                            Stamp Duty
                                                        </label>
                                                        <div className="col-md-4">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="stamp_duty"
                                                                name="stamp_duty"
                                                                value={summaryData.stamp_duty} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="others"
                                                            className="col-form-label label-align col-md-2 pr-0 pl-0"
                                                        >
                                                            Others
                                                        </label>
                                                        <div className="col-md-4">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="other"
                                                                name="other"
                                                                value={summaryData.other} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <p id="headers">Reinsurance</p>
                                                    <hr/>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="retained"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            Retained
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="retained"
                                                                name="retained"
                                                                value={summaryData.retained} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="ceded"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            Ceded
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="ceded"
                                                                name="ceded"
                                                                value={summaryData.ceded} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="form-group row ml-0"
                                                        hidden={disabled.user}
                                                    >
                                                        <label
                                                            htmlFor="user"
                                                            className="col-form-label col-md-2 col-sm-2 label-align text-center   pr-0 pl-0"
                                                        >
                                                            User:
                                                            <span className="required">*</span>
                                                        </label>
                                                        <div className="col-md-4 col-sm-4">
                                                            {/*Select class dropdown field*/}
                                                            <input
                                                                type="text"
                                                                className="form-control text-uppercase"
                                                                name="user"
                                                                id="user"
                                                                value={localStorage.getItem("username")}
                                                                placeholder="User"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next button */}
                                    <input
                                        id="invoice_button_next"
                                        type="button"
                                        name="next"
                                        className="next action-button btn-success col-md-4 ml-auto"
                                        defaultValue="Next"
                                    />
                                </fieldset>
                                <fieldset>
                                    <div>
                                        <h2 id="headings" className="fs-title">
                                            Details
                                        </h2>
                                    </div>
                                    <hr/>
                                    <div className="row table-responsive">
                                        <table
                                            className="table table-bordered"
                                            style={{maxHeight: "300px"}}
                                        >
                                            <thead className="thead-dark">
                                            <tr>
                                                <th>Category</th>
                                                <th>Member No</th>
                                                <th>Principal Name</th>
                                                <th>Member Name</th>
                                                <th>Product Name</th>
                                                <th>Family Size</th>
                                                <th>Family Title</th>
                                                <th>Age</th>
                                                <th>Effective Date</th>
                                                <th>End Date</th>
                                                <th>Prorata Period</th>
                                                <th>Premium</th>
                                                <th>Total</th>
                                                <th>Prorated Prem</th>
                                                <th>Disc (%)</th>
                                                <th>Discounted Prem</th>
                                                <th>Load (%)</th>
                                                <th>Loaded Prem</th>
                                                <th>Smart Cost</th>
                                                <th>Access Fee</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {memberPremiums.map((dt) => {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="member_no[]"
                                                                value={dt.member_no}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="category[]"
                                                                value={dt.category}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="principal_name[]"
                                                                value={dt.principal_name}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="member_name[]"
                                                                value={dt.member_name}
                                                            />
                                                        </td>
                                                        <td>
                                                            <select name="product_name[]"
                                                                    className="form-control">
                                                                <option
                                                                    value={dt.product_code}>{dt.product_name}</option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                type="text"
                                                                className="form-control"
                                                                name="family_size[]"
                                                                value={dt.family_size}
                                                            >
                                                                <option value={dt.family_size}>
                                                                    {dt.family_size > 1
                                                                        ? "M + " + (dt.family_size - 1)
                                                                        : "M"}
                                                                </option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <select
                                                                className="form-control"
                                                                name="relation[]">
                                                                <option value={dt.family_title}>{dt.relation} </option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="age[]"
                                                                value={dt.member_age}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                name="member_effective_date[]"
                                                                value={dt.effective_date}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                name="member_end_date[]"
                                                                value={dt.end_date}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="prorata_period[]"
                                                                value={dt.prorata_period}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="member_premium[]"
                                                                value={
                                                                    dt.premium === null
                                                                        ? 0
                                                                        : parseFloat(
                                                                        dt.premium
                                                                        ).toLocaleString()
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="total_premium[]"
                                                                value={
                                                                    dt.total === null
                                                                        ? 0
                                                                        : parseFloat(
                                                                        dt.total
                                                                        ).toLocaleString()
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="prorata_premium[]"
                                                                value={
                                                                    dt.prorated_prem === null
                                                                        ? 0
                                                                        : parseFloat(
                                                                        dt.prorated_prem
                                                                        ).toLocaleString()
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="discount_percent[]"
                                                                value={
                                                                    dt.disc_amt === null
                                                                        ? 0
                                                                        : parseFloat(
                                                                        dt.disc_amt
                                                                        ).toLocaleString()
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="discounted_premium[]"
                                                                value={
                                                                    dt.discounted_prem === null
                                                                        ? 0
                                                                        : parseFloat(
                                                                        dt.discounted_prem
                                                                        ).toLocaleString()
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="load_percent[]"
                                                                value={
                                                                    dt.load_amt === null
                                                                        ? 0
                                                                        : parseFloat(
                                                                        dt.load_amt
                                                                        ).toLocaleString()
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="loaded_premium[]"
                                                                value={
                                                                    dt.loaded_prem === null
                                                                        ? 0
                                                                        : parseFloat(
                                                                        dt.loaded_prem
                                                                        ).toLocaleString()
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="smart_cost[]"
                                                                value={
                                                                    dt.smart_cost === null
                                                                        ? 0
                                                                        : parseFloat(
                                                                        dt.smart_cost
                                                                        ).toLocaleString()
                                                                }
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="access_cost[]"
                                                                value={
                                                                    dt.access_fee === null
                                                                        ? 0
                                                                        : parseFloat(
                                                                        dt.access_fee
                                                                        ).toLocaleString()
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th>Totals</th>
                                                <th>{totalTtl.length != 0 ? parseFloat(totalTtl).toLocaleString() : 0}</th>
                                                <th>{totalProratedPrem.length != 0 ? parseFloat(totalProratedPrem).toLocaleString() : 0}</th>
                                                <th></th>
                                                <th>{totalDiscountPrem.length != 0 ? parseFloat(totalDiscountPrem).toLocaleString() : 0}</th>
                                                <th></th>
                                                <th>{totalLoadedPrem.length != 0 ? parseFloat(totalLoadedPrem).toLocaleString() : 0}</th>
                                                <th>{totalSmartCost.length != 0 ? parseFloat(totalSmartCost).toLocaleString() : 0}</th>
                                                <th>{totalAccessFee.length != 0 ? parseFloat(totalAccessFee).toLocaleString() : 0}</th>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div>
                                        <h2 id="headings" className="fs-title">
                                            Levies
                                        </h2>
                                        <div className="card">
                                            <div className={"row"}>
                                                <div className={"col-md-4 mr-0 ml-0 pr-0 pl-0"}>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="contingency"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            Contingency
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="first_aid"
                                                                name="first_aid"
                                                                value={summaryData.contigency} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="first_aid"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            First Aid
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="first_aid"
                                                                name="first_aid"
                                                                value={summaryData.first_aid} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="gift_items"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            Gift Items
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="gift_items"
                                                                name="gift_items"
                                                                value={summaryData.gift_items} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="others"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            Others
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="others"
                                                                name="others"
                                                                value={summaryData.other} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"col-md-4 mr-0 ml-0 pr-0 pl-0"}>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="ira_tax"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            IRA Tax
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="ira_tax"
                                                                name="ira_tax"
                                                                value={summaryData.tl} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="iiu_tax"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            IIU Tax
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="iiu_tax"
                                                                name="iiu_tax"
                                                                value={summaryData.phcf} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="new_cards"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            New Cards
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="new_cards"
                                                                name="new_cards"
                                                                value={summaryData.smart_cost} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="access_fee"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            Access Fee
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="access_fee"
                                                                name="access_fee"
                                                                value={summaryData.access_fee} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"col-md-4 mr-0 ml-0 pr-0 pl-0"}>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="premium_net"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            Premium Net
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="premium_net"
                                                                name="premium_net"
                                                                value={summaryData.premium_net} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="invoice_total"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            Invoice Total
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="invoice_total"
                                                                name="invoice_total"
                                                                value={summaryData.invoice_net} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row ml-0">
                                                        <label
                                                            htmlFor="stamp_duty"
                                                            className="col-form-label label-align col-md-3 pr-0 pl-0"
                                                        >
                                                            Stamp Duty
                                                        </label>
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="stamp_duty"
                                                                name="stamp_duty"
                                                                value={summaryData.stamp_duty} readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row"></div>
                                    {/* Previous button */}
                                    <input
                                        type="button"
                                        name="previous"
                                        id="query_previous"
                                        className="previous action-button-previous col-md-4 btn-info"
                                        defaultValue="Previous"
                                    />
                                    {/* Next button */}
                                    <input
                                        type="button"
                                        name="next"
                                        className="next action-button btn-success col-md-4 ml-auto"
                                        defaultValue="Next"
                                    />
                                </fieldset>
                                <fieldset>
                                    <div id={"invoice_details_1"}>
                                        <h2 className="fs-title">View Details</h2>
                                        <div className="addresses">
                                            <div className={"col-md-12"}>
                                                <div className="col-md-4 float-right text-left">
                                                    <h6>{address.client_name}</h6>
                                                    <h6>{address.physical_location}</h6>
                                                    <h6>{address.box_no}</h6>
                                                    <h6>{address.tel_cell}</h6>
                                                    <h6>{address.fax}</h6>
                                                    <h6>{address.email}</h6>
                                                    <h6>{address.url}</h6>
                                                </div>
                                            </div>
                                            <h6 className={"text-left"}>
                                                <br/>
                                                Debit Note <br/>
                                                Tin No: <br/>
                                                Reference No: <br/>
                                                Dated: <br/>
                                                Policy No: <br/>
                                            </h6>

                                            <h6 className="text-left">
                                                Client: <br/>
                                                P.O Box: <br/>
                                                Tel: <br/>
                                                Cover Period: <br/>
                                                Class: <br/>
                                                Underwriter: <br/>
                                            </h6>
                                        </div>
                                        <hr/>
                                        <div className={"row"} id={"view_details_tbl"}>
                                            <table className="table table-bordered">
                                                <thead className="thead-dark">
                                                <tr>
                                                    <th>Category</th>
                                                    <th>Principal Member</th>
                                                    <th>Family Member</th>
                                                    <th>Benefit</th>
                                                    <th>Limit</th>
                                                    <th>Family Size</th>
                                                    <th>Premium</th>
                                                    <th>Prorated</th>
                                                    <th>Disc %</th>
                                                    <th>Discounted</th>
                                                    <th>Load %</th>
                                                    <th>Loaded</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {memberPremiums.map((dt) => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.category}/>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.principal_name}/>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.member_name}/>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.benefit}/>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.limit}/>
                                                            </td>
                                                            <td>
                                                                <select
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="family_size[]"
                                                                    value={dt.family_size}
                                                                >
                                                                    <option value={dt.family_size}>
                                                                        {dt.family_size > 1
                                                                            ? "M + " + (dt.family_size - 1)
                                                                            : "M"}
                                                                    </option>
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.premium}/>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.prorated_prem}/>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.disc_amt}/>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.discounted_prem}/>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.load_amt}/>
                                                            </td>
                                                            <td>
                                                                <input className={"form-control"}
                                                                       value={dt.loaded_prem}/>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                                <tfoot>
                                              
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th>Totals</th>
                                                    <th>
                                                        <input value={totalTtl.length != 0 ? parseFloat(totalTtl).toLocaleString() : 0}/>
                                                    </th>
                                                    <th>
                                                            <input value={totalProratedPrem.length != 0 ? parseFloat(totalProratedPrem).toLocaleString() : 0}/>
                                                    </th>
                                                    <th></th>
                                                    <th>
                                                        <input value={totalDiscountPrem.length != 0 ? parseFloat(totalDiscountPrem).toLocaleString() : 0}/>
                                                    </th>
                                                    <th></th>
                                                    <th>
                                                        <input value={totalLoadedPrem.length != 0 ? parseFloat(totalLoadedPrem).toLocaleString() : 0}/>
                                                    </th>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                    {/* Previous button */}
                                    <input
                                        type="button"
                                        name="previous"
                                        id="query_previous"
                                        className="previous action-button-previous col-md-4 btn-info"
                                        defaultValue="Previous"
                                    />
                                    {/*Print button */}
                                    <input
                                        type="button"
                                        className="action-button btn-success col-md-4 ml-auto"
                                        value="Print"
                                        onClick={printPdf}
                                    />
                                    {/* Next button */}
                                    <input
                                        type="button"
                                        name="next"
                                        className="next action-button btn-success col-md-4 ml-auto"
                                        defaultValue="Next"
                                    />
                                </fieldset>
                                <fieldset>
                                    <div>
                                        <h2 id="headings" className="fs-title">
                                            View Summary
                                        </h2>
                                    </div>
                                    <hr/>
                                    <div className="col-md-12 col-sm-12"></div>

                                    {/* Previous button */}
                                    <input
                                        type="button"
                                        name="previous"
                                        id="query_previous"
                                        className="previous action-button-previous col-md-4 btn-info"
                                        defaultValue="Previous"
                                    />
                                    {/* Next button */}
                                    <input
                                        type="button"
                                        name="next"
                                        className="next action-button btn-success col-md-4 ml-auto"
                                        defaultValue="Next"
                                    />
                                </fieldset>
                                <fieldset>
                                    <div>
                                        <h2 id="headings" className="fs-title">
                                            Member Schedule
                                        </h2>
                                        <hr/>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row">
                                            <table className="table table-bordered">
                                                <thead className="thead-dark">
                                                <tr>
                                                    <th>Reference No</th>
                                                    <th>Principal Name</th>
                                                    <th>Member No</th>
                                                    <th>Member Name</th>
                                                    <th>Limit</th>
                                                    <th>Family Size</th>
                                                    <th>Premium</th>
                                                    <th>Prorated</th>
                                                    <th>Disc %</th>
                                                    <th>Discounted</th>
                                                    <th>Load %</th>
                                                    <th>Loaded</th>
                                                </tr>
                                                </thead>
                                                <tbody></tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {/* Previous button */}
                                    <input
                                        type="button"
                                        name="previous"
                                        id="query_previous"
                                        className="previous action-button-previous col-md-4 btn-info"
                                        defaultValue="Previous"
                                    />
                                    {/* Next button */}
                                    <input
                                        type="button"
                                        name="next"
                                        className="next action-button btn-success col-md-4 ml-auto"
                                        defaultValue="Next"
                                    />
                                </fieldset>
                                <fieldset>
                                    <h2 id="headings" className="fs-title">
                                        Payment Schedule
                                    </h2>
                                    <hr/>
                                    <div className="row ml-0">
                                        <table className="table table-bordered">
                                            <thead className="thead-dark">
                                            <tr>
                                                <th>Payable Date</th>
                                                <th>Payable Amt</th>
                                                <th>Paid</th>
                                                <th>Paid Date</th>
                                                <th>Paid Amt</th>
                                            </tr>
                                            </thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>

                                    <input
                                        type="button"
                                        name="previous"
                                        className="previous action-button-previous col-md-4 btn-info"
                                        value="Previous"
                                    />
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Modal5
                modalIsOpen={messageModal}
                header={<p id="headers">Notice Message</p>}
                body={
                    <div className={"row justify-content-center"}>
                        <h5 className={"col-md-12 text-center"}>{message}</h5>
                        <div classsName={"row"}>
                            <button className={"btn btn-outline-danger btn-sm mt-3"}
                                    onClick={() => setMessageModal(false)}>Close
                            </button>
                        </div>
                    </div>
                }/>
        </div>
    );
}
export default QueryDebit;