import { ShopifyDetectionResult } from './types';

const resultEl = document.getElementById('result') as HTMLDivElement;
const detailsEl = document.getElementById('details') as HTMLUListElement;

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab?.id) return;

  chrome.tabs.sendMessage(
    tab.id,
    'CHECK_SHOPIFY',
    (response: ShopifyDetectionResult) => {
      if (!response) return;

      resultEl.textContent = response.isShopify
        ? response.isShopifyPlus
          ? '🚀 Shopify Plus detected'
          : '✅ Shopify detected'
        : '❌ Not Shopify';

      resultEl.className = response.isShopify ? 'yes' : 'no';
      detailsEl.innerHTML = '';

      Object.entries(response.indicators).forEach(([k, v]) => {
        const li = document.createElement('li');
        li.textContent = `${k}: ${v}`;
        detailsEl.appendChild(li);
      });

      if (response.isShopifyPlus) {
        Object.entries(response.plusIndicators).forEach(([k, v]) => {
          const li = document.createElement('li');
          li.textContent = `PLUS → ${k}: ${v}`;
          detailsEl.appendChild(li);
        });
      }
    },
  );
});
