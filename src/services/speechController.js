const SPEECH_EVENTS = {
  change: "speech:change",
  error: "speech:error"
};

class SpeechController extends EventTarget {
  constructor() {
    super();
    this.recognition = null;
    this.state = {
      active: false,
      targetIndex: null
    };
  }

  getState() {
    return this.state;
  }

  emitChange() {
    this.dispatchEvent(
      new CustomEvent(SPEECH_EVENTS.change, {
        detail: this.getState()
      })
    );
  }

  emitError(message) {
    this.dispatchEvent(
      new CustomEvent(SPEECH_EVENTS.error, {
        detail: { message }
      })
    );
  }

  getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }

  start(targetIndex, onTranscript) {
    const SpeechRecognition = this.getSpeechRecognition();

    if (!SpeechRecognition) {
      this.emitError("Aquest navegador no suporta Web Speech API.");
      return;
    }

    this.stop(false);

    const recognition = new SpeechRecognition();
    recognition.lang = "ca-ES";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        transcript += event.results[index][0].transcript;
      }

      onTranscript(transcript);
    };

    recognition.onerror = () => {
      this.emitError("S'ha produït un error durant el dictat.");
      this.stop();
    };

    recognition.onend = () => {
      this.recognition = null;
      this.state = {
        active: false,
        targetIndex: null
      };
      this.emitChange();
    };

    this.recognition = recognition;
    this.state = {
      active: true,
      targetIndex
    };

    recognition.start();
    this.emitChange();
  }

  stop(emit = true) {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }

    this.state = {
      active: false,
      targetIndex: null
    };

    if (emit) {
      this.emitChange();
    }
  }

  toggle(targetIndex, onTranscript) {
    if (this.state.active && this.state.targetIndex === targetIndex) {
      this.stop();
      return;
    }

    this.start(targetIndex, onTranscript);
  }
}

const speechController = new SpeechController();

export { SPEECH_EVENTS, speechController };
