const blocksList = document.getElementById("blocksList");
let blocks = [];  
// Each block: { type: "text"|"code"|"image"|"pdf", content: string, file?: File, url?: string }

document.getElementById("addText").addEventListener("click", () => {
  blocks.push({ type: "text", content: "" });
  renderBlocks();
});
document.getElementById("addCode").addEventListener("click", () => {
  blocks.push({ type: "code", content: "" });
  renderBlocks();
});
document.getElementById("addImage").addEventListener("click", () => {
  blocks.push({ type: "image", content: "", file: null, url: "" });
  renderBlocks();
});
document.getElementById("addPDF").addEventListener("click", () => {
  blocks.push({ type: "pdf", content: "", file: null, url: "" });
  renderBlocks();
});

function renderBlocks() {
  blocksList.innerHTML = "";
  blocks.forEach((blk, idx) => {
    const div = document.createElement("div");
    div.classList.add("block");
    div.dataset.idx = idx;

    const remove = document.createElement("span");
    remove.innerText = "×";
    remove.classList.add("remove-btn");
    remove.title = "Remove this block";
    remove.onclick = () => {
      blocks.splice(idx, 1);
      renderBlocks();
    };
    div.appendChild(remove);

    if (blk.type === "text") {
      const ta = document.createElement("textarea");
      ta.classList.add('normal_text')
      ta.placeholder = "Enter text here...";
      ta.value = blk.content;
      ta.oninput = () => {
        blk.content = ta.value;
      };
      div.appendChild(ta);
    }
    else if (blk.type === "code") {
      const ta = document.createElement("textarea");
      ta.placeholder = "Enter code snippet...";
      ta.value = blk.content;
      ta.oninput = () => {
        blk.content = ta.value;
      };
      div.appendChild(ta);
    }
    else if (blk.type === "image") {
      const label = document.createElement("label");
      label.innerText = "Upload image file (or leave blank):";
      div.appendChild(label);
      const inpFile = document.createElement("input");
      inpFile.type = "file";
      inpFile.accept = "image/*";
      inpFile.onchange = (e) => {
        const f = e.target.files[0];
        blk.file = f;
      };
      div.appendChild(inpFile);

      const label2 = document.createElement("label");
      label2.innerText = "Or external image URL:";
      div.appendChild(label2);
      const inpUrl = document.createElement("input");
      inpUrl.type = "url";
      inpUrl.placeholder = "https://example.com/image.jpg";
      inpUrl.value = blk.url || "";
      inpUrl.oninput = () => {
        blk.url = inpUrl.value;
      };
      div.appendChild(inpUrl);
    }
    else if (blk.type === "pdf") {
      const label = document.createElement("label");
      label.innerText = "Upload PDF file (or leave blank):";
      div.appendChild(label);
      const inpFile = document.createElement("input");
      inpFile.type = "file";
      inpFile.accept = "application/pdf";
      inpFile.onchange = (e) => {
        const f = e.target.files[0];
        blk.file = f;
      };
      div.appendChild(inpFile);

      const label2 = document.createElement("label");
      label2.innerText = "Or external PDF URL:";
      div.appendChild(label2);
      const inpUrl = document.createElement("input");
      inpUrl.type = "url";
      inpUrl.placeholder = "https://example.com/doc.pdf";
      inpUrl.value = blk.url || "";
      inpUrl.oninput = () => {
        blk.url = inpUrl.value;
      };
      div.appendChild(inpUrl);
    }

    blocksList.appendChild(div);
  });
}

document.getElementById("btnGenerate").addEventListener("click", generatePreview);

function generatePreview() {
  const title = document.getElementById("inputTitle").value.trim();
  const author = document.getElementById("inputUID").value.trim();
  const year = document.getElementById("inputYear").value;
  const type = document.getElementById("filter-type").value;

  if (!title || !author) {
    alert("Title and UID are mandatory");
    return;
  }

  const preview = document.getElementById("previewArea");
  preview.innerHTML = "";

  // Title & metadata
  const h2 = document.createElement("h2");
  h2.innerText = title;
  const metaDiv = document.createElement("div");
  metaDiv.classList.add("meta");
  metaDiv.innerHTML = `<strong>UID:</strong> ${author} |
    <strong>Release Date:</strong> ${"hey"} ${year} |

    
    <strong>Type:</strong> ${type} | 
    <strong>Last Revision:</strong> ${"nope"} ${"1969"} `;

  preview.appendChild(h2);
  preview.appendChild(metaDiv);

  // Render each block in sequence
  blocks.forEach(blk => {
    if (blk.type === "text") {
      const p = document.createElement("p");
      p.innerText = blk.content;
      preview.appendChild(p);
    }
    else if (blk.type === "code") {
      const codeDiv = document.createElement("div");
      codeDiv.classList.add("code-block");
      const pre = document.createElement("pre");
      pre.innerText = blk.content;
      codeDiv.appendChild(pre);
      preview.appendChild(codeDiv);
    }
    else if (blk.type === "image") {
      // If file is provided, use it; else if URL is given, use that
      if (blk.file) {
        const img = document.createElement("img");
        img.classList.add("pub-image");
        const reader = new FileReader();
        reader.onload = (ev) => {
          img.src = ev.target.result;
        };
        reader.readAsDataURL(blk.file);
        preview.appendChild(img);
      } else if (blk.url) {
        const img = document.createElement("img");
        img.classList.add("pub-image");
        img.src = blk.url;
        preview.appendChild(img);
      }
    }
    else if (blk.type === "pdf") {
      if (blk.file) {
        const pdfDiv = document.createElement("div");
        pdfDiv.classList.add("pdf-container");
        const reader = new FileReader();
        reader.onload = (ev) => {
          const blob = new Blob([ev.target.result], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const obj = document.createElement("object");
          obj.data = url;
          obj.type = "application/pdf";
          obj.innerHTML = `<p>Cannot display PDF. <a href="${url}" target="_blank">Download PDF</a></p>`;
          pdfDiv.appendChild(obj);
        };
        reader.readAsArrayBuffer(blk.file);
        preview.appendChild(pdfDiv);
      } else if (blk.url) {
        const pdfDiv = document.createElement("div");
        pdfDiv.classList.add("pdf-container");
        const obj = document.createElement("object");
        obj.data = blk.url;
        obj.type = "application/pdf";
        obj.innerHTML = `<p>Cannot display PDF. <a href="${blk.url}" target="_blank">Download PDF</a></p>`;
        pdfDiv.appendChild(obj);
        preview.appendChild(pdfDiv);
      }
    }
  });
}