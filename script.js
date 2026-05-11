const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const miles = document.getElementById('miles');
const efficiency = document.getElementById('efficiency');
const price = document.getElementById('price');
const gas = document.getElementById('gas');
const fields = {
  milesValue: document.getElementById('miles-value'),
  efficiencyValue: document.getElementById('efficiency-value'),
  priceValue: document.getElementById('price-value'),
  gasValue: document.getElementById('gas-value'),
  annualCost: document.getElementById('annual-cost'),
  gasEquivalent: document.getElementById('gas-equivalent'),
  savings: document.getElementById('savings'),
};

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const money2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const savedTheme = localStorage.getItem('wattsnear-theme');
const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
root.dataset.theme = savedTheme || (preferredDark ? 'dark' : 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('wattsnear-theme', next);
  });
}

function updateCalculator() {
  if (!miles || !efficiency || !price || !gas) return;

  const weeklyMiles = Number(miles.value);
  const milesPerKwh = Number(efficiency.value);
  const electricity = Number(price.value);
  const gasPrice = Number(gas.value);

  const annualMiles = weeklyMiles * 52;
  const annualKwh = milesPerKwh > 0 ? annualMiles / milesPerKwh : 0;
  const annualChargingCost = annualKwh * electricity;
  const annualGasGallons = annualMiles / 28;
  const annualGasCost = annualGasGallons * gasPrice;
  const savings = annualGasCost - annualChargingCost;

  fields.milesValue.textContent = weeklyMiles.toLocaleString();
  fields.efficiencyValue.textContent = milesPerKwh.toFixed(1);
  fields.priceValue.textContent = money2.format(electricity);
  fields.gasValue.textContent = money2.format(gasPrice);
  fields.annualCost.textContent = money.format(annualChargingCost);
  fields.gasEquivalent.textContent = money.format(annualGasCost);
  fields.savings.textContent = `${savings >= 0 ? '' : '-'}${money.format(Math.abs(savings))}`;
}

['input', 'change'].forEach((eventName) => {
  miles && miles.addEventListener(eventName, updateCalculator);
  efficiency && efficiency.addEventListener(eventName, updateCalculator);
  price && price.addEventListener(eventName, updateCalculator);
  gas && gas.addEventListener(eventName, updateCalculator);
});
updateCalculator();
