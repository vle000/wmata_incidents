const express = require("express");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("public/index.html", {
    root: __dirname
  });
});

const supabaseUrl = "https://ybufwnjmcylsojyhrvbg.supabase.co";
const supabaseKey = "sb_publishable_ZNnsf8qviA8pvvSG-sPjjA_kaxcalyH";
const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/api/searches", async (req, res) => {
  const { data, error } = await supabase.from("searches").select("*");

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post("/api/search", async (req, res) => {
  const query = req.body;
  console.log("Received search query:", query);

  try {
    const { data, error } = await supabase
      .from("searches")
      .insert([query])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json(error);
    }

    res.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

app.get("/api/incidents", async (req, res) => {
  try {
    const [busResponse, railResponse] = await Promise.all([
      fetch("https://api.wmata.com/Incidents.svc/json/BusIncidents", {
        headers: {
          api_key: "bdb1718a7a4f4380b4bc7a9213ba4ac6"
        }
      }),
      fetch("https://api.wmata.com/Incidents.svc/json/Incidents", {
        headers: {
          api_key: "bdb1718a7a4f4380b4bc7a9213ba4ac6"
        }
      })
    ]);

    const bus = await busResponse.json();
    const rail = await railResponse.json();

    res.json({
      bus: bus.BusIncidents,
      rail: rail.Incidents
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch WMATA data" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});