import React, { useState, useEffect } from "react";
import { getData, postData } from "../../components/helpers/Data";
import Modal5 from "../../components/helpers/Modal5";

const CorporateVisit = () => {
    const [corporates, setCorporates] = useState([]);
    const [users, setUsers] = useState([]);
    const [contactRelation, setContactRelation] = useState([]);
    const [appendedMattersArisingRow, setAppendedMattersArisingRow] = useState([]);
    const [corpVisitIssue, setCorpVisitIssue] = useState([]);
    const [visitNo, setVisitNo] = useState([]);
    const [issueNo, setIssueNo] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [response, setResponse] = useState(false);

    useEffect(() => {
        getData("fetch_corporates").then((data) => {
          setCorporates(data);
        });
        getData("fetch_user_names").then((data) => {
            setUsers(data);
          });
        getData("fetch_contact_relations").then((data) => {
            setContactRelation(data);
        });
        getData("fetch_corp_visit_issue").then((data) => {
          setCorpVisitIssue(data);
      });
      getData("fetch_visit_no").then((data) => {
        setVisitNo(data);
      });
      getData("fetch_issue_no").then((data) => {
        setIssueNo(data);
      });
    }, []);

    const appendMattersArising = (e) => {
        e.preventDefault();
        const arr = [];
        e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
          arr.push(element.textContent);
        });
    
        const row = {
          id: new Date().getTime().toString(),
          new: (
            <>
              <td>
              <input
                    type="text"
                    className="form-control"
                    name="issue_no"
                    value={issueNo}
                />
              </td>
              <td>
              <input
                    type="text"
                    className="form-control"
                    name="visit_no"
                    value={visitNo}
                />
              </td>
              <td>
                <select
                    className="form-control"
                    name="issue"
                    defaultValue="0"
                    required="true"
                    >
                      <option disabled value="0">
                          Select issue
                      </option>
                      {corpVisitIssue.map((data)=>{
                          return(
                              <option value={data.code}>{data.comments}</option>
                          );
                      })}
                </select>
              </td>
              <td>
              <select
                    className="form-control"
                    name="assign_to"
                    defaultValue="0"
                    required="true"
                    >
                      <option disabled value="0">
                          Select Assign To
                      </option>
                      {users.map((data)=>{
                          return(
                              <option value={data.user_name}>{data.user_name}</option>
                          );
                      })}
                </select>
              </td>
              <td>
                <input
                    type="date"
                    className="form-control"
                    name="completed_by"
                />
              </td>
              <td>
              <input
                    type="date"
                    className="form-control"
                    name="completed_on"
                />
              </td>
              <td>
                <i
                  className="fas fa-trash text-danger"
                  onClick={() => removeMattersArising(row.id, e)}
                ></i>
              </td>
            </>
          ),
        };
    
        setAppendedMattersArisingRow((appendMattersRow) => {
          return [...appendMattersRow, row];
        });
      };
    
      const removeMattersArising = async (id, e) => {
        e.preventDefault();
        setAppendedMattersArisingRow((appendMattersRow) => {
          return appendMattersRow.filter((row) => row.id !== id);
        });
      };

      const saveCorpVisit = (e) =>{
        e.preventDefault();
        const frmData = new FormData(document.getElementById("corporate_visit_form"))
        postData(frmData, "save_corporate_visit").then((data)=>{
          console.log(data);
          if (data.message) {
            setResponse(data.message);
              setModalOpen(true)

          }
          if (data.error) {
              alert('Save Failed');
          }
         
        })
      }
       //close modal
     const closeModal = () => {
      setModalOpen(false);

        setTimeout(function () {
          window.location.replace("/corporate-visit");
        }, 5000);
    }
  return (
    <div>
      <section id="queryclaims" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <form id="corporate_visit_form" onSubmit={saveCorpVisit}>
                    <div className="tab-content" id="nav-tabContent">
                      <div className="row">
                        <div className="col-md-12">
                          <p className="h3 text-info">Corporate Visit</p>
                          <hr />
                          <div className="form-group row justify-content-center">
                            <div className="col-md-2">
                              <label className="col-form-label label-align">
                                Visit No:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                name="visit_no"
                                value={visitNo}
                                readOnly
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label">
                                Corporate:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                name="corp_id"
                                defaultValue="0"
                                required="true"
                              >
                                  <option disabled value="0">
                                      Select Corporate
                                  </option>
                                  {corporates.map((data)=>{
                                      return(
                                          <option value={data.CORP_ID}>{data.CORPORATE}</option>
                                      );
                                  })}
                              </select>
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label label-align">
                                Visit Date:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="date"
                                className="form-control"
                                name="visit_date"
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label">
                                Visited By:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <select
                                className="form-control"
                                name="visited_by"
                                defaultValue="0"
                                required="true"
                              >
                                  <option disabled value="0">
                                      Select Visited By
                                  </option>
                                  {users.map((data)=>{
                                      return(
                                          <option value={data.user_name}>{data.user_name}</option>
                                      );
                                  })}
                              </select>
                            </div>

                            <div className="col-md-2">
                              <label className="col-form-label">
                                Met With:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                name="met_with"
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label">Next Visit Date:</label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="date"
                                name="next_visit_date"
                                className="form-control"
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label">
                                Met With Title:
                              </label>
                            </div>
                            <div className="col-md-10">
                              <select
                                className="form-control"
                                name="met_with_title"
                                defaultValue="0"
                                required="true"
                              >
                                <option disabled value="0">
                                    Select Met With Title
                                </option>
                                {contactRelation.map((data)=>{
                                    return(
                                        <option value={data.CODE}>{data.RELATION}</option>
                                    );
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                        <div className="row">
                          <div className="mx-auto">
                          <p className="h3 text-info">Matters Arising</p>
                            <button
                              className="btn btn-info col-2 form-control"
                              onClick={appendMattersArising}
                            >
                              Add
                            </button>
                            <table
                              className="table table-bordered"
                              style={{ maxHeight: "300px" }}
                            >
                              <thead className="thead-dark">
                                <tr>
                                  <th>Issue No</th>
                                  <th>Visit No</th>
                                  <th>Issue</th>
                                  <th>Assign To</th>
                                  <th>Completed By</th>
                                  <th>Completed On</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {appendedMattersArisingRow.map((dt) => {
                                  return (
                                    <tr className="appendedDiag" key={dt.id}>
                                      {dt.new}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      <button
                        type="submit"
                        className="btn btn-primary form-control col-2"
                        style={{ float: "right", position: "sticky" }}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal5
          modalIsOpen={isModalOpen}
          closeModal={closeModal}
          header={<p id="headers">Corporate Visit</p>}
          body={
              <div>
                  <div className={"row"}>
                      <p>{response}</p>
                  </div>
                  <div className={"row justify-content-center"}>
                      <button className="btn btn-outline-danger"
                              onClick={(e) => setModalOpen(false)}>Close
                      </button>
                  </div>
              </div>
          }/>
    </div>
  );
};

export default CorporateVisit;
