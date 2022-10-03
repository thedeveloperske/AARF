import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  postData,
} from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";

import ReactHTMLTableToExcel from "react-html-table-to-excel";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import AccessLogs from "../../../components/helpers/AccessLogs";

const MemberShipList = () => {
  //save access log
  useEffect(() => {
    const frmData = new FormData();
    frmData.append("username", localStorage.getItem("username"));
    frmData.append("accessed", 171);
    AccessLogs(frmData);
  }, []);
  //module variables
  const [address, setAddress] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [selectedCorp, setSelectedCorp] = useState([]);
  const [annivs, setAnnivs] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState([]);
  const [elementState, setElementState] = useState({
    corp: true,
    anniv: true,
    from: true,
    to: true,
  });

  let x = [];

  useEffect(() => {
    setHeaders([]);
    setBody([]);
    switch (selectedCategory) {
      case "0":
        setElementState({
          corp: true,
          anniv: true,
          from: true,
          to: true,
        });
        break;
      case "1":
        setElementState({
          corp: false,
          anniv: false,
          from: true,
          to: true,
        });
        break;
      case "2":
        setElementState({
          corp: false,
          anniv: true,
          from: false,
          to: false,
        });
        break;
      case "3":
        setElementState({
          corp: false,
          anniv: true,
          from: false,
          to: false,
        });
        break;
      case "4":
        setElementState({
          corp: false,
          anniv: true,
          from: true,
          to: true,
        });
        break;
      case "5":
        setElementState({
          corp: true,
          anniv: true,
          from: true,
          to: true,
        });
        break;
      case "6":
        setElementState({
          corp: false,
          anniv: false,
          from: true,
          to: true,
        });
        break;
      case "7":
        setElementState({
          corp: false,
          anniv: false,
          from: true,
          to: true,
        });
        break;
      case "8":
        setElementState({
          corp: true,
          anniv: true,
          from: true,
          to: true,
        });
        break;
      case "9":
        setElementState({
          corp: false,
          anniv: true,
          from: true,
          to: true,
        });
        break;
      case "10":
        setElementState({
          corp: true,
          anniv: true,
          from: true,
          to: true,
        });
        break;
      case "11":
        setElementState({
          corp: false,
          anniv: true,
          from: true,
          to: true,
        });
        break;
      case "12":
        setElementState({
          corp: false,
          anniv: false,
          from: true,
          to: true,
        });
        break;
    }
  }, [selectedCategory]);

  useEffect(() => {
    getOneData("fetch_client_address", 4).then((data) => {
      setAddress(data[0]);
    });
    getData("fetch_corporates").then((data) => {
      setCorporates(data);
    });
  }, []);
  useEffect(() => {
    if (selectedCorp != 0) {
      getOneData("fetch_corp_annivs", selectedCorp).then((data) => {
        setAnnivs(data);
      });
    }
  }, [selectedCorp]);

  const fetchReport = () => {
    document.getElementById("spinner").style.display = "block";
    setHeaders([]);
    setBody([]);
    const frmData = new FormData(document.getElementById("memberListFrm"));
    postData(frmData, "fetch_membership_list_report")
    .then((data) => {
        // return console.log(data);
        if (data.body.length == 0) {
          document.getElementById("spinner").style.display = "none";
          return alert("No data found");
        }
        setHeaders(data.headers);

        switch (selectedCategory) {
          case "1":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.member_no}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.relation}</td>
                  <td>{dt.dob}</td>
                  <td>{dt.id_pp_no}</td>
                  <td>{dt.benefit}</td>
                  <td>{parseFloat(dt.limit).toLocaleString()}</td>
                  <td>{dt.start_date}</td>
                  <td>{dt.end_date}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";

            break;
          case "2":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.corporate}</td>
                  <td>{dt.principal_applicant}</td>
                  <td>{dt.member_no}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.id_pp_no}</td>
                  <td>{dt.date_can}</td>
                </tr>
              );
            });
            setBody(x);
            document.getElementById("spinner").style.display = "none";

            break;
          case "3":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.corporate}</td>
                  <td>{dt.principal_applicant}</td>
                  <td>{dt.member_no}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.id_pp_no}</td>
                  <td>{dt.benefit}</td>
                  <td>{dt.start_date}</td>
                  <td>{dt.end_date}</td>
                  <td>{dt.dob}</td>
                  <td>{dt.employment_no}</td>
                </tr>
              );
            });
            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
          case "4":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.category}</td>
                  <td>{dt.principal_applicant}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.member_no}</td>
                  <td>{dt.employment_no}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
          case "5":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.principal_name}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.member_no}</td>
                  <td>{dt.start_date}</td>
                  <td>{dt.end_date}</td>
                  <td>{dt.renewal_date}</td>
                  <td>{dt.anniv}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
          case "6":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.principal_name}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.member_no}</td>
                  <td>{dt.invoice_no}</td>
                  <td>{dt.invoice_date}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
          case "7":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.member_no}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.relation}</td>
                  <td>{dt.dob}</td>
                  <td>{dt.id_pp_no}</td>
                  <td>{dt.benefit}</td>
                  <td>{dt.start_date}</td>
                  <td>{dt.end_date}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
          case "8":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.group_name}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.relation}</td>
                  <td>{dt.gender}</td>
                  <td>{dt.category}</td>
                  <td>{dt.member_no}</td>
                  <td>{dt.dob}</td>
                  <td>{dt.start_date}</td>
                  <td>{dt.end_date}</td>
                  <td>{dt.product_name}</td>
                  <td>{dt.corporate}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
          case "9":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.group_name}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.relation}</td>
                  <td>{dt.gender}</td>
                  <td>{dt.category}</td>
                  <td>{dt.member_no}</td>
                  <td>{dt.dob}</td>
                  <td>{dt.start_date}</td>
                  <td>{dt.end_date}</td>
                  <td>{dt.product_name}</td>
                  <td>{dt.corporate}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
          case "10":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.corporate}</td>
                  <td>{dt.member_no}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.relation}</td>
                  <td>{dt.dob}</td>
                  <td>{dt.id_pp_no}</td>
                  <td>{dt.start_date}</td>
                  <td>{dt.end_date}</td>
                  <td>{dt.status}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
          case "11":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.family_no}</td>
                  <td>{dt.member_no}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.relation}</td>
                  <td>{dt.status}</td>
                  <td>{dt.dob}</td>
                  <td>{dt.tel_no}</td>
                  <td>{dt.mobile_no}</td>
                  <td>{dt.email}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
          case "12":
            x = data.body.map((dt) => {
              return (
                <tr>
                  <td>{dt.member_no}</td>
                  <td>{dt.member_names}</td>
                  <td>{dt.relation}</td>
                  <td>{dt.gender}</td>
                  <td>{dt.dob}</td>
                  <td>{dt.id_pp_no}</td>
                  <td>{dt.employment_no}</td>
                  <td>{dt.start_date}</td>
                  <td>{dt.end_date}</td>
                  <td>{dt.category}</td>
                  <td>{dt.product_name}</td>
                </tr>
              );
            });

            setBody(x);
            document.getElementById("spinner").style.display = "none";
            break;
        }
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("spinner").style.display = "none";
      });
  };

  const printPdf = () => {
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
    let tbl = document.getElementById("pdf").innerHTML;
    let html = `
    <div class="row">
    <div class="col-md-4" style="text-align:right;font-weight:bold;">${page_header}</div>
    <br><br><br>
    <div>${tbl}</div>
    <br><br><br>   
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

  return (
    <div>
      <div className="container">
        <p className="text-info h2">Membership List</p>

        <form id="memberListFrm">
          <div className="row">
            <div className="col-md-2">
              <select
                className="form-control"
                defaultValue="0"
                name="category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option disabled value="0">
                  Select category
                </option>
                <option value="1">Valid Members With Limits</option>
                <option value="2">Cancelled Members</option>
                <option value="3">Additional Members</option>
                <option value="4">Category Wise</option>
                <option value="5">Individual Members</option>
                <option value="6">Corporate Paid Members</option>
                <option value="7">Suspended Members' Benefits</option>
                <option value="8">Smart Report</option>
                <option value="9">Smart Corporate Members</option>
                <option value="10">All Members</option>
                <option value="11">Members Bio Information</option>
                <option value="12">Product Wise</option>
              </select>
            </div>
            <div className="col-md-2" hidden={elementState.corp}>
              <select
                className="form-control"
                defaultValue="0"
                name="corporate"
                onChange={(e) => setSelectedCorp(e.target.value)}
              >
                <option disabled value="0">
                  Select Corporate
                </option>
                {corporates.map((dt) => {
                  return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
                })}
              </select>
            </div>
            <div className="col-md-2" hidden={elementState.anniv}>
              <select
                className="form-control"
                defaultValue="0"
                name="anniv"
                onChange={() =>
                  setElementState({
                    ...elementState,
                    submit: false,
                  })
                }
              >
                <option disabled value="0">
                  Select anniv
                </option>
                {annivs.map((dt) => {
                  return <option value={dt.anniv}>{dt.anniv}</option>;
                })}
              </select>
            </div>
            <div className="col-md-2" hidden={elementState.from}>
              <input className="form-control" type="date" name="from" />
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                type="date"
                name="to"
                hidden={elementState.to}
              />
            </div>
            <div className="col-md-2" hidden={elementState.submit}>
              <input
                className="btn btn-info"
                type="button"
                value="Run"
                onClick={fetchReport}
              />
            </div>
          </div>
        </form>
        <div className="card">
          <div className="row" style={{ margin: "20px" }}>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="btn btn-info"
              table="valid_members_with_limits"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Excel"
            />
            <button
              className="btn btn-warning col-1"
              onClick={printPdf}
              style={{ marginLeft: "20px" }}
            >
              Print
            </button>
          </div>
          {/* insert report table */}
          <div id="pdf">
            <table
              className="table table-sm table-bordered table-striped"
              style={{ maxHeight: "500px" }}
              id="valid_members_with_limits"
            >
              <thead className="thead-dark">
                <tr>
                  {headers.map((dt) => {
                    return <th>{dt}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {body.map((dt) => {
                  return dt;
                })}
              </tbody>
            </table>
            <Spinner />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberShipList;
