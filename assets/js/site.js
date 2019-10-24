var piano =  {
        'A0': 'A0.mp3',
        'A1': 'A1.mp3',
        'A2': 'A2.mp3',
        'A3': 'A3.mp3',
        'A4': 'A4.mp3',
        'A5': 'A5.mp3',
        'A6': 'A6.mp3',
        'A#0': 'As0.mp3',
        'A#1': 'As1.mp3',
        'A#2': 'As2.mp3',
        'A#3': 'As3.mp3',
        'A#4': 'As4.mp3',
        'A#5': 'As5.mp3',
        'A#6': 'As6.mp3',
        'B0': 'B0.mp3',
        'B1': 'B1.mp3',
        'B2': 'B2.mp3',
        'B3': 'B3.mp3',
        'B4': 'B4.mp3',
        'B5': 'B5.mp3',
        'B6': 'B6.mp3',
        'C0': 'C0.mp3',
        'C1': 'C1.mp3',
        'C2': 'C2.mp3',
        'C3': 'C3.mp3',
        'C4': 'C4.mp3',
        'C5': 'C5.mp3',
        'C6': 'C6.mp3',
        'C7': 'C7.mp3',
        'C#0': 'Cs0.mp3',
        'C#1': 'Cs1.mp3',
        'C#2': 'Cs2.mp3',
        'C#3': 'Cs3.mp3',
        'C#4': 'Cs4.mp3',
        'C#5': 'Cs5.mp3',
        'C#6': 'Cs6.mp3',
        'D0': 'D0.mp3',
        'D1': 'D1.mp3',
        'D2': 'D2.mp3',
        'D3': 'D3.mp3',
        'D4': 'D4.mp3',
        'D5': 'D5.mp3',
        'D6': 'D6.mp3',
        'D#0': 'Ds0.mp3',
        'D#1': 'Ds1.mp3',
        'D#2': 'Ds2.mp3',
        'D#3': 'Ds3.mp3',
        'D#4': 'Ds4.mp3',
        'D#5': 'Ds5.mp3',
        'D#6': 'Ds6.mp3',
        'E0': 'E0.mp3',
        'E1': 'E1.mp3',
        'E2': 'E2.mp3',
        'E3': 'E3.mp3',
        'E4': 'E4.mp3',
        'E5': 'E5.mp3',
        'E6': 'E6.mp3',
        'F0': 'F0.mp3',
        'F1': 'F1.mp3',
        'F2': 'F2.mp3',
        'F3': 'F3.mp3',
        'F4': 'F4.mp3',
        'F5': 'F5.mp3',
        'F6': 'F6.mp3',
        'F#0': 'Fs0.mp3',
        'F#1': 'Fs1.mp3',
        'F#2': 'Fs2.mp3',
        'F#3': 'Fs3.mp3',
        'F#4': 'Fs4.mp3',
        'F#5': 'Fs5.mp3',
        'F#6': 'Fs6.mp3',
        'G0': 'G0.mp3',
        'G1': 'G1.mp3',
        'G2': 'G2.mp3',
        'G3': 'G3.mp3',
        'G4': 'G4.mp3',
        'G5': 'G5.mp3',
        'G6': 'G6.mp3',
        'G#0': 'Gs0.mp3',
        'G#1': 'Gs1.mp3',
        'G#2': 'Gs2.mp3',
        'G#3': 'Gs3.mp3',
        'G#4': 'Gs4.mp3',
        'G#5': 'Gs5.mp3',
        'G#6': 'Gs6.mp3'
    };



// Global Variables

var relativeTime = 0;
var keys = document.getElementsByClassName('key');
var musicBars = document.getElementsByClassName("combined-bar");
var hoveredKey = null;
var mouseDown = false;
var synthPart;
var basePart;
var isPlaying = false;
var songStarted = false;
var extendedNote = 0;
var isExtendedNote = false;
var notesBeingPlayed = [];
var melodyNoteIndex = 0;
var bassNoteIndex = 0;

var noteDowns;
var noteDownLines;
var noteDownLineUnders;
var noteUps;
var noteUpLines;
var noteDownNoOffsets;
var noteDownOffsets;
var noteUpNoOffsets;
var noteUpOffsets;
var noteUpOffsetLines;

// Initial Set Up

var synth = new Tone.Sampler(piano, { 
	"baseUrl": "D:/Documents/Projects/Sheet Music reader/assets/samples/piano/", 
	"release" : 1,
	"curve": "linear"
});

Tone.Buffer.on('error', function(error) {
	console.log(error);
});

var gain = new Tone.Gain(0.2);
gain.toMaster();
synth.connect(gain);
synth.connect(gain);

var melodySheetNotes = document.querySelectorAll('.melody [data-note]');
var bassSheetNotes = document.querySelectorAll('.bass [data-note]');

fillSheet(melodySheetNotes, true);
fillSheet(bassSheetNotes, false);

for (var i = 0; i < musicBars.length; i++) {
	musicBars[i].addEventListener('click', e => {
		for (var j = 0; j < musicBars.length; j++) {
			musicBars[j].classList.remove("combined-bar--active");
		}
		e.target.closest(".combined-bar").classList.add("combined-bar--active");
	});
}

// Keyboard

document.addEventListener('mousedown', e => {
  mouseDown = true;
  if (hoveredKey !== null) {
	  activateKey(hoveredKey);
  }
});

document.addEventListener('mouseup', e => {
  mouseDown = false;
  if (hoveredKey !== null) {
	deactivateKey(hoveredKey);
  }
});

document.addEventListener('touchmove', e => {
	var xPos = e.touches[0].pageX;
	var yPos = e.touches[0].pageY;
	var touchedElement = document.elementFromPoint(xPos, yPos);
	if (touchedElement.classList.contains("key")){
		if (touchedElement != hoveredKey) {
			if (hoveredKey != null) {
				deactivateKey(hoveredKey);
			}
			hoveredKey = touchedElement;
			activateKey(hoveredKey);
		}
	}
});

document.addEventListener('touchend', e => {
	if (hoveredKey !== null) {
		deactivateKey(hoveredKey);
	}
	hoveredKey = null
});

for (var i = 0; i < keys.length; i++) {
	keys[i].addEventListener('mouseover', e => {
		hoveredKey = e.target;
		if (mouseDown) {
			activateKey(hoveredKey);
		}
	});
	keys[i].addEventListener('mouseout', e => {
		if (hoveredKey !== null) {
			deactivateKey(hoveredKey);
		}
		hoveredKey = null;
	});
	keys[i].addEventListener('touchstart', e => {
		hoveredKey = e.target;
		activateKey(e.target);
	});
}

function activateKey(key) {
	var tone = key.getAttribute("data-tone") + key.parentElement.parentElement.getAttribute("data-octave-value");
	synth.triggerAttack(tone);
	key.classList.add("white-key--active");
}

function deactivateKey(key) {
	var tone = key.getAttribute("data-tone") + key.parentElement.parentElement.getAttribute("data-octave-value");
	synth.triggerRelease(tone);
	key.classList.remove("white-key--active")
}

// Sheet Music

function fillSheet(sheetNotes, isMelody) {
	if (isMelody) {
		noteDowns = ["B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6", "E6", "F6", "G6", "A6", "B6"];
		noteLines = ["C4", "A6"];
		noteDownLineUnders = ["B5", "D6", "F6", "A6"];
		noteUps = ["B3", "C4", "D4", "E4", "F4", "G4", "A4"];
		noteOffsets = ["G4", "E4", "A5", "F5", "D5", "B4"];
		noteUpOffsetLines = ["C4"];
	} else {
		noteDowns = ["D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4"];
		noteLines = ["E2", "C4", "E4", "G4", "B4"];
		noteDownLineUnders = ["D4"];
		noteUps = ["D2", "E2", "F2", "G2", "A2", "B2", "C3"];
		noteOffsets = ["G2", "B2", "D3", "F3", "A3", "C4"];
		noteUpOffsetLines = ["E2"];
	}
	for (var i = 0; i < sheetNotes.length; i++) {
		var sheetNote = sheetNotes[i];
		var noteValueArr = JSON.parse(sheetNote.getAttribute("data-note"));
		if (noteValueArr == null) {
			noteValueArr = ["null"]
		}
	
		var noteType = sheetNote.getAttribute("data-duration");
		var isChord = noteValueArr.length > 1;
		var firstChordNote = noteValueArr[0];
		var lastChordNote = noteValueArr[noteValueArr.length - 1];
		
		var noteAlign = "";
		var NoOfUps = 0;
		var NoOfDowns = 0;
		for (var j = 0; j < noteValueArr.length; j++) {
			var noteValue = noteValueArr[j];
			if (noteDowns.includes(noteValue)) {
				NoOfDowns++;
			} else if (noteUps.includes(noteValue)) {
				NoOfUps++;
			}
		}
		if (NoOfUps >= NoOfDowns) {
			noteAlign = "-up";
		} else {
			noteAlign = "-down";
		}
		
		for (var j = 0; j < noteValueArr.length; j++) {
			var noteValue = noteValueArr[j];
			var width = "18";
			var height = "102";
			var noteSize = "";
			var noteLinePosition = "";
			var noteOffset = "";
			var noteBar = "";
			
			if (noteDownLineUnders.includes(noteValue)) {
				noteLinePosition = "-line-under";
			} else if (noteLines.includes(noteValue)) {
				noteLinePosition = "-line";
			}
			
			if (noteType === "{\"4n\": 1}") {
				if (noteValue == "null") {
					noteSize = "quarter-rest";
					noteAlign = "";
					width = "12";
				} else {
					noteSize = "quarter-note";
				width = "40";
				}
			} else if (noteType === "{\"4n\": 2}") {
				if (noteValue == "null") {
					noteAlign = "";
					noteSize = "half-rest";
				} else {
					noteSize = "half-note";
					width = "40";
				}
			} else if (noteType === "{\"8n\": 1}") {
				if (noteValue == "null") {
					noteSize = "eighth-rest";
					noteAlign = "";
					width = "20";
				} else {
					if (isChord) {
						if ((noteAlign == "-up" && noteValue == lastChordNote) || (noteAlign == "-down" && noteValue == firstChordNote)) {
							noteSize = "eighth-note";
						} else {
							noteSize = "quarter-note";
						}
					} else {
						noteSize = "eighth-note";
					}
					if (i !== 0 && sheetNotes[i+1] !== undefined && sheetNotes[i].getAttribute("data-note") == sheetNotes[i+1].getAttribute("data-note") && sheetNotes[i].getAttribute("data-duration") == sheetNotes[i+1].getAttribute("data-duration") && sheetNotes[i].parentNode == sheetNotes[i+1].parentNode && sheetNotes[i].getAttribute("data-note") == sheetNotes[i-1].getAttribute("data-note") && sheetNotes[i].getAttribute("data-duration") == sheetNotes[i-1].getAttribute("data-duration") && sheetNotes[i].parentNode == sheetNotes[i-1].parentNode) {
						noteBar = "-bar-3";
					}
					else if (sheetNotes[i+1] !== undefined && sheetNotes[i].getAttribute("data-note") == sheetNotes[i+1].getAttribute("data-note") && sheetNotes[i].getAttribute("data-duration") == sheetNotes[i+1].getAttribute("data-duration") && sheetNotes[i].parentNode == sheetNotes[i+1].parentNode) {
						noteBar = "-bar-1";
					} else if (i !== 0 &&  sheetNotes[i].getAttribute("data-note") == sheetNotes[i-1].getAttribute("data-note") && sheetNotes[i].getAttribute("data-duration") == sheetNotes[i-1].getAttribute("data-duration") && sheetNotes[i].parentNode == sheetNotes[i-1].parentNode) {
						noteBar = "-bar-2";
					}
					width = "40";
				}
			} else if (noteType === "{\"1m\": 1}") {
				noteAlign = "";
				if (noteValue == "null") {
					noteSize = "whole-rest";
				} else {
					noteSize = "whole-note";
					width = "20";
				}
				
				if (noteDownLineUnders.includes(noteValue)) {
					width = "26";
				} else if (noteLines.includes(noteValue)) {
					width = "26";
				}
			} else if (noteType === "{\"4n\": 1, \"8n\": 1}") {
				noteSize = "three-eighth-note";
				
				if (noteOffsets.includes(noteValue)) {
					noteOffset = "-offset";
				}
				width = "29";
			} else if (noteType === "{\"4n\": 3}") {
				noteSize = "five-eighth-note";
				
				if (noteOffsets.includes(noteValue)) {
					noteOffset = "-offset";
				}
				width = "29";
			}
			
			var noteArr = noteValue != "null" ? "[\"" + noteValue + "\"]" : noteValue;
			
			var noteSVG = noteSize + noteOffset + noteAlign + noteLinePosition + noteBar;
			
			if (noteSVG !== "") {
				//sheetNote.removeAttribute("data-note");
				sheetNote.innerHTML = sheetNote.innerHTML += "<svg width='" + width + "' height='" + height + "' data-note='" + noteArr + "'><title>" + noteValue + "</title><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#" + noteSVG + "'></use></svg>";
			}
		}
		
		if (noteType === "{\"4n\": 1, \"8n\": 1}" && (sheetNote.nextElementSibling == null || !sheetNote.nextElementSibling.classList.contains("eighth-note-spacer"))) {
			var spacer = document.createElement("div");
			spacer.classList.add("eighth-note-spacer");
			sheetNote.parentNode.insertBefore(spacer, sheetNote.nextSibling);
		}	
		if ((noteType === "{\"4n\": 2}" || noteType === "{\"4n\": 3}") && (sheetNote.nextElementSibling == null || !sheetNote.nextElementSibling.classList.contains("half-note-spacer"))) {
			var spacer = document.createElement("div");
			spacer.classList.add("half-note-spacer");
			sheetNote.parentNode.insertBefore(spacer, sheetNote.nextSibling);
		}	
		if (noteType === "{\"4n\": 3}" && (sheetNote.nextElementSibling == null || !sheetNote.nextElementSibling.classList.contains("half-note-spacer"))) {
			var spacer = document.createElement("div");
			spacer.classList.add("half-note-spacer");
			sheetNote.parentNode.insertBefore(spacer, sheetNote.nextSibling);
		}			
	}
}

// Audio Playback

document.getElementById("play").addEventListener('click', e => {
	e.preventDefault();
	e.target.classList.toggle("play");
	e.target.classList.toggle("pause");
	if (!songStarted) {
		var melody = getNotes(".sheet-music", "melody");
		var bass = getNotes(".sheet-music", "bass");
		var bpm = parseInt(document.getElementById("bpm").getAttribute("data-bpm"));
		play(melody, bass, bpm);
		songStarted = true;
		isPlaying = true;
	} else {
		isPlaying ? Tone.Transport.pause() : Tone.Transport.start();
		isPlaying = !isPlaying;
	}
});

document.addEventListener('keydown', e => {
	if(e.keyCode == 32){
		e.preventDefault();
		isPlaying ? Tone.Transport.pause() : Tone.Transport.start();
		isPlaying = !isPlaying;
	}
});

function getNotes(location, staff) {
	var notes = [];
	var selector = document.querySelectorAll(location + ' .combined-bar--active').length > 0
		? location + ' .combined-bar--active .' + staff + ' div[data-note], .combined-bar--active~.combined-bar .' + staff + ' div[data-note]'
		: location + ' .combined-bar .' + staff + ' div[data-note]';
	var melody = document.querySelectorAll(selector);
	notesBeingPlayed.push(melody);
	for (var i = 0; i < melody.length; i++) {
		var note = JSON.parse(melody[i].getAttribute("data-note"));
		var duration = melody[i].getAttribute("data-duration");
		if (duration != null && duration.includes("{")) {
			duration = JSON.parse(duration);
		}
		if (melody[i].getAttribute("data-extended") !== null) {
			isExtendedNote = true;
			extendedNote += Tone.Time(duration);
		} else {
			var duration = Tone.Time(duration) + extendedNote;
			addToNotes(notes, note, duration);
			extendedNote = 0;
			isExtendedNote = false;
		}
	}
	relativeTime = 0
	return notes;
}

function addToNotes(notes, note, length) {
	var lastDuration = 0;
	if (notes.length > 0) {
		relativeTime = notes[notes.length - 1].time;
		lastDuration = notes[notes.length - 1].dur;
	}
	
	var time = Tone.Time(relativeTime) + Tone.Time(lastDuration);
	var newNote = {time: time, note: note, dur: length};
	notes.push(newNote);
	return notes;
}

function play(melody, bass, bpm) {
	//Tone.Transport.stop();
	//Tone.Transport.position = 0;
	//Tone.Transport._scheduledEvents = {};
	Tone.Transport.bpm.value = bpm;
	synthPart = createPart(synth, melody, "white-key--active", notesBeingPlayed[0]);
	melodyNoteIndex = 0;
	basePart = createPart(synth, bass, "white-key--secondary", notesBeingPlayed[1]);
	bassNoteIndex = 0;
	var melodyEndTime = getNoteArrayLength(melody);
	var bassEndTime = getNoteArrayLength(bass);
	
	var endTime = bassEndTime;
	if (melodyEndTime >= endTime){
		endTime = melodyEndTime;
	}
	var now = Tone.now();	
	
	Tone.Transport.scheduleOnce(function(time){
		isPlaying = true;
		synthPart.start(time);
		synthPart.stop(time + endTime + 0.5);
	}, now + 0.5);
	Tone.Transport.scheduleOnce(function(time){
		basePart.start(time);
		basePart.stop(time + endTime + 0.5);
	}, now + 0.5);
	Tone.Transport.scheduleOnce(function(time){
		removeActiveClasses("white-key--active");
		removeActiveClasses("white-key--secondary");
		notesBeingPlayed[0][notesBeingPlayed[0].length - 1].classList.remove("active");
		notesBeingPlayed[1][notesBeingPlayed[1].length - 1].classList.remove("active");
		notesBeingPlayed = [];
		isPlaying = false;
		songStarted = false;
		document.getElementById('play').classList.toggle("play");
		document.getElementById('play').classList.toggle("pause");
		synthPart = null;
		basePart = null;
	}, now + endTime + 0.5);
	console.log(now + endTime + 0.5);
	Tone.Transport.start(now + 0.25);
	Tone.Transport.stop(now + endTime + 1).cancel(now + endTime + 1);
}

function createPart(synth, notes, activeClass, sheetNotes) {
	var part = new Tone.Part(
	  function(time, event) {
		removeActiveClasses(activeClass);
		if (event.note !== null) {
			//Tone.Master.volume.value=0;
			//if (event.note[0]=="C5"){
				//Tone.Transport.schedule(function(tTime){
			//		console.log("volumed");
			//		Tone.Master.volume.value=10;
				//}, time);
			//}
			synth.triggerAttackRelease(event.note, event.dur, time);
			//console.log(Tone.Master.volume.value);
			for (var note = 0; note < event.note.length; note++) {
				if (event.note[note] != "null") {
					var octave = event.note[note].charAt(event.note[note].length-1);
					var key = event.note[note].substring(0, event.note[note].length - 1);
					document.querySelectorAll("[data-octave-value='" + octave + "']")[0].querySelectorAll("[data-tone='" + key + "']")[0].classList.add(activeClass);
				}
			}
		}
		for (var sheetNote = 0; sheetNote < sheetNotes.length; sheetNote++) {
			sheetNotes[sheetNote].classList.remove("active");
		}
		var playedNoteIndex;
		if (activeClass == "white-key--active") {
			playedNoteIndex = melodyNoteIndex;
		} else {
			playedNoteIndex = bassNoteIndex;
		}
		sheetNotes[playedNoteIndex].classList.add("active");
		if (sheetNotes[playedNoteIndex].getAttribute("data-extended") != null) {
			playedNoteIndex++;
			sheetNotes[playedNoteIndex].classList.add("active");
		}
		if (activeClass == "white-key--active") {
			melodyNoteIndex++;
		} else {
			bassNoteIndex++;
		}
	  },
	  notes
	);
	part.humanize = true;
	return part;
}

function removeActiveClasses(activeClass) {
	for (var i = 0; i < keys.length; i++) {
		keys[i].classList.remove(activeClass);
	}
}

function getNoteArrayLength(notes) {
	if (notes.length == 0) {
		return 0;
	}
	var lastNote = notes[notes.length - 1];
	return lastNote.time + lastNote.dur;
}

// Sheet Music Builder

document.getElementById('addNote').addEventListener('submit', e => {
	e.preventDefault();
	var note = document.querySelectorAll("#addNote #note")[0].value;
	var duration = document.querySelectorAll("#addNote #duration")[0].value;
	var newNote = document.createElement("div");
	var dataNote = document.createAttribute("data-note");
	newNote.setAttributeNode(dataNote);
	dataNote.value = note;
	var dataDuration = document.createAttribute("data-duration");
	dataDuration.value = duration;
	newNote.setAttributeNode(dataDuration);
	
	var sheetBars = document.querySelectorAll(".sheet-music .combined-bar .melody.bar");
	sheetBars[sheetBars.length - 1].appendChild(newNote);
	
	var sheetNotes = document.querySelectorAll('.melody [data-note]');
	fillSheet(sheetNotes, true);
});