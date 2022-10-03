import { useState, useEffect } from "react";
import { getOneData, postData } from "../../components/helpers/Data";
import "../../css/enquiryPages.css";

const EnquiryPages = () => {
  const [memberNo, setMemberNo] = useState([]);
  const [annivs, setAnnivs] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [coverPeriod, setCoverPeriod] = useState([]);
  const [claimsListing, setClaimsListing] = useState([]);
  let index = 0;

  useEffect(() => {
    if (memberNo.length != 0) {
      getOneData("fetch_annivs_for_member", memberNo).then((data) => {
        setAnnivs(data);
      });
    }
  }, [memberNo]);

  useEffect(() => {
    switch (selectedOption) {
      case "0":
        setHidden(true);
        break;
      case "1":
        setHidden(true);
        break;
      case "2":
        setHidden(false);
        break;
      default:
        setHidden(true);
        break;
    }
  }, [selectedOption]);

  const fetchEnquiryData = (e) => {
    e.preventDefault();
    const frmData = new FormData(document.getElementById("frmEnquiry"));
    postData(frmData, "fetch_enquiry_pages_data").then((data) => {
      setMemberData(data.member_data);
      setCoverPeriod(
        data.cover_period[0].start_date + " - " + data.cover_period[0].end_date
      );
      setClaimsListing(data.claim_info);
    });
  };

  return (
    <div>
      <p className="h1 text-info">Enquiry Pages</p>
      <hr />
      <form id="frmEnquiry" onSubmit={fetchEnquiryData}>
        <div className="row">
          <div className="col-md-2">
            <select
              name="policy_options"
              defaultValue="0"
              className="form-control"
              onChange={(e) => setSelectedOption(e.target.value)}
              required="true"
            >
              <option disabled value="0">
                Select Policy Option
              </option>
              <option value="1">All</option>
              <option value="2">Per Policy</option>
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="text"
              name="member_no"
              id="member_no"
              placeholder="Member No"
              className="form-control"
              onChange={(e) => setMemberNo(e.target.value)}
            />
          </div>

          <div className="col-md-2" hidden={hidden}>
            <select name="anniv" defaultValue="0" className="form-control">
              <option value="0">Select Anniv</option>
              {annivs.map((data) => {
                return <option value={data.anniv}>{data.anniv}</option>;
              })}
            </select>
          </div>
          <div className="col-md-3">
            <input type="submit" value="run" className="btn btn-primary" />
          </div>
        </div>
      </form>
      {memberData.map((dt) => {
        return (
          <div className="card">
            <p className="h1 text-info">Member Information</p>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="member_name" className="form-label">
                    MEMBER NAME
                  </label>
                  <input
                    value={dt.full_names}
                    className="form-control"
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="dob" className="form-label">
                    DOB
                  </label>
                  <input value={dt.DOB} className="form-control" readOnly />
                </div>
                <div className="col-md-4">
                  <label htmlFor="relation" className="form-label">
                    RELATION
                  </label>
                  <input
                    value={dt.relation}
                    className="form-control"
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="corporate" className="form-label">
                    CORPORATE
                  </label>
                  <input
                    value={dt.corporate}
                    className="form-control"
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="health_plan" className="form-label">
                    HEALTH PLAN
                  </label>
                  <input
                    value={dt.health_plan}
                    className="form-control"
                    readOnly
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="health_plan" className="form-label">
                    COVER PERIOD
                  </label>
                  <input
                    value={coverPeriod}
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="card">
        <p className="h1 text-info">Member Claims Listing</p>
        <div className="card-body">
          <div className="row table-responsive">
            <table className="table table-bordered table-sm" style={{maxHeight:"300px"}}>
              <thead className="thead-dark">
                <tr>
                  <th>Index</th>
                  <th>Claim No</th>
                  <th>Provider</th>
                  <th>Rcd Date</th>
                  <th>Adm Date</th>
                  <th>Disc Date</th>
                  <th>Benefit</th>
                  <th>Clm Amt</th>
                  <th>Net Amt</th>
                </tr>
              </thead>
              <tbody>
                {claimsListing.map((data) => {
                  index++
                  return (
                    <tr>
                      <td>{index}</td>
                      <td>{data.claim_no}</td>
                      <td>{data.provider}</td>
                      <td>{data.date_received}</td>
                      <td>{data.invoice_date}</td>
                      <td>{data.invoice_date}</td>
                      <td>{data.benefit}</td>
                      <td>
                        {data.invoiced_amount
                          ? data.invoiced_amount.toLocaleString()
                          : ""}
                      </td>
                      <td>
                        {data.amount_payable
                          ? data.amount_payable.toLocaleString()
                          : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPages;
