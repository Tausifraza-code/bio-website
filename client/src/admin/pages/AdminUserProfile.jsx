import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchAdminUserProfile,
  updateAdminUserProfile,
  fetchAdminUserGallery,
  uploadAdminUserGallery,
  updateAdminUserGalleryImage,
  deleteAdminUserGalleryImage,
  fetchAdminUserProducts,
  createAdminUserProduct,
  updateAdminUserProduct,
  deleteAdminUserProduct,
  uploadAdminUserProfileImages,
} from "../../redux/slice/adminSlice";

const panel =
  "rounded-xl border border-slate-200 bg-white p-4 dark:border-[#294560] dark:bg-[#0b1b30] sm:p-5";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 dark:border-[#294560] dark:bg-[#142b45] dark:text-white";

const profileFields = [
  {
    title: "Personal & Business Information",
    fields: [
      ["firstName", "First Name"],
      ["lastName", "Last Name"],
      ["businessName", "Business Name"],
      ["industry", "Industry"],
      ["jobTitle", "Job Title"],
      ["headline", "Headline"],
      ["bio", "About / Bio", "textarea"],
    ],
  },
  {
    title: "Contact Information",
    fields: [
      ["phone", "Business Phone"],
      ["whatsapp", "WhatsApp Number"],
      ["email", "Business Email"],
      ["website", "Website"],
      ["websiteUrl", "Website URL"],
      ["upiId", "UPI ID"],
    ],
  },
  {
    title: "Business Address",
    fields: [
      ["shopUnit", "Shop / Unit"],
      ["area", "Area"],
      ["landmark", "Landmark"],
      ["city", "City"],
      ["state", "State"],
      ["pincode", "Pincode"],
      ["mapLink", "Map Link"],
    ],
  },
  {
    title: "Website Appearance",
    fields: [
      ["activeTheme", "Active Theme"],
      ["activeLayout", "Active Layout"],
    ],
  },
];

const allowedProfileFields = [
  "firstName",
  "lastName",
  "businessName",
  "industry",
  "jobTitle",
  "headline",
  "bio",
  "phone",
  "whatsapp",
  "email",
  "website",
  "websiteUrl",
  "shopUnit",
  "area",
  "city",
  "state",
  "pincode",
  "landmark",
  "mapLink",
  "businessHours",
  "upiId",
  "socialCards",
  "contactButtons",
  "profileImage",
  "avatar",
  "logo",
  "banner",
  "activeTheme",
  "activeLayout",
];

function Section({ title, children }) {
  return (
    <section className={panel}>
      <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  disabled = false,
  type = "text",
}) {
  const Component = multiline ? "textarea" : "input";

  return (
    <label className="block min-w-0">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <Component
        type={type}
        value={value ?? ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        rows={multiline ? 4 : undefined}
        className={`${inputClass} ${
          multiline ? "resize-y" : ""
        } disabled:cursor-not-allowed disabled:opacity-60`}
      />
    </label>
  );
}

function parseBusinessHours(value, originalValue) {
  if (!value.trim()) return "";

  if (typeof originalValue === "object" && originalValue !== null) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error("Business Hours ka JSON format valid nahi hai.");
    }
  }

  return value;
}

export default function AdminUserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [draftUser, setDraftUser] = useState({});
  const [draftProfile, setDraftProfile] = useState({});

  const [businessHoursText, setBusinessHoursText] = useState("");
  const emptySocialForm = {
    platform: "instagram",
    platformName: "",
    icon: "instagram",
    handle: "",
    audience: "",
    url: "",
    description: "",
    profileImage: "",
    thumbnail: "my-photo",
    ctaLabel: "Follow",
    verifiedTick: false,
  };
  const emptyContactForm = {
    buttonId: "",
    label: "",
    icon: "link",
    actionType: "customLink",
    enabled: true,
    order: 0,
    customUrl: "",
  };
  const [socialForm, setSocialForm] = useState(emptySocialForm);
  const [editingSocialIndex, setEditingSocialIndex] = useState(null);
  const [contactForm, setContactForm] = useState(emptyContactForm);
  const [editingContactIndex, setEditingContactIndex] = useState(null);
  const socialFormRef = useRef(null);
  const contactFormRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [pageError, setPageError] = useState("");

  const [previewVersion, setPreviewVersion] = useState(Date.now());

  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [editingGallery, setEditingGallery] = useState(null);
  const [galleryEditTitle, setGalleryEditTitle] = useState("");

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "General",
    type: "product",
    status: "active",
  });
  const [productFiles, setProductFiles] = useState([]);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await dispatch(fetchAdminUserProfile(userId)).unwrap();

      if (!response?.success || !response.user) {
        throw new Error(response?.message || "Unable to load user.");
      }

      const nextUser = response.user;
      const nextProfile = response.profile || {};

      setUser(nextUser);
      setProfile(nextProfile);

      setDraftUser({
        fullName: nextUser.fullName || "",
        email: nextUser.email || "",
        phone: nextUser.phone || "",
      });

      setDraftProfile({ ...nextProfile });

      setBusinessHoursText(
        typeof nextProfile.businessHours === "string"
          ? nextProfile.businessHours
          : JSON.stringify(nextProfile.businessHours || {}, null, 2),
      );
    } catch (error) {
      setPageError(
        typeof error === "string"
          ? error
          : error.message || "Unable to load profile.",
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, userId]);

  const loadGallery = useCallback(async () => {
    setGalleryLoading(true);

    try {
      const response = await dispatch(fetchAdminUserGallery(userId)).unwrap();

      const items = response.data || response.gallery || [];
      setGallery(Array.isArray(items) ? items : []);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to load gallery.",
      );
    } finally {
      setGalleryLoading(false);
    }
  }, [dispatch, userId]);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);

    try {
      const response = await dispatch(fetchAdminUserProducts(userId)).unwrap();

      const items = response.data || response.products || [];
      setProducts(Array.isArray(items) ? items : []);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to load products.",
      );
    } finally {
      setProductsLoading(false);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (!userId) return;

    loadProfile();
    loadGallery();
    loadProducts();
  }, [userId, loadProfile, loadGallery, loadProducts]);

  const handleGalleryUpload = async () => {
    if (!galleryFiles.length) {
      toast.error("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    galleryFiles.forEach((file) => formData.append("images", file));
    formData.append("title", galleryTitle);

    try {
      await dispatch(uploadAdminUserGallery({ userId, formData })).unwrap();

      toast.success("Gallery images uploaded successfully.");
      setGalleryFiles([]);
      setGalleryTitle("");
      await loadGallery();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Gallery upload failed.",
      );
    }
  };

  const handleGalleryUpdate = async (id) => {
    const formData = new FormData();
    formData.append("title", galleryEditTitle);

    try {
      await dispatch(
        updateAdminUserGalleryImage({ userId, id, formData }),
      ).unwrap();

      toast.success("Gallery image updated.");
      setEditingGallery(null);
      await loadGallery();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to update image.",
      );
    }
  };

  const handleGalleryDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await dispatch(deleteAdminUserGalleryImage({ userId, id })).unwrap();

      toast.success("Gallery image deleted.");
      await loadGallery();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to delete image.",
      );
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "General",
      type: "product",
      status: "active",
    });
    setProductFiles([]);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    if (!productForm.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!productForm.description.trim()) {
      toast.error("Product description is required.");
      return;
    }

    if (
      productForm.price === "" ||
      !Number.isFinite(Number(productForm.price)) ||
      Number(productForm.price) < 0
    ) {
      toast.error("Please enter a valid product price.");
      return;
    }

    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    productFiles.forEach((file) => formData.append("images", file));

    try {
      if (editingProduct) {
        await dispatch(
          updateAdminUserProduct({
            userId,
            id: editingProduct._id,
            formData,
          }),
        ).unwrap();

        toast.success("Product updated successfully.");
      } else {
        await dispatch(createAdminUserProduct({ userId, formData })).unwrap();
        toast.success("Product created successfully.");
      }

      resetProductForm();
      await loadProducts();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to save product.",
      );
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "General",
      type: product.type || "product",
      status: product.status || "active",
    });
    setProductFiles([]);
    setShowProductForm(true);
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await dispatch(deleteAdminUserProduct({ userId, id })).unwrap();

      toast.success("Product deleted successfully.");
      await loadProducts();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to delete product.",
      );
    }
  };

  const updateProfileField = (field, value) => {
    setDraftProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const addArrayItem = (field, item) => {
    setDraftProfile((previous) => ({
      ...previous,
      [field]: [...(previous[field] || []), item],
    }));
  };

  const removeArrayItem = (field, index) => {
    setDraftProfile((previous) => ({
      ...previous,
      [field]: (previous[field] || []).filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const handleSocialSubmit = (event) => {
    event.preventDefault();

    if (!socialForm.platform || !socialForm.url.trim()) {
      toast.error("Platform and Profile URL are required.");
      return;
    }

    if (editingSocialIndex !== null) {
      setDraftProfile((previous) => {
        const items = [...(previous.socialCards || [])];
        items[editingSocialIndex] = {
          ...items[editingSocialIndex],
          ...socialForm,
        };

        return { ...previous, socialCards: items };
      });

      toast.success("Social profile updated.");
    } else {
      addArrayItem("socialCards", { ...socialForm });
      toast.success("Social profile added.");
    }

    setSocialForm(emptySocialForm);
    setEditingSocialIndex(null);
  };

  const handleEditSocial = (item, index) => {
    setSocialForm({ ...emptySocialForm, ...item });
    setEditingSocialIndex(index);

    socialFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();

    if (!contactForm.label.trim()) {
      toast.error("Button label is required.");
      return;
    }

    const buttonData = {
      ...contactForm,
      buttonId: contactForm.buttonId || `button-${Date.now()}`,
      order: Number(contactForm.order) || 0,
    };

    if (editingContactIndex !== null) {
      setDraftProfile((previous) => {
        const items = [...(previous.contactButtons || [])];
        items[editingContactIndex] = {
          ...items[editingContactIndex],
          ...buttonData,
        };

        return { ...previous, contactButtons: items };
      });

      toast.success("Contact button updated.");
    } else {
      addArrayItem("contactButtons", buttonData);
      toast.success("Contact button added.");
    }

    setContactForm({
      ...emptyContactForm,
      order: (draftProfile.contactButtons || []).length + 1,
    });
    setEditingContactIndex(null);
  };

  const handleEditContact = (item, index) => {
    setContactForm({ ...emptyContactForm, ...item });
    setEditingContactIndex(index);

    contactFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleProfileImageUpload = async (field, file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append(field, file);

    try {
      setSaving(true);

      const response = await dispatch(
        uploadAdminUserProfileImages({ userId, formData }),
      ).unwrap();

      const updatedProfile = response.profile;

      setProfile(updatedProfile);
      setDraftProfile((previous) => ({
        ...previous,
        ...updatedProfile,
      }));

      toast.success(`${field} uploaded successfully.`);
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Image upload failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraftUser({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
    });

    setDraftProfile({ ...profile });
    setSocialForm(emptySocialForm);
    setEditingSocialIndex(null);
    setContactForm(emptyContactForm);
    setEditingContactIndex(null);

    setBusinessHoursText(
      typeof profile.businessHours === "string"
        ? profile.businessHours
        : JSON.stringify(profile.businessHours || {}, null, 2),
    );

    setEditMode(false);
  };

  const handleSave = async () => {
    if (!draftUser.fullName?.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!draftUser.email?.trim()) {
      toast.error("Email is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(draftUser.email.trim())) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (!draftUser.phone?.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    setSaving(true);

    try {
      const profilePayload = {};

      allowedProfileFields.forEach((field) => {
        if (field === "businessHours") return;

        if (Object.prototype.hasOwnProperty.call(draftProfile, field)) {
          profilePayload[field] = draftProfile[field];
        }
      });

      profilePayload.businessHours = parseBusinessHours(
        businessHoursText,
        profile.businessHours,
      );

      const response = await dispatch(
        updateAdminUserProfile({
          userId,
          user: {
            fullName: draftUser.fullName.trim(),
            email: draftUser.email.trim(),
            phone: draftUser.phone.trim(),
          },
          profile: profilePayload,
        }),
      ).unwrap();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to save changes.");
      }

      const updatedUser = response.user;
      const updatedProfile = response.profile || {};

      setUser(updatedUser);
      setProfile(updatedProfile);

      setDraftUser({
        fullName: updatedUser.fullName || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
      });

      setDraftProfile({ ...updatedProfile });

      setBusinessHoursText(
        typeof updatedProfile.businessHours === "string"
          ? updatedProfile.businessHours
          : JSON.stringify(updatedProfile.businessHours || {}, null, 2),
      );

      setEditMode(false);
      setPreviewVersion(Date.now());

      toast.success("User profile updated successfully.");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error.message || "Unable to save profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-300">
        Loading user profile...
      </div>
    );
  }

  if (pageError || !user) {
    return (
      <div className="m-4 rounded-xl border border-red-200 bg-white p-5 dark:border-red-900 dark:bg-[#0b1b30]">
        <p className="text-sm text-red-600 dark:text-red-300">
          {pageError || "User not found."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="mt-4 text-sm font-semibold text-cyan-600"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const subdomain = profile?.subdomain;
  const previewUrl = subdomain
    ? `/card-preview/${encodeURIComponent(subdomain)}`
    : "";

  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    user.fullName ||
    profile?.businessName ||
    "Business Profile";

  const address = [
    profile?.shopUnit,
    profile?.area,
    profile?.landmark,
    profile?.city,
    profile?.state,
    profile?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const renderField = ([field, label, type]) => (
    <Field
      key={field}
      label={label}
      value={draftProfile[field] ?? ""}
      multiline={type === "textarea"}
      type={type === "textarea" ? "text" : type || "text"}
      onChange={(value) => updateProfileField(field, value)}
    />
  );

  return (
    <main className="min-h-screen bg-[#f4f6f8] p-3 text-slate-900 dark:bg-[#09182b] dark:text-slate-100 sm:p-5">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-[#294560] dark:bg-[#0b1b30] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="mb-3 text-sm text-cyan-600 hover:underline"
            >
              ← Back to Users
            </button>

            <h1 className="truncate text-xl font-semibold">
              {editMode ? "Edit User Profile" : fullName}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-[#294560] dark:hover:bg-[#142b45]"
              >
                Open Public Profile
              </a>
            )}

            {!editMode ? (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium dark:border-[#294560]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </header>

        {editMode ? (
          <div className="space-y-4">
            {profileFields.map((section) => (
              <Section key={section.title} title={section.title}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.fields.map(renderField)}
                </div>
              </Section>
            ))}

            <Section title="Profile Images">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["avatar", "Avatar"],
                  ["logo", "Business Logo"],
                  ["banner", "Banner Image"],
                ].map(([field, label]) => (
                  <div
                    key={field}
                    className="rounded-xl border border-slate-200 p-4 dark:border-[#294560]"
                  >
                    <p className="mb-3 text-sm font-semibold">{label}</p>

                    {draftProfile[field] ? (
                      <img
                        src={draftProfile[field]}
                        alt={label}
                        className="mb-3 h-28 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500 dark:bg-[#142b45]">
                        No image uploaded
                      </div>
                    )}

                    <label className="block cursor-pointer rounded-lg bg-cyan-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-cyan-700">
                      Upload / Change
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={saving}
                        onChange={(event) => {
                          handleProfileImageUpload(
                            field,
                            event.target.files?.[0],
                          );
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Business Hours">
              <Field
                label="Business Hours (text or JSON, depending on existing format)"
                value={businessHoursText}
                multiline
                onChange={setBusinessHoursText}
              />
            </Section>

            <Section title="Social Media Profiles">
              <form
                ref={socialFormRef}
                onSubmit={handleSocialSubmit}
                className="mb-5 space-y-4 rounded-xl border border-slate-200 p-4 dark:border-[#294560]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {editingSocialIndex !== null
                      ? "Edit Social Profile"
                      : "Add New Social Profile"}
                  </h3>

                  {editingSocialIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setSocialForm(emptySocialForm);
                        setEditingSocialIndex(null);
                      }}
                      className="text-sm text-red-500"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    Platform
                    <select
                      value={socialForm.platform}
                      onChange={(event) =>
                        setSocialForm({
                          ...socialForm,
                          platform: event.target.value,
                          icon: event.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      {[
                        "instagram",
                        "facebook",
                        "youtube",
                        "linkedin",
                        "twitter",
                        "tiktok",
                        "pinterest",
                        "snapchat",
                        "telegram",
                        "other",
                      ].map((platform) => (
                        <option key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <Field
                    label="Display Name"
                    value={socialForm.platformName}
                    onChange={(value) =>
                      setSocialForm({ ...socialForm, platformName: value })
                    }
                  />

                  <Field
                    label="Username / Handle"
                    value={socialForm.handle}
                    onChange={(value) =>
                      setSocialForm({ ...socialForm, handle: value })
                    }
                  />

                  <Field
                    label="Profile URL"
                    value={socialForm.url}
                    onChange={(value) =>
                      setSocialForm({ ...socialForm, url: value })
                    }
                  />

                  <Field
                    label="Audience"
                    value={socialForm.audience}
                    onChange={(value) =>
                      setSocialForm({ ...socialForm, audience: value })
                    }
                  />

                  <Field
                    label="Button Label"
                    value={socialForm.ctaLabel}
                    onChange={(value) =>
                      setSocialForm({ ...socialForm, ctaLabel: value })
                    }
                  />

                  <Field
                    label="Profile Image URL"
                    value={socialForm.profileImage}
                    onChange={(value) =>
                      setSocialForm({ ...socialForm, profileImage: value })
                    }
                  />

                  <Field
                    label="Thumbnail Style"
                    value={socialForm.thumbnail}
                    onChange={(value) =>
                      setSocialForm({ ...socialForm, thumbnail: value })
                    }
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Description"
                      value={socialForm.description}
                      multiline
                      onChange={(value) =>
                        setSocialForm({ ...socialForm, description: value })
                      }
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(socialForm.verifiedTick)}
                      onChange={(event) =>
                        setSocialForm({
                          ...socialForm,
                          verifiedTick: event.target.checked,
                        })
                      }
                    />
                    Verified Tick
                  </label>
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {editingSocialIndex !== null
                    ? "Update Profile"
                    : "+ Add Profile"}
                </button>
              </form>

              <div className="space-y-3">
                {(draftProfile.socialCards || []).map((item, index) => (
                  <div
                    key={item._id || `social-${index}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-[#294560]"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold capitalize">
                        {item.platformName || item.platform || "Social Profile"}
                      </p>
                      <p className="break-all text-xs text-slate-500">
                        {item.handle || item.url}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditSocial(item, index)}
                        className="rounded-lg border px-3 py-2 text-sm dark:border-[#294560]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => removeArrayItem("socialCards", index)}
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {!(draftProfile.socialCards || []).length && (
                  <p className="text-sm text-slate-500">
                    No social profiles added yet.
                  </p>
                )}
              </div>
            </Section>

            <Section title="Contact Buttons">
              <form
                ref={contactFormRef}
                onSubmit={handleContactSubmit}
                className="mb-5 space-y-4 rounded-xl border border-slate-200 p-4 dark:border-[#294560]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {editingContactIndex !== null
                      ? "Edit Contact Button"
                      : "Add New Contact Button"}
                  </h3>

                  {editingContactIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setContactForm(emptyContactForm);
                        setEditingContactIndex(null);
                      }}
                      className="text-sm text-red-500"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Button Label"
                    value={contactForm.label}
                    onChange={(value) =>
                      setContactForm({ ...contactForm, label: value })
                    }
                  />

                  <Field
                    label="Icon"
                    value={contactForm.icon}
                    onChange={(value) =>
                      setContactForm({ ...contactForm, icon: value })
                    }
                  />

                  <label className="block text-sm">
                    Action Type
                    <select
                      value={contactForm.actionType}
                      onChange={(event) =>
                        setContactForm({
                          ...contactForm,
                          actionType: event.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      {[
                        ["call", "Call"],
                        ["whatsapp", "WhatsApp"],
                        ["email", "Email"],
                        ["directions", "Directions"],
                        ["share", "Share"],
                        ["saveContact", "Save Contact"],
                        ["website", "Website"],
                        ["upi", "UPI"],
                        ["customLink", "Custom Link"],
                      ].map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <Field
                    label="URL / Contact Value"
                    value={contactForm.customUrl}
                    onChange={(value) =>
                      setContactForm({ ...contactForm, customUrl: value })
                    }
                  />

                  <Field
                    label="Display Order"
                    type="number"
                    value={contactForm.order}
                    onChange={(value) =>
                      setContactForm({ ...contactForm, order: value })
                    }
                  />

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={contactForm.enabled}
                      onChange={(event) =>
                        setContactForm({
                          ...contactForm,
                          enabled: event.target.checked,
                        })
                      }
                    />
                    Button Enabled
                  </label>
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {editingContactIndex !== null
                    ? "Update Button"
                    : "+ Add Button"}
                </button>
              </form>

              <div className="space-y-3">
                {(draftProfile.contactButtons || []).map((item, index) => (
                  <div
                    key={item._id || item.buttonId || `contact-${index}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-[#294560]"
                  >
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-xs text-slate-500">
                        {item.actionType} ·{" "}
                        {item.enabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditContact(item, index)}
                        className="rounded-lg border px-3 py-2 text-sm dark:border-[#294560]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => removeArrayItem("contactButtons", index)}
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {!(draftProfile.contactButtons || []).length && (
                  <p className="text-sm text-slate-500">
                    No contact buttons added yet.
                  </p>
                )}
              </div>
            </Section>

            <Section title="Protected Information — Read Only">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Subdomain"
                  value={profile?.subdomain || ""}
                  disabled
                  onChange={() => {}}
                />
                <Field
                  label="QR Path"
                  value={profile?.qrPath || "Managed separately"}
                  disabled
                  onChange={() => {}}
                />
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Subdomain aur QR assignment is form se change nahi honge.
              </p>
            </Section>

            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium dark:border-[#294560]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-cyan-400 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-[#294560] dark:bg-[#0b1b30]">
              <div className="border-b border-slate-200 px-4 py-3 dark:border-[#294560]">
                <h2 className="text-sm font-semibold">Website Preview</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  User's public mini website
                </p>
              </div>

              {previewUrl ? (
                <iframe
                  key={`${subdomain}-${previewVersion}`}
                  title={`Public profile for ${fullName}`}
                  src={previewUrl}
                  className="block w-full border-0 bg-white"
                  style={{ height: "min(78vh, 900px)", minHeight: "480px" }}
                />
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  No public profile URL available.
                </div>
              )}
            </section>

            <aside className="space-y-4">
              <Section title="Business Details">
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="text-slate-500">Business:</span>{" "}
                    {profile?.businessName || "—"}
                  </p>
                  <p>
                    <span className="text-slate-500">Job Title:</span>{" "}
                    {profile?.jobTitle || "—"}
                  </p>
                  <p>
                    <span className="text-slate-500">Address:</span>{" "}
                    {address || "—"}
                  </p>
                  <p>
                    <span className="text-slate-500">Website:</span>{" "}
                    {profile?.websiteUrl || profile?.website || "—"}
                  </p>
                  <p>
                    <span className="text-slate-500">Verification:</span>{" "}
                    {profile?.isVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
              </Section>

              <Section title="About">
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {profile?.bio || profile?.headline || "No description added."}
                </p>
              </Section>
            </aside>
          </div>
        )}

        <Section title={`Gallery (${gallery.length})`}>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] sm:items-end">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Image title
                <input
                  type="text"
                  maxLength={150}
                  value={galleryTitle}
                  onChange={(event) => setGalleryTitle(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Images
                <input
                  key={galleryFiles.length}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    setGalleryFiles(Array.from(event.target.files || []))
                  }
                  className={inputClass}
                />
              </label>
              <button
                type="button"
                onClick={handleGalleryUpload}
                disabled={!galleryFiles.length}
                className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Upload Images
              </button>
            </div>

            {galleryLoading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loading gallery...
              </p>
            ) : gallery.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((image) => (
                  <article
                    key={image._id}
                    className="overflow-hidden rounded-lg border border-slate-200 dark:border-[#294560]"
                  >
                    <img
                      src={image.thumbnailUrl || image.imageUrl}
                      alt={image.title || "Gallery image"}
                      className="h-40 w-full object-cover"
                    />
                    <div className="space-y-3 p-3">
                      {editingGallery === image._id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            maxLength={150}
                            value={galleryEditTitle}
                            onChange={(event) =>
                              setGalleryEditTitle(event.target.value)
                            }
                            aria-label="Gallery image title"
                            className={inputClass}
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleGalleryUpdate(image._id)}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingGallery(null)}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-[#294560]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="truncate text-sm font-medium">
                            {image.title || "Untitled image"}
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingGallery(image._id);
                                setGalleryEditTitle(image.title || "");
                              }}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-[#294560]"
                            >
                              Edit Title
                            </button>
                            <button
                              type="button"
                              onClick={() => handleGalleryDelete(image._id)}
                              className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No gallery images have been added.
              </p>
            )}
          </div>
        </Section>

        <Section title={`Products (${products.length})`}>
          <div className="space-y-4">
            {!showProductForm && (
              <button
                type="button"
                onClick={() => setShowProductForm(true)}
                className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Add Product or Service
              </button>
            )}

            {showProductForm && (
              <form
                onSubmit={handleProductSubmit}
                className="space-y-4 rounded-lg border border-slate-200 p-4 dark:border-[#294560]"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Name
                    <input
                      type="text"
                      maxLength={150}
                      required
                      value={productForm.name}
                      onChange={(event) =>
                        setProductForm((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Price
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={productForm.price}
                      onChange={(event) =>
                        setProductForm((previous) => ({
                          ...previous,
                          price: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Category
                    <input
                      type="text"
                      maxLength={100}
                      value={productForm.category}
                      onChange={(event) =>
                        setProductForm((previous) => ({
                          ...previous,
                          category: event.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Type
                    <select
                      value={productForm.type}
                      onChange={(event) =>
                        setProductForm((previous) => ({
                          ...previous,
                          type: event.target.value,
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="product">Product</option>
                      <option value="service">Service</option>
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Status
                    <select
                      value={productForm.status}
                      onChange={(event) =>
                        setProductForm((previous) => ({
                          ...previous,
                          status: event.target.value,
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Images
                    <input
                      key={productFiles.length}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) =>
                        setProductFiles(Array.from(event.target.files || []))
                      }
                      className={inputClass}
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Description
                  <textarea
                    required
                    maxLength={5000}
                    rows={4}
                    value={productForm.description}
                    onChange={(event) =>
                      setProductForm((previous) => ({
                        ...previous,
                        description: event.target.value,
                      }))
                    }
                    className={`${inputClass} resize-y`}
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    {editingProduct ? "Save Product" : "Create Product"}
                  </button>
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-[#294560]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {productsLoading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loading products...
              </p>
            ) : products.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {products.map((product) => {
                  const image = product.images?.find((item) => item?.url)?.url;

                  return (
                    <article
                      key={product._id}
                      className="flex gap-3 rounded-lg border border-slate-200 p-3 dark:border-[#294560]"
                    >
                      {image && (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-20 w-20 shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="truncate font-semibold">
                            {product.name}
                          </h3>
                          <span className="text-sm font-medium">
                            {product.price}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {product.type || "product"} ·{" "}
                          {product.category || "General"} ·{" "}
                          {product.status || "active"}
                        </p>
                        <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                          {product.description}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleProductEdit(product)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-[#294560]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProductDelete(product._id)}
                            className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No products or services have been added.
              </p>
            )}
          </div>
        </Section>
      </div>
    </main>
  );
}
