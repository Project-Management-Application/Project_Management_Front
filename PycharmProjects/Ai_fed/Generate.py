import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
import textwrap

# Load fine-tuned T5 model for Question Generation
model_name = "valhalla/t5-base-qg-hl"  # Pretrained for question generation
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

# Load cleaned Agile text
with open("cleaned_agile_text.txt", "r", encoding="utf-8") as file:
    agile_text = file.read()

# Split text into chunks (ensuring full context)
chunks = textwrap.wrap(agile_text, 512)  # Keeps context intact

qa_pairs = []

for chunk in chunks[:20]:  # Limit to 20 questions for testing
    input_text = f"Generate a question based on this text: {chunk}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)

    # Generate question
    output = model.generate(input_ids, max_length=50)
    question = tokenizer.decode(output[0], skip_special_tokens=True)

    # Store Q&A pair
    qa_pairs.append((question, chunk))

# Save the Q&A dataset
with open("agile_qa_dataset.txt", "w", encoding="utf-8") as file:
    for q, a in qa_pairs:
        file.write(f"Q: {q}\nA: {a}\n\n")

print("✅ Q&A dataset created successfully! Check 'agile_qa_dataset.txt'")
