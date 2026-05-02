import React from "react";
import { useNavigate } from "react-router-dom";
import "./EasyRental.css";
import { useLanguage } from "../context/LanguageContext";

export default function EasyRental() {
  const { t }  = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="easyRentalSection">

      <div className="easyRentalHeader">
        <h2>{t("er_title")}</h2>
        <p>{t("er_sub")}</p>
      </div>

      <div className="easyCard">

        <div className="stepsRow">

          <div className="stepsGroup">

            <div className="stepBox active">
              <span>{t("er_step")} 1</span>
              <strong>1</strong>
              <em>{t("er_step1_label")}</em>
            </div>

            <div className="stepBox">
              <span>{t("er_step")} 2</span>
              <strong>2</strong>
              <em>{t("er_step2_label")}</em>
            </div>

            <div className="stepBox">
              <span>{t("er_step")} 3</span>
              <strong>3</strong>
              <em>{t("er_step3_label")}</em>
            </div>

          </div>

          <button className="btn-primary" onClick={() => navigate("/showroom")}>
            {t("er_rent_btn")}
          </button>

        </div>

        <div className="divider"></div>

        <div className="loginArea">

          <h4>{t("er_login_h")}</h4>

          <p>{t("er_login_p")}</p>

          <button className="btn-secondary" onClick={() => navigate("/signup")}>
            {t("er_signup")}
          </button>

          <div className="loginHint">
            {t("er_logged")}
          </div>

          <div className="nextStep">
            {t("er_next")}
          </div>

        </div>

      </div>

      <div className="easyFooter">
        {t("er_badge")}
      </div>

    </section>
  );
}
