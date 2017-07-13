#-*- coding=utf-8 -*-
from flask import Flask, request, render_template, jsonify
import requests

app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def check_url():
    return render_template('check_url.html')


@app.route('/check_ajax', methods=["POST"])
def check_ajax():
    url = request.form.get('url')
    from check_url import geturls
    print 'check ' + url
    data = geturls(url)
    return jsonify(data)


@app.route('/link_ua', methods=["POST"])
def link_ua():
    url = request.form.get('url')
    word = request.form.get('word')
    from check_url import checkone
    print 'check ' + url
    data = checkone(url, word)
    return jsonify(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
