//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

var whiteKeys = document.getElementsByClassName('white-key');

var startNote = function () {
	synth.triggerAttack(this.getAttribute("data-tone"));
}

var endNote = function () {
	synth.triggerRelease();
}

for (var i = 0; i < whiteKeys.length; i++) {
	whiteKeys[i].addEventListener('mousedown', startNote);
	whiteKeys[i].addEventListener('touchstart', startNote);
	whiteKeys[i].addEventListener('mouseup', endNote);
	whiteKeys[i].addEventListener('touchend', endNote);
}