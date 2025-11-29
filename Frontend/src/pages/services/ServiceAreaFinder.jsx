import React, { useState } from "react";
import "../../App.css";

const areas = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
];

const ServiceAreaFinder = () => {
  const [location, setLocation] = useState("");
  const [filteredAreas, setFilteredAreas] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    if (value) {
      const filtered = areas.filter((area) =>
        area.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAreas(filtered);
    } else {
      setFilteredAreas([]);
    }
  };

  const handleSelect = (area) => {
    setLocation(area);
    setFilteredAreas([]);
  };

  return (
    <section className="service-area-section">
      <div className="service-area-container">
        <div className="service-area-content">
          <h2>
            Service Area Finder <span>HoneFix</span>
          </h2>
          <p>
            Find the nearest technicians or service providers in your area. Enter your city or postal code below to explore available services and estimated travel times.
          </p>

          <div className="service-search">
            <div className="input-dropdown">
              <input
                type="text"
                placeholder="Enter city or postal code"
                className="service-input"
                value={location}
                onChange={handleChange}
              />
              {filteredAreas.length > 0 && (
                <ul className="dropdown-list">
                  {filteredAreas.map((area, index) => (
                    <li key={index} onClick={() => handleSelect(area)}>
                      {area}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="service-area-btn">Search</button>
          </div>
        </div>

        <div className="service-area-map">
          <div className="map-container">
            <img
              src="/images/servicemap.jpg"
              alt="Service Area Map"
              className="service-map-img"
            />

            {/* Map Markers with Pulse */}
            <div className="map-marker pulse" style={{ top: "30%", left: "25%" }}>
              <span className="marker-tooltip">Karachi Service</span>
            </div>
            <div className="map-marker pulse" style={{ top: "50%", left: "60%" }}>
              <span className="marker-tooltip">Lahore Service</span>
            </div>
            <div className="map-marker pulse" style={{ top: "70%", left: "40%" }}>
              <span className="marker-tooltip">Islamabad Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaFinder;