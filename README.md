# fa20-research

This project parses uploaded images and returns a poetry about it. <br> <br>
References: Yolo v3 in Tensorflow by [Kaggle notebook](https://www.kaggle.com/aruchomu/yolo-v3-object-detection-in-tensorflow) 

After cloning this repo, follow the following steps to compile and start the project.


## Server compilation
The server is written in Python v3. To compile the server, go to `/server` folder
and follow the instructions below.

### Environment and Packages Setup
This project needs the virtual environment.<br> <br>
For mac users, that is to run the following commands:
```
python3 -m venv venv
. venv/bin/activate
```
and for Windows users:
```
py -3 -m venv venv
venv\Scripts\activate
```

After activating the virtual environment, run the following commands to install packages
```
pip install -r requirements.txt
```

### Downloading official pretrained weights
Let's download official weights pretrained on COCO dataset. 

```
wget -P weights https://pjreddie.com/media/files/yolov3.weights
```

### Save the weights in Tensorflow format
Save the weights using `load_weights.py` script.

```
python load_weights.py
```


## Running the project
After setting up the backend, we can start to run the project by going into 
`/frontend_2` folder and enter command `yarn dev`.

The commands above assume that users are running this porject on a windows OS. If you
are using a MacOS, go into `/frontend_2/package.json` and change `server` into
```
"server": "cd .. && cd server && . venv/bin/activate && flask run --no-debugger",
```

After the project is launched, follow the instructions on the website. Click 
`upload` to upload an image of your choice / change the image uploaded. Once 
you are all set, click `Generate Poem` to have a poetry for your pet :)
