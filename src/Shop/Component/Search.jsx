import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

Search.propTypes = {
  handlerSearch: PropTypes.func,
};

Search.defaultProps = {
  handlerSearch: null,
};

function Search(props) {
  const { handlerSearch, keySearch, setKeySearch } = props;

  const delaySearchTextTimeOut = useRef(null);

  const onChangeText = (e) => {
    const value = e.target.value;

    setKeySearch(value);

    if (handlerSearch) {
      //Nếu người dùng đang nhập thì mình clear cái giây đó
      if (delaySearchTextTimeOut.current) {
        clearTimeout(delaySearchTextTimeOut.current);
      }

      delaySearchTextTimeOut.current = setTimeout(() => {
        handlerSearch(value);
      }, 500);
    }
  };

  return (
    <div className="col-lg-4">
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Enter Search Here!"
        onChange={onChangeText}
        value={keySearch}
      />
    </div>
  );
}

export default Search;
