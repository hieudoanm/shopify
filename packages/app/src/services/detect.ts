export type DetectionResult = {
	url: string;
	isShopify: boolean;
	isPlus: boolean;
	confidence: number;
	signals: string[];
	checkedAt: number;
};

export const detectFromHTML = (url: string, html: string): DetectionResult => {
	console.info('[ShopifyDetect] Start scan:', url);

	if (!html) {
		console.error('[ShopifyDetect] Empty HTML');
	}

	const h = html.toLowerCase();
	const signals: string[] = [];
	let score = 0;

	console.debug('[ShopifyDetect] HTML length:', html.length);

	// --- Core Shopify signals ---

	if (h.includes('cdn.shopify.com')) {
		signals.push('HTML: cdn.shopify.com');
		score += 40;
		console.info('[ShopifyDetect] Found cdn.shopify.com (+40)');
	}

	if (h.includes('shopify-section')) {
		signals.push('HTML: shopify-section');
		score += 30;
		console.info('[ShopifyDetect] Found shopify-section (+30)');
	}

	if (h.includes('shopify')) {
		signals.push('HTML: shopify keyword');
		score += 10;
		console.info('[ShopifyDetect] Found "shopify" keyword (+10)');
	}

	// --- Shopify Plus detection ---

	let isPlus = false;

	if (h.includes('shopify plus') || h.includes('shopify-plus')) {
		isPlus = true;
		signals.push('HTML: shopify-plus');
		score += 20;
		console.info('[ShopifyDetect] Found Shopify Plus marker (+20)');
	}

	// --- Final evaluation ---

	const isShopify = score >= 40;
	const confidence = Math.min(score, 100);

	console.info('[ShopifyDetect] Final score:', confidence);
	console.info(
		'[ShopifyDetect] Result:',
		isShopify ? 'Shopify' : 'Not Shopify',
		isPlus ? '(Plus)' : '',
	);

	if (signals.length === 0) {
		console.warn('[ShopifyDetect] No Shopify signals found');
	} else {
		console.debug('[ShopifyDetect] Signals:', signals);
	}

	return {
		url,
		isShopify,
		isPlus,
		confidence,
		signals,
		checkedAt: Date.now(),
	};
};
