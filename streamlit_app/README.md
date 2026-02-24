# ReguWatch Canada - Regulatory Watchdog

This is a Streamlit-based web scraper and dashboard designed to track regulatory updates for the Canadian insurance industry, focusing on OSFI (Office of the Superintendent of Financial Institutions).

## Features
- **Automated Web Scraping**: Tracks the latest news and guidance from OSFI.
- **Auto Insurance Focus**: Dedicated filters to find standards and regulations specifically for auto insurance.
- **Flexible Architecture**: Built with a base scraper class to easily add RSS feeds or API integrations later.
- **Persistent Storage**: Saves updates locally to track history.

## How to Run

1. **Install Dependencies**:
   ```bash
   pip install -r streamlit_app/requirements.txt
   ```

2. **Run the App**:
   ```bash
   cd streamlit_app
   streamlit run main.py
   ```

3. **Sync Data**:
   Click the "Sync/Check for Updates" button in the sidebar to fetch newest data from OSFI.

## Project Structure
- `main.py`: The Streamlit dashboard.
- `scrapers/`: Contains scraper logic (OSFI, Base class).
- `utils/`: Data management and filtering.
- `data/`: JSON storage for regulatory updates.
