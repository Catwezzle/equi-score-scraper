import { chromium } from "playwright";

export default async function handler(req, res) {
  try {
    const url = "https://results.equi-score.de/event/2025/32120/de";

    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const response = await page.goto(url, { waitUntil: "networkidle" });

    const status = response ? response.status() : "no response";

    // debug info
    const title = await page.title();
    const htmlLength = (await page.content()).length;

    // try to find table
    const hasTable = await page.$("table") !== null;

    await browser.close();

    res.status(200).json({
      status,
      title,
      htmlLength,
      hasTable,
    });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
}
