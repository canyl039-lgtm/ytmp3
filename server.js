const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/download", (req, res) => {
  const { url } = req.body;

  const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w\-]{11}/;
  if (!url || !ytRegex.test(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  const tmpDir = os.tmpdir();
  const outputTemplate = path.join(tmpDir, "%(title)s.%(ext)s");

  const cmd = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputTemplate}" --print after_move:filepath "${url}"`;

  exec(cmd, { timeout: 180000 }, (err, stdout, stderr) => {
    if (err) {
      console.error("yt-dlp error:", stderr);
      return res.status(500).json({ error: "Conversion failed." });
    }

    const filePath = stdout.trim().split("\n").pop();
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(500).json({ error: "Output file not found." });
    }

    const fileName = path.basename(filePath);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader("Content-Type", "audio/mpeg");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on("close", () => {
      try { fs.unlinkSync(filePath); } catch (_) {}
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ YTMP3 running on port ${PORT}`);
});
