import { getData, getOneData } from "../components/helpers/Data";
import DashboardCard from "../components/helpers/DashboardCard";
import { useState, useEffect } from "react";
import Modal from "../components/helpers/Modal4";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tableDt, setTableDt] = useState({ heading: "", body: "" });

  useEffect(() => {
    getData("dashboard").then((data) => {
      setDashboardData(data);
    });
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const fetchData = (val) => {
    setTableDt({ heading: "", body: "" });
    let body = "";
    let heading = "";
    getOneData("fetch_dashboard_data", val)
      .then((data) => {
        switch (val) {
          case 1:
            body = (
              <table
                className="table table-bordered table-hover table-sm"
                style={{ height: "300px", maxWidth: "700px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    {data.headers.map((dt) => {
                      return <th>{dt}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.tbldata.map((dt) => {
                    return (
                      <tr>
                        <td>{dt.corp_id}</td>
                        <td>{dt.corporate}</td>
                        <td>{dt.phy_loc}</td>
                        <td>{dt.email}</td>
                        <td>{dt.policy_no}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
            heading = "All Corporates";
            break;
          case 2:
            body = (
              <table
                className="table table-bordered table-hover table-sm"
                style={{ height: "300px", maxWidth: "700px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    {data.headers.map((dt) => {
                      return <th>{dt}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.tbldata.map((dt) => {
                    return (
                      <tr>
                        <td>{dt.corp_id}</td>
                        <td>{dt.corporate}</td>
                        <td>{dt.phy_loc}</td>
                        <td>{dt.email}</td>
                        <td>{dt.policy_no}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
            heading = "Active Corporates";
            break;
          case 3:
            body = (
              <table
                className="table table-bordered table-hover table-sm"
                style={{ height: "300px", maxWidth: "700px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    {data.headers.map((dt) => {
                      return <th>{dt}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.tbldata.map((dt) => {
                    return (
                      <tr>
                        <td>{dt.family_no}</td>
                        <td>{dt.member_no}</td>
                        <td>{dt.surname}</td>
                        <td>{dt.first_name}</td>
                        <td>{dt.dob}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
            heading = "Active Members";
            break;
          case 4:
            body = (
              <table
                className="table table-bordered table-hover table-sm"
                style={{ height: "300px", maxWidth: "700px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    {data.headers.map((dt) => {
                      return <th>{dt}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.tbldata.map((dt) => {
                    return (
                      <tr>
                        <td>{dt.agent_id}</td>
                        <td>{dt.agent_name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
            heading = "Agents";
            break;
          case 5:
            body = (
              <table
                className="table table-bordered table-hover table-sm"
                style={{ height: "300px", maxWidth: "700px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    {data.headers.map((dt) => {
                      return <th>{dt}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.tbldata.map((dt) => {
                    return (
                      <tr>
                        <td>{dt.code}</td>
                        <td>{dt.provider}</td>
                        <td>{dt.tel_no}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
            heading = "Providers";
            break;
          case 6:
            body = (
              <table
                className="table table-bordered table-hover table-sm"
                style={{ height: "300px", maxWidth: "700px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    {data.headers.map((dt) => {
                      return <th>{dt}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.tbldata.map((dt) => {
                    return (
                      <tr>
                        <td>{dt.code}</td>
                        <td>{dt.benefit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
            heading = "Benefits";
            break;
          case 7:
            body = (
              <table
                className="table table-bordered table-hover table-sm"
                style={{ height: "300px", maxWidth: "700px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    {data.headers.map((dt) => {
                      return <th>{dt}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.tbldata.map((dt) => {
                    return (
                      <tr>
                        <td>{dt.code}</td>
                        <td>{dt.bank}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
            heading = "Banks";
            break;
          case 8:
            body = (
              <table
                className="table table-bordered table-hover table-sm"
                style={{ height: "300px", maxWidth: "700px" }}
              >
                <thead className="thead-dark">
                  <tr>
                    {data.headers.map((dt) => {
                      return <th>{dt}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data.tbldata.map((dt) => {
                    return (
                      <tr>
                        <td>{dt.member_no}</td>
                        <td>{dt.pre_diagnosis}</td>
                        <td>{dt.admit_days}</td>
                        <td>{dt.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
            heading = "LOUs";
            break;
        }

        setTableDt({ heading, body });
        setModalIsOpen(true);
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="row">
      <DashboardCard
        dt={
          dashboardData.corporates
            ? dashboardData.corporates.toLocaleString()
            : ""
        }
        color="#0275d8"
        name="ALL CORPORATES"
        icon={<i class="fas fa-building"></i>}
        btn={
          <span className="small-box-footer" onClick={() => fetchData(1)}>
            More info <i className="fas fa-arrow-circle-right"></i>
          </span>
        }
      />
      <DashboardCard
        dt={
          dashboardData.active_corporates
            ? dashboardData.active_corporates.toLocaleString()
            : ""
        }
        color="#16A085"
        name="ACTIVE CORPORATES"
        icon={<i class="far fa-building"></i>}
        btn={
          <span className="small-box-footer" onClick={() => fetchData(2)}>
            More info <i className="fas fa-arrow-circle-right"></i>
          </span>
        }
      />
      <DashboardCard
        dt={
          dashboardData.active_members
            ? dashboardData.active_members.toLocaleString()
            : ""
        }
        color="#5cb85c"
        name="ACTIVE MEMBERS"
        icon={<i class="fas fa-users"></i>}
        btn={
          <span className="small-box-footer" onClick={() => fetchData(3)}>
            More info <i className="fas fa-arrow-circle-right"></i>
          </span>
        }
      />
      <DashboardCard
        dt={dashboardData.agents ? dashboardData.agents.toLocaleString() : ""}
        color="#5bc0de"
        name="AGENTS"
        icon={<i class="fas fa-user-tie"></i>}
        btn={
          <span className="small-box-footer" onClick={() => fetchData(4)}>
            More info <i className="fas fa-arrow-circle-right"></i>
          </span>
        }
      />
      <DashboardCard
        dt={
          dashboardData.providers
            ? dashboardData.providers.toLocaleString()
            : ""
        }
        color="#A569BD"
        name="PROVIDERS"
        icon={<i class="fas fa-hospital-symbol"></i>}
        btn={
          <span className="small-box-footer" onClick={() => fetchData(5)}>
            More info <i className="fas fa-arrow-circle-right"></i>
          </span>
        }
      />
      <DashboardCard
        dt={
          dashboardData.benefits ? dashboardData.benefits.toLocaleString() : ""
        }
        color="#707B7C"
        name="BENEFITS"
        icon={<i class="fas fa-procedures"></i>}
        btn={
          <span className="small-box-footer" onClick={() => fetchData(6)}>
            More info <i className="fas fa-arrow-circle-right"></i>
          </span>
        }
      />
      <DashboardCard
        dt={dashboardData.banks ? dashboardData.banks.toLocaleString() : ""}
        color="purple"
        icon={<i class="fas fa-hand-holding-usd"></i>}
        name="BANKS"
        btn={
          <span className="small-box-footer" onClick={() => fetchData(7)}>
            More info <i className="fas fa-arrow-circle-right"></i>
          </span>
        }
      />
      <DashboardCard
        dt={
          dashboardData.pre_authorizations
            ? dashboardData.pre_authorizations.toLocaleString()
            : ""
        }
        color="#2C3E50"
        name="LOUs"
        icon={<i class="fas fa-file-medical-alt"></i>}
        btn={
          <span className="small-box-footer" onClick={() => fetchData(8)}>
            More info <i className="fas fa-arrow-circle-right"></i>
          </span>
        }
      />

      <Modal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        header={
          <div>
            <p className="text-info h2">{tableDt.heading}</p>
            <hr />
          </div>
        }
        body={<div className="table-responsive">{tableDt.body}</div>}
      />
    </div>
  );
};

export default Dashboard;
