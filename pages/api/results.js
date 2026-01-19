import cheerio from "cheerio";

export default async function handler(req, res) {
  const url = "https://results.equi-score.de/event/2025/32120/de";

  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);

  const table = $("table").first();
  const rows = table.find("tr").toArray();

  let output = "<table style='width:100%; border-collapse: collapse;'>";

  rows.forEach(row => {
    output += "<tr>";

    $(row).find("th, td").each((i, cell) => {
      const tag = cell.tagName;
      const text = $(cell).text().trim();
      output += `<${tag} style="border:1px solid #ddd; padding:8px;">${text}</${tag}>`;
    });

    output += "</tr>";
  });

  output += "</table>";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(output);
}

