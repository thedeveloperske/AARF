import React, { useEffect, useState } from "react";
import { getData, getOneData } from "../../../components/helpers/Data";
import { Spinner } from "../../../components/helpers/Spinner";

const ExcessOfLoss = () => {
  const [hiddenState, setHiddenState] = useState(true);
  const [reinsurance, setReinsurance] = useState([]);
  const [selectedReinsurance, setSelectedReinsurance] = useState([]);
  const [yearOne, setYearOne] = useState([]);
  const [yearTwo, setYearTwo] = useState([]);
  const [yearThree, setYearThree] = useState([]);
  const [yearFour, setYearFour] = useState([]);
  const [yearFive, setYearFive] = useState([]);
  const [yearSix, setYearSix] = useState([]);
  const [totals, setTotals] = useState([]);
  const [calculations, setCalculations] = useState({lbr:0.00, egnpi:0.00});


  useEffect(() => {
    getData("fetch_excess_of_loss").then((data) => {
      setReinsurance(data);
    });
  }, []);

  useEffect(() => {
    if (selectedReinsurance != 0) {
      setYearOne([]);
      setYearTwo([]);
      setYearThree([]);
      setYearFour([]);
      setYearFive([]);
      setYearSix([]);
      setTotals([]);
      setHiddenState(true);
      document.getElementById("spinner").style.display = "block";
      getOneData("fetch_excess_of_loss_calculations", selectedReinsurance)
        .then((data) => {
          setYearOne(data[0]);
          setYearTwo(data[1]);
          setYearThree(data[2]);
          setYearFour(data[3]);
          setYearFive(data[4]);
          setYearSix(data[5]);
          setTotals(data[6]);
          setHiddenState(false);

           console.log(data[5]);
          document.getElementById("spinner").style.display = "none";
        })
        .catch((error) => {
          document.getElementById("spinner").style.display = "none";
          console.log(error);
        });
    }
  }, [selectedReinsurance]);

  const calculatePremium = (e) => {
    e.preventDefault()
    const ttlPrem = yearSix.premium;
    const loadingOne = document.getElementById("loadingOne").value;
    const loadingTwo = document.getElementById("loadingTwo").value;
    const pbc = totals.pbc;
    let lbrTtl = pbc * (loadingOne / loadingTwo);
    let egnpiTtl = ttlPrem * (lbrTtl / 100); 

setCalculations({lbr:lbrTtl, egnpi:egnpiTtl})
  }

  return (
    <div>
      <div className="container">
        <p className="text-info h2">Reinsurance - Excess Of Loss</p>
        <hr />
        <div className="row">
          <div className="col-md-8 mx-auto">
            <select
              className="form-control"
              defaultValue="0"
              onChange={(e) => setSelectedReinsurance(e.target.value)}
            >
              <option disabled value="0">
                Select Reinsurance
              </option>
              {reinsurance.map((dt) => {
                return <option value={dt.code}>{dt.re_insurer}</option>;
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <p className="text-info  font-weight-bold">
          Gross Net Premium Income (GNPI)
        </p>
        <hr />
        <Spinner />

        <div className="row" hidden={hiddenState}>
          <div className="col-md-12">
            <table
              className="table table-bordered table-stripped table-hover table-sm"
              style={{ maxHeight: "300px" }}
            >
              <thead style={{ fontSize: "15px" }}>
                <tr>
                  <th>Year</th>
                  <th>Gross Net Premium Income (GNPI)</th>
                  <th>Benefit</th>
                  <th>Total Claims(FGU)</th>
                  <th>Re-Insurer Loss)</th>
                  <th>Insurer Loss(Balance)</th>
                  <th>Loss Ratio</th>
                </tr>
              </thead>
              <tbody>
                {yearOne.dt1
                  ? yearOne.dt1.map((dt) => {
                      return (
                        <tr>
                          <td>{yearOne.period}</td>
                          <td>
                            {parseFloat(yearOne.ttl_premium).toLocaleString()}
                          </td>
                          <td>{dt.benefit}</td>
                          <td>{parseFloat(dt.amt_payable).toLocaleString()}</td>
                          <td>{parseFloat(dt.amt_paid).toLocaleString()}</td>
                          <td>
                            {parseFloat(dt.insurer_loss).toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      );
                    })
                  : ""}
                {
                  <tr
                    style={{
                      background: "grey",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    <td>Yearly Totals</td>
                    <td>{parseFloat(yearOne.ttl_premium).toLocaleString()}</td>
                    <td></td>
                    <td></td>
                    <td>
                      {parseFloat(
                        yearOne.ttl_claims_chargable
                      ).toLocaleString()}
                    </td>
                    <td></td>
                    <td>{parseFloat(yearOne.loss_ratio).toLocaleString()}</td>
                    <td></td>
                  </tr>
                }
                {/* YEAR TWO */}
                {yearTwo.dt2
                  ? yearTwo.dt2.map((dt) => {
                      return (
                        <tr>
                          <td>{yearTwo.period}</td>
                          <td>
                            {parseFloat(yearTwo.ttl_premium).toLocaleString()}
                          </td>
                          <td>{dt.benefit}</td>
                          <td>{parseFloat(dt.amt_payable).toLocaleString()}</td>
                          <td>{parseFloat(dt.amt_paid).toLocaleString()}</td>
                          <td>
                            {parseFloat(dt.insurer_loss).toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      );
                    })
                  : ""}
                {
                  <tr
                    style={{
                      background: "grey",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    <td>Yearly Totals</td>
                    <td>{parseFloat(yearTwo.ttl_premium).toLocaleString()}</td>
                    <td></td>
                    <td></td>
                    <td>
                      {parseFloat(
                        yearTwo.ttl_claims_chargable
                      ).toLocaleString()}
                    </td>
                    <td></td>
                    <td>{parseFloat(yearTwo.loss_ratio).toLocaleString()}</td>
                    <td></td>
                  </tr>
                }
                {/* YEAR THREE */}
                {yearThree.dt3
                  ? yearThree.dt3.map((dt) => {
                      return (
                        <tr>
                          <td>{yearThree.period}</td>
                          <td>
                            {parseFloat(yearThree.ttl_premium).toLocaleString()}
                          </td>
                          <td>{dt.benefit}</td>
                          <td>{parseFloat(dt.amt_payable).toLocaleString()}</td>
                          <td>{parseFloat(dt.amt_paid).toLocaleString()}</td>
                          <td>
                            {parseFloat(dt.insurer_loss).toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      );
                    })
                  : ""}
                {
                  <tr
                    style={{
                      background: "grey",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    <td>Yearly Totals</td>
                    <td>
                      {parseFloat(yearThree.ttl_premium).toLocaleString()}
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      {parseFloat(
                        yearThree.ttl_claims_chargable
                      ).toLocaleString()}
                    </td>
                    <td></td>
                    <td>{parseFloat(yearThree.loss_ratio).toLocaleString()}</td>
                    <td></td>
                  </tr>
                }
                {/* YEAR FOUR */}
                {yearFour.dt4
                  ? yearFour.dt4.map((dt) => {
                      return (
                        <tr>
                          <td>{yearFour.period}</td>
                          <td>
                            {parseFloat(yearFour.ttl_premium).toLocaleString()}
                          </td>
                          <td>{dt.benefit}</td>
                          <td>{parseFloat(dt.amt_payable).toLocaleString()}</td>
                          <td>{parseFloat(dt.amt_paid).toLocaleString()}</td>
                          <td>
                            {parseFloat(dt.insurer_loss).toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      );
                    })
                  : ""}
                {
                  <tr
                    style={{
                      background: "grey",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    <td>Yearly Totals</td>
                    <td>{parseFloat(yearFour.ttl_premium).toLocaleString()}</td>
                    <td></td>
                    <td></td>
                    <td>
                      {parseFloat(
                        yearFour.ttl_claims_chargable
                      ).toLocaleString()}
                    </td>
                    <td></td>
                    <td>{parseFloat(yearFour.loss_ratio).toLocaleString()}</td>
                    <td></td>
                  </tr>
                }
                {/* YEAR FIVE */}
                {yearFive.dt5
                  ? yearFive.dt5.map((dt) => {
                      return (
                        <tr>
                          <td>{yearFive.period}</td>
                          <td>
                            {parseFloat(yearFive.ttl_premium).toLocaleString()}
                          </td>
                          <td>{dt.benefit}</td>
                          <td>{parseFloat(dt.amt_payable).toLocaleString()}</td>
                          <td>{parseFloat(dt.amt_paid).toLocaleString()}</td>
                          <td>
                            {parseFloat(dt.insurer_loss).toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      );
                    })
                  : ""}
                {
                  <tr
                    style={{
                      background: "grey",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    <td>Yearly Totals</td>
                    <td>{parseFloat(yearFive.ttl_premium).toLocaleString()}</td>
                    <td></td>
                    <td></td>
                    <td>
                      {parseFloat(
                        yearFive.ttl_claims_chargable
                      ).toLocaleString()}
                    </td>
                    <td></td>
                    <td>{parseFloat(yearFive.loss_ratio).toLocaleString()}</td>
                    <td></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <p style={{ textAlign: "center" }}>PURE BURNING COST</p>
            <table
              id="tblTwo"
              class="table display table-bordered table-stripped table-hover"
            >
              <thead style={{ fontSize: "15px" }}>
                <tr>
                  <th>Total Premium</th>
                  <th>Total Claims Chargeable</th>
                  <th>Pure Burning Cost (PBC or LOSS RATIO)</th>
                </tr>
              </thead>
              <tbody style={{ fontsize: "20px" }}>
                <tr>
                  <td>
                    <input
                      type="text"
                      value={parseFloat(
                        totals.ttl_premium_overall
                      ).toLocaleString()}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={parseFloat(
                        totals.ttl_claims_overall
                      ).toLocaleString()}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={parseFloat(totals.pbc).toLocaleString()}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <p style={{ textAlign: "center" }}>
              ESTIMATED GROSS NET PREMIUM INCOME(EGNPI)
            </p>
            <table
              id="tblTwo"
              class="table display table-bordered table-stripped table-hover"
            >
              <thead style={{ fontSize: "15px" }}>
                <tr>
                  <th>Period</th>
                  <th>Total Premium</th>
                  <th>Loading Factor</th>
                  <th>Action</th>
                  <th>Loaded Burning Rate</th>
                  <th>EGNPI</th>
                </tr>
              </thead>
              <tbody style={{ fontsize: "20px" }}>
                <tr>
                  <td>
                    <input type="text" value={yearSix.period} />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={parseFloat(yearSix.premium).toLocaleString()}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      id="loadingOne"
                      min="0"
                      max="100"
                      defaultValue="0"
                      className="col-md-6"
                    />

                    <input
                      type="number"
                      id="loadingTwo"
                      min="0"
                      max="100"
                      defaultValue="0"
                      className="col-md-6"
                    />
                  </td>
                  <td>
                    <button class="btn btn-primary col-md-12" id="btnLoading" onClick={calculatePremium}>
                      Calculate Burning Rate
                    </button>
                  </td>
                  <td>
                    <input
                      type="text"
                      id="lbr"
                      value={parseFloat(calculations.lbr).toLocaleString()}
                      readonly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="egnpi"
                     value={parseFloat(calculations.egnpi).toLocaleString()}
                      readonly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcessOfLoss;
