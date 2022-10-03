import React, { useState, useEffect } from "react";
import {
  getData,
  getOneData,
  getTwoData,
  postData,
} from "../../../components/helpers/Data";
import "../../../css/policyDoc.css";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import Modal from "../../../components/helpers/Modal2";

const PolicyDocumentRetail = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [corporates, setCorporates] = useState([]);
  const [retail, setRetail] = useState([]);
  const [smes, setSmes] = useState([]);
  const [selectedCorp, setSelectedCorp] = useState("0");
  const [selectedRetail, setSelectedRetail] = useState("0");
  const [selectedSme, setSelectedSme] = useState("0");
  const [annivs, setAnnivs] = useState([]);
  const [selectedAnniv, setSelectedAnniv] = useState("0");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [productNames, setProductNames] = useState([]);
  const [policyDocs, setPolicyDocs] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState("0");
  const [policyData, setPolicyData] = useState([]);
  const [clientName, setClientName] = useState([]);
    const [clientAddress, setClientAddress] = useState([]);
  const [hidden, setHidden] = useState({
    retail: true,
    anniv: true,
    category: true,
    product_name: true,
    policy_docs: true,
    search: true,
    save: true,
    update: true,
    print: true,
  });

  const closeModal = () => {
    setModalIsOpen(false);
    window.location.replace("/policy-document-retail");
  };

  const clearData = () => {
    setPolicyData([]);
    document.getElementById("1").value = "0";
    document.getElementById("2").value = "0";
    document.getElementById("3").value = "0";
    document.getElementById("4").value = "0";
    document.getElementById("5").value = "0";
    document.getElementById("6").value = "0";
    document.getElementById("7").value = "0";
    document.getElementById("8").value = "0";
    document.getElementById("9").value = "0";
    document.getElementById("10").value = "0";
    document.getElementById("11").value = "0";
    document.getElementById("12").value = "0";
    document.getElementById("13").value = "0";
    document.getElementById("14").value = "0";
    document.getElementById("15").value = "0";
    // document.getElementById("16").value = "0";
    document.getElementById("17").value = "0";
    document.getElementById("18").value = "0";
    document.getElementById("19").value = "0";
    document.getElementById("20").value = "0";
    document.getElementById("21").value = "0";
    document.getElementById("22").value = "0";
    document.getElementById("23").value = "0";
    document.getElementById("24").value = "0";
    document.getElementById("25").value = "0";
    document.getElementById("26").value = "0";
    document.getElementById("27").value = "0";
    document.getElementById("28").value = "0";
  };

  useEffect(() => {
    //fetch retail principals
    getData("fetch_individuals")
      .then((data) => setRetail(data))
      .catch((error) => console.log(error));
    //fetch client address
    getOneData("fetch_client_address", 4).then((data) => {
      setClientAddress(data);
    });
  }, []);

  useEffect(() => {
    clearData();
    switch (selectedOption) {
      case "0":
        setHidden({
          retail: true,
          anniv: true,
          category: true,
          product_name: true,
          policy_docs: true,
          search: true,
          save: true,
          update: true,
          print: true,
        });
        break;
      case "1":
        setHidden({
          retail: false,
          anniv: false,
          category: false,
          product_name: false,
          policy_docs: true,
          search: false,
          save: false,
          update: true,
          print: true,
        });
        break;
      case "2":
        setHidden({
          retail: false,
          anniv: true,
          category: true,
          product_name: true,
          policy_docs: false,
          search: true,
          save: true,
          update: true,
          print: false,
        });
        break;
    }
  }, [selectedOption]);

  //fetch retail annivs or policy docs
  useEffect(() => {
    document.getElementById("annivs").value = "0";
    document.getElementById("policy_docs").value = "0";
    if (selectedRetail !== "0") {
      if (selectedOption === "1") {
        getOneData("fetch_annivs_for_member", selectedRetail)
          .then((data) => setAnnivs(data))
          .catch((error) => console.log(error));
      } else if (selectedOption === "2") {
        getTwoData("fetch_policy_docs", selectedRetail, "retail")
          .then((data) => setPolicyDocs(data))
          .catch((error) => console.log(error));
      }
    }
  }, [selectedRetail]);

  //fetch categories
  useEffect(() => {
    document.getElementById("category").value = "0";
    const frmData = new FormData(document.getElementById("frmPolicyDocument"));
    frmData.append("client_type", "retail");
    if (selectedAnniv !== "0") {
      postData(frmData, "fetch_corp_or_family_categories")
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedAnniv]);

  //fetch product names
  useEffect(() => {
    document.getElementById("product_name").value = "0";
    const frmData = new FormData(document.getElementById("frmPolicyDocument"));
    frmData.append("client_type", "retail");
    if (selectedCategory !== "0") {
      postData(frmData, "fetch_corp_or_family_product_names")
        .then((data) => {
          console.log(data);
          setProductNames(data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedCategory]);

  //fetch policy data
  useEffect(() => {
    setPolicyData([]);
    if (selectedPolicy !== "0") {
      var e = document.getElementById("retail");
      var innerText = e.options[e.selectedIndex].text;
      innerText = innerText.split("-");
      setClientName(innerText[0]);
      getOneData("fetch_policy_doc_data", selectedPolicy)
        .then((data) => {
          console.log(data);
          setPolicyData(data);
        })
        .catch((error) => console.log(error));
    }
  }, [selectedPolicy]);

  //fetch policy data
  const fetchPolicyData = (e) => {
    e.preventDefault();
    var e = document.getElementById("retail");
    var innerText = e.options[e.selectedIndex].text;
    const frmData = new FormData(document.getElementById("frmPolicyDocument"));
    frmData.append("client_type", "retail");
    frmData.append("retail", selectedRetail);
    frmData.append("client_name", innerText);
    postData(frmData, "fetch_policy_data_create").then((data) => {
      console.log(data);
      setPolicyData(data);
    });
  };

  //save policy document
  const savePolicyDocument = (e) => {
    e.preventDefault();
    var e = document.getElementById("annivs");
    var anniv = e.options[e.selectedIndex].text;
    const frmData = new FormData(
      document.getElementById("frmPolicyDocumentSave")
    );
    frmData.append("client_type", "retail");
    frmData.append("anniv", anniv);
    frmData.append("member_no", selectedRetail);
    frmData.append("user_id", localStorage.getItem("username"));
    postData(frmData, "save_policy_document")
      .then((data) => {
        console.log(data);
        setFeedback(data);
        setModalIsOpen(true);
      })
      .catch((error) => console.log(error));
  };

  //print pdf
  const printPdf = (e) => {
    e.preventDefault();
    let tblOne = "";
    let tblTwo = "";
    let tblThree = "";
    let tblFour = "";
    let tblFive = "";
    let tblSix = "";
    let tblSeven = "";
    let tblEight = "";
    let tblNine = "";
    let tblTen = "";
    let tblEleven = "";
    let tblTwelve = "";
    const TblOneRows = document.querySelector("#tableOne tbody").children;
    const TblTwoRows = document.querySelector("#tableTwo tbody").children;
    const TblThreeRows = document.querySelector("#tableThree tbody").children;
    const TblFourRows = document.querySelector("#tableFour tbody").children;
    const TblFiveRows = document.querySelector("#tableFive tbody").children;
    const TblSixRows = document.querySelector("#tableSix tbody").children;
    const TblSevenRows = document.querySelector("#tableSeven tbody").children;
    const TblEightRows = document.querySelector("#tableEight tbody").children;
    const TblNineRows = document.querySelector("#tableNine tbody").children;
    const TblTenRows = document.querySelector("#tableTen tbody").children;
    const TblElevenRows = document.querySelector("#tableEleven tbody").children;
    const TblTwelveRows = document.querySelector("#tableTwelve tbody").children;

    let address = `
      <ul style="list-style-type: none">
        <li>${clientAddress[0].client_name}</li>
        <li>${clientAddress[0].physical_location}</li>
        <li>${clientAddress[0].box_no}</li>
        <li>${clientAddress[0].tel_cell}</li>
        <li>${clientAddress[0].fax}</li>
        <li>${clientAddress[0].email}</li>
        <li>${clientAddress[0].url}</li>
      </ul>
   `;

    tblOne += `
    <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Client</th></tr> 
      <tr><th>${TblOneRows[0].children[0].textContent}</th><th>${
      TblOneRows[0].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblOneRows[1].children[0].textContent}</th><th>${
      TblOneRows[1].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblOneRows[2].children[0].textContent}</th><th>${
      TblOneRows[2].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblOneRows[3].children[0].textContent}</th><th>${
      TblOneRows[3].children[1].children[0].options[
        TblOneRows[3].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
      <tr><th>${TblOneRows[4].children[0].textContent}</th><th>${
      TblOneRows[4].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblOneRows[5].children[0].textContent}</th><th>${
      TblOneRows[5].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblOneRows[6].children[0].textContent}</th><th>${
      TblOneRows[6].children[1].children[0].value
    }</th></tr>      
    `;
    tblTwo += `
    <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Value Added Services</th></tr> 
    <tr><th colspan="2" style="text-align:center"> Cash Back Scheme: Award to our clients for being in control of their
            health (Zero claim on outpatient) ten percent of premiums. (For corporates with 65% or less of entire scheme Utilisation)</th></tr> 
      <tr><th>${TblTwoRows[0].children[0].textContent}</th><th>${
      TblTwoRows[0].children[1].children[0].options[
        TblTwoRows[0].children[1].children[0].selectedIndex
      ].text
    }</th></tr>     
    `;
    tblThree += `
 <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Inpatient Benefits (Pre-authorization will be required for inpatient cover)</th></tr> 
      <tr><th>${TblThreeRows[0].children[0].textContent}</th><th>${
      TblThreeRows[0].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblThreeRows[1].children[0].textContent}</th><th>${
      TblThreeRows[1].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblThreeRows[2].children[0].textContent}</th><th>${
      TblThreeRows[2].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblThreeRows[3].children[0].textContent}</th><th>${
      TblThreeRows[3].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblThreeRows[4].children[0].textContent}</th><th>${
      TblThreeRows[4].children[1].children[0].value
    }</th></tr>
      <tr><th>${TblThreeRows[5].children[0].textContent}</th><th>${
      TblThreeRows[5].children[1].children[0].value
    }</th>
      <tr>
      <th>${TblThreeRows[6].children[0].textContent}</th><th>${
      TblThreeRows[6].children[1].children[0].options[
        TblThreeRows[6].children[1].children[0].selectedIndex
      ].text
    }</th>
    </tr>
      <tr><th>${TblThreeRows[7].children[0].textContent}</th><th>${
      TblThreeRows[7].children[1].children[0].value
    }</th>
    </tr>      
     <tr>
      <th>${TblThreeRows[8].children[0].textContent}</th><th>${
      TblThreeRows[8].children[1].children[0].options[
        TblThreeRows[8].children[1].children[0].selectedIndex
      ].text
    }</th>
    </tr>
      <tr><th>${TblThreeRows[9].children[0].textContent}</th><th>${
      TblThreeRows[9].children[1].children[0].value
    }</th></tr>      
      <tr><th>${TblThreeRows[10].children[0].textContent}</th><th>${
      TblThreeRows[10].children[1].children[0].options[
        TblThreeRows[10].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
      <tr><th>${TblThreeRows[11].children[0].textContent}</th><th>${
      TblThreeRows[11].children[1].children[0].options[
        TblThreeRows[11].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
      <tr><th>${TblThreeRows[12].children[0].textContent}</th><th>${
      TblThreeRows[12].children[1].children[0].value
    }</th></tr>      
      <tr><th>${TblThreeRows[13].children[0].textContent}</th><th>${
      TblThreeRows[13].children[1].children[0].value
    }</th></tr>      
      <tr><th>${TblThreeRows[14].children[0].textContent}</th><th>${
      TblThreeRows[14].children[1].children[0].options[
        TblThreeRows[14].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
      <tr><th>${TblThreeRows[15].children[0].textContent}</th><th>${
      TblThreeRows[15].children[1].children[0].options[
        TblThreeRows[15].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
      <tr><th>${TblThreeRows[16].children[0].textContent}</th><th>${
      TblThreeRows[16].children[1].children[0].options[
        TblThreeRows[16].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
      <tr><th>${TblThreeRows[17].children[0].textContent}</th><th>${
      TblThreeRows[17].children[1].children[0].options[
        TblThreeRows[17].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
      <tr><th>${TblThreeRows[18].children[0].textContent}</th><th>${
      TblThreeRows[18].children[1].children[0].value
    }</th></tr>      
      <tr><th>${TblThreeRows[19].children[0].textContent}</th><th>${
      TblThreeRows[19].children[1].children[0].value
    }</th></tr>      
      <tr><th>${TblThreeRows[20].children[0].textContent}</th><th>${
      TblThreeRows[20].children[1].children[0].value
    }</th></tr>  
    </tr>      
         
      <tr><th>${TblThreeRows[21].children[0].textContent}</th><th>${
      TblThreeRows[21].children[1].children[0].options[
        TblThreeRows[21].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
      <tr><th>${TblThreeRows[22].children[0].textContent}</th><th>${
      TblThreeRows[22].children[1].children[0].options[
        TblThreeRows[22].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
      <tr><th>${TblThreeRows[23].children[0].textContent}</th><th>${
      TblThreeRows[23].children[1].children[0].value
    }</th></tr>      
      <tr><th>${TblThreeRows[24].children[0].textContent}</th><th>${
      TblThreeRows[24].children[1].children[0].value
    }</th></tr>      
    `;

    tblFour += `
          <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Rescue and Evacuation</th></tr> 
      <tr><th>${TblFourRows[0].children[0].textContent}</th><th>${
      TblFourRows[1].children[1].children[0].options[
        TblFourRows[1].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
      <tr><th>${TblFourRows[1].children[0].textContent}</th><th>${
      TblFourRows[1].children[1].children[0].options[
        TblFourRows[1].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
      <tr><th>${TblFourRows[2].children[0].textContent}</th><th>${
      TblFourRows[2].children[1].children[0].options[
        TblFourRows[2].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    `;
    tblFive += `
     <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Maternity Cover (For Principal and Spouse only in Uganda) : Pre-authorization will be required for cover</th></tr> 
      <tr><th>${TblFiveRows[0].children[0].textContent}</th><th>${
      TblFiveRows[0].children[1].children[0].value
    }</th></tr> 
      <tr><th>${TblFiveRows[1].children[0].textContent}</th><th>${
      TblFiveRows[1].children[1].children[0].value
    }</th></tr> 
      <tr><th>${TblFiveRows[2].children[0].textContent}</th><th>${
      TblFiveRows[2].children[1].children[0].value
    }</th></tr> 
      <tr><th>${TblFiveRows[3].children[0].textContent}</th><th>${
      TblFiveRows[3].children[1].children[0].options[
        TblFiveRows[3].children[1].children[0].selectedIndex
      ].text
    }</th></tr>       
    `;
    tblSix += `
     <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Outpatient Benefits (East Africa Only)</th></tr> 
    <tr><th>${TblSixRows[0].children[0].textContent}</th><th>${
      TblSixRows[0].children[1].children[0].value
    }</th></tr> 
     <tr><th>${TblSixRows[1].children[0].textContent}</th><th>${
      TblSixRows[1].children[1].children[0].options[
        TblSixRows[1].children[1].children[0].selectedIndex
      ].text
    }</th></tr>
    <tr><th>${TblSixRows[2].children[0].textContent}</th><th>${
      TblSixRows[2].children[1].children[0].value
    }</th></tr> 
    <tr><th>${TblSixRows[3].children[0].textContent}</th><th>${
      TblSixRows[3].children[1].children[0].value
    }</th></tr> 
    <tr><th>${TblSixRows[4].children[0].textContent}</th><th>${
      TblSixRows[4].children[1].children[0].options[
        TblSixRows[4].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblSixRows[5].children[0].textContent}</th><th>${
      TblSixRows[5].children[1].children[0].options[
        TblSixRows[5].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblSixRows[6].children[0].textContent}</th><th>${
      TblSixRows[6].children[1].children[0].options[
        TblSixRows[6].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblSixRows[7].children[0].textContent}</th><th>${
      TblSixRows[7].children[1].children[0].options[
        TblSixRows[7].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblSixRows[8].children[0].textContent}</th><th>${
      TblSixRows[8].children[1].children[0].value
    }</th></tr> 
    <tr><th>${TblSixRows[9].children[0].textContent}</th><th>${
      TblSixRows[9].children[1].children[0].value
    }</th></tr> 
    <tr><th>${TblSixRows[10].children[0].textContent}</th><th>${
      TblSixRows[10].children[1].children[0].options[
        TblSixRows[10].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblSixRows[11].children[0].textContent}</th><th>${
      TblSixRows[11].children[1].children[0].options[
        TblSixRows[11].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblSixRows[12].children[0].textContent}</th><th>${
      TblSixRows[12].children[1].children[0].value
    }</th></tr> 
    `;
    tblSeven += `
     <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Optometry</th></tr> 
      <tr><th>${TblSevenRows[0].children[0].textContent}</th><th>${
      TblSevenRows[0].children[1].children[0].value
    }</th></tr>     
      <tr><th>${TblSevenRows[1].children[0].textContent}</th><th>${
      TblSevenRows[1].children[1].children[0].options[
        TblSevenRows[1].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
      <tr><th>${TblSevenRows[2].children[0].textContent}</th><th>${
      TblSevenRows[2].children[1].children[0].options[
        TblSevenRows[2].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    `;
    tblEight += `
     <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Dental</th></tr> 
      <tr><th>${TblEightRows[0].children[0].textContent}</th><th>${
      TblEightRows[0].children[1].children[0].value
    }</th></tr>     
      <tr><th>${TblEightRows[1].children[0].textContent}</th><th>${
      TblEightRows[1].children[1].children[0].options[
        TblEightRows[1].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    `;
    tblNine += `
     <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Other Benefits</th></tr> 
      <tr><th>${TblNineRows[0].children[0].textContent}</th><th>${TblNineRows[0].children[1].children[0].value}</th></tr>     
      <tr><th>${TblNineRows[1].children[0].textContent}</th><th>${TblNineRows[1].children[1].children[0].value}</th></tr>     
      <tr><th>${TblNineRows[2].children[0].textContent}</th><th>${TblNineRows[2].children[1].children[0].value}</th></tr>     
      <tr><th>${TblNineRows[3].children[0].textContent}</th><th>${TblNineRows[3].children[1].children[0].value}</th></tr>     
    `;
    tblTen += `
     <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Waiting Period</th></tr> 
    <tr><th>${TblTenRows[0].children[0].textContent}</th><th>${
      TblTenRows[0].children[1].children[0].options[
        TblTenRows[0].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblTenRows[1].children[0].textContent}</th><th>${
      TblTenRows[1].children[1].children[0].options[
        TblTenRows[1].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblTenRows[2].children[0].textContent}</th><th>${
      TblTenRows[2].children[1].children[0].options[
        TblTenRows[2].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    `;
    tblEleven += `
     <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Age Limit</th></tr> 
    <tr><th>${TblElevenRows[0].children[0].textContent}</th><th>${
      TblElevenRows[0].children[1].children[0].options[
        TblElevenRows[0].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblElevenRows[1].children[0].textContent}</th><th>${
      TblElevenRows[1].children[1].children[0].options[
        TblElevenRows[1].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblElevenRows[2].children[0].textContent}</th><th>${
      TblElevenRows[2].children[1].children[0].options[
        TblElevenRows[2].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    <tr><th>${TblElevenRows[3].children[0].textContent}</th><th>${
      TblElevenRows[3].children[1].children[0].options[
        TblElevenRows[3].children[1].children[0].selectedIndex
      ].text
    }</th></tr>  
    `;
    tblTwelve += `
      <tr><th colspan="2" style="color:white;background-color:red;text-align:center;font-size:20px;">Enrollment Notes</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[0].children[0].textContent}</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[1].children[0].textContent}</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[2].children[0].textContent}</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[3].children[0].textContent}</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[4].children[0].textContent}</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[5].children[0].textContent}</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[6].children[0].textContent}</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[7].children[0].textContent}</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[8].children[0].textContent}</th></tr>     
      <tr><th colspan="2">${TblTwelveRows[9].children[0].textContent}</th></tr>     
    `;

    let table = `
   <div style="text-align:right;">${address}</div>
    <br><br>
     <p style="text-align:center;font-size:20px;font-weight:bold;">Policy Document</p>
    <br>
    <table><tbody>${
      tblOne +
      tblTwo +
      tblThree +
      tblFour +
      tblFive +
      tblSix +
      tblSeven +
      tblEight +
      tblNine +
      tblTen +
      tblEleven +
      tblTwelve
    } </tbody></table>
    `;
    // console.log(table);
    var val = htmlToPdfmake(table);
    var dd = { pageOrientation: "landscape", content: val };
    pdfMake.createPdf(dd).download();
  };

  return (
    <div>
      <div className="policyDocument">
        <div className="container">
          <p className="text-info h2">POLICY DOCUMENT RETAIL</p>
          <hr />
          <form id="frmPolicyDocument" onSubmit={fetchPolicyData}>
            <div className="row">
              <div className="col-md-3">
                <select
                  className="form-control"
                  defaultValue="0"
                  name="options"
                  id="options"
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option disabled value="0">
                    Select Option
                  </option>
                  <option value="1">Create</option>
                  <option value="2">Query</option>
                </select>
              </div>

              <div className="col-md-3" hidden={hidden.retail}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="retail"
                  id="retail"
                  onChange={(e) => setSelectedRetail(e.target.value)}
                >
                  <option disabled value="0">
                    Select Retail
                  </option>
                  {retail.map((dt) => {
                    return (
                      <option value={dt.member_no}>
                        {dt.principal_names + " - " + dt.member_no}
                      </option>
                    );
                  })}
                </select>
              </div>
              {/* <div className="col-md-3" hidden={hidden.sme}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="sme"
                  id="sme"
                  onChange={(e) => setSelectedSme(e.target.value)}
                >
                  <option disabled value="0">
                    Select SME
                  </option>
                  {smes.map((dt) => {
                    return <option value={dt.CORP_ID}>{dt.CORPORATE}</option>;
                  })}
                </select>
              </div> */}

              <div className="col-md-3" hidden={hidden.anniv}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="annivs"
                  id="annivs"
                  onChange={(e) => setSelectedAnniv(e.target.value)}
                >
                  <option disabled value="0">
                    Select Anniv
                  </option>
                  {annivs.map((dt) => {
                    return <option value={dt.anniv}>{dt.anniv}</option>;
                  })}
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.category}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="category"
                  id="category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option disabled value="0">
                    Select Health Plan
                  </option>
                  {categories.map((dt) => {
                    return (
                      <option value={dt.health_plan}>{dt.health_plan}</option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.product_name}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="product_name"
                  id="product_name"
                >
                  <option disabled value="0">
                    Select Product Name
                  </option>
                  {productNames.map((dt) => {
                    return <option value={dt.code}>{dt.product_name}</option>;
                  })}
                </select>
              </div>
              <div className="col-md-3" hidden={hidden.policy_docs}>
                <select
                  className="form-control"
                  defaultValue="0"
                  name="policy_docs"
                  id="policy_docs"
                  onChange={(e) => setSelectedPolicy(e.target.value)}
                >
                  <option disabled value="0">
                    Select Policy No
                  </option>
                  {policyDocs.map((dt) => {
                    return <option value={dt.policy_no}>{dt.policy_no}</option>;
                  })}
                </select>
              </div>

              <div className="col-md-2" hidden={hidden.search}>
                <button type="submit" className="btn btn-info form-control">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/*********************************** start of table one ****************************************/}
      <form id="frmPolicyDocumentSave" onSubmit={savePolicyDocument}>
        <div className="card cardPolicy" id="policy_document">
          <p className="alert  text-center">Client</p>
          <table className="table-bordered policyDoc" id="tableOne">
            <tbody>
              <tr>
                <th>Client Name</th>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    value={
                      selectedOption === "1"
                        ? policyData.client_name
                        : clientName
                    }
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <th>Policy Schedule No</th>
                <td>
                  <input
                    className="form-control"
                    name="policy_no"
                    type="text"
                    value={policyData.policy_no}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <th>Product Option</th>
                <td>
                  <input
                    className="form-control"
                    name="health_plan"
                    type="text"
                    defaultValue={policyData.health_plan}
                    readOnly
                    required={true}
                  />
                </td>
              </tr>
              <tr>
                <th>Geographical Zone</th>
                <td>
                  <select
                    name="zone"
                    id="1"
                    type="text"
                    value={policyData.zone}
                    className="form-control"
                    required="true"
                  >
                    <option disabled value="0">
                      Select Geographical Zone
                    </option>
                    <option value="1">World Wide Cover</option>
                    <option value="2">East Africa</option>
                    <option value="3">Uganda</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Over all Annual Limit</th>
                <td>
                  <input
                    readOnly
                    name="overall_annual_limit"
                    className="form-control"
                    type="text"
                    value={
                      policyData.overall_annual_limit
                        ? parseFloat(
                            policyData.overall_annual_limit
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>No of Lives</th>
                <td>
                  <input
                    className="form-control"
                    name="lives"
                    type="text"
                    value={policyData.lives}
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <th>Premium Per Life</th>
                <td>
                  <input
                    className="form-control"
                    name="client_premium"
                    type="text"
                    defaultValue={policyData.client_premium}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {/*********************************** start of table two ****************************************/}
          <p className="alert  text-center">Value Added Services</p>
          <p>
            Cash Back Scheme: Award to our clients for being in control of their
            health (Zero claim on outpatient) ten percent of premiums. (For
            corporates with 65% or less of entire scheme Utilisation)
          </p>
          <table className="table-bordered policyDoc" id="tableTwo">
            <tbody>
              <tr>
                <th>Health Promotions (Upon Request from the Client)</th>
                <td>
                  <select
                    name="promotions"
                    id="2"
                    type="text"
                    value={policyData.promotions}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">One Health Talk per year</option>
                    <option value="2">Two Health Talks per year</option>
                    <option value="3">Three Health Talks per year</option>
                    <option value="4">Four Health Talks per year</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          {/*********************************** start of table three ****************************************/}
          <p className="alert  text-center">
            Inpatient Benefits (Pre-authorization will be required for inpatient
            cover)
          </p>
          <table className="table-bordered policyDoc" id="tableThree">
            <tbody>
              <tr>
                <th>Accident hospitalization limit</th>
                <td>
                  <input
                    readOnly
                    name="accident_hosp"
                    className="form-control"
                    type="text"
                    value={
                      policyData.accident_hosp
                        ? parseFloat(policyData.accident_hosp).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Illness hospitalization limit</th>
                <td>
                  <input
                    readOnly
                    name="illness_hosp"
                    className="form-control"
                    type="text"
                    value={
                      policyData.illness_hosp
                        ? parseFloat(policyData.illness_hosp).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Admissions to Intensive Care and high care units for non
                  chronic illness/accident (covered within illness/accident
                  limit)
                </th>
                <td>
                  <input
                    readOnly
                    name="admissions_icu"
                    className="form-control"
                    type="text"
                    value={
                      policyData.admissions_icu
                        ? parseFloat(policyData.admissions_icu).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Admissions to Intensive Care and high care units for chronic
                  (subject to a waiting period)
                </th>
                <td>
                  <input
                    readOnly
                    name="admissions_icu_chronic"
                    className="form-control"
                    type="text"
                    value={
                      policyData.admissions_icu_chronic
                        ? parseFloat(
                            policyData.admissions_icu_chronic
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Admissions to intensive care and high care units for accident
                </th>
                <td>
                  <input
                    readOnly
                    name="admissions_icu_accident"
                    className="form-control"
                    type="text"
                    value={
                      policyData.admissions_icu_accident
                        ? parseFloat(
                            policyData.admissions_icu_accident
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Hospital room limit per night paid within hospitalisation
                  limit
                </th>
                <td>
                  <input
                    readOnly
                    name="room_limit"
                    className="form-control"
                    type="text"
                    value={
                      policyData.room_limit
                        ? parseFloat(policyData.room_limit).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Preexisting/ Chronic conditions</th>
                <td>
                  <select
                    name="preexisting_cond"
                    id="3"
                    type="text"
                    value={
                      policyData.preexisting_cond
                        ? parseFloat(
                            policyData.preexisting_cond
                          ).toLocaleString()
                        : 0
                    }
                    className="form-control"
                  >
                    <option value="0">Not Covered</option>
                    <option value="1">Covered</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  Chronic conditions developed on cover (CDL) (Subject to a
                  waiting period)
                </th>
                <td>
                  <input
                    readOnly
                    name="preexisting_cond"
                    className="form-control"
                    type="text"
                    value={
                      policyData.ip_chronic_conditions
                        ? parseFloat(
                            policyData.ip_chronic_conditions
                          ).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Oncology tests, drugs, and consultation for chemotherapy and
                  radiotherapy
                </th>
                <td>
                  <select
                    name="oncology_tests"
                    id="4"
                    type="text"
                    value={policyData.oncology_tests}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">Covered Upto CDL Limit</option>
                    <option value="2">Not Covered</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  Treatment and admissions to ICU and HCU for Covid-19 and
                  related co-morbidities
                </th>
                <td>
                  <input
                    readOnly
                    name="covid19_ip"
                    className="form-control"
                    type="text"
                    value={
                      policyData.covid19_ip
                        ? parseFloat(policyData.covid19_ip).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Nursing fees, medical expenses and ancillary charges </th>
                <td>
                  <select
                    name="nursing_fees"
                    id="5"
                    type="text"
                    value={policyData.nursing_fees}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Accident or illnes hospitalisation
                      limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  General surgery, surgeons', consultants', anaesthetists',
                  medical practitioners' fees
                </th>
                <td>
                  <select
                    name="general_surgery"
                    id="6"
                    type="text"
                    value={policyData.general_surgery}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Accident or illnes hospitalisation
                      limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Reconstructive surgery for illness </th>
                <td>
                  <input
                    readOnly
                    name="reconstructive_surgery"
                    className="form-control"
                    type="text"
                    value={
                      policyData.reconstructive_surgery
                        ? parseFloat(
                            policyData.reconstructive_surgery
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Reconstructive surgery for accident </th>
                <td>
                  <input
                    readOnly
                    name="reconstructive_surgery_acc"
                    className="form-control"
                    type="text"
                    value={
                      policyData.reconstructive_surgery_acc
                        ? parseFloat(
                            policyData.reconstructive_surgery_acc
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Prescribed medicines and drugs </th>
                <td>
                  <select
                    name="prescribed_drugs"
                    id="7"
                    type="text"
                    value={policyData.prescribed_drugs}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Accident or illnes hospitalisation
                      limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Internal Prostheses </th>
                <td>
                  <select
                    name="internal_prostheses"
                    id="8"
                    type="text"
                    value={policyData.internal_prostheses}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Accident or illnes hospitalisation
                      limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  X-rays, MRI, PET Scans, CT scans, and imaging tests including
                  angiography (covered upon doctor's recommendation){" "}
                </th>
                <td>
                  <select
                    name="xrays"
                    id="9"
                    type="text"
                    value={policyData.xrays}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Accident or illnes hospitalisation
                      limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Pathology, diagnostic tests, and procedures </th>
                <td>
                  <select
                    name="pathology"
                    id="10"
                    type="text"
                    value={policyData.pathology}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Accident or illnes hospitalisation
                      limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  Accidental damage to natural eyes covered within accident
                  hospitalisation limit
                </th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="acc_damage_natural_eyes"
                    className="form-control"
                    type="text"
                    value={
                      policyData.acc_damage_natural_eyes
                        ? parseFloat(
                            policyData.acc_damage_natural_eyes
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Accidental damage to natural teeth covered within accident
                  hospitalisation limit{" "}
                </th>
                <td>
                  <input
                    readOnly
                    name="acc_damage_natural_teeth"
                    className="form-control"
                    type="text"
                    value={
                      policyData.acc_damage_natural_teeth
                        ? parseFloat(
                            policyData.acc_damage_natural_teeth
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Psychiatric treatment (IP) covered within illness
                  hospitalisation limit{" "}
                </th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="psychiatric_treatment"
                    className="form-control"
                    type="text"
                    value={
                      typeof policyData.psychiatric_treatment !== "undefined"
                        ? parseFloat(
                            policyData.psychiatric_treatment
                          ).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Physiotherapy </th>
                <td>
                  <select
                    name="physiotherapy"
                    id="11"
                    type="text"
                    value={policyData.physiotherapy}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Accident or illnes hospitalisation
                      limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  Parent accommodation, member parent within a member child
                  under 8 years of age in hospital{" "}
                </th>
                <td>
                  <select
                    name="parent_accommodation"
                    id="12"
                    type="text"
                    value={policyData.parent_accommodation}
                    className="form-control"
                  >
                    <option value="0">Not Covered</option>
                    <option value="1">Covered Upto Room Limit</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  Congenital and genetic conditions defects covered within
                  illness hospitalisation limit{" "}
                </th>
                <td>
                  <input
                    readOnly
                    name="congenital_conditions"
                    className="form-control"
                    type="text"
                    value={
                      typeof policyData.congenital_conditions !== "undefined"
                        ? parseFloat(
                            policyData.congenital_conditions
                          ).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Inpatient treatment of HIV/AIDS and all opportunistic
                  infections covered within chronic illness hospitalisation{" "}
                </th>
                <td>
                  <input
                    readOnly
                    name="inpatient_treatment_hiv"
                    className="form-control"
                    type="text"
                    value={
                      policyData.inpatient_treatment_hiv
                        ? parseFloat(
                            policyData.inpatient_treatment_hiv
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {/*********************************** start of table four ****************************************/}
          <p className="alert  text-center">Rescue and Evacuation</p>
          <table className="table-bordered policyDoc" id="tableFour">
            <tbody>
              <tr>
                <th>Emergency road ambulance and evacuation </th>
                <td>
                  <select
                    name="evacuation"
                    id="13"
                    type="text"
                    value={policyData.evacuation}
                    className="form-control"
                  >
                    <option value="0">Paid in full within East Africa</option>
                    <option value="1">Paid in full within Uganda</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  International emergency medical cover area-up to the first 30
                  days of absence from the territory in any membership year.
                  This is only for hospitalisation (Pre-authorisation required){" "}
                </th>
                <td>
                  <select
                    name="international_emergency_medical"
                    id="14"
                    type="text"
                    value={policyData.international_emergency_medical}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered (North America covered upto 50% of each benefit)
                    </option>
                    <option value="2">Paid in full within East Africa</option>
                    <option value="3">Not Covered</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  International emergency rescue and evacuation
                  (Pre-authorization required){" "}
                </th>
                <td>
                  <select
                    name="international_emergency_rescue"
                    id="15"
                    type="text"
                    value={policyData.international_emergency_rescue}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered (North America covered upto 50% of each benefit)
                    </option>
                    <option value="2">Paid in full within East Africa</option>
                    <option value="3">Not Covered</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          {/*********************************** start of table five ****************************************/}
          <p className="alert  text-center">
            Maternity Cover (For Principal and Spouse only in Uganda) :
            Pre-authorization will be required for cover
          </p>
          <table className="table-bordered policyDoc" id="tableFive">
            <tbody>
              <tr>
                <th>Normal Delivery</th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="normal_delivery"
                    id="16"
                    className="form-control"
                    type="text"
                    value={
                      policyData.normal_delivery
                        ? parseFloat(
                            policyData.normal_delivery
                          ).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Caesarian Section</th>
                <td>
                  <input
                    readOnly
                    name="caesarian_section"
                    className="form-control"
                    type="text"
                    value={
                      policyData.caesarian_section
                        ? parseFloat(
                            policyData.caesarian_section
                          ).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Premature Cover</th>
                <td>
                  <input
                    readOnly
                    name="premature_cover"
                    className="form-control"
                    type="text"
                    value={
                      policyData.premature_cover
                        ? parseFloat(
                            policyData.premature_cover
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Complications of Pregnancy</th>
                <td>
                  <select
                    name="complications_pregnancy"
                    id="17"
                    type="text"
                    value={policyData.complications_pregnancy}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">Covered within delivery limit</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="alert  text-center">
            Outpatient Benefits (East Africa Only)
          </p>
          <table className="table-bordered policyDoc" id="tableSix">
            <tbody>
              <tr>
                <th>Overall annual Limit</th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="op_annual_limit"
                    className="form-control"
                    type="text"
                    value={
                      policyData.op_annual_limit
                        ? parseFloat(
                            policyData.op_annual_limit
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Preexisting/Chronic conditions</th>
                <td>
                  <select
                    name="preexisting_conditions"
                    id="18"
                    type="text"
                    value={
                      policyData.preexisting_conditions
                        ? parseFloat(
                            policyData.preexisting_conditions
                          ).toLocaleString()
                        : 0
                    }
                    className="form-control"
                  >
                    <option value="0">Not Covered</option>
                    <option value="1">Covered</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  Treatment and testing of Covid-19 and related co-morbidities
                </th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="covid19_op"
                    className="form-control"
                    type="text"
                    value={
                      typeof policyData.covid19_op !== "undefined"
                        ? parseFloat(policyData.covid19_op).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Chronic conditions developed on cover (CDL) (Subject to a
                  waiting period)
                </th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="covid19_op"
                    className="form-control"
                    type="text"
                    value={
                      typeof policyData.op_chronic_conditions !== "undefined" && policyData.op_chronic_conditions != null
                        ? parseFloat(
                            policyData.op_chronic_conditions
                          ).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Oncology tests, drugs, and consultation for chemotherapy and
                  radiotherapy
                </th>
                <td>
                  <select
                    name="op_oncology_tests"
                    id="19"
                    type="text"
                    value={policyData.op_oncology_tests}
                    className="form-control"
                  >
                    <option value="0">Not Covered</option>
                    <option value="1">Covered Upto CDL Limit</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  General practitioners and specialists' consultation fees
                </th>
                <td>
                  <select
                    name="general_practitioners"
                    id="20"
                    type="text"
                    value={policyData.general_practitioners}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Outpatient limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Prescribed medicines, drugs, and dressings</th>
                <td>
                  <select
                    name="prescribed_medicines"
                    id="21"
                    type="text"
                    value={policyData.prescribed_medicines}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Outpatient limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Physiotherapy (post trauma, pre-authorization required)</th>
                <td>
                  <select
                    name="op_physiotherapy"
                    id="22"
                    type="text"
                    value={policyData.op_physiotherapy}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Outpatient limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Psychiatric treatment (OP)</th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="op_psychiatric_treatment"
                    className="form-control"
                    type="text"
                    value={
                      policyData.op_psychiatric_treatment
                        ? parseFloat(
                            policyData.op_psychiatric_treatment
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Congenital conditions covered within outpatient limit</th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="op_congenital_conditions"
                    className="form-control"
                    type="text"
                    value={
                      policyData.op_congenital_conditions
                        ? parseFloat(
                            policyData.op_congenital_conditions
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Post hospitalisation treatment</th>
                <td>
                  <select
                    name="post_hospitalisation_treatment"
                    id="23"
                    type="text"
                    value={policyData.post_hospitalisation_treatment}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Outapatient limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  Out-patient surgical operations (pre-authorization required)
                </th>
                <td>
                  <select
                    name="outpatient_surgical_operations"
                    id="24"
                    type="text"
                    value={policyData.outpatient_surgical_operations}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Outpatient limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  Out-patient treatment of HIV/AIDS and all opportunistic
                  infections covered within outpatient limit
                </th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="outpatient_treatment_of_hiv"
                    className="form-control"
                    type="text"
                    value={
                      policyData.outpatient_treatment_of_hiv
                        ? parseFloat(
                            policyData.outpatient_treatment_of_hiv
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <p className="alert text-center">Optometry</p>
          <table className="table-bordered policyDoc" id="tableSeven">
            <tbody>
              <tr>
                <th>Optometry Outpatient Benefit Limit</th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="optometry_limit"
                    className="form-control"
                    type="text"
                    value={
                      policyData.optometry_limit
                        ? parseFloat(
                            policyData.optometry_limit
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Consultation and general eye examinations, eye treatment, and
                  simple outer surgeries
                </th>
                <td>
                  <select
                    name="general_eye_examinations"
                    id="25"
                    type="text"
                    value={policyData.general_eye_examinations}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within optometry limit
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>
                  Frames and lenses (replaced once every year), visual acuity
                  tests
                </th>
                <td>
                  <select
                    name="frames_lenses"
                    id="26"
                    type="text"
                    value={policyData.frames_lenses}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within Optometry limit
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="alert  text-center">Dental</p>
          <table className="table-bordered policyDoc" id="tableEight">
            <tbody>
              <tr>
                <th>Dental Outpatient Benefit Limit</th>
                <td>
                  <input
                    readOnly
                    name="dental_limit"
                    className="form-control"
                    type="text"
                    value={
                      policyData.dental_limit
                        ? parseFloat(policyData.dental_limit).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Consultations and treatment, extractions, infections,
                  fillings, and minor surgeries, root canal, xrays, non-surgical
                  extractions, scaling, and polishing
                </th>
                <td>
                  <select
                    name="dental_consultation_treatment"
                    id="27"
                    type="text"
                    value={policyData.dental_consultation_treatment}
                    className="form-control"
                  >
                    <option value="0">Select Option</option>
                    <option value="1">
                      Covered in full within dental limit
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="alert  text-center">Other Benefits</p>
          <table className="table-bordered policyDoc" id="tableNine">
            <tbody>
              <tr>
                <th>
                  Annual Health Checks (Basic Medex): Complete blood count test,
                  Random blood sugar test, Breast exam, and VIA for Females
                  above 30 years, PSA for males above 45 years.
                </th>
                <td>
                  <input
                    readOnly
                    name="annual_health_checks"
                    className="form-control"
                    type="text"
                    value={
                      policyData.annual_health_checks
                        ? parseFloat(
                            policyData.annual_health_checks
                          ).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Personal Accident with Permanent Total Disability Cover -
                  Adult
                </th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="personal_accident"
                    className="form-control"
                    type="text"
                    value={
                      typeof policyData.personal_accident !== "undefined"
                        ? parseFloat(
                            policyData.personal_accident
                          ).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>
                  Personal Accident with Permanent Total Disability Cover -
                  Child
                </th>
                <td>
                  <input
                    readOnly
                    name="personal_accident_child"
                    className="form-control"
                    type="text"
                    value={
                      typeof policyData.personal_accident_child !== "undefined"
                        ? parseFloat(
                            policyData.personal_accident_child
                          ).toLocaleString()
                        : 0
                    }
                  />
                </td>
              </tr>
              <tr>
                <th>Last Expenses</th>
                <td>
                  {" "}
                  <input
                    readOnly
                    name="last_expenses"
                    className="form-control"
                    type="text"
                    value={
                      policyData.last_expenses
                        ? parseFloat(policyData.last_expenses).toLocaleString()
                        : ""
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <p className="alert  text-center">Waiting Period</p>
          <table className="table-bordered policyDoc" id="tableTen">
            <tbody>
              <tr>
                <th>Chronic conditions developed on cover</th>
                <td>
                  <select
                    name="chronic_wp"
                    id="28"
                    type="text"
                    value={policyData.chronic_wp}
                    className="form-control"
                  >
                    <option value="0">No Waiting Period</option>
                    <option value="1">12 Months</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Illness Hospitalization</th>
                <td>
                  <select
                    name="illness_hospitalization"
                    id="29"
                    type="text"
                    value={policyData.illness_hospitalization}
                    className="form-control"
                  >
                    <option value="0">90 days</option>
                    <option value="1">No Waiting Period</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Maternity</th>
                <td>
                  <select
                    name="maternity_wp"
                    id="30"
                    type="text"
                    value={policyData.maternity_wp}
                    className="form-control"
                  >
                    <option value="0">12 Months</option>
                    <option value="1">No Waiting Period</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="alert  text-center">Age Limits</p>
          <table className="table-bordered policyDoc" id="tableEleven">
            <tbody>
              <tr>
                <th>Minimum age when joining</th>
                <td>
                  <select
                    name="minimum_age"
                    id="31"
                    type="text"
                    value={policyData.minimum_age}
                    className="form-control"
                  >
                    <option value="0">No Age Limit</option>
                    <option value="1">1 Month</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Medical Examination for joining (basic medex)</th>
                <td>
                  <select
                    name="medex"
                    id="32"
                    type="text"
                    value={policyData.medex}
                    className="form-control"
                  >
                    <option value="0">No Limit</option>
                    <option value="1">45 Years</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Maximum age when joining</th>
                <td>
                  <select
                    name="maximum_age"
                    id="33"
                    type="text"
                    value={policyData.maximum_age}
                    className="form-control"
                  >
                    <option value="0">60 Years</option>
                    <option value="1">55 Years</option>
                    <option value="2">50 Years</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Provider Network</th>
                <td>
                  <select
                    name="provider_network"
                    id="34"
                    type="text"
                    value={policyData.provider_network}
                    className="form-control"
                  >
                    <option value="0">Closed</option>
                    <option value="1">Open</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="alert  text-center">Enrollment Notes</p>
          <table className="table-bordered policyDoc" id="tableTwelve">
            <tbody>
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_one"
                    type="text"
                    value={policyData.enroll_one}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_two"
                    type="text"
                    value={policyData.enroll_two}
                  />
                </th>
              </tr>{" "}
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_three"
                    type="text"
                    value={policyData.enroll_three}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_four"
                    type="text"
                    value={policyData.enroll_four}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_five"
                    type="text"
                    value={policyData.enroll_five}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_six"
                    type="text"
                    value={policyData.enroll_six}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_seven"
                    type="text"
                    value={policyData.enroll_seven}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_eight"
                    type="text"
                    value={policyData.enroll_eight}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_nine"
                    type="text"
                    value={policyData.enroll_nine}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <textarea
                    className="form-control"
                    name="enroll_ten"
                    type="text"
                    value={policyData.enroll_ten}
                  />
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <button
            type="submit"
            className="btn btn-success save"
            hidden={hidden.save}
          >
            Save
          </button>
          <button
            className="btn btn-secondary col-1 update"
            hidden={hidden.update}
          >
            Update
          </button>
          <button
            className="btn btn-primary print"
            onClick={printPdf}
            hidden={hidden.print}
          >
            Print
          </button>
        </p>
      </form>
      <Modal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        body={
          <p className="text-white font-weight-bold text-center">{feedback}</p>
        }
        background={
          feedback
            ? feedback.length > 0
              ? feedback[0].includes("Error")
                ? "#d9534f"
                : "#105878"
              : ""
            : ""
        }
      />
    </div>
  );
};

export default PolicyDocumentRetail;
