
document.addEventListener("DOMContentLoaded", () => {
  const sections = [
    { id: "xuhuong-products", category: "xuhuong" },
    { id: "nam-products", category: "nam" },
    { id: "nu-products", category: "nu" },
    { id: "hotsale-products", category: "hot" }
  ];

  // Hàm render sản phẩm ra HTML
  function renderProducts(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- LỌC DANH MỤC BỊ ẨN (LẤY TỪ localStorage) ---
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const hiddenCategories = categories
        .filter(c => c.hidden)
        .map(c => c.name);

    // --- LẤY DANH SÁCH SẢN PHẨM THEO CATEGORY ---
    let products = window.getProducts({ category });

    // --- LOẠI BỎ SẢN PHẨM NẰM TRONG DANH MỤC BỊ ẨN ---
    products = products.filter(p => !hiddenCategories.includes(p.category));

    // --- NẾU KHÔNG CÓ SP SAU KHI LỌC ---
    if (products.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:gray;">Không có sản phẩm nào.</p>`;
        return;
    }

    // --- RENDER UI ---
    container.innerHTML = products.map(p => `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='image/placeholder.jpg'">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString("vi-VN")} ₫</div>
        <div class="product-oldprice">${p.oldPrice.toLocaleString("vi-VN")} ₫</div>
        <button class="compare-btn" type="button">So sánh</button>
      </div>
    `).join("");
}


  sections.forEach(sec => renderProducts(sec.id, sec.category));
});


