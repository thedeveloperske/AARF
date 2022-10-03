import React, { useState, useEffect } from "react";
import { today } from "../../../components/helpers/today";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import ModalResponse from "../../../components/helpers/Modal2";

const PayCommission = () => {
  const [response, setResponse] = useState([]);
  const [modalResponseIsOpen, setModalResponseIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [agent, setAgent] = useState("");
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState([]);
  const [voucherNos, setVoucherNos] = useState([]);
  const [cheques, setCheques] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [selectedCheque, setSelectedCheque] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [debits, setDebits] = useState([]);
  const [address, setAddress] = useState([]);
  const [visibleState, setVisibleState] = useState({
    agents: true,
    voucher: true,
    cheque: true,
    cheque_details: true,
    address: true,
    save: false,
    print: true,
  });

  const [ttls, setTtls] = useState({ chequeAmt: 0, ttlCommission: 0 });

  const closeModalResponse = () => {
    setModalResponseIsOpen(false);
  };

  useEffect(() => {
    switch (selectedOption) {
      case "0":
        setDebits([]);
        document.getElementById("ttlWhTax").value = 0;
        document.getElementById("ttlCommis").value = 0;
        setVisibleState({
          agents: true,
          voucher: true,
          cheque: true,
          cheque_details: true,
          address: true,
          save: false,
          print: true,
        });
        break;
      case "1":
        setDebits([]);
        document.getElementById("ttlWhTax").value = 0;
        document.getElementById("ttlCommis").value = 0;
        setVisibleState({
          agents: false,
          voucher: true,
          cheque: true,
          cheque_details: true,
          address: true,
          save: false,
          print: true,
        });
        break;
      case "2":
        setDebits([]);
        document.getElementById("ttlWhTax").value = 0;
        document.getElementById("ttlCommis").value = 0;
        setVisibleState({
          agents: true,
          voucher: false,
          cheque: true,
          cheque_details: false,
          address: true,
          save: false,
          print: true,
        });
        break;
      case "3":
        setDebits([]);
        document.getElementById("ttlWhTax").value = 0;
        document.getElementById("ttlCommis").value = 0;
        setVisibleState({
          agents: true,
          voucher: true,
          cheque: false,
          cheque_details: true,
          address: false,
          save: true,
          print: false,
        });
        break;
    }
  }, [selectedOption]);

  useEffect(() => {
    getData("fetch_agents_to_pay_commission").then((data) => {
      setAgents(data);
    });
    getData("fetch_voucher_nos_to_attach_cheque").then((data) => {
      setVoucherNos(data);
    });
    getData("fetch_bank_accounts").then((data) => {
      setBankAccounts(data);
    });
    getData("fetch_cheques_commission").then((data) => {
      setCheques(data);
    });
    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
  }, []);

  useEffect(() => {
    let ttlComm = 0.0;
    let ttlWhTax = 0.0;

    if (selectedAgent != 0) {
      getOneData("fetch_debits_not_paid_commission", selectedAgent).then(
        (data) => {
          setDebits(data);
          // total commission
          const comInputs = document.querySelectorAll(
            "input[name='commission[]']"
          );
          comInputs.forEach((element) => {
            ttlComm += parseFloat(element.value);
          });
          // total wh_tax
          const whtaxInputs = document.querySelectorAll(
            "input[name='wh_tax[]']"
          );
          whtaxInputs.forEach((element) => {
            ttlWhTax += parseFloat(element.value);
          });
          document.getElementById("ttlWhTax").value = ttlWhTax.toLocaleString();
          document.getElementById("ttlCommis").value = ttlComm.toLocaleString();
          document.getElementById("cheque_amount").value =
            ttlComm.toLocaleString();
          document.getElementById("total_commission").value = (
            ttlComm + ttlWhTax
          ).toLocaleString();

          setTtls({ chequeAmt: ttlComm, ttlCommission: ttlComm + ttlWhTax });
        }
      );
    }
  }, [selectedAgent]);

  useEffect(() => {
    let ttlComm = 0.0;
    let ttlWhTax = 0.0;

    if (selectedVoucher != 0) {
      getOneData("fetch_debits_paid_to_attach_cheque", selectedVoucher).then(
        (data) => {
          setDebits(data.debits);
          setAgent(data.agent);

          // total allocated
          const comInputs = document.querySelectorAll(
            "input[name='commission[]']"
          );
          comInputs.forEach((element) => {
            ttlComm += parseFloat(element.value);
          });
          // total wh_tax
          const whtaxInputs = document.querySelectorAll(
            "input[name='wh_tax[]']"
          );
          whtaxInputs.forEach((element) => {
            ttlWhTax += parseFloat(element.value);
          });
          document.getElementById("ttlWhTax").value = ttlWhTax.toLocaleString();
          document.getElementById("ttlCommis").value = ttlComm.toLocaleString();
          document.getElementById("cheque_amount").value =
            ttlComm.toLocaleString();
          document.getElementById("total_commission").value = (
            ttlComm + ttlWhTax
          ).toLocaleString();
          setTtls({ chequeAmt: ttlComm, ttlCommission: ttlComm + ttlWhTax });
        }
      );
    }
  }, [selectedVoucher]);

  useEffect(() => {
    let ttlComm = 0.0;
    let ttlWhTax = 0.0;
    if (selectedCheque != 0) {
      getOneData("fetch_debits_for_cheque", selectedCheque).then((data) => {
        setDebits(data);
        // total allocated
        const comInputs = document.querySelectorAll(
          "input[name='commission[]']"
        );
        comInputs.forEach((element) => {
          ttlComm += parseFloat(element.value);
        });
        // total wh_tax
        const whtaxInputs = document.querySelectorAll("input[name='wh_tax[]']");
        whtaxInputs.forEach((element) => {
          ttlWhTax += parseFloat(element.value);
        });
        document.getElementById("ttlWhTax").value = ttlWhTax.toLocaleString();
        document.getElementById("ttlCommis").value = ttlComm.toLocaleString();
      });
    }
  }, [selectedCheque]);

  const fetchCommission = (e) => {
    let ttlComm = 0.0;
    let ttlWhTax = 0.0;

    const row = e.target.closest("tr");
    const tds = row.children;

    if (e.target.checked) {
      const data = [];
      const frmData = new FormData();

      for (let i = 0; i < tds.length; i++) {
        const inputValue = tds[i].children[0].value;
        data.push(inputValue);
        frmData.append(i, inputValue);
      }
      postData(frmData, "fetch_commission_rate").then((data) => {
        tds[11].children[0].value = data[0].commis_rate;
        tds[12].children[0].value = data[0].wh_tax_rate;
        tds[13].children[0].value = data[0].wh_tax;
        tds[14].children[0].value = data[0].commission;

        // total allocated
        const comInputs = document.querySelectorAll(
          "input[name='commission[]']"
        );
        comInputs.forEach((element) => {
          ttlComm += parseFloat(element.value);
        });
        // total wh_tax
        const whtaxInputs = document.querySelectorAll("input[name='wh_tax[]']");
        whtaxInputs.forEach((element) => {
          ttlWhTax += parseFloat(element.value);
        });
        document.getElementById("ttlWhTax").value = ttlWhTax.toLocaleString();
        document.getElementById("ttlCommis").value = ttlComm.toLocaleString();
        document.getElementById("cheque_amount").value =
          ttlComm.toLocaleString();
        document.getElementById("total_commission").value = (
          ttlComm + ttlWhTax
        ).toLocaleString();
      });
    } else {
      tds[11].children[0].value = 0;
      tds[12].children[0].value = 0;
      tds[13].children[0].value = 0;
      tds[14].children[0].value = 0;

      // total allocated
      const comInputs = document.querySelectorAll("input[name='commission[]']");
      comInputs.forEach((element) => {
        ttlComm += parseFloat(element.value);
      });
      // total wh_tax
      const whtaxInputs = document.querySelectorAll("input[name='wh_tax[]']");
      whtaxInputs.forEach((element) => {
        ttlWhTax += parseFloat(element.value);
      });
      document.getElementById("ttlWhTax").value = ttlWhTax.toLocaleString();
      document.getElementById("ttlCommis").value = ttlComm.toLocaleString();
      document.getElementById("cheque_amount").value = ttlComm.toLocaleString();

      document.getElementById("total_commission").value = (
        ttlComm + ttlWhTax
      ).toLocaleString();
    }
  };

  const saveCommission = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmCommission"));
    const paidCheckBox = document.querySelectorAll(".paid");

    paidCheckBox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("paid[]", "1");
      } else {
        frmData.append("paid[]", "0");
      }
    });

    frmData.append("options", selectedOption);
    frmData.append("voucher_no", selectedVoucher);
    frmData.append("user", localStorage.getItem("username"));
    frmData.append("cheque_amount_raw", ttls.chequeAmt);
    frmData.append("total_commission_raw", ttls.ttlCommission);

    postData(frmData, "update_commission_pay").then((data) => {
      setResponse(data[0]);
      setModalResponseIsOpen(true);
    });
  };

  const printPdf = (e) => {
    e.preventDefault();

    let page_header = `
      <ul style="list-style-type: none">
        <li>${address.client_name}</li>
        <li>${address.physical_location}</li>
        <li>${address.box_no}</li>
        <li>${address.tel_cell}</li>
        <li>${address.fax}</li>
        <li>${address.email}</li>
        <li>${address.url}</li>
      </ul>
   `;

    let tbl_head = "";
    let tbl_body = "";

    const header = document.querySelector("#payCommisTbl thead").children;
    for (let trs of header) {
      tbl_head += `
        <tr>        
          
          <th>${trs.children[3].textContent}</th>
          <th>${trs.children[4].textContent}</th>
          <th>${trs.children[5].textContent}</th>
          <th>${trs.children[6].textContent}</th>
          <th>${trs.children[7].textContent}</th>
          <th>${trs.children[8].textContent}</th>
          <th>${trs.children[9].textContent}</th>
          <th>${trs.children[10].textContent}</th>
          <th>${trs.children[11].textContent}</th>
          <th>${trs.children[12].textContent}</th>
          <th>${trs.children[13].textContent}</th>
          <th>${trs.children[14].textContent}</th>
        </tr>
      `;
    }

    const body = document.querySelector("#payCommisTbl tbody").children;
    for (let trs of body) {
      tbl_body += `
        <tr>         
          
          <td>${trs.children[3].children[0].value}</td>
          <td>${trs.children[4].children[0].value}</td>
          <td>${trs.children[5].children[0].value}</td>
          <td>${trs.children[6].children[0].value}</td>
          <td>${trs.children[7].children[0].value}</td>
          <td>${trs.children[8].children[0].value}</td>
          <td>${trs.children[9].children[0].value}</td>
          <td>${trs.children[10].children[0].value}</td>
          <td>${trs.children[11].children[0].value}</td>
          <td>${trs.children[12].children[0].value}</td>
          <td>${trs.children[13].children[0].value}</td>
          <td>${trs.children[14].children[0].value}</td>
        </tr>
      `;
    }

    var footer = document.querySelector("#payCommisTbl tfoot").children;
    footer = footer[0].children;
    // return console.log(footer)
    let tbl_foot = `
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
          <th>${footer[9].textContent}</th>
          <th>${footer[10].children[0].value}</th>
          <th>${footer[11].children[0].value}</th>
        </tr>
      `;

    let j = `
    <div class="row">
    <p class="col-md-4" style="font-weight:bold;text-align:right;">${page_header}</p>
    <br><br><br>
    <div><table><thead>${tbl_head}</thead><tbody>${tbl_body}</tbody><tfoot>${tbl_foot}</tfoot></table></div>
    <br><br><br>
    <p>Prepared By: <u>${localStorage.getItem('username')}</u></p>
    <p>Received By: __________________________   Date Received: __________________________</p>
    </div>
    `;

    var val = htmlToPdfmake(j);
    var dd = {
      pageOrientation: "landscape",
      pageMargins: [40, 60, 40, 60],
      content: val,
      pageSize: "A4",
    };
    pdfMake.createPdf(dd).download();
  };
  return (
    <div>
      <div className="container">
        <p className="text-info h2">Pay Commission</p>       
        <hr />
        <div className="row">
          <div className="col-md-3">
            <select
              className="form-control"
              defaultValue="0"
              id="options"
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option disabled value="0">
                Select Task
              </option>
              <option value="1">Pay</option>
              <option value="2">Voucher</option>
              <option value="3">Cheque</option>
            </select>
          </div>
          <div className="col-md-3" hidden={visibleState.agents}>
            <select
              className="form-control"
              defaultValue="0"
              id="agents"
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              <option disabled value="0">
                Select Agents
              </option>
              {agents.map((data) => {
                return <option value={data.agent_id}>{data.agent_name}</option>;
              })}
            </select>
          </div>
          <div className="col-md-3" hidden={visibleState.voucher}>
            <select
              className="form-control"
              defaultValue="0"
              id="vouchers"
              onChange={(e) => setSelectedVoucher(e.target.value)}
            >
              <option disabled value="0">
                Select Voucher
              </option>
              {voucherNos.map((data) => {
                return (
                  <option value={data.commis_vno}>{data.commis_vno}</option>
                );
              })}
            </select>
          </div>
          <div className="col-md-5" hidden={visibleState.voucher}>
            <span className="alert alert-light">{agent}</span>
          </div>

          <div className="col-md-3" hidden={visibleState.cheque}>
            <select
              className="form-control"
              defaultValue="0"
              id="cheques"
              onChange={(e) => setSelectedCheque(e.target.value)}
            >
              <option disabled value="0">
                Select Cheque
              </option>
              {cheques.map((data) => {
                return (
                  <option value={data.payment_no}>{data.cheque_no}</option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="col-md-4 float-right" hidden={visibleState.address}>
        <h6>{address.client_name}</h6>
        <h6>{address.physical_location}</h6>
        <h6>{address.box_no}</h6>
        <h6>{address.tel_cell}</h6>
        <h6>{address.fax}</h6>
        <h6>{address.email}</h6>
        <h6>{address.url}</h6>
      </div>
      <form id="frmCommission" onSubmit={saveCommission}>
        <div className="card col-md-12" hidden={visibleState.cheque_details}>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group row ml-0 ">
                <label
                  htmlFor="cheque_no"
                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                >
                  Cheque No
                  <span className="required">*</span>
                </label>
                <div className="col-sm-2">
                  {selectedOption == "2" ? (
                    <input
                      type="text"
                      className="form-control"
                      name="cheque_no"
                      id="cheque_no"
                      required="true"
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      name="cheque_no"
                    />
                  )}
                </div>
                <label
                  htmlFor="Cheque_date"
                  className="col-form-label col-sm-2 label-align pr-0 pl-0"
                >
                  Cheque Date
                </label>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    name="cheque_date"
                    defaultValue={today()}
                  />
                </div>
                <label
                  htmlFor="deduction"
                  className="col-form-label col-md-2 label-align pr-0 pl-0"
                >
                  Deduction
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    name="deduction"
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="payment"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Payment
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    id="payment"
                    value="AGENT COMMISSION"
                    readOnly
                  />
                </div>

                <label
                  htmlFor="bank"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Bank
                </label>
                <div className="col-md-2">
                  <select name="bank" defaultValue="0">
                    <option disabled value="0">
                      Select Bank
                    </option>
                    {bankAccounts.map((dt) => {
                      return (
                        <option value={dt.bank_id}>
                          {dt.bank +
                            " - " +
                            dt.bank_account +
                            " - " +
                            dt.currency}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <label
                  htmlFor="total_commission"
                  className="col-form-label label-align col-md-2 col-sm-2 pr-0 pl-0"
                >
                  Total Commission
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    name="total_commission"
                    id="total_commission"
                    readOnly
                  />
                </div>
              </div>
              <div className="form-group row ml-0">
                <label
                  htmlFor="cheque_amount"
                  className="col-form-label label-align col-md-2 pr-0 pl-0"
                >
                  Cheque Amount
                </label>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    name="cheque_amount"
                    id="cheque_amount"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card col-md-12">
          <table
            className="table table-bordered"
            id="payCommisTbl"
            style={{ maxHeight: "300px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th className="hidden">Agent Type</th>
                <th className="hidden">Id Key</th>
                <th className="hidden">New Renewal</th>
                <th>Invoice No</th>
                <th>Corporate</th>
                <th>Member Names</th>
                <th>Class</th>
                <th>Net Premium</th>
                <th>Allocated</th>
                <th>Allocate Amt</th>
                <th>Paid</th>
                <th>Commis Rate</th>
                <th>Wh Tax Rate</th>
                <th>Wh Tax</th>
                <th>Commission Amt</th>
              </tr>
            </thead>
            <tbody>
              {debits.map((dt) => {
                return (
                  <tr key={dt.id_key}>
                    <td className="hidden">
                      <input
                        className="form-control"
                        type="text"
                        name="agent_type[]"
                        value={dt.agent_type}
                      />
                    </td>
                    <td className="hidden">
                      <input
                        className="form-control"
                        type="text"
                        name="id_key[]"
                        value={dt.id_key}
                      />
                    </td>
                    <td className="hidden">
                      <input
                        className="form-control"
                        type="text"
                        name="new_renewal[]"
                        value={dt.new_renewal}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        name="invoice_no[]"
                        value={dt.invoice_no}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        name="corporate[]"
                        value={dt.corporate}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        name="names[]"
                        value={dt.names}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        name="class[]"
                        value={dt.class}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        name="net_premium[]"
                        value={dt.net_premium}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="checkbox"
                        checked="true"
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        name="allocated_amt[]"
                        value={dt.allocated_amt}
                      />
                    </td>
                    <td>
                      {dt.paid === "1" ? (
                        <input
                          className="form-control paid"
                          type="checkbox"
                          checked="true"
                        />
                      ) : (
                        <input
                          className="form-control paid"
                          type="checkbox"
                          onChange={fetchCommission}
                        />
                      )}
                    </td>
                    <td>
                      <input
                        className="form-control"
                        name="commis_rate[]"
                        value={dt.commis_rate !== null ? dt.commis_rate : 0}
                        type="text"
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        value={dt.wh_tax_rate !== null ? dt.wh_tax_rate : 0}
                        name="wh_tax_rate[]"
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        value={dt.wh_tax !== null ? dt.wh_tax : 0}
                        name="wh_tax[]"
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="text"
                        name="commission[]"
                        value={dt.commission !== null ? dt.commission : 0}
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
                <th>Totals</th>
                <th>
                  <input
                    className="form-control"
                    type="text"
                    id="ttlWhTax"
                    readOnly
                  />
                </th>
                <th>
                  <input
                    className="form-control"
                    type="text"
                    id="ttlCommis"
                    readOnly
                  />
                </th>
              </tr>
            </tfoot>
          </table>
          <div className="col-md-12" hidden={visibleState.address}>
            <div className="form-group row ml-0 ">
              <label
                htmlFor="cheque_no"
                className="col-form-label col-sm-2 label-align pr-0 pl-0"
              >
                Prepared By:
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  value={localStorage.getItem('username')}
                  style={{ borderWidth: "0px 0px 1px 0px" }}
                  readOnly
                />
              </div>
            </div>
            <div className="form-group row ml-0 ">
              <label
                htmlFor="cheque_no"
                className="col-form-label col-sm-2 label-align pr-0 pl-0"
              >
                Received By:
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  style={{ borderWidth: "0px 0px 1px 0px" }}
                  readOnly
                />
              </div>
              <label
                htmlFor="cheque_no"
                className="col-form-label col-sm-2 label-align pr-0 pl-0"
              >
                Date Received:
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  style={{ borderWidth: "0px 0px 1px 0px" }}
                  readOnly
                />
              </div>
            </div>
          </div>
          <p>
            <input
              className="btn btn-info col-2"
              type="submit"
              value="save"
              hidden={visibleState.save}
            />
            <input
              className="btn btn-success col-2"
              type="button"
              value="print"
              onClick={printPdf}
              hidden={visibleState.print}
            />
          </p>
        </div>
      </form>
      <ModalResponse
        background="#0047AB"
        modalIsOpen={modalResponseIsOpen}
        closeModal={closeModalResponse}
        body={<p className="text-white text-weight-bold">{response}</p>}
      />
    </div>
  );
};

export default PayCommission;
