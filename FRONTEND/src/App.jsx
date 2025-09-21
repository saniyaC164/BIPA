import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";

function App() {
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [salesByHour, setSalesByHour] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/kpi/total_revenue")
      .then(res => res.json())
      .then(data => setTotalRevenue(data.total_revenue));

    fetch("http://localhost:8000/kpi/top_products")
      .then(res => res.json())
      .then(data => setTopProducts(data.top_products));

    fetch("http://localhost:8000/kpi/sales_by_hour")
      .then(res => res.json())
      .then(data => setSalesByHour(data.sales_by_hour));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Café Analytics Dashboard</h1>

      <h2>Total Revenue: ${totalRevenue}</h2>

      <h3>Top 5 Products</h3>
      <BarChart width={500} height={300} data={topProducts}>
        <XAxis dataKey="product_detail" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="transaction_qty" fill="#82ca9d" />
      </BarChart>

      <h3>Sales by Hour</h3>
      <LineChart width={500} height={300} data={salesByHour}>
        <XAxis dataKey="Hour" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="Total_bill" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default App;
