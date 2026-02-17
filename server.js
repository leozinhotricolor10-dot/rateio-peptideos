const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "data.json");

function readData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all participants
app.get("/api/data", (req, res) => {
  res.json(readData());
});

// POST update participants for a peptide
app.post("/api/data", (req, res) => {
  const data = readData();
  const { peptideId, participants } = req.body;
  data[peptideId] = participants;
  writeData(data);
  res.json({ ok: true });
});

// POST reset all data
app.post("/api/reset", (req, res) => {
  writeData({});
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
