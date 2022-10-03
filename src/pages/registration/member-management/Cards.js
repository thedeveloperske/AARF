import { useState, useEffect } from "react";
import { getOneData } from "../../../components/helpers/Data";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import "../../../css/cards.css"

const Cards = () => {
  const [cardType, setCardType] = useState([]);
  const [userData, setUserData] = useState({
    names: "",
    start_date: "",
    category: "",
    product_name: "",
    corporate: "",
    member_no: "",
    dob: "",
  });
  const [backUrl, setBackUrl] = useState({
    url: "",
    textColorHead: "",
    textColorFoot: "",
    textColorBody: "",
    backColor: "",
  });

  useEffect(() => {
    switch (cardType) {
      case "1":
        setBackUrl({
          url: "/images/back1.png",
          textColorHead: "white",
          textColorFoot: "white",
          textColorBody: "black",
          backColor: "white",
        });
        break;
      case "2":
        setBackUrl({
          url: "/images/back2.png",
          textColorHead: "white",
          textColorFoot: "black",
          textColorBody: "black",
          backColor: "",
        });
        break;
      case "3":
        setBackUrl({
          url: "/images/back3.png",
          textColorHead: "white",
          textColorFoot: "black",
          textColorBody: "black",
          backColor: "",
        });
        break;
      case "4":
        setBackUrl({
          url: "",
          textColorHead: "black",
          textColorFoot: "black",
          textColorBody: "black",
          backColor: "",
        });
        break;
      default:
        setBackUrl({
          url: "/images/back1.png",
          textColorHead: "white",
          textColorFoot: "white",
          textColorBody: "black",
          backColor: "white",
        });
        break;
    }
  }, [cardType]);

  const fetchData = (e) => {
    e.preventDefault();

    getOneData("card_data", document.getElementById("member_no").value).then(
      (data) => {
        setUserData(data[0]);
      }
    );
  };

  const printCard = (e) => {
    e.preventDefault();

    var val = htmlToPdfmake(document.getElementById("card").innerHTML);
    var dd = { content: val };
    pdfMake.createPdf(dd).download();
  };
  return (
    <div>
      <div className="row">
        <div className="col-md-3">
          <select
            type="text"
            className="col-md-12 form-control"
            name="card_type"
            required="true"
            defaultValue="0"
            onChange={(e) => setCardType(e.target.value)}
          >
            <option disabled value="0">
              Select Card Type
            </option>
            <option value="1">Open network</option>
            <option value="2">Group Care</option>
            <option value="3">Corporate</option>
            <option value="4">Gold/Silver/Bronze</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            placeholder="Member No"
            className="form-control"
            name="member_no"
            required="true"
            id="member_no"
          />
        </div>
        <div className="col-sm-2">
          <input
            type="button"
            className="btn btn-info"
            value="Run"
            onClick={fetchData}
          />
        </div>
      </div>

      <div>
        <p className="text-info font-weight-bold text-info h3">Cards</p>
        <div id="card">
          <div
            className="card"
            style={{ backgroundImage: `url(${backUrl.url})` }}
          >
            <div>
              <p className="h1 text-danger font-weight-bold">
                AAR HEALTH SERVICES
              </p>
              <p style={{ color: `${backUrl.textColorHead}` }}>
                AAR HEALTH SERVICES LIMITED P.O.BOX 8240, KAMPALA UGANDA TEL
                0414-560800
              </p>
            </div>
            <div
              class="card-body"
              style={{
                color: `${backUrl.textColorBody}`,
                backgroundColor: `${backUrl.backColor}`,
              }}
            >
              <table className="mx-auto" id="tblCard">
                <tbody>
                  <tr>
                    <td>NAME</td>
                    <td>:</td>
                    <td>{userData.names}</td>
                  </tr>
                  <tr>
                    <td>CARD NO</td>
                    <td>:</td>
                    <td>{userData.member_no}</td>
                  </tr>
                  <tr>
                    <td>MEMBER SINCE</td>
                    <td>:</td>
                    <td>{userData.start_date}</td>
                  </tr>
                  <tr>
                    <td>EMPLOYER</td>
                    <td>:</td>
                    <td>{userData.corporate}</td>
                  </tr>
                  <tr>
                    <td>BENEFITS</td>
                    <td>:</td>
                    <td>{userData.product_name}</td>
                  </tr>
                  <tr>
                    <td>DATE OF BIRTH</td>
                    <td>:</td>
                    <td>{userData.dob}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ color: `${backUrl.textColorFoot}` }}>
              <p>THIS MEMBERSHIP CARD IS THE PROPERTY OF AAR HEALTH SERVICES</p>
              <p>
                NOTE:THIS IS A MEMBERSHIP CARD VALID ONLY IF MEMBERSHIP IS
                CURRENT
              </p>
              <p>THIS IS NOT A CHARGE CARD OR CREDIT CARD</p>
            </div>
          </div>
        </div>
        <button className="btn btn-info" onClick={printCard} hidden="true">
          Print
        </button>
      </div>
    </div>
  );
};

export default Cards;
