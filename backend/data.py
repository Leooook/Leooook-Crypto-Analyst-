import pandas as pd

from db import *

def getData():
    while True:   
        client = getDb()
        # Process data and transfer to dataframe type
        db = client['data']
        mycol = db['crypto_historical_data']
        data = pd.DataFrame(list(mycol.find()))
        # Standardlize the date type
        data['Date'] = data['Date'].astype('datetime64[ns]')

        return data
     

    
