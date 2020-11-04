import React, { useState } from 'react';
import FastAverageColor from 'fast-average-color';
import P5Wrapper from 'react-p5-wrapper';
import ml5 from 'ml5';
import './App.css';

function App() {
  const fac = new FastAverageColor()
  // a list of image names
  // const [img, setImg] = useState({});
  const [src, setSrc] = useState("");
  const [temp, setTemp] = useState(0);

  const readURL = file => {
    // Check if the file is an image.
    if (file.type && file.type.indexOf('image') === -1) {
      console.log('File is not an image.', file.type, file);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      setSrc(event.target.result);
      // const img = document.getElementById("output");
      // const color = fac.getColor(img);
      // console.log(color);
    });
    reader.readAsDataURL(file);
  }

  const changeImg = e => {
    console.log(e.target.files);
    console.log(e.target.files[0]);
    console.log(e.target.files[1])
    const i = e.target.files[0];
    // setImg(e.target.files[0]);
    // console.log(img);
    readURL(i);
  }

  const upload = () => {
    const img = document.getElementById("output");
    const color = fac.getColor(img);
    console.log(color);
    calcTemp(color.isDark);
  }

  const calcTemp = isDark => {
    if (isDark) setTemp(1);
    setTemp(0.33);
  }

  let lstm;
  const [res, setRes] = useState("");
  const [text, setText] = useState("the meaning of life is...");
  const [length, setLength] = useState(100);
  const sketch = p => {
    const yolo= ml5.YOLO(p.modelReady);
    let img;
    let objects=[];
    let status;
    p.setup = function () {
      p.createCanvas(640,420);
      img = p.createImg('download.png', p.imageReady);
      img.hide();
      img.size(640, 420);
    };
    p.modelReady= function () {
      p.console.log("model Ready!");
      status=true;
    };
    p.imageReady=function(){
      p.console.log('Detecting')
      yolo.detect(img, p.gotResult());
    };
    p.draw=function(){
      if (status != undefined) {
        p.image(img, 0, 0)
        for (let i = 0; i < objects.length; i++) {
          p.noStroke();
          p.fill(0, 255, 0);
          p.text(objects[i].label + " " + p.nfc(objects[i].confidence * 100.0, 2) + "%", objects[i].x * p.width + 5, objects[i].y * p.height + 15);
          p.noFill();
          p.strokeWeight(4);
          p.stroke(0, 255, 0);
          p.rect(objects[i].x * p.width, objects[i].y * p.height, objects[i].w * p.width, objects[i].h * p.height);
        }
      }
    };
  };


  return (
    <div className="App">
      {/* <form> */}
      <div id="prompt">Upload your images:</div>
      <br />
      <input type="file" id="chooseImg" name="files" onChange={changeImg} />
      <br />
      {src !== "" &&
        <img id="output" src={src} alt="your image" />
      }
      <br />
      <button id="upload" onClick={upload}>upload</button>
      {/* </form> */}
      <P5Wrapper sketch={sketch} />
    </div>

  );
}

export default App;
