import requests
from bs4 import BeautifulSoup

# List of URLs to scrape
urls = [
    "https://en.wikipedia.org/wiki/Agile_software_development",
    "https://www.scrum.org/resources/blog",  # Scrum.org Blog
    "https://sochova.com/blog",  # Agile and Scrum Blog by Zuzi Sochova
    "https://kanbandan.com/blog",  # KanbanDan Blog
    "https://djaa.com/blog",  # David J Anderson & Associates (Kanban)
    "https://ddegrandis.com/blog",  # DDegrandis Blog (Kanban & Agile)
]

# Initialize an empty string to store content
structured_content = ""

for url in urls:
    try:
        print(f"Scraping {url}...")
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise error if request fails
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract and structure headers + paragraphs
        structured_content += f"\n\n### Content from {url} ###\n\n"

        for tag in soup.find_all(["h1", "h2", "h3", "p"]):
            if tag.name in ["h1", "h2", "h3"]:
                structured_content += f"\n\n**{tag.text.strip()}**\n\n"  # Format headers
            elif tag.name == "p":
                text = tag.text.strip()
                if text:
                    structured_content += f"{text}\n\n"  # Keep paragraphs clean

    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to scrape {url}: {e}")

# Save the structured content
with open("agile_scraped_data.txt", "w", encoding="utf-8") as file:
    file.write(structured_content)

print("✅ Scraping completed! Data saved in 'agile_scraped_data.txt'")
