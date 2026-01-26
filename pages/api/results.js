import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const url = "https://results.equi-score.de/event/2025/32120/de";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!response.ok) {
      res.status(500).send("Fetch failed: " + response.status);
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const table = $("table").first();
    if (!table.length) {
      res.status(500).send("No table found");
      return;
    }

    const rows = table.find("tr").toArray();

    let output = "<table style='width:100%; border-collapse:collapse;'>";

    rows.forEach(row => {
      output += "<tr>";
      $(row).find("th, td").each((_, cell) => {
        const tag = cell.tagName;
        const text = $(cell).text().trim();
        output += `<${tag} style="border:1px solid #ddd;padding:6px;">${text}</${tag}>`;
      });
      output += "</tr>";
    });

    output += "</table>";

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(output);

  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
}
