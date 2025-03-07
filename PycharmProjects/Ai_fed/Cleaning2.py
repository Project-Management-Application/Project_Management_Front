import re

# Load scraped text
with open("agile_scraped_data.txt", "r", encoding="utf-8") as file:
    raw_text = file.read()

# Step 1: Remove citation numbers like [1], [2], etc.
cleaned_text = re.sub(r"\[\d+\]", "", raw_text)

# Step 2: Normalize spaces and remove extra newlines
cleaned_text = re.sub(r"\n{3,}", "\n\n", cleaned_text)  # Replace 3+ newlines with 2
cleaned_text = re.sub(r"\s+", " ", cleaned_text).strip()  # Remove unnecessary spaces

# Step 3: Preserve section headers (**Title**) by ensuring they remain on new lines
cleaned_text = re.sub(r"\*\*(.*?)\*\*", r"\n\n**\1**\n\n", cleaned_text)  # Ensure headers stand out

# Step 4: Save cleaned text
with open("cleaned_agile_text.txt", "w", encoding="utf-8") as file:
    file.write(cleaned_text)

print("✅ Cleaning complete! Data saved in 'cleaned_agile_text.txt'")
