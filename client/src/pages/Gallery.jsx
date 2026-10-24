import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Images, Plus, Trash2, Upload, Loader2 } from "lucide-react";

import {
  uploadGalleryImages,
  getMyGallery,
  deleteGalleryImage,
  clearGalleryError,
  clearGalleryMessage,
} from "../redux/slice/gallerySlice";

const defaultTheme = {
  primary: "#6366f1",
  accent: "#818cf8",
  text: "#1f2937",
  muted: "#6b7280",
  card: "#ffffff",
  primaryText: "#ffffff",
};

const Gallery = ({ theme = defaultTheme }) => {
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

  // Fetch gallery images from backend
  useEffect(() => {
    dispatch(getMyGallery());

    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
    // Fetch once when this component mounts.
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
      alert(
        "Only JPEG, PNG, JPG, WEBP, and GIF images up to 5MB each are allowed.",
      );
    }

    setSelectedImages((prev) => {
      const remainingSlots = Math.max(0, 10 - prev.length);
      const filesToAdd = validFiles.slice(0, remainingSlots);

      if (filesToAdd.length < validFiles.length) {
        alert("You can select a maximum of 10 images per upload.");
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

    dispatch(clearGalleryError());
    dispatch(clearGalleryMessage());

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

      // Get latest backend data
      dispatch(getMyGallery());
    }
  };

  // Delete image from backend
  const handleDeleteImage = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery image?",
    );

    if (!confirmed) return;

    await dispatch(deleteGalleryImage(id));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `${theme.primary}15` }}
          >
            <Images size={21} style={{ color: theme.primary }} />
          </div>

          <div>
            <h2 className="text-xl font-bold" style={{ color: theme.text }}>
              Gallery
            </h2>

            <p className="text-sm" style={{ color: theme.muted }}>
              Add photos to showcase your business
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className="rounded-2xl border-2 border-dashed p-6 transition-all"
        style={{
          borderColor: `${theme.primary}45`,
          background: `${theme.primary}06`,
        }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: `${theme.primary}15` }}
          >
            <Upload size={25} style={{ color: theme.primary }} />
          </div>

          <h3
            className="mb-1 text-base font-semibold"
            style={{ color: theme.text }}
          >
            Add Gallery Images
          </h3>

          <p className="mb-4 text-sm" style={{ color: theme.muted }}>
            Upload photos of your business, products or services
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || selectedImages.length >= 10}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: theme.primary,
              color: theme.primaryText || "#fff",
            }}
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

          <p className="mt-3 text-xs" style={{ color: theme.muted }}>
            Maximum 10 images per upload · 5MB per image
          </p>
        </div>
      </div>

      {/* Upload title and selected images */}
      {selectedImages.length > 0 && (
        <div className="mt-6">
          <label
            className="mb-2 block text-sm font-semibold"
            style={{ color: theme.text }}
          >
            Gallery Title (optional)
          </label>

          <input
            type="text"
            maxLength={150}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for these images"
            className="mb-5 w-full rounded-xl border px-4 py-3 text-sm outline-none"
            style={{
              borderColor: `${theme.primary}35`,
              background: theme.card,
              color: theme.text,
            }}
          />

          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
              Selected Images
            </h3>

            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                color: theme.primary,
                background: `${theme.primary}12`,
              }}
            >
              {selectedImages.length}{" "}
              {selectedImages.length === 1 ? "Image" : "Images"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {selectedImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-2xl border"
                style={{
                  borderColor: `${theme.primary}20`,
                  background: theme.card,
                }}
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
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg opacity-100 transition-all sm:opacity-0 sm:group-hover:opacity-100"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                  }}
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
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: theme.primary,
              color: theme.primaryText || "#fff",
            }}
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

      {/* Status messages */}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl p-3 text-sm"
          style={{ background: "#fee2e2", color: "#b91c1c" }}
        >
          {error}
        </p>
      )}

      {message && (
        <p
          role="status"
          className="mt-4 rounded-xl p-3 text-sm"
          style={{ background: "#dcfce7", color: "#166534" }}
        >
          {message}
        </p>
      )}

      {/* Saved Gallery Images from Backend */}
      <div className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
            Your Gallery
          </h3>

          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{
              color: theme.primary,
              background: `${theme.primary}12`,
            }}
          >
            {gallery.length} {gallery.length === 1 ? "Image" : "Images"}
          </span>
        </div>

        {loading ? (
          <div
            className="flex items-center justify-center gap-2 py-10 text-sm"
            style={{ color: theme.muted }}
          >
            <Loader2 size={20} className="animate-spin" />
            Loading gallery...
          </div>
        ) : gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((image) => (
              <div
                key={image._id}
                className="group relative overflow-hidden rounded-2xl border"
                style={{
                  borderColor: `${theme.primary}20`,
                  background: theme.card,
                }}
              >
                <img
                  src={image.thumbnailUrl || image.imageUrl}
                  alt={image.title || "Gallery image"}
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />

                {image.title && (
                  <p
                    className="truncate px-3 py-2 text-sm font-medium"
                    style={{ color: theme.text }}
                  >
                    {image.title}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteImage(image._id)}
                  disabled={deleting}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg opacity-100 transition-all disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                  }}
                  title="Delete gallery image"
                >
                  {deleting ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl py-8 text-center"
            style={{
              background: `${theme.primary}04`,
              color: theme.muted,
            }}
          >
            <Images size={28} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No gallery images added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
