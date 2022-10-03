import Modal1 from "../../components/helpers/Modal4";
import Modal2 from "../../components/helpers/Modal3";
import ModalResponse from "../../components/helpers/Modal2";
import { useState, useEffect } from "react";
import ImportScripts from "../../components/helpers/ImportScripts";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";

import {
  getData,
  getOneData,
  getTwoData,
  postData,
} from "../../components/helpers/Data";

import { today } from "../../components/helpers/today";
import { today2 } from "../../components/helpers/today";

const Quotation = () => {
  ImportScripts("/dist/js/claims_stepwise_forms.js");
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);
  const [agents, setAgents] = useState([]);
  const [clientTypes, setClientTypes] = useState([]);
  const [clientAddress, setClientAddress] = useState([]);
  const [choosenOption, setChoosenOption] = useState([]);
  const [hidden, setHidden] = useState({
    intermediary: true,
    adjustments: true,
    addProduct: true,
    print_quote_rates: true,
    print_quote_details: true,
    save: true,
    update: true,
  });
  const [choosenAgent, setChoosenAgent] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [quoteData, setQuoteData] = useState([]);
  const [quoteDetails, setQuoteDetails] = useState([]);
  const [quoteRates, setQuoteRates] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sharing, setSharing] = useState([]);
  const [newBenefit, setNewBenefit] = useState([]);
  const [newProduct, setNewProduct] = useState([]);
  const [response, setResponse] = useState([]);
  const [leviesCheck, setLeviesCheck] = useState({ ira: false, iiu: false });
  let ttlAdj = 0;
  const [levies, setLevies] = useState({
    ira: 0.0,
    iiu: 0.0,
    quoteTtl: 0.0,
    premiumNet: 0.0,
    quoteNet: 0.0,
  });
  const [calculations, setCalculations] = useState({
    premium: 0.0,
    fam_count: 0,
    total: 0.0,
    adjusted_rate: 0,
  });
  const [choosenAdd, setChoosenAdd] = useState({
    health_plan_add: 0,
    product_name_add: 0,
  });

  const [choosenDiscounts, setChoosenDiscounts] = useState({
    disc: 0.0,
    health_disc: "",
    product_disc: 0,
  });
  const [choosenLoading, setChoosenLoading] = useState({
    load: 0.0,
    health_load: "",
    product_load: 0,
  });

  const closeModal1 = () => {
    setIsModal1Open(false);
  };
  const closeModal2 = () => {
    setIsModal2Open(false);
  };
  const closeModal3 = () => {
    setIsModal3Open(false);
  };

  useEffect(() => {
    ttlAdj = 0
    switch (choosenOption) {
      case "0":
        setQuoteData([]);
        setQuoteDetails([]);
        setQuoteRates([]);
        setHidden({
          intermediary: true,
          adjustments: false,
          addProduct: true,
          print_quote_rates: true,
          print_quote_details: true,
          save: true,
          update: true,
        });
        break;
      case "1":
        setQuoteData([]);
        setQuoteDetails([]);
        setQuoteRates([]);
        setHidden({
          intermediary: true,
          adjustments: false,
          addProduct: false,
          print_quote_rates: true,
          print_quote_details: true,
          save: false,
          update: true,
        });
        break;
      case "2":
        setNewBenefit([]);
        setNewProduct([]);
        setHidden({
          intermediary: false,
          adjustments: true,
          addProduct: true,
          print_quote_rates: true,
          print_quote_details: true,
          save: true,
          update: true,
        });
        break;
    }
  }, [choosenOption]);

  const fetchQuotation = (e) => {
    setQuotes([]);
    setQuoteData([]);
    setQuoteDetails([]);
    e.preventDefault();
    if (choosenAgent != 0) {
      getOneData("fetch_quotes", choosenAgent).then((data) => {
        if (data.length != 0) {
          setQuotes(data);
          setIsModal1Open(true);
        } else {
          setResponse("No quotations available!");
          setIsModal3Open(true);
        }
      });
    } else {
      setResponse("Choose an agent to proceed!");
      setIsModal3Open(true);
    }
  };

  useEffect(() => {
    getData("fetch_agents").then((data) => {
      setAgents(data);
    });
    getData("fetch_client_types").then((data) => {
      setClientTypes(data);
    });
    getData("fetch_benefits").then((data) => {
      setBenefits(data);
    });
    getData("fetch_products").then((data) => {
      setProducts(data);
    });
    getData("fetch_sharing").then((data) => {
      setSharing(data);
    });
    getData("fetch_categories").then((data) => {
      setCategories(data);
    });
    getOneData("fetch_client_address", 4).then((data) => {
      setClientAddress(data);
    });
  }, []);

  const openModal2 = (e) => {
    e.preventDefault();
    setIsModal2Open(true);
  };

  const getQuoteDetails = (e) => {
    setIsModal1Open(false);
    const data = [];
    const row = e.target.closest("tr");
    const tds = row.children;
    for (let td of tds) {
      data.push(td.textContent);
      setHidden({
        ...hidden,
        save: true,
        update: true,
        print_quote_details: false,
        print_quote_rates: false,
      });
    }
    getOneData("fetch_quote_data", data[0]).then((dt) => {
      console.log(dt);
      dt.quote.map((dat) => {
        setQuoteData(dat);
      });
      setQuoteDetails(dt.quote_details);
      setQuoteRates(dt.quote_rates);
    });
  };

  const fetchProduct = (e) => {
    e.preventDefault();
    if (
      document.getElementById("health_plan_add").value != 0 &&
      document.getElementById("product_name_add").value != 0
    ) {
      let exists = 0;
      const tbl = document.querySelector("#quote_rate tbody").children;
      for (let trs of tbl) {
        const health_p = trs.children[1].children[0].value;
        const product_n = trs.children[2].children[0].value;
        if (
          health_p == choosenAdd.health_plan_add &&
          product_n == choosenAdd.product_name_add
        ) {
          exists++;
        }
      }

      if (exists == 0) {
        getTwoData(
          "fetch_product_benefits",
          choosenAdd.health_plan_add,
          choosenAdd.product_name_add
        ).then((data) => {
          const row = data.fetched_benefits.map((dt) => {
            return (
              <tr key={dt.id}>
                <td>
                  <select
                    className=""
                    value={dt.health_plan}
                    name="category_details[]"
                  >
                    <option value="0">Select Category</option>
                    {categories.map((category) => {
                      return (
                        <option value={category.category}>
                          {category.category}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td>
                  <select
                    className=""
                    value={dt.product_code}
                    name="product_name_details[]"
                  >
                    <option value="0">Select Product Name</option>
                    {products.map((pname) => {
                      return (
                        <option value={pname.code}>{pname.product_name}</option>
                      );
                    })}
                  </select>
                </td>
                <td>
                  <select
                    className=""
                    value={dt.benefit_code}
                    type="text"
                    name="benefit_details[]"
                  >
                    <option value="0">Select Benefit</option>
                    {benefits.map((dt) => {
                      return <option value={dt.CODE}>{dt.BENEFIT}</option>;
                    })}
                  </select>
                </td>
                <td>
                  <select
                    className=""
                    value={dt.sub_limit_of_code}
                    type="text"
                    name="sub_limit_of_details[]"
                  >
                    <option value="0">Select Sub Limit Of</option>
                    {benefits.map((bene) => {
                      return <option value={bene.CODE}>{bene.BENEFIT}</option>;
                    })}
                  </select>
                </td>
                <td>
                  <input
                    className=""
                    value={dt.limit}
                    type="number"
                    min="0"
                    name="limit_details[]"
                  />
                </td>
                <td>
                  <select
                    className=""
                    value={dt.sharing}
                    type="text"
                    name="sharing_details[]"
                  >
                    <option value="0">Select Sharing</option>
                    {sharing.map((dt) => {
                      return <option value={dt.CODE}>{dt.SHARING}</option>;
                    })}
                  </select>
                </td>
              </tr>
            );
          });

          setNewBenefit((newBenefit) => {
            return [...newBenefit, row];
          });
        });
      }

      const row2 = {
        id: new Date().getTime.toString(),
        new: (
          <>
            <td></td>
            <td>
              <select
                className="form-control col-md-12"
                name="category_rate[]"
                value={choosenAdd.health_plan_add}
              >
                <option disabled value="0">
                  Select Health Plan
                </option>
                {categories.map((dt) => {
                  return <option value={dt.category}>{dt.category}</option>;
                })}
              </select>
            </td>
            <td>
              <select
                className="form-control col-md-12"
                name="product_name_rate[]"
                value={choosenAdd.product_name_add}
              >
                <option disabled value="0">
                  Select Product
                </option>
                {products.map((dt) => {
                  return <option value={dt.code}>{dt.product_name}</option>;
                })}
              </select>
            </td>
            <td>
              <input type="text" name="family_size_rate[]" />
            </td>
            <td>
              <input type="number" min={1} name="min_age_rate[]" />
            </td>
            <td>
              <input type="number" min={1} name="max_age_rate[]" />
            </td>
            <td>
              <input type="text" name="family_title_rate[]" />
            </td>
            <td>
              <input
                type="number"
                min={0}
                name="premium_rate[]"
                onChange={(e) =>
                  setCalculations({ ...calculations, premium: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="number"
                min={0}
                name="family_count_rate[]"
                onChange={(e) =>
                  setCalculations({
                    ...calculations,
                    fam_count: e.target.value,
                  })
                }
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue={0}
                name="total_rate[]"
                readOnly
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue={0}
                name="adjust_rate_rate[]"
                readOnly
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue={0}
                name="adjusted_rate[]"
                readOnly
              />
            </td>
            <td>
              <input type="text" name="individual_rate[]" />
            </td>
          </>
        ),
      };
      setNewProduct((newProduct) => {
        return [...newProduct, row2];
      });
      setIsModal2Open(false);
    }
  };

  const applyDiscount = (e) => {
    e.preventDefault();
    const tbl = document.querySelector("#quote_rate tbody").children;
    for (let trs of tbl) {
      const health_p = trs.children[1].children[0].value;
      const product_n = trs.children[2].children[0].value;
      if (
        health_p == choosenDiscounts.health_disc &&
        product_n == choosenDiscounts.product_disc
      ) {
        trs.children[10].children[0].value = choosenDiscounts.disc;
        setCalculations({
          ...calculations,
          adjusted_rate: choosenDiscounts.disc,
        });
      }
    }
  };

  const applyLoading = () => {
    const tbl = document.querySelector("#quote_rate tbody").children;
    for (let trs of tbl) {
      const health_p = trs.children[1].children[0].value;
      const product_n = trs.children[2].children[0].value;
      if (
        health_p == choosenLoading.health_load &&
        product_n == choosenLoading.product_load
      ) {
        trs.children[11].children[0].value = choosenLoading.load;
      }
    }
  };

  useEffect(() => {
    var stampDuty = document.getElementById("stamp_duty").value;
    stampDuty = stampDuty.replace(/,/g, "");
    stampDuty = parseFloat(stampDuty);
    let ttl = 0.0;
    let ira = 0.0;
    let iiu = 0.0;
    const tbl = document.querySelector("#quote_rate tbody").children;
    for (let trs of tbl) {
      const premium = trs.children[7].children[0].value;
      const family_cnt = trs.children[8].children[0].value;
      const adjust_rate = trs.children[10].children[0].value;
      const total = parseFloat(premium) * parseFloat(family_cnt);
      const adjusted = total - (parseFloat(adjust_rate) / 100) * total;
      trs.children[9].children[0].value = total;
      trs.children[11].children[0].value = adjust_rate ? adjusted : total;
      ttl += parseFloat(trs.children[11].children[0].value);
    }
    if (leviesCheck.ira === true) {
      ira = 0.015 * ttl;
    } else {
      ira = 0.0;
    }
    if (leviesCheck.iiu === true) {
      iiu = 0.005 * ttl;
    } else {
      iiu = 0.0;
    }
    const qNet = ira + iiu + ttl + stampDuty;

    setLevies({
      ira: ira.toLocaleString(),
      iiu: iiu.toLocaleString(),
      quoteTtl: ttl.toLocaleString(),
      premiumNet: ttl.toLocaleString(),
      quoteNet: qNet.toLocaleString(),
    });

    document.getElementById("ttlAdjusted").value = ttl.toLocaleString();
  }, [calculations, leviesCheck]);

  const saveQuote = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("frmQuote"));
    postData(frmData, "save_quote").then((data) => {
      setResponse(data[0]);
      setIsModal3Open(true);
    });
  };

  const printQuoteRates = (e) => {
    e.preventDefault();
    let prospect = document.getElementById("prospect").value;

    let page_header = `
      <ul style="list-style-type: none">
        <li>${clientAddress[0].client_name}</li>
        <li>${clientAddress[0].physical_location}</li>
        <li>${clientAddress[0].box_no}</li>
        <li>${clientAddress[0].tel_cell}</li>
        <li>${clientAddress[0].fax}</li>
        <li>${clientAddress[0].email}</li>
        <li>${clientAddress[0].url}</li>
      </ul>
   `;
    let addons = `<ul><li>Prospect : ${prospect}</li><li>Dated : ${today2()}</ul>`;
    let tbl_head = "";
    let tbl_body = "";

    const header = document.querySelector("#quote_rate thead").children;
    for (let trs of header) {
      tbl_head += `
        <tr>
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

    const body = document.querySelector("#quote_rate tbody").children;
    for (let trs of body) {
      tbl_body += `
        <tr>
          <td>${trs.children[1].children[0].value}</td>
          <td>${
            trs.children[2].children[0].options[
              trs.children[2].children[0].selectedIndex
            ].text
          }</td>
          <td>${trs.children[3].children[0].value}</td>
          <td>${trs.children[4].children[0].value}</td>
          <td>${trs.children[5].children[0].value}</td>
          <td>${trs.children[6].children[0].value}</td>
          <td>${
            trs.children[7].children[0].value != ""
              ? parseFloat(trs.children[7].children[0].value).toLocaleString()
              : "0.00"
          }</td>
          <td>${trs.children[8].children[0].value}</td>
          <td>${
            trs.children[9].children[0].value != ""
              ? parseFloat(trs.children[9].children[0].value).toLocaleString()
              : "0.00"
          }</td>
          <td>${
            trs.children[10].children[0].value != ""
              ? trs.children[10].children[0].value
              : "0.00"
          }</td>
          <td>${trs.children[11].children[0].value}</td>
        </tr>
      `;
    }

    const footer = document.querySelector("#quote_rate tfoot").children;
    let tbl_foot = `
        <tr>
          <th>${footer[1].textContent}</th>
          <th>${footer[2].textContent}</th>
          <th>${footer[3].textContent}</th>
          <th>${footer[4].textContent}</th>
          <th>${footer[5].textContent}</th>
          <th>${footer[6].textContent}</th>
          <th>${footer[7].textContent}</th>
          <th>${footer[8].textContent}</th>
          <th>${footer[9].textContent}</th>
          <th>${footer[10].textContent}</th>
          <th>${footer[11].children[0].value}</th>
        </tr>
      `;

    let j = `
    <div className="row">
    <div style="text-align:right;">${page_header}</div>
    <br><br><br>
    <div style="list-style-type: none">${addons}</div>
    <div><table><thead>${tbl_head}</thead><tbody>${tbl_body}</tbody><tfoot>${tbl_foot}</tfoot></table></div>
    </div>
    `;

    var val = htmlToPdfmake(j);
    var dd = { pageOrientation: "landscape", content: val };
    pdfMake.createPdf(dd).download();
  };
  const printQuoteDetails = (e) => {
    e.preventDefault();
    let prospect = document.getElementById("prospect").value;

    let page_header = `
      <ul style="list-style-type: none">
        <li>${clientAddress[0].client_name}</li>
        <li>${clientAddress[0].physical_location}</li>
        <li>${clientAddress[0].box_no}</li>
        <li>${clientAddress[0].tel_cell}</li>
        <li>${clientAddress[0].fax}</li>
        <li>${clientAddress[0].email}</li>
        <li>${clientAddress[0].url}</li>
      </ul>
   `;
    let addons = `<ul><li>Prospect : ${prospect}</li><li>Dated : ${today2()}</ul>`;
    let tbl_head = "";
    let tbl_body = "";

    const header = document.querySelector("#quote_details thead").children;
    for (let trs of header) {
      tbl_head += `
        <tr>
        <th>${trs.children[0].textContent}</th>         
          <th>${trs.children[1].textContent}</th>
          <th>${trs.children[2].textContent}</th>
          <th>${trs.children[3].textContent}</th>
          <th>${trs.children[4].textContent}</th>
          <th>${trs.children[5].textContent}</th>
        </tr>
      `;
    }

    const body = document.querySelector("#quote_details tbody").children;
    for (let trs of body) {
      tbl_body += `
        <tr>
          <td>${trs.children[0].children[0].value}</td>          
          <td>${
            trs.children[1].children[0].options[
              trs.children[1].children[0].selectedIndex
            ].text
          }</td>
          <td>${
            trs.children[2].children[0].options[
              trs.children[2].children[0].selectedIndex
            ].text
          }</td>
          <td>${
            trs.children[3].children[0].options[
              trs.children[3].children[0].selectedIndex
            ].text
          }</td>
          <td>${
            trs.children[4].children[0].value != ""
              ? parseFloat(trs.children[4].children[0].value).toLocaleString()
              : "0.00"
          }</td>
          <td>${
            trs.children[5].children[0].options[
              trs.children[5].children[0].selectedIndex
            ].text
          }</td>
        </tr>
      `;
    }

    let j = `
    <div className="row">
    <div style="text-align:right;">${page_header}</div>
    <br><br><br>
    <div style="list-style-type: none">${addons}</div>
    <div><table><thead>${tbl_head}</thead><tbody>${tbl_body}</tbody></table></div>
    </div>
    `;

    var val = htmlToPdfmake(j);
    var dd = { pageOrientation: "portrait", content: val };
    pdfMake.createPdf(dd).download();
  };

  return (
    <div>
      <div className="querycorporate">
        <p className="text-info h2">Quotation</p>
        <hr />
        <div className="container">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-4 mx-auto">
                <select
                  className="form-control col-md-12"
                  name="options"
                  defaultValue="0"
                  onChange={(e) => setChoosenOption(e.target.value)}
                >
                  <option disabled value="0">
                    Select Option
                  </option>
                  <option value="1">Make Quote </option>
                  <option value="2">Query Quote</option>
                </select>
              </div>
              <div className="col-md-4 mx-auto" hidden={hidden.intermediary}>
                <select
                  className="form-control col-md-12"
                  name="Intermediary"
                  defaultValue="0"
                  onChange={(e) => setChoosenAgent(e.target.value)}
                >
                  <option disabled value="0">
                    Select Intermediary
                  </option>
                  {agents.map((dt) => {
                    return <option value={dt.AGENT_ID}>{dt.AGENT_NAME}</option>;
                  })}
                </select>
              </div>
              <div className="col-md-4 mx-auto" hidden={hidden.intermediary}>
                <button
                  className="btn btn-info form-control"
                  onClick={fetchQuotation}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section id="member_tabs" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <form
                className="claims_form mt-1"
                id="frmQuote"
                onSubmit={saveQuote}
              >
                {/* progressbar */}
                <ul id="progressbar" className="col-md-12">
                  <li className="active">Summary</li>
                  <li>Details</li>
                  {/* <li>View</li>
                  <li>Premium</li> */}
                </ul>
                <fieldset>
                  <div className="col-md-12 col-sm-12">
                    <div
                      className="row col-md-12 col-sm-12 pr-0 pl-0 ml-0"
                      id="step-1"
                    >
                      <div className="col-md-8 col-sm-8">
                        <div className="form-group row ml-0">
                          <h6 className="header smaller center">
                            Quote Details
                          </h6>
                        </div>
                        <div className="form-group row ml-0 ">
                          <label
                            htmlFor="quote_no"
                            className="col-form-label col-sm-2 label-align pr-0 pl-0"
                          >
                            Quote No
                            <span className="required">*</span>
                          </label>
                          <div className="col-sm-4">
                            <input
                              type="text"
                              className="form-control"
                              name="quote_no"
                              required="true"
                              id="quote_no"
                              defaultValue={quoteData.quote_no}
                              readOnly
                            />
                          </div>
                          <label
                            htmlFor="prospect"
                            className="col-form-label col-sm-2 label-align pr-0 pl-0"
                          >
                            Prospect
                            <span className="required">*</span>
                          </label>
                          <div className="col-md-4 col-sm-4">
                            <input
                              type="text"
                              className="form-control"
                              name="prospect"
                              required="true"
                              id="prospect"
                              defaultValue={quoteData.prospect}
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0 ">
                          <label
                            htmlFor="agent"
                            className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                          >
                            Agent
                          </label>
                          <div className="col-md-4 col-sm-4 ">
                            <select
                              className="form-control col-md-12"
                              name="agent"
                              value={quoteData.agent_id}
                              defaultValue="0"
                            >
                              <option disabled value="0">
                                Select Intermediary
                              </option>
                              {agents.map((dt) => {
                                return (
                                  <option value={dt.AGENT_ID}>
                                    {dt.AGENT_NAME}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <label
                            htmlFor="quote_date"
                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                          >
                            Quote Date
                          </label>
                          <div className="col-md-4 col-sm-4">
                            <input
                              type="date"
                              className="form-control"
                              id="quote_date"
                              name="quote_date"
                              defaultValue={
                                quoteData.quote_date
                                  ? quoteData.quote_date
                                  : today2()
                              }
                            />
                          </div>
                        </div>

                        <div className="form-group row ml-0">
                          <label
                            htmlFor="postal_address"
                            className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                          >
                            Postal Address
                          </label>
                          <div className="col-md-4 col-sm-4 ">
                            <input
                              type="text"
                              className="form-control"
                              id="postal_address"
                              name="postal_address"
                              defaultValue={quoteData.address}
                            />
                          </div>
                          <label
                            htmlFor="client_type"
                            className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                          >
                            Client Type
                          </label>
                          <div className="col-md-4 col-sm-4">
                            <select
                              className="form-control col-md-12"
                              name="client_type"
                              value={quoteData.individual}
                              defaultValue="0"
                            >
                              <option disabled value="0">
                                Select Client Type
                              </option>
                              {clientTypes.map((dt) => {
                                return (
                                  <option value={dt.code}>
                                    {dt.client_type}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="form-group row ml-0 ">
                          <label
                            htmlFor="physical_location"
                            className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                          >
                            Physical Location
                          </label>
                          <div className="col-md-4 col-sm-4">
                            <input
                              type="text"
                              className="form-control"
                              name="physical_location"
                              id="physical_location"
                              defaultValue={quoteData.physical_location}
                            />
                          </div>
                          <label
                            htmlFor="date_entered"
                            className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                          >
                            Date Entered
                          </label>
                          <div className="col-md-4 col-sm-4">
                            <input
                              type="text"
                              className="form-control"
                              id="date_entered"
                              name="date_entered"
                              value={
                                quoteData.date_entered
                                  ? quoteData.date_entered
                                  : today()
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="username"
                            className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                          >
                            Username
                          </label>
                          <div className="col-md-4 col-sm-4">
                            <input
                              type="text"
                              className="form-control"
                              name="username"
                              id="username"
                              value={
                                quoteData.user_id
                                  ? quoteData.user_id
                                  : localStorage.getItem("username")
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-4">
                        <div className="form-group row ml-0">
                          <h6 className="header smaller center">Adjustments</h6>
                        </div>
                        <div className="form-group row ml-0 ">
                          <label
                            htmlFor="ira"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            IRA
                          </label>
                          <div className="col-md-9">
                            <input
                              type="text"
                              className="form-control"
                              name="ira"
                              required="true"
                              value={quoteData.ira ? quoteData.ira : levies.ira}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="iiu"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            IIU
                          </label>
                          <div className="col-md-9">
                            <input
                              type="text"
                              className="form-control"
                              name="iiu"
                              required="true"
                              value={quoteData.iiu ? quoteData.iiu : levies.iiu}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="stamp_duty"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            Stamp Duty
                          </label>
                          <div className="col-md-9 col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              name="stamp_duty"
                              id="stamp_duty"
                              defaultValue={
                                quoteData.sd
                                  ? quoteData.sd
                                  : (35000).toLocaleString()
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="quote_total"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            Quote Total
                          </label>
                          <div className="col-md-9 col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              name="quote_total"
                              id="quote_total"
                              value={
                                quoteData.quote_total
                                  ? quoteData.quote_total
                                  : levies.quoteTtl
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="premium_net"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            Premium Net
                          </label>
                          <div className="col-md-9 col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              name="premium_net"
                              id="premium_net"
                              value={
                                quoteData.premium_net
                                  ? quoteData.premium_net
                                  : levies.premiumNet
                              }
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group row ml-0">
                          <label
                            htmlFor="quote_net"
                            className="col-form-label col-md-3 label-align pl-0 pr-0"
                          >
                            Quote Net
                          </label>
                          <div className="col-md-9 col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              name="quote_net"
                              id="quote_net"
                              value={
                                quoteData.quote_net
                                  ? quoteData.quote_net
                                  : levies.quoteNet
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Next button */}
                  <input
                    type="button"
                    name="next"
                    className="next btn-info col-3 text-white"
                    defaultValue="Next"
                  />
                </fieldset>
                <fieldset>
                  <div className="col-md-12 text-info">
                    <span>Quote Rates</span>
                    <hr />
                  </div>
                  <div className="table-responsive" id="quote_rates">
                    <div
                      className="col-2 addProduct"
                      hidden={hidden.addProduct}
                    >
                      <button
                        className="btn btn-info form-control"
                        onClick={openModal2}
                      >
                        Add Product
                      </button>
                    </div>
                    <table
                      className="table table-bordered table-hover"
                      id="quote_rate"
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th>Quote No</th>
                          <th>Health Plan</th>
                          <th>Product Name</th>
                          <th>Family Size</th>
                          <th>Min Age</th>
                          <th>Max Age</th>
                          <th>Family Title</th>
                          <th>Premium</th>
                          <th>Family Count</th>
                          <th>Total</th>
                          <th>Adjust Rate</th>
                          <th>Adjusted</th>
                          <th>Individual</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteRates.map((dt) => {
                          ttlAdj += parseFloat(dt.adjusted);
                          return (
                            <tr>
                              <td>
                                <input type="text" value={dt.quote_no} />
                              </td>
                              <td>
                                <input type="text" value={dt.health_plan} />
                              </td>
                              <td>
                                <select
                                  className="col-md-12"
                                  value={dt.product_name}
                                  defaultValue="0"
                                >
                                  <option disabled value="0">
                                    Select Product
                                  </option>
                                  {products.map((dt) => {
                                    return (
                                      <option value={dt.code}>
                                        {dt.product_name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td>
                                <input type="text" value={dt.family_size} />
                              </td>
                              <td>
                                <input type="text" value={dt.min_age} />
                              </td>
                              <td>
                                <input type="text" value={dt.max_age} />
                              </td>
                              <td>
                                <input type="text" value={dt.family_title} />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={dt.premium ? dt.premium : 0}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={dt.family_count ? dt.family_count : 0}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={dt.total ? dt.total : 0}
                                />
                              </td>
                              <td>
                                <input type="text" value={dt.re_rate} />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={parseFloat(
                                    dt.adjusted
                                  ).toLocaleString()}
                                />
                              </td>
                              <td>
                                <input type="text" value={dt.individual} />
                              </td>
                            </tr>
                          );
                        })}
                        {newProduct.map((product) => {
                          return <tr key={product.id}>{product.new}</tr>;
                        })}
                      </tbody>
                      <tfoot>
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
                        <th>
                          {ttlAdj != 0 ? (
                            <input
                              className="text-success h4 font-weight-bold"
                              type="text"
                              id="ttlAdjusted"
                              value={ttlAdj.toLocaleString()}
                            />
                          ) : (
                            <input
                              className="text-success h4 font-weight-bold"
                              type="text"
                                id="ttlAdjusted"
                                defaultValue={0}
                            />
                          )}
                        </th>
                        <th></th>
                      </tfoot>
                    </table>
                  </div>
                  <div className="col-md-12 text-info">
                    <span>Quote Details</span>
                    <hr />
                  </div>
                  <div className="table-responsive">
                    <table
                      className="table table-bordered table-hover quoteDetails"
                      id="quote_details"
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th>Category</th>
                          <th>Product Name</th>
                          <th>Benefit</th>
                          <th>Sub Limit Of</th>
                          <th>Limit</th>
                          <th>Sharing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteDetails.map((dt) => {
                          return (
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  value={dt.category}
                                  readOnly
                                />
                              </td>
                              <td>
                                <select
                                  className="col-md-12"
                                  name="product_name[]"
                                  value={dt.product_name}
                                  defaultValue="0"
                                >
                                  <option disabled value="0">
                                    Select Product
                                  </option>
                                  {products.map((dt) => {
                                    return (
                                      <option value={dt.code}>
                                        {dt.product_name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td>
                                <select
                                  className="col-md-12"
                                  name="benefit[]"
                                  value={dt.benefit}
                                  defaultValue="0"
                                >
                                  <option disabled value="0">
                                    Select Benefit
                                  </option>
                                  {benefits.map((dt) => {
                                    return (
                                      <option value={dt.CODE}>
                                        {dt.BENEFIT}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td>
                                <select
                                  className="col-md-12"
                                  name="sub_limit_of[]"
                                  value={dt.sub_limit_of}
                                  defaultValue="0"
                                >
                                  <option disabled value="0">
                                    Select Sub limit Of
                                  </option>
                                  {benefits.map((dt) => {
                                    return (
                                      <option value={dt.CODE}>
                                        {dt.BENEFIT}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td>
                                <input type="text" value={dt.limit} />
                              </td>
                              <td>
                                <select
                                  className="col-md-12"
                                  name="sharing[]"
                                  value={dt.sharing}
                                  defaultValue="0"
                                >
                                  <option disabled value="0">
                                    Select Sharing
                                  </option>
                                  {sharing.map((dt) => {
                                    return (
                                      <option value={dt.CODE}>
                                        {dt.SHARING}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                        {newBenefit.map((benefit) => {
                          return <>{benefit}</>;
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div hidden={hidden.adjustments}>
                    <div className="col-md-12 text-info">
                      <span>Adjustments</span>
                      <hr />
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        htmlFor="disc"
                        className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                      >
                        Disc(%)
                      </label>
                      <div className="col-md-2 ">
                        <input
                          type="number"
                          className="form-control"
                          id="disc"
                          name="disc"
                          onChange={(e) =>
                            setChoosenDiscounts({
                              ...choosenDiscounts,
                              disc: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-2">
                        <select
                          className="form-control col-md-12"
                          defaultValue="0"
                          onChange={(e) =>
                            setChoosenDiscounts({
                              ...choosenDiscounts,
                              health_disc: e.target.value,
                            })
                          }
                        >
                          <option disabled value="0">
                            Select Health Plan
                          </option>
                          {categories.map((dt) => {
                            return (
                              <option value={dt.category}>{dt.category}</option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-control col-md-12"
                          defaultValue="0"
                          onChange={(e) =>
                            setChoosenDiscounts({
                              ...choosenDiscounts,
                              product_disc: e.target.value,
                            })
                          }
                        >
                          <option disabled value="0">
                            Select Product
                          </option>
                          {products.map((dt) => {
                            return (
                              <option value={dt.code}>{dt.product_name}</option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <button
                          className="btn btn-info form-control"
                          onClick={applyDiscount}
                        >
                          Apply Discount
                        </button>
                      </div>
                    </div>
                    <div className="row mx-auto">
                      <div className="col-md-12 text-info">
                        <span>Levy</span>
                        <hr />
                      </div>
                      <label
                        htmlFor="load"
                        className="col-form-label label-align pr-0 pl-0"
                      >
                        IRA
                      </label>
                      <div className="col-md-2 ">
                        <input
                          type="checkbox"
                          name="ira_check"
                          onChange={(e) =>
                            setLeviesCheck({
                              ...leviesCheck,
                              ira: e.target.checked,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                      <label
                        htmlFor="load"
                        className="col-form-label label-align pr-0 pl-0"
                      >
                        IIU
                      </label>
                      <div className="col-md-2 ">
                        <input
                          type="checkbox"
                          name="iiu_check"
                          onChange={(e) =>
                            setLeviesCheck({
                              ...leviesCheck,
                              iiu: e.target.checked,
                            })
                          }
                          className="form-control"
                        />
                      </div>
                    </div>
                    {/* loading option */}
                    {/* <div className="form-group row ml-0">
                      <label
                        htmlFor="load"
                        className="col-form-label col-md-2 col-sm-2 label-align pr-0 pl-0"
                      >
                        Load(%)
                      </label>
                      <div className="col-md-2 ">
                        <input
                          type="number"
                          className="form-control"
                          id="load"
                          name="load"
                          onChange={(e) =>
                            setChoosenLoading({
                              ...choosenLoading,
                              load: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-2">
                        <select
                          className="form-control col-md-12"
                          defaultValue="0"
                          onChange={(e) =>
                            setChoosenLoading({
                              ...choosenLoading,
                              health_load: e.target.value,
                            })
                          }
                        >
                          <option disabled value="0">
                            Select Health Plan
                          </option>
                          {categories.map((dt) => {
                            return (
                              <option value={dt.category}>{dt.category}</option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-control col-md-12"
                          defaultValue="0"
                          onChange={(e) =>
                            setChoosenLoading({
                              ...choosenLoading,
                              product_load: e.target.value,
                            })
                          }
                        >
                          <option disabled value="0">
                            Select Product
                          </option>
                          {products.map((dt) => {
                            return (
                              <option value={dt.code}>{dt.product_name}</option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <button
                          className="btn btn-info form-control"
                          onClick={applyLoading}
                        >
                          Apply Loading
                        </button>
                      </div>
                    </div> */}
                  </div>
                  {/* Previous button */}
                  <input
                    type="button"
                    name="previous"
                    id="previous"
                    className="previous col-3 btn-info text-white"
                    defaultValue="Previous"
                  />
                  {/*Submit button*/}
                  <input
                    hidden={hidden.save}
                    type="submit"
                    id="save"
                    className="btn-success col-3 ml-auto"
                    value="Save"
                  />
                  {/* update button */}
                  <input
                    hidden={hidden.update}
                    type="button"
                    id="update"
                    className="btn-success col-3 ml-auto"
                    value="update"
                  />
                  {/* print quote rates button */}
                  <input
                    hidden={hidden.print_quote_rates}
                    type="button"
                    id="print_quote_rates"
                    onClick={printQuoteRates}
                    className="col-3  btn-primary"
                    value="Print Quote Rates"
                  />
                  {/* print quote details button */}
                  <input
                    hidden={hidden.print_quote_details}
                    type="button"
                    id="print_quote_details"
                    onClick={printQuoteDetails}
                    className="col-3  btn-success"
                    value="Print Quote Details "
                  />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Modal1
        modalIsOpen={isModal1Open}
        closeModal={closeModal1}
        header={<p id="headers">Choose Quotation</p>}
        body={
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-sm allocatemodal">
              <thead className="thead-dark">
                <tr>
                  <th>Ref No</th>
                  <th>Prospect</th>
                  <th>Quote Date</th>
                  <th>Quote Net</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((dt) => {
                  return (
                    <tr>
                      <td>{dt.quote_no}</td>
                      <td>{dt.prospect}</td>
                      <td>{dt.quote_date}</td>
                      <td>{dt.quote_net}</td>
                      <td>
                        <input
                          type="radio"
                          className="form-control"
                          name="radio_choosen[]"
                          onClick={getQuoteDetails}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        }
      />
      <Modal2
        modalIsOpen={isModal2Open}
        closeModal={closeModal2}
        header={
          <p className="alert alert-dark font-weight-bold">Choose Product</p>
        }
        body={
          <form onSubmit={fetchProduct}>
            <div className="col-md-2">
              <select
                className="form-control col-md-12"
                name="health_plan_add"
                id="health_plan_add"
                defaultValue="0"
                onChange={(e) =>
                  setChoosenAdd({
                    ...choosenAdd,
                    health_plan_add: e.target.value,
                  })
                }
              >
                <option disabled value="0">
                  Select Health Plan
                </option>
                {categories.map((dt) => {
                  return <option value={dt.category}>{dt.category}</option>;
                })}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-control col-md-12"
                name="product_name_add"
                id="product_name_add"
                defaultValue="0"
                onChange={(e) =>
                  setChoosenAdd({
                    ...choosenAdd,
                    product_name_add: e.target.value,
                  })
                }
              >
                <option disabled value="0">
                  Select Product
                </option>
                {products.map((dt) => {
                  return <option value={dt.code}>{dt.product_name}</option>;
                })}
              </select>
            </div>
            <input
              type="submit"
              value="submit"
              className="btn btn-info form-control"
            />
          </form>
        }
      />
      <ModalResponse
        modalIsOpen={isModal3Open}
        closeModal={closeModal3}
        background="#0047AB"
        body={<p className="text-white h4 font-weight-bold">{response}</p>}
      />
    </div>
  );
};

export default Quotation;
