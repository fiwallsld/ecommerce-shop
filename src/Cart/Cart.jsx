import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCart, updateCart } from "../Redux/Action/ActionCart";
import ListCart from "./Component/ListCart";
import alertify from "alertifyjs";
import { Link, useNavigate } from "react-router-dom";
import CartAPI from "../API/CartAPI";
import queryString from "query-string";
import convertMoney from "../convertMoney";

function Cart(props) {
  const navigate = useNavigate();

  //id_user được lấy từ redux
  const userId = useSelector((state) => state.Session.userId);

  //listCart được lấy từ redux
  const listCart = useSelector((state) => state.Cart.listCart);

  // console.log(listCart);

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState();

  const dispatch = useDispatch();

  //State dùng để Load dữ liệu từ Redux
  const [loadRedux, setLoadRedux] = useState({
    idProduct: "",
    quantity: "",
  });

  //State dùng để Load dữ liệu từ API
  const [loadAPI, setLoadAPI] = useState(false);

  //Hàm này dùng để Load dữ liệu ở Redux
  //Khi người dùng chưa đăng nhập
  useEffect(() => {
    const fetchDataRedux = () => {
      if (!userId) {
        // console.log("No login----- with Listcart:", listCart);
        setCart(listCart);
        getTotal(listCart);
      }
    };

    fetchDataRedux();
  }, [loadRedux]);

  //Hàm này dùng để tính tổng tiền carts
  function getTotal(carts) {
    // console.log(carts);
    let sub_total = 0;
    carts?.map((value) => {
      return (sub_total += parseInt(value.price) * parseInt(value.quantity));
    });
    setTotal(sub_total);
  }

  //Hàm này dùng để load dữ liệu từ API
  //Khi người dùng đã đăng nhập
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const params = {
          idUser: userId,
        };
        const query = "?" + queryString.stringify(params);
        const response = await CartAPI.getCarts(query);
        // console.log("Lay du lieu nguoi dung", response);
        const products = response?.products?.map((item) => {
          return {
            ...item.productId,
            quantity: item.quantity,
          };
        });

        setCart(products);
        getTotal(products);
      }
    };

    fetchData();
    setLoadAPI(false);
  }, [loadAPI, userId]);

  //Hàm này dùng để truyền xuống cho component con xử và trả ngược dữ liệu lại component cha
  const onDeleteCart = (getUser, getProduct) => {
    // console.log("idUser: " + getUser + ", idProduct: " + getProduct);
    // user đã đăng nhập
    if (userId) {
      //Sau khi nhận được dữ liệu ở component con truyền lên thì sẽ gọi API xử lý dữ liệu
      const fetchDelete = async () => {
        const params = {
          idUser: getUser,
          idProduct: getProduct,
        };
        const query = "?" + queryString.stringify(params);
        await CartAPI.deleteToCart(query);
        // console.log(response);
        setLoadAPI(true);
        alertify.set("notifier", "position", "bottom-left");
        alertify.error("Bạn Đã Xóa Hàng Thành Công!");
      };
      fetchDelete();
      //Sau đó thay đổi state loadAPI và load lại hàm useEffect
    } else {
      // user chưa đăng nhập
      //Nếu không có phiên làm việc của Session User thì mình sẽ xử lý với Redux
      const data = {
        idProduct: getProduct,
        idUser: getUser,
      };

      //Đưa dữ liệu vào Redux
      const action = deleteCart(data);
      dispatch(action);

      alertify.set("notifier", "position", "bottom-left");
      alertify.error("Bạn Đã Xóa Hàng Thành Công!");

      //set state loadRedux để nó load lại hàm useEffect để tiếp tục lấy dữ liệu từ redux
      setLoadRedux({
        idProduct: getProduct,
        count: "",
      });
    }
  };

  //Hàm này dùng để truyền xuống cho component con xử và trả ngược dữ liệu lại component cha
  const onUpdateCount = (getUser, getProduct, getCount) => {
    if (userId) {
      // user đã đăng nhập
      //Sau khi nhận được dữ liệu ở component con truyền lên thì sẽ gọi API xử lý dữ liệu
      const fetchPut = async () => {
        const params = {
          idUser: userId,
          idProduct: getProduct,
          count: getCount,
        };

        const query = "?" + queryString.stringify(params);

        await CartAPI.putToCart(query);
        // console.log(response);
        setLoadAPI(true);
        alertify.set("notifier", "position", "bottom-left");
        alertify.success("Bạn Đã Sửa Số Lượng Thành Công!");
      };

      fetchPut();
      //Sau đó thay đổi state loadAPI và load lại hàm useEffect
    } else {
      //Nếu không có phiên làm việc của Session User thì mình sẽ xử lý với Redux
      const data = {
        idProduct: getProduct,
        idUser: getUser,
        quantity: getCount,
      };

      // console.log("Cart add--Chua login---------", data);
      //Đưa dữ liệu vào Redux
      const action = updateCart(data);
      dispatch(action);

      alertify.set("notifier", "position", "bottom-left");
      alertify.success("Bạn Đã Sửa Hàng Thành Công!");
      //set state loadRedux để nó load lại hàm useEffect để tiếp tục lấy dữ liệu từ redux
      setLoadRedux({
        idProduct: getProduct,
        quantity: getCount,
      });
    }
  };

  const onCheckout = (error) => {
    if (!userId) {
      alertify.set("notifier", "position", "bottom-left");
      alertify.error("Vui Lòng Kiểm Tra Lại Đăng Nhập!");
      return;
    }

    if (cart.length === 0) {
      alertify.set("notifier", "position", "bottom-left");
      alertify.error("Vui Lòng Kiểm Tra Lại Giỏ Hàng!");
      return;
    }

    const check = cart.filter((item) => +item.quantity > +item.count);

    if (check.length > 0) {
      alertify.set("notifier", "position", "bottom-left");
      alertify.error("Vui Lòng Kiểm Tra Lại Số Lượng!");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="container">
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row px-4 px-lg-5 py-lg-4 align-items-center">
            <div className="col-lg-6">
              <h1 className="h2 text-uppercase mb-0">Cart</h1>
            </div>
            <div className="col-lg-6 text-lg-right">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-lg-end mb-0 px-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    Cart
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <h2 className="h5 text-uppercase mb-4">Shopping cart</h2>
        <div className="row">
          <div className="col-lg-8 mb-4 mb-lg-0">
            <ListCart
              listCart={cart}
              onDeleteCart={onDeleteCart}
              onUpdateCount={onUpdateCount}
            />
            <div className="bg-light px-4 py-3">
              <div className="row align-items-center text-center">
                <div className="col-md-6 mb-3 mb-md-0 text-md-left">
                  <Link
                    className="btn btn-link p-0 text-dark btn-sm"
                    to={`/shop`}
                  >
                    <i className="fas fa-long-arrow-alt-left mr-2"> </i>
                    Continue shopping
                  </Link>
                </div>
                <div className="col-md-6 text-md-right">
                  <span
                    className="btn btn-outline-dark btn-sm"
                    onClick={onCheckout}
                  >
                    Proceed to checkout
                    <i className="fas fa-long-arrow-alt-right ml-2"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 rounded-0 p-lg-4 bg-light">
              <div className="card-body">
                <h5 className="text-uppercase mb-4">Cart total</h5>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center justify-content-between">
                    <strong className="text-uppercase small font-weight-bold">
                      Subtotal
                    </strong>
                    <span className="text-muted small">
                      {convertMoney(total)} VND
                    </span>
                  </li>
                  <li className="border-bottom my-2"></li>
                  <li className="d-flex align-items-center justify-content-between mb-4">
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
    </div>
  );
}

export default Cart;
