import React, { useState, useEffect } from "react";
import { getData, getOneData, postData } from "../../components/helpers/Data";
import AccessLogs from "../../components/helpers/AccessLogs";
import ModalResponse from "../../components/helpers/Modal2";

const ChangeCorporateAgent = () => {
  //save access log
  useEffect(() => {
    const frmData = new FormData();
    frmData.append("username", localStorage.getItem("username"));
    frmData.append("accessed", 2);
    AccessLogs(frmData);
  }, []);
  //module variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [corporates, setCorporates] = useState([]);
  const [selectedCorporate, setSelectedCorporate] = useState([]);
  const [corporate, setCorporateData] = useState([]);
  const [agent, setCorporateAgentData] = useState([]);
  const [agents, setAgents] = useState([]);
  const [response, setResponse] = useState([]);
  const [disabledStatus, setDisabledStatus] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  //getting all corporates
  useEffect(() => {
    getData("fetch_corporates").then((data) => setCorporates(data));
    getData("fetch_agents").then((data) => setAgents(data));
  }, []);

  //Get corporate data
  const fetchCorporateData = (e) => {
    e.preventDefault()
    getOneData("fetch_corporate_agent", selectedCorporate).then((data) => {
      data.map((dt) => {
        setCorporateData(dt.corporate);
        setCorporateAgentData(dt.agent_name);
        setDisabledStatus(false);
      });
    });
  };

  //handle change agent
  const handleChangeAgent = async (e) => {
    e.preventDefault();
    const formData = new FormData(
      document.getElementById("change_agent_corp_form")
    );

    postData(formData, "save_change_corporate_agent")
      .then((data) => {
        setResponse(data.response);
        setIsModalOpen(true);
        setDisabledStatus(true);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <section id="querycorporatetable" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <form className="claims_form mt-1" id="change_agent_corp_form">
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Change Corporate Agent</h2>
                    <hr />
                  </div>

                  <div className="row col-md-12" id="step-1">
                    <div className="form-group row ml-0">
                      <label
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                        for="member_no"
                      >
                        Corporate :<span className="required"> *</span>
                      </label>
                      <div className="col-md-4">
                        <select
                          className="form-control"
                          id="select-corporate-dropdown"
                          defaultValue="0"
                          name="corp_id"
                          onChange={(e) => setSelectedCorporate(e.target.value)}
                        >
                          <option disabled value="0">
                            Select Corporate
                          </option>
                          {corporates.map((corporate) => {
                            const { CORP_ID, CORPORATE } = corporate;
                            return (
                              <option key={CORP_ID} value={CORP_ID}>
                                {CORPORATE}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <button
                          className="btn btn-info col-md-4"
                          onClick={fetchCorporateData}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row col-md-12" id="step-1">
                    <div className="form-group row ml-0">
                      <label
                        for="corporate_name"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Corporate Name :
                      </label>
                      <div className="col-md-8 col-sm-8">
                        <input
                          type="text"
                          className="form-control"
                          name="corporate"
                          id="corporate"
                          value={corporate}
                          disabled
                          placeholder="Corporate Name"
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="current_agent"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Current Agent :
                      </label>
                      <div className="col-md-8 col-sm-8">
                        <input
                          type="text"
                          className="form-control"
                          name="current_agent"
                          id="current_agent"
                          value={agent}
                          disabled
                          placeholder="Current Agent"
                          aria-required="true"
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                        for="new_health_plan"
                      >
                        New Agent : <span className="required"> *</span>
                      </label>
                      <div className="col-md-8 col-sm-8 ">
                        <select
                          className="form-control"
                          id="select-ag-dropdown"
                          defaultValue="0"
                          id="agent_id"
                          name="agent_id"
                          required={true}
                        >
                          <option disabled value="0">
                            Select Intermediary
                          </option>
                          {agents.map((agent) => {
                            const { AGENT_ID, AGENT_NAME } = agent;
                            return (
                              <option key={AGENT_ID} value={AGENT_ID}>
                                {AGENT_NAME}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* Save button */}
                  <input
                    type="submit"
                    disabled={disabledStatus}
                    className="btn btn-info col-2 text-white"
                    onClick={handleChangeAgent}
                    value="Save"
                  />
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ModalResponse
        modalIsOpen={isModalOpen}
        closeModal={closeModal}
        background="#0047AB"
        body={<p className="text-white h4 font-weight-bold">{response}</p>}
      />
    </div>
  );
};

export default ChangeCorporateAgent;
