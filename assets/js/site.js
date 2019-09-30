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

document.addEventListener('touchstart', e => {
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

document.addEventListener('touchend', e => {
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

function addToNotes(notes, note, length) {
	var lastTime = 0;
	var lastDuration = 0;
	if (notes.length > 0) {
		lastTime = notes[notes.length - 1].time;
		lastDuration = notes[notes.length - 1].dur;
	}
	
	var time = Tone.Time(lastTime) + Tone.Time(lastDuration);
	var newNote = {time: Tone.Time(time).toBarsBeatsSixteenths(), note: note, dur: length};
	notes.push(newNote);
	return notes;
}

function play(inputNotes) {
	var notes = [];
	addToNotes(notes, "E4", "0:0:6");
	addToNotes(notes, "D4", "0:0:2");
	addToNotes(notes, "C4", "0:1");
	addToNotes(notes, "D4", "0:1");
	addToNotes(notes, "E4", "0:1");
	addToNotes(notes, "E4", "0:1");
	addToNotes(notes, "E4", "0:2");
	addToNotes(notes, "D4", "0:1");
	addToNotes(notes, "D4", "0:1");
	addToNotes(notes, "D4", "0:2");
	addToNotes(notes, "E4", "0:1");
	addToNotes(notes, "G4", "0:1");
	addToNotes(notes, "G4", "0:2");
	addToNotes(notes, "E4", "0:0:6");
	addToNotes(notes, "D4", "0:0:2");
	addToNotes(notes, "C4", "0:1");
	addToNotes(notes, "D4", "0:1");
	addToNotes(notes, "E4", "0:1");
	addToNotes(notes, "E4", "0:1");
	addToNotes(notes, "E4", "0:1");
	addToNotes(notes, "E4", "0:1");
	addToNotes(notes, "D4", "0:1");
	addToNotes(notes, "D4", "0:1");
	addToNotes(notes, "E4", "0:1");
	addToNotes(notes, "D4", "0:1");
	addToNotes(notes, "C4", "1:0");
	
	const synthPart = new Tone.Part(
	  function(time, event) {
		synth.triggerAttackRelease(event.note, event.dur, time);
		var keys = document.querySelectorAll("[data-tone]");
		for (var i = 0; i < keys.length; i++) {
			keys[i].classList.remove("white-key--active");
		}
		document.querySelectorAll("[data-tone='" + event.note + "']")[0].classList.add("white-key--active");
	  },
	  notes
	);
	synthPart.start(0);
	var endTime = Tone.Time(notes[notes.length - 1].time).toSeconds() + Tone.Time(notes[notes.length - 1].dur, "n").toSeconds();
	synthPart.stop(endTime);
	Tone.Transport.start();
	Tone.Transport.stop(endTime);
}
