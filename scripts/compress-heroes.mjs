import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const dir = path.join("public", "img", "categories", "heroes");
const pngs = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));

for (const file of pngs) {
  const input = path.join(dir, file);
  const out = path.join(dir, file.replace(/\.png$/i, ".webp"));
  execSync(
    `ffmpeg -y -i "${input}" -vf "scale='min(1200,iw)':-2" -quality 78 "${out}"`,
    { stdio: "inherit" },
  );
  const before = fs.statSync(input).size;
  const after = fs.statSync(out).size;
  console.log(`${file}: ${(before / 1e6).toFixed(2)}MB -> ${(after / 1e6).toFixed(2)}MB`);
  fs.unlinkSync(input);
}

console.log("done", pngs.length);
