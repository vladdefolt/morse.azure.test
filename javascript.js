// Wait for the window to load
window.addEventListener('DOMContentLoaded', (event) => {
  // Create an audio context for sound playback
  AudioContext = window.AudioContext || window.webkitAudioContext;
  audio = new AudioContext();

  // Add a click handler for the "Translate" button
  document.querySelector("#translate")
    .addEventListener('click', (event) => {
      translate(); 
    });

  // Add a click handler for the "Play" button
  document.querySelector("#play")
    .addEventListener('click', (event) => {
      var code = document.querySelector("#code").value; // Get Morse code
      play(code); // Start code playback
    });
});

// Get the message text
function translate() {
  var text = document.querySelector("#message").value;
  // Encode into Morse code
  var code = encodeMorse(text);
  // Display the code on the page
  document.querySelector("#code").value = code;
}

// Encode into Morse code
function encodeMorse(text) {
  return text
    .toUpperCase() // Convert to uppercase
    .split('') // Take each letter
    .map(char => {
      return morseMap[char] !== undefined ? morseMap[char] : char; // Find the value in the table
    })
    .join(' '); // Assemble values into code text with spaces between characters
}

// Start code playback
function play(code) {
  var dot = 0.08; // Duration of a dot, seconds
  var time = audio.currentTime; // Current time
  var osc = audio.createOscillator(); // Audio oscillator
  osc.type = "sine"; // Type of audio wave
  osc.frequency.value = 500; // Wave frequency
  var gain = audio.createGain(); // Create a piece for sound
  gain.gain.setValueAtTime(0, time); // Start

  code.split(' ') // Split by letters with spaces
    .forEach(word => {
      word.split('').forEach(char => {
        if ('.' == char) { // If dot
          gain.gain.setValueAtTime(1, time); // Set sound on a time interval
          time += dot; // Take the next interval
          gain.gain.setValueAtTime(0, time); // Add a pause
          time += dot;
        } else if ('-' == char) { // If dash
          gain.gain.setValueAtTime(1, time);
          time += 3 * dot; // Sound is 3 times longer than a dot
          gain.gain.setValueAtTime(0, time);
          time += dot;
        } else if (' ' == char) { // If space
          time += 6 * dot; // Pause length of 6 dots
        }
      });

      time += 2 * dot; // Add additional pause between letters
    });

  osc.connect(gain); // Pass all pieces to the generator
  gain.connect(audio.destination); // Output sound to audio context
  osc.start(); // Start the generator
}

// Array of letter/number/symbol values
const morseMap = {
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "A": ".-",
  "B": "-...",
  "C": "-.-.",
  "D": "-..",
  "E": ".",
  "F": "..-.",
  "G": "--.",
  "H": "....",
  "I": "..",
  "J": ".---",
  "K": "-.-",
  "L": ".-..",
  "M": "--",
  "N": "-.",
  "O": "---",
  "P": ".--.",
  "Q": "--.-",
  "R": ".-.",
  "S": "...",
  "T": "-",
  "U": "..-",
  "V": "...-",
  "W": ".--",
  "X": "-..-",
  "Y": "-.--",
  "Z": "--..",
  ".": ".-.-.-",
  ",": "--..--"
};
