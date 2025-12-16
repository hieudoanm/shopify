export interface ShopifyIndicators {
  windowShopify: boolean;
  shopifyMeta: boolean;
  shopifyCDN: boolean;
  cartJS: boolean;
}

export interface ShopifyPlusIndicators {
  checkoutDomain: boolean;
  checkoutObject: boolean;
  digitalWalletMeta: boolean;
}

export interface ShopifyDetectionResult {
  isShopify: boolean;
  isShopifyPlus: boolean;
  indicators: ShopifyIndicators;
  plusIndicators: ShopifyPlusIndicators;
}
