import React, { useState } from "react";
import AuthHeader from "../../auth/components/AuthHeader";
import "../../auth/styles/AuthStyles.css";
import "../styles/UserStyles.css";

import ProfileItem from "../components/ProfileItem";
import {
  FaUser,
  FaPhoneAlt,
  FaSave,
  FaTimes,
  FaCity,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaLocationDot, FaGlobe } from "react-icons/fa6";

function ProfilePage() {
  const [editingField, setEditingField] = useState(null);

  const [profile, setProfile] = useState({
    full_name: "Kyaw Kyaw",
    email: "kyawkyaw123@gmail.com",
    phone: "+66 9xxxxxxx",
    address_line: "Bangkok",
    city: "Bangkok",
    country: "Thailand",
  });

  const [backupProfile, setBackupProfile] = useState(profile);

  const handleChange = (name, value) => {
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (field) => {
    setBackupProfile(profile);
    setEditingField(field);
  };

  const handleCancel = () => {
    setProfile(backupProfile);
    setEditingField(null);
  };

  const handleSave = async () => {
    try {
      const payload = {
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        address_line: profile.address_line,
        city: profile.city,
        country: profile.country,
      };

      console.log("Send to backend:", payload);

      // Later connect backend:
      // await updateMyCustomerProfile(payload);

      setEditingField(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <AuthHeader>
      <div className="user-content-box">
        <div className="profile-avatar">
          <FaUser />
        </div>

        <h2 className="user-page-title">Profile Details</h2>

        <ProfileItem
          label="Name"
          name="full_name"
          icon={<FaUser className="icon red-icon" />}
          value={profile.full_name}
          editing={editingField === "full_name"}
          onChange={handleChange}
          onEditClick={() => handleEdit("full_name")}
        />

        <ProfileItem
          label="Gmail"
          name="email"
          icon={<SiGmail className="icon gmail-icon" />}
          value={profile.email}
          editing={editingField === "email"}
          onChange={handleChange}
          onEditClick={() => handleEdit("email")}
        />

        <ProfileItem
          label="Phone"
          name="phone"
          icon={<FaPhoneAlt className="icon red-icon" />}
          value={profile.phone}
          editing={editingField === "phone"}
          onChange={handleChange}
          onEditClick={() => handleEdit("phone")}
        />

        <ProfileItem
          label="Address"
          name="address_line"
          icon={<FaLocationDot className="icon red-icon" />}
          value={profile.address_line}
          editing={editingField === "address_line"}
          onChange={handleChange}
          onEditClick={() => handleEdit("address_line")}
        />

        <ProfileItem
          label="City"
          name="city"
          icon={<FaCity className="icon red-icon" />}
          value={profile.city}
          editing={editingField === "city"}
          onChange={handleChange}
          onEditClick={() => handleEdit("city")}
        />

        <ProfileItem
          label="Country"
          name="country"
          icon={<FaGlobe className="icon red-icon" />}
          value={profile.country}
          editing={editingField === "country"}
          onChange={handleChange}
          onEditClick={() => handleEdit("country")}
        />

        {editingField && (
          <div className="profile-actions">
            <button type="button" className="profile-save-btn" onClick={handleSave}>
              <FaSave />
              Save
            </button>

            <button type="button" className="profile-cancel-btn" onClick={handleCancel}>
              <FaTimes />
              Cancel
            </button>
          </div>
        )}
      </div>
    </AuthHeader>
  );
}

export default ProfilePage;