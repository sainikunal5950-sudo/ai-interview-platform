import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");
console.log("pdfModule exports:", Object.keys(pdfModule));
