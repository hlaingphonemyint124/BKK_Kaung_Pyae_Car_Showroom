function DashSectionHead({ title }) {
  return (
    <div className="dash-section-head">
      <span className="dash-section-head__bar" />

      <h3 className="dash-section-head__title">
        {title}
      </h3>
    </div>
  );
}

export default DashSectionHead;