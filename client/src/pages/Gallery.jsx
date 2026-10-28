import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Images,
  Plus,
  Trash2,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  X,
  ImagePlus,
  Camera,
  Sparkles,
  Check,
} from "lucide-react";

import {
  uploadGalleryImages,
  getMyGallery,
  deleteGalleryImage,
  clearGalleryError,
  clearGalleryMessage,
} from "../redux/slice/gallerySlice";

const Gallery = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const {
    gallery = [],
    loading,
    uploading,
    deleting,
    error,
    message,
  } = useSelector((state) => state.gallery || {});

  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toast & Delete Modal States
  const [toast, setToast] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Bulk selection + delete states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedGalleryIds, setSelectedGalleryIds] = useState([]);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Watch Redux error and message for toasts
  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearGalleryError());
    }
    if (message) {
      showToast(message, "success");
      dispatch(clearGalleryMessage());
    }
  }, [error, message, dispatch]);

  // Fetch gallery images on mount
  useEffect(() => {
    dispatch(getMyGallery());
  }, [dispatch]);

  /* ==================== MODAL HANDLERS ==================== */

  const openUploadModal = () => {
    setSelectedImages([]);
    setTitle("");
    setIsModalOpen(true);
    // Auto open file picker after a small delay
    setTimeout(() => fileInputRef.current?.click(), 300);
  };

  const closeUploadModal = () => {
    selectedImages.forEach((img) => URL.revokeObjectURL(img.url));
    setSelectedImages([]);
    setTitle("");
    setIsModalOpen(false);
  };

  /* ==================== IMAGE SELECTION ==================== */

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter(
      (file) =>
        file.size <= 5 * 1024 * 1024 &&
        [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
          "image/gif",
        ].includes(file.type),
    );

    if (validFiles.length !== files.length) {
      showToast(
        "Only JPEG, PNG, JPG, WEBP, and GIF images up to 5MB each are allowed.",
        "error",
      );
    }

    setSelectedImages((prev) => {
      const remainingSlots = Math.max(0, 10 - prev.length);
      const filesToAdd = validFiles.slice(0, remainingSlots);

      if (filesToAdd.length < validFiles.length) {
        showToast("You can select a maximum of 10 images per upload.", "error");
      }

      const newImages = filesToAdd.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      }));

      return [...prev, ...newImages];
    });

    e.target.value = "";
  };

  const handleRemoveSelectedImage = (id) => {
    setSelectedImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((image) => image.id !== id);
    });
  };

  const handleUploadImages = async () => {
    if (!selectedImages.length) return;

    const result = await dispatch(
      uploadGalleryImages({
        images: selectedImages.map((image) => image.file),
        title: title.trim(),
      }),
    );

    if (uploadGalleryImages.fulfilled.match(result)) {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });

      setSelectedImages([]);
      setTitle("");
      setIsModalOpen(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      dispatch(getMyGallery());
    }
  };

  /* ==================== DELETE ==================== */

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    await dispatch(deleteGalleryImage(deleteConfirmId));
    setDeleteConfirmId(null);
  };

  /* ==================== BULK SELECTION / DELETE ==================== */

  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => {
      if (prev) setSelectedGalleryIds([]);
      return !prev;
    });
  };

  const toggleGallerySelect = (id) => {
    setSelectedGalleryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedGalleryIds.length === gallery.length) {
      setSelectedGalleryIds([]);
    } else {
      setSelectedGalleryIds(gallery.map((img) => img._id));
    }
  };

  const handleBulkDeleteClick = () => {
    if (!selectedGalleryIds.length) return;
    setBulkDeleteConfirm(true);
  };

  const handleConfirmBulkDelete = async () => {
    if (!selectedGalleryIds.length) return;
    const idsToDelete = [...selectedGalleryIds];
    for (const id of idsToDelete) {
      await dispatch(deleteGalleryImage(id));
    }
    setBulkDeleteConfirm(false);
    setSelectedGalleryIds([]);
    setIsSelectionMode(false);
  };

  return (
    <div className="relative w-full bg-transparent text-slate-200">
      {/* ==================== TOAST ==================== */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[200] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl transition-all animate-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "border-emerald-400/20 bg-[#0b1b30] text-emerald-400 shadow-emerald-400/10"
              : "border-red-400/20 bg-[#0b1b30] text-red-400 shadow-red-400/10"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <p className="text-sm font-semibold">{toast.msg}</p>
        </div>
      )}

      {/* ==================== SINGLE DELETE CONFIRM MODAL ==================== */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10">
              <AlertTriangle size={24} className="text-red-400" />
            </div>

            <h3 className="text-lg font-bold text-white">Delete Image?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to delete this gallery image? This action
              cannot be undone.
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
                {deleting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== BULK DELETE CONFIRM MODAL ==================== */}
      {bulkDeleteConfirm && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md"
          onClick={() => !deleting && setBulkDeleteConfirm(false)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10">
              <AlertTriangle size={24} className="text-red-400" />
            </div>

            <h3 className="text-lg font-bold text-white">
              Delete {selectedGalleryIds.length}{" "}
              {selectedGalleryIds.length === 1 ? "Image" : "Images"}?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to delete{" "}
              {selectedGalleryIds.length} selected image
              {selectedGalleryIds.length === 1 ? "" : "s"}? This action cannot
              be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setBulkDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-[#38516e] bg-[#132942] py-2.5 text-xs font-bold text-slate-300 transition hover:bg-[#1a3658] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
                {deleting
                  ? "Deleting..."
                  : `Delete ${selectedGalleryIds.length}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== UPLOAD MODAL ==================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[#020817]/85 p-3 backdrop-blur-md sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !uploading) closeUploadModal();
          }}
        >
          <div className="relative max-h-[94vh] w-full max-w-2xl overflow-hidden rounded-[26px] border border-cyan-400/20 bg-[#0b1b30] shadow-[0_30px_100px_rgba(0,0,0,0.7)] flex flex-col">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

            <div className="flex items-center gap-3 border-b border-[#29435f] px-5 py-4 sm:px-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-inner shadow-cyan-300/5">
                <ImagePlus size={22} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  Upload Gallery Images
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                  Add photos to showcase your business
                </p>
              </div>
              <button
                type="button"
                onClick={closeUploadModal}
                disabled={uploading}
                aria-label="Close upload modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-300 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                multiple
                onChange={handleAddImages}
                className="hidden"
              />

              {selectedImages.length === 0 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="group w-full rounded-2xl border-2 border-dashed border-[#29435f] bg-[#0b1b30]/60 p-8 text-center transition-all hover:border-cyan-400/50 hover:bg-cyan-400/[0.03] disabled:opacity-50 sm:p-10"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-blue-400/5 text-cyan-300 shadow-inner shadow-cyan-300/5 transition-transform duration-300 group-hover:scale-105">
                    <Upload size={28} strokeWidth={1.8} />
                  </div>
                  <p className="text-sm font-bold text-white sm:text-base">
                    Click to browse or drop images here
                  </p>
                  <p className="mt-1.5 text-xs text-slate-400">
                    JPEG, PNG, JPG, WEBP or GIF · up to 5MB each
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15">
                    <Plus size={13} /> Select Images
                  </span>
                </button>
              )}

              {selectedImages.length > 0 && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
                        <Sparkles size={12} />
                        {selectedImages.length}{" "}
                        {selectedImages.length === 1 ? "Image" : "Images"}{" "}
                        Selected
                      </span>
                      <span className="text-xs text-slate-500">(max 10)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || selectedImages.length >= 10}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={13} /> Add More
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedImages.map((image) => (
                      <div
                        key={image.id}
                        className="group relative overflow-hidden rounded-xl border border-[#29435f] bg-[#132942] shadow-md transition hover:border-cyan-400/40"
                      >
                        <img
                          src={image.url}
                          alt="Selected preview"
                          className="h-28 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-32"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedImage(image.id)}
                          disabled={uploading}
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/70 text-white backdrop-blur-sm transition hover:border-red-400/40 hover:bg-red-500 disabled:opacity-50"
                          title="Remove image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                      <Camera size={15} className="text-cyan-300" />
                      Gallery Title
                      <span className="text-[10px] font-normal text-slate-500">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      maxLength={150}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Our Storefront, Product Showcase..."
                      className="w-full rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-[#38516e] focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/[0.07]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#29435f] bg-[#0b1b30] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={closeUploadModal}
                disabled={uploading}
                className="rounded-xl border border-[#38516e] bg-[#132942] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-[#1a3658] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadImages}
                disabled={uploading || selectedImages.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload {selectedImages.length > 0 ? `(${selectedImages.length})` : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== HEADER ==================== */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-blue-400/5 text-cyan-300 shadow-inner shadow-cyan-300/5">
            <Images size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gallery</h2>
            <p className="text-sm text-slate-400">
              Add photos to showcase your business
            </p>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {gallery.length > 0 && (
            <button
              type="button"
              onClick={toggleSelectionMode}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition active:scale-[0.98] sm:px-5 sm:py-3 ${
                isSelectionMode
                  ? "border-cyan-400/40 bg-cyan-400/20 text-cyan-100 hover:bg-cyan-400/30"
                  : "border-[#38516e] bg-[#132942] text-slate-300 hover:border-cyan-400/40 hover:bg-[#1a3658] hover:text-cyan-200"
              }`}
            >
              <Check size={16} strokeWidth={3} />
              {isSelectionMode ? "Cancel" : "Select"}
            </button>
          )}

          <button
            type="button"
            onClick={openUploadModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 active:scale-[0.98] sm:px-6 sm:py-3"
          >
            <Plus size={18} strokeWidth={3} />
            Add Image
          </button>
        </div>
      </div>

      {/* ==================== SAVED GALLERY ==================== */}
      <div className="rounded-2xl border border-[#29435f] bg-[#132942]/60 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-bold text-white">
            <Images size={16} className="text-cyan-400" />
            Your Gallery
          </h3>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
            {gallery.length} {gallery.length === 1 ? "Image" : "Images"}
          </span>
        </div>

        {/* Selection toolbar */}
        {isSelectionMode && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-300">
                {selectedGalleryIds.length} selected
              </span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs font-semibold text-slate-300 underline-offset-2 transition hover:text-white hover:underline"
              >
                {selectedGalleryIds.length === gallery.length
                  ? "Deselect all"
                  : "Select all"}
              </button>
            </div>
            <button
              type="button"
              onClick={handleBulkDeleteClick}
              disabled={!selectedGalleryIds.length || deleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={13} />
              Delete Selected ({selectedGalleryIds.length})
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#29435f] bg-[#0b1b30] py-14">
            <Loader2 size={28} className="animate-spin text-cyan-400" />
            <p className="text-sm text-slate-400">Loading gallery...</p>
          </div>
        ) : gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {gallery.map((image) => {
              const isSelected = selectedGalleryIds.includes(image._id);
              return (
                <div
                  key={image._id}
                  onClick={
                    isSelectionMode
                      ? () => toggleGallerySelect(image._id)
                      : undefined
                  }
                  className={`group relative overflow-hidden rounded-xl border bg-[#0b1b30] transition-all duration-300 ${
                    isSelectionMode
                      ? isSelected
                        ? "cursor-pointer border-cyan-400 ring-2 ring-cyan-400/40"
                        : "cursor-pointer border-[#29435f] hover:border-cyan-400/50"
                      : "border-[#29435f] hover:-translate-y-0.5 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/5"
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.thumbnailUrl || image.imageUrl}
                      alt={image.title || "Gallery image"}
                      className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {image.title && (
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-medium text-slate-200">
                        {image.title}
                      </p>
                    </div>
                  )}

                  {isSelectionMode ? (
                    <div
                      className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border-2 transition ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-400 text-[#0b1b30]"
                          : "border-white/50 bg-black/50 text-transparent"
                      }`}
                    >
                      <Check size={16} strokeWidth={3} />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(image._id)}
                      disabled={deleting}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/70 text-white opacity-100 backdrop-blur-sm transition-all hover:border-red-400/40 hover:bg-red-500 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Delete gallery image"
                    >
                      {deleting && deleteConfirmId === image._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#29435f] bg-[#0b1b30]/50 py-14 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] text-slate-500">
              <Images size={28} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              No gallery images added yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Click "Add Image" above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;