import React from "react";

const ProrateCorporateBenefits = () => {
  return (
    <div>
      <div className="content-header">
        <h1>Prorate Corporate Benefits</h1>
        <hr />
        <div style={{ marginLeft: "10px", marginBottom: "0px" }}>
          <div className="card card-default">
            <div className="card-header">
              <div className="row">
                <div className="col-md-8 mt-3 mb-0">
                  <h3 className="card-title">Select Corporate </h3>
                </div>
                <div className="col-md-4 mt-3 mb-0">
                  <h3 className="card-title">Anniversary </h3>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 mt-3 mb-0">
                <select
                  className="form-control col-md-4"
                  defaultValue="0"
                  id="selection_item_dropdown"
                  //onChange={getTask}
                >
                  <option disabled value="0">
                    Select Corporate
                  </option>
                  <option value="1">Corporate</option>
                  <option value="2">Retail</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProrateCorporateBenefits;
