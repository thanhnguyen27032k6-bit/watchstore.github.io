document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("productDetailModal");
  const closeBtn = modal.querySelector(".close-modal");
  const specsTable = modal.querySelector("#specsTable");

  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      const name = card.querySelector(".product-name").textContent.trim();
      const product = products.find(p => p.name === name);
      if (product) openModal(product);
    });
  });

  function openModal(product) {
    modal.querySelector("#modalProductImage").src = product.image;
    modal.querySelector("#modalProductName").textContent = product.name;
    modal.querySelector("#modalCurrentPrice").textContent = product.price;
    modal.querySelector("#modalOldPrice").textContent = product.oldPrice;

    // Tạo bảng thông số động
    specsTable.innerHTML = `
      <tr><td>Thương hiệu:</td><td>${product.brand}</td></tr>
      <tr><td>Xuất xứ:</td><td>${product.origin}</td></tr>
      <tr><td>Loại máy:</td><td>${product.movement}</td></tr>
      <tr><td>Chất liệu dây:</td><td>${product.band}</td></tr>
      <tr><td>Chất liệu kính:</td><td>${product.glass}</td></tr>
      <tr><td>Chống nước:</td><td>${product.waterproof}</td></tr>
    `;

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  // Đóng modal
  closeBtn.onclick = closeModal;
  modal.onclick = e => { if (e.target === modal) closeModal(); };

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});
