from pymongo import MongoClient
import os
client = MongoClient(os.getenv("MONGO_URL")) 

def get_mongodb_connection():
    db_connection = client.Overlay
    if db_connection is not None:
        print("Connected to MongoDB")
    return db_connection

def close_mongodb_connection():
    client.close()


