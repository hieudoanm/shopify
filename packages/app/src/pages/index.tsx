import { DetectionResult, detectFromHTML } from '@shopify/services/detect';
import type { NextPage } from 'next';
import { FormEvent, useEffect, useState } from 'react';

const STORAGE_KEY = 'shopify-history';

const HomePage: NextPage = () => {
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState<DetectionResult[]>([]);

	// ✅ Load history once (no effect, no warning)
	const [history, setHistory] = useState<DetectionResult[]>(() => {
		if (typeof window === 'undefined') return [];
		try {
			const h = localStorage.getItem(STORAGE_KEY);
			return h ? JSON.parse(h) : [];
		} catch {
			return [];
		}
	});

	// ✅ Load theme once
	const [theme, setTheme] = useState<'light' | 'dark'>(() => {
		if (typeof window === 'undefined') return 'light';
		return (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
	});

	// ✅ Side-effect only
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	function saveHistory(items: DetectionResult[]) {
		setHistory((prev) => {
			const merged = [...items, ...prev].slice(0, 50);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
			return merged;
		});
	}

	const checkBatch = async (event: FormEvent) => {
		event.preventDefault();
		const urls = input
			.split('\n')
			.map((u) => u.trim())
			.filter(Boolean);

		if (!urls.length) return;

		setLoading(true);
		setResults([]);

		const newResults: DetectionResult[] = [];

		for (const raw of urls) {
			try {
				const url = raw.startsWith('http') ? raw : `https://${raw}`;
				const res = await fetch(url);
				const html = await res.text();

				const result = detectFromHTML(url, html);
				newResults.push(result);
			} catch {
				newResults.push({
					url: raw,
					isShopify: false,
					isPlus: false,
					confidence: 0,
					signals: ['Fetch failed (CORS or network)'],
					checkedAt: Date.now(),
				});
			}
		}

		setResults(newResults);
		saveHistory(newResults);
		setLoading(false);
	};

	return (
		<main className="bg-base-200 min-h-screen p-6">
			<div className="mx-auto max-w-4xl space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">Shopify Detector</h1>

					<button
						className="btn btn-sm"
						onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
						{theme === 'light' ? '🌙 Dark' : '☀️ Light'}
					</button>
				</div>

				{/* Batch input */}
				<div className="card bg-base-100 shadow">
					<form onSubmit={checkBatch} className="card-body">
						<h2 className="card-title">Batch check</h2>

						<textarea
							className="textarea textarea-bordered h-32 w-full font-mono"
							placeholder={`example.com\nshopify.com\nnike.com`}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							required
						/>

						<button
							type="submit"
							className="btn btn-primary mt-4 w-full"
							disabled={loading}>
							{loading ? 'Checking…' : 'Check sites'}
						</button>
					</form>
				</div>

				{/* Results */}
				{results.length > 0 && (
					<div className="space-y-3">
						{results.map((r) => (
							<div key={r.url} className="card bg-base-100 shadow">
								<div className="card-body space-y-2">
									<div className="flex items-center justify-between">
										<span className="font-mono text-sm">{r.url}</span>
										<span className="badge badge-outline">{r.confidence}%</span>
									</div>

									{r.isShopify ? (
										<div className="text-success font-semibold">
											✔ Shopify detected {r.isPlus && '(Plus)'}
										</div>
									) : (
										<div className="text-error font-semibold">
											✖ Not Shopify
										</div>
									)}

									<progress
										className={`progress ${
											r.isShopify ? 'progress-success' : 'progress-error'
										}`}
										value={r.confidence}
										max={100}
									/>

									<ul className="ml-4 list-disc text-xs opacity-70">
										{r.signals.map((s) => (
											<li key={s}>{s}</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>
				)}

				{/* History */}
				{history.length > 0 && (
					<div className="card bg-base-100 shadow">
						<div className="card-body">
							<h2 className="card-title">History</h2>

							<ul className="max-h-48 space-y-1 overflow-auto text-sm">
								{history.map((h) => (
									<li key={h.checkedAt}>
										<span className="opacity-70">
											{new Date(h.checkedAt).toLocaleString()}
										</span>
										{' — '}
										<span>{h.url}</span>
										<span className="badge badge-xs ml-2">{h.confidence}%</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}
			</div>
		</main>
	);
};

export default HomePage;
