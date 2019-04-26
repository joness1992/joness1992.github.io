//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

var whiteKeys = document.getElementsByClassName('white-key');

for (var i = 0; i < whiteKeys.length; i++) {
	whiteKeys[i].addEventListener('mousedown', e => {
		synth.triggerAttack(e.target.getAttribute("data-tone"));
	});
	whiteKeys[i].addEventListener('mouseup', e => {
	  synth.triggerRelease()
	});
}