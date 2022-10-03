import { getData, postData } from "../../../components/helpers/Data";
import { useState, useEffect } from "react";
import { Spinner } from "../../../components/helpers/Spinner";

export const Product = () => {
  const [existingProduct, setExistingProduct] = useState([]);
  const [newProduct, setNewProduct] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    loadExistingProducts();
  }, []);

  const loadExistingProducts = () => {
    document.getElementById("spinner").style.display = "block";
    getData("get_all_products")
      .then((dt) => {
        const productNameDropdown = dt.product_name.map((data) => {
          return (
            <option key={data.code} value={data.code}>
              {data.product_name}
            </option>
          );
        });
        const benefitDropDown = dt.benefit.map((data) => {
          return (
            <option key={data.code} value={data.code}>
              {data.benefit}
            </option>
          );
        });
        const sharingDropDown = dt.sharing.map((data) => {
          return (
            <option key={data.CODE} value={data.CODE}>
              {data.SHARING}
            </option>
          );
        });
        const healthPlanDropDown = dt.health_plan.map((data) => {
          return (
            <option key={data.category} value={data.category}>
              {data.category}
            </option>
          );
        });

        const rowData = dt.all_products.map((data) => {
          return (
            <tr key={data.id}>
              <td>
                <input
                  className="form-control"
                  type="number"
                  name="id[]"
                  min="1"
                  defaultValue={data.id}
                  readOnly
                />
              </td>
              <td>
                <select
                  className="form-control"
                  defaultValue={data.health_plan}
                  type="text"
                  name="health_plan[]"
                >
                  <option value={data.health_plan}>{data.health_plan}</option>
                  {healthPlanDropDown}                  
                </select>
              </td>
              <td>
                <select
                  className="form-control"
                  defaultValue={data.product_name_code}
                  type="text"
                  name="product_name[]"
                >
                  <option value={data.product_name_code}>
                    {data.product_name}
                  </option>
                  {productNameDropdown}                  
                  ;
                </select>
              </td>
              <td>
                <select
                  defaultValue={data.benefit_code}
                  className="form-control"
                  type="text"
                  name="benefit[]"
                >
                  <option value={data.benefit_code}>{data.benefit}</option>
                  {benefitDropDown}                 
                </select>
              </td>
              <td>
                <input
                  className="form-control"
                  type="number"
                  name="family_limit[]"
                  min="1"
                  defaultValue={
                    data.family_limit !== null ? data.family_limit : 0
                  }
                />
              </td>
              <td>
                <input
                  className="form-control"
                  type="number"
                  name="limit[]"
                  min="1"
                  defaultValue={data.limit !== null ? data.limit : 0}
                />
              </td>
              <td>
                <select
                  defaultValue={data.sharing_code}
                  className="form-control"
                  type="text"
                  name="sharing[]"
                >
                  <option value={data.sharing_code}>{data.sharing}</option>
                  {sharingDropDown}                 
                </select>
              </td>
              <td>
                <select
                  defaultValue={data.sub_limit_of}
                  className="form-control"
                  type="text"
                  name="sub_limit_of[]"
                >
                  <option value={data.sub_limit_of}>{data.sub_limit_of}</option>
                  {benefitDropDown}                
                </select>
              </td>
              <td>
                <input
                  className="form-control fund"
                  type="checkbox"
                  value={data.fund !== "1" ? "0" : "1"}
                  defaultChecked={data.fund === "1" ? "checked" : ""}
                />
              </td>
              <td>
                <input
                  className="form-control capitated"
                  type="checkbox"
                  value={data.capitated !== "1" ? "0" : "1"}
                  defaultChecked={data.capitated === "1" ? "checked" : ""}
                />
              </td>
              <td>
                <input
                  className="form-control"
                  defaultValue={data.quantity !== null ? data.quantity : 0}
                  type="number"
                  min="1"
                  name="quantity[]"
                />
              </td>
            </tr>
          );
        });

        setExistingProduct(rowData);

        document.getElementById("spinner").style.display = "none";
      })
      .catch((error) => console.log(error));
  };

  const getNewProduct = async () => {
    getData("get_all_products")
      .then((dt) => {
        const productNameDropdown = dt.product_name.map((data) => {
          return (
            <option key={data.code} value={data.code}>
              {data.product_name}
            </option>
          );
        });
        const benefitDropDown = dt.benefit.map((data) => {
          return (
            <option key={data.code} value={data.code}>
              {data.benefit}
            </option>
          );
        });
        const sharingDropDown = dt.sharing.map((data) => {
          return (
            <option key={data.CODE} value={data.CODE}>
              {data.SHARING}
            </option>
          );
        });
        const healthPlanDropDown = dt.health_plan.map((data) => {
          return (
            <option key={data.category} value={data.category}>
              {data.category}
            </option>
          );
        });

        const product = {
          id: new Date().getTime().toString(),
          new: (
            <>
              <td>
                <select name="health_plan_added[]" className="form-control">
                  {healthPlanDropDown}
                </select>
              </td>
              <td>
                <select name="product_name_added[]" className="form-control">
                  {productNameDropdown}
                </select>
              </td>
              <td>
                <select name="benefit_added[]" className="form-control">
                  {benefitDropDown}
                </select>
              </td>
              <td>
                <input
                  name="family_limit_added[]"
                  type="number"
                  min="1"
                  className="form-control"
                />
              </td>
              <td>
                <input
                  name="limit_added[]"
                  type="number"
                  min="1"
                  className="form-control"
                />
              </td>
              <td>
                <select name="sharing_added[]" className="form-control">
                  {sharingDropDown}
                </select>
              </td>
              <td>
                <select name="sub_limit_of_added[]" className="form-control">
                  {benefitDropDown}
                </select>
              </td>
              <td>
                <input type="checkbox" className="form-control fund_added" />
              </td>
              <td>
                <input
                  type="checkbox"
                  className="form-control capitated_added"
                />
              </td>
              <td>
                <input
                  name="quantity_added[]"
                  type="number"
                  min="1"
                  className="form-control"
                />
              </td>
              <td>
                <button
                  className="btn text-danger"
                  onClick={(e) => removeRow(product.id, e)}
                >
                  <i className="fas fa-trash fa-lg"></i>
                </button>
              </td>
            </>
          ),
        };
        setNewProduct((newProduct) => {
          return [...newProduct, product];
        });
      })
      .catch((error) => console.log(error));
  };

  const removeRow = async (id, e) => {
    e.preventDefault();
    setNewProduct((newProduct) => {
      return newProduct.filter((row) => row.id !== id);
    });
  };

  const updateProducts = async () => {
    const frmData = new FormData(
      document.getElementById("frmExistingProducts")
    );
    const fundCheckbox = document.querySelectorAll(".fund");
    const capitatedCheckbox = document.querySelectorAll(".capitated");

    fundCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("fund[]", "1");
      } else {
        frmData.append("fund[]", "0");
      }
    });

    capitatedCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("capitated[]", "1");
      } else {
        frmData.append("capitated[]", "0");
      }
    });

    postData(frmData, "update_products").then((data) => {
      setFeedback(data.response);
      const tbl = document.getElementById("tblAddedProducts");
      const tbodyRowCount = tbl.tBodies[0].rows.length;
      if (tbodyRowCount) {
        saveProducts();
      }
    });
  };

  const saveProducts = async () => {
    const frmData = new FormData(document.getElementById("frmAddedProducts"));
    const fundCheckbox = document.querySelectorAll(".fund_added");
    const capitatedCheckbox = document.querySelectorAll(".capitated_added");

    fundCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("fund_added[]", "1");
      } else {
        frmData.append("fund_added[]", "0");
      }
    });

    capitatedCheckbox.forEach((element) => {
      if (element.checked == true) {
        frmData.append("capitated_added[]", "1");
      } else {
        frmData.append("capitated_added[]", "0");
      }
    });

    postData(frmData, "save_products").then((data) => {
      setFeedback((feedback) => {
        return [feedback, data.response];
      });
    });
  };

  // const getValue = async (e)=> {
  //   console.log(e.target.value);
  // }
  return (
    <div>
      <span className="mx-auto col-md-4">
        {feedback.length == 0 ? (
          ""
        ) : (
          <span className="alert alert-success">{feedback}</span>
        )}
      </span>
      <button
        onClick={updateProducts}
        className="btn btn-info col-md-4"
        style={{ float: "right", marginBottom: "10px" }}
      >
        Save Product
      </button>
      <button
        onClick={getNewProduct}
        className="btn btn-warning col-md-4"
        style={{ float: "right", marginBottom: "10px", marginRight: "5px" }}
      >
        Add Product
      </button>
      <form id="frmExistingProducts">
        <table
          className="table table-bordered col-md-12"
          id="tblExistingProducts"
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Health Plan</th>
              <th>Product Name</th>
              <th>Benefit</th>
              <th>Family Limit</th>
              <th>Limit</th>
              <th>Sharing</th>
              <th>Sub Limit Of</th>
              <th>Fund</th>
              <th>Capitated</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>{existingProduct}</tbody>
        </table>
      </form>
      <hr />
      <p className="alert alert-info text-center">Added Products</p>
      <form id="frmAddedProducts">
        <table className="table table-bordered" id="tblAddedProducts">
          <thead>
            <tr>
              <th>Health Plan</th>
              <th>Product Name</th>
              <th>Benefit</th>
              <th>Family Limit</th>
              <th>Limit</th>
              <th>Sharing</th>
              <th>Sub Limit Of</th>
              <th>Fund</th>
              <th>Capitated</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {newProduct.map((newRow) => {
              {
                return <tr key={newRow.id}>{newRow.new}</tr>;
              }
            })}
          </tbody>
        </table>
      </form>
      <Spinner />
    </div>
  );
};

export default Product;
