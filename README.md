# Recordy
## Recording for browsers - the easy way
This module abstracts away the logic needed to record audio in your browser.
Since it's based on the [Chnl](https://github.com/scriptify/Chnl) module, a lot of effects can be added to the input. For information about this aspect just have a look a the documentation of Chnl.
You can treat any Recordy-instance as a Chnl, because Recordy is extending Chnl.
To record the input, I'm using a fork of the popular recorder.js library from Matt Diamond, [wrecorder](https://github.com/scriptify/Wrecorder), which allows us to record the output of WebAudio-nodes. Big thanks for this awesome work!
## Usage
### Creating an instance
```javascript
new Recordy(audioCtx)
```

To create a Recordy-instance, you have to pass exactly one argument to the constructor: an AudioContext object.
Now, you can request audio input(have a look at the example for more information).

### Getting input
```javascript
.getInput()
```

This method needs to be executed before you can start recording. It asynchronously requests audio input. So the return value is a __Promise__, which returns a __boolean__ value. This value evaluates to true if the request for the microphone/audio-input was successfully and to false if it wasn't.

### Start recording
```javascript
.startRecording()
```

This method is really self-explanatory.
Recody will record until you call the .stopRecording(...) method.

### Stop recording
```javascript
.stopRecording(asAudioObject)
```

This methods stops a previously started recording.
It accepts exactly one parameter: a __boolean__.
If this boolean evaluates to true, this method will return a Promise which returns an Audio-object with the recorded track.
Otherwise, it returns a Promise which returns the plain binary data(blob) of the recorded track.

### Outputting to the speakers
```javascript
.toSpeaker(gainValue)
```

Recordy allows you to directly output the audio-input to the speakers, so you could directly hear the effects you apply etc. The method accepts exactly one parameter: The volume of the output. This can be a number from 0 - 1. If you set a value of 0 it's muted, if you set a value of 1 it's the maximal possible volume.
__ATTENTION:__ Due to the lack of support of advanced and latency-free audio protocols like ASIO(...) in the actual browsers, there's a quite high latency between input and output (it's clearly noticeable).
Therefore, it's muted by default.


# Example

This is a simple example which records an one second long track. The track gets returned as an Audio-object so it can be directly played. Also, the input is directly outputted to the speakers with a gain of 0.4.
In addition, some functionality of the Chnl module was applied: The bitcrusher effect was enabled.

```javascript
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
    r.toSpeaker(0.4);
    r.effects.bitcrusher.enable();
  });
```
