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

var keys = document.getElementsByClassName('key');
var musicBars = document.getElementsByClassName("combined-bar");
var hoveredKey = null;
var mouseDown = false;
var isPlaying = false;
var songStarted = false;
var isExtendedNote = false;
var melodyNoteIndex = 0;
var bassNoteIndex = 0;
var melodyLength = 0;
var bassLength = 0;
var editingNote;

// Initial Set Up

var synth = new Tone.Sampler(piano, { 
	"baseUrl": "assets/samples/piano/", 
	"release" : 1,
	"curve": "linear",
	"onload": function() {
		document.getElementsByClassName("sheet-music")[0].classList.remove("hidden");
	}
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

if (document.getElementById("editPage") === null) {
	for (var i = 0; i < musicBars.length; i++) {
		musicBars[i].addEventListener('click', e => {
			for (var j = 0; j < musicBars.length; j++) {
				musicBars[j].classList.remove("combined-bar--active");
			}
			e.target.closest(".combined-bar").classList.add("combined-bar--active");
		});
	}
}

// Keyboard

document.addEventListener('mousedown', e => {
  mouseDown = true;
  if (hoveredKey !== null) {
	  activateKey(hoveredKey);
  }
  if (e.target.closest("div[data-note]") === null || !e.target.closest("div[data-note]").classList.contains("edit")) { // Remove edit status from notes
	  editingNote = undefined;
	  removeActiveNotes(getNotes(".sheet-music", "melody"), "edit");
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
	var noteDowns;
	var noteLines;
	var hasLine0;
	var hasLine1;
	var hasLine2;
	var hasLine3;
	var hasLine4;
	var hasLine5;
	var hasLine6;
	var hasLine7;
	var hasLine8;
	var noteDownLineUnders;
	var noteUps;
	var noteDownNoOffsets;
	var noteDownOffsets;
	var noteUpNoOffsets;
	var noteUpOffsets;
	var noteUpOffsetLines;

	if (isMelody) {
		noteDowns = ["B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6", "D6", "E6", "F6", "G6", "A6", "B6"];
		hasLine0 = ["C4", "A5", "C6", "E6", "G6"];
		hasLine1 = ["B5", "D6", "F6", "A6"];
		hasLine2 = ["C6", "E6", "G6"];
		hasLine3 = ["D6", "F6", "A6"];
		hasLine4 = ["E6", "G6"];
		hasLine5 = ["F6", "A6"];
		hasLine6 = ["G6"];
		hasLine7 = ["A6"];
		hasLine8 = [];
		noteUps = ["B3", "C4", "D4", "E4", "F4", "G4", "A4"];
		noteOffsets = ["C4", "E4", "G4", "B4", "D5", "F5", "A5", "C6", "E6", "G6"];
	} else {
		noteDowns = ["D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5"];
		hasLine0 = ["E2", "C4", "E4", "G4", "B4", "D5", "F5"];
		hasLine1 = ["D4", "F4", "A4", "C5", "F5"];
		hasLine2 = ["E4", "G4", "B4", "D5", "F5"];
		hasLine3 = ["F4", "A4", "C5", "F5"];
		hasLine4 = ["G4", "B4", "D5", "F5"];
		hasLine5 = ["A4", "C5", "F5"];
		hasLine6 = ["B4", "D5", "F5"];
		hasLine7 = ["C5", "F5"];
		hasLine8 = ["D5", "F5"];
		noteUps = ["D2", "E2", "F2", "G2", "A2", "B2", "C3"];
		noteOffsets = ["E2", "G2", "B2", "D3", "F3", "A3", "C4", "E4", "G4", "B4", "D5", "F5"];
	}
	for (var i = 0; i < sheetNotes.length; i++) {
		var sheetNote = sheetNotes[i];
		while (sheetNote.firstChild) {
			sheetNote.removeChild(sheetNote.firstChild);
		}
		var noteValueArr = JSON.parse(sheetNote.getAttribute("data-note"));
		if (noteValueArr == null) {
			noteValueArr = ["null"]
		}
	
		var noteType = sheetNote.getAttribute("data-duration");
		var noteExtended = "";
		var isChord = noteValueArr.length > 1;
		var firstChordNote = noteValueArr[0];
		var lastChordNote = noteValueArr[noteValueArr.length - 1];
		
		var noteAlign = "";
		var eighthCurl = ""
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
			noteAlign = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#stick-up'></use>";
			eighthCurl = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#eighth-curl-up'></use>";
		} else {
			noteAlign = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#stick-down'></use>";
			eighthCurl = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#eighth-curl-down'></use>";
		}
		
		if (sheetNote.getAttribute("data-extended") !== null) {
			noteExtended = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#tie-1'></use>";
		} else if (i > 0 && sheetNotes[i-1].getAttribute("data-extended") !== null) {
			noteExtended = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#tie-2'></use>";
		}
		
		for (var j = 0; j < noteValueArr.length; j++) {
			var noteValue = noteValueArr[j];
			var width = "18";
			var height = "102";
			var noteSize = "";
			var noteLinePosition = "";
			var noteOffset = "";
			var noteBar = "";
			
			if (hasLine0.includes(noteValue)) {
				noteLinePosition += "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#line0'></use>";
			}
			if (hasLine1.includes(noteValue)) {
				noteLinePosition += "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#line1'></use>";
			}
			if (hasLine2.includes(noteValue)) {
				noteLinePosition += "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#line2'></use>";
			}
			if (hasLine3.includes(noteValue)) {
				noteLinePosition += "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#line3'></use>";
			}
			if (hasLine4.includes(noteValue)) {
				noteLinePosition += "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#line4'></use>";
			}
			if (hasLine5.includes(noteValue)) {
				noteLinePosition += "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#line5'></use>";
			}
			if (hasLine6.includes(noteValue)) {
				noteLinePosition += "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#line6'></use>";
			}
			if (hasLine7.includes(noteValue)) {
				noteLinePosition += "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#line7'></use>";
			}
			if (hasLine8.includes(noteValue)) {
				noteLinePosition += "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#line8'></use>";
			}
			
			if (noteType === "{\"4n\": 1}" || noteType === "4n") {
				if (noteValue == "null") {
					noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#quarter-rest'></use>";
					noteAlign = "";
					width = "12";
				} else {
					noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#filled-oval'></use>";
					width = "40";
				}
			} else if (noteType === "{\"4n\": 2}" || noteType === "2n") {
				if (noteValue == "null") {
					noteAlign = "";
					noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#half-rest'></use>";
				} else {
					noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#empty-oval'></use>";
					width = "40";
				}
			} else if (noteType === "{\"8n\": 1}" || noteType === "8n") {
				if (noteValue == "null") {
					noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#eighth-rest'></use>";
					noteAlign = "";
					width = "20";
				} else {
					var curl = "";
					if (isChord) {
						if ((noteAlign == "-up" && noteValue == lastChordNote) || (noteAlign == "-down" && noteValue == firstChordNote)) {
							noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#filled-oval'></use>";
							curl = eighthCurl;
						} else {
							noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#filled-oval'></use>";
						}
					} else {
						noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#filled-oval'></use>";
						curl = eighthCurl;
					}
					if (i !== 0 && sheetNotes[i+1] !== undefined && sheetNotes[i].getAttribute("data-note") == sheetNotes[i+1].getAttribute("data-note") && sheetNotes[i].getAttribute("data-duration") == sheetNotes[i+1].getAttribute("data-duration") && sheetNotes[i].parentNode == sheetNotes[i+1].parentNode && sheetNotes[i].getAttribute("data-note") == sheetNotes[i-1].getAttribute("data-note") && sheetNotes[i].getAttribute("data-duration") == sheetNotes[i-1].getAttribute("data-duration") && sheetNotes[i].parentNode == sheetNotes[i-1].parentNode) {
						noteBar = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#flat-bar-middle'></use>";
						curl = "";
					}
					else if (sheetNotes[i+1] !== undefined && sheetNotes[i].getAttribute("data-note") == sheetNotes[i+1].getAttribute("data-note") && sheetNotes[i].getAttribute("data-duration") == sheetNotes[i+1].getAttribute("data-duration") && sheetNotes[i].parentNode == sheetNotes[i+1].parentNode) {
						noteBar = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#flat-bar-1'></use>";
						curl = "";
					} else if (i !== 0 &&  (sheetNotes[i-1].getAttribute("data-note") === sheetNotes[i].getAttribute("data-note"))  && (sheetNotes[i-1].getAttribute("data-duration") === "{\"8n\": 1}" || sheetNotes[i-1].getAttribute("data-duration") === "8n") && sheetNotes[i].parentNode == sheetNotes[i-1].parentNode) {
						noteBar = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#flat-bar-2'></use>";
						curl = "";
					}
					noteSize += curl;
					width = "40";
				}
			} else if (noteType === "{\"1m\": 1}" || noteType === "1m") {
				noteAlign = "";
				if (noteValue == "null") {
					noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#whole-rest'></use>";
				} else {
					noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#whole-note'></use>";
					width = "20";
				}
			} else if (noteType === "{\"4n\": 1, \"8n\": 1}" || noteType === "4n.") {
				noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#filled-oval'></use>";
				
				if (noteOffsets.includes(noteValue)) {
					noteOffset = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#dot-offset'></use>";
				} else {
					noteOffset = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#dot'></use>"
				}
				width = "29";
			} else if (noteType === "{\"4n\": 3}" || noteType === "2n.") {
				noteSize = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#empty-oval'></use>";
				
				if (noteOffsets.includes(noteValue)) {
					noteOffset = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#dot-offset'></use>";
				} else {
					noteOffset = "<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#dot'></use>"
				}
				width = "29";
			}
			
			var noteArr = noteValue != "null" ? "[\"" + noteValue + "\"]" : noteValue;
			
			var noteSVG = noteSize + noteOffset + noteAlign + noteLinePosition + noteBar + noteExtended;
			
			if (noteSVG !== "") {
				//sheetNote.removeAttribute("data-note");
				sheetNote.innerHTML = sheetNote.innerHTML += "<svg width='" + width + "' height='" + height + "' data-note='" + noteArr + "'><title>" + noteValue + "</title><g>" + noteSVG + "</g></svg>";
			}
		}
		
		if ((noteType === "{\"4n\": 1, \"8n\": 1}" || noteType === "4n.") && (sheetNote.nextElementSibling == null || !sheetNote.nextElementSibling.classList.contains("eighth-note-spacer"))) {
			var spacer = document.createElement("div");
			spacer.classList.add("eighth-note-spacer");
			sheetNote.parentNode.insertBefore(spacer, sheetNote.nextSibling);
		}	
		if ((noteType === "{\"4n\": 2}" || noteType === "{\"4n\": 3}" || noteType === "2n" || noteType === "2n.") && (sheetNote.nextElementSibling == null || !sheetNote.nextElementSibling.classList.contains("half-note-spacer"))) {
			var spacer = document.createElement("div");
			spacer.classList.add("half-note-spacer");
			sheetNote.parentNode.insertBefore(spacer, sheetNote.nextSibling);
			if (noteType === "{\"4n\": 3}" || noteType === "2n.") {
				var spacer2 = document.createElement("div");
				spacer2.classList.add("quarter-note-spacer");
				sheetNote.parentNode.insertBefore(spacer2, sheetNote.nextSibling);
			}		
		}		
	}
}

// Audio Playback

document.getElementById("play").addEventListener('click', togglePlay);

document.addEventListener('keydown', e => {
	if(e.keyCode == 32){
		togglePlay(e);
	}
});

function togglePlay(e) {
	e.preventDefault();
	var playButton = document.getElementById("play");
	playButton.classList.toggle("play");
	playButton.classList.toggle("pause");
	if (!songStarted) {
		var bpm = parseInt(document.getElementById("bpm").getAttribute("data-bpm"));
		play(bpm);
		songStarted = true;
		isPlaying = true;
	} else {
		isPlaying ? Tone.Transport.pause() : Tone.Transport.start();
		isPlaying = !isPlaying;
	}
}

function getNotes(location, staff) {
	var selector = document.querySelectorAll(location + ' .combined-bar--active').length > 0
		? location + ' .combined-bar--active .' + staff + ' div[data-note], .combined-bar--active~.combined-bar .' + staff + ' div[data-note]'
		: location + ' .combined-bar .' + staff + ' div[data-note]';
	return document.querySelectorAll(selector);
}

function play(bpm) {
	Tone.Transport._scheduledEvents = {};
	Tone.Transport.bpm.value = bpm;
	Tone.Transport.start();
	var melody = getNotes(".sheet-music", "melody");
	playPart(synth, "white-key--active", melody);
	melodyNoteIndex = 0;
	var bass = getNotes(".sheet-music", "bass");
	playPart(synth, "white-key--secondary", bass);
	bassNoteIndex = 0;
	
	var endTime = bassLength;
	if (melodyLength >= endTime){
		endTime = melodyLength;
	}
	
	var now = Tone.now();
	Tone.Transport.scheduleOnce(function(time){
		removeActiveClasses("white-key--active");
		removeActiveClasses("white-key--secondary");
		removeActiveNotes(melody, "active");
		removeActiveNotes(bass, "active");
		isPlaying = false;
		songStarted = false;
		document.getElementById('play').classList.toggle("play");
		document.getElementById('play').classList.toggle("pause");
	}, now + endTime + 0.5);
}

function playPart (synth, activeClass, sheetNotes) {
	var now = Tone.now();	
	var relativeTime = 0;
	var lastDuration = 0;
	var isExtended = false;
	var isMelody = activeClass == "white-key--active";
	
	for (var i = 0; i < sheetNotes.length; i++) {
		if (isExtended) {
			isExtended = sheetNotes[i].getAttribute("data-extended") != null;
			continue;
		}
		relativeTime = relativeTime + lastDuration;
		lastDuration = Tone.Time(getDuration(sheetNotes, i)).toSeconds();
		isExtended = sheetNotes[i].getAttribute("data-extended") != null;
		
		Tone.Transport.scheduleOnce(function(time) {
			var highlightIndex;
			var note;
			var duration;
			
			removeActiveNotes(sheetNotes, "active")
			removeActiveClasses(activeClass);
			
			if (isMelody) {
				note = JSON.parse(sheetNotes[melodyNoteIndex].getAttribute("data-note"));
				duration = getDuration(sheetNotes, melodyNoteIndex);
				sheetNotes[melodyNoteIndex].classList.add("active");
				
				while (sheetNotes[melodyNoteIndex].getAttribute("data-extended") != null) {
					melodyNoteIndex++;
					duration = Tone.Time(duration).toSeconds() + Tone.Time(getDuration(sheetNotes, melodyNoteIndex)).toSeconds();
					sheetNotes[melodyNoteIndex].classList.add("active");
				}
				melodyNoteIndex++;
			} else {
				note = JSON.parse(sheetNotes[bassNoteIndex].getAttribute("data-note"));
				duration = getDuration(sheetNotes, bassNoteIndex);
				sheetNotes[bassNoteIndex].classList.add("active");
				
				while (sheetNotes[bassNoteIndex].getAttribute("data-extended") != null) {
					bassNoteIndex++;
					sheetNotes[bassNoteIndex].classList.add("active");
					duration = Tone.Time(duration).toSeconds() + Tone.Time(getDuration(sheetNotes, bassNoteIndex)).toSeconds();
				}
				bassNoteIndex++;
			}
			
			if (note !== null) {
				synth.triggerAttackRelease(note, duration);
				for (var j = 0; j < note.length; j++) {
					if (note[j] != "null") {
						var octave = note[j].charAt(note[j].length-1);
						var key = note[j].substring(0, note[j].length - 1);
						document.querySelectorAll("[data-octave-value='" + octave + "']")[0].querySelectorAll("[data-tone='" + key + "']")[0].classList.add(activeClass);
					}
				}
			}
		}, now + relativeTime + 0.5);
	}
	if (isMelody) {
		melodyLength = relativeTime + lastDuration;
	} else {
		bassLength = relativeTime + lastDuration;
	}
}

function getDuration (sheetNotes, noteIndex) {
	var duration = sheetNotes[noteIndex].getAttribute("data-duration");
	if (duration != null && duration.includes("{")) {
		duration = JSON.parse(duration);
	}
	while (sheetNotes[noteIndex].getAttribute("data-extended") != null) {
		noteIndex++;
		var nextDuration = sheetNotes[noteIndex].getAttribute("data-duration");
		if (nextDuration != null && nextDuration.includes("{")) {
			nextDuration = JSON.parse(nextDuration);
		}
		duration = Tone.Time(duration).toSeconds() + Tone.Time(nextDuration).toSeconds();
	}
	return duration;
}

function removeActiveClasses(activeClass) {
	for (var i = 0; i < keys.length; i++) {
		keys[i].classList.remove(activeClass);
	}
}

function removeActiveNotes(notes, className) {
	for (var sheetNote = 0; sheetNote < notes.length; sheetNote++) {
		notes[sheetNote].classList.remove(className);
	}
}

// Sheet Music Builder

var currentBarLength = 0;
var maxBarLength = 2;

if (document.getElementById('addNote') != null) {
	document.getElementById('addNote').addEventListener('submit', e => {
		e.preventDefault();
		
		var note = document.querySelectorAll("#addNote #note")[0].value;
		var duration = document.querySelectorAll("#addNote #duration")[0].value;
		
		var sheetBars = document.querySelectorAll(".sheet-music .combined-bar .melody.bar");
		var lastBar = sheetBars[sheetBars.length - 1];
		var lastBarNotes = lastBar.querySelectorAll("div[data-note]");
		
		var lastBarTime = 0;
		for (var i = 0; i < lastBarNotes.length; i++) {
			var dur = lastBarNotes[i].getAttribute("data-duration").includes("{") 
				? JSON.parse(lastBarNotes[i].getAttribute("data-duration"))
				: lastBarNotes[i].getAttribute("data-duration");
			lastBarTime += Tone.Time(dur).toSeconds();
		}
		
		//lastBarTime += Tone.Time(JSON.parse(duration)).toSeconds();
		
		if (lastBarTime + Tone.Time(JSON.parse(duration)).toSeconds() > 2) {
			var diff = 2 - lastBarTime;
			var lastDuration = Tone.Time(JSON.parse(duration)).toSeconds() - diff;
			if (diff === 1.25) {
				addNoteToSheet(note, "2n", true);
				addNoteToSheet(note, "8n", true);
			} else if (diff === 1.75) {
				addNoteToSheet(note, "2n.", true);
				addNoteToSheet(note, "8n", true);
			} else {
				var firstDuration = Tone.Time(diff).toNotation();
				addNoteToSheet(note, firstDuration, true);
			}
			
			addBarToSheet(lastBar)
			
			if (lastBarTime + Tone.Time(JSON.parse(duration)).toSeconds() > 2) {
				if (lastDuration === 1.25) {
					addNoteToSheet(note, "2n", true);
					addNoteToSheet(note, "8n", false);
				} else if (lastDuration === 1.75) {
					addNoteToSheet(note, "2n.", true);
					addNoteToSheet(note, "8n", false);
				} else {
					lastDuration = Tone.Time(lastDuration).toNotation();
					addNoteToSheet(note, lastDuration, false);
				}
			}
		} else if (lastBarTime + Tone.Time(JSON.parse(duration)).toSeconds() == 2) {
			var diff = 2 - lastBarTime;
			var lastDuration = Tone.Time(JSON.parse(duration)).toSeconds() - diff;
			if (diff === 1.25) {
				addNoteToSheet(note, "2n", true);
				addNoteToSheet(note, "8n", false);
			} else if (diff === 1.75) {
				addNoteToSheet(note, "2n.", true);
				addNoteToSheet(note, "8n", false);
			} else {
				var firstDuration = Tone.Time(diff).toNotation();
				addNoteToSheet(note, firstDuration, false);
			}
			
			addBarToSheet(lastBar)
		} else {
			var isExtended = document.getElementById("extended").checked;
			addNoteToSheet(note, duration, isExtended);
		}
		
	});
}

function enableNoteEdit(event) {
	if (editingNote !== undefined) {
		editingNote.classList.remove("edit");
	}
	editingNote = event.target.closest("div[data-note]");
	editingNote.classList.add("edit");
}

document.addEventListener('keydown', e => {
	console.log(e.keyCode);
	if (editingNote !== undefined) {
		var currentKey = JSON.parse(editingNote.getAttribute("data-note"))[0];
		var newKey = currentKey.split("")[0];
		var newOctave = parseInt(currentKey.split("")[1]);
		if (e.keyCode === 38) {
			switch(newKey) {
				case "C": newKey = "D"; break;
				case "D": newKey = "E"; break;
				case "E": newKey = "F"; break;
				case "F": newKey = "G"; break;
				case "G": newKey = "A"; break;
				case "A": newKey = "B"; break;
				case "B": newKey = "C"; newOctave++; break;
			}
		} else if (e.keyCode === 40) {
			switch(newKey) {
				case "C": newKey = "B"; newOctave--; break;
				case "D": newKey = "C"; break;
				case "E": newKey = "D"; break;
				case "F": newKey = "E"; break;
				case "G": newKey = "F"; break;
				case "A": newKey = "G"; break;
				case "B": newKey = "A"; break;
			}
		}
		editingNote.setAttribute("data-note", '["' + newKey + newOctave + '"]');
		fillSheet(document.querySelectorAll('.melody [data-note]'), true);
	}
});

function addNoteToSheet(note, duration, isExtended) {
	var newNote = document.createElement("div");
	var dataNote = document.createAttribute("data-note");
	newNote.setAttributeNode(dataNote);
	dataNote.value = note;
	var dataDuration = document.createAttribute("data-duration");
	dataDuration.value = duration;
	newNote.setAttributeNode(dataDuration);
	if (isExtended) {
		var dataExtended = document.createAttribute("data-extended");
		dataExtended.value = "";
		newNote.setAttributeNode(dataExtended);
	}
	
	newNote.addEventListener("click", enableNoteEdit);
	
	var sheetBars = document.querySelectorAll(".sheet-music .combined-bar .melody.bar");
	lastBar = sheetBars[sheetBars.length - 1];
	lastBar.appendChild(newNote);
	
	var sheetNotes = document.querySelectorAll('.melody div[data-note]');
	fillSheet(sheetNotes, true);
}

function addBarToSheet(lastBar) {
	var newBar = document.createElement("div");
	newBar.classList.add("combined-bar");
	addStave(newBar, "melody", "stave-header");
	addStave(newBar, "bass", "bass-clef");
	lastBar.parentNode.parentNode.insertBefore(newBar, lastBar.parentNode.nextSibling);
}

function addStave(bar, type, headerSvg) {
	var melodyBar = document.createElement("div");
	melodyBar.classList.add(type);
	melodyBar.classList.add("bar");
	var melodyStave = document.createElement("div");
	melodyStave.classList.add("stave-header");
	melodyStave.innerHTML = "<svg width='103' height='103'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='assets/images/notes.svg#" + headerSvg + "'></use></svg>";
	melodyBar.appendChild(melodyStave);
	bar.appendChild(melodyBar);
}

if (document.getElementById("remove") !== null) {
	document.getElementById("remove").addEventListener("click", e => {
		if (editingNote !== undefined) {
			editingNote.remove();
			fillSheet(sheetNotes, true);
			fillSheet(sheetNotes, false);
		}
	});
}
