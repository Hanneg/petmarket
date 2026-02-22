import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  layouts,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardHome() {
  const { user } = useAuth();

  const [usersSummary, setUsersSummary] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [salesBySeller, setSalesBySeller] = useState([]);
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      }
    },
    layout: {
      padding: 10
    }
  };

  const COLORS = [
    "#5f9926", // indigo
    "#975f3e", // green
    "#f39300", // amber
    "#EF4444", // red
    "#bdd9a9", // blue
    "#8B5CF6", // purple
  ];

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        Authorization: `Bearer ${user.token}`,
      };

      const endpoints = [
        "users-summary",
        "products-by-category",
        "sales-by-seller",
        "sales-by-month",
        "orders-by-status",
      ];

      try {
        const responses = await Promise.all(
          endpoints.map((endpoint) => 
            fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
              headers,
            }).then((res) => res.json())
          )
        );

        setUsersSummary(responses[0]);
        setProductsByCategory(responses[1]);
        setSalesBySeller(responses[2]);
        setSalesByMonth(responses[3]);
        setOrdersByStatus(responses[4]);

      } catch (error) {
        console.error("Error cargando dashboard", error);
      }
    };

    fetchData();
  }, [user.token]);

  return (
    <div className="dashboard-wrapper text-secondary">
      <h3 className="mb-4">📊 Panel Administrativo</h3>

      <div className="dashboard-grid">

        {/* Usuarios por rol */}
        <div className="dashboard-card">
          <h5>Usuarios por rol</h5>
          <div style={{ height: "300px", position: "relative" }}
          >
            <Pie
              data={{
                labels: usersSummary.map(u => u.role),
                datasets: [{
                  data: usersSummary.map(u => Number(u.total)),
                  backgroundColor: COLORS,
                  borderWidth: 1
                }]
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Productos por categoría */}
        <div className="dashboard-card">
          <h5>Productos por categoría</h5>
          <div style={{ height: "300px", position: "relative" }}>
            <Bar 
              data={{
                labels: productsByCategory.map(p => p.category),
                datasets: [{
                  label: "Categoría",
                  data: productsByCategory.map(p => Number(p.total)),
                  backgroundColor: "#5f9926"
                }]
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Ventas por vendedor */}
        <div className="dashboard-card">
          <h5>Ventas por vendedor</h5>
          <div style={{ height: "300px", position: "relative" }}>
            <Bar 
              data={{
                labels: salesBySeller.map(s => s.seller),
                datasets: [{
                  label: "Total de ventas",
                  data: salesBySeller.map(s => Number(s.total_sales)),
                  backgroundColor: "#8B5CF6",
                  tension: 0.4,
                  fill: true
                }]
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Ventas por mes */}
        <div className="dashboard-card">
          <h5>Ventas por mes</h5>
          <div style={{ height: "300px", position: "relative" }}>
            <Line
              data={{
                labels: salesByMonth.map(s => s.month),
                datasets: [{
                  label: "Ventas mensuales",
                  data: salesByMonth.map(s => Number(s.total_sales)),
                  backgroundColor: "#f39300",
                  tension: 0.4,
                  fill: true
                }]
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  )
};