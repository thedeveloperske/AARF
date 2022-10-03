import React, { useState, useEffect } from "react";
import { getData, getOneData, postData } from "../../components/helpers/Data";
import ModalResponse from "../../components/helpers/Modal2";

const ChangeFamilyAgent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState([]);
  const [disabledStatus, setDisabledStatus] = useState(true);
  const [agents, setAgents] = useState([]);
  const [current_agent, setCurrentAgent] = useState([]);
  const [full_name, setFullName] = useState([]);
  const [corporate, setCorporate] = useState([]);
  const [member_no, setMemberNo] = useState([]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //get all agents
  useEffect(() => {
    getData("fetch_agents").then((data) => setAgents(data));
  }, []);

  //fetch member data
  const fetchMemberData = (e) => {
    getOneData(
      "fetch_principal",
      document.getElementById("family_no").value
    ).then((data) => {
      if (data.length != 0) {
        data.map((dt) => {
          setCurrentAgent(dt.agent_name);
          setFullName(dt.full_name);
          setCorporate(dt.corporate);
          setMemberNo(dt.member_no);
          setDisabledStatus(false);
        });
      } else {
        setResponse("Family doesn't exist or is not under retail");
        setIsModalOpen(true);
        setCurrentAgent([]);
        setFullName([]);
        setCorporate([]);
        setMemberNo([]);
      }
    });
  };

  //handle change agent
  const handleChangeAgent = async (e) => {
    e.preventDefault();
    const formData = new FormData(
      document.getElementById("change_agent_retail_form")
    );
    if (member_no.length != 0) {
      postData(formData, "save_change_retail_agent")
        .then((data) => {
          setResponse(data.response);
          setIsModalOpen(true);
          setDisabledStatus(true);
          setCurrentAgent([]);
          setFullName([]);
          setCorporate([]);
          setMemberNo([]);
          document.getElementById("select-agent-dropdown").value = 0;
        })
        .catch((error) => console.log(error));
    } else {
      setResponse("no data");
      setIsModalOpen(true);
    }
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
                    Family No : <span className="required">*</span>
                  </label>
                  <div className="col-md-4 col-sm-4 ">
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      name="family_no"
                      id="family_no"
                      placeholder="Enter Family No For Retail"
                      aria-required="true"
                    />
                  </div>
                  <div className="col-md-4 col-sm-1">
                    <button
                      class="btn btn-info col-md-4"
                      id="btn_generate"
                      onClick={fetchMemberData}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <hr />
              <form
                className="claims_form mt-1"
                id="change_agent_retail_form"
                onSubmit={handleChangeAgent}
              >
                <fieldset>
                  <div id="invoice_details_1">
                    <h2 className="fs-title">Change Retail Agent</h2>
                    <hr />
                  </div>
                  <div className="row col-md-12" id="step-1">
                    <div className="form-group row ml-0">
                      <label
                        for="member_name"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Principal Name :
                      </label>
                      <div className="col-md-8 col-sm-8">
                        <input
                          type="text"
                          className="form-control"
                          name="member_name"
                          id="member_name"
                          value={full_name}
                          disabled
                          placeholder="Client Name"
                          required="true"
                        />
                      </div>
                      <div className="col-md-8 col-sm-8">
                        <input
                          type="text"
                          className="form-control"
                          name="member_no"
                          id="member_no"
                          hidden
                          value={member_no}
                          placeholder="Member Number"
                        />
                      </div>
                    </div>
                    <div className="form-group row ml-0">
                      <label
                        for="Corporate"
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                      >
                        Corporate :
                      </label>
                      <div className="col-md-8 col-sm-8">
                        <input
                          type="text"
                          className="form-control"
                          name="corporate"
                          value={corporate}
                          id="corporate"
                          placeholder="Corporate"
                          aria-required="true"
                          disabled
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
                          value={current_agent}
                          id="current_agent"
                          placeholder="Current Agent"
                          aria-required="true"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="form-group row ml-0">
                      <label
                        className="col-form-label col-md-2 col-sm-2 label-align text-center pr-0 pl-0"
                        for="new_health_plan"
                      >
                        New Agent :
                      </label>
                      <div className="col-md-8 col-sm-8">
                        <select
                          className="form-control"
                          id="select-agent-dropdown"
                          defaultValue="0"
                          name="agent_id"
                          required="true"
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

export default ChangeFamilyAgent;
