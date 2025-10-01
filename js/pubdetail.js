document.addEventListener("DOMContentLoaded", () => {
  const detailDiv = document.getElementById("pub-detail");

  // helper to get query param
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  const idParam = getQueryParam("id");
  if (!idParam) {
    detailDiv.innerHTML = `<p>No publication selected.</p>`;
    return;
  }
  const pubId = idParam;

  fetch('data/publications.json')
    .then(resp => resp.json())
    .then(data => {
      const pub = data.find(p => p.mic === pubId);
      if (!pub) {
        detailDiv.innerHTML = `<p>Publication not found.</p>`;
        return;
      }
      renderDetail(pub);
    })
    .catch(err => {
      console.error("Error loading publications:", err);
      detailDiv.innerHTML = `<p>Error loading publication.</p>`;
    });

  function renderDetail(pub) {

    const input = pub.mic;
    const parts = input.split('.');
    pub.year = parseInt(parts[0], 10)
    pub.monthDate = parts[1] + '.' + parts[2]
    pub.lastChangedYear = parseInt(parts[3], 10)
    pub.lastChangedMonthDate = parts[4] + '.' + parts[5]
    pub.type = parts[6]
    if (parts[6] == "DG") {
      pub.fulltype = "Digital"
    } if (parts[6] == "PB") {
      pub.fulltype = "PaperBack"
    } if (parts[6] == "MI") {
      pub.fulltype = "Mindful Intent"
    }
    pub.author = parts[7]


    detailDiv.innerHTML = `
      <h2>${pub.title}</h2>
      <div class="meta">
        <strong>UID:</strong> ${pub.author} |
        <strong>Release Date:</strong> ${formatMonthDate(pub.monthDate)} ${pub.year} |<br><br>

        
        <strong>Type:</strong> ${pub.fulltype} | 
        <strong>Last Revision:</strong> ${formatMonthDate(pub.lastChangedMonthDate)} ${pub.lastChangedYear} 
      </div>
      <br>
      <p class="description">${pub.description}</p>
      <div class="content">${pub.content || ""}</div>
    `;
  }
});












function formatMonthDate(md) {
  const [monthStr, dayStr] = md.split('.');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  // Validate numbers
  if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    return 'Invalid date';
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const suffix = getDaySuffix(day);
  const monthName = monthNames[month - 1];

  return `${day}${suffix} ${monthName}`;
}

// Helper function to get the correct day suffix
function getDaySuffix(day) {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}
