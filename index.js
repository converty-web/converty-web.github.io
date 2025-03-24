const conversionRates = {
  // length

  "mm-cm": x => x / 10, "cm-mm": x => x * 10, "cm-m": x => x / 100, "m-cm": x => x * 100, "m-km": x => x / 1000, "km-m": x => x * 1000, "mm-m": x => x / 1000, "m-mm": x => x * 1000, "km-mm": x => x * 1e6, "mm-km": x => x / 1e6,

  // area

  "mm2-cm2": x => x / 100, "cm2-mm2": x => x * 100, "cm2-m2": x => x / 10000, "m2-cm2": x => x * 10000, "m2-km2": x => x / 1e6, "km2-m2": x => x * 1e6, "mm2-m2": x => x / 1e6, "m2-mm2": x => x * 1e6,

  // volume

  "ml-l": x => x / 1000, "l-ml": x => x * 1000, "l-m3": x => x / 1000, "m3-l": x => x * 1000, "ml-m3": x => x / 1e6, "m3-ml": x => x * 1e6, "cup-ml": x => x * 240, "ml-cup": x => x / 240, "cup-l": x => x * 0.24, "l-cup": x => x / 0.24, "gal-l": x => x * 3.78541, "l-gal": x => x / 3.78541, "oz-l": x => x * 0.0295735, "l-oz": x => x / 0.0295735,

  // weight

  "g-kg": x => x / 1000, "kg-g": x => x * 1000, "lb-kg": x => x * 0.453592, "kg-lb": x => x / 0.453592, "oz-g": x => x * 28.3495, "g-oz": x => x / 28.3495, "lb-g": x => x * 453.592, "g-lb": x => x / 453.592,

  // time

  "s-m": x => x / 60, "m-s": x => x * 60, "m-h": x => x / 60, "h-m": x => x * 60, "h-d": x => x / 24, "d-h": x => x * 24, "m-h": x => x / 60, "h-m": x => x * 60, "h-d": x => x / 24, "d-h": x => x * 24, "d-wk": x => x / 7, "wk-d": x => x * 7, "wk-mo": x => x / 4.34524, "mo-wk": x => x * 4.34524, "mo-y": x => x / 12, "y-mo": x => x * 12, "d-y": x => x / 365.25, "y-d": x => x * 365.25,

  // temperature

  "f-c": f => (f - 32) * 5 / 9, "c-f": c => (c * 9 / 5) + 32, "k-c": k => k - 273.15, "c-k": c => c + 273.15, "k-f": k => (k - 273.15) * 9 / 5 + 32, "f-k": f => (f - 32) * 5 / 9 + 273.15,

  // electric

  "w-a-v": (w, v) => w / v, "w-v-a": (w, a) => w / a, "a-w-v": (a, v) => a * v, "a-v-w": (a, w) => w / a, "v-a-w": (v, w) => w / v, "v-w-a": (v, a) => v * a
};

const unitAbbreviations = {
  // length

  millimeter: "mm", millimeters: "mm", centimeter: "cm", centimeters: "cm", meter: "m", meters: "m", kilometer: "km", kilometers: "km",

  // area

  millimeter2: "mm2", millimeters2: "mm2", centimeter2: "cm2", centimeters2: "cm2", kilometer2: "km2", kilometers2: "km2", meter2: "m2", meters2: "m2",

  // volume

  milliliter: "ml", milliliters: "ml", liter: "l", liters: "l", meter3: "m3", meters3: "m3", gallon: "gal", gallons: "gal", ounce: "oz", ounces: "oz",

  // weight

  gram: "g", grams: "g", kilogram: "kg", kilograms: "kg", pound: "lb", pounds: "lb",

  // time

  seconds: "s", second: "s", minutes: "m", minute: "m", hours: "h", hour: "h", days: "d", day: "d", weeks: "wk", week: "wk", months: "mo", month: "mo", years: "y", year: "y",

  // temperature
  
  kelvin: "k", celsius: "c", fahrenheit: "f",

  // electric

  watts: "w", volts: "v", amps: "a", watt: "w", volt: "v", amp: "a"
};

var currencyList = [];

(async () => {
  const currencyResp = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json");
  currencyList = Object.keys(await currencyResp.json());
})();

const currencyCache = {};

async function handleCurrencyConversion(from, value, to) {
  const key = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`;

  if (key in currencyCache && (Date.now() - currencyCache[key].ts) < 300000) {
    return value * currencyCache[key].data[from][to];
  } else {
    const currencyResp = await fetch(key);
    const currencyData = await currencyResp.json();

    currencyCache[key] = {
      ts: Date.now(),
      data: currencyData
    };

    return value * currencyData[from][to];
  }
}

async function handleConversion(from, value, to, aValue, aUnit) {
  const tripleConv = (aValue !== null && aUnit !== null);

  from = unitAbbreviations[from] || from;
  to = unitAbbreviations[to] || to;
  aUnit = unitAbbreviations[aUnit] || aUnit;

  const key = tripleConv ? `${from}-${to}-${aUnit}` : `${from}-${to}`;

  const conversion = conversionRates[key];
    
  if (typeof conversion === "function") {
    return tripleConv ? conversion(value, aValue) : conversion(value);
  } else if (currencyList.includes(from) && currencyList.includes(to)) {
    return handleCurrencyConversion(from, value, to);
  } else {
    return null;
  }
}

document.getElementById("input").addEventListener("input", async function (event) {
  const input = event.target.value.toLowerCase().trim();
  const match = input.match(/^(\d+(?:.\d+)?)\s*([a-z2]+)\s+to\s+([a-z2]+)(?:\s+at\s+(\d+(?:.\d+)?)([a-z2]+))?$/);

  if (!match) {
    document.getElementById("result").textContent = "waiting";
    return;
  }

  const value = parseFloat(match[1]);
  const fromUnit = match[2];
  const toUnit = match[3];
  const additionalValue = match[4] ? parseFloat(match[4]) : null;
  const additionalUnit = match[5] || null;

  const result = await handleConversion(fromUnit, value, toUnit, additionalValue, additionalUnit);

  if (result === null) {
    document.getElementById("result").textContent = "waiting";
  } else {
    document.getElementById("result").textContent = `${result.toPrecision(3)} ${toUnit}`;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("input").focus();
})

document.addEventListener("visibilitychange", function () {
  document.getElementById("input").focus();
})