from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np

from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load the model
model = load_model('./backend/tomatomo_model')

# Define your class names
check_deceased = ['Tomato_Bacterial_spot',
 'Tomato_Early_blight',
 'Tomato_Late_blight',
 'Tomato_Leaf_Mold',
 'Tomato_Septoria_leaf_spot',
 'Tomato_Spider_mites_Two_spotted_spider_mite',
 'Tomato__Target_Spot',
 'Tomato__Tomato_YellowLeaf__Curl_Virus',
 'Tomato__Tomato_mosaic_virus',
 'Tomato_healthy']

list = np.load('./backend/tomato_cosine.npy')

@app.route('/')
def index():
    return 'Hello World!'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    # print(data)
    if 'image' not in data:
        return jsonify({'error': 'No file part'})


    img_file = "." + data['image'] 
    # print(img_file)
    test_img = tf.keras.utils.load_img(img_file,
                                   target_size=(256,256),
                                   grayscale=False
                                  )
    input_arr = tf.keras.utils.img_to_array(test_img)
    img_array = tf.expand_dims(input_arr,0).numpy()


    similarities = []
    test_data = model.predict(img_array)
    test_data = np.array(test_data)
    
    print("*"*50)
    print(test_data)
    print("*"*50)
    # Convert the data to numpy arrays for easy computation
    for i in range(len(list)):
        data = np.array(list[i])
        # Compute the dot product of the vectors
        dot_product = np.multiply(data, test_data)

        # Compute the norms of the vectors
        norm_data = np.linalg.norm(data)
        norm_test = np.linalg.norm(test_data)

        # Compute the linear cosine similarity
        similarities.append(np.sum(dot_product) / (norm_data * norm_test))

    # Find the index of the row with the highest similarity
    max_index = np.argmax(similarities)

        # Display the data with the highest similarity
    print("*"*50)
    print(f"The most similar row is: {list[max_index]} with a similarity of {similarities[max_index]}")
    print("*"*50)

    data = np.subtract(test_data[0],list[max_index][0])
    max_index = np.argmax(test_data)
    test_data[0][max_index] = 100
    sorted_data = sorted(enumerate(data), key=lambda x: abs(x[1]))
    # print("+++++++",sorted_data)
    nearest_indices = [index for index, _ in sorted_data[:3]]
    nearest_numbers = [num for _, num in sorted_data[:3]]

    # print(f"The top 3 numbers nearest to 0 are {nearest_numbers} at indices {nearest_indices}.")

    for i in nearest_indices :
        print(check_deceased[i])
    nameOfClass = check_deceased[np.argmax(model.predict(img_array))]
    # print("----- Chance of infection -----")
    data = []
    data.append(nameOfClass)
    for i in range(len(nearest_indices)) :
        data.append(check_deceased[nearest_indices[i]])

    return jsonify({'data': data})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)

