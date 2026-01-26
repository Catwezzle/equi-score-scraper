import { chromium } from "playwright";

export default async function handler(req, res) {
  try {
    const url = "https://results.equi-score.de/event/2025/32120/de";

    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    // Warte auf die Tabelle (falls sie etwas braucht)
    await page.waitForSelector("table", { timeout: 10000 });

    const html = await page.$eval("table", (el) => el.outerHTML);

    await browser.close();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);

  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
}
