import pdf from "pdf-parse/lib/pdf-parse.js";
console.log("pdf function loaded:", typeof pdf === "function");
try {
  const emptyPdfBuffer = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<Root 1 0 R>>\n%%EOF");
  pdf(emptyPdfBuffer)
    .then(data => {
      console.log("Success! Result text length:", data.text.length);
    })
    .catch(e => {
      console.log("Promise rejected (expected for corrupt PDF):", e.message);
    });
} catch (e) {
  console.error("Direct crash:", e.message);
}
