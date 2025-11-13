c/* ============================================================
    QUẢN LÝ LOẠI SẢN PHẨM CHO WATCHSTORE
    - Thêm, sửa, xóa danh mục
    - Ẩn / hiện danh mục
    - Ẩn / hiện sản phẩm ở trang index theo danh mục
============================================================ */

// Khởi tạo danh mục mặc định nếu chưa có
let categories = JSON.parse(localStorage.getItem("categories")) || [
    { name: "xuhuong", hidden: false },
    { name: "nam", hidden: false },
    { name: "nu", hidden: false },
    { name: "hot", hidden: false }
  ];
  
  // Lưu
  function saveCategories() {
    localStorage.setItem("categories", JSON.stringify(categories));
  }
  
  // Render danh mục lên bảng
  function renderCategories() {
    const table = document.getElementById("CateTableBody");
    if (!table) return;
  
    table.innerHTML = "";
  
    categories.forEach((c, i) => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${c.name} ${c.hidden ? "<span style='color:red'>(Ẩn)</span>" : ""}</td>
  
        <td>
          <button class="edit-btn" data-id="${i}">Sửa</button>
          <button class="delete-btn" data-id="${i}">Xóa</button>
          <button class="toggle-btn" data-id="${i}">
            ${c.hidden ? "Hiện" : "Ẩn"}
          </button>
        </td>
      `;
  
      table.appendChild(row);
    });
  
    attachCategoryEvents();
  }
  
  // Gán sự kiện
  function attachCategoryEvents() {
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.onclick = () => {
        const index = btn.dataset.id;
        document.getElementById("categoryName").value = categories[index].name;
        document.getElementById("CategoryForm").dataset.edit = index;
        document.getElementById("CategoryForm").style.display = "block";
      };
    });
  
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = () => {
        const index = btn.dataset.id;
        if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
  
        categories.splice(index, 1);
        saveCategories();
        renderCategories();
      };
    });
  
    document.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.onclick = () => {
        const index = btn.dataset.id;
        categories[index].hidden = !categories[index].hidden;
        saveCategories();
        renderCategories();
      };
    });
  }
  
  // Nút thêm mới
  document.getElementById("addCateBtn").onclick = () => {
    document.getElementById("CategoryForm").dataset.edit = "-1";
    document.getElementById("categoryName").value = "";
    document.getElementById("CategoryForm").style.display = "block";
  };
  
  // Lưu danh mục
  document.getElementById("CategoryForm").onsubmit = (e) => {
    e.preventDefault();
  
    const name = document.getElementById("categoryName").value.trim();
    if (!name) return alert("Tên danh mục không được trống!");
  
    const editId = parseInt(e.target.dataset.edit);
  
    if (editId === -1) {
      categories.push({ name, hidden: false });
    } else {
      categories[editId].name = name;
    }
  
    saveCategories();
    renderCategories();
  
    e.target.reset();
    e.target.style.display = "none";
  };
  
  // Khởi tạo
  renderCategories();
  