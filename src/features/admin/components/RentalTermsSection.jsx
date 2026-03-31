function RentalTermsSection({ termsText = "Please read Term and Conditions", rows = 7 }) {
  return (
    <>
      <div className="admin-terms-text">{termsText}</div>

      <div className="admin-section-button">
        <button className="admin-section-button__inner">
          Car Rental Terms and Conditions
        </button>
      </div>

      <div className="admin-line-table">
        <div className="admin-line-table__box">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="admin-line-table__row" />
          ))}
        </div>
      </div>
    </>
  );
}

export default RentalTermsSection;