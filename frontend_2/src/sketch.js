import ml5 from 'ml5';
export default function sketch(p){
/**
 * Created by nprimak on 4/17/19.
 */
let lstm;
let textInput;
let lengthSlider;
let tempSlider;
let button;

p.setup = function () {
    p.noCanvas();

    // Create the LSTM Generator passing it the model directory
    lstm = ml5.LSTMGenerator('./data/', p.modelReady());

    // Grab the DOM elements
    textInput = p.select('#textInput');
    lengthSlider = p.select('#lenSlider');
    tempSlider = p.select('#tempSlider');
    button = p.select('#generate');

    // DOM element events
    button.mousePressed(p.generate());
    lengthSlider.input(p.updateSliders());
    tempSlider.input(p.updateSliders());
};

// Update the slider values
p.updateSliders= function() {
    p.select('#length').html(lengthSlider.value());
    p.select('#temperature').html(tempSlider.value());
};

p.modelReady=function() {
    p.select('#status').html('Model Loaded');
};

// Generate new text
p.generate=function() {
    // Update the status log
    p.select('#status').html('Generating...');

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
            length: lengthSlider.value()
        };

        // Generate text with the lstm
        lstm.generate(data, p.gotData());

        // When it's done
        p.gotData= function(err, result){
            // Update the status log
            p.select('#status').html('Ready!');
            p.select('#result').html(txt + result);
        }
    }
};
};