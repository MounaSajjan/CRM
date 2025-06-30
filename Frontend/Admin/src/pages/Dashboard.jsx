// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import MainLayout from "../components/Layout";
import styles from "../styles/Dashboard.module.css";
import { Bar } from "react-chartjs-2";
import API from "../utils/axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("/api/employees/all");
        setEmployees(res.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Conversion Rate %",
        data: [12, 19, 32, 27, 38],
        backgroundColor: "#007bff",
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <MainLayout showSearch={false}>
      <div className={styles.dashboardContainerFull}>
        {/* Example Cards */}
        <div className={styles.cardRow}>
          <div className={styles.card}><h3>Unassigned Leads</h3><p>12</p></div>
          <div className={styles.card}><h3>Assigned This Week</h3><p>24</p></div>
          <div className={styles.card}><h3>Active Salespeople</h3><p>5</p></div>
          <div className={styles.card}><h3>Conversion Rate</h3><p>32%</p></div>
        </div>

        {/* Bar Chart + Activity */}
        <div className={styles.bottomSection}>
          <div className={styles.analyticsSmall}>
            <h3>Sales Analytics</h3>
            <div className={styles.chartContainer}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className={styles.activityBox}>
            <h3>Sales Activity</h3>
            <ul className={styles.activityList}>
              <li>✅ You assigned a lead to Priya – 1 hour ago</li>
              <li>🎯 Jay closed a deal – 2 hours ago</li>
              <li>📞 Client call scheduled – 3 hours ago</li>
            </ul>
          </div>
        </div>

        {/* ✅ Employee Table (Dynamic) */}
        <div className={styles.employeeTableSection}>
          <h3>Employee Data</h3>
          <table className={styles.employeeTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Employee ID</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Closed</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.firstName} {emp.lastName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.employeeId}</td>
                    <td style={{
                      color: emp.status === "Active" ? "green" : "red",
                      fontWeight: "bold",
                    }}>
                      {emp.status}
                    </td>
                    <td>{emp.assignedLeads || 0}</td>
                    <td>{emp.closedLeads || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
