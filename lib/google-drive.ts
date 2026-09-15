/** Validate the host and extract only the file ID/resource key. Never fetch a supplied URL. */
function driveFile(value: string) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("لینک فایل Google Drive معتبر نیست.");
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== "drive.google.com" ||
    url.port ||
    url.username ||
    url.password
  ) {
    throw new Error("لینک باید از https://drive.google.com باشد.");
  }
  const path = /^\/file\/d\/([A-Za-z0-9_-]+)(?:\/(?:view|preview))?\/?$/.exec(
    url.pathname,
  );
  const id =
    path?.[1] ??
    (["/open", "/uc"].includes(url.pathname) &&
    url.searchParams.getAll("id").length === 1
      ? url.searchParams.get("id")
      : null);
  const resourceKey = url.searchParams.get("resourcekey");
  if (
    !id ||
    !/^[A-Za-z0-9_-]{10,200}$/.test(id) ||
    (resourceKey && !/^[A-Za-z0-9_-]{1,200}$/.test(resourceKey))
  ) {
    throw new Error(
      "لینک اشتراک‌گذاری یک فایل Google Drive را وارد کنید؛ لینک پوشه پذیرفته نمی‌شود.",
    );
  }
  return { id, resourceKey };
}
export function normalizeGoogleDriveUrl(value: string) {
  const { id, resourceKey } = driveFile(value);
  const url = new URL(`https://drive.google.com/file/d/${id}/view`);
  if (resourceKey) url.searchParams.set("resourcekey", resourceKey);
  return url.toString();
}
export function googleDriveDownloadUrl(value: string) {
  const { id, resourceKey } = driveFile(value);
  const url = new URL("https://drive.google.com/uc");
  url.searchParams.set("export", "download");
  url.searchParams.set("id", id);
  if (resourceKey) url.searchParams.set("resourcekey", resourceKey);
  return url.toString();
}
