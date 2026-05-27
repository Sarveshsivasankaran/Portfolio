import sys
from lxml import html

# Force stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def parse_dump():
    with open("diagnose_featured.html", "r", encoding="utf-8") as f:
        content = f.read()

    tree = html.fromstring(content)
    
    anchors = tree.xpath("//a")
    print(f"Total anchor tags in the DOM: {len(anchors)}")
    
    list_items = tree.xpath("//li")
    print(f"Total list items (li) in the DOM: {len(list_items)}")
    
    card_types = ["post", "link", "article", "document", "certificate", "certification", "project", "media"]
    found_cards = 0
    for a in anchors:
        text = a.text_content().strip()
        text_clean = " ".join(text.split())
        
        matched = False
        for ct in card_types:
            if text_clean.lower().startswith(ct):
                matched = True
                break
                
        if matched:
            found_cards += 1
            print(f"\nCard #{found_cards}:")
            print(f"  Href: {a.get('href')}")
            print(f"  Snippet: {text_clean[:180]}")
            parent = a.getparent()
            if parent is not None:
                print(f"  Parent tag: {parent.tag}, class: {parent.get('class')}")
                grandparent = parent.getparent()
                if grandparent is not None:
                    print(f"  Grandparent tag: {grandparent.tag}, class: {grandparent.get('class')}")

if __name__ == "__main__":
    parse_dump()
