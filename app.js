let masterData = [];

async function loadDefaultData() {
  const res = await fetch("data/data.json");
  const data = await res.json();
  masterData = normalizeRows(data);
  document.getElementById("sourceNote").textContent = "ប្រភពទិន្នន័យ: data/data.json";
  render();
}

function normalizeRows(rows) {
  return rows.map((row, index) => ({
    no: index + 1,
    name: row.name || row.Name || "",
    country: row.country || row.Country || "",
    program: row.program || row.Program || "",
    reason: row.reason || row.Reason || "",
    status: row.status || row.Status || ""
  }));
}

function render() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;

  const filtered = masterData.filter(item => {
    const text = `${item.name} ${item.country} ${item.program} ${item.reason} ${item.status}`.toLowerCase();
    const matchText = !keyword || text.includes(keyword);
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchText && matchStatus;
  });

  document.getElementById("totalCount").textContent = masterData.length;
  document.getElementById("activeCount").textContent =
    masterData.filter(x => x.status === "សកម្ម").length;
  document.getElementById("inactiveCount").textContent =
    masterData.filter(x => x.status === "មិនសកម្ម").length;

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  filtered.forEach((item, i) => {
    const tr = document.createElement("tr");
    const badgeClass = item.status === "សកម្ម" ? "active" : "inactive";

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.country)}</td>
      <td>${escapeHtml(item.program)}</td>
      <td>${escapeHtml(item.reason)}</td>
      <td><span class="badge ${badgeClass}">${escapeHtml(item.status)}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.getElementById("searchInput").addEventListener("input", render);
document.getElementById("statusFilter").addEventListener("change", render);

document.getElementById("excelFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

  masterData = normalizeRows(rows);
  document.getElementById("sourceNote").textContent = `ប្រភពទិន្នន័យ: Uploaded file (${file.name})`;
  render();
});

loadDefaultData();
