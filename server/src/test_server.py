import requests
import os
from PIL import Image
import numpy as np
import tensorflow as tf
import sys
from object_detection_d.utils import label_map_util
from object_detection_d.utils import ops as utils_ops
from object_detection_d.utils import visualization_utils as viz_utils
tf.enable_eager_execution()

#imageName = sys.argv[1]
imageName = "file_1642402892195.jpg"
BASEPATH = os.path.dirname(os.path.realpath(__file__))
PATH_TO_LABELS = os.path.join('src/object_detection_d', 'label_map.pbtxt')
category_index = label_map_util.create_category_index_from_labelmap(
    PATH_TO_LABELS, use_display_name=True)

#image = Image.open('uploader/'+imageName)
image = Image.open('../uploader/'+imageName)
image_np = np.array(image)
payload = {"inputs":[image_np.tolist()]}
headers = {"content-type": "application/json"}
res = requests.post("http://172.30.1.80:8501/v1/models/test-mask:predict", json=payload, headers=headers)
json = res.json()
detections = json['outputs']
image_np_with_detections = image_np.copy()
image_np_with_detectionss = image_np.copy()

#with open("src/object_detection_d/testTest.txt", 'w') as f:
#    f.write(str(res.content))

detection_boxes = tf.squeeze(detections['detection_boxes'], [0])
detection_masks = tf.squeeze(detections['detection_masks'], [0])
real_num_detection = tf.cast(detections['num_detections'][0], tf.int32)
detection_boxes = tf.slice(detection_boxes, [0, 0],
                              [real_num_detection, -1])
detection_masks = tf.slice(detection_masks, [0, 0, 0],
                              [real_num_detection, -1, -1])
detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
    detection_masks, detection_boxes, image_np.shape[0], image_np.shape[1])
detection_masks_reframed = tf.cast(
    tf.greater(detection_masks_reframed, 0.5), tf.uint8)
detections['detection_masks'] = tf.expand_dims(detection_masks_reframed, 0)

detections['num_detections'] = int(detections['num_detections'][0])
detections['detection_classes'] = np.array(
    detections['detection_classes'][0], dtype=np.uint8)
detections['detection_boxes'] = np.array(detections['detection_boxes'][0])
detections['detection_scores'] = np.array(
    detections['detection_scores'][0])
detections['detection_masks'] = detections['detection_masks'][0].numpy()

viz_utils.visualize_boxes_and_labels_on_image_array(
        image_np_with_detections,
        detections['detection_boxes'],
        detections['detection_classes'],
        detections['detection_scores'],
        category_index,
        instance_masks=detections.get('detection_masks'),
        use_normalized_coordinates=True,
        max_boxes_to_draw=200,
        min_score_thresh=.30)

coordinates = viz_utils.return_coordinates(
        image_np_with_detectionss,
        detections['detection_boxes'],
        detections['detection_classes'],
        detections['detection_scores'],
        category_index,
        use_normalized_coordinates=True,
        max_boxes_to_draw=200,
        line_thickness=8,
        min_score_thresh=.30)

textfile = open("src/json"+filename_string+".json", "a")
                    textfile.write(json.dumps(coordinates))
                    textfile.write("\n")

file_name = "dddd.jpg"
save_path = os.path.join('src/saveImage/', file_name)
im = Image.fromarray(image_np_with_detections)
im.save(save_path)
print(save_path)