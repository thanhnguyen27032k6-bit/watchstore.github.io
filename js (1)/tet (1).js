document.addEventListener("DOMContentLoaded", function () {
    // === MENU CHUYỂN TRANG ===
  
    const defaultContent = document.querySelectorAll(
      ".service-banner, .hotsale-product, .product-section, .about-section, .review-section"
    );
    const pages = document.querySelectorAll(".page");
  
    // Object links này phải khớp với các ID trong HTML ở Bước 1
    const links = {
      home: document.querySelector(".inner-logo a"), 
      xuhuong: document.getElementById("xuhuong-link"), 
      nam: document.getElementById("nam-link"),
      nu: document.getElementById("nu-link"),
    };
  
    function hienTrang(id) {
      pages.forEach((p) => p.classList.add("hidden"));
      defaultContent.forEach((c) => c.classList.add("hidden"));
  
      if (id === "home") {
        defaultContent.forEach((c) => c.classList.remove("hidden"));
      } else {
        const page = document.getElementById(id);
        if (page) {
          page.classList.remove("hidden");
        }
      }
      window.scrollTo(0, 0);
    }
  
    Object.keys(links).forEach((key) => {
      if (links[key]) { 
        links[key].addEventListener("click", (e) => {
          e.preventDefault();
          hienTrang(key); // `key` ở đây sẽ là 'home', 'xuhuong', 'nam', 'nu'
        });
      }
    });
  
    // === SLIDESHOW (banner) ===
    const slidesContainers = document.querySelectorAll(".slides");
    slidesContainers.forEach((slides) => {
      const dots = slides.parentElement.querySelectorAll(".navigation li");
      const total = dots.length;
      let index = 0;
  
      function showSlide(i) {
        if (total > 0) {
          slides.style.marginLeft = `-${(i * 100)}%`;
        }
        dots.forEach((d) => d.classList.remove("kichhoat"));
        if (dots[i]) {
          dots[i].classList.add("kichhoat");
        }
      }
  
      dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
          index = i;
          showSlide(index);
        });
      });
  
      const slideInterval = setInterval(() => {
        index = (index + 1) % total;
        showSlide(index);
      }, 5000);
  
      showSlide(0);
    });
    
    // Mặc định hiển thị trang chủ
    hienTrang('home');
  });
  
  /* auth.js - Đăng ký / Đăng nhập / Profile (JS only) */
  
  /* ----------------- Helpers ----------------- */
  function normalizePhone(raw) {
    if (!raw) return "";
    return String(raw).replace(/\D/g, "").trim();
  }
  
  function escapeHtml(str) {
    if (str === undefined || str === null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  
  function safeQuery(root, selector) {
    if (!root) return null;
    return root.querySelector(selector);
  }
  
  /* ----------------- Storage helpers ----------------- */
  function getUsersArray() {
    try {
      return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    } catch (e) {
      console.error("Parse registeredUsers failed", e);
      return [];
    }
  }
  function setUsersArray(arr) {
    localStorage.setItem("registeredUsers", JSON.stringify(arr));
  }
  function getLoggedRaw() {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser") || "null");
    } catch (e) {
      return null;
    }
  }
  function setLogged(obj) {
    localStorage.setItem("loggedInUser", JSON.stringify(obj));
  }
  function clearLogged() {
    localStorage.removeItem("loggedInUser");
  }
  
  function handleRegister(e) {
    if (e && e.preventDefault) e.preventDefault();
    const form = document.querySelector(".register-form");
    if (!form) return false;
  
    const fullname = (safeQuery(form, ".register-fullname") || {}).value?.trim() || "";
    const birthdate = (safeQuery(form, ".register-birthdate") || {}).value || "";
    const phone = normalizePhone((safeQuery(form, ".register-phone") || {}).value || "");
    const email = (safeQuery(form, ".register-email") || {}).value?.trim() || "";
    const password = (safeQuery(form, ".register-password") || {}).value || "";
    const confirm = (safeQuery(form, ".register-confirm") || {}).value || "";
  
    if (!fullname || !birthdate || !phone || !password) {
      alert("Vui lòng nhập đầy đủ thông tin đăng ký.");
      return false;
    }
    if (password !== confirm) {
      alert("Mật khẩu không khớp.");
      return false;
    }
  
    const users = getUsersArray();
    if (users.some(u => normalizePhone(u.phone) === phone)) {
      alert("Số điện thoại đã được đăng ký. Vui lòng đăng nhập hoặc dùng số khác.");
      return false;
    }
  
    const newUser = {
      fullname,
      birthdate,
      phone,
      email,
      password,
      savedAt: new Date().toISOString()
    };
    users.push(newUser);
    setUsersArray(users);
  
  
    if (typeof hideRegisterOverlay === "function") hideRegisterOverlay();
    // or try close overlay by id
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";
  
    alert("Đăng ký thành công! Hãy đăng nhập.");
    form.reset();
    return true;
  }
  
  function handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const form = document.querySelector(".login-form") || document.querySelector(".user-login-form");
    if (!form) {
      console.error("Không tìm thấy form đăng nhập (.login-form).");
      return false;
    }
  
    const phone = normalizePhone((safeQuery(form, ".login-phone") || {}).value || "");
    const password = (safeQuery(form, ".login-password") || {}).value || "";
  
    if (!phone || !password) {
      alert("Nhập số điện thoại và mật khẩu.");
      return false;
    }
  
    const users = getUsersArray();
    const found = users.find(u => normalizePhone(u.phone) === phone && u.password === password);
  
    if (!found) {
      alert("Sai số điện thoại hoặc mật khẩu.");
      const p = safeQuery(form, ".login-password");
      if (p) p.value = "";
      return false;
    }
  
    setLogged({
      phone: found.phone,
      fullname: found.fullname,
      loggedAt: new Date().toISOString()
    });
  
    const current = location.pathname.split("/").pop();
    if (current === "page/user.html") {
      window.location.reload();
    } else {
      window.location.href = "../index.html";
    }
    return true;
  }
  
  /* ----------------- PROFILE DISPLAY & MODAL ----------------- */
  function ensureProfileContainer() {
    let container = document.querySelector(".profile");
    if (!container) {
      const headerRight = document.querySelector(".header-right") || document.querySelector("header");
      container = document.createElement("div");
      container.className = "profile";
      if (headerRight) headerRight.appendChild(container);
      else document.body.appendChild(container);
    }
    return container;
  }
  
  function getCurrentUserRecord() {
    const logged = getLoggedRaw();
    if (!logged) return null;
    const users = getUsersArray();
    return users.find(u => normalizePhone(u.phone) === normalizePhone(logged.phone)) || null;
  }
  
  function renderProfileBox() {
    const container = ensureProfileContainer();
    if (!container) return;
  
    const logged = getLoggedRaw();
    if (!logged) {
      container.innerHTML = `
        <span class="profile-text">Chưa đăng nhập.</span>
        <a class="profile-login" href="page/user.html">Đăng nhập</a>
      `;
      const regBtn = container.querySelector("#openRegisterBtn");
      if (regBtn) regBtn.addEventListener("click", () => {
        if (typeof showRegisterOverlay === "function") return showRegisterOverlay();
        const overlay = document.getElementById("overlay");
        if (overlay) overlay.style.display = "flex";
        const f = document.querySelector(".register-form");
        if (f) f.querySelector(".register-fullname")?.focus();
      });
      return;
    }
  
    const displayName = escapeHtml(logged.fullname || logged.phone || "Tài khoản");
    container.innerHTML = `
      <span class="profile-text">Xin chào, <strong>${displayName}</strong></span>
      <button class="profile-edit" id="btnOpenEditProfile" type="button">Profile</button>
      <button class="profile-logout" id="btnLogout" type="button">Đăng xuất</button>
    `;
  
    const btnLogout = container.querySelector("#btnLogout");
    if (btnLogout) btnLogout.addEventListener("click", handleLogoutFromHeader);
  
    const btnEdit = container.querySelector("#btnOpenEditProfile");
    if (btnEdit) btnEdit.addEventListener("click", openProfileModal);
  }
  
  /* ----------------- Logout ----------------- */
  function handleLogoutFromHeader(e) {
    clearLogged();
    renderProfileBox();
    window.location.reload();
  }
  
  function openProfileModal() {
    const modal = document.getElementById("profileModal") || document.getElementById("profile-modal");
    if (!modal) {
      const rec = getCurrentUserRecord();
      if (!rec) return alert("Không tìm thấy thông tin người dùng.");
      const newName = prompt("Họ tên:", rec.fullname || "");
      if (newName === null) return;
      const newEmail = prompt("Email:", rec.email || "");
      if (newEmail === null) return;
      saveProfileEditsFallback(newName.trim(), rec.birthdate || "", rec.phone, newEmail.trim());
      return;
    }
  
    const rec = getCurrentUserRecord();
    if (!rec) return alert("Không tìm thấy thông tin người dùng.");
  
    const fullnameEl = document.getElementById("edit-fullname") || modal.querySelector(".edit-fullname");
    const birthEl = document.getElementById("edit-birthdate") || modal.querySelector(".edit-birthdate");
    const phoneEl = document.getElementById("edit-phone") || modal.querySelector(".edit-phone");
    const emailEl = document.getElementById("edit-email") || modal.querySelector(".edit-email");
  
    if (fullnameEl) fullnameEl.value = rec.fullname || "";
    if (birthEl) birthEl.value = rec.birthdate || "";
    if (phoneEl) phoneEl.value = rec.phone || "";
    if (emailEl) emailEl.value = rec.email || "";
  
    modal.style.display = "flex";
  }
  
  function closeProfileModal() {
    const modal = document.getElementById("profileModal") || document.getElementById("profile-modal");
    if (modal) modal.style.display = "none";
  }
  
  function saveProfileEditsFallback(fullname, birthdate, phone, email) {
    let users = getUsersArray();
    const idx = users.findIndex(u => normalizePhone(u.phone) === normalizePhone(phone));
    if (idx === -1) {
      alert("Không tìm thấy tài khoản để cập nhật.");
      return false;
    }
    users[idx].fullname = fullname;
    users[idx].birthdate = birthdate;
    users[idx].email = email;
    users[idx].updatedAt = new Date().toISOString();
    setUsersArray(users);
  
    const logged = getLoggedRaw();
    if (logged && normalizePhone(logged.phone) === normalizePhone(phone)) {
      setLogged({ phone, fullname, loggedAt: new Date().toISOString() });
    }
    alert("Cập nhật thông tin thành công.");
    renderProfileBox();
    return true;
  }
  
  function handleProfileEditSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    const fullnameEl = document.getElementById("edit-fullname") || document.querySelector(".edit-fullname");
    const birthEl = document.getElementById("edit-birthdate") || document.querySelector(".edit-birthdate");
    const phoneEl = document.getElementById("edit-phone") || document.querySelector(".edit-phone");
    const emailEl = document.getElementById("edit-email") || document.querySelector(".edit-email");
  
    const fullname = (fullnameEl && fullnameEl.value?.trim()) || "";
    const birthdate = (birthEl && birthEl.value) || "";
    const phone = normalizePhone((phoneEl && phoneEl.value) || "");
    const email = (emailEl && emailEl.value?.trim()) || "";
  
    if (!fullname || !birthdate || !phone) {
      alert("Vui lòng nhập đầy đủ: họ tên, ngày sinh, số điện thoại.");
      return false;
    }
  
    let users = getUsersArray();
    const idx = users.findIndex(u => normalizePhone(u.phone) === phone);
    if (idx === -1) {
      alert("Không tìm thấy tài khoản để cập nhật.");
      return false;
    }
  
    users[idx].fullname = fullname;
    users[idx].birthdate = birthdate;
    users[idx].email = email;
    users[idx].updatedAt = new Date().toISOString();
    setUsersArray(users);
  
    const logged = getLoggedRaw();
    if (logged && normalizePhone(logged.phone) === phone) {
      setLogged({ phone, fullname, loggedAt: new Date().toISOString() });
    }
  
    alert("Cập nhật thông tin thành công.");
    closeProfileModal();
    renderProfileBox();
    return true;
  }
  
  /* ----------------- Init & Event wiring ----------------- */
  function initAuthModule() {
    // register form
    const regForm = document.querySelector(".register-form");
    if (regForm) regForm.addEventListener("submit", handleRegister);
  
    // login form
    const loginForm = document.querySelector(".login-form") || document.querySelector(".user-login-form");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);
  
    // profile modal wiring
    const profileModal = document.getElementById("profileModal") || document.getElementById("profile-modal");
    if (profileModal) {
      const form = document.getElementById("profileEditForm") || profileModal.querySelector("form") || document.getElementById("profileEditForm");
      if (form) form.addEventListener("submit", handleProfileEditSave);
  
      const cancelBtn = document.getElementById("cancelEditProfile") || profileModal.querySelector(".cancel-edit") || profileModal.querySelector(".profile-cancel");
      if (cancelBtn) cancelBtn.addEventListener("click", closeProfileModal);
  
      profileModal.addEventListener("click", function (ev) {
        if (ev.target === profileModal) closeProfileModal();
      });
    }
  
    renderProfileBox();
  }
  
  document.addEventListener("DOMContentLoaded", initAuthModule);
  
  window.handleRegister = handleRegister;
  window.handleLogin = handleLogin;
  window.openProfileModal = openProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.handleProfileEditSave = handleProfileEditSave;
  window.renderProfileBox = renderProfileBox;
  //OVERLAY
  window.showRegisterOverlay = function() {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "flex";
  };
  window.hideRegisterOverlay = function() {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";
  };
  //thêm sản phẩm vô đúng danh mục
  function removeVietnameseTones(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }
  const products = JSON.parse(localStorage.getItem("products")) || [];
  
  products.forEach(p => {
   const sectionId = (p.categorySlug 
    ? p.categorySlug 
    : removeVietnameseTones(p.category)
        .toLowerCase()
        .replace(/\s+/g, '')
  );
  
    let container = document.getElementById(sectionId);
  
    // Nếu chưa có section (do là danh mục mới admin tạo)
    if (!container) {
      container = document.createElement("section");
      container.className = "page";
      container.id = sectionId;
      container.innerHTML = `
        <h2>${p.category}</h2>
        <div class="product-list"></div>
      `;
      document.querySelector("main").appendChild(container);
    }
  
    const listDiv = container.querySelector('.product-list');
    listDiv.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString()}₫</div>
        ${p.oldPrice ? `<div class="product-oldprice">${p.oldPrice}</div>` : ''}
      </div>
    `;
  });
  
  //thêm danh mục đứng cạnh 
  function loadMenuCategories() {
    const defaultCategories = ["xuhuong", "nam", "nu"];
    const customCategories = JSON.parse(localStorage.getItem("categories")) || [];
  
    // Lấy menu trong HTML
    const menu = document.getElementById("categoryMenu");
    if (!menu) return;
  
    // Giữ nguyên các mục mặc định trong HTML, chỉ thêm mục mới chưa có
    const existingTexts = Array.from(menu.querySelectorAll("a")).map(a => a.textContent.trim());
  
    customCategories.forEach(cat => {
      if (!existingTexts.includes(cat)) {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" onclick="showCategory('${cat}')">${cat}</a>`;
        menu.appendChild(li);
      }
    });
  }
  
  
  function showCategory(catName) {
    // Ẩn tất cả các section sản phẩm khác
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  
    const sectionId = removeVietnameseTones(catName).toLowerCase().replace(/\s+/g, '');
    let section = document.getElementById(sectionId);
  
   
    if (!section) {
      section = document.createElement("section");
      section.className = "page active";
      section.id = sectionId;
      section.innerHTML = `
        <h2>${catName}</h2>
        <div class="product-list"></div>
      `;
      document.querySelector("main").appendChild(section);
    } else {
      section.classList.add("active");
    }
  
    const listDiv = section.querySelector(".product-list");
    listDiv.innerHTML = ""; 
  
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const filtered = products.filter(p => {
    const catSlug = p.categorySlug || removeVietnameseTones(p.category).toLowerCase().replace(/\s+/g, '');
    const clickedSlug = removeVietnameseTones(catName).toLowerCase().replace(/\s+/g, '');
    return catSlug === clickedSlug;
  });
  
  
  
    if (filtered.length === 0) {
      listDiv.innerHTML = `<p>Chưa cập nhật sản phẩm.</p>`;
    } else {
      filtered.forEach(p => {
        listDiv.innerHTML += `
          <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-name">${p.name}</div>
            <div class="product-price">${p.price.toLocaleString()}₫</div>
            ${p.oldPrice ? `<div class="product-oldprice">${p.oldPrice}</div>` : ''}
          </div>
        `;
      });
    }
  }
  
  
  
  document.addEventListener("DOMContentLoaded", loadMenuCategories);
  
  
  
  // so sánh ===========================================================================================
  (function () {
    const TAG = "[COMPARE]";
    function log(...args){ console.log(TAG, ...args); }
    function formatVND(n){
      if (n==null||n==="") return "";
      const num = typeof n==="number"? n : Number(String(n).replace(/[^\d.-]/g,""));
      return isNaN(num)? String(n) : num.toLocaleString('vi-VN') + ' ₫';
    }
    function escapeHtml(s){ if (s==null) return ""; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  
    function initCompareModule() {
      const compareBar = document.getElementById("compareBar");
      const compareItems = document.getElementById("compareItems");
      const compareNowBtn = document.getElementById("compareNowBtn");
      const clearAllBtn = document.getElementById("clearAllBtn");
  
      if (!compareBar || !compareItems || !compareNowBtn || !clearAllBtn) {
        log("Missing required elements: #compareBar, #compareItems, #compareNowBtn, #clearAllBtn");
        return;
      }
  
      let selected = [];
  
      function readCardInfo(card) {
        if (!card) return null;
        const idAttr = card.dataset?.id || card.getAttribute("data-id");
        const id = idAttr ? Number(idAttr) : Date.now();
        const img = card.querySelector("img")?.src || "";
        const name = card.querySelector(".product-name")?.innerText?.trim() || "";
        const priceText = card.querySelector(".product-price")?.innerText?.trim() || "";
        const oldPriceText = card.querySelector(".product-oldprice")?.innerText?.trim() || "";
        return { id, name, price: priceText, oldPrice: oldPriceText, image: img };
      }
  
      function updateCompareBar() {
        compareItems.innerHTML = "";
        selected.forEach(item => {
          const div = document.createElement("div");
          div.className = "compare-item";
          if (item.id) div.dataset.id = item.id;
          div.style.display = "flex";
          div.style.alignItems = "center";
          div.style.gap = "8px";
          div.style.padding = "6px";
          div.innerHTML = `
            <img src="${escapeHtml(item.image || 'images/no-image.png')}" width="56" height="56" style="object-fit:cover;border-radius:6px;">
            <div style="min-width:140px;max-width:220px;overflow:hidden;">
              <div style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(item.name || 'Sản phẩm')}</div>
              <div style="font-size:11px;color:#666">${formatVND(item.price)}</div>
              <div style="font-size:11px;color:#999;text-decoration:line-through;">${escapeHtml(item.oldPrice || '')}</div>
            </div>
            <button class="remove-compare-item" title="Xóa" style="margin-left:auto;border:none;background:transparent;cursor:pointer;font-size:14px;">✕</button>
          `;
          div.querySelector(".remove-compare-item").addEventListener("click", () => {
            selected = selected.filter(s => s.id !== item.id);
            updateCompareBar();
          });
          compareItems.appendChild(div);
        });
        if (selected.length > 0) compareBar.classList.remove("hidden");
        else compareBar.classList.add("hidden");
        log("updateCompareBar -> selected:", selected.map(s => ({id: s.id, name: s.name})));
      }
  
      document.addEventListener("click", function (e) {
        const btn = e.target.closest && e.target.closest(".compare-btn");
        if (!btn) return;
        e.preventDefault();
        const card = btn.closest(".product-card");
        if (!card) { alert("Không tìm thấy .product-card"); return; }
  
        const cardInfo = readCardInfo(card);
        if (selected.some(s => s.id === cardInfo.id)) { alert("Sản phẩm đã được chọn"); return; }
        if (selected.length >= 3) { alert("Chỉ chọn tối đa 3 sản phẩm"); return; }
  
        selected.push({
          id: cardInfo.id,
          name: cardInfo.name,
          price: cardInfo.price,
          oldPrice: cardInfo.oldPrice,
          image: cardInfo.image
        });
  
        updateCompareBar();
      });
  
      compareNowBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (!selected || selected.length === 0) { alert("Hãy chọn sản phẩm trước khi bấm 'So sánh'."); return; }
        buildComparePopup(selected);
      });
  
      clearAllBtn.addEventListener("click", function (e) {
        e.preventDefault();
        selected = [];
        updateCompareBar();
        const old = document.getElementById("comparePopup");
        if (old) old.remove();
      });
  
      function buildComparePopup(selProducts) {
        const fields = [
          ["Tên sản phẩm", p => escapeHtml(p.name || "")],
          ["Hình ảnh", p => `<img src="${escapeHtml(p.image || '')}" width="100" style="object-fit:cover;border-radius:6px;">`],
          ["Giá", p => formatVND(p.price)],
          ["Giá gốc", p => escapeHtml(p.oldPrice || "")]
        ];
  
        const rowsHtml = fields.map(([label, fn]) => {
          const cells = selProducts.map(p => `<td style="vertical-align:top;padding:8px;">${fn(p)}</td>`).join("");
          return `<tr><th style="text-align:left;padding:10px;background:#fafafa">${escapeHtml(label)}</th>${cells}</tr>`;
        }).join("");
  
        const old = document.getElementById("comparePopup");
        if (old) old.remove();
  
        const popup = document.createElement("div");
        popup.id = "comparePopup";
        popup.style.position = "fixed";
        popup.style.inset = "0";
        popup.style.display = "flex";
        popup.style.alignItems = "center";
        popup.style.justifyContent = "center";
        popup.style.background = "rgba(0,0,0,0.45)";
        popup.style.zIndex = "99999";
  
        popup.innerHTML = `
          <div class="popup-content" style="width:min(1100px,96%);max-height:90vh;overflow:auto;background:#fff;border-radius:8px;padding:16px;box-shadow:0 8px 30px rgba(0,0,0,0.25);">
            <h3 style="margin:0 0 12px;">So sánh sản phẩm (${selProducts.length})</h3>
            <div style="overflow:auto;">
              <table class="compare-table" style="width:100%;border-collapse:collapse;border:1px solid #eee;">
                ${rowsHtml}
              </table>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:12px;">
              <button id="compareCloseBtn" class="btn-secondary" style="padding:8px 12px;border-radius:6px;border:none;cursor:pointer;">Đóng</button>
            </div>
          </div>
        `;
        document.body.appendChild(popup);
  
        const popupEl = document.getElementById("comparePopup");
        document.getElementById("compareCloseBtn").addEventListener("click", () => popupEl.remove());
        popupEl.addEventListener("click", (e) => { if (e.target === popupEl) popupEl.remove(); });
  
        log("Popup shown with products:", selProducts.map(p => ({id:p.id, name:p.name})));
      }
  
      log("Compare module initialized");
    }
  
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initCompareModule);
    else initCompareModule();
  })();
  
  //============= END SO SÁNH ========================================================
 