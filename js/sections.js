document.addEventListener("DOMContentLoaded", () => {
  const typeList = document.getElementById("type-links");
  const typeSearch = document.getElementById("typeSearch");

  let allTypes = [];  // array of strings

  fetch('data/publications.json')
    .then(resp => resp.json())
    .then(data => {
      // extract unique types
      const typesSet = new Set(data.map(pub => pub.type));
      allTypes = Array.from(typesSet).sort();
      renderTypes(allTypes);
    })
    .catch(err => {
      console.error("Error loading types:", err);
      typeList.innerHTML = `<li>Error loading types</li>`;
    });

  // Listen to typing in typeSearch
  typeSearch.addEventListener("input", () => {
    const term = typeSearch.value.trim().toLowerCase();
    if (!term) {
      renderTypes(allTypes);
    } else {
      const filtered = allTypes.filter(t => t.toLowerCase().includes(term));
      renderTypes(filtered);
    }
  });

  function renderTypes(typesArray) {
    typeList.innerHTML = "";
    if (typesArray.length === 0) {
      typeList.innerHTML = `<li>No matching types.</li>`;
      return;
    }
    typesArray.forEach(type => {
      const li = document.createElement("li");
      // link to index page with filter parameter
      li.innerHTML = `<a href="index.html?type=${encodeURIComponent(type)}">${type}</a>`;
      typeList.appendChild(li);
    });
  }
});
