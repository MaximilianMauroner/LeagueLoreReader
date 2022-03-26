import requests
from bs4 import BeautifulSoup
import sys
from gtts import gTTS
import os
from os.path import exists
import json

def prepareJson(json):
    story = ""
    id = json["id"]
    title = ""
    if "story" in json:
        title = json["story"]["title"]
        for sections in json["story"]["story-sections"]:
            for section in sections["story-subsections"]:
                story+= section["content"]
    else:
        title = json["title"]
        story = json['champion']["biography"]["full"]
    return story, title, id

def getWebsite(url, retry = False):
    if retry == False:
        url  = url.split(".com/en_US")[1]
        url = "https://universe-meeps.leagueoflegends.com/v1/en_us" + url + "index.json"
    page = requests.get(url)
    if page.status_code == 200:
        responseParsedJasonInHTMLContent, title, id = prepareJson(page.json())
        soup = BeautifulSoup(responseParsedJasonInHTMLContent, 'html.parser').text
        return soup, title,id
    else:
        if retry == False:
            temp = url.split("story/champion/")
            color = temp[1].split("/")[0]+ "/"
            s = temp[0]+"champions/"+ color + "index.json"
            return getWebsite(s, True)
        return False, False, False




def checkIfFileExists(fileName):
    return
    


if __name__ == '__main__':
    url = sys.argv[1]
    text, title, id = getWebsite(url)
    if not exists("../LoreFiles/"+ id+".mp3"):
        tts = gTTS(text, lang='en', slow=False)
        tts.save("../LoreFiles/"+ id+".mp3")
    print((id+".mp3").strip())
