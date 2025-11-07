import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { password, caption, photo, filename } = req.body;

  if (password !== process.env.UPLOAD_PASSWORD)
    return res.status(403).json({ error: "Password salah" });

  const GITHUB_REPO = "argalimun-dev/smart-building-batch-2";
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const photoPath = `photos/${filename}`;
  const fileContent = Buffer.from(photo, "base64").toString("base64");

  await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${photoPath}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Add photo: ${filename}`,
      content: fileContent,
    }),
  });

  const resData = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/main/data.json`);
  const json = await resData.json();
  json.photos.push({ file: photoPath, caption });

  await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/data.json`, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Update data.json with ${filename}`,
      content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
    }),
  });

  res.status(200).json({ success: true });
}
