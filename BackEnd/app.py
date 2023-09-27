from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask import jsonify
from connection import get_mongodb_connection
import os
app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route('/')
def hello_world():
    check = get_mongodb_connection()
    return 'Hello, World!'

@app.route('/get_overlay', methods=['GET'])
def get_overlay():
    try:
        db_connection = get_mongodb_connection()
        overlay_collection = db_connection.Overlay
        overlay = overlay_collection.find({})
        new_overlay = []
        for i in overlay:
            i['_id'] = str(i['_id'])
            new_overlay.append(i)
        return jsonify(
            {
                "success": "Overlay found",
                "data": list(new_overlay)
            }
        )
    except Exception as e:
        print(e)
        return jsonify({"error": "Error in get_overlay"})
    
@app.route('/update_overlay', methods=['POST'])
def update_overlay():
    try:
        db_connection = get_mongodb_connection()
        overlay_collection = db_connection.Overlay
        data= request.get_json() 
        top = data['top']
        left = data['left']

        print(top,left,data['content'])
        overlay = overlay_collection.find_one(
            {
               "content": data['content'],
            }
        )
        if overlay:
            overlay_collection.update_one(
                {
                    "content": data['content'],
                },
                {
                    "$set": {
                        "content": data['content'],
                        "position": {
                            "top": data['top'],
                            "left": data['left']
                        }
                        
                    }
                }
            )
            return jsonify({"success": "Overlay updated successfully"})
        else:   
            return jsonify({"error": "Overlay not found"})
        


    except Exception as e:
        print(e)
        return jsonify({"error": "Error in update_overlay"})
    

@app.route('/add_overlay', methods=['POST'])
def add_overlay():
    try:
        data = request.get_json()
        overlay_document = {
            "content": data['content'],
            "position": {
                "top": data['top'],
                "left": data['left']
            }
        }

        print(overlay_document)

        db_connection = get_mongodb_connection()
        overlay_collection = db_connection.Overlay
        existing_overlay = overlay_collection.find_one(
            {
                "position": {
                    "top": data['top'],
                    "left": data['left']
                }
            }
        )
        if existing_overlay:
            return jsonify({"error": "Overlay already exists"})
        else:
            overlay_collection.insert_one(overlay_document)
            return jsonify({"success": "Overlay added successfully"})
    except Exception as e:
        print(e)
        return jsonify({"error": "Error in add_overlay"})


@app.route('/delete_overlay', methods=['POST'])
def delete_overlay():
    try:
        data = request.get_json()
        top = data['top']
        left = data['left']

        db_connection = get_mongodb_connection()
        overlay_collection = db_connection.Overlay
        overlay = overlay_collection.find_one(
            {
                "position": {
                    "top": top,
                    "left": left
                }
            }
        )
        if overlay:
            overlay_collection.delete_one(
                {
                    "position": {
                        "top": top,
                        "left": left
                    }
                }
            )
            return jsonify({"success": "Overlay deleted successfully"})
        else:
            return jsonify({"error": "Overlay not found"})
    except Exception as e:
        print(e)
        return jsonify({"error": "Error in delete_overlay"}) 
    

if __name__ == '__main__':
    print(os.getenv("MONGO_URL"))
    app.run(debug=True, port=os.getenv("PORT"))


