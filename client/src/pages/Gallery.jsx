import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Images, Plus, Trash2, Upload, Loader2, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

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

  // Toast & Delete Modal States
  const [toast, setToast] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

  // Fetch gallery images from backend
  useEffect(() => {
    dispatch(getMyGallery());

    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Select images for upload
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
      showToast("Only JPEG, PNG, JPG, WEBP, and GIF images up to 5MB each are allowed.", "error");
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

  // Remove selected image before upload
  const handleRemoveSelectedImage = (id) => {
    setSelectedImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((image) => image.id !== id);
    });
  };

  // Upload selected images to backend
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

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      dispatch(getMyGallery());
    }
  };

  // Trigger custom delete modal
  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    await dispatch(deleteGalleryImage(deleteConfirmId));
    setDeleteConfirmId(null);
  };

  return (
    <div className="relative w-full bg-transparent text-slate-200">
      
      {/* Custom Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl transition-all animate-in slide-in-from-bottom-5 ${
          toast.type === "success" 
            ? "border-emerald-400/20 bg-[#0b1b30] text-emerald-400 shadow-emerald-400/10" 
            : "border-red-400/20 bg-[#0b1b30] text-red-400 shadow-red-400/10"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-semibold">{toast.msg}</p>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)}>
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            
            <h3 className="text-lg font-bold text-white">Delete Image?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to delete this gallery image? This action cannot be undone.
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

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942]">
          <Images size={21} className="text-cyan-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Gallery
          </h2>
          <p className="text-sm text-slate-400">
            Add photos to showcase your business
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="rounded-2xl border-2 border-dashed border-[#29435f] bg-[#0b1b30]/50 p-6 transition-all hover:border-cyan-400/40 hover:bg-[#0b1b30]">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942]">
            <Upload size={25} className="text-cyan-400" />
          </div>

          <h3 className="mb-1 text-base font-semibold text-white">
            Add Gallery Images
          </h3>

          <p className="mb-4 text-sm text-slate-400">
            Upload photos of your business, products or services
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || selectedImages.length >= 10}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition-all hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Images
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
            multiple
            onChange={handleAddImages}
            className="hidden"
          />

          <p className="mt-3 text-xs text-slate-500">
            Maximum 10 images per upload · 5MB per image
          </p>
        </div>
      </div>

      {/* Upload title and selected images */}
      {selectedImages.length > 0 && (
        <div className="mt-6 rounded-2xl border border-[#29435f] bg-[#0b1b30] p-5">
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Gallery Title (optional)
          </label>

          <input
            type="text"
            maxLength={150}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for these images"
            className="mb-5 w-full rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/[0.07]"
          />

          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">
              Selected Images
            </h3>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-400">
              {selectedImages.length} {selectedImages.length === 1 ? "Image" : "Images"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {selectedImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl border border-[#29435f] bg-[#132942]"
              >
                <img
                  src={image.url}
                  alt="Selected gallery preview"
                  className="h-36 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveSelectedImage(image.id)}
                  disabled={uploading}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white opacity-100 backdrop-blur-sm transition-all hover:bg-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                  title="Remove selected image"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleUploadImages}
            disabled={uploading}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload to Gallery
              </>
            )}
          </button>
        </div>
      )}

      {/* Saved Gallery Images from Backend */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Your Gallery
          </h3>

          <span className="rounded-full border border-[#29435f] bg-[#132942] px-3 py-1 text-xs font-bold text-slate-300">
            {gallery.length} {gallery.length === 1 ? "Image" : "Images"}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#29435f] bg-[#0b1b30] py-10 text-sm text-slate-400">
            <Loader2 size={20} className="animate-spin text-cyan-400" />
            Loading gallery...
          </div>
        ) : gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((image) => (
              <div
                key={image._id}
                className="group relative overflow-hidden rounded-xl border border-[#29435f] bg-[#132942] transition-all hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/5"
              >
                <img
                  src={image.thumbnailUrl || image.imageUrl}
                  alt={image.title || "Gallery image"}
                  className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {image.title && (
                  <p className="truncate px-3 py-2 text-sm font-medium text-slate-300">
                    {image.title}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteClick(image._id)}
                  disabled={deleting}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white opacity-100 backdrop-blur-sm transition-all hover:bg-red-500 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                  title="Delete gallery image"
                >
                  {deleting && deleteConfirmId === image._id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#29435f] bg-[#0b1b30]/50 py-10 text-center">
            <Images size={32} className="mx-auto mb-3 text-slate-500 opacity-50" />
            <p className="text-sm text-slate-400">No gallery images added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;