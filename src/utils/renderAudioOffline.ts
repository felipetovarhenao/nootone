type RenderCallback = (audioContext: OfflineAudioContext) => void | Promise<void>;

export default async function renderAudioOffline(
  renderCallback: RenderCallback,
  samplingRate: number,
  arraySize: number,
  numChannels: number = 2
): Promise<AudioBuffer> {
  const audioContext = new OfflineAudioContext(numChannels, arraySize, samplingRate);
  await renderCallback(audioContext);
  return audioContext.startRendering();
}
