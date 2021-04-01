// vars ------------------------------------------------------------------------

let playing = false
let globalBeatsInBar = 0
let tickInterval
let globalMs
let globalEmptyBars
let globalBPM
let beatCounter = 0
let barCounter = 1
let muted = false
let minBPM = 1
let maxBPM = 220
let minBars = 0
let maxBars = 16

const tok = new Audio('tok100.wav');
const tik = new Audio('tik100.wav')
tik.load()
tok.load()

const button = document.getElementById('play-button');
const bpmInput = document.getElementById('bpm-input');
const barsInput = document.getElementById('bars-input')
const barsSlider = document.getElementById('bars-slider')
const bpmSlider = document.getElementById('bpm-slider')
const meterButton0 = document.getElementById('meter-0')
const meterButton2 = document.getElementById('meter-2')
const meterButton3 = document.getElementById('meter-3')
const meterButton4 = document.getElementById('meter-4')
const meterButtons = [meterButton0, meterButton2, meterButton3, meterButton4]

button.addEventListener('click', run)
meterButton0.addEventListener('click', () => changeMeter(0, meterButton0))
meterButton2.addEventListener('click', () => changeMeter(2, meterButton2))
meterButton3.addEventListener('click', () => changeMeter(3, meterButton3))
meterButton4.addEventListener('click', () => changeMeter(4, meterButton4))
bpmSlider.addEventListener('input', () => {changeBPM('slider', bpmSlider.value)})
bpmInput.addEventListener('input', () => {changeBPM('input', bpmInput.value)})
barsSlider.addEventListener('input', () => {changeBars('slider', barsSlider.value)})
barsInput.addEventListener('input', () => {changeBars('input', barsInput.value)})


// functions -------------------------------------------------------------------

function changeMeter(meter, meterButton) {
  globalBeatsInBar = meter;
  for (b of meterButtons) {
    b.classList.remove('nv-selected');
  }
  meterButton.classList.add('nv-selected');
}

function changeBPM(method, value) {
  const bpm = validate(value, minBPM, maxBPM);
  globalMs = bpmToMs(bpm);
  if (method == 'slider') {
    bpmInput.value = bpm;
  }
  else if (method == 'input') {
    bpmSlider.value = bpm;
  }
  globalBPM = bpm
  restartInterval()
}

function changeBars(method, value) {
  globalEmptyBars = validate(value, minBars, maxBars);
  if (method == 'slider') {
    barsInput.value = value;
  }
  else if (method == 'input') {
    barsSlider.value = globalEmptyBars;
    setTimeout(barsInput.value = globalEmptyBars, 300);
  }
  restartInterval()
}

function restartInterval() {
  if (playing) {
    clearTimeout(tickInterval);
    tickInterval = setTimeout(
      metroInterval,
      globalMs,
    );
  }
}

function metroPlay(_snd, _mute) {
  console.log(globalMs);
  if (_snd == 1 && !_mute) {
    tik.play()
    metroAnimate()
  } else if (_snd == 0 && !_mute) {
    tok.play()
    metroAnimate()
  }
}

function bpmToMs(_bpm) {
  return (60000 / _bpm)
}

function run() {
  if (!playing) {
	globalBPM = bpmInput.value;
    startMetronome();
  } else {
    stopMetronome()
  }
}

function startMetronome() {
  globalEmptyBars = barsInput.value
  globalMs = bpmToMs(bpmInput.value)
  playing = true
  beatCounter = 0
  barCounter = 1
  muted = false
  tickInterval = setTimeout(
    metroInterval,
    globalMs,
  )
}

function metroInterval() {
  bpmInput.value = globalBPM
  beatCounter++
  if (beatCounter == globalBeatsInBar) {
    beatCounter = 0;
    barCounter++
  }
  if (beatCounter == 0) {
    metroPlay(1, muted)
  }
  else {
    metroPlay(0, muted)
  }
  if (barCounter > globalEmptyBars && globalEmptyBars > 0) {
    barCounter = 1;
    muted = !muted
  }
  tickInterval = setTimeout(
    metroInterval,
    globalMs,
  )
}

function stopMetronome() {
  playing = false
  clearTimeout(tickInterval)
}


// balls animation -------------------------------------------------------------

const ball1 = document.getElementById("metro-ball-1");
const ball2 = document.getElementById("metro-ball-2");

function metroAnimate() {
  let duration = (Math.floor(globalMs) / 1000) - 0.001;
  let transition = `transition: left ${duration}s, right ${duration}s, width ${duration}s, height ${duration}s;`;
  ball1.setAttribute('style', transition);
  ball2.setAttribute('style', transition);
  ball1.classList.replace('ball-1-start', 'ball-1-end');
  ball2.classList.replace('ball-2-start', 'ball-2-end');
  let aniResetTimeout = setTimeout(resetBalls, globalMs - 50);
}

function resetBalls() {
  ball1.removeAttribute('style');
  ball2.removeAttribute('style');
  ball1.classList.replace('ball-1-end', 'ball-1-start');
  ball2.classList.replace('ball-2-end', 'ball-2-start');
}


// play button animation -------------------------------------------------------

let buttonStatus = 'tri'
let aniTriIntoSquare = document.getElementById("aniTriIntoSquare");
let aniSquareIntoTri = document.getElementById("aniSquareIntoTri");
let aniRotation0180 = document.getElementById("aniRotation-0-180");
let aniRotation180360 = document.getElementById("aniRotation-180-360");

button.addEventListener("click", fire);

function fire() {
  if (buttonStatus == "tri")
  {
    buttonStatus = "square";
    aniRotation0180.beginElement();
    aniTriIntoSquare.beginElement();
  }
  else {
    buttonStatus = "tri";
    aniRotation180360.beginElement();
    aniSquareIntoTri.beginElement();
  }
}


// validate inputs ------------------------------------------------------------

function validate(input, min, max) {
  if (input > max) {
    return max;
  }
  else if (input < min) {
    return min;
  }
  else {
    return input;
  }
}
