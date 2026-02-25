import sys, base64
target = "C:/Users/robir/Documents/Wild reckoning/src/data/species/poison-dart-frog/events.ts"
data = base64.b64decode(sys.argv[1]).decode("utf-8")
with open(target, "a", encoding="utf-8") as out:
    out.write(data)
print("Appended", len(data), "chars")
