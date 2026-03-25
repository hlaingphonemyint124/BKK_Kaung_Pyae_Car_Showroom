import React from "react";
import AuthHeader from "../../auth/components/AuthHeader";
import "../../auth/styles/AuthStyles.css";
import "../styles/UserStyles.css";
import ProfileItem from "../components/ProfileItem";
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import { SiLine, SiGmail } from "react-icons/si";

function ProfilePage() {
  return (
    <AuthHeader>
      <div className="user-content-box">
        <div className="profile-avatar">
          <FaUser />
        </div>

        <h2 className="user-page-title">Profile Details</h2>

        <ProfileItem
          label="Name"
          icon={<FaUser className="icon red-icon" />}
          value="Kyaw Kyaw"
        />

        <ProfileItem
          label="Line"
          icon={<SiLine className="icon line-icon" />}
          value="kyawkyaw.line"
        />

        <ProfileItem
          label="Gmail"
          icon={<SiGmail className="icon gmail-icon" />}
          value="kyawkyaw123@gmail.com"
        />

        <ProfileItem
          label="Phone"
          icon={<FaPhoneAlt className="icon red-icon" />}
          value="+66 9xxxxxxx"
        />
      </div>
    </AuthHeader>
  );
}

export default ProfilePage;