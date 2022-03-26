import requests
from bs4 import BeautifulSoup
import sys
from gtts import gTTS
import os


def getWebsite(url):
    page = requests.get(url)
    if page.status_code == 200:
        soup = BeautifulSoup(page.content, 'html.parser')
        content = soup.find("meta", property="og:description")
        title = soup.find_all('title')[0]
        lore_text = content.get("content", None)
        return lore_text ,title.get_text()
    else:
        return False, False


def pytts(text, title):
    engine = pyttsx3.init('espeak')
    engine.setProperty('rate', 275)

    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[0].id)

    engine.save_to_file(text, 'test.mp3')
    engine.runAndWait()
#
#     print(title+'.mp3')
    


if __name__ == '__main__':
    url = sys.argv[1]
    text, title = getWebsite(url)
    # pytts("text", "title")
    tts = gTTS(text, lang='en', slow=False)
    tts.save("../LoreFiles/"+ title+".mp3")
    print((title+".mp3").strip())
