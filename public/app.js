let incidentChart = null;

async function loadIncidents() {
  try {
    const response = await fetch("/api/incidents");
    const data = await response.json();

    const busIncidents = (data.bus || []).map(i => ({
      type: i.IncidentType,
      desc: i.Description,
      routes: i.RoutesAffected || [],
      updated: i.DateUpdated,
      system: "Bus"
    }));

    const railIncidents = (data.rail || []).map(i => ({
      type: i.IncidentType,
      desc: i.Description,
      lines: (i.LinesAffected || "")
        .split(/;[\s]?/)
        .filter(Boolean),
      updated: i.DateUpdated,
      system: "Rail"
    }));

    return [...busIncidents, ...railIncidents];
  } catch (err) {
    console.error("Failed to load incidents:", err);
    return [];
  }
}

function displayIncidents(incidents) {
  const container = document.getElementById("incidentList");
  container.innerHTML = "";

  if (!incidents.length) {
    container.innerHTML = "<p>No incidents reported.</p>";
    return;
  }

  incidents.forEach(incident => {
    const card = document.createElement("div");
    card.className = "incident-card";

    const affectedHTML =
      incident.system === "Rail"
        ? incident.lines
            .map(line => `<span class="line-badge">${line}</span>`)
            .join(" ")
        : incident.routes.join(", ");

    card.innerHTML = `
      <h3>${incident.type} (${incident.system})</h3>

      <p>
        <strong>
          ${
            incident.system === "Rail"
              ? "Lines Affected"
              : "Routes Affected"
          }:
        </strong>
        ${affectedHTML}
      </p>

      <p>${incident.desc}</p>

      <p>
        <em>
          Updated:
          ${new Date(incident.updated).toLocaleString()}
        </em>
      </p>
    `;

    container.appendChild(card);
  });
}

function renderChart(incidents) {
  const ctx = document
    .getElementById("incidentChart")
    .getContext("2d");

  let busCount = incidents.filter(
    i => i.system === "Bus"
  ).length;

  let railCount = incidents.filter(
    i => i.system === "Rail"
  ).length;

  if (incidentChart) {
    incidentChart.destroy();
  }

  incidentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Bus Incidents", "Rail Incidents"],
      datasets: [
        {
          label: "Current Incidents",
          data: [busCount, railCount],
          backgroundColor: [
            "#4CAF50",
            "#2196F3"
          ],
          borderWidth: 1
        }
      ]
    },

    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: "WMATA Transit Incidents"
        }
      },

      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

let allIncidents = [];

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    allIncidents = await loadIncidents();

    displayIncidents(allIncidents);

    renderChart(allIncidents);

    const searchButton =
      document.getElementById("searchButton");

    const searchInput =
      document.getElementById("routeSearch");

    searchButton.addEventListener(
      "click",
      async () => {

        const query =
          searchInput.value.trim();

        if (!query) return;

        const filtered = allIncidents.filter(
          incident => {

            const searchLower =
              query.toLowerCase();

            if (incident.system === "Bus") {

              return incident.routes.some(r =>
                r.toLowerCase().includes(searchLower)
              );

            } else {

              return incident.lines.some(l =>
                l.toLowerCase().includes(searchLower)
              );
            }
          }
        );

        displayIncidents(filtered);

        renderChart(filtered);

        // Save to Supabase
        try {

          const res = await fetch(
            "/api/search",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                query
              })
            }
          );

          const data = await res.json();

          console.log(
            "Search saved:",
            data
          );

        } catch (err) {

          console.error(
            "Search POST error:",
            err
          );
        }
      }
    );
  }
);

new Typed("#type", {
  strings: [
    "Red Line",
    "Green Line",
    "Silver Line"
  ],
  typeSpeed: 50,
  backSpeed: 25,
  loop: true
});

async function loadSearchHistory() {
  const res = await fetch("/api/searches");
  const data = await res.json();

  console.log("Past searches:", data);
}

loadSearchHistory();