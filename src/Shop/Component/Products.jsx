import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import convertMoney from "../../convertMoney";
import handleImgLink from "../../handleImgLink";

Products.propTypes = {
  products: PropTypes.array,
  sort: PropTypes.string,
};

Products.defaultProps = {
  products: [],
  sort: "",
};

function Products(props) {
  const { products, sort } = props;

  // console.log("Shop products:-------", products);
  if (sort === "DownToUp") {
    products.sort((a, b) => {
      return a.price - b.price;
    });
  } else if (sort === "UpToDown") {
    products.sort((a, b) => {
      return b.price - a.price;
    });
  }

  return (
    <div className="row">
      {/* -------------Product----------------- */}
      {products &&
        products.map((value) => (
          <div className="col-lg-4 col-sm-6 Section_Category" key={value._id}>
            <div className="product text-center">
              <div className="position-relative mb-3">
                <div className="badge text-white badge-"></div>
                <Link className="d-block" to={`/detail/${value._id}`}>
                  <img
                    className="img-fluid w-100"
                    src={handleImgLink(value.img1)}
                    alt="..."
                  />
                </Link>
                <div className="product-overlay">
                  <ul className="mb-0 list-inline"></ul>
                </div>
              </div>
              <h6>
                {" "}
                <Link className="reset-anchor" to={`/detail/${value._id}`}>
                  {value.name}
                </Link>
              </h6>
              <p className="small text-muted">
                {convertMoney(value.price)} VND
              </p>
            </div>
          </div>
        ))}
      {/* -------------Product----------------- */}
    </div>
  );
}

export default Products;
