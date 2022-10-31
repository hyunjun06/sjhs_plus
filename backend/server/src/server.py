from flask import Flask
import re
import requests
import os

API_KEY = "f21ef3c3-392d-43b1-9e2f-bf07f24e63c5"

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

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
def method_name():
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=int(os.environ.get('PORT', 8080)))