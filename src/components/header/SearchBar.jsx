import React from "react";
import "./searchBar.css";

export default function SearchBar() {
  return (
    <div className="search-bar">
      <form
        className="search-form d-flex align-items-center"
        // method="POST"
        // action="#"
      >
        <input
          type="text"
          name="query"
          placeholder="Search"
          title="Enter search keywords"
        />
        <button  type="submit" title="Search">
          <i className="bi bi-search"></i>
        </button>
      </form>
    </div>
  );
}
