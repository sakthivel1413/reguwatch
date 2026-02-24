import json
import os
from typing import List, Dict, Any

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "updates.json")

def load_updates() -> List[Dict[str, Any]]:
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []

def save_updates(updates: List[Dict[str, Any]]):
    existing = load_updates()
    existing_links = {item['link'] for item in existing}
    
    new_count = 0
    for update in updates:
        if update['link'] not in existing_links:
            existing.append(update)
            new_count += 1
    
    # Sort by date (this is tricky with strings, but we'll try)
    # For now just keep them in order of discovery
    
    with open(DATA_FILE, "w") as f:
        json.dump(existing, f, indent=4)
    
    return new_count

def get_filtered_updates(keyword: str = None) -> List[Dict[str, Any]]:
    updates = load_updates()
    if not keyword:
        return updates
    
    keyword = keyword.lower()
    return [
        u for u in updates 
        if keyword in u['title'].lower() or keyword in u['summary'].lower()
    ]
