import "./CarCard.css";

export default function CarCard({ name, fuel, transmission, price, image, mode = "buy", onClick }) {
  return (
    <div className={`carCard carCard--${mode}`} onClick={onClick}>
      <div className={`tag ${mode === "buy" ? "sale" : "rent"}`}>
        {mode === "buy" ? "Sale" : "Rent"}
      </div>

      <img src={image} alt={name} draggable={false} />

      <div className="cardBody">
        <h3>{name}</h3>
        <p className="desc">{[fuel, transmission].filter(Boolean).join(", ") || "Details on request"}</p>
        <div className="specs">
          <div className="fuel">⛽ {fuel || "—"}</div>
          <div className="gear">⚙ {transmission || "—"}</div>
        </div>
        <div className="bottomRow">
          <div className="price">{price}</div>
          <div className="detail">view detail →</div>
        </div>
      </div>
    </div>
  );
}
