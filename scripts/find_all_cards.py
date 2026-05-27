import sys
from lxml import html

# Force stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def find_all_links():
    with open("diagnose_featured.html", "r", encoding="utf-8") as f:
        content = f.read()

    tree = html.fromstring(content)
    anchors = tree.xpath("//a")
    
    print(f"Total anchors: {len(anchors)}")
    
    unique_links = {}
    
    # We want to find anchors that represent featured cards.
    # Typically, these are inside the main column and have a substantial amount of text, or specific classes, or href patterns.
    for a in anchors:
        href = a.get('href', '')
        text = a.text_content().strip()
        text_clean = " ".join(text.split())
        
        # Check if the href points to a post/feed update or has redirect, or if it is inside the card deck
        # On owner's management page, there are Edit / Delete buttons. Let's look at parent container
        parent = a.getparent()
        parent_class = parent.get('class', '') if parent is not None else ''
        
        # If it has some substantial text (longer than 20 chars) and has href, let's print it
        if href and len(text_clean) > 20:
            # Skip common header/footer links
            if "linkedin.com/feed" in href or "feed/update" in href or "safety/go" in href or "/in/sarvesh" in href:
                if href not in unique_links:
                    unique_links[href] = text_clean
                    
    print(f"Found {len(unique_links)} unique potential card links:")
    for idx, (href, text) in enumerate(unique_links.items()):
        print(f"\nLink #{idx+1}:")
        print(f"  Href: {href}")
        print(f"  Text: {text[:200]}")

if __name__ == "__main__":
    find_all_links()
