import "./Testimonials.css";

const reviews = [
  {
    name: "Rahul & Riya",
    text:
      "Absolute magic! Every detail was handled flawlessly. Our wedding felt effortless and beautiful.",
  },
  {
    name: "Amit & Sanya",
    text:
      "Vivahasya turned our vision into reality. Calm, professional, and deeply thoughtful.",
  },
  {
    name: "Ankit & Priya",
    text:
      "A dream team. From planning to execution, everything was seamless.",
  },
  {
    name: "Arjun & Meera",
    text:
      "Their attention to detail made us feel truly special on our big day.",
  },
];

function Testimonials() {
  return (
    <section className="testimonials">
      <h2 className="testimonials-heading">What Our Couples Say</h2>

      <div className="reviews-wrapper">
        <div className="reviews-track">
          {[...reviews, ...reviews].map((review, index) => (
            <div className="review-card" key={index}>
              <p className="review-text">“{review.text}”</p>
              <span className="review-name">— {review.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
