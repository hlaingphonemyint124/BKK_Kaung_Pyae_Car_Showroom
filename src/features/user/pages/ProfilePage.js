import React, { useEffect, useState, useCallback } from "react";
import AuthHeader from "../../auth/components/AuthHeader";
import "../../auth/styles/AuthStyles.css";
import "../styles/UserStyles.css";
import { getProfile, updateProfile } from "../service/profileService";

import ProfileItem from "../components/ProfileItem";
import Toast from "../../../components/Toast";
import Spinner from "../../../components/Spinner";

import { FaUser, FaPhoneAlt, FaSave, FaTimes } from "react-icons/fa";
import { SiGmail, SiLine } from "react-icons/si";

function ProfilePage() {
  const [editingField, setEditingField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const closeToast = useCallback(() => setToast(null), []);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    line_contact: "",
  });

  const [backupProfile, setBackupProfile] = useState(profile);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        setProfile({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          line_contact: data.line_contact || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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
      const updatedProfile = await updateProfile({
        full_name: profile.full_name,
        phone: profile.phone || null,
        line_contact: profile.line_contact || null,
      });

      setProfile((prev) => ({
        ...prev,
        ...updatedProfile,
      }));

      setEditingField(null);
      setToast({ message: "Profile updated successfully", type: "success" });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setToast({ message: "Failed to update profile", type: "error" });
    }
  };

  if (loading) {
    return (
      <AuthHeader>
        <div className="user-content-box">
          <Spinner size="lg" />
        </div>
      </AuthHeader>
    );
  }

  return (
    <AuthHeader>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
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
          editing={false}
          onChange={handleChange}
          onEditClick={null}
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
          label="Line"
          name="line_contact"
          icon={<SiLine className="icon red-icon" />}
          value={profile.line_contact}
          editing={editingField === "line_contact"}
          onChange={handleChange}
          onEditClick={() => handleEdit("line_contact")}
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