import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShoppingBag,
  UserRound,
  Image as ImageIcon,
  ExternalLink,
  Pencil,
  LoaderCircle,
} from "lucide-react";

import api from "../../redux/api";
import { fetchAdminUserProfile } from "../../redux/slice/adminSlice";

const panel =
  "rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition-colors dark:border-[#294560] dark:bg-[#142b45] dark:text-white sm:p-6";

const iconButton =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-cyan-500 hover:text-cyan-600 dark:border-[#294560] dark:bg-[#142b45] dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400";

export default function AdminUserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedUserProfile,
    selectedUserProfileLoading,
    selectedUserProfileError,
  } = useSelector((state) => state.admin);

  const [publicData, setPublicData] = useState(null);
  const [publicLoading, setPublicLoading] = useState(false);
  const [publicError, setPublicError] = useState("");

  useEffect(() => {
    if (userId) dispatch(fetchAdminUserProfile(userId));
  }, [dispatch, userId]);

  const user =
    selectedUserProfile?.user?._id === userId ? selectedUserProfile.user : null;

  const profile =
    selectedUserProfile?.user?._id === userId
      ? selectedUserProfile.profile
      : null;

  useEffect(() => {
    let cancelled = false;

    async function loadPublicData() {
      if (!profile?.subdomain) {
        setPublicData(null);
        return;
      }

      setPublicLoading(true);
      setPublicError("");

      try {
        const response = await api.get(
          `/profile/public/${encodeURIComponent(profile.subdomain)}`,
        );

        if (!cancelled) {
          setPublicData(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          setPublicError(
            error.response?.data?.message ||
              "Additional public profile data could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) setPublicLoading(false);
      }
    }

    loadPublicData();

    return () => {
      cancelled = true;
    };
  }, [profile?.subdomain]);

  if (selectedUserProfileLoading && !user) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
        <LoaderCircle className="animate-spin" />
        Loading user profile...
      </div>
    );
  }

  if (selectedUserProfileError && !user) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-red-300">
        <p>{selectedUserProfileError}</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="mt-4 underline"
        >
          Back to Users
        </button>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-600 dark:border-[#294560] dark:bg-[#0b1b30] dark:text-slate-300">
        <p>Business profile is not available for this user.</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="mt-4 text-cyan-400"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const dataProfile = publicData?.profile || profile;
  const products = publicData?.products || dataProfile.products || [];
  const gallery =
    publicData?.gallery ||
    dataProfile.gallery ||
    dataProfile.galleryImages ||
    dataProfile.businessGallery ||
    dataProfile.images ||
    [];

  const socials = Array.isArray(dataProfile.socialCards)
    ? dataProfile.socialCards
    : [];

  const contactButtons = Array.isArray(dataProfile.contactButtons)
    ? dataProfile.contactButtons
        .filter((item) => item && item.enabled !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const fullName =
    [dataProfile.firstName, dataProfile.lastName].filter(Boolean).join(" ") ||
    user.fullName ||
    dataProfile.businessName ||
    "Business Profile";

  const location = [
    dataProfile.shopUnit,
    dataProfile.area,
    dataProfile.city,
    dataProfile.state,
    dataProfile.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const imageUrl = (item) =>
    typeof item === "string"
      ? item
      : item?.imageUrl ||
        item?.image ||
        item?.url ||
        item?.src ||
        item?.thumbnail ||
        "";

  const socialIcon = () => Globe;

  const website = dataProfile.websiteUrl || dataProfile.website;

  return (
    <div className="min-h-screen bg-slate-50 p-3 text-slate-900 transition-colors dark:bg-[#09182b] dark:text-white sm:p-5">
      <div className="mx-auto max-w-[1500px] space-y-5">
        {/* Admin toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
          >
            <ArrowLeft size={17} />
            Back to Users
          </button>

          <button
            onClick={() => navigate(`/admin/users/${userId}/edit`)}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-[#061526] transition hover:bg-cyan-400"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>

        {/* Banner and profile identity */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors dark:border-[#294560] dark:bg-[#0b1b30]">
          <div className="relative h-40 overflow-hidden bg-gradient-to-r from-[#43545c] via-[#9a9d7c] to-[#24394b] sm:h-52">
            {dataProfile.banner && (
              <img
                src={dataProfile.banner}
                alt="Business banner"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#102844] via-transparent to-black/10" />
          </div>

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-[6px] border-white bg-slate-50 shadow-xl transition-colors dark:border-[#0b1b30] dark:bg-[#203b56] sm:h-40 sm:w-40">
                {dataProfile.avatar || dataProfile.profileImage ? (
                  <img
                    src={dataProfile.avatar || dataProfile.profileImage}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="m-auto h-full w-full p-8 text-slate-500 dark:text-slate-400" />
                )}
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="break-words text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {fullName}
                  </h1>
                  {dataProfile.isVerified && (
                    <BadgeCheck className="text-cyan-400" size={25} />
                  )}
                </div>

                <p className="mt-2 font-semibold text-cyan-400">
                  {dataProfile.jobTitle || "Business Owner"}
                </p>

                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {dataProfile.businessName || "Business Name Not Provided"}
                </p>

                {location && (
                  <p className="mt-2 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    {location}
                  </p>
                )}
              </div>

              {dataProfile.logo && (
                <div className="flex h-16 w-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 transition-colors dark:border-[#294560] dark:bg-[#0b1b30]">
                  <img
                    src={dataProfile.logo}
                    alt="Business logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Contact actions */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {dataProfile.phone && (
                <a
                  href={`tel:${dataProfile.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-[#061526]"
                >
                  <Phone size={18} /> Call
                </a>
              )}

              {dataProfile.whatsapp && (
                <a
                  href={`https://wa.me/${String(dataProfile.whatsapp).replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
              )}

              {website && (
                <a
                  href={
                    website.startsWith("http") ? website : `https://${website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/50 bg-[#10364c] px-4 py-3 font-semibold text-cyan-300"
                >
                  <Globe size={18} /> Website
                </a>
              )}

              {dataProfile.email && (
                <a
                  href={`mailto:${dataProfile.email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold"
                >
                  <Mail size={18} /> Email
                </a>
              )}
            </div>

            {/* Social icon row */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socials.map((social, index) => {
                const Icon = socialIcon(social.platformName || social.platform);

                return (
                  <a
                    key={social._id || social.id || index}
                    href={social.url || "#"}
                    target={social.url ? "_blank" : undefined}
                    rel={social.url ? "noreferrer" : undefined}
                    title={social.platformName || social.platform}
                    className={iconButton}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main two-column layout */}
        <div className="grid items-start gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            {/* Contact details */}
            <section className={panel}>
              <h2 className="mb-5 text-xl font-bold">Contact Details</h2>

              <div className="space-y-4 text-sm sm:text-base">
                {[
                  [Phone, dataProfile.phone],
                  [MessageCircle, dataProfile.whatsapp],
                  [Mail, dataProfile.email || user.email],
                  [Globe, website || "Website not provided"],
                ].map(([Icon, value], index) => (
                  <div key={index} className="flex min-w-0 items-start gap-3">
                    <Icon size={19} className="mt-0.5 shrink-0 text-cyan-400" />
                    <span className="break-words text-slate-700 dark:text-slate-200">
                      {value || "Not provided"}
                    </span>
                  </div>
                ))}

                {location && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={19}
                      className="mt-0.5 shrink-0 text-cyan-400"
                    />
                    <span className="text-slate-700 dark:text-slate-200">
                      {location}
                    </span>
                  </div>
                )}

                {dataProfile.businessHours && (
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={19}
                      className="mt-0.5 shrink-0 text-cyan-400"
                    />
                    <span className="whitespace-pre-line text-slate-700 dark:text-slate-200">
                      {typeof dataProfile.businessHours === "string"
                        ? dataProfile.businessHours
                        : JSON.stringify(dataProfile.businessHours)}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Social links */}
            <section className={panel}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">Social Links</h2>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                  {socials.length} linked
                </span>
              </div>

              {socials.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {socials.map((social, index) => {
                    const Icon = socialIcon(
                      social.platformName || social.platform,
                    );

                    return (
                      <a
                        key={social._id || social.id || index}
                        href={social.url || "#"}
                        target={social.url ? "_blank" : undefined}
                        rel={social.url ? "noreferrer" : undefined}
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-cyan-500/60 dark:border-[#294560] dark:bg-[#0b1b30]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-[#123b57] dark:text-cyan-300">
                          <Icon size={19} />
                        </span>
                        <span className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {social.platformName ||
                            social.platform ||
                            "Social Link"}
                        </span>
                        <ExternalLink
                          size={14}
                          className="ml-auto shrink-0 text-slate-500 dark:text-slate-400"
                        />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No social links added.
                </p>
              )}
            </section>

            {/* Account metadata */}
            <section className={panel}>
              <h2 className="mb-4 text-xl font-bold">Account Information</h2>
              <div className="space-y-4 text-sm">
                <Info label="Login Email" value={user.email} />
                <Info label="Account Phone" value={user.phone} />
                <Info label="Referral Code" value={user.referralCode} />
                <Info
                  label="Registered"
                  value={
                    user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN")
                      : "—"
                  }
                />
                <Info label="Subdomain (Read Only)" value={profile.subdomain} />
              </div>
            </section>
          </div>

          <div className="space-y-5">
            {/* About */}
            <section className={panel}>
              <h2 className="mb-5 text-xl font-bold">About Me</h2>
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                {dataProfile.bio ||
                  dataProfile.headline ||
                  "No biography added yet."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {dataProfile.industry && (
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-cyan-700 transition-colors dark:border-[#294560] dark:bg-[#0b1b30] dark:text-cyan-300">
                    {dataProfile.industry}
                  </span>
                )}
                {dataProfile.businessName && (
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-cyan-700 transition-colors dark:border-[#294560] dark:bg-[#0b1b30] dark:text-cyan-300">
                    {dataProfile.businessName}
                  </span>
                )}
              </div>
            </section>

            {/* Featured products */}
            <section className={panel}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <ShoppingBag className="text-cyan-400" size={21} />
                  Featured Products
                </h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {products.length} items
                </span>
              </div>

              {products.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {products.map((product, index) => (
                    <article
                      key={product._id || product.id || index}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors dark:border-[#294560] dark:bg-[#0b1b30]"
                    >
                      {imageUrl(product) && (
                        <img
                          src={imageUrl(product)}
                          alt={product.name || product.title || "Product"}
                          className="h-44 w-full object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold">
                          {product.name || product.title || "Product"}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                          {product.description ||
                            product.shortDescription ||
                            ""}
                        </p>
                        {(product.price !== undefined ||
                          product.salePrice !== undefined) && (
                          <p className="mt-3 font-bold text-cyan-400">
                            ₹{product.salePrice ?? product.price}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {publicLoading
                    ? "Loading products..."
                    : "No products available."}
                </p>
              )}
            </section>

            {/* Gallery */}
            <section className={panel}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <ImageIcon className="text-cyan-400" size={21} />
                  Gallery
                </h2>
                <span className="text-sm text-cyan-400">
                  {gallery.length} photos
                </span>
              </div>

              {gallery.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((item, index) => {
                    const src = imageUrl(item);

                    return src ? (
                      <img
                        key={item._id || item.id || index}
                        src={src}
                        alt={item.title || `Gallery image ${index + 1}`}
                        className="h-32 w-full rounded-xl object-cover sm:h-40"
                      />
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No gallery photos available.
                </p>
              )}
            </section>

            {/* Reviews */}
            <section className={panel}>
              <h2 className="mb-4 text-xl font-bold">Reviews</h2>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                Review data is not included in the current profile response.
              </p>
            </section>

            {/* Inquiry preview */}
            <section className={panel}>
              <h2 className="mb-5 text-xl font-bold">Send an Inquiry</h2>
              <div className="space-y-4">
                <input
                  disabled
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 opacity-80 placeholder:text-slate-500 transition-colors dark:border-[#294560] dark:bg-[#0b1b30] dark:text-slate-200 dark:placeholder:text-slate-400"
                />
                <input
                  disabled
                  placeholder="Phone"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 opacity-80 placeholder:text-slate-500 transition-colors dark:border-[#294560] dark:bg-[#0b1b30] dark:text-slate-200 dark:placeholder:text-slate-400"
                />
                <input
                  disabled
                  placeholder="Email (optional)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 opacity-80 placeholder:text-slate-500 transition-colors dark:border-[#294560] dark:bg-[#0b1b30] dark:text-slate-200 dark:placeholder:text-slate-400"
                />
                <textarea
                  disabled
                  rows={4}
                  placeholder="Message"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 opacity-80 placeholder:text-slate-500 transition-colors dark:border-[#294560] dark:bg-[#0b1b30] dark:text-slate-200 dark:placeholder:text-slate-400"
                />
                <button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-[#061526] opacity-70"
                >
                  <Send size={17} />
                  Inquiry Preview
                </button>
              </div>
            </section>
          </div>
        </div>

        {publicError && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-200">
            {publicError} Some sections may be empty.
          </p>
        )}

        {publicLoading && (
          <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <LoaderCircle size={16} className="animate-spin" />
            Loading products and gallery...
          </p>
        )}

        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 transition-colors dark:border-[#294560] dark:text-slate-400">
          © {new Date().getFullYear()} {fullName}. All rights reserved.
          <p className="mt-2">
            Admin preview ·{" "}
            <span className="font-semibold text-cyan-400">BioWebsite</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 pb-3 last:border-0 dark:border-[#294560]">
      <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="break-words text-slate-700 dark:text-slate-200">
        {value || "—"}
      </span>
    </div>
  );
}
