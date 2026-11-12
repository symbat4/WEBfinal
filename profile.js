document.addEventListener("DOMContentLoaded", () => {
  const details = document.getElementById("profileDetails");
  let user;
  try {
    const email = localStorage.getItem("medasymCurrentUser");
    const users = JSON.parse(localStorage.getItem("medasymUsers") || "[]");
    user = email && Array.isArray(users) ? users.find(u => u.email === email) : null;
  } catch (_) { user = null; }
  if (!user) { window.location.replace("signin.html"); return; }
  const rows = [["Full Name",user.name],["Email",user.email],["Phone",user.phone || "Not provided"],["Order Type",user.orderType || "Not selected"],["Newsletter",user.newsletter ? "Subscribed" : "Not subscribed"]];
  const list = document.createElement("dl"); list.className = "row";
  rows.forEach(([label,value]) => {
    const dt = document.createElement("dt"); dt.className = "col-sm-4"; dt.textContent = label;
    const dd = document.createElement("dd"); dd.className = "col-sm-8"; dd.textContent = value;
    list.append(dt,dd);
  });
  details.appendChild(list);
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("medasymCurrentUser"); window.location.href = "signin.html";
  });
});
