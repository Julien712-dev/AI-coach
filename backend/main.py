from flask import Flask, request, jsonify
import tensorflow as tf

app = Flask(__name__)

available_fps = [3, 4, 5]
models = {fps: tf.keras.models.load_model(f'model/fps_{fps}') for fps in available_fps}
class_labels = ['push-up-arms-not-bent-enough', 'push-up-normal', 'push-up-waist-too-low', 'sit-up-normal', 'sit-up-too-low']

@app.route('/', methods=['GET'])
def root():
    return 'Exercise classifier running'

@app.route('/classify', methods=['POST'])
def classify():
    data = request.json
    timeseries = tf.convert_to_tensor(data['timeseries'])
    fps = data['fps']
    model = models[fps]
    probabilities = model.predict(timeseries)
    print(probabilities)
    index_result = list(tf.math.argmax(probabilities, axis=1).numpy())
    label_result = [class_labels[index] for index in index_result]
    return jsonify(label_result)

if __name__ == '__main__':
    # This is used when running locally only.
    app.run(host='0.0.0.0', port=8080, debug=True)