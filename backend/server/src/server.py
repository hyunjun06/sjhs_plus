from flask import Flask
import re
import requests
import os
from jsbn import RSAKey
from bs4 import BeautifulSoup

API_KEY = ""

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

id = ""
password = ""

# Handles login with html request(Original code by 22048 오은총)
def login(returnUrl):
    loginPageResp = requests.get("https://student.gs.hs.kr/student/index.do?mode=manual&returnUrl=" + returnUrl)

    temporaryToken = re.findall(
        "JSESSIONID=(\\w+)", loginPageResp.headers['Set-Cookie'])[0]
    bs4Finder = BeautifulSoup(loginPageResp.text, 'html.parser')
    nVal = bs4Finder.find('input', {'id': 'm'})['value']
    eVal = bs4Finder.find('input', {'id': 'e'})['value']
    rsa = RSAKey()
    rsa.setPublic(nVal, eVal)

    id = rsa.encrypt(id)
    password = rsa.encrypt(password)
    try:
        getTkReq = requests.post("https://student.gs.hs.kr/student/requestAccessCode.do",
                                data={'type': 'STUD', 'userId': id, 'pwd': password}, cookies={'JSESSIONID': temporaryToken, 'userId': id},
                                headers={
                                    'Content-Type': 'application/x-www-form-urlencoded'},
                                allow_redirects=False
                                )
    except:
        print("Error while handling login request: cannot request access code")

    if getTkReq.text == "FINE":
        code = input("code: ")
        try:
            logInReq = requests.post("https://student.gs.hs.kr/student/loginCommit.do",
                                    data={'type': 'STUD', 'userId': id, 'pwd': password, 'accessCode': code, "mode": "ONE", "guid": "MOZILLAMACINTOSHINTELMACOSXAPPLEWEBKITKHTMLLIKEGECKOCHROMESAFARI", "device": "chrome", "returnUrl": "/index.do"}, cookies={'JSESSIONID': temporaryToken, 'userId': id},
                                    headers={
                                        'Content-Type': 'application/x-www-form-urlencoded'},
                                    allow_redirects=False
                                    )

            sessionKey = re.findall("JSESSIONID=(\\w+)",
                                    logInReq.headers['Set-Cookie'])[0]
            f = open("backend/server/src/session_key", "w")
            f.write(sessionKey)
            f.close()
        except:
            print("Error while handling login request: cannot commit login")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return "No such path: " + path

# date format e.g. 20220101
@app.route('/api/menus/<date>')
def get_menus(date):
    print("request for date: ", date)
    month = date[:6]
    day = date[6:]
    
    mealPageResp = requests.get("https://student.gs.hs.kr/student/api/meal/meal.do?key="+API_KEY+"&month="+month+"&date="+day)
    json = mealPageResp.json()
    if "error" in json:
        return {"아침": "", "점심": "", "저녁": ""}
    meals = json["meal"]["data"][0]
    parsedMeals = {
        "아침": re.sub('[0-9]+\.', '', meals["breakfast"].replace('|', ', ')),
        "점심": re.sub('[0-9]+\.', '', meals["lunch"].replace('|', ', ')),
        "저녁": re.sub('[0-9]+\.', '', meals["dinner"].replace('|', ', '))
    }
    
    return parsedMeals

@app.route('/api/timetable')
def get_timetable():
    pass

if __name__ == '__main__':
    with open("backend/server/src/login_cred", "r") as f:
        id = f.readline()
        password = f.readline()
        API_KEY = f.readline()
    app.run(host='0.0.0.0', debug=True, port=int(os.environ.get('PORT', 8080)))