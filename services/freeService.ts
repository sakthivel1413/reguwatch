
import { Regulator, RegUpdate, TemplateAnalysis } from "../types";

/**
 * Fetches latest updates using a free CORS proxy to avoid API keys.
 * Uses Direct Scraping of official news pages.
 */
export const fetchLatestUpdatesFree = async (regulators: Regulator[]): Promise<RegUpdate[]> => {
    const proxy = "https://api.allorigins.win/get?url=";

    // Mapping of regulators to their news page URLs
    const urls: Record<string, string> = {
        [Regulator.FSRA]: "https://www.fsrao.ca/newsroom",
        [Regulator.CIRO]: "https://www.ciro.ca/news",
        [Regulator.OSFI]: "https://www.osfi-bsif.gc.ca/en/news",
        [Regulator.CSA]: "https://www.securities-administrators.ca/news/"
    };

    const allUpdates: RegUpdate[] = [];

    for (const reg of regulators) {
        const url = urls[reg];
        if (!url) continue;

        try {
            const response = await fetch(`${proxy}${encodeURIComponent(url)}`);
            const data = await response.json();
            const html = data.contents;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Simple implementation: extract headlines based on common tags
            // In a production app, we would use specific selectors for each site
            const items = Array.from(doc.querySelectorAll("h2, h3, .news-title, .title")).slice(0, 3);

            items.forEach((item, index) => {
                const title = item.textContent?.trim() || "Regulatory Update";
                if (title.length < 10) return; // Skip junk

                allUpdates.push({
                    id: `${reg}-${index}-${Date.now()}`,
                    regulator: reg,
                    date: new Date().toISOString().split('T')[0],
                    title: title,
                    summary: `The regulator ${reg} has published a new update titled "${title}". Please review the official source for compliance details.`,
                    url: url,
                    impactLevel: title.toLowerCase().includes('amendment') || title.toLowerCase().includes('guidance') ? 'High' : 'Medium'
                });
            });
        } catch (error) {
            console.error(`Failed to fetch updates for ${reg}:`, error);
        }
    }

    // If we couldn't fetch anything, return some mock data so the app isn't empty
    return allUpdates.length > 0 ? allUpdates : [];
};

/**
 * Performs a keyword-based compliance analysis for free.
 */
export const analyzeTemplateFree = async (templateText: string, recentUpdates: string): Promise<TemplateAnalysis> => {
    const text = templateText.toLowerCase();
    const keywords = ["disclosure", "privacy", "fees", "terms", "termination", "fintrac", "complaint"];
    const missing = keywords.filter(k => !text.includes(k));

    let status: 'Compliant' | 'At Risk' | 'Needs Review' = 'Compliant';
    let summary = "The document template contains standard regulatory keywords and appears to be in alignment with general requirements.";
    let suggestedChanges: string[] = [];

    if (missing.length > 3) {
        status = 'At Risk';
        summary = "Several critical regulatory disclosure keywords were not found in your template. This may lead to non-compliance.";
        suggestedChanges = missing.map(m => `Include a section regarding "${m}" to meet ${m} standards.`);
    } else if (missing.length > 0) {
        status = 'Needs Review';
        summary = "The template is mostly compliant but might be missing some specific recent disclosures mentioned in the latest updates.";
        suggestedChanges = missing.map(m => `Review if a "${m}" disclosure is required under current guidance.`);
    }

    // Simulate a slight delay for "analysis"
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        status,
        summary,
        suggestedChanges
    };
};
