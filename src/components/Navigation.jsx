import React from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "24px" }}>Welcome to My Events App</h2>
        <p style={{ fontSize: "16px" }}>Explore upcoming events and more!</p>

        <ul>
          <li>
            <Link to="/events" style={{ color: "blue", fontSize: "18px" }}>
              Events
            </Link>
          </li>
          <li>
            <Link to="/event/1" style={{ color: "blue", fontSize: "18px" }}>
              Event
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
