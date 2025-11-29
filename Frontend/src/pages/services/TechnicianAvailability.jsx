import React, { useState } from "react";
import "../../App.css";

const technicians = [
  {
    name: "Ali Khan",
    service: "Plumbing",
    status: "Available",
    contact: "0300-1234567",
    nextAvailable: "Immediately",
  },
  {
    name: "Sara Ahmed",
    service: "Electrical",
    status: "On Job",
    contact: "0312-7654321",
    nextAvailable: "2 hours",
  },
  {
    name: "Usman Riaz",
    service: "AC Repair",
    status: "Scheduled",
    contact: "0321-9876543",
    nextAvailable: "Tomorrow 10:00 AM",
  },
  {
    name: "Hina Malik",
    service: "Carpentry",
    status: "Available",
    contact: "0305-1122334",
    nextAvailable: "Immediately",
  },
  {
    name: "Bilal Shah",
    service: "Painting",
    status: "On Job",
    contact: "0333-4455667",
    nextAvailable: "1.5 hours",
  },
];

const TechnicianAvailability = () => {
  const [filter, setFilter] = useState("All");

  const filteredTechs =
    filter === "All"
      ? technicians
      : technicians.filter((tech) => tech.status === filter);

  return (
    <section className="technician-section">
      <div className="technician-container">
        <div className="technician-image">
          <img
            src="/images/technician.jpg"
            alt="Technician Availability"
            className="technician-img"
          />
        </div>

        <div className="technician-content">
          <h2>Technician Availability Checker</h2>
          <p>
            Check which service professionals are currently free, on a job, or scheduled.
            Hover over a technician to see contact info and next available time.
          </p>

          {/* Filter Dropdown */}
          <div className="filter-dropdown">
            <label htmlFor="statusFilter">Filter by status: </label>
            <select
              id="statusFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="On Job">On Job</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          {/* Status Legend */}
          <div className="status-legend">
            <div className="legend-item">
              <span className="status-circle status-available"></span> Available
            </div>
            <div className="legend-item">
              <span className="status-circle status-onjob"></span> On Job
            </div>
            <div className="legend-item">
              <span className="status-circle status-scheduled"></span> Scheduled
            </div>
          </div>

          {/* Technician Table */}
          <div className="availability-table">
            {filteredTechs.map((tech, index) => (
              <div key={index} className="availability-row">
                <div className="tech-name">{tech.name}</div>
                <div className="tech-service">{tech.service}</div>
                <div
                  className={`tech-status ${
                    tech.status === "Available"
                      ? "status-available"
                      : tech.status === "On Job"
                      ? "status-onjob"
                      : "status-scheduled"
                  }`}
                >
                  {tech.status}
                  <span className="tooltip">
                    <strong>Contact:</strong> {tech.contact} <br />
                    <strong>Next Available:</strong> {tech.nextAvailable}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicianAvailability;