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

    p.setup = function () {
      p.noCanvas();

      // Create the LSTM Generator passing it the model directory
      lstm = ml5.charRNN('./data/', p.modelReady);
    };
    p.modelReady= function () {
      p.select('#status').html('Model Loaded');
    };

  };
  // Generate new text
  const generate = () => {
    if (text.length > 0) {
      // Seed text, temperature, length to outputs
      // TODO: What are the defaults?
      let data = {
        seed: text,
        temperature: temp,
        length: length
      };

      // Generate text with the lstm
      lstm.generate(data, gotData);

      function gotData(err, result) {
        setRes(text + result);
      }
    }
  }

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
      <div id="">
        <h1> LSTM Text Generation Example</h1>
        <h2> This example uses a pre-trained model on a corpus of Emily Dickinson</h2>
        <div className="example">
          <p>seed text: <input id="textInput" value={text} onChange={e => setText(e.target.value)} /></p>
          <p>length:
            <input id="lengthSlider" min="10" max="500" value={length} type="range" onChange={e => setLength(e.target.value)} />
            <span id="length">{toString(length)}</span>
          </p>
          {/* <p>temperature:<input id="tempSlider" min="0" max="1" step="0.01" type="range" /><span id="temperature">0.5</span></p> */}
          {/* <p id="status">Loading Model</p> */}
          <button id="generate" onClick={generate}>generate</button>
          <p id="status">Loading Model</p>
          <p id="result">{res}</p>
        </div>
      </div>
    </div>

  );
}

export default App;
