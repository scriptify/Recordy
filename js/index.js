import Chnl from 'webaudio-chnl';
import Recorder from 'wrecorder';
import getInput from './getInput';

export default class Recordy extends Chnl {

  recorder;
  directOutGain;

  constructor(audioCtx) {
    super(audioCtx);
    this.recorder = new Recorder(this);

    // Set direct output to speakers
    this.directOutGain = audioCtx.createGain();
    this.directOutGain.gain.value = 0;
    this.connect(this.directOutGain);
    this.directOutGain.connect(audioCtx.destination);

  }

  toSpeaker(val) {
    this.directOutGain.gain.value = val;
  }

  async getInput() {
    const stream = await getInput();
    const mediaStream = this.context.createMediaStreamSource(stream);
    mediaStream.connect(this);
    return true;
  }

  startRecording() {
    this.recorder.record();
  }

  stopRecording(asAudioObject = false) {
    // If asAudioObject evaluates to true, a window.Audio-object will be returned; otherwise, a blob will be returned;
    return new Promise((resolve, reject) => {
      this.recorder.stop();

      this.recorder.exportWAV(blob => {
        this.recorder.clear();

        if(asAudioObject) {
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          resolve(audio);
        }

        resolve(blob);
      });
    });
  }

}

const audioCtx = new AudioContext();
const r = new Recordy(audioCtx);

r.getInput()
  .then(val => {
    r.startRecording();

    window.setTimeout(() => {
      r.stopRecording(true)
        .then(audio => {
          audio.play();
        });
    }, 1000);
    /*r.toSpeaker(0.4);
    r.effects.bitcrusher.enable();*/
  });
