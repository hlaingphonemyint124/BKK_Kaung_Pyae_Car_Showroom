import React from "react";
import "./Testimonials.css";

const data = [
  {
    name: "Steven",
    car: "Honda Civic",
    text: "The service was excellent. The car was exactly as described and the rental process was very smooth.",
    rating: 5
  },
  {
    name: "John",
    car: "Toyota Yaris",
    text: "Smooth rental process and easy communication with the team.",
    rating: 5
  },
  {
    name: "Megan",
    car: "MG",
    text: "Rental prices are reasonable here. The pickup and return were super easy.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials">

      <h2 className="testimonial-title">
        What Our<br/>Customers Say
      </h2>

      {data.map((t, i) => (
        <div key={i} className="testimonial-card">

          <div className="testimonial-avatar">
            <div className="avatar"></div>
            <div className="avatar-tag">customer</div>
          </div>

          <div className="testimonial-content">
            <div className="testimonial-header">
              <div>
                <div className="name">{t.name}</div>
                <div className="car">{t.car}</div>
              </div>

              <div className="stars">
                {"★".repeat(t.rating)}
              </div>
            </div>

            <p className="text">{t.text}</p>

          </div>

          
        </div>
      ))}

      <div className="testimonial-dots">
  <span className="active"></span>
  <span></span>
  <span></span>
</div>

      <p className="testimonial-footer">
        • Premium car rental and showroom service built on trust, quality, and simplicity.
      </p>


    </section>
  );
}