//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

var whiteKeys = document.getElementsByClassName('white-key');
var hoveredKey = null;
var mouseDown = false;

document.addEventListener('mousedown', e => {
  mouseDown = true;
  if (hoveredKey !== null) {
	  activateKey(hoveredKey);
  }
});

document.addEventListener('mouseup', e => {
  mouseDown = false;
  synth.triggerRelease();
  if (hoveredKey !== null) {
	deactivateKey(hoveredKey);
  }
});

for (var i = 0; i < whiteKeys.length; i++) {
	whiteKeys[i].addEventListener('mouseover', e => {
		hoveredKey = e.target;
		if (mouseDown) {
			activateKey(hoveredKey);
		}
	});
	whiteKeys[i].addEventListener('mouseout', e => {
		deactivateKey(hoveredKey);
		hoveredKey = null;
		if (mouseDown) {
			synth.triggerRelease();
		}
	});
}

document.getElementById("input").addEventListener('submit', e => {
	e.preventDefault();
	var rawInputs = document.getElementsByClassName('note-input');
	var inputNotes = []
	for (var i = 0; i < rawInputs.length; i++) {
		var inputSplit = rawInputs[i].value.split(" ");
		var noteLength = 1;
		if (inputSplit.length > 1) {
			noteLength = inputSplit[1];
		}
		var inputNote = {note: inputSplit[0], length: noteLength};
		inputNotes.push(inputNote);
	}
	play(inputNotes);
});

function activateKey(key) {
	synth.triggerRelease();
	synth.triggerAttack(key.getAttribute("data-tone"));
	key.classList.add("white-key--active");
}

function deactivateKey(key) {
	key.classList.remove("white-key--active")
}

function play(inputNotes) {
	var time = 0;
	var notes = [[0,"E4"], ["0:1","D4"], ["0:2","C4"], ["0:3","D4"], ["0:4","E4"], ["1:1","E4"], ["1:2","E4", "2n"], ["1:4","D4"], ["2:1","D4"], ["2:2","D4"], ["2:4","E4"], ["3:1","G4"], ["3:2","G4"], ["3:4","E4"], ["4:1","D4"], ["4:2","C4"], ["4:3","D4"], ["4:4","E4"], ["5:1","E4"], ["5:2","E4"], ["5:3","E4"], ["5:4","D4"], ["6:1","D4"], ["6:2","E4"], ["6:3","D4"], ["6:4","C4","n"]];
	for ( var i = 0; i < inputNotes.length; i++) {
		var inputNote = inputNotes[i];
		//console.log("[" + i + "] time:[" + time + "] inputNote.length:[" + inputNote.length + "]");
		//synth.triggerAttackRelease(inputNote.note, inputNote.length, time);
		//time += time + parseFloat(inputNote.length) + 0.5;
		//notes.push(inputNote.note);
	}
	const synthPart = new Tone.Part(
	  function(time, note) {
		  console.log(time);
		synth.triggerAttackRelease(note, "10hz", time);
		var keys = document.querySelectorAll("[data-tone]");
		for (var i = 0; i < keys.length; i++) {
			keys[i].classList.remove("white-key--active");
		}
		document.querySelectorAll("[data-tone='" + note + "']")[0].classList.add("white-key--active");
	  },
	  notes
	);
	synthPart.start(0);
	//synthPart.loop = 3;
	//synthPart.loopEnd = 4.5;
	Tone.Transport.start();
}
