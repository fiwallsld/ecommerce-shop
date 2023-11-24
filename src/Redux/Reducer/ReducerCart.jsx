let initalState = {
  userId: "",
  listCart: [],
};

const ReducerCart = (state = initalState, action) => {
  switch (action.type) {
    case "RESET_CART":
      // console.log("user: ", action.data);
      state = {
        userId: "",
        listCart: [],
      };
      return state;

    //Nhận dữ liệu id_user và thay đổi state
    case "ADD_USER":
      // console.log("user: ", action.data);
      state = {
        userId: action.data.userId,
        // listCart: state.listCart,
        listCart: action.data.listCart,
      };
      return state;
    case "ADD_CART":
      //Lấy dữ liệu được truyền tới
      const data_add_cart = action.data;

      // console.log(data_add_cart);

      //Lấy dữ liệu có sẵn trong state
      const add_cart = state.listCart;

      if (add_cart.length < 1) {
        add_cart.push(data_add_cart);
      } else {
        //Tìm Vị Trí của sản phẩm đã mua
        const indexCart = add_cart.findIndex((value) => {
          return value._id === data_add_cart._id;
        });

        //Tìm xem thử sản phẩm này đã mua hay chưa
        const findCart = add_cart.find((value) => {
          return value._id === data_add_cart._id;
        });

        //Nếu này chưa được mua thì mình push vào
        //Còn đã từng mua rồi thì mình update tại vị trí indexCart mà mình vừa tìm được
        if (!findCart) {
          add_cart.push(data_add_cart);
          // console.log("Push");
        } else {
          add_cart[indexCart].quantity =
            parseInt(add_cart[indexCart].quantity) +
            parseInt(data_add_cart.quantity);
          // console.log("Update");
        }
      }

      state = {
        userId: state.userId,
        listCart: add_cart,
      };

      console.log(state);
      return state;

    case "DELETE_CART":
      //Lấy dữ liệu được truyền tới
      const data_delete_cart = action.data;

      //Lấy dữ diệu có sẵn trong state
      const delete_cart = state.listCart;

      //Tìm kiểm vị trí mà cần xóa
      const indexDelete = delete_cart.findIndex((value) => {
        return value.idProduct === data_delete_cart.idProduct;
      });

      //Xóa theo vị trí
      delete_cart.splice(indexDelete, 1);

      state = {
        userId: state.userId,
        listCart: delete_cart,
      };

      return state;

    case "DELETE_ALL_CART":
      const data_delete_all_cart = action.data;

      state = {
        userId: state.userId,
        listCart: data_delete_all_cart,
      };

      return state;

    case "UPDATE_CART":
      // console.log("HANDLE UPDATE_CART:----------");
      // console.log(action.data);
      const data_update_cart = action.data;

      // console.log("data_update_cart-:", data_update_cart);
      const update_cart = state.listCart;
      // console.log("update_cart-:", update_cart);

      const index = update_cart.findIndex((value) => {
        return value._id === data_update_cart.idProduct;
      });
      // console.log(index);

      update_cart[index].quantity = data_update_cart.quantity;

      state = {
        userId: state.userId,
        listCart: update_cart,
      };
      // console.log("END HANDLE UPDATE_CART");
      return state;

    default:
      return state;
  }
};

export default ReducerCart;
