import React from "react";
import "../App.css";

function Home() {
  return (
    <div className="home-container">

      {/*Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Reliable Home Maintenance Services Near You</h1>
          <p>
            Find trusted plumbers, electricians, cleaners, and more — all in one directory.
          </p>
          <button className="cta-btn">Get Started</button>
        </div>
        <div className="hero-image">
          {/* hero.jpg */}
          <img src="/images/home.jpg" alt="Home maintenance" />
        </div>
      </section>

      {/* Service Categories */}
      <section className="services">
        <h2>Professional Services</h2>

        <div className="service-grid">
          {/* Row 1 */}
          <div className="service-card">
            <img src="/images/plumber.jpg" alt="Plumbing" />
            <h3>Plumbing</h3>
          </div>
          <div className="service-card">
            <img src="/images/electrician.jpg" alt="Electrical" />
            <h3>Electrical</h3>
          </div>
          <div className="service-card">
            <img src="/images/painting.jpg" alt="Painting" />
            <h3>Painting</h3>
          </div>
          <div className="service-card">
            <img src="/images/cleaning.jpg" alt="Cleaning" />
            <h3>Cleaning</h3>
          </div>

          {/* Row 2 */}
          <div className="service-card">
            <img src="/images/carpentry.jpg" alt="Carpentry" />
            <h3>Carpentry</h3>
          </div>
          <div className="service-card">
            <img src="/images/pest.jpg" alt="Pest Control" />
            <h3>Pest Control</h3>
          </div>
          <div className="service-card">
            <img src="/images/gardening.jpg" alt="Gardening" />
            <h3>Gardening</h3>
          </div>
          <div className="service-card">
            <img src="/images/appliance.jpg" alt="Appliance Repair" />
            <h3>Appliance Repair</h3>
          </div>

          {/* Row 3 */}
          <div className="service-card">
            <img src="/images/flooring.jpg" alt="Flooring" />
            <h3>Flooring</h3>
          </div>
          <div className="service-card">
            <img src="/images/ac.jpg" alt="AC Service" />
            <h3>AC Service</h3>
          </div>
          <div className="service-card">
            <img src="/images/roofing.jpg" alt="Roofing" />
            <h3>Roofing</h3>
          </div>
          <div className="service-card">
            <img src="/images/moving.jpg" alt="Moving Help" />
            <h3>Moving Help</h3>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <img src="/images/search.jpg" alt="Search service" />
            <h3>1. Search</h3>
            <p>Browse services in your area from verified professionals.</p>
          </div>
          <div className="step">
            <img src="/images/compare.jpg" alt="Compare professionals" />
            <h3>2. Compare</h3>
            <p>Check ratings, reviews, and pricing before choosing.</p>
          </div>
          <div className="step">
            <img src="/images/book.jpg" alt="Book service" />
            <h3>3. Book</h3>
            <p>Book instantly and enjoy hassle-free home maintenance.</p>
          </div>
        </div>
      </section>


      {/* 🏡 HOME SERVICES AT YOUR DOORSTEP */}
      <section className="doorstep-section">
        <h2 className="doorstep-heading">Home services at your doorstep</h2>
        <div className="doorstep-container">
          {/* LEFT: Icon Grid */}
          <div className="doorstep-grid">
            <div className="doorstep-card">
              <div className="icon-circle"><img src="/images/salon-icon.png" alt="Salon" /></div>
              <p>Salon</p>
            </div>
            <div className="doorstep-card">
              <div className="icon-circle"><img src="/images/Hair-icon.png" alt="Hair" /></div>
              <p>Hair</p>
            </div>
            <div className="doorstep-card">
              <div className="icon-circle"><img src="/images/grooming-icon.jpg" alt="Grooming" /></div>
              <p>Grooming</p>
            </div>
            <div className="doorstep-card">
              <div className="icon-circle"><img src="/images/cleaning7.png" alt="Cleaning" /></div>
              <p>Cleaning</p>
            </div>
            <div className="doorstep-card">
              <div className="icon-circle"><img src="/images/repair-icon.jpg" alt="Repairs" /></div>
              <p>Repairs</p>
            </div>
            <div className="doorstep-card">
              <div className="icon-circle"><img src="/images/plumber2.png" alt="Plumber" /></div>
              <p>Plumber</p>
            </div>
          </div>

          {/* RIGHT: 4 Images */}
          <div className="doorstep-images">
            <img src="/images/service1.jpg" alt="Service 1" />
            <img src="/images/service2.jpg" alt="Service 2" />
            <img src="/images/service3.jpg" alt="Service 3" />
            <img src="/images/service4.jpg" alt="Service 4" />
          </div>
        </div>
      </section>

      {/* 🛋 Home Painting Banner */}
      <section className="home-painting">
        <div className="painting-content">
          <div className="painting-text">
            <h2>Give your space the<br />glow-up it deserves</h2>
            <p>Home painting</p>
            <button className="buy-btn">Buy now</button>
          </div>
          <div className="painting-image">
            <img src="/images/sofa.jpg" alt="Home painting" />
          </div>
        </div>
      </section>

      {/* 4️⃣ Featured Professionals */}
      <section className="featured">
        <h2>Featured Professionals</h2>

        <div className="featured-grid">

          <div className="pro-card">
            <img src="/images/pro1.jpg" alt="John’s Plumbing Co." />
            <h3>John’s Plumbing Co.</h3>
            <p>Plumbing</p>
            <button className="view-btn">View Profile</button>
          </div>

          <div className="pro-card">
            <img src="/images/electricians.jpg" alt="Bright Electricians" />
            <h3>Bright Electricians</h3>
            <p>Electrical</p>
            <button className="view-btn">View Profile</button>
          </div>

          <div className="pro-card">
            <img src="/images/pro3.jpg" alt="PureClean Services" />
            <h3>PureClean Services</h3>
            <p>Cleaning</p>
            <button className="view-btn">View Profile</button>
          </div>

        </div>
      </section>

      {/* 5️⃣ Testimonials */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>“Super quick service and polite staff! Highly recommended.”</p>
            <h4>- Sarah K.</h4>
          </div>
          <div className="testimonial">
            <p>“Found a great electrician in minutes. So convenient!”</p>
            <h4>- David P.</h4>
          </div>
          <div className="testimonial">
            <p>“Reliable and affordable. My go-to home maintenance platform.”</p>
            <h4>- Ayesha M.</h4>
          </div>
        </div>
      </section>

      {/* 6️⃣ CTA Section */}
      <section className="cta">
        <h2>Ready to Book a Service?</h2>
        <p>Get your home fixed by professionals today.</p>
        <button className="cta-btn">Book Now</button>
      </section>
    </div>
  );
}

export default Home;

