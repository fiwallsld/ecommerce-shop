import React, { useEffect, useState } from "react";
import queryString from "query-string";
import CartAPI from "../API/CartAPI";
import CheckoutAPI from "../API/CheckoutAPI";
import convertMoney from "../convertMoney";
import "./Checkout.css";

import { useSelector } from "react-redux";
import alertify from "alertifyjs";

function Checkout(props) {
  const [carts, setCarts] = useState([]);

  const [total, setTotal] = useState(0);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(false);
  const [load, setLoad] = useState(false);
  const [errorRes, setErrorRes] = useState(null);

  const userId = useSelector((state) => state.Session.userId);

  //Hàm này dùng để gọi API và render số sản phẩm
  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const params = {
          idUser: userId,
        };

        const query = "?" + queryString.stringify(params);

        const response = await CartAPI.getCarts(query);

        // console.log("Checkout get product in cart: ", response);
        const products = response.products.map((item) => ({
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
        }));

        setCarts(products);

        getTotal(products);

        if (products.length === 0) {
          window.location.replace("/cart");
        }
      };

      fetchData();
    }
  }, []);

  //Hàm này dùng để tính tổng tiền carts
  function getTotal(carts) {
    let sub_total = 0;

    carts.map((value) => {
      return (sub_total += parseInt(value.price) * parseInt(value.quantity));
    });

    setTotal(sub_total);
  }

  const handlerSubmit = () => {
    // setLoad(!load);
    const sendMail = async () => {
      const params = {
        email: email,
        fullname: fullname,
        phone: phone,
        address: address,
        idUser: userId,
      };

      const query = "?" + queryString.stringify(params);

      try {
        const response = await CheckoutAPI.postEmail(query);
        // console.log(response);
        setErrorRes(null);

        setTimeout(() => {
          setSuccess(!success);
          setLoad(false);
        }, 500);
      } catch (error) {
        setLoad(false);
        // console.log(error.response.data);
        if (error.response.status === 500) {
          alertify.error(error.response.message);
        }
        setErrorRes(error.response.data);
      }
    };
    sendMail();
  };

  const onChangeName = (e) => {
    setFullname(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const onChangeAddress = (e) => {
    setAddress(e.target.value);
  };

  return (
    <div>
      {load && (
        <div className="wrapper_loader">
          <div className="loader"></div>
        </div>
      )}

      <div className="container">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="h2 text-uppercase mb-0">Checkout</h1>
              </div>
              <div className="col-lg-6 text-lg-right">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                    <li className="breadcrumb-item">
                      <a href="index.html">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="cart.html">Cart</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Checkout
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {!success && (
          <section className="py-5">
            <h2 className="h5 text-uppercase mb-4">Billing details</h2>
            <div className="row">
              <div className="col-lg-8">
                <form>
                  <div className="row">
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Fullname"
                      >
                        Full Name:
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={fullname}
                        onChange={onChangeName}
                        type="text"
                        placeholder="Enter Your Full Name Here!"
                      />
                      {errorRes?.fullname && (
                        <span className="text-danger">
                          * Please Check Your Full Name!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Email"
                      >
                        Email:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={email}
                        onChange={onChangeEmail}
                        type="text"
                        placeholder="Enter Your Email Here!"
                      />
                      {errorRes?.email && (
                        <span className="text-danger">
                          * Please Check Your Email!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Phone"
                      >
                        Phone Number:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={phone}
                        onChange={onChangePhone}
                        type="text"
                        placeholder="Enter Your Phone Number Here!"
                      />
                      {errorRes?.phone && (
                        <span className="text-danger">
                          * Please Check Your Phone Number!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <label
                        className="text-small text-uppercase"
                        htmlFor="Address"
                      >
                        Address:{" "}
                      </label>
                      <input
                        className="form-control form-control-lg"
                        value={address}
                        onChange={onChangeAddress}
                        type="text"
                        placeholder="Enter Your Address Here!"
                      />
                      {errorRes?.address && (
                        <span className="text-danger">
                          * Please Check Your Address!
                        </span>
                      )}
                    </div>
                    <div className="col-lg-12 form-group">
                      <span
                        className="btn btn-dark"
                        style={{ color: "white" }}
                        type="submit"
                        onClick={handlerSubmit}
                      >
                        Place order
                      </span>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-4">
                <div className="card border-0 rounded-0 p-lg-4 bg-light">
                  <div className="card-body">
                    <h5 className="text-uppercase mb-4">Your order</h5>
                    <ul className="list-unstyled mb-0">
                      {carts &&
                        carts.map((value) => (
                          <div key={value._id}>
                            <li className="d-flex align-items-center justify-content-between">
                              <strong className="small font-weight-bold">
                                {value.name.slice(
                                  0,
                                  value.name.length > 20
                                    ? 20
                                    : value.name.length
                                )}
                              </strong>
                              <br></br>
                              <span className="text-muted small">
                                {convertMoney(value.price)} VND x{" "}
                                {value.quantity}
                              </span>
                            </li>
                            <li className="border-bottom my-2"></li>
                          </div>
                        ))}
                      <li className="d-flex align-items-center justify-content-between">
                        <strong className="text-uppercase small font-weight-bold">
                          Total
                        </strong>
                        <span>{convertMoney(total)} VND</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {success && (
          <section className="py-5">
            <div className="p-5">
              <h1>You Have Successfully Ordered!</h1>
              <p style={{ fontSize: "1.2rem" }}>Please Check Your Email.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Checkout;
