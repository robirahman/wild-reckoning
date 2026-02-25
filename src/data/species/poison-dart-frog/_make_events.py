TARGET = r"C:/Users/robir/Documents/Wild reckoning/src/data/species/poison-dart-frog/events.ts"

# The TypeScript content is stored as raw bytes below
# and decoded at runtime
import base64

# Will be populated with b64 data
DATA_CHUNKS = []

def finalize():
    data = base64.b64decode("".join(DATA_CHUNKS)).decode("utf-8")
    with open(TARGET, "w", encoding="utf-8") as f:
        f.write(data)
    print("Written", len(data), "chars to", TARGET)
