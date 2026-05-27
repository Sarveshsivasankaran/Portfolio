import sys
from lxml import html
import json

# Force stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def parse_scrolled():
    with open("diagnose_scrolled.html", "r", encoding="utf-8") as f:
        content = f.read()

    tree = html.fromstring(content)
    
    # Let's find all cards
    # A card is typically a list item (li) or a div containing card elements.
    # In LinkedIn details featured page, the cards are list items inside a ul or list structure.
    # Let's inspect the DOM.
    # Let's print the list items or anchors that contain card types.
    
    card_types = ["post", "link", "article", "document", "certificate", "certification", "project", "media"]
    
    # We want to identify the exact card containers.
    # Let's find all anchors first and get their parent structures.
    anchors = tree.xpath("//a")
    
    cards = []
    seen_hrefs = set()
    
    for a in anchors:
        href = a.get('href', '')
        if not href:
            continue
            
        # Clean up text content
        text = a.text_content().strip()
        text_clean = " ".join(text.split())
        
        # Determine if it's a featured item card anchor
        # Cards usually start with the card type prefix, e.g., "Post", "Link", "Article", "Document"
        ct_found = None
        for ct in card_types:
            if text_clean.lower().startswith(ct):
                ct_found = ct
                break
                
        if ct_found:
            # Clean up the type prefix from text
            # E.g. "Post" or "Link"
            prefix_len = len(ct_found)
            body_text = text_clean[prefix_len:].strip()
            
            # Skip if we already added this href
            if href in seen_hrefs:
                continue
                
            seen_hrefs.add(href)
            
            # Find image within the parent card container
            # We look in the anchor's siblings or ancestors for an img tag
            img_src = None
            
            # Traverse up to find a container (like li or parent div)
            curr = a
            for _ in range(5):
                curr = curr.getparent()
                if curr is None:
                    break
                imgs = curr.xpath(".//img")
                if imgs:
                    for im in imgs:
                        src = im.get('src')
                        # Exclude small icons or profile pictures
                        if src and "profile-treasury-image" in src or "feedshare-shrink" in src or "feedshare-document" in src or "media.licdn.com/dms/image" in src:
                            img_src = src
                            break
                if img_src:
                    break
            
            cards.append({
                "type": ct_found,
                "url": href,
                "text": body_text,
                "image": img_src
            })
            
    print(f"Total parsed cards in scrolled DOM: {len(cards)}")
    
    for idx, card in enumerate(cards):
        print(f"\nCard #{idx+1}:")
        print(f"  Type: {card['type']}")
        print(f"  Url: {card['url']}")
        print(f"  Image: {card['image']}")
        print(f"  Text preview: {card['text'][:250]}")
        
if __name__ == "__main__":
    parse_scrolled()
