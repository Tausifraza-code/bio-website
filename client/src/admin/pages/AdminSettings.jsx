import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  Settings,
  LockKeyhole,
  Globe,
  Mail,
  Phone,
  Save,
  Loader2,
  Upload,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import {
  fetchAdminGeneralSettings,
  fetchPublicBranding,
  updateAdminGeneralSettings,
  changeAdminPassword,
  uploadAdminWebsiteLogo,
} from "../../redux/slice/adminSlice";

const defaultSettings = {
  websiteName: "",
  websiteLogo: "",
  websiteUrl: "",
  supportEmail: "",
  supportPhone: "",
  defaultTimezone: "Asia/Kolkata",
};

const AdminSettings = () => {
  const dispatch = useDispatch();

  const [settings, setSettings] = useState(defaultSettings);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await dispatch(fetchAdminGeneralSettings()).unwrap();

        setSettings({
          ...defaultSettings,
          ...result,
        });
      } catch (error) {
        toast.error(error || "Unable to load settings.");
      } finally {
        setLoadingSettings(false);
      }
    };

    loadSettings();
  }, [dispatch]);

  const handleSettingsChange = (event) => {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveSettings = async (event) => {
    event.preventDefault();

    setSavingSettings(true);

    try {
      const result = await dispatch(
        updateAdminGeneralSettings(settings),
      ).unwrap();

      setSettings({
        ...defaultSettings,
        ...result.settings,
      });

      toast.success(result.message || "General settings saved successfully.");
    } catch (error) {
      toast.error(error || "Unable to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleWebsiteLogoUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLogoUploading(true);

      const result = await dispatch(uploadAdminWebsiteLogo(formData)).unwrap();

      setSettings((previous) => ({
        ...previous,
        websiteLogo: result.imageUrl,
      }));
      await dispatch(fetchPublicBranding());

      toast.success("Website logo uploaded successfully.");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Logo upload failed.");
    } finally {
      setLogoUploading(false);
      event.target.value = "";
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const result = await dispatch(changeAdminPassword(passwordData)).unwrap();

      toast.success(result.message || "Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error || "Unable to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-[#101e30] dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

  const sectionClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-[#0b1728]";

  const togglePasswordVisibility = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const PasswordField = ({ label, name, visibilityKey }) => (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="relative">
        <input
          type={showPasswords[visibilityKey] ? "text" : "password"}
          name={name}
          value={passwordData[name]}
          onChange={handlePasswordChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          autoComplete="new-password"
          className={`${inputClass} pr-12`}
        />

        <button
          type="button"
          onClick={() => togglePasswordVisibility(visibilityKey)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500"
          aria-label={`Toggle ${label} visibility`}
        >
          {showPasswords[visibilityKey] ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );

  if (loadingSettings) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* PAGE HEADER */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Settings size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your website settings and admin security.
            </p>
          </div>
        </div>
      </div>

      {/* GENERAL SETTINGS */}
      <section className={sectionClass}>
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Globe size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              General Settings
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure your website information.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Website Name</label>
              <input
                type="text"
                name="websiteName"
                value={settings.websiteName}
                onChange={handleSettingsChange}
                placeholder="BIO Website"
                maxLength={150}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Website URL</label>
              <input
                type="url"
                name="websiteUrl"
                value={settings.websiteUrl}
                onChange={handleSettingsChange}
                placeholder="https://example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Support Email</label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleSettingsChange}
                  placeholder="support@example.com"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Support Phone</label>
              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="tel"
                  name="supportPhone"
                  value={settings.supportPhone}
                  onChange={handleSettingsChange}
                  placeholder="+91 9876543210"
                  maxLength={30}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Website Logo
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  {settings.websiteLogo ? (
                    <img
                      src={settings.websiteLogo}
                      alt="Website Logo"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No Logo</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 ${
                      logoUploading ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    {logoUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        {settings.websiteLogo ? "Change Logo" : "Upload Logo"}
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleWebsiteLogoUpload}
                      disabled={logoUploading}
                    />
                  </label>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG, JPEG or WEBP. Maximum size: 5 MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Default Timezone</label>
              <select
                name="defaultTimezone"
                value={settings.defaultTimezone}
                onChange={handleSettingsChange}
                className={inputClass}
              >
                <option value="Asia/Kolkata">Asia/Kolkata (India)</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="submit"
              disabled={savingSettings}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingSettings ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {savingSettings ? "Saving..." : "Save General Settings"}
            </button>
          </div>
        </form>
      </section>

      {/* CHANGE PASSWORD */}
      <section className={sectionClass}>
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <LockKeyhole size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Change Password
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update your administrator account password.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <PasswordField
                label="Current Password"
                name="currentPassword"
                visibilityKey="current"
              />
            </div>

            <PasswordField
              label="New Password"
              name="newPassword"
              visibilityKey="new"
            />

            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              visibilityKey="confirm"
            />
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
              Use a strong password with at least 8 characters. Your current
              password is required to authorize this change.
            </p>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="submit"
              disabled={changingPassword}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changingPassword ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <LockKeyhole size={17} />
              )}
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AdminSettings;
