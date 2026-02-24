import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any
from scrapers.base import BaseScraper
import datetime
import re

class OSFIScraper(BaseScraper):
    def __init__(self):
        self.url = "https://www.osfi-bsif.gc.ca/en/news"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        }
        self.source_id = "OSFI"

    def scrape(self) -> List[Dict[str, Any]]:
        updates = []
        try:
            response = requests.get(self.url, headers=self.headers, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find news items. GC.ca usually uses .views-row or article
            rows = soup.select('.views-row')
            if not rows:
                rows = soup.select('article')
            
            seen_links = set()
            for row in rows:
                title_tag = row.select_one('h3 a, h2 a')
                if not title_tag:
                    continue
                
                link = title_tag['href']
                if link.startswith('/'):
                    link = "https://www.osfi-bsif.gc.ca" + link
                
                if link in seen_links:
                    continue
                seen_links.add(link)
                
                title = " ".join(title_tag.text.split())
                
                # Try multiple date selectors
                date_tag = row.select_one('time, .views-field-created, .date')
                date_str = " ".join(date_tag.text.split()) if date_tag else None
                
                if not date_str:
                    text = row.get_text()
                    date_match = re.search(r'([A-Z][a-z]+ \d{1,2}, \d{4})', text)
                    if date_match:
                        date_str = date_match.group(1)
                    else:
                        date_str = datetime.date.today().strftime("%B %d, %Y")

                # Try to get better summary
                summary_tag = row.select_one('.views-field-body, p')
                summary = " ".join(summary_tag.text.split()) if summary_tag else ""
                
                # If no summary on main page, try to fetch from the link
                if not summary or "No summary" in summary or len(summary) < 50:
                    try:
                        detail_resp = requests.get(link, headers=self.headers, timeout=10)
                        detail_soup = BeautifulSoup(detail_resp.text, 'html.parser')
                        body_tag = detail_soup.select_one('.field--name-body, .node__content, article p')
                        if body_tag:
                            summary = " ".join(body_tag.get_text().split())
                    except:
                        pass
                
                if not summary:
                    # Fallback: look for content next to title
                    content_div = row.select_one('.news--content')
                    if content_div:
                        summary = " ".join(content_div.get_text().split())
                
                if not summary:
                    summary = "No summary available."
                    
                if len(summary) > 400:
                    summary = summary[:397] + "..."

                updates.append({
                    "id": f"{self.source_id}_{hash(link)}",
                    "title": title,
                    "date": date_str,
                    "link": link,
                    "summary": summary,
                    "source": self.source_id,
                    "type": "Web Scraping",
                    "timestamp": datetime.datetime.now().isoformat()
                })
                
        except Exception as e:
            print(f"Error scraping OSFI: {e}")
            
        return updates
