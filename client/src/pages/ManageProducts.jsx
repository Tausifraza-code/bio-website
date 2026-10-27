import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Layers,
  ShoppingBag,
  Tag,
  Eye,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../redux/slice/productSlice";

const MAX_PRODUCTS = 20;
const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialFormData = {
  name: "",
  description: "",
  price: "",
  category: "General",
  type: "product",
  status: "active",
};

const ManageProducts = () => {
  const dispatch = useDispatch();

  const {
    products = [],
    loading,
    creating,
    updating,
    deleting,
    error: productError,
  } = useSelector((state) => state.product || {});

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({ ...initialFormData });

  // Toast & Delete Modal States
  const [toast, setToast] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const saving = Boolean(creating || updating);

  useEffect(() => {
    dispatch(getMyProducts());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((image) => {
        if (image.preview?.startsWith("blob:")) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [imagePreviews]);

  const usedCount = products.length;
  const remainingCount = Math.max(0, MAX_PRODUCTS - usedCount);
  const progress = Math.min(100, (usedCount / MAX_PRODUCTS) * 100);

  const releaseNewImagePreviews = () => {
    imagePreviews.forEach((image) => {
      if (image.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(image.preview);
      }
    });
  };

  const resetForm = () => {
    releaseNewImagePreviews();
    setFormData({ ...initialFormData });
    setExistingImages([]);
    setNewImages([]);
    setImagePreviews([]);
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
    releaseNewImagePreviews();

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "General",
      type: product.type || "product",
      status: product.status || "active",
    });

    setExistingImages(
      Array.isArray(product.images) ? product.images : []
    );
    setNewImages([]);
    setImagePreviews([]);
    setEditingId(product._id);
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

  // Trigger custom modal instead of window.confirm
  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  // Actual deletion logic
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    setFormError("");

    try {
      await dispatch(deleteProduct(deleteConfirmId)).unwrap();
      showToast("Product deleted successfully!", "success");

      if (editingId === deleteConfirmId) {
        handleCloseForm();
      }
    } catch (err) {
      const errorMsg = typeof err === "string" ? err : "Failed to delete product.";
      setFormError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setDeleteConfirmId(null); // Close modal after attempt
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    const remainingImageSlots =
      MAX_IMAGES - existingImages.length - newImages.length;

    if (files.length > remainingImageSlots) {
      setFormError(
        `You can upload a maximum of ${MAX_IMAGES} images per product. ` +
          `${remainingImageSlots} slot(s) remaining.`
      );
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setFormError("Please select valid image files.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setFormError(
          `"${file.name}" exceeds the 5 MB image size limit.`
        );
        return;
      }
    }

    const selectedFiles = files;
    const selectedPreviews = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setNewImages((prev) => [...prev, ...selectedFiles]);
    setImagePreviews((prev) => [...prev, ...selectedPreviews]);
    setFormError("");
    setSaved(false);
  };

  const removeNewImage = (index) => {
    const image = imagePreviews[index];

    if (image?.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(image.preview);
    }

    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormError("");
    setSaved(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError("");
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setFormError("Please enter a product or service name.");
      return;
    }

    if (formData.name.trim().length > 150) {
      setFormError("Name must be 150 characters or fewer.");
      return;
    }

    if (!formData.description.trim()) {
      setFormError("Please enter a product description.");
      return;
    }

    if (formData.description.trim().length > 5000) {
      setFormError("Description must be 5000 characters or fewer.");
      return;
    }

    if (
      formData.price.trim() === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      setFormError("Enter a valid non-negative numeric price.");
      return;
    }

    if (!["product", "service"].includes(formData.type)) {
      setFormError("Please select a valid product type.");
      return;
    }

    if (!["active", "inactive"].includes(formData.status)) {
      setFormError("Please select a valid status.");
      return;
    }

    if (!formData.category.trim() || formData.category.length > 100) {
      setFormError(
        "Category is required and must be 100 characters or fewer."
      );
      return;
    }

    if (
      existingImages.length + newImages.length > MAX_IMAGES
    ) {
      setFormError(`A product can have a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    if (!editingId && usedCount >= MAX_PRODUCTS) {
      setFormError(
        `You can add a maximum of ${MAX_PRODUCTS} products.`
      );
      return;
    }

    setFormError("");
    setSaved(false);

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category.trim(),
      type: formData.type,
      images: newImages,
    };

    if (editingId) {
      productData.status = formData.status;
    }

    try {
      if (editingId) {
        await dispatch(
          updateProduct({
            id: editingId,
            productData,
          })
        ).unwrap();
        showToast("Product updated successfully!", "success");
      } else {
        await dispatch(createProduct(productData)).unwrap();
        showToast("Product created successfully!", "success");
      }

      setSaved(true);

      setTimeout(() => {
        setShowForm(false);
        resetForm();
      }, 900);
    } catch (err) {
      const errorMsg = typeof err === "string" ? err : "Unable to save product. Please try again.";
      setFormError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  return (
    <main className="relative min-h-screen bg-transparent text-slate-200">
      
      {/* Custom Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl transition-all animate-in slide-in-from-bottom-5 ${
          toast.type === "success" 
            ? "border-emerald-400/20 bg-[#0b1b30] text-emerald-400 shadow-emerald-400/10" 
            : "border-red-400/20 bg-[#0b1b30] text-red-400 shadow-red-400/10"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)}>
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            
            <h3 className="text-lg font-bold text-white">Delete Product?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to delete this product? This action cannot be undone and will permanently remove it from your portfolio.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-xl border border-[#38516e] bg-[#132942] py-2.5 text-xs font-bold text-slate-300 transition hover:bg-[#1a3658]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-1 py-7 sm:px-6 sm:py-9 lg:px-8">
        
        {/* Page heading */}
        <section className="relative overflow-hidden rounded-3xl border border-[#29435f] bg-[#0b1b30] shadow-2xl shadow-black/20">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942] shadow-lg shadow-black/10">
                  <ShoppingBag size={22} className="text-cyan-400" />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      Product Manager
                    </span>

                    <span className="rounded-full border border-[#29435f] bg-[#132942] px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                      {usedCount}/{MAX_PRODUCTS} used
                    </span>
                  </div>

                  <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                    Manage Products
                    <span className="text-cyan-400"> & Services</span>
                  </h1>

                  <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                    Manage your products and services, pricing, categories,
                    and images in one place.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={showForm ? handleCloseForm : handleOpenAdd}
                disabled={!showForm && remainingCount === 0}
                className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                  showForm
                    ? "border border-[#38516e] bg-[#132942] text-slate-200 hover:bg-[#1a3658]"
                    : "bg-cyan-400 text-[#0b1b30] shadow-lg shadow-cyan-400/20 hover:bg-cyan-300"
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
                <span className="text-[11px] font-semibold text-slate-400">
                  Portfolio capacity
                </span>

                <span className="text-[11px] font-bold text-cyan-400">
                  {remainingCount} slots remaining
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-[#132942]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
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
            label="Total Images"
            value={products.reduce(
              (total, product) =>
                total + (product.images?.length || 0),
              0
            )}
            detail="Images across your products"
          />
        </section>

        {/* Add / edit form */}
        {showForm && (
          <section
            id="product-form"
            className="mt-6 scroll-mt-6 overflow-hidden rounded-3xl border border-[#29435f] bg-[#0b1b30] shadow-2xl shadow-black/20"
          >
            <div className="h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent" />

            <div className="p-5 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942]">
                    {editingId ? (
                      <Pencil size={18} className="text-cyan-400" />
                    ) : (
                      <Plus size={20} className="text-cyan-400" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-white sm:text-lg">
                      {editingId ? "Edit Product" : "Create New Product"}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Add the product or service details and images.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseForm}
                  aria-label="Close form"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-400"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Basic information */}
              <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-4 sm:p-5">
                <SectionHeading number="01" title="Basic Information" />

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Product / Service Name" required>
                    <input
                      type="text"
                      maxLength={150}
                      value={formData.name}
                      onChange={(e) =>
                        handleChange("name", e.target.value)
                      }
                      placeholder="e.g. Premium Hair Styling"
                      className={inputCls}
                    />
                    <p className="mt-1.5 text-right text-[10px] text-slate-500">
                      {formData.name.length}/150 characters
                    </p>
                  </FormField>

                  <FormField label="Price" required>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={formData.price}
                      onChange={(e) =>
                        handleChange("price", e.target.value)
                      }
                      placeholder="e.g. 499"
                      className={inputCls}
                    />
                  </FormField>

                  <FormField label="Category" required>
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.category}
                      onChange={(e) =>
                        handleChange("category", e.target.value)
                      }
                      placeholder="e.g. Electronics"
                      className={inputCls}
                    />
                  </FormField>

                  <FormField label="Type" required>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        handleChange("type", e.target.value)
                      }
                      className={inputCls}
                    >
                      <option value="product" className="bg-[#132942]">
                        Product
                      </option>
                      <option value="service" className="bg-[#132942]">
                        Service
                      </option>
                    </select>
                  </FormField>

                  {editingId && (
                    <FormField label="Status" required>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          handleChange("status", e.target.value)
                        }
                        className={inputCls}
                      >
                        <option value="active" className="bg-[#132942]">
                          Active
                        </option>
                        <option value="inactive" className="bg-[#132942]">
                          Inactive
                        </option>
                      </select>
                    </FormField>
                  )}
                </div>

                <div className="mt-5">
                  <FormField label="Description" required>
                    <textarea
                      rows={4}
                      maxLength={5000}
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="Describe your product, its features, benefits or service details..."
                      className={`${inputCls} resize-y leading-6`}
                    />
                    <p className="mt-1.5 text-right text-[10px] text-slate-500">
                      {formData.description.length}/5000 characters
                    </p>
                  </FormField>
                </div>
              </div>

              {/* Images */}
              <div className="mt-5 rounded-2xl border border-[#29435f] bg-[#132942] p-4 sm:p-5">
                <SectionHeading number="02" title="Product Images" />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Upload up to {MAX_IMAGES} images. Each image can be
                  up to 5 MB. Supported formats include JPEG, PNG, WebP
                  and GIF.
                </p>

                {editingId && existingImages.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-3 text-xs font-bold text-slate-200">
                      Existing Images ({existingImages.length})
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {existingImages.map((image, index) => (
                        <div
                          key={image._id || image.url || index}
                          className="overflow-hidden rounded-xl border border-[#29435f] bg-[#0b1b30]"
                        >
                          <div className="h-28 bg-[#132942] sm:h-32">
                            <img
                              src={image.url}
                              alt={image.alt || formData.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-2 text-[10px] text-slate-400">
                            <Eye size={12} className="shrink-0 text-cyan-400" />
                            Existing image {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-3 text-xs font-bold text-slate-200">
                      Newly Selected Images ({imagePreviews.length})
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {imagePreviews.map((image, index) => (
                        <div
                          key={`${image.name}-${index}`}
                          className="overflow-hidden rounded-xl border border-[#29435f] bg-[#0b1b30]"
                        >
                          <div className="relative h-28 bg-[#132942] sm:h-32">
                            <img
                              src={image.preview}
                              alt={image.name}
                              className="h-full w-full object-cover"
                            />

                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              aria-label={`Remove ${image.name}`}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white transition hover:bg-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <p
                            className="truncate px-2.5 py-2 text-[10px] text-slate-400"
                            title={image.name}
                          >
                            {image.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <label
                    className={`flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#29435f] bg-[#0b1b30] px-4 py-6 text-center transition ${
                      existingImages.length + newImages.length >= MAX_IMAGES
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:border-cyan-400/50 hover:bg-[#132942]"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942]">
                      <Upload size={21} className="text-cyan-400" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-white">
                        {existingImages.length + newImages.length >= MAX_IMAGES
                          ? "Maximum Images Reached"
                          : "Choose Images to Upload"}
                      </p>
                      <p className="mt-1 text-[10px] leading-5 text-slate-400">
                        {existingImages.length + newImages.length} of{" "}
                        {MAX_IMAGES} images selected
                      </p>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={
                        existingImages.length + newImages.length >= MAX_IMAGES
                      }
                      onChange={handleImageUpload}
                    />
                  </label>
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

              {productError && (
                <div
                  role="alert"
                  className="mt-3 rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-xs leading-5 text-red-200"
                >
                  {productError}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#29435f] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-5 py-3 text-xs font-semibold text-slate-300 transition hover:bg-[#1a3658]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving || saved}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-xs font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                Your portfolio
              </p>

              <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                Products & Services
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Manage the offerings in your business portfolio.
              </p>
            </div>

            {products.length > 0 && (
              <span className="rounded-xl border border-[#29435f] bg-[#132942] px-3 py-2 text-[11px] font-semibold text-slate-300">
                {usedCount} {usedCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          {(productError || formError) && !showForm && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-xs leading-5 text-red-200"
            >
              {formError || productError}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#29435f] bg-[#0b1b30] py-12 text-sm text-slate-400">
              <Loader2 size={18} className="animate-spin text-cyan-400" />
              Loading products...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {products.map((product, index) => (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-black/20"
                >
                  <div className="relative h-44 overflow-hidden bg-[#132942] sm:h-48">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2">
                        <ImageIcon size={30} className="text-slate-500" />
                        <span className="text-xs text-slate-500">
                          No cover image
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b30] via-transparent to-transparent" />

                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#0b1b30]/85 px-2.5 py-1.5 text-[10px] font-semibold capitalize text-white backdrop-blur-md">
                      <Package size={12} className="text-cyan-400" />
                      {product.type || "product"}
                    </span>

                    <span
                      className={`absolute right-3 top-3 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold capitalize backdrop-blur-md ${
                        product.status === "active"
                          ? "border-emerald-400/20 bg-emerald-400/15 text-emerald-300"
                          : "border-amber-400/20 bg-amber-400/15 text-amber-300"
                      }`}
                    >
                      {product.status || "active"}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                      <h3 className="min-w-0 text-base font-bold text-white sm:text-lg">
                        {product.name}
                      </h3>

                      <div className="shrink-0 rounded-lg border border-cyan-400/20 bg-[#132942]/95 px-3 py-2 text-xs font-bold text-cyan-400 backdrop-blur">
                        ₹{Number(product.price).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="min-h-10 whitespace-pre-wrap break-words text-xs leading-5 text-slate-400">
                      {product.description || "No description provided."}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[#29435f] bg-[#132942] p-3">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                          <Tag size={12} className="text-cyan-400" />
                          Category
                        </div>
                        <p className="mt-1.5 truncate text-xs font-semibold text-slate-200">
                          {product.category || "General"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#29435f] bg-[#132942] p-3">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                          <ImageIcon size={12} className="text-cyan-400" />
                          Images
                        </div>
                        <p className="mt-1.5 text-xs font-semibold text-slate-200">
                          {product.images?.length || 0} / {MAX_IMAGES}
                        </p>
                      </div>
                    </div>

                    {product.images?.length > 1 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {product.images.slice(1).map((image, imageIndex) => (
                          <img
                            key={image._id || image.url || imageIndex}
                            src={image.thumbnailUrl || image.url}
                            alt={
                              image.alt ||
                              `${product.name} image ${imageIndex + 2}`
                            }
                            className="h-14 w-14 shrink-0 rounded-lg border border-[#29435f] object-cover"
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#29435f] pt-4">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                          Product ID
                        </p>
                        <p className="mt-1 truncate text-[10px] text-slate-500">
                          {product._id}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-300 transition hover:border-cyan-400/50 hover:bg-[#1a3658] hover:text-cyan-400"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteClick(product._id)}
                          disabled={deleting}
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/[0.05] text-red-300 transition hover:border-red-400/40 hover:bg-red-400/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deleting && deleteConfirmId === product._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            !showForm && (
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#38516e] bg-[#0b1b30] px-5 py-12 text-center sm:py-16">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942]">
                  <Package size={27} className="text-cyan-400" />
                </div>

                <h3 className="relative mt-5 text-base font-bold text-white sm:text-lg">
                  Your portfolio starts here
                </h3>

                <p className="relative mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-400">
                  Add your first product or service with images, pricing,
                  category and description to build your business portfolio.
                </p>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 active:scale-[0.98]"
                >
                  <Plus size={16} />
                  Add Your First Product
                </button>
              </div>
            )
          )}
        </section>

        <p className="mt-8 pb-4 text-center text-[10px] text-slate-500">
          Manage up to {MAX_PRODUCTS} products and services in your portfolio.
        </p>
      </div>
    </main>
  );
};

/* ==================== REUSABLE COMPONENTS ==================== */

const inputCls =
  "w-full rounded-xl border border-[#29435f] bg-[#0b1b30] px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition duration-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/[0.07]";

const StatCard = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 transition hover:border-[#38516e] sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-white">
          {value}
        </p>
        <p className="mt-1 text-[10px] leading-5 text-slate-500">{detail}</p>
      </div>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-[#132942]">
        <Icon size={18} className="text-cyan-400" />
      </div>
    </div>
  </div>
);

const SectionHeading = ({ number, title }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-8 w-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-[#0b1b30] text-[10px] font-bold tracking-wider text-cyan-400">
      {number}
    </span>
    <h3 className="text-sm font-bold text-white">{title}</h3>
  </div>
);

const FormField = ({ label, required = false, children }) => (
  <div className="min-w-0">
    <label className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
      {label}
      {required && <span className="text-cyan-400">*</span>}
    </label>
    {children}
  </div>
);

export default ManageProducts;