import requests, json

API_URL = "https://xeno-canto.org/api/3/recordings"
API_KEY = "1fdc4e4c745cb4a4f5c07cff87ea3b569675c877"

for species in ["Rhea americana", "Crypturellus obsoletus", "Tinamus solitarius"]:
    resp = requests.get(API_URL, params={"query": f'sp:"{species}"', "key": API_KEY})
    r = resp.json()["recordings"][0]

    # Extract hash from sono URL
    sono_url = r["sono"]["small"]
    # format: https://xeno-canto.org/sounds/spectrograms/HASH/ID/grey-small.png
    parts = sono_url.split("/")
    uploader_hash = parts[5]  # YOXWKYFZAP etc.

    # Build filename: replace extension with .mp3
    filename = r["file-name"].rsplit(".", 1)[0] + ".mp3"

    audio_url = f"https://xeno-canto.org/sounds/uploaded/{uploader_hash}/{filename}"
    print(f"{species}: {audio_url}")
