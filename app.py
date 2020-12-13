import urllib.request
import json
from detect import main
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))


@app.route('/parseImages', methods=['GET', 'POST'])
def getYoloObjects():
    img = request.files["file"]
    imgname = secure_filename(img.filename)
    path = basedir + '/data/images/' + imgname
    print(path)
    img.save(path)
    lst = main(type="images", iou_threshold=0.5, confidence_threshold=0.5,
               input_names=[path])
    return jsonify(yoloRes=lst)
