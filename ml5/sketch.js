/**
 * Created by nprimak on 4/17/19.
 */
let lstm;
let textInput;
let lengthSlider;
let tempSlider;
let button;
let R;
let G;
let B;
let luminence;
let lengthvar;

let img;

function preload(){
    img = loadImage("2.jpg");
}
let totalR = 0;
let totalG = 0;
let totalB = 0;
let sampleN = 10000;
function setup() {
    noCanvas();
    // Create the LSTM Generator passing it the model directory
    lstm = ml5.LSTMGenerator('./data/', modelReady);
    // Grab the DOM elements
    textInput = select('#textInput');
    // lengthSlider = select('#lenSlider');
    tempSlider = select('#tempSlider');
    button = select('#generate');

    // DOM element events
    button.mousePressed(generate);
    // lengthSlider.input(updateSliders);
    tempSlider.input(updateSliders);
}

// Update the slider values
function updateSliders() {
    // select('#length').html(lengthSlider.value());
    select('#temperature').html(tempSlider.value());
}

function modelReady() {
    for(let i = 0; i < sampleN; i++){
        let x = random(img.width);
        let y = random(img.height);
        let c = img.get(x,y);
        totalR += c[0];
        totalG += c[1];
        totalB += c[2];
      }
      R=totalR/sampleN;
      G=totalG/sampleN;
      B=totalB/sampleN;
      luminence= R + G + B;
      console.log(luminence);
      if (luminence<50){
          lengthvar=20;
      }
      else{
          lengthvar=5;
      }
    select('#status').html('Model Loaded');
}

// Generate new text
function generate() {
    // Update the status log
    select('#status').html('Generating...');

    // Grab the original text
    let original = textInput.value();
    // Make it to lower case
    let txt = original.toLowerCase();

    // Check if there's something to send
    if (txt.length > 0) {
        // This is what the LSTM generator needs
        // Seed text, temperature, length to outputs
        // TODO: What are the defaults?
        let data = {
            seed: txt,
            temperature: tempSlider.value(),
            length: lengthvar
        };

        // Generate text with the lstm
        lstm.generate(data, gotData);

        // When it's done
        function gotData(err, result) {
            // Update the status log
            select('#status').html('Ready!');
            select('#result').html(txt + result);
        }
    }
}