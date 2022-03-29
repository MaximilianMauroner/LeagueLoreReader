from pathlib import Path
from gtts import gTTS
import os
from os.path import exists
import json



if __name__ == '__main__':
    f = open('story.json')
    data = json.load(f)
    text_id = data['text_id']
    text = data['story']
    if not exists("../LoreFiles/" + text_id + ".mp3"):
        tts = gTTS(text, lang='en', slow=False)
        tts.save("../LoreFiles/" + text_id + ".mp3")
    if Path("../LoreFiles/"+text_id+".mp3").stat().st_size > 512:
        print(1)
    else:
        print(0)
