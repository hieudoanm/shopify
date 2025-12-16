package services

import (
	"net/http"
	"strings"
	"time"
)

func CheckShopify(url string) (isShopify bool, isPlus bool, signals []string, err error) {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return
	}

	req.Header.Set("User-Agent", "shopify-check/1.0")

	resp, err := client.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()

	// ---- Header-based signals ----
	for key, values := range resp.Header {
		lk := strings.ToLower(key)

		if strings.HasPrefix(lk, "x-shopify") {
			isShopify = true
			signals = append(signals, "Header: "+key)

			if lk == "x-shopify-stage" || lk == "x-shopify-shop-api-call-limit" {
				isPlus = true
			}
		}

		for _, v := range values {
			lv := strings.ToLower(v)
			if strings.Contains(lv, "shopify") {
				isShopify = true
				signals = append(signals, "Header value: "+key)
			}
		}
	}

	// ---- HTML sniffing (partial read) ----
	buf := make([]byte, 16*1024)
	n, _ := resp.Body.Read(buf)
	html := strings.ToLower(string(buf[:n]))

	if strings.Contains(html, "cdn.shopify.com") {
		isShopify = true
		signals = append(signals, "HTML: cdn.shopify.com")
	}

	if strings.Contains(html, "shopify-section") {
		isShopify = true
		signals = append(signals, "HTML: shopify-section")
	}

	if strings.Contains(html, "shopify-plus") {
		isPlus = true
		signals = append(signals, "HTML: shopify-plus")
	}

	return
}
