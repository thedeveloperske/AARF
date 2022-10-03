import { useEffect, useState } from "react";
import { getOneData, postData } from "../../../../components/helpers/Data";
import "../../../../css/ReimburseMember.css";
import { Spinner } from "../../../../components/helpers/Spinner";

const ReimburseMember = () => {
  const [membersForReimbursment, setMembersForReimbursment] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedMember, setSelectedMember] = useState([]);
  const [memberReimbursmentData, setMemberReimbursmentData] = useState([]);
  const [ttlPayable, setTtlPayable] = useState(0.0);
  const [response, setResponse] = useState({ status: true, data: "" });

  useEffect(() => {
    clear();
    if (selectedOption.length != 0) {
      getOneData("fetch_members_reimburse", selectedOption)
        .then((data) => {
          setMembersForReimbursment(data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedOption]);

  useEffect(() => {
    clear();
    setResponse({ status: true, data: "" });
    if (selectedMember.length != 0) {
      document.getElementById("spinner").style.display = "inline";

      getOneData("fetch_bills_for_member_reimbursement", selectedMember)
        .then((data) => {
          setMemberReimbursmentData(data);
          calcTtls();
          document.getElementById("spinner").style.display = "none";
        })
        .catch((error) => console.log(error));
    }
  }, [selectedMember]);

  const selectAll = (e) => {
    e.preventDefault();
    const payCheckBox = document.querySelectorAll(".pay");
    payCheckBox.forEach((element) => {
      element.checked = true;
    });

    calcTtls();
  };

  const calculateTotals = () => {
    calcTtls();
  };
  

  const calcTtls = () => {
    let ttlVal = 0.0;
    const tbl = document.querySelector("#frmReimburse tbody").children;
    for (let trs of tbl) {
      const ch = trs.children[5].children[0].checked;
      if (ch == true) {
        const invamt = trs.children[10].children[0].value;
        ttlVal += parseFloat(invamt);
      }
    }
    setTtlPayable(ttlVal);
  };

  const reimburseMember = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("frmReimburse"));

    const payCheckBox = document.querySelectorAll(".pay");

    payCheckBox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("pay[]", "1");
      } else {
        frmData.append("pay[]", "0");
      }
    });
    frmData.append("user", localStorage.getItem("username"));
    postData(frmData, "reimburse_member").then((data) => {
      setResponse({ status: false, data: data[0] });
      setTimeout(function () {
        setResponse({ status: true, data: "" });
        clear();
      }, 5000);
      
    });
  };

  const clear = () => {
    setMemberReimbursmentData([]);
    // document.getElementById("principals").value = "0";
    setTtlPayable(0.0);
  };
  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <select
                className="form-control"
                defaultValue="0"
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option disabled value="0">
                  Select Option
                </option>
                <option value="1">Member Reimbursment</option>
                <option value="2">Member Reimbursment (fund)</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                defaultValue="0"
                id="principals"
                onChange={(e) => setSelectedMember(e.target.value)}
              >
                <option disabled value="0">
                  Select Principals
                </option>
                {membersForReimbursment.map((data) => {
                  return <option value={data.family_no}>{data.names}</option>;
                })}
              </select>
            </div>
              <span className="alert alert-success" hidden={response.status}>
                {response.data}
              </span>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="card">
          <Spinner />
          <div className="table-responsive">
            <form id="frmReimburse" onSubmit={reimburseMember}>
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th hidden="true"></th>
                    <th>Member No</th>
                    <th>Claim No</th>
                    <th>Invoice No</th>
                    <th>Service</th>
                    <th>Pay</th>
                    <th>Invoiced Amt</th>
                    <th>Deduction</th>
                    <th>Reason</th>
                    <th>Deduction Notes</th>
                    <th>Amount Payable</th>
                    <th>Invoice Date</th>
                    <th>Member Names</th>
                    <th>Foreign</th>
                    <th>Currency</th>
                    <th>Rate</th>
                    <th>Foreign Amount</th>
                  </tr>
                </thead>
                <tbody id="mem_reimburse">
                  {memberReimbursmentData.map((dt) => {
                    return (
                      <tr key={dt.id}>
                        <td hidden="true">
                          <input
                            className="form-control"
                            type="text"
                            name="id[]"
                            value={dt.id}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="member_no[]"
                            value={dt.MEMBER_NO}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="claim_no[]"
                            value={dt.CLAIM_NO}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="invoice_no[]"
                            value={dt.INVOICE_NO}
                            readOnly
                          />
                        </td>
                        <td>
                          <select
                            className="form-control"
                            name="service[]"
                            value={dt.service_code}
                            readOnly
                          >
                            <option value={dt.service_code}>
                              {dt.service}
                            </option>
                          </select>
                        </td>
                        <td>
                          <input
                            className="form-control pay"
                            type="checkbox"
                            onChange={calculateTotals}
                            value="1"
                            defaultChecked="true"
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control inv_amt"
                            type="text"
                            name="invoiced_amount[]"
                            value={dt.INVOICED_AMOUNT}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="deduction_amount[]"
                            value={dt.DEDUCTION_AMOUNT}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="deduction_reason[]"
                            value={dt.DEDUCTION_REASON}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="deduction_notes[]"
                            value={dt.DEDUCTION_NOTES}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="amount_payable[]"
                            value={dt.AMOUNT_PAYABLE}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="invoice_date[]"
                            value={dt.INVOICE_DATE}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="names[]"
                            value={dt.names}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="foreigns[]"
                            value={dt.foreigns}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="currency[]"
                            value={dt.currency}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="conversion_rate[]"
                            value={dt.conversion_rate}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="text"
                            name="foreign_amt[]"
                            value={dt.foreign_amt}
                            readOnly
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="form-group row justify-content-center">
                <div className="col-md-2">
                  <input
                    className="btn btn-info form-control"
                    type="submit"
                    value="Save"
                  />
                </div>

                <div className="col-md-1">
                  <input
                    type="button"
                    onClick={selectAll}
                    className="btn btn-outline-success form-control "
                    value="Select All"
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="col-form-label label-align">
                    Total Payable
                  </label>
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control text-success"
                    value={parseFloat(ttlPayable).toLocaleString()}
                    readOnly
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReimburseMember;
