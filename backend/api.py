from flask import Flask, request, make_response
from flask_restful import Resource, Api
from flask_cors import *
import datetime
import numpy as np
import json

from data import *

app = Flask(__name__)
api = Api(app)
CORS(app, supports_credentials=True)

data = getData()
data = data.drop(columns=['_id'], axis = 1)

# process data with price of 'Average' 'Open' 'Close' 'High' 'Low' and remove redundant attributes
def processData(data, method):
    # insert new attributes 'Price'
    data.insert(data.shape[1], 'Price', 0)
    if method == 'Average':
        for each in data.iterrows():
            data.loc[each[0], 'Price'] = format((float(str(each[1]['Open']).replace(',','')) + float(str(each[1]['Close']).replace(',','')) + float(str(each[1]['High']).replace(',','')) + float(str(each[1]['Low']).replace(',',''))) / 4, '.3f')      
    elif method == 'Open':
        for each in data.iterrows():
            data.loc[each[0], 'Price'] = format((float(str(each[1]['Open']).replace(',',''))))
    elif method == 'Close':
        for each in data.iterrows():
            data.loc[each[0], 'Price'] = format((float(str(each[1]['Close']).replace(',',''))))
    elif method == 'High':
        for each in data.iterrows():
            data.loc[each[0], 'Price'] = format((float(str(each[1]['High']).replace(',',''))))
    elif method == 'Low':
        for each in data.iterrows():
            data.loc[each[0], 'Price'] = format((float(str(each[1]['Low']).replace(',',''))))
            
    # remove redundant attributes
    data = data.drop(columns=['Open', 'Close', 'High', 'Low'], axis = 1)
    
    return data

# calculate the change from the previous date (yesterday, a week ago, a month ago)
def getLastDate(date, res, method):
    # get dates
    yesterday = data[data['Date'] == (date + datetime.timedelta(days = -1)).strftime('%Y-%m-%d')]
    aweek = data[data['Date'] == (date + datetime.timedelta(days = -7)).strftime('%Y-%m-%d')]
    amonth = data[data['Date'] == (date + datetime.timedelta(days = -30)).strftime('%Y-%m-%d')]
    
    if len(yesterday) != 0:
        # process data of yesterday
        yesterday = processData(yesterday, method)
        res.insert(res.shape[1], 'Yesterday', 0)
        
        # iter and calculate the change of each one
        for each in res.iterrows():
            d1 = float(res.loc[each[0], 'Price'])
            temp = yesterday[yesterday['Currency'] == res.loc[each[0], 'Currency']]
            if len(temp) != 0:
                d2 = float(temp['Price'])
                res.loc[each[0], 'Yesterday'] = str(format((d1 - d2) / d2 * 100, '.3f')) + '%'
            else:
                # if no avaliable data then get 'NA'
                res.loc[each[0], 'Yesterday'] = 'NA'
    else:
        res.insert(res.shape[1], 'Yesterday', 'NA')
        
    if len(aweek) != 0:
        aweek = processData(aweek, method)
        res.insert(res.shape[1], 'Aweek', 0)
        
        for each in res.iterrows():
            d1 = float(res.loc[each[0], 'Price'])
            temp = aweek[aweek['Currency'] == res.loc[each[0], 'Currency']]
            if len(temp) != 0:
                d2 = float(temp['Price'])
                res.loc[each[0], 'Aweek'] = str(format((d1 - d2) / d2 * 100, '.3f')) + '%'
            else:
                res.loc[each[0], 'Aweek'] = 'NA'
    else:
        res.insert(res.shape[1], 'Aweek', 'NA')
        
    if len(amonth) != 0:
        amonth = processData(amonth, method)
        res.insert(res.shape[1], 'Amonth', 0)
        
        for each in res.iterrows():
            d1 = float(res.loc[each[0], 'Price'])
            temp = amonth[amonth['Currency'] == res.loc[each[0], 'Currency']]
            if len(temp) != 0:
                d2 = float(temp['Price'])
                res.loc[each[0], 'Amonth'] = str(format((d1 - d2) / d2 * 100, '.3f')) + '%'
            else:
                res.loc[each[0], 'Amonth'] = 'NA'
    else:
        res.insert(res.shape[1], 'Amonth', 'NA')
        
    return res

@app.route('/', methods=['GET'])
def index():
    res = processData(pd.concat(each[1].head(1) for each in data.groupby('Currency')), 'Average')
    res = getLastDate(res['Date'][0], res, 'Average') 
    
    return res.to_json(orient="index",force_ascii=False, date_format='iso')

# get date range
@app.route('/Date', methods=['GET'])
def get_Date():
    sorted_data = data.sort_values(by='Date')
    sorted_data.index = range(0, len(sorted_data))
    
    return json.dumps({'from': sorted_data.at[0,'Date'].strftime('%Y-%m-%d'), 'to': sorted_data.at[len(sorted_data) - 1, 'Date'].strftime('%Y-%m-%d')})

@app.route('/<string:date>/<string:method>', methods=['GET'])
def get_index(date, method):
    if date == 'default':
        res = processData(pd.concat(each[1].head(1) for each in data.groupby('Currency')), method)
    else:
        res = processData(pd.concat(each[1][each[1]['Date'] == date] for each in data.groupby('Currency')), method)      
    if len(res) == 0:
        abort(404)
    res = getLastDate(res['Date'].iat[0], res, method)

    return res.to_json(orient="index",force_ascii=False, date_format='iso')

@app.errorhandler(404)
def not_found(error):
    return make_response('404 Error', 404)

if __name__ == '__main__':
    app.run(debug=True, port=5000)


    

