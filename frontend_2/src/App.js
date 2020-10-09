import React, { useState } from 'react';
import FastAverageColor from 'fast-average-color';
import logo from './logo.svg';
import './App.css';

function App() {
  const fac = new FastAverageColor()
  // a list of image names
  // const [img, setImg] = useState({});
  const [src, setSrc] = useState("");

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
    </div>
  );
}

export default App;
