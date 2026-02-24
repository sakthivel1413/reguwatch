import feedparser
from typing import List, Dict, Any
from scrapers.base import BaseScraper
import datetime
import html
import re

class FCACRSSScraper(BaseScraper):
    def __init__(self):
        self.url = "https://api.io.canada.ca/io-server/gc/news/en/v2?dept=financialconsumeragency&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-07-23&pick=50&format=atom&atomtitle=Financial%20Consumer%20Agency%20of%20Canada"
        self.source_id = "FCAC"

    def scrape(self) -> List[Dict[str, Any]]:
        updates = []
        try:
            feed = feedparser.parse(self.url)
            
            for entry in feed.entries:
                title = entry.title if 'title' in entry else "No title"
                link = entry.link if 'link' in entry else ""
                
                # Atom feeds usually have 'published' or 'updated'
                date_str = ""
                if 'published' in entry:
                    date_str = entry.published
                elif 'updated' in entry:
                    date_str = entry.updated
                
                # Try to format the date nicely if possible
                try:
                    # Parse Atom date (ISO 8601)
                    # feedparser actually parses dates into entry.published_parsed if it recognizes them
                    if 'published_parsed' in entry and entry.published_parsed:
                        dt = datetime.datetime(*entry.published_parsed[:6])
                        date_display = dt.strftime("%B %d, %Y")
                    else:
                        dt = datetime.datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                        date_display = dt.strftime("%B %d, %Y")
                except:
                    date_display = date_str

                summary = ""
                if 'summary' in entry:
                    summary = html.unescape(entry.summary)
                    # Strip HTML tags
                    summary = re.sub('<[^<]+?>', '', summary)
                
                if not summary:
                    summary = "No summary available."
                
                if len(summary) > 300:
                    summary = summary[:297] + "..."

                updates.append({
                    "id": f"{self.source_id}_{hash(link)}",
                    "title": title,
                    "date": date_display,
                    "link": link,
                    "summary": summary,
                    "source": self.source_id,
                    "type": "RSS Feed",
                    "timestamp": datetime.datetime.now().isoformat()
                })
                
        except Exception as e:
            print(f"Error parsing FCAC RSS: {e}")
            
        return updates
