import React, { useState, useEffect } from 'react';
import FastAverageColor from 'fast-average-color';
import './App.css';
const { HostedModel } = require('@runwayml/hosted-models');

function App() {
  const fac = new FastAverageColor()
  const [src, setSrc] = useState("");
  const [noun1, setNoun1] = useState("");
  const [noun2, setNoun2] = useState("");
  const [verb, setVerb] = useState("");
  const [structure, setStructure] = useState("");
  const [poem, setPoem] = useState("");
  const [generated_text, setText] = useState("");
  var newstring = "";
  const happyNouns = ["sun", "cloud", "star", "flower"
  ]
  const happyVerbs = ["soar", "spring", "jump", 
  ]
  const sadNouns = ["ocean", "thunder", "darkness", "moon", "snake"
  ]
  const sadVerbs = ["sludge", "slog", "drown", "drag"
  ]
  const structures = [
    "He loves the noun1, and he is joyful today.",
    "The noun1 sleeps, the noun2 verbs.",
    "I see the noun1, above the noun2.",
    "The noun1 verbs, verbs to the noun2."
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

  // const UseYolo = src => {
  //   // with users' uploaded data
  //   // fetch(`/parseImages/${src}`).then(res => res.json()).then(data => {
  //   //   console.log(data);
  //   // })
  //   fetch('/parseImages').then(res => res.json()).then(data => {
  //     console.log(data.resp2);
  //     const noun=data.resp2;
  //   })
  // }

  const upload = () => {
    const img = document.getElementById("output");
    // console.log(img.src);
    // UseYolo(img.src);
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
      setNoun2(sadNouns[Math.floor(Math.random() * sadNouns.length)]);
      setVerb(sadVerbs[Math.floor(Math.random() * sadVerbs.length)]);
    }
    else {
      setNoun1(happyNouns[Math.floor(Math.random() * happyNouns.length)]);
      setNoun2(happyNouns[Math.floor(Math.random() * happyNouns.length)]);
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
  const model = new HostedModel({
    url: "https://fa20-research.hosted-models.runwayml.cloud/v1/",
    token: "aKCIwe4Fvu9udgsC5VGbKg==",
  });
  //// You can use the info() method to see what type of input object the model expects
  // model.info().then(info => console.log(info));
  const makeGenerated=()=>{
  const inputs = {
    "input_prompt": poem,
    "length": 20,
    "temperature": .6,
    "top_p": .7
  };

  model.query(inputs).then(outputs => {
    setText(outputs.generated_text);
    // use the outputs in your project
    console.log(outputs.generated_text);
  });
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
      {/* <button id="generate" onClick={generate}>generate</button> */}
      <p id="result">{poem}</p>
      <button id="generate" onClick={makeGenerated}>generate</button>
      {console.log(poem)}
      <p id="result">{generated_text}</p>
    </div>
  );
}

export default App;
