import React, { useEffect, useState } from "react";
import "./recentSales.css";
import RecentSalesTable from "./RecentSalesTable";
import CardFilter from "./CardFilter";

export default function RecentSales() {
  const [items, setItems] = useState([

    {
        "_id": 1,
        "number": "#2457",
        "customer": "Brandon Jacob",
        "product": "At praesentium minu",
        "price": 64,
        "status": "Approved"
    },
    {
        "_id": 2,
        "number": "#2147",
        "customer": "Bridie Kessler",
        "product": "Blanditiis dolor omnis similique",
        "price": 47,
        "status": "Pending"
    },
    {
        "_id": 3,
        "number": "#2049",
        "customer": "Ashleigh Langosh",
        "product": "At recusandae consectetur",
        "price": 147,
        "status": "Approved"
    },
    {
        "_id": 4,
        "number": "#2644",
        "customer": "Angus Grady",
        "product": "Ut voluptatem id earum et",
        "price": 67,
        "status": "Rejected"
    },
    {
        "_id": 5,
        "number": "#3592",
        "customer": "Raheem Lehner",
        "product": "Sunt similique distinctio",
        "price": 135,
        "status": "Approved"
    }
  ]);

  const [filter, setFilter] = useState("Today");

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const fetchData = () => {
    fetch("http://localhost:4000/recentsales")
      .then((res) => res.json())

      .then((data) => {
        setItems(data);
      })

      .catch((e) => console.log(e.message));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card recent-sales overflow-auto">
      <CardFilter filterChange={handleFilterChange} />

      <div className="card-body">
        <h5 className="card-title">
          Recent Sales <span>| {filter}</span>
        </h5>

        <RecentSalesTable items={items} />
      </div>
    </div>
  );
}
