import { useEffect, useState } from "react";
import { getData, getOneData } from "../../../../components/helpers/Data";
import { Spinner } from "../../../../components/helpers/Spinner";

const VoucherSummaryPerCorporate = () => {
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [voucherData, setVoucherData] = useState([]);

  useEffect(() => {
    getData("fetch_voucher_bills_payment")
      .then((data) => {
        setVouchers(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedVoucher.length != 0) {
      getOneData("fetch_voucher_data", selectedVoucher)
        .then((data) => {
          setVoucherData(data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedVoucher]);
  return (
    <div>
      <div className="querycorporate">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <select
                className="form-control"
                defaultValue="0"
                onChange={(e) => setSelectedVoucher(e.target.value)}
              >
                <option disabled value="0">
                  Select Vouchers
                </option>
                {vouchers.map((data) => {
                  return (
                    <option value={data.voucher_no}>{data.voucher_no}</option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="card">
          <Spinner />
          <div className="col-md-12">
            <form id="frmReimburse">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>Corporate</th>
                    <th>Amount Payable</th>
                  </tr>
                </thead>
                <tbody id="mem_reimburse">
                  {voucherData.map((dt) => {
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
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Totals</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
              <div className="form-group row justify-content-center">
                <div className="col-md-2">
                  <input
                    className="btn btn-info form-control"
                    type="button"
                    value="Print"
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

export default VoucherSummaryPerCorporate;
