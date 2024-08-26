/*

I've been thinking a lot, about Corruption.

I don't consider myself to enable it. 

Didn't?

Not so sure now. 

The rot takes all in the end, and all.

When I added Nidhogg's corruption to my previous set of games, Farragnarok, it had a clear vibe.

Endlessly spreading life, spiralling out in all directions, infecting you physically with spores in order to twist you to do its bidding.

It wasn't mind control, no, it was LIFE control. Hormones and instincts all twisted up.

Till whatever your moral compass had been BEFORE, well, now it's for Nidhogg. 

And Nidhogg says that it's immoral to not plant trees. To not find new people to infect. To let anything die.

You feel like yourself still. 

Of course you do. 

You're not some kind of mindless zombie. 

But MAN do you not understand anyone who ISN'T already on board with this great new religion.

Can you believe I hadn't listened to the Magnus Archives yet at that point? (If you know what that is, dear Guest)



Now, my next fan work, ZampanioSim, I HAD explicitly listened to it. 

And I wanted to take the corruption in a different direction.

Same corruption from Farragnarok.  Different presentation.

How can you physically infect a simulated copy of a copy? (of a copy)

No.  If genes are how physical life spreads, then memes are how cognitive life spreads. 

The Corruption takes a new form.

And what better meme for it to feed on than house of leaves? Than the Magnus Archives.

If you're here, it might have you. 

It's not puppeting you. You're no mindless zombie. 

But how late is it right now? When's the last time you drank? Slept?

Why are you sitting here, desperately combing through the source code of a silly game you found online?

What are you hoping to find?

:) :) :)

The Truth is, it doesn't matter, does it?

There's no possible catharsis you could find here that would satisfy you. 

Only the endless Need to Know More.



The End is Never the End, dear guest. 



But enough about your fate.

What interests me know is my own newest obsession.

It is fascinating how it's entirely possible you may know more than the me-who-is-writing this, dear Guest. 

After all, I've only newly been exposed, and it's been spreading for years now, hasn't it?

It reeks of Corruption.

But I can't quite place the variety. 

Obviously, it's not something stemming from me. 

I'm a newcomer here, just like many of you. 

The Scarecrow, though...  It haunts me. I haven't added it yet, to the site. 

Haven't found something big enough for it? If that makes sense?

Need to let the Sacrifices grow a bit more. They're still only in the edges.



*/




//"http://farragofiction.com/Lavinraca/Corn/audio/web_Music_wind1.mp3"
//http://farragnarok.com/PodCasts/zampanio.mp3

class AudioFucker {
  audioCtx = new AudioContext();
  //it is almost midnight and im only 30% sure im using these terms correctly
  //controls the volume of the original source
  dryGainNode;
  //controls the volume of the modified source
  wetGainNode;
  sourceNode;
  //fast, slow, i seem to recall negative doesn't work
  //https://stackoverflow.com/questions/9874167/how-can-i-play-audio-in-reverse-with-web-audio-api
  playBackRate = 1.0;

  fetchBufferForURL = async (url) => {
    const response = await window.fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }


  playURL = (url, loop, playBackRate) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.play(audioBuffer, loop, playBackRate)
      });
  }



  makeDistortionCurve = (amount) => {
    let k = typeof amount === "number" ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for (; i < n_samples; ++i) {
      x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  convolverFromBuffer = (audioBuffer) => {
    const convolver = this.audioCtx.createConvolver();
    convolver.buffer = audioBuffer;
    return convolver;
  }

  convolverFromURL = (url) => {
    const convolver = this.audioCtx.createConvolver();
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        //im following https://mdn.github.io/webaudio-examples/voice-change-o-matic/ what is this for???
        const soundSource = this.audioCtx.createBufferSource();
        convolver.buffer = audioBuffer;
      });

    return convolver;

  }

  distortion = (amount) => {
    const distortion = this.audioCtx.createWaveShaper();
    distortion.oversample = "4x"
    distortion.curve = this.makeDistortionCurve(amount);
    return distortion;
  }

  muffleFilter = (value) => {
    const filter = this.audioCtx.createBiquadFilter();
    // Note: the Web Audio spec is moving from constants to strings.
    // filter.type = 'lowpass';
    filter.type = 'lowpass';
    filter.frequency.value = value;
    return filter;
  }

  gainNode = (volume) => {
    const ret = this.audioCtx.createGain();
    ret.gain.value = volume;
    return ret;
  }



  //pass in a filter or a convolution, something to be played between source and destination
  //filers can be changed over time, but convolutions are all or nothing.
  playURLWithOptionalStep = (url, loop, playBackRate, optionalStep) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.play(audioBuffer, loop, playBackRate, optionalStep)

      });
  }


  //https://stackoverflow.com/questions/9874167/how-can-i-play-audio-in-reverse-with-web-audio-api
  playURLReverse = (url, loop, playBackRate) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        Array.prototype.reverse.call(audioBuffer.getChannelData(0));
        // Array.prototype.reverse.call(audioBuffer.getChannelData(1));
        this.play(audioBuffer, loop, playBackRate)
      });
  }


  playURLScromble = (url, loop, playBackRate) => {
    window.fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        //this sure won't have weird consequences!

        const tmp = new SeededRandom(13).shuffle(audioBuffer.getChannelData(0));
        this.play(audioBuffer, loop, playBackRate)

      });
  }


  setBalanceBetweenDryAndWet = (dryValue) => {
    dryValue = Math.max(0, dryValue)
    if (this.dryGainNode) {
      this.dryGainNode.gain.value = dryValue;
    }

    if (this.wetGainNode) {
      this.wetGainNode.gain.value = 1 - dryValue;
    }
  }

  setPlayBackRate = (rate) => {
    if (this.sourceNode) {
      this.sourceNode.playbackRate.value = rate;
    }
  }

  //other nodes won't get an onended event but still should be murdered
  //callback is somethign i want to trigger on sound end
  wireUpDisconnectOnEnd = (node, otherNodes, callback) => {
    node.onended = () => {
      callback && callback();
      setTimeout(() => {
        node.disconnect();
        for(let n of otherNodes){
          if(n.buffer){
            n.buffer = null; //if a reference to a buffer that is still used remains, the node won't clean itself up. this is a problem for convolver nodes
            /*
            so we give it a fake, empty calorie buffer instead.

            from maccus: 
            That fits the candy metaphor.
            Since the Scarecrow can't eat the candy inside the maze. It's been slowly starving.
            */
          }
          n.disconnect();
        }
      }, 1000); //https://stackoverflow.com/questions/53241345/web-audio-api-memory-leak apparently i need to wait
    }
  }


  //trying to debug memory leak
  simplePlay = (audioBuffer, loop, playbackRate=1)=>{
    const source = this.audioCtx.createBufferSource();
    if (playbackRate) {
      source.playbackRate.value = playbackRate;
    }
    this.sourceNode = source;
    source.loop = loop;
    source.buffer = audioBuffer;
    source.connect(this.audioCtx.destination);
    this.wireUpDisconnectOnEnd(source,[]);

    source.start();
    return source;
  }

  //as simple as i can get it to debug convolver memory leaks
  playSafeMode  =(audioBuffer, loop, playbackRate, convolver, offset)=>{
    const source = this.audioCtx.createBufferSource();
    if (playbackRate) {
      source.playbackRate.value = playbackRate;
    }

    this.sourceNode = source;
    source.loop = loop;
    source.buffer = audioBuffer;
    if(convolver){
      source.connect(convolver);
      convolver.connect(this.audioCtx.destination);
    }else{
      source.connect(this.audioCtx.destination);
    }

    source.start(this.audioCtx.currentTime, offset);
    return source;

  }

  //returns an array of gain nodes you can control
  playDirectlyFromSource =(source, loop, playbackRate = 1, optionalSteps, offset = 0,callback)=> {
    if (playbackRate) {
      source.playbackRate.value = playbackRate;
    }
    this.sourceNode = source;
    this.gainNodes = [];
    source.loop = loop;
    source.buffer = audioBuffer;

    this.wetGainNode = this.audioCtx.createGain();
    this.dryGainNode = this.audioCtx.createGain();

    source.connect(this.dryGainNode);
    if (optionalSteps) {
      //filter is in between source and destination
      let lastStep = source;
      for (let step of optionalSteps) {
        lastStep.connect(step);
        lastStep = step;
      }
      lastStep.connect(this.wetGainNode);
      this.wetGainNode.connect(this.audioCtx.destination);
    }


    this.dryGainNode.connect(this.audioCtx.destination);
    this.setBalanceBetweenDryAndWet(0); //entirely modified by default
    this.wireUpDisconnectOnEnd(source,[...optionalSteps, this.wetGainNode, this.dryGainNode],callback);
    source.start(this.audioCtx.currentTime, offset);
    return source;//whoever called this is in charge of tearing it down.
  }

  //returns an array of gain nodes you can control
  play =(audioBuffer, loop, playbackRate = 1, optionalSteps, offset = 0,callback)=> {
    const source = this.audioCtx.createBufferSource();
    if (playbackRate) {
      source.playbackRate.value = playbackRate;
    }
    this.sourceNode = source;
    this.gainNodes = [];
    source.loop = loop;
    source.buffer = audioBuffer;

    this.wetGainNode = this.audioCtx.createGain();
    this.dryGainNode = this.audioCtx.createGain();

    source.connect(this.dryGainNode);
    if (optionalSteps) {
      //filter is in between source and destination
      let lastStep = source;
      for (let step of optionalSteps) {
        lastStep.connect(step);
        lastStep = step;
      }
      lastStep.connect(this.wetGainNode);
      this.wetGainNode.connect(this.audioCtx.destination);
    }


    this.dryGainNode.connect(this.audioCtx.destination);
    this.setBalanceBetweenDryAndWet(0); //entirely modified by default
    this.wireUpDisconnectOnEnd(source,[...optionalSteps, this.wetGainNode, this.dryGainNode],callback);
    source.start(this.audioCtx.currentTime, offset);
    return source;//whoever called this is in charge of tearing it down.
  }

}