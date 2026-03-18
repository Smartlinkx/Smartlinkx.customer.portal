document.addEventListener("DOMContentLoaded", async () => {
  const user = getPortalUser();
  if (!user || !user.account_no) {
    window.location.href = "portal-login.html";
    return;
  }

  const logoutBtn = document.getElementById("portalLogoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", portalLogout);

  setText("portalWelcomeText", `Welcome, ${user.full_name || user.account_no}`);
  await loadPortalDashboard(user.account_no);
});

async function loadPortalDashboard(accountNo) {
  try {
    showMessage("portalMessage", "Loading account...", false);

    const result = await apiGet({
      action: "getPortalDashboard",
      account_no: accountNo
    });

    if (!result || !result.success) {
      showMessage("portalMessage", result?.message || "Failed to load account.", true);
      return;
    }

    const data = result.data || {};
    const profile = data.profile || {};

    setValue("profileAccountNo", profile.account_no || "");
    setValue("profileFullName", profile.full_name || "");
    setValue("profilePlanName", profile.plan_name || "");
    setValue("profileContactNumber", profile.contact_number || "");
    setValue("profileAddress", profile.address || "");

    setText("portalTotalUnpaid", formatMoney(data.total_unpaid || 0));
    setText("portalTotalPaid", formatMoney(data.total_paid || 0));
    setText("portalAdvanceCredit", formatMoney(data.advance_credit || 0));
    setText("portalStatus", profile.status || "-");

    renderPortalBills(data.bills || []);
    renderPortalPayments(data.payments || []);

    showMessage("portalMessage", "Account loaded successfully.", false);
  } catch (err) {
    console.error("Portal dashboard error:", err);
    showMessage("portalMessage", "Unable to load account.", true);
  }
}

function renderPortalBills(data) {
  const tbody = document.getElementById("portalBillsTableBody");
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No billing history.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${escapeHtml(item.billing_id)}</td>
      <td>${escapeHtml(item.billing_month)}</td>
      <td>${escapeHtml(item.due_date)}</td>
      <td>${formatMoney(item.amount)}</td>
      <td>${formatMoney(item.applied_payment || 0)}</td>
      <td>${formatMoney(item.balance || 0)}</td>
      <td>${escapeHtml(item.status)}</td>
    </tr>
  `).join("");
}

function renderPortalPayments(data) {
  const tbody = document.getElementById("portalPaymentsTableBody");
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-cell">No payment history.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${escapeHtml(item.payment_id)}</td>
      <td>${escapeHtml(item.billing_id)}</td>
      <td>${escapeHtml(item.payment_date)}</td>
      <td>${formatMoney(item.amount)}</td>
      <td>${escapeHtml(item.payment_method)}</td>
      <td>${escapeHtml(item.reference)}</td>
    </tr>
  `).join("");
}
