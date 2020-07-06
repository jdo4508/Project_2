from flask import Flask, render_template, jsonify

from flask_sqlalchemy import SQLAlchemy
from os import environ




app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URL') or 'sqlite:///app.sqlite'
db = SQLAlchemy(app)
 
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    host_id	= db.Column(db.Integer)
    host_name = db.Column(db.String)
    neighbourhood_group	= db.Column(db.String)
    neighbourhood = db.Column(db.Integer)
    latitude =  db.Column(db.Double)
    longitude =	 db.Column(db.Double)
    room_type = db.Column(db.String)
    price = db.Column(db.Double)
    minimum_nights =  db.Column(db.Integer)
    number_of_reviews = db.Column(db.Integer)
    last_review	reviews_per_month =
    calculated_host_listings_count =
    availability_365 = db.Column(db.Integer)
    name= db.Column(db.String)



@app.route('/')
def index():
    return render_template('index.html', name='my')


@app.route('/tasks')
def tasks():
    tasks = db.session.query(Task)
    data = []
    for task in tasks:
        item = {
            "id": task.id,
            "host_id": task.host_id,
            "host_name": task.host_name,
            "neighbourhood": task.neighbourhood,
            "latitude": task.latitude,
            "longitude": task.longitude,
            "room_type": task.room_type,
            "price": task.price,
            "minimum_nights": task.minimum_nights,
            "number_of_reviews": task.number_of_reviews,
            "last_review": task.last_review,
            "reviews_per_month": task.reviews_per_month,
            "calculated_host_listings_count": task.calculated_host_listings_count,
            "availability_365": task.availability_365,
            "name": task.name
        }
        data.append(item)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

