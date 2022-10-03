import { useEffect, useState } from "react";
import { getData, postData } from "../../components/helpers/Data";
import "../../css/financeAllocate.css";
import Modal from "../../components/helpers/Modal5";
import ModalResponse from "../../components/helpers/Modal2";

const AllocateReceipts = () => {
  let indexAllocations = 0;
  let indexDebits = 0;
  let ttlAllocated = 0.0;
  let ttlLvs = 0.0;
  let ttlConti = 0.0;
  let ttlFa = 0.0;
  let ttlGi = 0.0;
  let ttlSc = 0.0;
  let totalPerDebit = 0.0;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [clientChoosen, setClientChoosen] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [family, setFamily] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [debits, setDebits] = useState([]);
  const [allocatedDebit, setAllocatedDebit] = useState([]);
  const [response, setResponse] = useState([]);
  const [visibility, setVisibility] = useState({
    corp: true,
    family: true,
    debits: true,
    allocations: true,
    fetch: true,
    receiptInfo: true,
  });
  const [receiptData, setReceiptData] = useState({
    receiptNo: "",
    receiptAmt: 0.0,
    unAllocated: 0.0,
  });
  const [ttl, setTtl] = useState({
    ttlAllocated: 0.0,
    ttlLevies: 0.0,
    ttlConti1: 0.0,
    ttlFa1: 0.0,
    ttlGi1: 0.0,
    ttlSc1: 0.0,
  });

  useEffect(() => {
    getData("fetch_corporates").then((data) => {
      setCorporates(data);
    });
    getData("fetch_finance_families").then((data) => {
      setFamily(data);
    });
  }, []);

  useEffect(() => {
    document.getElementById("corp").value = "0";
    document.getElementById("family").value = "0";
    setClientChoosen([]);
    switch (selectedOption) {
      case "1":
        setVisibility({
          corp: false,
          family: true,
          debits: true,
          allocations: true,
          fetch: false,
          receiptInfo: true,
        });
        break;
      case "2":
        setVisibility({
          corp: true,
          family: false,
          debits: true,
          allocations: true,
          fetch: false,
          receiptInfo: true,
        });
        break;
      default:
        setVisibility({
          corp: true,
          family: true,
          debits: true,
          allocations: true,
          fetch: true,
          receiptInfo: true,
        });
        break;
    }
  }, [selectedOption]);

  const getReceiptData = (e) => {
    setModalIsOpen(false);
    const data = [];
    const row = e.target.closest("tr");
    const tds = row.children;
    for (let td of tds) {
      data.push(td.textContent);
    }
    if (data[7] === "Fully allocated") {
      setResponse("This reciept is fully allocated");
      setModalIsOpen2(true);
      setVisibility({
        ...visibility,
        debits: true,
        allocations: true,
        receiptInfo: false,
      });
    } else {
      setReceiptData({
        receiptNo: data[0],
        receiptAmt: data[1],
        unAllocated: data[3],
      });
      setVisibility({
        ...visibility,
        debits: false,
        allocations: false,
        receiptInfo: false,
      });
    }
  };

  const getDebitData = (e) => {
    if (e.target.checked) {
      const data = [];
      const frmData = new FormData();

      const row = e.target.closest("tr");
      const tds = row.children;
      for (let i = 0; i < tds.length; i++) {
        data.push(tds[i].textContent);
        frmData.append(i, tds[i].textContent);
      }
      totalPerDebit =
        parseFloat(ttl.ttlAllocated) +
        parseFloat(ttl.ttlLevies) +
        parseFloat(ttl.ttlConti1) +
        parseFloat(ttl.ttlFa1) +
        parseFloat(ttl.ttlGi1) +
        parseFloat(ttl.ttlSc1);
      let currentUnalloc = parseFloat(receiptData.unAllocated) - totalPerDebit;
      if (currentUnalloc > 0) {
        frmData.append("receipt_no", receiptData.receiptNo);
        frmData.append("un_allocated", currentUnalloc);
        postData(frmData, "allocate_receipts_to_debits").then((dt) => {
          if (dt[0].Allocated.includes("fully allocated")) {
            setResponse("The debit is fully allocated!");
            setModalIsOpen2(true);
            e.target.checked = false;
          } else {
            dt.map((datas) => {
              let row = {
                id: e.target.value,
                new: datas,
              };
              setAllocatedDebit((allocatedDebit) => {
                return [...allocatedDebit, row];
              });

              // total allocated
              const allocInputs = document.querySelectorAll(
                "input[name='AllocatedAmt[]']"
              );
              allocInputs.forEach((element) => {
                ttlAllocated += parseFloat(element.value);
              });

              //total levies
              let lv = document.querySelectorAll("input[name='lvd[]']");
              lv.forEach((element) => {
                ttlLvs += parseFloat(element.value);
              });
              //total contigency
              let conti = document.querySelectorAll(
                "input[name='contigency[]']"
              );
              conti.forEach((element) => {
                ttlConti += parseFloat(element.value);
              });
              //total firstAid
              let fa = document.querySelectorAll("input[name='first_aid[]']");
              fa.forEach((element) => {
                ttlFa += parseFloat(element.value);
              });
              //total giftItems
              let gi = document.querySelectorAll("input[name='gift_items[]']");
              gi.forEach((element) => {
                ttlGi += parseFloat(element.value);
              });
              //total smartCost
              let sc = document.querySelectorAll("input[name='smart_cost[]']");
              sc.forEach((element) => {
                ttlSc += parseFloat(element.value);
              });

              setTtl({
                ttlAllocated: ttlAllocated.toFixed(2),
                ttlLevies: ttlLvs.toFixed(2),
                ttlConti1: ttlConti.toFixed(2),
                ttlFa1: ttlFa.toFixed(2),
                ttlGi1: ttlGi.toFixed(2),
                ttlSc1: ttlSc.toFixed(2),
              });
            });
          }
        });
      } else {
        setResponse("the receipt is fully allocated");
        setModalIsOpen2(true);
        e.target.checked = false;
      }
    } else {
      const r = allocatedDebit.filter((row) => row.id === e.target.value);
      if (r.length != 0) {
        let filteredAlloc = ttl.ttlAllocated - r[0].new.AllocatedAmt;
        let filteredlev = ttl.ttlLevies - r[0].new.Levied;
        let filteredconti = ttl.ttlConti1 - r[0].new.contigency;
        let filteredFa = ttl.ttlFa1 - r[0].new.first_aid;
        let filteredGi = ttl.ttlGi1 - r[0].new.gift_items;
        let filteredSc = ttl.ttlSc1 - r[0].new.smart_cost;

        setTtl({
          ttlAllocated: filteredAlloc,
          ttlLevies: filteredlev,
          ttlConti1: filteredconti,
          ttlFa1: filteredFa,
          ttlGi1: filteredGi,
          ttlSc1: filteredSc,
        });
      } else {
        setTtl({
          ttlAllocated: 0.0,
          ttlLevies: 0.0,
          ttlConti1: 0.0,
          ttlFa1: 0.0,
          ttlGi1: 0.0,
          ttlSc1: 0.0,
        });
      }
      setAllocatedDebit((allocatedDebit) => {
        return allocatedDebit.filter((row) => row.id !== e.target.value);
      });
    }
  };

  const chooseClient = (e) => {
    setAllocatedDebit([]);
    setReceipts([]);
    setDebits([]);
    setTtl({
      ttlAllocated: 0.0,
      ttlLevies: 0.0,
      ttlConti1: 0.0,
      ttlFa1: 0.0,
      ttlGi1: 0.0,
      ttlSc1: 0.0,
    });
    setVisibility({
      ...visibility,
      receiptInfo: true,
      debits: true,
      receiptInfo: true,
      allocations: true,
    });
    setClientChoosen(e.target.value);
  };

  const fetchReceipts = () => {
    if (clientChoosen.length != 0) {
      setAllocatedDebit([]);
      setReceipts([]);
      setDebits([]);
      setTtl({
        ttlAllocated: 0.0,
        ttlLevies: 0.0,
        ttlConti1: 0.0,
        ttlFa1: 0.0,
        ttlGi1: 0.0,
        ttlSc1: 0.0,
      });
      setVisibility({
        ...visibility,
        debits: true,
        allocations: true,
        receiptInfo: true,
      });
      const frmData = new FormData();
      frmData.append("client_type", selectedOption);
      frmData.append("option", clientChoosen);
      postData(frmData, "fetch_receipt_data").then((data) => {
        if (data.receipts.length != 0) {
          setReceipts(data.receipts);
          setDebits(data.debits);
          setModalIsOpen(true);
        } else {
          setResponse("No receipts to allocate");
          setModalIsOpen2(true);
        }
      });
    } else {
      setResponse("Choose corporate or principal name!");
      setModalIsOpen2(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const closeModal2 = () => {
    setModalIsOpen2(false);
  };

  const Allocate = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("allocationsFrm"));
    postData(frmData, "save_allocations").then((data) => {
      setAllocatedDebit([]);
      setReceipts([]);
      setDebits([]);
      setTtl({
        ttlAllocated: 0.0,
        ttlLevies: 0.0,
        ttlConti1: 0.0,
        ttlFa1: 0.0,
        ttlGi1: 0.0,
        ttlSc1: 0.0,
      });
      setVisibility({
        ...visibility,
        debits: true,
        allocations: true,
        receiptInfo: true,
      });
      if (data.length != 0) {
        if (data[0].includes("Allocations saved successfully")) {
          setResponse("Allocation completed successfully");
          setModalIsOpen2(true);
        } else {
          setResponse("There was an error saving allocations!");
          setModalIsOpen2(true);
        }
      } else {
        setResponse("Choose debit(s) to allocate");
        setModalIsOpen2(true);
      }
    });
  };

  return (
    <div>
      <p className="text-info h1 font-weight-bold">Finance Allocation</p>
      <hr />

      <div className="col-md-12">
        <div className="row">
          <div className="col-md-3">
            <select
              className="form-control"
              name="client_type"
              id="client_type"
              defaultValue="0"
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option disabled value="0">
                Select Client Type
              </option>
              <option value="1">Corporate</option>
              <option value="2">Family</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-control"
              name="corp"
              id="corp"
              defaultValue="0"
              hidden={visibility.corp}
              onChange={chooseClient}
            >
              <option disabled value="0">
                Select Corporate
              </option>
              {corporates.map((dt) => {
                return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
              })}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-control"
              name="family"
              id="family"
              defaultValue="0"
              hidden={visibility.family}
              onChange={chooseClient}
            >
              <option disabled value="0">
                Select Principal
              </option>
              {family.map((dt) => {
                return (
                  <option value={dt.member_no}>
                    {dt.names + " - " + dt.member_no}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="button"
              className="btn btn-info"
              value="Search"
              onClick={fetchReceipts}
              hidden={visibility.fetch}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mx-auto" hidden={visibility.receiptInfo}>
          <p className="alert alert-light text-info">
            Receipt No :{" "}
            <span className="text-success h5">{receiptData.receiptNo}</span>
            <br />
            Amount for Allocation :{" "}
            <span className="text-success h5">
              {parseFloat(receiptData.unAllocated).toLocaleString()}
            </span>
          </p>
        </div>
        <div
          className="col-md-12 card table-responsive mx-auto"
          id="card"
          hidden={visibility.debits}
        >
          <h1 id="financeP">Debit(s) to allocate to</h1>
          <table className="table table-bordered table-hover allocate">
            <thead className="thead-dark">
              <tr>
                <th>Index</th>
                <th>Debit No</th>
                <th>Premium</th>
                <th>Allocated</th>
                <th>Allocated Amt</th>
                <th>Receipt No</th>
                <th>Levies</th>
                <th>class</th>
                <th>Contigency</th>
                <th>Smart Cost</th>
                <th>Gift Items</th>
                <th>First Aid</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {debits.map((dt) => {
                indexDebits++;
                return (
                  <tr>
                    <td>{indexDebits}</td>
                    <td>{dt.invoice_no}</td>
                    <td>{dt.net_premium}</td>
                    <td>
                      <input
                        className="form-control"
                        type="checkbox"
                        value={dt.allocated}
                        checked={dt.allocated == 1 ? true : false}
                        readOnly="true"
                      />
                    </td>
                    <td>{dt.allocated_amt}</td>
                    <td>{dt.receipt_no}</td>
                    <td>{dt.levied}</td>
                    <td>{dt.class}</td>
                    <td>{dt.contigency}</td>
                    <td>{dt.smart_cost}</td>
                    <td>{dt.gift_items}</td>
                    <td>{dt.first_aid}</td>

                    <td>
                      <input
                        type="checkbox"
                        className="form-control"
                        name="debit_choosen"
                        value={indexDebits}
                        onChange={getDebitData}
                        disabled={dt.allocated == 1 ? true : false}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card col-md-12 mx-auto" hidden={visibility.allocations}>
        <h1 id="financeP">Allocations</h1>
        <div className="table-responsive">
          <form id="allocationsFrm" onSubmit={Allocate}>
            <table className="table table-bordered table-hover allocate">
              <thead className="thead-dark">
                <tr>
                  <th>Index</th>
                  <th>Debit No</th>
                  <th>Allocated</th>
                  <th>allocated Amt</th>
                  <th>Receipt No</th>
                  <th>Levies</th>
                  <th>Smart Cost</th>
                  <th>Gift Items</th>
                  <th>First Aid</th>
                  <th>Contigency</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allocatedDebit.map((dt) => {
                  indexAllocations++;
                  return (
                    <tr key={dt.id}>
                      <th>{indexAllocations}</th>
                      <th>
                        <input
                          type="text"
                          value={dt.new.DebitNo}
                          name="DebitNo[]"
                          className="form-control"
                        />
                      </th>
                      <th>
                        <input
                          type="checkbox"
                          value={dt.new.Allocated}
                          checked="true"
                          name="Allocated[]"
                          className="form-control"
                          readOnly="true"
                        />
                      </th>
                      <th>
                        <input
                          type="text"
                          value={dt.new.AllocatedAmt}
                          name="AllocatedAmt[]"
                          className="form-control"
                        />
                      </th>
                      <th>
                        <input
                          type="text"
                          value={dt.new.ReceiptNo}
                          name="ReceiptNo[]"
                          className="form-control"
                        />
                      </th>
                      <th>
                        <input
                          type="text"
                          value={dt.new.Levied}
                          name="lvd[]"
                          className="form-control"
                        />
                      </th>
                      <th>
                        <input
                          type="text"
                          value={dt.new.smart_cost}
                          name="smart_cost[]"
                          className="form-control"
                        />
                      </th>
                      <th>
                        <input
                          type="text"
                          value={dt.new.gift_items}
                          name="gift_items[]"
                          className="form-control"
                        />
                      </th>
                      <th>
                        <input
                          type="text"
                          value={dt.new.first_aid}
                          name="first_aid[]"
                          className="form-control"
                        />
                      </th>
                      <th>
                        <input
                          type="text"
                          value={dt.new.contigency}
                          name="contigency[]"
                          className="form-control"
                        />
                      </th>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr>
                  <th></th>
                  <th>Totals</th>
                  <th></th>
                  <th>
                    <input
                      type="text"
                      id="ttlAlloc"
                      className="form-control"
                      value={ttl.ttlAllocated.toLocaleString()}
                    />
                  </th>
                  <th></th>
                  <th>
                    <input
                      type="text"
                      id="ttlLevied"
                      className="form-control"
                      value={ttl.ttlLevies}
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      id="ttlSmartCost"
                      className="form-control"
                      value={ttl.ttlSc1}
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      id="ttlGiftItems"
                      className="form-control"
                      value={ttl.ttlGi1}
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      id="ttlFirstAid"
                      className="form-control"
                      value={ttl.ttlFa1}
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      id="ttlContigency"
                      className="form-control"
                      value={ttl.ttlConti1}
                    />
                  </th>
                  <th>
                    <input
                      type="submit"
                      name="btnAllocate"
                      id="btnAllocate"
                      className="btn btn-primary"
                      value="Allocate"
                    />
                  </th>
                </tr>
              </tfoot>
            </table>
          </form>
        </div>
      </div>
      <Modal
        header={<h1 id="financeP">Receipt(s) to allocate</h1>}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        body={
          <div className="table-responsive">
            <table className="table table-bordered table-hover allocatemodal">
              <thead className="thead-dark">
                <tr>
                  <th>Receipt No</th>
                  <th>Receipt Amount</th>
                  <th>allocated</th>
                  <th>Un Allocated</th>
                  <th>Receipt Date</th>
                  <th>Payment Mode</th>
                  <th>Cheque No</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((dt) => {
                  return (
                    <tr>
                      <td>{dt.receipt_no}</td>
                      <td>{dt.receipt_amount}</td>
                      <td>{dt.lc_allocated_amt}</td>
                      <td>{dt.lc_bal}</td>
                      <td>{dt.receipt_date}</td>
                      <td>{dt.payment_mode}</td>
                      <td>{dt.cheque_no}</td>
                      <td>{dt.status}</td>
                      <td>
                        <input
                          type="radio"
                          className="form-control"
                          name="radio_choosen"
                          onClick={getReceiptData}
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

      <ModalResponse
        modalIsOpen={modalIsOpen2}
        closeModal={closeModal2}
        background="#0047AB"
        body={<p className="text-white h4 font-weight-bold">{response}</p>}
      />
    </div>
  );
};

export default AllocateReceipts;
