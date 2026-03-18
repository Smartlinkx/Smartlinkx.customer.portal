const PORTAL_STORAGE_KEY = "isp_portal_user";

function getApiBaseUrl() {
  if (typeof APP_CONFIG === "undefined" || !APP_CONFIG || !APP_CONFIG.API_BASE_URL) {
    throw new Error("Missing APP_CONFIG.API_BASE_URL");
  }
  return String(APP_CONFIG.API_BASE_URL).trim();
}

function buildApiUrl(params = {}) {
  const url = new URL(getApiBaseUrl());
  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && String(value) !== "") {
      url.searchParams.set(key, value);
    }
  });
  url.searchParams.set("_ts", Date.now().toString());
  return url.toString();
}

async function apiGet(params = {}) {
  const response = await fetch(buildApiUrl(params), {
    method: "GET",
    redirect: "follow"
  });

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("GET invalid JSON:", text);
    throw new Error("Server returned invalid JSON.");
  }
}

async function apiPost(payload = {}) {
  const response = await fetch(getApiBaseUrl(), {
    method: "POST",
    redirect: "follow",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload || {})
  });

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("POST invalid JSON:", text);
    throw new Error("Server returned invalid JSON.");
  }
}

function savePortalUser(user) {
  localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(user || {}));
}

function getPortalUser() {
  try {
    const raw = localStorage.getItem(PORTAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function portalLogout() {
  localStorage.removeItem(PORTAL_STORAGE_KEY);
  window.location.href = "portal-login.html";
}

function showMessage(elementId, message, isError = false) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = message || "";
  el.style.display = message ? "block" : "none";
  el.style.color = isError ? "#b91c1c" : "#065f46";
  el.style.background = isError ? "#fee2e2" : "#d1fae5";
  el.style.border = isError ? "1px solid #fecaca" : "1px solid #a7f3d0";
  el.style.padding = message ? "10px 12px" : "0";
  el.style.marginTop = message ? "12px" : "0";
  el.style.borderRadius = "8px";
}

function formatMoney(value) {
  const num = Number(value || 0);
  return "₱" + num.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value ?? "");
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? "";
}
