
import cheerio from "cheerio";

export default async function handler(req, res) {
  const url = "https://results.equi-score.de/event/2025/32120/de";

  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
