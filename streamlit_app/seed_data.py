import sys
import os

# Add the current directory to sys.path so we can import from scrapers/utils
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrapers.osfi import OSFIScraper
from scrapers.fcac_rss import FCACRSSScraper
from scrapers.iais import IAISScraper
from utils.data_manager import save_updates

def main():
    print("Initializing ReguWatch data...")
    # OSFI
    osfi = OSFIScraper()
    osfi_up = osfi.scrape()
    
    # FCAC
    fcac = FCACRSSScraper()
    fcac_up = fcac.scrape()
    
    # IAIS
    iais = IAISScraper()
    iais_up = iais.scrape()
    
    count = save_updates(osfi_up + fcac_up + iais_up)
    print(f"Done! Seeded {count} updates from regulatory sources.")

if __name__ == "__main__":
    main()
