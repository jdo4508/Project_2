# import necessary libraries

from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import pymongo
from pymongo import MongoClient

import mongopath

# create instance of Flask app
app = Flask(__name__)

cluster = MongoClient("mongodb+srv://johnswittenborn:######@project2-76gn3.mongodb.net/<dbname>?retryWrites=true&w=majority")

db = cluster["project2db"]
listings = db["project2"]


# create route that renders index.html template
@app.route('/')
def index():
    return render_template('index.html', name='my')


@app.route("/datagrab")
def datagrabber():
     Onelistings = listings.find_one()
     print(Onelistings)
     Onelistings.pop("_id")
     return jsonify(Onelistings)
    

@app.route("/getall")
def getter():
    data = []
    for mylist in listings.find():
        item = {
            "id": mylist["id"],
            "host_id": mylist["host_id"],
            "host_name": mylist["host_name"],
            "host_id": mylist["host_id"],
            "host_name": mylist["host_name"],
            "neighbourhood": mylist["neighbourhood"],
            "latitude": mylist["latitude"],
            "longitude": mylist["longitude"],
            "room_type": mylist["room_type"],
            "price": mylist["price"],
            "minimum_nights": mylist["minimum_nights"],
            "number_of_reviews": mylist["number_of_reviews"],
            "last_review": mylist["last_review"],
            "reviews_per_month": mylist["reviews_per_month"],
            "calculated_host_listings_count": mylist["calculated_host_listings_count"],
            "availability_365": mylist["availability_365"],
            "name": mylist["name"]
        }
        data.append(item)
    return jsonify(data)


#     listings = mongo.db.collection
#write python code to pull in data
  #return data


if __name__ == "__main__":
    app.run(debug=True)
