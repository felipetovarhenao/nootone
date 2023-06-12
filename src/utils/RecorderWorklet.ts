import microphoneProcessor from "./microphone-processor.ts?url";

export default async function initializeAudio() {
  const audioContext = new AudioContext();
  await audioContext.audioWorklet.addModule(microphoneProcessor);
  const workletNode = new AudioWorkletNode(audioContext, "microphone-processor");
  // Start audio processing
  workletNode.port.onmessage = (event) => {
    if (event.data === "ready") {
      // The AudioWorkletNode is ready for processing
      // Start playing audio here
      console.log(event.data);
    }
  };
  workletNode.connect(audioContext.destination);
  console.log(workletNode);
}
