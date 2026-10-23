import React, { useRef, useState } from "react";
import { Images, Plus, Trash2, Upload } from "lucide-react";

const defaultTheme = {
  primary: "#6366f1",
  accent: "#818cf8",
  text: "#1f2937",
  muted: "#6b7280",
  card: "#ffffff",
  primaryText: "#ffffff",
};

const Gallery = ({ theme = defaultTheme }) => {
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const newImages = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    e.target.value = "";
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      return prev.filter((image) => image.id !== id);
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `${theme.primary}15`,
            }}
          >
            <Images
              size={21}
              style={{
                color: theme.primary,
              }}
            />
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
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: `${theme.primary}15`,
            }}
          >
            <Upload size={25} style={{ color: theme.primary }} />
          </div>

          <h3
            className="text-base font-semibold mb-1"
            style={{ color: theme.text }}
          >
            Add Gallery Images
          </h3>

          <p className="text-sm mb-4" style={{ color: theme.muted }}>
            Upload photos of your business, products or services
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
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
            accept="image/*"
            multiple
            onChange={handleAddImages}
            className="hidden"
          />
        </div>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
              Selected Images
            </h3>

            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                color: theme.primary,
                background: `${theme.primary}12`,
              }}
            >
              {images.length} {images.length === 1 ? "Image" : "Images"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group overflow-hidden rounded-2xl border"
                style={{
                  borderColor: `${theme.primary}20`,
                  background: theme.card,
                }}
              >
                <img
                  src={image.url}
                  alt="Gallery preview"
                  className="w-full h-36 object-cover"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                  }}
                  title="Remove image"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div
          className="mt-5 text-center py-6 rounded-2xl"
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
  );
};

export default Gallery;
