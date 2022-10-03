import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import PageRoutes from "../helpers/PageRoutes";
import Login from "../../pages/login/Login";
import { currentYear } from "../helpers/today";
import { useEffect } from "react";
import "../../css/settings.css";

const Layout = () => {
  // for allowing dropdowns functionality for now
  let hasReloaded = sessionStorage.getItem("hasReloaded");
  useEffect(() => {
    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);
  const logout = () => {
    if (typeof Storage !== "undefined") {
      localStorage.removeItem("username");
      localStorage.removeItem("fullname");
      localStorage.removeItem("usergroups");
      ReactDOM.render(<Login />, document.getElementById("root"));
    } else {
      console.log("Sorry, something went wrong, please contact admin!");
    }
  };
  return (
    <div className="hold-transition sidebar-mini layout-fixed layout-navbar-fixed">
      <div className="wrapper">
        <div className="preloader flex-column justify-content-center align-items-center">
          <img
            className="animation__shake"
            src="/dist/img/AdminLTELogo.png"
            alt="AdminLTELogo"
            height="60"
            width="60"
          />
        </div>
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                href=""
                className="nav-link"
                data-widget="pushmenu"
                role="button"
              >
                <i className="fas fa-bars"></i>
              </a>
            </li>
          </ul>
          <div className="col-md-12">
            <div className="row ">
              <div className="col-md-10"></div>
              <div className="col-md-2">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-success col-md-12 dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Settings
                  </button>
                  <div className="dropdown-menu">
                    <Link to="profile" className="dropdown-item" id="profile">
                      Profile
                    </Link>
                    <a id="logout" className="dropdown-item" onClick={logout}>
                      Logout
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
          <a href="" className="brand-link">
            <img
              src="/images/logo.ico"
              alt="Hais"
              className="brand-image"
              style={{ opacity: "0.8" }}
            />
            <span className="h5 text-success font-weight-bold">
              HAIS{" "}
              <span className="text-info font-italic font-weight-normal">
                Experience
              </span>
            </span>
          </a>

          {/* <!-- Sidebar --> */}
          <div className="sidebar">
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="image">
                <img
                  src="images/man.png"
                  className="img-circle elevation-2"
                  alt="User Image"
                />

                <span style={{ margin: "10px", color: "white" }}>
                  Welcome{" "}
                  <span className="text-white">
                    {localStorage.getItem("username")}
                  </span>
                </span>
              </div>
              <div className="info"></div>
            </div>

            {/* <!-- SidebarSearch Form --> */}
            <div className="form-inline">
              <div className="input-group" data-widget="sidebar-search">
                <input
                  className="form-control form-control-sidebar"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <div className="input-group-append">
                  <button className="btn btn-sidebar">
                    <i className="fas fa-search fa-fw"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* <!-- Sidebar Menu --> */}
            <nav
              className="mt-2 overflow-auto h-100"
              id={"sidebar-wrapper"}
              style={{ maxHeight: "80%" }}
            >
              <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {/* <!-- Add icons to the links using the .nav-icon class */}
                {/* with font-awesome or any other icon font library --> */}
                <li className="nav-item active">
                  <Link to="/" className="nav-link">
                    <i className="nav-icon fas fa-tachometer-alt"></i>
                    <p>Dashboard</p>
                  </Link>
                </li>
                {/* <!-- start of corporate links --> */}
                <li className="nav-item active">
                  <a href="" className="nav-link">
                    <i class="nav-icon far fa-building"></i>
                    <p>
                      Corporate
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <Link className="nav-link" to="/add-corporate">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Add Corporate</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/query-corporate" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Query Corporate</p>
                      </Link>
                    </li>
                    {/* <li className="nav-item">
                      <Link
                        to="/prorate-corporate-benefits"
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Prorate Corporate Benefits</p>
                      </Link>
                    </li> */}
                    <li className="nav-item">
                      <Link to="/renew-corporate" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Renew Corporate</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a href="" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Policy Document</p>
                        <i className="right fas fa-angle-left"></i>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link
                            to="policy-document-corporate"
                            className="nav-link"
                          >
                            <i className="far fa-circle nav-icon"></i>
                            <p>Corporate</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="policy-document-sme" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>SME</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link
                            to="policy-document-retail"
                            className="nav-link"
                          >
                            <i className="far fa-circle nav-icon"></i>
                            <p>Retail</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a href="" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Change Agent
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link
                            to="/change-corporate-agent"
                            className="nav-link"
                          >
                            <i className="far fa-circle nav-icon"></i>
                            <p>Corporate</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="/change-retail-agent" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Retail</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a href="" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Corporate Reports
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link className="nav-link" to="/corporate-agents">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Corporate Agents</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link className="nav-link" to="/retail-agents">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Retail Agents</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                {/* <!-- start of member registration links --> */}
                <li className="nav-item">
                  <a href="" className="nav-link">
                    <i className="nav-icon fas fa-users"></i>
                    <p>
                      Registration
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview">
                    <li className="nav-item">
                      <a href="" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Member Management
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <a className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Underwrite Member</p>
                            <i className="right fas fa-angle-left"></i>
                          </a>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link to="/add-principal" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Add Principal</p>
                              </Link>
                            </li>
                            {/* <li className="nav-item">
                              <Link
                                to="/add-principal-from-portal"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Add Principal From Portal</p>
                              </Link>
                            </li> */}
                            <li className="nav-item">
                              <Link to="/add-dependant" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Add Dependant</p>
                              </Link>
                            </li>
                            {/* <li className="nav-item">
                              <Link
                                to="/reorder-smart-card"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Reorder Smart Card</p>
                              </Link>
                            </li> */}
                            <li className="nav-item">
                              <Link
                                to="/query-by-principal-name"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Query By Principal Name</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                to="/query-by-member-number"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Query By Member Number</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                to="/query-by-member-name"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Query By Member Name</p>
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to={"/cancel-member"} className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Cancel Member</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to={"/reinstate-member"} className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Reinstate Member</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to={"/product-change"} className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Change Product</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="/smart-request" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Smart Requests</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="/cards" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Cards</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link to={"/membership-renewal"} className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Membership Renewal</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to={"/import-member-info"} className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Import Member Information</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to={"/import-preloaded-members"}
                        className="nav-link"
                      >
                        <i className="far fa-circle nav-icon"></i>
                        <p>Import Preloaded Members</p>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link to={"/import-contact-details"} className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Import Contact Details</p>
                      </Link>
                    </li>
                    {/* <li className="nav-item">
                      <Link to="/enquiry-pages" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Enquiry Pages</p>
                      </Link>
                    </li> */}
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Reports
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link className="nav-link" to="membership-list">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Membership List</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link className="nav-link" to="corporate-population">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Corporate Population</p>
                          </Link>
                        </li>
                      </ul>

                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="valid-list" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Valid List</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="debited-members" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Debited Members</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                {/* finance menu */}
                <li className="nav-item">
                  <a className="nav-link">
                    <i class="nav-icon fas fa-coins"></i>
                    <p>
                      Finance
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <Link to="/premium-debiting" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Premium Debiting</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/query-debit" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Query Debit</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/premium-receipt" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Premium Receipt</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/print-receipts" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Print Receipts</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/debit-reversal" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Debit Reversal</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/receipt-reversal" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Receipt Reversal</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/allocate-receipts" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Allocate Receipts</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/quotation" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Quotation</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Reports
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link className="nav-link" to="fund-statement">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Fund Statement</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link className="nav-link" to="premium-statement">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Premium Statement</p>
                          </Link>
                        </li>
                      </ul>

                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="premium-register" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Premium Register</p>
                          </Link>
                        </li>
                      </ul>
                      {/* <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="revenue-statement" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Revenue Statement</p>
                          </Link>
                        </li>
                      </ul> */}
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="claims-reserve" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Claims Reserve</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                {/* claims menu */}
                <li className="nav-item">
                  <a className="nav-link">
                    <i class="nav-icon fas fa-file-invoice-dollar"></i>
                    <p>
                      Bills
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Bills Management</p>
                        <i className="right fas fa-angle-left"></i>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <a className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Bill Process</p>
                            <i className="right fas fa-angle-left"></i>
                          </a>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link to="enter-bill" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Enter Bill</p>
                              </Link>
                            </li>
                            {/* <li className="nav-item">
                              <Link
                                to="enter-bill-by-line-items"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Enter Bill By Line Items</p>
                                <i className="right fas fa-angle-left"></i>
                              </Link>
                            </li> */}
                            <li className="nav-item">
                              <Link to="vet-bill" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Vet Bill</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="add-an-invoice" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Add An Invoice Bill</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                to="import-hospital-bills"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Import Hospital Claims</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="query-claim" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Query Claim</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="query-batch" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Query Batch</p>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Bills Payment</p>
                            <i className="right fas fa-angle-left"></i>
                          </a>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link to="pay-batch" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Pay Batch</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="pay-provider" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Pay Provider</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="pay-provider-fund" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Pay Provider Fund</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="reimburse-member" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Reimburse Member</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                to="reimburse-corporate"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Reimburse Corporate</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="unvoucher-claims" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Unvoucher Claims</p>
                              </Link>
                            </li>
                            {/* <li className="nav-item">
                                  <Link
                                    to="voucher-summary-per-corporate"
                                    className="nav-link"
                                  >
                                    <i className="far fa-circle nav-icon"></i>
                                    <p>Voucher Summary Per Corporate</p>
                                    <i className="right fas fa-angle-left"></i>
                                  </Link>
                                </li> */}
                            <li className="nav-item">
                              <Link
                                to="query-batch-payment"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Query batch</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="query-cheque" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Query Cheque</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link to="query-voucher" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Query Voucher</p>
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                to="query-paid-voucher"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Query Paid Voucher</p>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item">
                          <Link to="batch-claims" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Batch Claims</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Reports
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link className="nav-link" to="claims-experience">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Claims Experience</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link className="nav-link" to="claims-register">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Claims Register</p>
                          </Link>
                        </li>
                      </ul>

                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="rejected-bills" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Rejected Bills</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="suspended-claims" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Suspended Claims</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="rejection-rate" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Rejection Rate</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="outstanding-bills" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Outstanding Bills</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="utilization" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Utilization</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link
                            to="claims-experience-extract"
                            className="nav-link"
                          >
                            <i className="far fa-circle nav-icon"></i>
                            <p>Claims Experience Extract</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="batch-process" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Batch Process</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="batch-report" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Batch Report</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="claims-status-summary" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Claims Status Summary</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="vetted-bills" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Vetted Bills</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                {/* <!-- start of Care links --> */}
                <li className="nav-item">
                  <a className="nav-link">
                    <i class="nav-icon fas fa-heartbeat"></i>
                    <p>
                      Care
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Pre Authorization</p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="new-preauth" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>New</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="extension-preauth" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Extension</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <Link to="decline" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Decline</p>
                      </Link>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <Link to="care-admission" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Care Admission</p>
                      </Link>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <Link to="admission-visit" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Admission visit</p>
                      </Link>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <Link to="corporate-visit" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Corporate visit</p>
                      </Link>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Reports
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <a className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>
                              Care Misc Reports
                              <i className="right fas fa-angle-left"></i>
                            </p>
                          </a>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link to="care-admissions" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Care Admissions</p>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link to="care-visits" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Care Visits</p>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link to="patient-comments" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Patient Comments</p>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link to="tasks-followup" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Task Followup</p>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link to="past-admissions" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Past Admissions</p>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link
                                to="admission-authorisations"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Admission Authorisations</p>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link to="corporate-needs" className="nav-link">
                                <i className="far fa-circle nav-icon"></i>
                                <p>Corporate Needs</p>
                              </Link>
                            </li>
                          </ul>
                          <ul className="nav nav-treeview ml-3">
                            <li className="nav-item">
                              <Link
                                to="edit-preauthorisation"
                                className="nav-link"
                              >
                                <i className="far fa-circle nav-icon"></i>
                                <p>Edit PreAuthorisation</p>
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="case-management" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Case Management</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                {/* commission */}
                <li className="nav-item">
                  <a className="nav-link">
                    <i class="nav-icon fas fa-heartbeat"></i>
                    <p>
                      Commission
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Intermediary
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="pay-commission" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Pay Commission</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="enter-deductions" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Enter Deductions</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Override
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="pay-overide-bdm" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Pay Override BDM</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="pay-assistant-hos" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Pay Assistant HOS</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="pay-hos" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Pay HOS</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Reports
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="commission-statement" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Commission Statement</p>
                          </Link>
                        </li>
                      </ul>
                      {/* <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="override-statement" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Override Statement</p>
                          </Link>
                        </li>
                      </ul> */}
                    </li>
                  </ul>
                </li>
                {/* Reinsurance */}
                <li className="nav-item">
                  <a className="nav-link">
                    <i class="nav-icon fas fa-umbrella"></i>
                    <p>
                      Re-Insurance
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Quota Share
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="premium-schedule" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Premium Schedule</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link
                            to="claims-payments-schedule"
                            className="nav-link"
                          >
                            <i className="far fa-circle nav-icon"></i>
                            <p>Claims Payments Schedule</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  {/* <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <Link to="excess-of-loss" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Excess Of Loss</p>
                      </Link>
                    </li>
                  </ul> */}
                </li>
                {/* management */}
                <li className="nav-item">
                  <a className="nav-link">
                    <i class="nav-icon fas fa-chart-line"></i>
                    <p>
                      Management
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Management Reports
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="user-activity" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Operations</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                {/* ADMIN MODULE */}
                <li className="nav-item">
                  <a className="nav-link">
                    <i class="nav-icon fas fa-user-shield"></i>
                    <p>
                      Admin
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul className="nav nav-treeview ml-3">
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          Add Selection Items
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="rate-sheet" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Rate Sheet</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link
                            to="reinsurance-quota-share"
                            className="nav-link"
                          >
                            <i className="far fa-circle nav-icon"></i>
                            <p>Reinsurance Quota Share</p>
                          </Link>
                        </li>
                      </ul>
                      {/* <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link
                            to="reinsurance-excess-of-loss"
                            className="nav-link"
                          >
                            <i className="far fa-circle nav-icon"></i>
                            <p>Reinsurance Excess Of Loss</p>
                          </Link>
                        </li>
                      </ul> */}
                      {/* <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="product" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Product</p>
                          </Link>
                        </li>
                      </ul> */}
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="diagnosis" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Diagnosis</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="service" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Service</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="doctors" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Doctors</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="plan" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Plan</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="diagnosis-class" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Diagnosis Class</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="scheme-rules" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Scheme Rules</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="deduction-reasons" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Deduction Reasons</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="rejection-reason" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Rejection Reason</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="bank" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Bank</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="benefit" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Benefit</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="levy" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Levy</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="product-name" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Product Name</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="resend-reason" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Resend Reason</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="decline-reason" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Decline Reason</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="corporate-visit-issue" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Corporate Visit Issue</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="conversion-rates" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Conversion Rates</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="units" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Units</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="unit-managers" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Unit Managers</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="agency" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Agency</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="illness" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Illness</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="exclusions" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Exclusions</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="allergies" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Allergies</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link
                            to="suspend-reject-reasons"
                            className="nav-link"
                          >
                            <i className="far fa-circle nav-icon"></i>
                            <p>Suspend/Reject Reasons</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="bank-accounts" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Bank Accounts</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="exchange-rate" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Exchange Rate</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="reversal-reasons" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Reversal Reasons</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="transaction-rate" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Transaction Rate</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="bdm" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Bdm</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="price-list" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Price List</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="price-list-year" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Price List Year</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link to="/agent-management" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Agent Management</p>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>
                          User Management
                          <i className="right fas fa-angle-left"></i>
                        </p>
                      </a>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="manage-user" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Manage User</p>
                          </Link>
                        </li>
                      </ul>
                      <ul className="nav nav-treeview ml-3">
                        <li className="nav-item">
                          <Link to="delete-user-log" className="nav-link">
                            <i className="far fa-circle nav-icon"></i>
                            <p>Delete Log List</p>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link to="/change-password" className="nav-link">
                        <i className="far fa-circle nav-icon"></i>
                        <p>Change Password</p>
                      </Link>
                    </li>
                  </ul>
                </li>
                {/* Access Log */}
                {/* <li className="nav-item">
                  <a className="nav-link">
                    <i class="nav-icon fas fa-user-clock"></i>
                    <p>
                      Access Log
                      <i className="right fas fa-angle-left"></i>
                    </p>
                  </a>
                </li> */}
                {/* logout */}
                {/*<li className="nav-item">

                </li>*/}
              </ul>
            </nav>
            {/* <a className="nav-link">
              <button className="btn btn-danger col-md-3" onClick={logout}>
                Logout
              </button>
            </a> */}
            {/* <!-- /.sidebar-menu --> */}
          </div>
          {/* <!-- /.sidebar --> */}
        </aside>

        {/* <!-- Content Wrapper. Contains page content --> */}
        <div className="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <div className="content-header p-0">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  {/* <!-- find use for this line --> */}
                  {/* <!-- <h1 className="m-0">Dashboard</h1> --> */}
                </div>
              </div>
            </div>
          </div>
          {/* <!-- /.content-header -->
      @yield('content')
      
      <!-- loader and overlay --> */}
          {/* MAIN DIV TO RENDER ALL PAGES */}
          <div id="main">
            <PageRoutes />
          </div>
          <div id="overlay">
            <div className="cv-spinner">
              <span className="spinner"></span>
            </div>
          </div>
        </div>
        {/* <!-- /.content-wrapper --> */}
        <footer className="main-footer">
          <strong>
            Copyright &copy; {currentYear()}{" "}
            <a href="https://prosperitykenya.net">HAIS EXPERIENCE</a>.
          </strong>
          All rights reserved.
          <div className="float-right d-none d-sm-inline-block">
            <b>Version</b> 1.0
          </div>
        </footer>

        {/* <!-- Control Sidebar --> */}
        <aside className="control-sidebar control-sidebar-dark">
          {/* <!-- Control sidebar content goes here --> */}
        </aside>
        {/* <!-- /.control-sidebar --> */}
      </div>
    </div>
  );
};

export default Layout;
