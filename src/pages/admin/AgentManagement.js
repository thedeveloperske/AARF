import React, { useState, useEffect } from "react";
import { getData, getOneData, postData } from "../../components/helpers/Data";
import { Spinner } from "../../components/helpers/Spinner";
import AgentModal from "../../components/helpers/Modal2";
import CommissionModal from "../../components/helpers/Modal2";
const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [agentType, setAgentType] = useState([]);
  const [agency, setAgency] = useState([]);
  const [bdm, setBdm] = useState([]);
  const [agentsData, setAgentsData] = useState([]);
  const [commissionRates, setCommissionRates] = useState([]);
  const [appendedAgent, setAppendedAgent] = useState([]);
  const [appendedCommission, setAppendedCommission] = useState([]);
  const [agentmodalOpen, setAgentModalOpen] = useState(false);
  const [agentResponse, setAgentResponse] = useState([]);
  const [commissionmodalOpen, setCommissionModalOpen] = useState(false);
  const [commissionResponse, setCommissionResponse] = useState([]);

  useEffect(() => {
    getData("fetch_agents")
      .then((data) => {
        setAgents(data);
      })
      .catch((error) => {
        console.log(error);
      });

    getData("fetch_agent_types")
      .then((data) => {
        setAgentType(data);
      })
      .catch((error) => {
        console.log(error);
      });

    getData("fetch_agency")
      .then((data) => {
        setAgency(data);
      })
      .catch((error) => {
        console.log(error);
      });

    getData("fetch_bdm")
      .then((data) => {
        setBdm(data);
      })
      .catch((error) => {
        console.log(error);
      });

    getData("fetch_agent_management_data")
      .then((data) => {
        console.log(data.commission_rates);
        setAgentsData(data.agents);
        setCommissionRates(data.commission_rates);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // append agent
  const appendAgentRow = (e) => {
    e.preventDefault();
    let user = localStorage.getItem("username");
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <input type="text" name="agent_name_added[]" />
          </td>
          <td>
            <select name="agent_type_added[]">
              <option value="">Select Agent Type</option>
              {agentType.map((dt) => {
                return <option value={dt.code}>{dt.agent_type}</option>;
              })}
            </select>
          </td>
          <td>
            <select name="agency_added[]">
              <option value="">Select Agency</option>
              {agency.map((dt) => {
                return <option value={dt.code}>{dt.name}</option>;
              })}
            </select>
          </td>
          <td>
            <select name="bdm_added[]">
              <option value="">Select Bdm</option>
              {bdm.map((dt) => {
                return <option value={dt.code}>{dt.name}</option>;
              })}
            </select>
          </td>
          <td>
            <input type="text" name="tel_no_added[]" />
          </td>
          <td>
            <input type="text" name="mobile_no_added[]" />
          </td>
          <td>
            <input type="text" name="fax_no_added[]" />
          </td>
          <td>
            <input type="text" name="postal_add_added[]" />
          </td>
          <td>
            <input type="text" name="town_added[]" />
          </td>
          <td>
            <input type="text" name="phy_loc_added[]" />
          </td>
          <td>
            <input type="text" name="email_added[]" />
          </td>
          <td>
            <input type="text" name="contact_person_added[]" />
          </td>
          <td>
            <input type="text" name="contact_mobile_added[]" />
          </td>
          <td>
            <input type="text" name="contact_tel_added[]" />
          </td>
          <td>
            <input type="text" name="user_id_added[]" value={user}/>
          </td>
          <td>
            <input type="date" name="date_entered_added[]" />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeAgent(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedAgent((appendedAgent) => {
      return [...appendedAgent, row];
    });
  };

  const removeAgent = async (id, e) => {
    e.preventDefault();
    setAppendedAgent((appendedAgent) => {
      return appendedAgent.filter((row) => row.id !== id);
    });
  };

  // append commission rates
  const appendCommisionRow = (e) => {
    e.preventDefault();
    const row = {
      id: new Date().getTime().toString(),
      new: (
        <>
          <td>
            <select
              name="agent_type_appended[]"
            >
              <option value="">Select Agent Type</option>
              {agentType.map((dt) => {
                return <option value={dt.code}>{dt.agent_type}</option>;
              })}
            </select>
          </td>
          <td>
            <input
              type="text"
              name="new_business_appended[]"
            />
          </td>
          <td>
            <input
              type="text"
              name="organic_growth_appended[]"
            />
          </td>
          <td>
            <input type="text" name="renewal_appended[]"/>
          </td>
          <td>
            <input
              type="text"
              name="premium_from_appended[]"
              
            />
          </td>
          <td>
            <input
              type="text"
              name="premium_to_appended[]"
              
            />
          </td>
          <td>
            <input type="text" name="lives_appended[]" />
          </td>
          <td>
            <input
              type="date"
              name="effective_from_appended[]"
              
            />
          </td>
          <td>
            <input
              type="date"
              name="effective_to_appended[]"
              
            />
          </td>
          <td>
            <button
              className="btn text-danger"
              onClick={(e) => removeCommission(row.id, e)}
            >
              <i className="fas fa-trash fa-lg"></i>
            </button>
          </td>
        </>
      ),
    };

    setAppendedCommission((appendedCommission) => {
      return [...appendedCommission, row];
    });
  };

  const removeCommission = async (id, e) => {
    e.preventDefault();
    setAppendedCommission((appendedCommission) => {
      return appendedCommission.filter((row) => row.id !== id);
    });
  };

  const saveAgents = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmAgents"));
    postData(frmData, "save_agents")
      .then((data) => {
        console.log(data);
        setAgentResponse(data);
        setAgentModalOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeAgentModal = () => {
    setAgentModalOpen(false);
    setTimeout(function () {
      window.location.replace("/agent-management");
    }, 5000);
  };

  const saveCommissionRates = (e) => {
    e.preventDefault();

    const frmData = new FormData(document.getElementById("frmCommissionRates"));
    postData(frmData, "save_commission_rates")
      .then((data) => {
        console.log(data);
        setCommissionResponse(data);
        setCommissionModalOpen(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeCommissionModal = () => {
    setCommissionModalOpen(false);
    setTimeout(function () {
      window.location.replace("/agent-management");
    }, 5000);
  };

  return (
    <div>
      <div className="container">
        <p className="text-info h2">Agents</p>
        <hr />
      </div>
      <div className="card col-md-12">
        <button className="btn btn-success" onClick={appendAgentRow}>
          Add
        </button>
        <form id="frmAgents" onSubmit={saveAgents}>
          <table
            className="table table-bordered"
            style={{ maxHeight: "300px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th className="hidden">Code</th>
                <th>Agent Name</th>
                <th>Agent Type</th>
                <th>Agency</th>
                <th>Bdm</th>
                <th>Tel No</th>
                <th>Mobile No</th>
                <th>Fax No</th>
                <th>Postal Add</th>
                <th>Town</th>
                <th>Phy Loc</th>
                <th>Email</th>
                <th>Contact Person</th>
                <th>Contact Mobile</th>
                <th>Contact Tel</th>
                <th>User</th>
                <th>Date Entered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {agentsData.map((dt) => {
                return (
                  <tr key={dt.code}>
                    <td className="hidden">
                      <input
                        type="text"
                        name="code[]"
                        defaultValue={dt.code}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="agent_name[]"
                        defaultValue={dt.AGENT_NAME}
                      />
                    </td>
                    <td>
                      <select
                        name="agent_type[]"
                        defaultValue={
                          dt.AGENT_TYPE == null ? "" : dt.AGENT_TYPE
                        }
                      >
                        <option value="">Select Agent Type</option>
                        {agentType.map((dt) => {
                          return (
                            <option value={dt.code}>{dt.agent_type}</option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <select
                        name="agency[]"
                        defaultValue={dt.agency == null ? "" : dt.agency}
                      >
                        <option value="">Select Agency</option>
                        {agency.map((dt) => {
                          return <option value={dt.code}>{dt.name}</option>;
                        })}
                      </select>
                    </td>
                    <td>
                      <select
                        name="bdm[]"
                        defaultValue={dt.bdm == null ? "" : dt.bdm}
                      >
                        <option value="">Select Bdm</option>
                        {bdm.map((dt) => {
                          return <option value={dt.code}>{dt.name}</option>;
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="tel_no[]"
                        defaultValue={dt.TEL_NO}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="mobile_no[]"
                        defaultValue={dt.MOBILE_NO}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="fax_no[]"
                        defaultValue={dt.FAX_NO}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="postal_add[]"
                        defaultValue={dt.POSTAL_ADD}
                      />
                    </td>
                    <td>
                      <input type="text" name="town[]" defaultValue={dt.TOWN} />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="phy_loc[]"
                        defaultValue={dt.PHY_LOC}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="email[]"
                        defaultValue={dt.EMAIL}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="contact_person[]"
                        defaultValue={dt.CONTACT_PERSON}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="contact_mobile[]"
                        defaultValue={dt.CONTACT_MOBILE}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="contact_tel[]"
                        defaultValue={dt.CONTACT_TEL}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="user_id[]"
                        defaultValue={dt.USER_ID}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="date_entered[]"
                        defaultValue={dt.DATE_ENTERED}
                      />
                    </td>
                  </tr>
                );
              })}
              {appendedAgent.map((data) => {
                return <tr key={data.id}>{data.new}</tr>;
              })}
            </tbody>
          </table>
          <Spinner />
          <p>
            <input className="btn btn-info col-2" type="submit" value="save" />
          </p>
        </form>
      </div>
      <div className="container">
        <p className="text-info h2">Commission Rates</p>
        <hr />
      </div>
      <div className="card col-md-12">
        <button className="btn btn-success" onClick={appendCommisionRow}>Add</button>
        <form id="frmCommissionRates" onSubmit={saveCommissionRates}>
          <table
            className="table table-bordered"
            style={{ maxHeight: "300px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th className="hidden">Code</th>
                <th>Agent Type</th>
                <th>New Business</th>
                <th>Organic Growth</th>
                <th>Renewal</th>
                <th>Premium From</th>
                <th>Premium To</th>
                <th>Lives</th>
                <th>Effective From</th>
                <th>Effective To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {commissionRates.map((dt) => {
                return (
                  <tr key={dt.code}>
                    <td className="hidden">
                      <input
                        type="text"
                        name="code[]"
                        defaultValue={dt.code}
                      />
                    </td>
                    <td>
                      <select
                        name="agent_type[]"
                        defaultValue={
                          dt.agent_type == null ? "" : dt.agent_type
                        }
                      >
                        <option value="">Select Agent Type</option>
                        {agentType.map((dt) => {
                          return (
                            <option value={dt.code}>{dt.agent_type}</option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="new_business[]"
                        defaultValue={dt.new_business}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="organic_growth[]"
                        defaultValue={dt.organic_growth}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="renewal[]"
                        defaultValue={dt.renewal}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="premium_from[]"
                        defaultValue={dt.premium_from}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="premium_to[]"
                        defaultValue={dt.premium_to}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="lives[]"
                        defaultValue={dt.lives}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="effective_from[]"
                        defaultValue={dt.effective_from}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="effective_to[]"
                        defaultValue={dt.effective_to}
                      />
                    </td>
                  </tr>
                );
              })}
               {appendedCommission.map((data) => {
                return <tr key={data.id}>{data.new}</tr>;
              })}
            </tbody>
          </table>
          <Spinner />
          <p>
            <input className="btn btn-info col-2" type="submit" value="save" />
          </p>
        </form>
      </div>
      <AgentModal
        modalIsOpen={agentmodalOpen}
        closeModal={closeAgentModal}
        background="#0047AB"
        body={agentResponse.map((dt) => {
          return <p className="text-white font-weight-bold h4">{dt}</p>;
        })}
      />

      <CommissionModal
        modalIsOpen={commissionmodalOpen}
        closeModal={closeCommissionModal}
        background="#0047AB"
        body={commissionResponse.map((dt) => {
          return <p className="text-white font-weight-bold h4">{dt}</p>;
        })}
      />
    </div>
  );
};

export default AgentManagement;
