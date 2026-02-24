from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseScraper(ABC):
    @abstractmethod
    def scrape(self) -> List[Dict[str, Any]]:
        """
        Scrape the source and return a list of updates.
        Each update should be a dictionary with:
        - title: str
        - date: str (YYYY-MM-DD or readable format)
        - link: str
        - summary: str (optional)
        - source: str (id of the source)
        """
        pass
