import axios from "axios";
import * as cheerio from "cheerio";
import * as https from "https";
import { PriceProvider } from "./PriceProvider";

export class BcvProvider implements PriceProvider {
  getProviderName(): string {
    return "BCV";
  }

  async getPrice(symbol: string): Promise<number> {
    if (symbol !== "USDT-VES") {
      throw new Error(`BcvProvider does not support symbol: ${symbol}`);
    }

    // We fetch the HTML from the official BCV website
    const response = await axios.get("https://www.bcv.org.ve/", {
      // By default, websites might block requests missing User-Agent
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Find the div with id "dolar", then find the strong tag containing the price
    const priceText = $("#dolar .centrado strong").text().trim();

    if (!priceText) {
      throw new Error(
        "BcvProvider: Could not find the dollar price on the webpage.",
      );
    }

    // The price text is formatted with a comma for decimals, e.g., "36,25"
    const formattedPrice = priceText.replace(",", ".");
    const price = parseFloat(formattedPrice);

    if (isNaN(price)) {
      throw new Error(
        `BcvProvider: Failed to parse price "${priceText}" to a number.`,
      );
    }

    return price;
  }
}
