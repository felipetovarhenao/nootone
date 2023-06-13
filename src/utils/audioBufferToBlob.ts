/**
 * Converts an AudioBuffer to a Blob object representing a WAV file.
 *
 * @param audioBuffer - The AudioBuffer to convert.
 * @param sampleRate - The sample rate of the audio.
 * @param normalize - (Optional) Flag indicating whether to normalize the audio. Defaults to true.
 * @returns A Blob object representing the WAV file.
 */
export default function audioBufferToBlob(audioBuffer: AudioBuffer, sampleRate: number, normalize: boolean = true) {
  // Float32Array samples
  const isMono = audioBuffer.numberOfChannels === 1;
  const [left, right] = [audioBuffer.getChannelData(0), isMono ? new Float32Array([]) : audioBuffer.getChannelData(1)];

  let normValue = -1;

  // interleaved
  const interleaved = new Float32Array(left.length + right.length);

  // Combine left and right channels into an interleaved array
  for (let src = 0, dst = 0; src < left.length; src++, dst += isMono ? 1 : 2) {
    const values = [normValue, Math.abs(left[src])];

    interleaved[dst] = left[src];
    if (!isMono) {
      interleaved[dst + 1] = right[src];
      values.push(Math.abs(right[src]));
    }
    normValue = Math.max(...values);
  }

  if (normalize) {
    normValue *= 1.414427157; // adjust to -3dB

    // Normalize the audio by dividing each sample by the maximum value
    for (let src = 0, dst = 0; src < left.length; src++, dst += isMono ? 1 : 2) {
      interleaved[dst] /= normValue;
      if (!isMono) {
        interleaved[dst + 1] /= normValue;
      }
    }
  }

  // Get WAV file bytes and audio params of your audio source
  const wavBytes = getWavBytes(interleaved.buffer, {
    isFloat: true, // floating point or 16-bit integer
    numChannels: isMono ? 1 : 2,
    sampleRate: sampleRate,
  });

  return new Blob([wavBytes], { type: "audio/wav" });
}

// Returns Uint8Array of WAV bytes
function getWavBytes(buffer: any, options: any) {
  const type = options.isFloat ? Float32Array : Uint16Array;
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

  const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }));
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

  // prepend header, then add pcmBytes
  wavBytes.set(headerBytes, 0);
  wavBytes.set(new Uint8Array(buffer), headerBytes.length);

  return wavBytes;
}

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options: any) {
  const numFrames = options.numFrames;
  const numChannels = options.numChannels || 2;
  const sampleRate = options.sampleRate || 44100;
  const bytesPerSample = options.isFloat ? 4 : 2;
  const format = options.isFloat ? 3 : 1;

  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44);
  const dv = new DataView(buffer);

  let p = 0;

  function writeString(s: any) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i));
    }
    p += s.length;
  }

  function writeUint32(d: any) {
    dv.setUint32(p, d, true);
    p += 4;
  }

  function writeUint16(d: any) {
    dv.setUint16(p, d, true);
    p += 2;
  }

  writeString("RIFF"); // ChunkID
  writeUint32(dataSize + 36); // ChunkSize
  writeString("WAVE"); // Format
  writeString("fmt "); // Subchunk1ID
  writeUint32(16); // Subchunk1Size
  writeUint16(format); // AudioFormat https://i.stack.imgur.com/BuSmb.png
  writeUint16(numChannels); // NumChannels
  writeUint32(sampleRate); // SampleRate
  writeUint32(byteRate); // ByteRate
  writeUint16(blockAlign); // BlockAlign
  writeUint16(bytesPerSample * 8); // BitsPerSample
  writeString("data"); // Subchunk2ID
  writeUint32(dataSize); // Subchunk2Size

  return new Uint8Array(buffer);
}
