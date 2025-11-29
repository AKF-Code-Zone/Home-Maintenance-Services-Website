import React from "react";
import { FaUsers, FaUserTie, FaGlobeAsia, FaChartLine } from "react-icons/fa";
import "../App.css";

function About(){
  return (
    <>
      
    {/* Section 1: Who We Are */}
      <section className="who-we-are">
        <h2>Who We Are</h2>
        <p className="who-description">
          Urban Elite is Asia's largest online home services platform. We're on a mission
          to empower millions of service professionals by connecting them with millions
          of customers looking for quality services.
        </p>

        <div className="who-cards">
          <div className="who-card">
            <FaUsers className="who-icon" />
            <h3>48,000+</h3>
            <p>Active Service Professionals</p>
          </div>

          <div className="who-card">
            <FaUserTie className="who-icon" />
            <h3>13 Million+</h3>
            <p>Consumers</p>
          </div>

          <div className="who-card">
            <FaGlobeAsia className="who-icon" />
            <h3>59</h3>
            <p>Cities</p>
          </div>

          <div className="who-card">
            <FaChartLine className="who-icon" />
            <h3>4</h3>
            <p>Countries</p>
          </div>
        </div>
      </section>

      {/* Section 1: Our Story */}
      <section className="about-story">
        <div className="story-container">
          <div className="story-image">
            <img src="/images/story.jpg" alt="Our Story" />
          </div>
          <div className="story-text">
            <h2>Our Story</h2>
            <p>
              Founded in 2014, Urban Elite (formerly Urban Company) set out to solve
              the trust deficit in the home services sector. What started as a platform
              to connect customers with reliable service professionals has now
              transformed into a full-stack managed marketplace.
            </p>
            <p>
              We’ve built technology that enables service professionals to grow their
              businesses while delivering standardized, high-quality services to
              customers.
            </p>
            <p>
              Today, we’re present in multiple countries across Asia and the Middle East,
              serving millions of customers with hundreds of services.
            </p>
          </div>
        </div>
      </section>

  {/* Section 2: Our Professional Team */}
      <section className="professional-team">
        <h2>Our Professional Team</h2>
        <p className="team-subtitle">
          Meet the passionate leaders who drive our mission and innovation every day.
        </p>

        <div className="team-grid">
          <div className="member-card">
            <img src="/images/member1.jpg" alt="Eline kew" />
            <h3>Eline kew</h3>
            <p className="role">Co-Founder & CEO</p>
            <div className="social-icons">
              <i className="fab fa-linkedin"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>

          <div className="member-card">
            <img src="/images/member2.jpg" alt="Dina silu" />
            <h3>Dina silu</h3>
            <p className="role">Co-Founder & CTO</p>
            <div className="social-icons">
              <i className="fab fa-linkedin"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>

          <div className="member-card">
            <img src="/images/member3.jpg" alt="Ristu neli" />
            <h3>Ristu neli</h3>
            <p className="role">Chief Operating Officer</p>
            <div className="social-icons">
              <i className="fab fa-linkedin"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>

          <div className="member-card">
            <img src="/images/member4.jpg" alt="Alex Ford" />
            <h3>Alex Ford</h3>
            <p className="role">Chief Marketing Officer</p>
            <div className="social-icons">
              <i className="fab fa-linkedin"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>

          <div className="member-card">
            <img src="/images/techLead.jpg" alt="Sophie Turner" />
            <h3>Sophie Turner</h3>
            <p className="role">Head of HR</p>
            <div className="social-icons">
              <i className="fab fa-linkedin"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>

          <div className="member-card">
            <img src="/images/member6.jpg" alt="Daniel Lee" />
            <h3>Daniel Lee</h3>
            <p className="role">Finance Director</p>
            <div className="social-icons">
              <i className="fab fa-linkedin"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Investors & Values */}
      <section className="investors-values">
        <h2>Our Investors</h2>
        <div className="investors-row">
          <div className="investor-box blue">Steadview Capital</div>
          <div className="investor-box purple">Vy Capital</div>
          <div className="investor-box orange">Tiger Global</div>
          <div className="investor-box red">Accel</div>
          <div className="investor-box green">Elevation Capital</div>
        </div>

        <h2 className="values-title">Our Values</h2>
<div className="values-row">
  <div className="value-card">
    <i className="fa-solid fa-heart value-icon"></i>
    <h3>Customer First</h3>
    <p>
      We obsess over customer experience and measure our success by customer
      satisfaction.
    </p>
  </div>

  <div className="value-card">
    <i className="fa-solid fa-hand-holding-heart value-icon"></i>
    <h3>Ownership</h3>
    <p>
      We act like owners – we're accountable for our results and take pride in our work.
    </p>
  </div>

  <div className="value-card">
    <i className="fa-solid fa-star value-icon"></i>
    <h3>Excellence</h3>
    <p>
      We strive for excellence in everything we do, setting high standards for ourselves.
    </p>
  </div>
  
  <div className="value-card">
    <i className="fa-solid fa-eye value-icon"></i>
    <h3>Transparency</h3>
    <p>
      We believe in open communication and honest feedback at all levels.
    </p>
  </div>
   
  <div className="value-card">
    <i className="fa-solid fa-lightbulb value-icon"></i>
    <h3>Innovation</h3>
    <p>
      We challenge the status quo and continuosuly look for the better way to solve problems.
    </p>
  </div>
  
  <div className="value-card">
    <i className="fa-solid fa-rocket value-icon"></i>
    <h3>Collaboration</h3>
    <p>
      We work together across teams to achieve our common goals.
    </p>
  </div>

  </div>
      </section>
    </>
  );
};

export default About;