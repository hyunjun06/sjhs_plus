from flask import Flask
import re
import requests
import os
from jsbn import RSAKey
from bs4 import BeautifulSoup
import re

API_KEY = ""

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

id = ""
password = ""
session_key = ""

# Handles login with html request(Original code by 22048 오은총)
def login():
    global id 
    global password
    global session_key
    
    loginPageResp = requests.get("https://student.gs.hs.kr/student/index.do?mode=manual")

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

            sessionKey = re.findall("JSESSIONID=(\\w+)", logInReq.headers['Set-Cookie'])[0]
            f = open("session_key", "w")
            f.write(sessionKey)
            f.close()
            session_key = sessionKey
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
    if session_key == "NULL":
        login()
        
    timeTableRequest = requests.get("https://student.gs.hs.kr/student/score/studentTimetable.do", cookies={'JSESSIONID': session_key})
    
    beautifulSoup = BeautifulSoup(timeTableRequest.text, 'html.parser')
    rawTimeRows = beautifulSoup.find_all('tr')
    timeRows = []
    
    index = 0
    for row in rawTimeRows:
        if index % 3 == 1:
            timeRows.append(row)
        index += 1
    
    # print([re.sub('\n|\r|\t', '', row.text) for row in timeRows])
    
    timeTable = [[""] * 6 for i in range(11)]
    timeTable[0] = ["교시", "월요일", "화요일", "수요일", "목요일", "금요일"]
    classNum = 1
    for row in timeRows:
        dateNum = 1
        timeTable[classNum][0] = str(classNum) + "교시"
        for col in row.find_all('td')[2:]:
            if col.has_attr('class'):
                # print(str(classNum) + " " + str(dateNum) + ": " + re.sub('\n|\r|\t', '', col.text))
                timeTable[classNum][dateNum] = ''.join([re.sub('\n|\r|\t', '', div.text).strip() for div in col.find_all('div')])
            else:
                # print(str(classNum) + " " + str(dateNum) + ": " + "공강")
                timeTable[classNum][dateNum] = "공강"
            dateNum += 1
        classNum += 1
    
    return {'head': timeTable[0], 'table': timeTable[1:]}

if __name__ == '__main__':
    with open("login_cred", "r") as f:
        id = f.readline()
        id = id.strip('\r\n')
        password = f.readline()
        password = password.strip('\r\n')
        API_KEY = f.readline()
        API_KEY = API_KEY.strip('\r\n')
        
    with open("session_key", "r") as f:
        session_key = f.readline()
    
    app.run(host='0.0.0.0', debug=True, port=int(os.environ.get('PORT', 8080)))