import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any
from scrapers.base import BaseScraper
import datetime
import re

class IAISScraper(BaseScraper):
    def __init__(self):
        self.url = "https://www.iais.org/news-and-events/latest-news/"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        }
        self.source_id = "IAIS"

    def scrape(self) -> List[Dict[str, Any]]:
        updates = []
        try:
            response = requests.get(self.url, headers=self.headers, timeout=15)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # IAIS news structure often uses h5 for titles in their latest-news page
            news_items = soup.select('h5')
            
            for h5 in news_items:
                title_tag = h5.select_one('a')
                if not title_tag:
                    continue
                
                title = " ".join(title_tag.text.split())
                link = title_tag['href']
                if not link.startswith('http'):
                    link = "https://www.iais.org" + (link if link.startswith('/') else '/' + link)
                
                # Find date - usually next to the heading or in a sibling
                # In the markdown we saw: [3 Dec 2025](url) after the title
                date_str = ""
                sibling = h5.find_next_sibling()
                if sibling:
                    date_match = re.search(r'(\d{1,2}\s+[A-Z][a-z]+\s+\d{4})', sibling.get_text())
                    if date_match:
                        date_str = date_match.group(1)
                
                if not date_str:
                    # Look inside h5 or nearby
                    date_match = re.search(r'(\d{1,2}\s+[A-Z][a-z]+\s+\d{4})', h5.get_text())
                    if date_match:
                        date_str = date_match.group(1)
                    else:
                        date_str = datetime.date.today().strftime("%B %d, %Y")

                # Summary: usually the next paragraph or sibling text
                summary = ""
                if sibling and sibling.name == 'p':
                    summary = " ".join(sibling.get_text().split())
                else:
                    # Search further siblings
                    next_p = h5.find_next('p')
                    if next_p:
                        summary = " ".join(next_p.get_text().split())
                
                if not summary or len(summary) < 20:
                    summary = "Regulatory update from IAIS regarding insurance standards and ICPs."

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
            print(f"Error scraping IAIS: {e}")
            
        return updates
