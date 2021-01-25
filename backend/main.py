from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Exercise classifier running'


if __name__ == '__main__':
    # This is used when running locally only.
    app.run(host='127.0.0.1', port=8080, debug=True)