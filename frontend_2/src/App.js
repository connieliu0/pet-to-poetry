import React, { useState, useEffect } from 'react';
import FastAverageColor from 'fast-average-color';
import './App.css';

function App() {
  const fac = new FastAverageColor()
  const [src, setSrc] = useState("");
  const [noun1, setNoun1] = useState("");
  const [noun2, setNoun2] = useState("");
  const [verb, setVerb] = useState("");
  const [structure, setStructure] = useState("");
  const [poem, setPoem] = useState("");
  const [yolo, setYolo] = useState([]);
  var newstring = "";
  const happyNouns = ["Sun", "Cloud", "Star", "Hope", "Laughter", "Dream", "Victory", "Joy"
  ]
  const happyVerbs = ["Soar", "Spring", "Fly", "Skip"
  ]
  const sadNouns = ["Ocean", "Thunder", "Darkness", "Moon", "Crater", "Despair"
  ]
  const sadVerbs = ["Sludge", "Slog", "Drown", "Drag"
  ]
  const structures = [
    "I miss noun1, hidden away in noun2’s warm light\n\nThe noun1 verbs and verbs",
    "noun1 sleeps, noun2 verbs\n\nverb well, noun1",
    "I see noun1, above the noun2. noun1 visits noun2 happily, verbing",
    "noun1 runs, verbs to the noun2\n\nnoun1 where are you verbing?\n\nverb away, noun1."
  ]

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
    const i = e.target.files[0];
    // setImg(e.target.files[0]);
    // console.log(img);
    readURL(i);
  }

  const UseYolo = src => {
    console.log(src)
    fetch(`/parseImages`)
      .then(res => res.json())
      .then(data => {
        const res = data.yoloRes.map((r, i) => {
          const idx = r.indexOf(' ');
          return r.substr(0, idx);
        })
        setYolo(res);
        console.log(data.yoloRes);
      })
  }

  const upload = () => {
    const img = document.getElementById("output");
    // console.log(img.src);
    UseYolo(img);
    const color = fac.getColor(img);
    console.log(color);
    setNounVerb(color.isDark);
    setPoemStructure(color.value);
    makePoem();
  }

  const setPoemStructure = value => {
    var total = value[0] + value[1] + value[2]
    if (total < 192) {
      setStructure(structures[0]);
    }
    else if (total < 384) {
      setStructure(structures[1]);
    }
    else if (total < 576) {
      setStructure(structures[2]);

    }
    else if (total < 765) {
      setStructure(structures[3]);
    }
  }

  const setNounVerb = isDark => {
    if (isDark) {
      setNoun1(sadNouns[Math.floor(Math.random() * sadNouns.length)]);
      setNoun2(yolo[Math.floor(Math.random() * sadNouns.length)]);
      setVerb(sadVerbs[Math.floor(Math.random() * sadVerbs.length)]);
    }
    else {
      setNoun1(happyNouns[Math.floor(Math.random() * happyNouns.length)]);
      setNoun2(yolo[Math.floor(Math.random() * happyNouns.length)]);
      setVerb(happyVerbs[Math.floor(Math.random() * happyVerbs.length)]);
    }
  }
  const makePoem = () => {
    console.log(noun1);
    console.log(noun2);
    console.log(verb);

    newstring = structure.replaceAll("noun1", noun1);
    newstring = newstring.replaceAll("noun2", noun2);
    newstring = newstring.replaceAll("verb", verb);
    setPoem(newstring);
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
      {/* <button id="generate" onClick={generate}>generate</button> */}
      <p id="result">{poem}</p>
    </div>
  );
}

export default App;
