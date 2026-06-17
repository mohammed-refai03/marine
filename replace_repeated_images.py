import os

directory = "d:/office-projects/marine"

# Define replacements file-by-file to target specific elements and avoid breaking other sections

def process_index():
    filepath = os.path.join(directory, "index.html")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Threat Card: Plastic Pollution Crisis
    # Use photo-1548248823-ceca48559f19 (floating plastic bottle) instead of photo-1628102422437-2dbb4a57c94f
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1628102422437-2dbb4a57c94f?auto=format&fit=crop&w=800&q=80" alt="Plastic Pollution"',
        'img src="https://images.unsplash.com/photo-1548248823-ceca48559f19?auto=format&fit=crop&w=800&q=80" alt="Plastic Pollution"'
    )

    # 2. Threat Card: Coral Reef Destruction
    # Use photo-1506784983877-45594efa4cbe (dying bleached coral) instead of photo-1546026423-cc4642628d2b
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80" alt="Coral Reef Destruction"',
        'img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80" alt="Coral Reef Destruction"'
    )

    # 3. Bento Card 2: Coral Restoration Projects
    # Use photo-1522069169874-c58ec4b76be5 (tropical fish reef) instead of photo-1546026423-cc4642628d2b
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&q=80" alt="Coral Restoration"',
        'img src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80" alt="Coral Restoration"'
    )

    # 4. Bento Card 3: Advanced Marine Research
    # Use photo-1582967788606-a171c1080cb0 (scientific research diving team) instead of photo-1583212292454-1fe6229603b7
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=600&q=80" alt="Marine Research"',
        'img src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80" alt="Marine Research"'
    )

    # 5. Bento Card 5: Wildlife Protection & Sustainable Advocacy
    # Use photo-1568430462989-4b16f61f2cf6 (dolphin leaping) instead of photo-1551244072-5d12893278ab
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1200&q=80" alt="Wildlife Protection"',
        'img src="https://images.unsplash.com/photo-1568430462989-4b16f61f2cf6?auto=format&fit=crop&w=1200&q=80" alt="Wildlife Protection"'
    )

    # 6. Blog Card: The Microplastic Dilemma
    # Use photo-1563245372-f21724e3856d (volunteers with bags) instead of photo-1628102422437-2dbb4a57c94f
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1628102422437-2dbb4a57c94f?auto=format&fit=crop&w=500&q=80" alt="Blog Ocean Pollution"',
        'img src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80" alt="Blog Ocean Pollution"'
    )

    # 7. Blog Card: Coral Bleaching
    # Use photo-1601987177651-8edfe6c20009 (bleached coral) instead of photo-1546026423-cc4642628d2b
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=500&q=80" alt="Blog Coral bleaching"',
        'img src="https://images.unsplash.com/photo-1601987177651-8edfe6c20009?auto=format&fit=crop&w=500&q=80" alt="Blog Coral bleaching"'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated index.html")


def process_services():
    filepath = os.path.join(directory, "services.html")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. card-coral: Coral Reef Restoration
    # Use photo-1522069169874-c58ec4b76be5 (tropical fish reef) instead of photo-1546026423-cc4642628d2b
    content = content.replace(
        "background: url('https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80') center/cover no-repeat;",
        "background: url('https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80') center/cover no-repeat;"
    )

    # 2. card-research: Marine Research
    # Use photo-1582967788606-a171c1080cb0 (scientific diving team) instead of photo-1583212292454-1fe6229603b7
    content = content.replace(
        "background: url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80') center/cover no-repeat;",
        "background: url('https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80') center/cover no-repeat;"
    )

    # 3. Bento Card HTML: Beach Cleanup Programs
    # Use photo-1563245372-f21724e3856d (volunteers with bags) instead of photo-1628102422437-2dbb4a57c94f
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1628102422437-2dbb4a57c94f?auto=format&fit=crop&w=800&q=80" alt="Beach Cleanup Programs"',
        'img src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80" alt="Beach Cleanup Programs"'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated services.html")


def process_blog():
    filepath = os.path.join(directory, "blog.html")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Blog Article 1: Plastic Pollution Crisis
    # Use photo-1621451537084-482c730e386e (plastic bottle on beach) instead of photo-1628102422437-2dbb4a57c94f
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1628102422437-2dbb4a57c94f?auto=format&fit=crop&w=900&q=80" alt="Plastic Pollution"',
        'img src="https://images.unsplash.com/photo-1621451537084-482c730e386e?auto=format&fit=crop&w=900&q=80" alt="Plastic Pollution"'
    )

    # 2. Blog Article 3: Coral Bleaching Recovery Diagnostics
    # Use photo-1553856622-d1b352e9a211 (scientific lab) instead of photo-1583212292454-1fe6229603b7
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=600&q=80" alt="Coral Bleaching Survey"',
        'img src="https://images.unsplash.com/photo-1553856622-d1b352e9a211?auto=format&fit=crop&w=600&q=80" alt="Coral Bleaching Survey"'
    )

    # 3. Blog Article 6: Marine Biodiversity Protection Targets
    # Use photo-1570481662006-a341ef72780e (humpback whale tail) instead of photo-1551244072-5d12893278ab
    content = content.replace(
        'img src="https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=700&q=80" alt="Deep Sea Life"',
        'img src="https://images.unsplash.com/photo-1570481662006-a341ef72780e?auto=format&fit=crop&w=700&q=80" alt="Deep Sea Life"'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated blog.html")


def process_contact():
    filepath = os.path.join(directory, "contact.html")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Background Image:
    # Use photo-1530122037265-a5f1f91d3b99 (deep ocean horizon) instead of photo-1583212292454-1fe6229603b7
    content = content.replace(
        "background: url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;",
        "background: url('https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated contact.html")

process_index()
process_services()
process_blog()
process_contact()
