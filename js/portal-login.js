document.addEventListener("DOMContentLoaded", () => {
  const existing = getPortalUser();
  if (existing && existing.account_no) {
    window.location.href = "portal.html";
    return;
  }

  const form = document.getElementById("portalLoginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const account_no = document.getElementById("account_no")?.value.trim() || "";
    const portal_password = document.getElementById("portal_password")?.value.trim() || "";

    if (!account_no || !portal_password) {
      showMessage("portalLoginMessage", "Account No and password are required.", true);
      return;
    }

    showMessage("portalLoginMessage", "Signing in...", false);

    try {
      const result = await apiPost({
        action: "portalLogin",
        account_no,
        portal_password
      });

      if (!result || !result.success) {
        showMessage("portalLoginMessage", result?.message || "Login failed.", true);
        return;
      }

      savePortalUser(result.data || {});
      window.location.href = "portal.html";
    } catch (err) {
      console.error("Portal login error:", err);
      showMessage("portalLoginMessage", "Unable to connect to server.", true);
    }
  });
});
