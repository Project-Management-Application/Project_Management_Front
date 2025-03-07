import re
import spacy
import nltk
from nltk.corpus import stopwords

# Download necessary data
nltk.download("stopwords")

# Load SpaCy English model
nlp = spacy.load("en_core_web_sm")

# Load raw text
with open("agile_scraped_data.txt", "r", encoding="utf-8") as file:
    raw_text = file.read()


def clean_text(text):
    # Remove URLs
    text = re.sub(r"https?://\S+", "", text)

    # Fix hyphens (e.g., "agile - base" → "agile-based")
    text = re.sub(r"\s*-\s*", "-", text)

    # Fix spacing around slashes (e.g., "customer / end user" → "customer/end user")
    text = re.sub(r"\s*/\s*", "/", text)

    # Remove extra spaces before punctuation
    text = re.sub(r"\s+([,.])", r"\1", text)

    # Tokenize text while keeping structure
    doc = nlp(text)

    cleaned_sentences = []
    for sent in doc.sents:
        words = []
        for token in sent:
            if token.is_punct:  # Keep punctuation
                words.append(token.text)
            else:
                words.append(token.text)  # Keep original word, no lemmatization

        cleaned_sentences.append(" ".join(words))

    return cleaned_sentences


# Clean the text
cleaned_data = clean_text(raw_text)

# Save cleaned data
with open("cleaned_agile_text.txt", "w", encoding="utf-8") as file:
    file.write("\n".join(cleaned_data))

print("Data cleaning completed! Cleaned text saved to 'cleaned_agile_text.txt'")
