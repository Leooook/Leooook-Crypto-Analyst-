import pymongo

def getDb():
    while True:
        try:
            # Get data from database
            client = pymongo.MongoClient("mongodb+srv://Leo:leo123456@cluster.mpfob.mongodb.net/<dbname>retryWrites=true&w=majority")
            return client
        except ValueError:
            print("Can not connect database. Try again...")
