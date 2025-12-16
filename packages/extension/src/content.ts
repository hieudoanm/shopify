/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShopifyDetectionResult } from './types';

const shopifyIndicators = {
  windowShopify: typeof (window as any).Shopify !== 'undefined',

  shopifyMeta: !!document.querySelector(
    'meta[name="shopify-checkout-api-token"]',
  ),

  shopifyCDN: Array.from(document.scripts).some((script) =>
    script.src.includes('cdn.shopify.com'),
  ),

  cartJS: Array.from(document.scripts).some((script) =>
    script.src.includes('/cart.js'),
  ),
};

const isShopify = Object.values(shopifyIndicators).some(Boolean);

/* ---------------------------------- */
/* Shopify Plus detection              */
/* ---------------------------------- */

const plusIndicators = {
  checkoutDomain: location.hostname.includes('checkout.shopify'),

  checkoutObject:
    typeof (window as any).Shopify !== 'undefined' &&
    typeof (window as any).Shopify.checkout !== 'undefined',

  digitalWalletMeta: !!document.querySelector(
    'meta[name="shopify-digital-wallet"]',
  ),
};

// Require Shopify + at least ONE Plus indicator
const isShopifyPlus = isShopify && Object.values(plusIndicators).some(Boolean);

const result: ShopifyDetectionResult = {
  isShopify,
  isShopifyPlus,
  indicators: shopifyIndicators,
  plusIndicators,
};

chrome.runtime.onMessage.addListener(
  (message: string, _sender, sendResponse) => {
    if (message === 'CHECK_SHOPIFY') {
      sendResponse(result);
    }
  },
);
