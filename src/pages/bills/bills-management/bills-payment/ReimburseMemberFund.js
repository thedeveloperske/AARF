import { useEffect, useState } from "react";

const ReimburseMemberFund = () => {
  const [selectedMember, setSelectedMember] = useState([]);

  useEffect(() => {}, []);
  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <select
                className="form-control"
                defaultValue="0"
                onChange={(e) => setSelectedMember(e.target.value)}
              >
                <option disabled value="0">
                  Select options
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="row">
              <div className="col-md-7">
                <div className="form-group row justify-content-center">
                  <div className="col-md-2">
                    <label className="col-form-label label-align">
                      Payment No
                    </label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="payment_no"
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="col-form-label">Cheque No</label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="cheque_no"
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="col-form-label">Cheque Date</label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="cheque_date"
                      required
                    />
                  </div>
                </div>
                <div className="form-group row justify-content-center">
                  <div className="col-md-2">
                    <label className="col-form-label label-align">
                      Provider
                    </label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="provider"
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="col-form-label">Account</label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="account"
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="col-form-label">Member Name</label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="member_name"
                      required
                    />
                  </div>
                </div>
                <div className="form-group row justify-content-center">
                  <div className="col-md-2">
                    <label className="col-form-label label-align">
                      Corporate
                    </label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="corporate"
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="col-form-label">Fund</label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="corporate"
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="col-form-label">Funded By</label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="funded_by"
                      required
                    />
                  </div>
                </div>
                <div className="form-group row justify-content-center">
                  <div className="col-md-2">
                    <label className="col-form-label label-align">
                      Admin Fee
                    </label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="admin_fee"
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="col-form-label">Notes</label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="notes"
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="col-form-label">Payrun Date</label>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      className="form-control"
                      name="payrun_date"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group row justify-content-center">
                  <div className="col-md-4">
                    <label className="col-form-label label-align">
                      Payment Mode
                    </label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="payment_mode"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="col-form-label label-align">
                      Amount Payable
                    </label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="amount_payable"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="col-form-label label-align">
                      Discounts
                    </label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="discounts"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="col-form-label label-align">
                      Tax Deduct
                    </label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="tax_deduct"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="col-form-label label-align">
                      W/H Tax
                    </label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="wh_tax"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="col-form-label label-align">
                      Cheque Amount
                    </label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      name="cheque_amount"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="card table-responsive">
          <table>
            <thead>
              <tr>
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
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReimburseMemberFund;
