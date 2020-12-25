import React, { useState } from 'react';
import FastAverageColor from 'fast-average-color';
import './App.css';
// const unirest = require('unirest');

function App() {
  const fac = new FastAverageColor()
  const [src, setSrc] = useState("");
  const [file, setFile] = useState({});
  const [filename, setFilename] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState([]);
  // const [noun1, setNoun1] = useState("");
  // const [noun2, setNoun2] = useState("");
  // const [verb, setVerb] = useState("");
  // const [structure, setStructure] = useState("");
  // const [poem, setPoem] = useState("");
  // const [generated_text, setText] = useState("");
  // var newstring = "";
  // const happyNouns = ["sun", "cloud", "star", "flower"
  // ]
  // const happyVerbs = ["soar", "spring", "jump",
  // ]
  // const sadNouns = ["ocean", "thunder", "darkness", "moon", "snake"
  // ]
  // const sadVerbs = ["sludge", "slog", "drown", "drag"
  // ]
  // const structures = [
  //   "He loves the noun1, and noun2 is joyful today.",
  //   "The noun1 sleeps, the noun2 verbs.",
  //   "I see the noun1, above the noun2.",
  //   "The noun1 verbs, verbs to the noun2."
  // ]

  const searchLines = (poem, term) => {
    const lines = poem.lines;
    const reducer = (acc, line) => acc || line.includes(term);
    return lines.reduce(reducer, false)
  }

  const sadPoemCompare = (a, b) => {
    const count1 = parseInt(a.linecount);
    const count2 = parseInt(b.linecount);
    if (count1 < count2) {
      return -1;
    } else if (count1 > count2) {
      return 1;
    } else {
      return 0;
    }
  }

  // sort the sad poems
  const sortShortestSadPoetry = poemlst => {
    return poemlst.sort(sadPoemCompare);
  }

  // const getPoetry = (term, isHappy) => {
  //   const url = isHappy ?
  //     `https://poetrydb.org/lines,linecount/${term};14` :
  //     `https://poetrydb.org/lines/${term}`
  //   unirest.get(url).then(res => {
  //     const body = res.body;
  //     // add a try block
  //     console.log(body);
  //     let real = body.filter(poem => searchLines(poem, term));
  //     if (!isHappy) {
  //       real = sortShortestSadPoetry(real)
  //     }
  //     console.log(real);
  //     setAuthor(real[0].author);
  //     setTitle(real[0].title);
  //     setResult(real[0].lines);
  //   })
  // }

  const changeImg = e => {
    e.preventDefault();
    const i = e.target.files[0];
    setFile(i);
    setFilename(i.name);
    console.log(i);
    const url = URL.createObjectURL(i);
    setSrc(url);
  }

  const yoloCompare = (a, b) => {
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
    const sorted = res.sort(yoloCompare);
    const strings = sorted.map((r, i) => {
      const idx = r.indexOf(' ');
      return r.substr(0, idx);
    })
    return strings
  }

  const UseYolo = (data, isHappy) => {
    fetch(`parseImages`,
      {
        method: "POST",
        body: data,
      }
    )
      .then(res => res.json())
      .then(data => {
        const res = data.yoloRes
        const sorted = sortYoloData(res);
        console.log(sorted);
        const term = " " + sorted[0] + " "
        console.log(term);
        // getPoetry(term, isHappy);
      })
  }

  const upload = e => {
    e.preventDefault();
    const img = document.getElementById("output");
    const color = fac.getColor(img);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);
    UseYolo(formData, color.isLight);
  }

  // const setPoemStructure = value => {
  //   var total = value[0] + value[1] + value[2]
  //   if (total < 192) {
  //     setStructure(structures[0]);
  //   }
  //   else if (total < 384) {
  //     setStructure(structures[1]);
  //   }
  //   else if (total < 576) {
  //     setStructure(structures[2]);

  //   }
  //   else if (total < 765) {
  //     setStructure(structures[3]);
  //   }
  // }

  // const setNounVerb = isDark => {
  //   if (isDark) {
  //     setNoun1(sadNouns[Math.floor(Math.random() * sadNouns.length)]);
  //     setNoun2(yolo[Math.floor(Math.random() * sadNouns.length)]);
  //     setVerb(sadVerbs[Math.floor(Math.random() * sadVerbs.length)]);
  //   }
  //   else {
  //     setNoun1(happyNouns[Math.floor(Math.random() * happyNouns.length)]);
  //     setNoun2(yolo[Math.floor(Math.random() * happyNouns.length)]);
  //     setVerb(happyVerbs[Math.floor(Math.random() * happyVerbs.length)]);
  //   }
  // }
  // const makePoem = () => {
  //   console.log(noun1);
  //   console.log(noun2);
  //   console.log(verb);

  //   newstring = structure.replaceAll("noun1", noun1);
  //   newstring = newstring.replaceAll("noun2", noun2);
  //   newstring = newstring.replaceAll("verb", verb);
  //   setPoem(newstring);
  // }
  // const model = new HostedModel({
  //   url: "https://fa20-research.hosted-models.runwayml.cloud/v1/",
  //   token: "aKCIwe4Fvu9udgsC5VGbKg==",
  // });
  // //// You can use the info() method to see what type of input object the model expects
  // // model.info().then(info => console.log(info));
  // const makeGenerated = () => {
  //   const inputs = {
  //     "input_prompt": poem,
  //     "length": 20,
  //     "temperature": .6,
  //     "top_p": .7
  //   };

  //   model.query(inputs).then(outputs => {
  //     setText(outputs.generated_text);
  //     // use the outputs in your project
  //     console.log(outputs.generated_text);
  //   });
  // };
  return (
    <div className="App">
      <div id="prompt"><p className="wavy">Upload a picture of your pet that is dear to you to generate a poetic surprise!<br/> Below are some examples to download to try out.</p></div>
      <div className="row">
        <img src="dog.jpg" alt="dog" />
        <img src="fish.jpg" alt="fish" />
        <img src="cat.jpg" alt="cat" />
      </div>
      <div className="row">
        <div className="col">
          <div className="photo">
            <form onSubmit={upload} encType="multipart/form-data">
              <input type="file" id="chooseImg" name="files" onChange={changeImg} />
              <br />
              {src !== "" &&
                <img id="output" src={src} alt="uploaded" />
              }
              <br />
              <div className="row">
                <button id="upload">Generate Poem</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col poem">
          {/* comment out the following four lines for UI testing */}
          {title === "" ? <p></p> : <p id="title">{title}</p>}
          {author === "" ? <p></p> : <p id="author">{author}</p>}
          {result === [] ? <p></p> : result.map((r, i) =>
            (<p className="poetryLine" key={i}>{r}</p>))}
        </div>
        </div>
        <h3 className="wavy">About this Project</h3>
<p>Upload a picture of a pet, and the <a href="https://www.kaggle.com/aruchomu/yolo-v3-object-detection-in-tensorflow">YOLO algorithm</a> will then recognize the pet in it. Then it will query the pet in the <a href="https://poetrydb.org/index.html">PoetryDB</a> and send back a real-life poem that mentions that pet. Depending on the brightness of the photo, you may get differing results - let's see what poems are related to your pet! This project was created by Bo Hu and Connie Liu during the Fall of 2020 under the Designing AI Lab.
</p>
      </div>
  );
}

export default App;
