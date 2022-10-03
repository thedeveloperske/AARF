import { userGroups } from "../helpers/UserGroups";

import { Route, Switch } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import AddCorporate from "../../pages/corporate/AddCorporate";
import QueryCorporate from "../../pages/corporate/QueryCorporate";
import ChangeCorporateAgent from "../../pages/corporate/ChangeCorporateAgent";
import RenewCorporate from "../../pages/corporate/RenewCorporate";
import ProrateCorporateBenefits from "../../pages/corporate/ProrateCorporateBenefits";
import PolicyDocumentCorporate from "../../pages/corporate/policyDocument/PolicyDocumentCorporate";
import PolicyDocumentSme from "../../pages/corporate/policyDocument/PolicyDocumentSme";
import PolicyDocumentRetail from "../../pages/corporate/policyDocument/PolicyDocumentRetail";
import AddPrincipal from "../../pages/registration/member-management/underwrite-member/AddPrincipal";
import AddDependant from "../../pages/registration/member-management/underwrite-member/AddDependant";
import CancelMember from "../../pages/registration/member-management/CancelMember";
import ReinstateMember from "../../pages/registration/member-management/ReinstateMember";
import CorporateAgents from "../../pages/corporate/CorporateAgents";
import RetailAgents from "../../pages/corporate/RetailAgents";
import ProductChange from "../../pages/registration/member-management/ProductChange";
import ChangeFamilyAgent from "../../pages/corporate/ChangeFamilyAgent";
import ProviderList from "../../pages/registration/reports/ProviderList";
import CorporatePopulation from "../../pages/registration/reports/CorporatePopulation";
import ImportMemberInformation from "../../pages/registration/ImportMemberInformation";
import ImportPreloadedMembers from "../../pages/registration/ImportPreloadedMembers";
import ImportContactDetails from "../../pages/registration/ImportContactDetails";
import AddPrincipalPortal from "../../pages/registration/member-management/underwrite-member/AddPrincipalPortal";
import QueryByMemberName from "../../pages/registration/member-management/underwrite-member/QueryByMemberName";
import QueryByMemberNumber from "../../pages/registration/member-management/underwrite-member/QueryByMemberNumber";
import QueryByPrincipalName from "../../pages/registration/member-management/underwrite-member/QueryByPrincipalName";
import ReorderSmartCard from "../../pages/registration/member-management/underwrite-member/ReorderSmartCard";
import EnquiryPages from "../../pages/registration/EnquiryPages";
import MembershipRenewal from "../../pages/registration/MembershipRenewal";
import PremiumDebiting from "../../pages/finance/PremiumDebiting";
import PremiumReceipt from "../../pages/finance/PremiumReceipt";
import PrintReceipts from "../../pages/finance/PrintReceipts";
import DebitReversal from "../../pages/finance/DebitReversal";
import AllocateReceipts from "../../pages/finance/AllocateReceipts";
import ReceiptReversal from "../../pages/finance/ReceiptReversal";
import Quotation from "../../pages/finance/Quotation";
import SmartRequest from "../../pages/registration/member-management/SmartRequest";
import Cards from "../../pages/registration/member-management/Cards";
import EnterBillByLineItems from "../../pages/bills/bills-management/bill-process/EnterBillByLineItems";
import AddAnInvoice from "../../pages/bills/bills-management/bill-process/AddAnInvoice";
import QueryBatch from "../../pages/bills/bills-management/bill-process/QueryBatch";
import QueryClaim from "../../pages/bills/bills-management/bill-process/QueryClaim";
import VetBill from "../../pages/bills/bills-management/bill-process/VetBill";
import EnterBill from "../../pages/bills/bills-management/bill-process/EnterBill";
import BatchClaims from "../../pages/bills/bills-management/BatchClaims";

import PayBatch from "../../pages/bills/bills-management/bills-payment/PayBatch";
import PayProvider from "../../pages/bills/bills-management/bills-payment/PayProvider";
import PayProviderFund from "../../pages/bills/bills-management/bills-payment/PayProviderFund";
import QueryBatchPayment from "../../pages/bills/bills-management/bills-payment/QueryBatch";
import QueryCheque from "../../pages/bills/bills-management/bills-payment/QueryCheque";
import QueryPaidVoucher from "../../pages/bills/bills-management/bills-payment/QueryPaidVoucher";
import QueryVoucher from "../../pages/bills/bills-management/bills-payment/QueryVoucher";
import ReimburseCorporate from "../../pages/bills/bills-management/bills-payment/ReimburseCorporate";
import ReimburseMember from "../../pages/bills/bills-management/bills-payment/ReimburseMember";
import UnvoucherClaims from "../../pages/bills/bills-management/bills-payment/UnvoucherClaims";
import VoucherSummaryPerCorporate from "../../pages/bills/bills-management/bills-payment/VoucherSummaryPerCorporate";

import Extension from "../../pages/care/preauthorization/Extension";
import New from "../../pages/care/preauthorization/New";
import AdmissionVisit from "../../pages/care/AdmissionVisit";
import CareAdmission from "../../pages/care/CareAdmission";
import CorporateVisit from "../../pages/care/CorporateVisit";
import Decline from "../../pages/care/Decline";
import CaseManagement from "../../pages/care/reports/CaseManagement";
import EditPreAuthorisation from "../../pages/care/reports/EditPreAuthorisation";

import EnterDeductions from "../../pages/Commission/intermediary/EnterDeductions";
import PayCommission from "../../pages/Commission/intermediary/PayCommission";
import PayAssistantHos from "../../pages/Commission/overide/PayAssistantHos";
import PayOverideBdm from "../../pages/Commission/overide/PayOverideBdm";
import PayHos from "../../pages/Commission/overide/PayHos";
import CommissionStatement from "../../pages/Commission/reports/CommissionStatement";
import OverrideStatement from "../../pages/Commission/reports/OverrideStatement";
import ImportHospitalBills from "../../pages/bills/bills-management/bill-process/ImportHospitalBills";

// reports
import MemberShipList from "../../pages/registration/reports/MemberShipList";
import ValidList from "../../pages/registration/reports/ValidList";
import DebitedMembers from "../../pages/registration/reports/DebitedMembers";

//Finance Reports
import FundStatement from "../../pages/finance/reports/FundStatement";
import PremiumStatement from "../../pages/finance/reports/PremiumStatement";
import PremiumRegister from "../../pages/finance/reports/PremiumRegister";
import ClaimsReserve from "../../pages/finance/reports/ClaimsReserve";

//Bills Reports
import ClaimsExperience from "../../pages/bills/reports/ClaimsExperience";
import ClaimsRegister from "../../pages/bills/reports/ClaimsRegister";
import RejectedBills from "../../pages/bills/reports/RejectedBills";
import SuspendedClaims from "../../pages/bills/reports/SuspendedClaims";
import RejectionRate from "../../pages/bills/reports/RejectionRate";
import OutstandingBills from "../../pages/bills/reports/OutstandingBills";
import Utilization from "../../pages/bills/reports/Utilization";
import ClaimsExperienceExtract from "../../pages/bills/reports/ClaimsExperienceExtract";
import BatchProcess from "../../pages/bills/reports/BatchProcess";
import BatchReport from "../../pages/bills/reports/BatchReport";
import ClaimsStatusSummary from "../../pages/bills/reports/ClaimsStatusSummary";
import VettedBills from "../../pages/bills/reports/VettedBills";
import Product from "../../pages/admin/AddSelectionItems/Product";
import RateSheet from "../../pages/admin/AddSelectionItems/RateSheet";
import NotAuthorized from "./NotAuthorized";
import AgentManagement from "../../pages/admin/AgentManagement";
import ReinsurerQuotaShare from "../../pages/admin/AddSelectionItems/ReinsurerQuotaShare";
import ReinsurerExcessOfLoss from "../../pages/admin/AddSelectionItems/ReinsurerExcessOfLoss";
import ExcessOfLoss from "../../pages/ReInsurance/ExcessOfLoss/ExcessOfLoss";
import PremiumsQuotaShare from "../../pages/ReInsurance/QuotaShare/PremiumsQuotaShare";
import ClaimsPaymentsSchedule from "../../pages/ReInsurance/QuotaShare/ClaimsPaymentsSchedule";
import QueryDebit from "../../pages/finance/QueryDebit";
import AdmissionAuthorisations from "../../pages/care/reports/careMiscReports/AdmissionAuthorisations";
import CareVisits from "../../pages/care/reports/careMiscReports/CareVisits";
import PatientComments from "../../pages/care/reports/careMiscReports/PatientComments";
import CareAdmissions from "../../pages/care/reports/careMiscReports/CareAdmissions";
import CorporateNeeds from "../../pages/care/reports/careMiscReports/CorporateNeeds";
import PastAdmissions from "../../pages/care/reports/careMiscReports/PastAdmissions";
import TasksFollowUp from "../../pages/care/reports/careMiscReports/TasksFollowUp";
import Profile from "../../pages/settings/Profile";
import ChangePassword from "../../pages/admin/ChangePassword";
import Operations from "../../pages/management/reports/Operations";

//Admin Modules
import Illness from "../../pages/admin/AddSelectionItems/Illness";
import Exclusions from "../../pages/admin/AddSelectionItems/Exclusions";
import Allergies from "../../pages/admin/AddSelectionItems/Allergies";
import DeleteLogList from "../../pages/admin/user management/DeleteLogList";
import SuspendRejectReasons from "../../pages/admin/AddSelectionItems/SuspendRejectReasons";
import BankAccounts from "../../pages/admin/AddSelectionItems/BankAccounts";
import ExchangeRate from "../../pages/admin/AddSelectionItems/ExchangeRate";
import ReversalReasons from "../../pages/admin/AddSelectionItems/ReversalReasons";
import TransactionRate from "../../pages/admin/AddSelectionItems/TransactionRate";
import Bdm from "../../pages/admin/AddSelectionItems/Bdm";
import Bank from "../../pages/admin/AddSelectionItems/Bank";
import PriceList from "../../pages/admin/AddSelectionItems/PriceList";
import PriceListYear from "../../pages/admin/AddSelectionItems/PriceListYear";
import Benefit from "../../pages/admin/AddSelectionItems/Benefit";
import Levy from "../../pages/admin/AddSelectionItems/Levy";
import ProductName from "../../pages/admin/AddSelectionItems/ProductName";
import ResendReason from "../../pages/admin/AddSelectionItems/ResendReason";
import DeclineReason from "../../pages/admin/AddSelectionItems/DeclineReason";
import CorporateVisitIssue from "../../pages/admin/AddSelectionItems/CorporateVisitIssue";
import ConversionRates from "../../pages/admin/AddSelectionItems/ConversionRates";
import Units from "../../pages/admin/AddSelectionItems/Units";
import UnitManagers from "../../pages/admin/AddSelectionItems/UnitManagers";
import Agency from "../../pages/admin/AddSelectionItems/Agency";
import RejectionReason from "../../pages/admin/AddSelectionItems/RejectionReason";
import DiagnosisClass from "../../pages/admin/AddSelectionItems/DiagnosisClass";
import Diagnosis from "../../pages/admin/AddSelectionItems/Diagnosis";
import Service from "../../pages/admin/AddSelectionItems/Service";
import Doctors from "../../pages/admin/AddSelectionItems/Doctors";
import ManageUser from "../../pages/admin/user management/ManageUser";
import SchemeRules from "../../pages/admin/AddSelectionItems/SchemeRules";
import DeductionReasons from "../../pages/admin/AddSelectionItems/DeductionReasons";
import Plan from "../../pages/admin/AddSelectionItems/Plan";



const PageRoutes = () => {
  return (
    <div className="container-fluid" id="content">
      <Switch>
        {/* Dashboard */}
        <Route path="/" exact>
          <Dashboard />
        </Route>
        <Route path="/add-corporate">
          <AddCorporate />
          {/* {userGroups().includes("1") ||
          userGroups().includes("9") ||
          userGroups().includes("11") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* querycorporate route */}
        <Route path="/query-corporate">
          <QueryCorporate />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Change corporate Agents ---------------------------NO USER ACCESS LOG */}
        <Route path="/change-corporate-agent">
          <ChangeCorporateAgent />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* change retail agent  ---------------------------NO USER ACCESS LOG*/}
        <Route path="/change-retail-agent">
          <ChangeFamilyAgent />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Corporate Reports ---------------------------NO USER ACCESS LOG*/}
        <Route path="/corporate-agents">
          <CorporateAgents />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/retail-agents">
          <RetailAgents />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Renew Corporate */}
        <Route path="/renew-corporate">
          <RenewCorporate />
          {/* {userGroups().includes("11") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Prorate corporate benefits */}
        <Route path="/prorate-corporate-benefits">
          <ProrateCorporateBenefits />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Policy Dodument corporate*/}
        <Route path="/policy-document-corporate">
          <PolicyDocumentCorporate />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Policy Dodument sme*/}
        <Route path="/policy-document-sme">
          <PolicyDocumentSme />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Policy Dodument retail*/}
        <Route path="/policy-document-retail">
          <PolicyDocumentRetail />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Admin pages*/}
        <Route path="/product">
          <Product />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/rate-sheet">
          <RateSheet />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/illness">
          <Illness />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/exclusions">
          <Exclusions />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/allergies">
          <Allergies />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/suspend-reject-reasons">
          <SuspendRejectReasons />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/bank-accounts">
          <BankAccounts />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/exchange-rate">
          <ExchangeRate />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/reversal-reasons">
          <ReversalReasons />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/transaction-rate">
          <TransactionRate />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/bdm">
          <Bdm />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/price-list">
          <PriceList />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/price-list-year">
          <PriceListYear />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/diagnosis">
          <Diagnosis />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/service">
          <Service />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/doctors">
          <Doctors />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/diagnosis-class">
          <DiagnosisClass />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/scheme-rules">
          <SchemeRules />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/deduction-reasons">
          <DeductionReasons />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/agent-management">
          <AgentManagement />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/change-password">
          <ChangePassword />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/reinsurance-quota-share">
          <ReinsurerQuotaShare />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
              <NotAuthorized />
          )} */}
        </Route>
        <Route path="/reinsurance-excess-of-loss">
          <ReinsurerExcessOfLoss />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
              <NotAuthorized />
          )} */}
        </Route>
        {/* registration routes */}
        <Route path="/add-principal">
          <AddPrincipal />
          {/* {userGroups().includes("1") ||
          userGroups().includes("11") ||
          userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/add-dependant">
          <AddDependant />
          {/* {userGroups().includes("1") ||
          userGroups().includes("11") ||
          userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/add-principal-from-portal">
          <AddPrincipalPortal />
          {/* {userGroups().includes("1") ||
          userGroups().includes("11") ||
          userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/reorder-smart-card">
          <ReorderSmartCard />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/query-by-principal-name">
          <QueryByPrincipalName />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/query-by-member-number">
          <QueryByMemberNumber />
          {/* {userGroups().includes("1") ||
          userGroups().includes("11") ||
          userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path="/query-by-member-name">
          <QueryByMemberName />
          {/* {userGroups().includes("1") ||
          userGroups().includes("11") ||
          userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* enquiry pages */}
        <Route path="/enquiry-pages">
          <EnquiryPages />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Cancel Member */}
        <Route path="/cancel-member">
          <CancelMember />
          {/* {userGroups().includes("1") ||
          userGroups().includes("11") ||
          userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Reinstate Member */}
        <Route path="/reinstate-member">
          <ReinstateMember />
          {/* {userGroups().includes("1") ||
          userGroups().includes("11") ||
          userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Product Chnage */}
        <Route path="/product-change">
          <ProductChange />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Membership list */}
        <Route path="/provider-list">
          <ProviderList />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Corporate Population */}
        <Route path="/corporate-population">
          <CorporatePopulation />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Import Member Info */}
        <Route path="/import-member-info">
          <ImportMemberInformation />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Import Preloaded Members */}
        <Route path="/import-preloaded-members">
          <ImportPreloadedMembers />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Import Contact Details */}
        <Route path="/import-contact-details">
          <ImportContactDetails />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/*Membership Renewal*/}
        <Route path={"/membership-renewal"}>
          <MembershipRenewal />
          {/* {userGroups().includes("1") ||
          userGroups().includes("11") ||
          userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* smart request */}
        <Route path={"/smart-request"}>
          <SmartRequest />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* cards */}
        <Route path={"/cards"}>
          <Cards />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Finance routes */}
        <Route path={"/premium-debiting"}>
          <PremiumDebiting />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/query-debit"}>
          <QueryDebit />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/premium-receipt"}>
          <PremiumReceipt />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/print-receipts"}>
          <PrintReceipts />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/debit-reversal"}>
          <DebitReversal />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/receipt-reversal"}>
          <ReceiptReversal />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/allocate-receipts"}>
          <AllocateReceipts />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/quotation"}>
          <Quotation />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Finance Reports */}
        <Route path={"/fund-statement"}>
          <FundStatement />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/premium-statement"}>
          <PremiumStatement />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/premium-register"}>
          <PremiumRegister />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/claims-reserve"}>
          <ClaimsReserve />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Bills routes */}
        <Route path={"/enter-bill"}>
          <EnterBill />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/vet-bill"}>
          <VetBill />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/add-an-invoice"}>
          <AddAnInvoice />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/import-hospital-bills"}>
          <ImportHospitalBills />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/query-claim"}>
          <QueryClaim />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/query-batch"}>
          <QueryBatch />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/batch-claims"}>
          <BatchClaims />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/add-an-invoice"}>
          <AddAnInvoice />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/enter-bill-by-line-items"}>
          <EnterBillByLineItems />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* bills payment */}
        <Route path={"/pay-batch"}>
          <PayBatch />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/pay-provider"}>
          <PayProvider />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/pay-provider-fund"}>
          <PayProviderFund />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/query-batch-payment"}>
          <QueryBatchPayment />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/query-cheque"}>
          <QueryCheque />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/query-paid-voucher"}>
          <QueryPaidVoucher />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/query-voucher"}>
          <QueryVoucher />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/reimburse-corporate"}>
          <ReimburseCorporate />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/reimburse-member"}>
          <ReimburseMember />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/unvoucher-claims"}>
          <UnvoucherClaims />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/voucher-summary-per-corporate"}>
          <VoucherSummaryPerCorporate />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>

        {/* care routes */}
        <Route path={"/admission-visit"}>
          <AdmissionVisit />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/care-admission"}>
          <CareAdmission />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/corporate-visit"}>
          <CorporateVisit />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/decline"}>
          <Decline />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/new-preauth"}>
          <New />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/extension-preauth"}>
          <Extension />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/care-admissions"}>
          <CareAdmissions />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/care-visits"}>
          <CareVisits />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/patient-comments"}>
          <PatientComments />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/corporate-needs"}>
          <CorporateNeeds />
            {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>

        <Route path={"/tasks-followup"}>
          <TasksFollowUp />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/past-admissions"}>
          <PastAdmissions />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>

        <Route path={"/admission-authorisations"}>
          <AdmissionAuthorisations />

          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/edit-preauthorisation"}>
          <EditPreAuthorisation />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/case-management"}>
          <CaseManagement />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/enter-deductions"}>
          <EnterDeductions />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/pay-commission"}>
          <PayCommission />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/pay-assistant-hos"}>
          <PayAssistantHos />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/pay-hos"}>
          <PayHos />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/pay-overide-bdm"}>
          <PayOverideBdm />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/commission-statement"}>
          <CommissionStatement />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/override-statement"}>
          <OverrideStatement />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>

        {/* reports */}
        <Route path={"/membership-list"}>
          <MemberShipList />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/premium-register"}>
          <PremiumRegister />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/*Registration - Valid list */}
        <Route path={"/valid-list"}>
          <ValidList />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/debited-members"}>
          <DebitedMembers />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        {/* Bills Reports */}
        <Route path={"/claims-experience"}>
          <ClaimsExperience />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/claims-register"}>
          <ClaimsRegister />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/rejected-bills"}>
          <RejectedBills />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/suspended-claims"}>
          <SuspendedClaims />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/rejection-rate"}>
          <RejectionRate />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/outstanding-bills"}>
          <OutstandingBills />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/utilization"}>
          <Utilization />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/claims-experience-extract"}>
          <ClaimsExperienceExtract />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/batch-process"}>
          <BatchProcess />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/batch-report"}>
          <BatchReport />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/claims-status-summary"}>
          <ClaimsStatusSummary />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/vetted-bills"}>
          <VettedBills />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/not-authorized"}>
          <NotAuthorized />
        </Route>
        {/* reinsurance routes */}
        <Route path={"/premium-schedule"}>
          <PremiumsQuotaShare />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/claims-payments-schedule"}>
          <ClaimsPaymentsSchedule />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/excess-of-loss"}>
          <ExcessOfLoss />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/profile"}>
          <Profile />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/user-activity"}>
          <Operations />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/delete-user-log"}>
          <DeleteLogList />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/manage-user"}>
          <ManageUser />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/rejection-reason"}>
          <RejectionReason />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/bank"}>
          <Bank />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/benefit"}>
          <Benefit />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/levy"}>
          <Levy />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/product-name"}>
          <ProductName />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/resend-reason"}>
          <ResendReason />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/decline-reason"}>
          <DeclineReason />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/corporate-visit-issue"}>
          <CorporateVisitIssue />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/conversion-rates"}>
          <ConversionRates />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/units"}>
          <Units />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/unit-managers"}>
          <UnitManagers />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/agency"}>
          <Agency />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        <Route path={"/plan"}>
          <Plan />
          {/* {userGroups().includes("1") || userGroups().includes("9") ? (
          ) : (
            <NotAuthorized />
          )} */}
        </Route>
        
      </Switch>
    </div>
  );
};

export default PageRoutes;
