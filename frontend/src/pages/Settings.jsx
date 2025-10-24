import React, { useState } from "react";
import { Link } from "react-router-dom";

const INITIAL_PROFILE = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "08150411479",
  avatar: "🧑", // placeholder emoji, replace with actual image
};

const SECURITY_SETTINGS = {
  emailNotifications: true,
  smsNotifications: true,
  twoFactorAuth: false,
  transactionPin: true,
};

const THEMES = [
  { id: "light", name: "Light", icon: "☀️" },
  { id: "dark", name: "Dark", icon: "🌙" },
  { id: "system", name: "System", icon: "💻" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [security, setSecurity] = useState(SECURITY_SETTINGS);
  const [theme, setTheme] = useState("system");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track form changes
  const [formProfile, setFormProfile] = useState(profile);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setProfile(formProfile);
    setIsEditing(false);
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
    alert("Password updated successfully");
  };

  const handleSecurityToggle = (key) => {
    setSecurity(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl">
            {profile.avatar}
          </div>
          {isEditing && (
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Change Photo
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">First Name</label>
            <input
              type="text"
              value={formProfile.firstName}
              onChange={(e) =>
                setFormProfile({ ...formProfile, firstName: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Last Name</label>
            <input
              type="text"
              value={formProfile.lastName}
              onChange={(e) =>
                setFormProfile({ ...formProfile, lastName: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Email</label>
            <input
              type="email"
              value={formProfile.email}
              onChange={(e) =>
                setFormProfile({ ...formProfile, email: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Phone</label>
            <input
              type="tel"
              value={formProfile.phone}
              onChange={(e) =>
                setFormProfile({ ...formProfile, phone: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={() => handleSecurityToggle("twoFactorAuth")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                security.twoFactorAuth ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  security.twoFactorAuth ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">Transaction PIN</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Require PIN for all transactions
              </p>
            </div>
            <button
              onClick={() => handleSecurityToggle("transactionPin")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                security.transactionPin ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  security.transactionPin ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">Email Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive transaction alerts via email
              </p>
            </div>
            <button
              onClick={() => handleSecurityToggle("emailNotifications")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                security.emailNotifications ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  security.emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive transaction alerts via SMS
              </p>
            </div>
            <button
              onClick={() => handleSecurityToggle("smsNotifications")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                security.smsNotifications ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  security.smsNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="grid grid-cols-3 gap-4">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-xl border ${
                theme === t.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700"
              } text-center`}
            >
              <div className="text-2xl mb-2">{t.icon}</div>
              <div className="text-sm font-medium">{t.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Language</h2>
        <select
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
          defaultValue="en"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Link
            to="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-100 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "profile"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "security"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600"
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "preferences"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent hover:text-blue-600"
                }`}
              >
                Preferences
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "preferences" && renderPreferencesTab()}
          </div>
        </div>
      </div>
    </div>
  );
}