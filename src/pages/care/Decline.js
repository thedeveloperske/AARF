import React, { useState, useEffect } from "react";
import { getData, getOneData, postData } from "../../components/helpers/Data";
import { toInputUpperCase } from "../../components/helpers/toInputUpperCase";
import CustomModal from "../../components/helpers/Modal";
import { today2 } from "../../components/helpers/today";
import Modal5 from "../../components/helpers/Modal5";

const Decline = () => {
  const [disabled, setDisabled] = useState({
    memberName: true,
    memberNo: true,
    fetch: true,
    corporate: true,
    search_option: true,
    prov: true,
    search_code:true,
    save_button:true
  });
  const [choosenOption, setChoosenOption] = useState([]);
  const [searchOption, setSearchOption] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [providerData, setProvider] = useState([]);
  const [declineReason, setDeclineReason] = useState([]);
  const [selectedCorporate, setSelectedCorporate] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [declineCode, setDeclineCode] = useState([]);
  const [codeDropdown, setCodeDropdown] = useState([]);
  const [selectedCode, setSelectedCode] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [response, setResponse] = useState(false);
  const [isModalOpen, setModal2IsOpen] = useState(false);

  useEffect(() => {
    switch (choosenOption) {
      case "1":
        setDisabled({
          memberName: true,
          memberNo: true,
          fetch: true,
          corporate: false,
          search_option: false,
          prov: true,
          search_code:true,
          save_button:false
        });
        break;

      case "2":
        setDisabled({
          memberName: true,
          memberNo: true,
          fetch: true,
          corporate: true,
          search_option: true,
          prov: false,
          search_code:false,
          save_button:true
        });
        break;
    }
  }, [choosenOption]);

  useEffect(() => {
    switch (searchOption) {
      case "1":
        setDisabled({
          memberName: false,
          memberNo: true,
          fetch: false,
          corporate: false,
          search_option: false,
          prov: true,
          search_code:true,
          save_button:false
        });
        break;

      case "2":
        setDisabled({
          memberName: true,
          memberNo: false,
          fetch: false,
          corporate: false,
          prov: true,
          search_code:true,
          save_button:false
        });
        break;
    }
  }, [searchOption]);

  useEffect(() => {
    getData("fetch_corporates").then((data) => {
      setCorporates(data);
    });
    getData("fetch_providers").then((data) => {
      setProvider(data);
    });
    getData("fetch_decline_reason").then((data) => {
        setDeclineReason(data);
      });
  }, []);

  const fetchMember = (e) =>{
    e.preventDefault([]);
    if (selectedCorporate.length === 0) {
      alert('Enter Corporate');
  }
    const frmData = new FormData();
    frmData.append("task_selected", document.getElementById("task_selected").value);
    frmData.append("corp_id", document.getElementById("corp_selected").value);
    frmData.append("search_option", document.getElementById("search_option").value);
    frmData.append("memberName", document.getElementById("memberName").value);
    frmData.append("memberNo", document.getElementById("memberNo").value);

    postData(frmData, "fetch_member").then((data) => {
      console.log(data);
      setMemberData(data);
  
    });
    setModalIsOpen(true);
  }

  const chooseMember = (e) =>{
    e.preventDefault([]);
    const arr = [];
    e.target.parentNode.parentNode.querySelectorAll("td").forEach((element) => {
      arr.push(element.children[0].value);
      console.log(element.children[0].value);
    });

    getOneData("fetch_member_name", arr[2]).then((data) =>{
      console.log(data[0]);
      setMemberDetails(data[0]);
      
    });
     setModalIsOpen(false);
    getData("fetch_decline_code").then((data) => {
        console.log(data);
        setDeclineCode(data);
      });
  }

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    setCodeDropdown([]);
    if (selectedProvider != 0) {
      getOneData("fetch_code_per_provider", selectedProvider).then((data) => {
          console.log(data);
        setCodeDropdown(data);
      });
    }
  }, [selectedProvider]);

  useEffect(() => {
    const frmData = new FormData();
    if (selectedCode != 0) {
        frmData.append("provider_selected", document.getElementById("provider_selected").value);
        frmData.append("search_code", document.getElementById("search_code").value);
        postData(frmData, "fetch_decline_data").then((data) => {
          console.log(data[0]);
          setMemberDetails(data[0]);
          setDeclineCode(data[0].code);
      });
    }
  }, [selectedCode]);

  const saveDecline = (e) =>{
    e.preventDefault();
    const frmData = new FormData(document.getElementById("decline_form"))
    frmData.append("member_no", memberDetails.member_no);
    postData(frmData, "save_decline_letter").then((data)=>{
      console.log(data);
      if (data.message) {
        setResponse(data.message);
        setModal2IsOpen(true)
      }
      if (data.error) {
          alert('Save Failed');
      }
    })
  }
  const closeModal2 = () => {
    setModal2IsOpen(false);

     setTimeout(function () {
       window.location.replace("/decline");
     }, 5000);
  };

  return (
    <div>
      <div className="row ml-0">
        <h4 className="fs-title">Decline Letter</h4>
        <hr />
        <div className="col-md-12">
          <div className="row ml-0">
            <div className="form-group row">
              <div className="col-md-2">
                <select
                  id="task_selected"
                  defaultValue="0"
                  className="form-control"
                  required="true"
                  onChange={(e) => setChoosenOption(e.target.value)}
                >
                  <option disabled value="0">
                    Select Task
                  </option>
                  <option value="1">Decline</option>
                  <option value="2">Query Decline</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  id="corp_selected"
                  defaultValue="0"
                  className="form-control"
                  required="true"
                  hidden={disabled.corporate}
                  onChange={(e) => setSelectedCorporate(e.target.value)}
                >
                  <option disabled value="0">
                    Select Corporate
                  </option>
                  {corporates.map((data) => {
                    return (
                      <option value={data.CORP_ID}>{data.CORPORATE}</option>
                    );
                  })}
                </select>
                <select
                  id="provider_selected"
                  defaultValue="0"
                  className="form-control"
                  required="true"
                  hidden={disabled.prov}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
                  <option disabled value="0">
                    Select Provider
                  </option>
                  {providerData.map((data) => {
                    return (
                      <option value={data.CODE}>{data.PROVIDER}</option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  id="search_option"
                  defaultValue="0"
                  className="form-control"
                  required="true"
                  hidden={disabled.search_option}
                  onChange={(e) => setSearchOption(e.target.value)}
                >
                  <option disabled value="0">
                    Select Search By
                  </option>
                  <option value="1">Member Name</option>
                  <option value="2">Member No</option>
                </select>
                <select
                  id="search_code"
                  defaultValue="0"
                  className="form-control"
                  required="true"
                  hidden={disabled.search_code}
                  onChange={(e) => setSelectedCode(e.target.value)}
                >
                  <option disabled value="0">
                    Select Code
                  </option>
                  {codeDropdown.map((dt)=>{
                      return(
                        <option key={dt.code} value={dt.code}>
                            {dt.code}
                        </option>
                      );
                  })}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  id="memberName"
                  className="form-control"
                  placeholder="Enter Member Name"
                  hidden={disabled.memberName}
                  onInput={toInputUpperCase}
                />
                <input
                  type="text"
                  id="memberNo"
                  className="form-control"
                  placeholder="Enter Member No"
                  hidden={disabled.memberNo}
                  onInput={toInputUpperCase}
                />
              </div>
              <div className={"col-md-1 pr-0 pl-0"}>
                <button
                  className="btn btn-info form-control"
                  onClick={fetchMember}
                  id="fetch"
                  hidden={disabled.fetch}
                >
                  Fetch Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="queryclaims" className="project-tab">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <form id="decline_form" onSubmit={saveDecline}>
                    <div className="tab-content" id="nav-tabContent">
                      <div className="row">
                        <div className="col-md-12">
                          <p className="h2 text-info">Decline Info</p>
                          <hr />
                          <div className="form-group row justify-content-center">
                            <div className="col-md-2">
                              <label className="col-form-label label-align">
                                Code:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                name="code"
                                value={declineCode}
                                readOnly
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label label-align">
                                Member Name:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                name="member_name"
                                value={memberDetails.full_name}
                                readOnly
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label">
                                Provider:
                              </label>
                            </div>
                            <div className="col-md-10">
                              <select className="form-control" name="provider" >
                              <option value={memberDetails.provider_code}>
                                    {memberDetails.provider}
                                </option>
                                {providerData.map((data) => {
                                    return (
                                    <option value={data.CODE}>{data.PROVIDER}</option>
                                    );
                                })}
                              </select>
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label label-align">
                                Decline Date:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="date"
                                className="form-control"
                                name="decline_date"
                                value={memberDetails.decline_date}
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label label-align">
                                Admitted Date:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="date"
                                className="form-control"
                                name="date_admitted"
                                value={memberDetails.date_admitted}
                              />
                            </div>

                            <div className="col-md-2">
                              <label className="col-form-label">
                                Date Entered:
                              </label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                className="form-control"
                                name="date_entered"
                                value={today2()}
                                readOnly
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label">User:</label>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="text"
                                name="user"
                                className="form-control"
                                value={localStorage.getItem("username")}
                                readOnly
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label">
                                Decline Reason:
                              </label>
                            </div>
                            <div className="col-md-10">
                              <select
                                className="form-control"
                                name="decline_reason"
                              >
                                <option value={memberDetails.decline_code}>
                                    {memberDetails.decline_reason}
                                </option>
                                {declineReason.map((data)=>{
                                    return(
                                        <option value={data.code}>{data.decline_reason} </option>
                                    );
                                })}
                              </select>
                            </div>
                            <div className="col-md-2">
                              <label className="col-form-label">Notes:</label>
                            </div>
                            <div className="col-md-10">
                              <textarea name="notes" className="form-control" />
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-md-4">
                          <p className="h2 text-info">Member Info</p>
                          <hr />
                          <div className="form-group row justify-content-center">
                            <div className="col-md-4">
                              <label className="col-form-label label-align">
                                member Photo
                              </label>
                            </div>
                            <div className="col-md-8">
                              <textarea
                                name="remarks"
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div> */}
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary form-control col-2"
                        style={{ float: "right", position: "sticky" }}
                        hidden={disabled.save_button}
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

      <CustomModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        header={<p className="alert alert-info text-lg">Choose Member</p>}
        body={
          <table
            id="tblPrincipal"
            className="table table-bordered table-sm text-center"
            style={{ maxHeight: "200px", width:"700px"  }}
          >
            <thead className="thead-dark">
              <tr>
                <th scope="col">Principal Name</th>
                <th scope="col">Family No</th>
                <th scope="col">Member No</th>
                <th scope="col">Member Name</th>
                <th scope="col">Gender</th>
                <th scope="col">Dob</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {memberData.map((data) => {
                return (
                  <tr>
                    <td>
                      <input
                        type="text"
                        id="modal_member_no"
                        value={data.principal_name}
                        className="form-control"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id="modal_member_no"
                        value={data.family_no}
                        className="form-control"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        id="modal_member_no"
                        value={data.member_no}
                        className="form-control"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={data.member_name}
                        className="form-control"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={data.gender}
                        className="form-control"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={data.dob}
                        className="form-control"
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="button"
                        value="View"
                        className="btn btn-info btn-sm"
                        onClick={chooseMember}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        }
      />
        <Modal5
          modalIsOpen={isModalOpen}
          closeModal={closeModal2}
          header={<p id="headers">Decline</p>}
          body={
              <div>
                  <div className={"row"}>
                      <p>{response}</p>
                  </div>
                  <div className={"row justify-content-center"}>
                      <button className="btn btn-outline-danger"
                              onClick={(e) => setModal2IsOpen(false)}>Close
                      </button>
                  </div>
              </div>
          }/>
    </div>
  );
};

export default Decline;
