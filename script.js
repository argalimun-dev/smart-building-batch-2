const GITHUB_DATA_URL =
  "https://raw.githubusercontent.com/argalimun-dev/smart-building-batch-2/main/data.json";
const API_URL = "https://YOUR_VERCEL_APP.vercel.app/api/upload";

async function loadGallery() {
  const res = await fetch(GITHUB_DATA_URL);
  const data = await res.json();

  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  data.photos.forEach((p) => {
    const div = document.createElement("div");
    div.className = "photo-card";
    div.innerHTML = `
      <img src="${p.file}" alt="${p.caption}" />
      <p><b>${p.caption}</b></p>
    `;
    gallery.appendChild(div);
  });
}

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const password = document.getElementById("password").value;
  const fileInput = document.getElementById("photoInput");
  const caption = document.getElementById("captionInput").value;

  if (!fileInput.files[0]) return alert("Pilih foto dulu!");
  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result.split(",")[1];
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, caption, photo: base64, filename: file.name }),
    });

    if (res.ok) {
      alert("Upload berhasil! Tunggu beberapa detik lalu refresh halaman.");
    } else {
      alert("Gagal upload (cek password atau API)");
    }
  };
  reader.readAsDataURL(file);
});

loadGallery();
