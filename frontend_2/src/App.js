import React, { useState } from 'react';
import FastAverageColor from 'fast-average-color';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch.js';
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
      <h1> LSTM Text Generation Example</h1>
               <h2> This example uses a pre-trained model on a corpus of Emily Dickinson</h2>
<div class="example">
    <p>seed text: <input id="textInput" value="The meaning of life is"/></p>
    <p>length: <input id="lenSlider" min="10" max="500" value="100" type="range"/> <span id="length">100</span></p>
    <p>temperature:<input id="tempSlider" min="0" max="1" step="0.01" type="range"/><span id="temperature">0.5</span></p>
    <p id="status">Loading Model</p>
    <button id="generate">generate</button>
    <p id="result"></p>
      <P5Wrapper sketch={sketch} />
     </div>
    </div>

  );
}

export default App;
