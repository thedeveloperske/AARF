import pdfMake from "pdfmake";
import htmlToPdfmake from "html-to-pdfmake";
import { ToWords } from 'to-words';
import { useEffect, useState } from "react";
import { getOneData } from "../../components/helpers/Data";

const PrintReceipts = () => {
  const [printReceipt, setPrintReceipt] = useState([]);
  const [address, setAddress] = useState([]);
  const [words, setWords] = useState([]);

  useEffect(() => {
    getOneData("fetch_client_address", 4)
      .then((data) => {
        setAddress(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const generateReceipt = () => {
    const input_receipt_no = document.getElementById("receipt_no").value;
    getOneData("print_receipt_data", input_receipt_no)
      .then((data) => {
        data.map((dt) => {
          setPrintReceipt(dt);
        });

        //converting numberS to words
        const toWords = new ToWords({
          localeCode: 'en-US',
          converterOptions: {
            currency: false,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
          }
        });
        const val = document.getElementById("value").innerHTML;
        console.log(val);
        let value = toWords.convert(val);
        setWords(value);
      })
      .catch((error) => console.log(error));
  };

  //print to pdf format
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
    let receipt = `
    <ul style="list-style-type: none">
      <li>Receipt No:${printReceipt.receipt_no}</li>
      <li>Receipt Date:${printReceipt.receipt_date}</li>
      <li>Form of Payment:${printReceipt.payment_mode}</li>
    </ul>
  `;

    let user = localStorage.getItem("username");
    var tbl = document.getElementById("print_receipt_div").innerHTML;

    let j = `
  <div class="row">
  <div class="col-md-4" style="font-weight:bold;">${page_header}</div>
  <br>
  <div class="col-md-4" style="font-weight:bold;">${receipt}</div>
  <br>
  <div>${tbl}</div>
  <br><br><br>
  <p>Prepared By: ${user}</p>
  <p>Signature: __________________________   Date: __________________________</p>
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
      <section id="querycorporatetable" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="row col-md-12" id="step-1">
                <div className="form-group row ml-0">
                  <label
                    className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                    for="member_no"
                  >
                    Receipt No:
                  </label>
                  <div className="col-md-4 col-sm-4 ">
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      name="receipt_no[]"
                      id="receipt_no"
                      placeholder="Enter Receipt No"
                      aria-required="true"
                    />
                  </div>
                  <div className="col-md-1 col-sm-1 ">
                    <button
                      class="btn btn-info ml-auto btn-sm pull-right mr-1 mt-1"
                      style={{ width: "fit - content" }}
                      id="btn_generate"
                      onClick={generateReceipt}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <hr />
              <form className="claims_form mt-1" id="receipt_reversal_form">
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Receipt</h2>
                    <div className={"row "}>
                      <div className={"col-md-12"}>
                        <div className="col-md-4 float-left" style={{ textAlign: "left" }}>
                          <h6>{address.client_name}</h6>
                          <h6>{address.physical_location}</h6>
                          <h6>{address.box_no}</h6>
                          <h6>{address.tel_cell}</h6>
                          <h6>{address.fax}</h6>
                          <h6>{address.email}</h6>
                          <h6>{address.url}</h6>
                        </div>
                        <div className="addresses">
                          <h6
                            className="font-weight-bold"
                            style={{ textAlign: "right" }}
                          >
                            Receipt No: {printReceipt.receipt_no} <br />
                            Receipt Date: {printReceipt.receipt_date} <br />
                            Form of Payment: {
                              printReceipt.payment_mode
                            } <br /> <br />
                            Receipting Centre Head Office <br />
                          </h6>
                        </div>
                      </div>
                    </div>

                    <hr />
                    <div id="print_receipt_div">
                      <table>
                        <tr>
                          <td>Receipt Amount:</td>
                          <td id="value">{printReceipt.length !== 0 ? (printReceipt.receipt_amount) : ""}</td>
                        </tr>
                        <tr>
                          <td>Amount In Words:</td>
                          <td>{words}</td>
                        </tr>
                      </table>
                    </div>
                    <br />
                    <div
                      style={{
                        textAlign: "center",
                        margin: "20px 10px",
                        borderTop: "1px solid #000",
                        width: "200px",
                      }}
                    >
                      <span className="signature">Signature</span>
                    </div>
                  </div>
                  {/* Save button */}
                  <input
                    type="button"
                    className="action-button btn-success col-md-4 ml-auto"
                    value="Print"
                    onClick={printPdf}
                  />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrintReceipts;
