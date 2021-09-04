import fs from "fs";
import zlib from "zlib";

if (process.argv[2] === undefined) {
  console.log("Usage: npm run readNbt -- <path/to/file.nbt> [isGzipped]");
  console.log("If [isGzipped] is truthy then the file will be decompressed.");
  process.exit(1);
}

const path = process.argv[2];
const isGzipped = process.argv[3];

const buffer = fs.readFileSync(path);

function printBuffer(buf: Buffer) {
  console.log(buf.toJSON().data.join(","));
}

printBuffer(isGzipped ? zlib.unzipSync(buffer) : buffer);
