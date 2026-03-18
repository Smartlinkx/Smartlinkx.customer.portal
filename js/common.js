const STORAGE_KEY_USER = "isp_current_user";

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user || {}));
}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY_USER);
}

function logout() {
  clearCurrentUser();
  window.location.href = "index.html";
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
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function apiGet(params = {}) {
  const url = new URL(APP_CONFIG.API_BASE_URL);

  Object.keys(params || {}).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null && String(value) !== "") {
      url.searchParams.set(key, value);
    }
  });

  url.searchParams.set("_ts", Date.now().toString());

  const response = await fetch(url.toString(), {
    method: "GET"
  });

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("GET raw response:", text);
    throw new Error("Server returned invalid JSON.");
  }
}

async function apiPost(payload = {}) {
  const response = await fetch(APP_CONFIG.API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload || {})
  });

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("POST raw response:", text);
    throw new Error("Server returned invalid JSON.");
  }
}
