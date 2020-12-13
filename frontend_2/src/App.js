import React, { useState, useEffect } from 'react';
import FastAverageColor from 'fast-average-color';
import './App.css';
const { HostedModel } = require('@runwayml/hosted-models');
const unirest = require('unirest');

function App() {
  const fac = new FastAverageColor()
  const [src, setSrc] = useState("");
  const [filename, setFilename] = useState("");
  const [noun1, setNoun1] = useState("");
  const [noun2, setNoun2] = useState("");
  const [verb, setVerb] = useState("");
  const [structure, setStructure] = useState("");
  const [poem, setPoem] = useState("");
  const [yolo, setYolo] = useState([]);
  const [generated_text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState([]);
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
    "He loves the noun1, and noun2 is joyful today.",
    "The noun1 sleeps, the noun2 verbs.",
    "I see the noun1, above the noun2.",
    "The noun1 verbs, verbs to the noun2."
  ]

  const searchLines = (poem, term) => {
    const lines = poem.lines;
    const reducer = (acc, line) => acc || line.includes(term);
    return lines.reduce(reducer, false)
  }


  // TODO: fix the YOLO img sending issues, 
  // sort the sad poems
  const getShortestSadPoetry = 0

  const getPoetry = (term, isHappy) => {
    const url = isHappy ?
      `https://poetrydb.org/lines,linecount/${term};14` :
      `https://poetrydb.org/lines/${term}`
    unirest.get(url).then(res => {
      const body = res.body;
      // add a try block
      console.log(body);
      const real = body.filter(poem => searchLines(poem, term));
      console.log(real);
      setAuthor(real[0].author);
      setTitle(real[0].title);
      setResult(real[0].lines);
    })
  }

  const readURL = file => {
    console.log(file);
    if (file.type && file.type.indexOf('image') === -1) {
      console.log('File is not an image.', file.type, file);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      setSrc(event.target.result);
    });
    reader.readAsDataURL(file);
  }

  const changeImg = e => {
    const i = e.target.files[0];
    setFilename(i.name);
    console.log(i);
    // readURL(i);
    const url = URL.createObjectURL(i);
    setSrc(url);
  }

  const compare = (a, b) => {
    const idx1 = a.indexOf(' ');
    const idx2 = b.indexOf(' ');
    const num1 = parseInt(a.substr(idx1 + 1));
    const num2 = parseInt(b.substr(idx2 + 1));
    if (num1 < num2) {
      return 1;
    } else if (num1 > num2) {
      return -1;
    } else {
      return 0;
    }
  }

  const sortYoloData = res => {
    const sorted = res.sort(compare);
    const strings = sorted.map((r, i) => {
      const idx = r.indexOf(' ');
      return r.substr(0, idx);
    })
    return strings
  }

  const UseYolo = (data, isHappy) => {
    const formData = new FormData();
    formData.append("file", src);

    fetch(`/parseImages?img=${src}&filename=downloaded`,
      // {
      //   method: "POST",
      //   body: data,
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // }
    )
      .then(res => res.json())
      .then(data => {
        const res = data.yoloRes
        const sorted = sortYoloData(res);
        console.log(sorted);
        setYolo(sorted);
        const term = " " + sorted[0] + " "
        console.log(term);
        getPoetry(term, isHappy);
      })
  }

  const upload = () => {
    const img = document.getElementById("output");
    const color = fac.getColor(img);
    // const formData = new FormData();
    // formData.append("file", src);
    // formData.append("filename", "downloaded");
    // console.log(formData);
    // UseYolo(formData, color.isLight);
    UseYolo(color.isLight);
    // original implementation
    // setNounVerb(color.isDark);
    // setPoemStructure(color.value);
    // makePoem();
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
  const model = new HostedModel({
    url: "https://fa20-research.hosted-models.runwayml.cloud/v1/",
    token: "aKCIwe4Fvu9udgsC5VGbKg==",
  });
  //// You can use the info() method to see what type of input object the model expects
  // model.info().then(info => console.log(info));
  const makeGenerated = () => {
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
      <div id="prompt">Upload a picture of your pet:</div>
      <br />
      {/* <form onSubmit={upload} encType="multipart/form-data"> */}
      <input type="file" id="chooseImg" name="files" onChange={changeImg} />
      <br />
      {src !== "" &&
        <img id="output" src={src} alt="your image" />
      }
      <br />
      <button id="upload" onClick={upload}>upload</button>
      {/* </form> */}
      <p id="result">{poem}</p>
      {/* original implementation */}
      {/* <button id="generate" onClick={makeGenerated}>generate</button> */}
      {/* <p id="result">{generated_text}</p> */}
      {title === "" ? <p></p> : <p id="title">{title}</p>}
      {author === "" ? <p></p> : <p id="author">{author}</p>}
      {result === [] ? <p></p> : result.map((r, i) =>
        (<p className="poetryLine" key={i}>{r}</p>))}
    </div>
  );
}

export default App;
