import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminUserProfile } from "../../redux/slice/adminSlice";

export default function AdminUserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedUserProfile,
    selectedUserProfileLoading,
    selectedUserProfileError,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    if (userId) dispatch(fetchAdminUserProfile(userId));
  }, [dispatch, userId]);

  const isCurrentUser = selectedUserProfile?.user?._id === userId;
  const user = isCurrentUser ? selectedUserProfile.user : null;
  const profile = isCurrentUser ? selectedUserProfile.profile : null;

  const subdomain = profile?.subdomain;
  const previewUrl = subdomain
    ? `/card-preview/${encodeURIComponent(subdomain)}`
    : "";

  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    user?.fullName ||
    profile?.businessName ||
    "Business Profile";

  const address = [
    profile?.shopUnit,
    profile?.area,
    profile?.city,
    profile?.state,
    profile?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  if (selectedUserProfileLoading && !user) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-[#09182b] dark:text-slate-300">
        Loading profile...
      </div>
    );
  }

  if (selectedUserProfileError && !user) {
    return (
      <div className="m-4 rounded-xl border border-red-200 bg-white p-5 dark:border-red-900 dark:bg-[#0b1b30]">
        <p className="text-sm text-red-600 dark:text-red-300">
          {selectedUserProfileError}
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="mt-4 text-sm font-semibold text-cyan-700 dark:text-cyan-400"
        >
          Back to Users
        </button>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="m-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#294560] dark:bg-[#0b1b30]">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No business profile is available for this user.
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="mt-4 text-sm font-semibold text-cyan-700 dark:text-cyan-400"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f8] p-3 text-slate-900 dark:bg-[#09182b] dark:text-slate-100 sm:p-5">
      <div className="mx-auto max-w-[1700px] space-y-4">
        {/* Simple page header */}
        <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-[#294560] dark:bg-[#0b1b30] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-[#294560] dark:hover:bg-[#142b45]"
            >
              Back
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold sm:text-xl">
                {fullName}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {profile.businessName || user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:shrink-0">
            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-center text-sm font-medium hover:bg-slate-50 dark:border-[#294560] dark:hover:bg-[#142b45] sm:flex-none"
              >
                Open Public Profile
              </a>
            )}

            <button
              type="button"
              onClick={() => navigate(`/admin/users/${userId}/edit`)}
              className="flex-1 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 sm:flex-none"
            >
              Edit Profile
            </button>
          </div>
        </header>

        {/* Main workspace */}
        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
          {/* Actual public mini website */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-[#294560] dark:bg-[#0b1b30]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-[#294560]">
              <div>
                <h2 className="text-sm font-semibold">Website Preview</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  The user's actual public website
                </p>
              </div>

              {profile.isVerified && (
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Verified
                </span>
              )}
            </div>

            {previewUrl ? (
              <iframe
                key={subdomain}
                title={`Website preview for ${fullName}`}
                src={previewUrl}
                loading="eager"
                className="block w-full border-0 bg-white"
                style={{
                  height: "min(78vh, 900px)",
                  minHeight: "480px",
                }}
              />
            ) : (
              <div className="p-8 text-center text-sm text-slate-500">
                No public profile URL is available.
              </div>
            )}
          </section>

          {/* Useful information, not another duplicate preview */}
          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#294560] dark:bg-[#0b1b30]">
              <h2 className="text-sm font-semibold">Account Information</h2>

              <dl className="mt-4 space-y-4">
                {[
                  ["Account email", user.email],
                  ["Phone", user.phone],
                  ["Business", profile.businessName],
                  ["Job title", profile.jobTitle],
                  ["Subdomain", subdomain],
                  ["Status", profile.isVerified ? "Verified" : "Not verified"],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs text-slate-500 dark:text-slate-400">
                      {label}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-medium">
                      {value || "Not provided"}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#294560] dark:bg-[#0b1b30]">
              <h2 className="text-sm font-semibold">Business Details</h2>

              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    Address
                  </dt>
                  <dd className="mt-1 break-words text-sm">
                    {address || "Not provided"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    Website
                  </dt>
                  <dd className="mt-1 break-words text-sm">
                    {profile.websiteUrl || profile.website || "Not provided"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    About
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {profile.bio || profile.headline || "No description added."}
                  </dd>
                </div>
              </dl>
            </section>

            {previewUrl && (
              <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#294560] dark:bg-[#0b1b30]">
                <h2 className="text-sm font-semibold">Public URL</h2>
                <p className="mt-2 break-all text-sm text-slate-600 dark:text-slate-300">
                  {window.location.origin + previewUrl}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      window.location.origin + previewUrl,
                    )
                  }
                  className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:border-[#294560] dark:hover:bg-[#142b45]"
                >
                  Copy Profile URL
                </button>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
