
import React, { useState } from "react";
import {
  Package,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Check,
  Save,
  Loader2,
  ArrowUpRight,
  Layers,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const MAX_PRODUCTS = 20;

const initialFormData = {
  name: "",
  price: "",
  description: "",
  image1: null,
  image2: null,
  ctaText: "Inquire Now",
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({ ...initialFormData });

  const usedCount = products.length;
  const remainingCount = MAX_PRODUCTS - usedCount;
  const progress = (usedCount / MAX_PRODUCTS) * 100;

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setEditingId(null);
    setSaved(false);
    setFormError("");
  };

  const handleOpenAdd = () => {
    if (usedCount >= MAX_PRODUCTS) return;

    resetForm();
    setShowForm(true);

    setTimeout(() => {
      document.getElementById("product-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      image1: product.image1,
      image2: product.image2,
      ctaText: product.ctaText,
    });

    setEditingId(product.id);
    setFormError("");
    setSaved(false);
    setShowForm(true);

    setTimeout(() => {
      document.getElementById("product-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setProducts((prev) => prev.filter((product) => product.id !== id));

    if (editingId === id) {
      handleCloseForm();
    }
  };

  const handleImageUpload = (field) => (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setFormData((prev) => {
      if (prev[field]?.startsWith?.("blob:")) {
        URL.revokeObjectURL(prev[field]);
      }

      return {
        ...prev,
        [field]: imageUrl,
      };
    });

    setFormError("");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError("");
    setSaved(false);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setFormError("Please enter a product or service name.");
      return;
    }

    if (!formData.price.trim()) {
      setFormError("Please enter the price or pricing terms.");
      return;
    }

    if (!formData.image1) {
      setFormError("Please upload a main cover image.");
      return;
    }

    if (!editingId && usedCount >= MAX_PRODUCTS) {
      setFormError(`You can add a maximum of ${MAX_PRODUCTS} products.`);
      return;
    }

    setSaving(true);
    setFormError("");

    // Preserve the existing simulated save behavior.
    setTimeout(() => {
      if (editingId) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingId
              ? { ...product, ...formData }
              : product
          )
        );
      } else {
        setProducts((prev) => [
          ...prev,
          {
            id: Date.now(),
            ...formData,
          },
        ]);
      }

      setSaving(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
        setShowForm(false);
        resetForm();
      }, 1000);
    }, 600);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1b30] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-cyan-400/[0.07] blur-[140px]" />
        <div className="absolute -right-40 top-[35%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.08] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148, 190, 225, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 190, 225, 1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">

        {/* Page heading */}
        <section className="relative overflow-hidden rounded-3xl border border-[#29435f] bg-[#10243b] shadow-2xl shadow-black/10">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

          <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border border-cyan-300/[0.07]" />
          <div className="absolute -right-4 -top-8 h-36 w-36 rounded-full border border-cyan-300/[0.07]" />

          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#193754] shadow-lg shadow-cyan-950/20">
                  <ShoppingBag size={22} className="text-cyan-300" />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
                      <Sparkles size={11} />
                      Product Manager
                    </span>

                    <span className="rounded-full border border-[#38516e] bg-[#132942] px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                      {usedCount}/{MAX_PRODUCTS} used
                    </span>
                  </div>

                  <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                    Manage Products
                    <span className="text-cyan-300"> & Services</span>
                  </h1>

                  <p className="mt-2 max-w-xl text-xs leading-6 text-slate-300 sm:text-sm">
                    Build your business portfolio with product images,
                    pricing and custom inquiry buttons.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={showForm ? handleCloseForm : handleOpenAdd}
                disabled={!showForm && remainingCount === 0}
                className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                  showForm
                    ? "border border-[#38516e] bg-[#132942] text-slate-200 hover:bg-[#193754]"
                    : "bg-cyan-300 text-[#071729] shadow-lg shadow-cyan-950/20 hover:bg-cyan-200"
                }`}
              >
                {showForm ? <X size={16} /> : <Plus size={17} />}
                {showForm
                  ? "Close Form"
                  : remainingCount === 0
                  ? "Limit Reached"
                  : "Add Product"}
              </button>
            </div>

            {/* Usage progress */}
            <div className="mt-7 border-t border-[#29435f] pt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-slate-300">
                  Portfolio capacity
                </span>

                <span className="text-[11px] font-bold text-cyan-200">
                  {remainingCount} slots remaining
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-[#071729]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            icon={Package}
            label="Total Products"
            value={usedCount}
            detail="Products in your portfolio"
          />

          <StatCard
            icon={Layers}
            label="Available Slots"
            value={remainingCount}
            detail="Space for new offerings"
          />

          <StatCard
            icon={ImageIcon}
            label="Image Slots"
            value={usedCount * 2}
            detail="Maximum 2 images per product"
          />
        </section>

        {/* Add / edit form */}
        {showForm && (
          <section
            id="product-form"
            className="mt-6 scroll-mt-6 overflow-hidden rounded-3xl border border-[#38516e] bg-[#10243b] shadow-2xl shadow-black/10"
          >
            <div className="h-[2px] bg-gradient-to-r from-cyan-300 via-blue-400 to-transparent" />

            <div className="p-5 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#193754]">
                    {editingId ? (
                      <Pencil size={18} className="text-cyan-300" />
                    ) : (
                      <Plus size={20} className="text-cyan-300" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-white sm:text-lg">
                      {editingId ? "Edit Product" : "Create New Product"}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      Add the details customers will see on your business card.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseForm}
                  aria-label="Close form"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Product details */}
              <div className="rounded-2xl border border-[#29435f] bg-[#0b1b30]/70 p-4 sm:p-5">
                <SectionHeading number="01" title="Basic Information" />

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Product / Service Name" required>
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.name}
                      onChange={(e) =>
                        handleChange("name", e.target.value)
                      }
                      placeholder="e.g. Premium Hair Styling"
                      className={inputCls}
                    />
                  </FormField>

                  <FormField label="Price / Pricing Terms" required>
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.price}
                      onChange={(e) =>
                        handleChange("price", e.target.value)
                      }
                      placeholder="e.g. ₹499 or Contact for pricing"
                      className={inputCls}
                    />
                  </FormField>
                </div>

                <div className="mt-5">
                  <FormField label="Description">
                    <textarea
                      rows={4}
                      maxLength={1000}
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Describe your product, its features, benefits or service details..."
                      className={`${inputCls} resize-y leading-6`}
                    />
                    <p className="mt-1.5 text-right text-[10px] text-slate-400">
                      {formData.description.length}/1000 characters
                    </p>
                  </FormField>
                </div>
              </div>

              {/* Images */}
              <div className="mt-5 rounded-2xl border border-[#29435f] bg-[#0b1b30]/70 p-4 sm:p-5">
                <SectionHeading number="02" title="Product Images" />

                <p className="mt-2 text-xs leading-5 text-slate-300">
                  Add a main cover image and an optional second image.
                  Maximum image size: 5 MB each.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <ImageUpload
                    title="Main Cover Image"
                    description="Primary image displayed on your product card."
                    image={formData.image1}
                    required
                    onChange={handleImageUpload("image1")}
                  />

                  <ImageUpload
                    title="Secondary Image"
                    description="An additional product angle or detail."
                    image={formData.image2}
                    onChange={handleImageUpload("image2")}
                  />
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5 rounded-2xl border border-[#29435f] bg-[#0b1b30]/70 p-4 sm:p-5">
                <SectionHeading number="03" title="Inquiry Button" />

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                  <FormField label="Button Text">
                    <input
                      type="text"
                      maxLength={40}
                      value={formData.ctaText}
                      onChange={(e) =>
                        handleChange("ctaText", e.target.value)
                      }
                      placeholder="Inquire Now"
                      className={inputCls}
                    />
                  </FormField>

                  <div className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-xs font-bold text-[#071729]">
                    {formData.ctaText.trim() || "Inquire Now"}
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </div>

              {/* Error */}
              {formError && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-xs leading-5 text-red-200"
                >
                  {formError}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#29435f] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-5 py-3 text-xs font-semibold text-slate-200 transition hover:bg-[#193754]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving || saved}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3 text-xs font-bold text-[#071729] shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <Check size={15} strokeWidth={3} />
                      {editingId ? "Changes Saved" : "Product Added"}
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      {editingId ? "Save Changes" : "Create Product"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Product list */}
        <section className="mt-7">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                Your portfolio
              </p>

              <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                Products & Services
              </h2>

              <p className="mt-1 text-xs text-slate-300">
                Manage the offerings in your business portfolio.
              </p>
            </div>

            {products.length > 0 && (
              <span className="rounded-xl border border-[#29435f] bg-[#132942] px-3 py-2 text-[11px] font-semibold text-slate-200">
                {usedCount} {usedCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:shadow-xl hover:shadow-black/10"
                >
                  <div className="relative h-44 overflow-hidden bg-[#132942] sm:h-48">
                    {product.image1 ? (
                      <img
                        src={product.image1}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <ImageIcon size={30} className="text-slate-400" />
                        <span className="text-xs text-slate-300">
                          No cover image
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#071729]/80 via-transparent to-transparent" />

                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0b1b30]/85 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
                      <Package size={12} className="text-cyan-300" />
                      Product {index + 1}
                    </span>

                    {product.image2 && (
                      <span className="absolute right-3 top-3 rounded-lg border border-white/10 bg-[#0b1b30]/85 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
                        2 images
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                      <h3 className="min-w-0 text-base font-bold text-white sm:text-lg">
                        {product.name}
                      </h3>

                      <div className="shrink-0 rounded-lg border border-cyan-300/20 bg-[#132942]/95 px-3 py-2 text-xs font-bold text-cyan-200 backdrop-blur">
                        {product.price}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="min-h-10 whitespace-pre-wrap break-words text-xs leading-5 text-slate-300">
                      {product.description || "No description provided."}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#29435f] pt-4">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                          Inquiry button
                        </p>

                        <p className="mt-1 truncate text-xs font-semibold text-cyan-200">
                          {product.ctaText || "Inquire Now"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-200 transition hover:border-cyan-300/40 hover:bg-[#193754] hover:text-cyan-200"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/[0.05] text-red-300 transition hover:border-red-400/40 hover:bg-red-400/[0.12]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            !showForm && (
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#38516e] bg-[#10243b]/80 px-5 py-12 text-center sm:py-16">
                <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-cyan-300/[0.06] blur-3xl" />

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#193754]">
                  <Package size={27} className="text-cyan-300" />
                </div>

                <h3 className="relative mt-5 text-base font-bold text-white sm:text-lg">
                  Your portfolio starts here
                </h3>

                <p className="relative mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-300">
                  Add your first product or service with images, pricing and
                  an inquiry button to build your business portfolio.
                </p>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-xs font-bold text-[#071729] transition hover:bg-cyan-200 active:scale-[0.98]"
                >
                  <Plus size={16} />
                  Add Your First Product
                </button>
              </div>
            )
          )}
        </section>

        <p className="mt-8 pb-4 text-center text-[10px] text-slate-400">
          Manage up to {MAX_PRODUCTS} products and services in your portfolio.
        </p>
      </div>
    </main>
  );
};

/* ==================== REUSABLE COMPONENTS ==================== */

const inputCls =
  "w-full rounded-xl border border-[#38516e] bg-[#132942] px-4 py-3 text-sm font-medium text-white placeholder:text-slate-400/70 outline-none transition duration-200 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/[0.07]";

const StatCard = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-2xl border border-[#29435f] bg-[#10243b] p-4 transition hover:border-[#38516e] sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-slate-300">{label}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-white">
          {value}
        </p>
        <p className="mt-1 text-[10px] leading-5 text-slate-400">{detail}</p>
      </div>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#193754]">
        <Icon size={18} className="text-cyan-300" />
      </div>
    </div>
  </div>
);

const SectionHeading = ({ number, title }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-8 w-9 items-center justify-center rounded-lg border border-cyan-300/20 bg-[#193754] text-[10px] font-bold tracking-wider text-cyan-200">
      {number}
    </span>

    <h3 className="text-sm font-bold text-white">{title}</h3>
  </div>
);

const FormField = ({ label, required = false, children }) => (
  <div className="min-w-0">
    <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
      {label}
      {required && <span className="text-cyan-300">*</span>}
    </label>

    {children}
  </div>
);

const ImageUpload = ({
  title,
  description,
  image,
  required = false,
  onChange,
}) => (
  <div className="min-w-0 rounded-2xl border border-[#29435f] bg-[#10243b] p-3.5 sm:p-4">
    <div className="mb-3">
      <p className="text-xs font-bold text-white">
        {title}
        {required && <span className="ml-1 text-cyan-300">*</span>}
      </p>

      <p className="mt-1 text-[10px] leading-5 text-slate-300">
        {description}
      </p>
    </div>

    <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border border-[#29435f] bg-[#0b1b30]">
      {image ? (
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 px-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942]">
            <ImageIcon size={21} className="text-slate-300" />
          </div>

          <span className="text-xs font-semibold text-slate-200">
            No image selected
          </span>

          <span className="text-[10px] text-slate-400">
            JPG, PNG or WebP · Up to 5 MB
          </span>
        </div>
      )}
    </div>

    <label className="mt-3 flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-[#193754] hover:text-cyan-200">
      <Upload size={14} />
      {image ? "Change Image" : "Upload Image"}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onChange}
      />
    </label>
  </div>
);

export default ManageProducts;
