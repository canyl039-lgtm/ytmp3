const express = require("express");
const youtubeDl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/download", async (req, res) => {
  const { url } = req.body;

  const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w\-]{11}/;
  if (!url || !ytRegex.test(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    // Get video info first
    const info = await youtubeDl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      preferFreeFormats: true,
    });

    const title = info.title || "audio";
    const safeTitle = title.replace(/[^\w\s\-]/g, "").trim();
    const outputPath = path.join(os.tmpdir(), `${safeTitle}.mp3`);

    // Download as mp3
    await youtubeDl(url, {
      extractAudio: true,
      audioFormat: "mp3",
      audioQuality: 0,
      output: outputPath,
      noWarnings: true,
    });

    if (!fs.existsSync(outputPath)) {
      return res.status(500).json({ error: "Conversion failed." });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(safeTitle)}.mp3"`);
    res.setHeader("Content-Type", "audio/mpeg");

    const stream = fs.createReadStream(outputPath);
    stream.pipe(res);
    stream.on("close", () => {
      try { fs.unlinkSync(outputPath); } catch (_) {}
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ YTMP3 running on port ${PORT}`);
});
