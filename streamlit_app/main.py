import streamlit as st
import pandas as pd
import datetime
import sys
import os

# Robust path handling to fix imports
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

try:
    from scrapers.osfi import OSFIScraper
    from scrapers.fcac_rss import FCACRSSScraper
    from scrapers.iais import IAISScraper
    from utils.data_manager import load_updates, save_updates, get_filtered_updates
except ImportError:
    # Fallback for some Streamlit environments
    sys.path.insert(0, os.getcwd())
    from scrapers.osfi import OSFIScraper
    from scrapers.fcac_rss import FCACRSSScraper
    from scrapers.iais import IAISScraper
    from utils.data_manager import load_updates, save_updates, get_filtered_updates

# --- Page Configuration ---
st.set_page_config(
    page_title="ReguWatch Canada | Regulatory Watchdog",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# --- Custom CSS ---
st.markdown("""
<style>
    .stApp {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .update-card {
        background-color: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        margin-bottom: 20px;
        border-left: 6px solid #1e3a8a;
        transition: all 0.3s ease;
    }
    .update-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.1);
    }
    .update-title {
        color: #1e3a8a;
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 10px;
        text-decoration: none;
        display: block;
    }
    .update-title:hover {
        color: #2563eb;
    }
    .update-meta {
        font-size: 0.85rem;
        color: #64748b;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .update-summary {
        color: #334155;
        font-size: 1rem;
        line-height: 1.6;
    }
    .badge {
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .badge-scraping { background-color: #e0f2fe; color: #0369a1; }
    .badge-rss { background-color: #fef3c7; color: #92400e; }
    .badge-auto { background-color: #dcfce7; color: #166534; border: 1px solid #86efac; }
    
    .header-container {
        padding: 3rem 0;
        text-align: center;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 20px;
        margin-bottom: 2rem;
        backdrop-filter: blur(10px);
    }
    h1 { color: #1e3a8a !important; font-weight: 800 !important; }
</style>
""", unsafe_allow_html=True)

# --- Sidebar ---
st.sidebar.image("https://www.osfi-bsif.gc.ca/themes/custom/osfi_theme/logo.svg", width=150)
st.sidebar.title("🛡️ ReguWatch")
st.sidebar.markdown("---")

# Search & Basic Filters
search_query = st.sidebar.text_input("🔍 Search Keyword", "")
auto_only = st.sidebar.checkbox("🚗 Auto Insurance Only", value=False)

st.sidebar.markdown("### 🛠️ Advanced Filters")
sources_available = ["OSFI", "FCAC", "IAIS"]
selected_sources = st.sidebar.multiselect("Sources", sources_available, default=sources_available)

types_available = ["Web Scraping", "RSS Feed"]
selected_types = st.sidebar.multiselect("Update Types", types_available, default=types_available)

st.sidebar.markdown("### 🔢 Sorting")
sort_option = st.sidebar.selectbox(
    "Sort By",
    ["Date (Newest First)", "Date (Oldest First)", "Title (A-Z)", "Title (Z-A)"]
)

st.sidebar.markdown("---")
if st.sidebar.button("🔄 Sync Intelligence", use_container_width=True):
    with st.spinner("Monitoring regulatory bodies..."):
        all_new = []
        if "OSFI" in selected_sources:
            all_new += OSFIScraper().scrape()
        if "FCAC" in selected_sources:
            all_new += FCACRSSScraper().scrape()
        if "IAIS" in selected_sources:
            all_new += IAISScraper().scrape()
            
        added = save_updates(all_new)
        if added > 0:
            st.sidebar.success(f"Discovered {added} new regulatory items!")
        else:
            st.sidebar.info("No new updates detected.")

# --- Main Content ---
st.markdown("""
    <div class="header-container">
        <h1>ReguWatch Canada</h1>
        <p style="font-size: 1.2rem; color: #475569;">Precision monitoring for Insurance Standards & Regulations</p>
    </div>
""", unsafe_allow_html=True)

# Data Processing
updates = get_filtered_updates(search_query if search_query else None)

# Apply Source and Type Filters
updates = [u for u in updates if u.get('source') in selected_sources]
updates = [u for u in updates if u.get('type') in selected_types]

if auto_only:
    updates = [u for u in updates if "auto" in u['title'].lower() or "auto" in u['summary'].lower()]

# Sorting Logic
if sort_option == "Date (Newest First)":
    updates.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
elif sort_option == "Date (Oldest First)":
    updates.sort(key=lambda x: x.get('timestamp', ''), reverse=False)
elif sort_option == "Title (A-Z)":
    updates.sort(key=lambda x: x.get('title', '').lower())
elif sort_option == "Title (Z-A)":
    updates.sort(key=lambda x: x.get('title', '').lower(), reverse=True)

# Define Tabs
tab1, tab2 = st.tabs(["🏛️ Regulatory Updates (OSFI/FCAC)", "📜 Insurance Standards (IAIS/ICPs)"])

def display_updates(items):
    if not items:
        st.info("No items found matching your current filters in this category.")
        return
    
    st.write(f"**Showing {len(items)} results**")
    for item in items:
        is_auto = "auto" in item['title'].lower() or "auto" in item['summary'].lower()
        
        type_class = "badge-scraping" if "Scraping" in item['type'] else "badge-rss"
        badge_html = f'<span class="badge {type_class}">{item["type"]}</span>'
        if is_auto:
            badge_html += '<span class="badge badge-auto">AUTO INSURANCE</span>'
            
        st.markdown(f"""
            <div class="update-card">
                <div class="update-meta">
                    {badge_html} <span>|</span> 🏢 <b>{item['source']}</b> <span>|</span> 📅 {item['date']}
                </div>
                <a href="{item['link']}" target="_blank" class="update-title">{item['title']}</a>
                <div class="update-summary">{item['summary']}</div>
            </div>
        """, unsafe_allow_html=True)

with tab1:
    # Regulators: OSFI, FCAC
    reg_updates = [u for u in updates if u.get('source') in ["OSFI", "FCAC"]]
    display_updates(reg_updates)

with tab2:
    # Standards: IAIS
    std_updates = [u for u in updates if u.get('source') == "IAIS"]
    display_updates(std_updates)

st.markdown("---")
st.markdown("<p style='text-align: center; color: #64748b;'>ReguWatch Intelligence Dashboard | v2.1</p>", unsafe_allow_html=True)
