import { BlobData } from '../types';

// Convert Float32Array (browser audio) to Int16Array (Gemini requirement) and then to Base64
// Convert Float32Array (browser audio) to Int16Array (Gemini requirement) and then to Base64
export function createBlob(data: Float32Array, originalSampleRate: number): BlobData {
  const targetSampleRate = 16000;
  
  // Resampling simple (Downsampling)
  const ratio = originalSampleRate / targetSampleRate;
  const newLength = Math.round(data.length / ratio);
  const resampledData = new Float32Array(newLength);
  
  for (let i = 0; i < newLength; i++) {
    resampledData[i] = data[Math.round(i * ratio)];
  }

  const l = resampledData.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    const clamped = Math.max(-1, Math.min(1, resampledData[i]));
    int16[i] = clamped * 32767; // Usar 32767 para evitar overflow
  }
  
  const uint8 = new Uint8Array(int16.buffer);
  return {
    data: encode(uint8),
    mimeType: `audio/pcm;rate=${targetSampleRate}`,
  };
}

// Manual Base64 encoding (btoa wrapper for Uint8Array)
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  const CHUNK_SIZE = 0x8000; // Process in chunks to avoid stack overflow
  
  for (let i = 0; i < len; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

// Manual Base64 decoding
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decode Raw PCM from Gemini to AudioBuffer for playback
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  // Fix: Ensure we are operating on an even byte boundary for Int16
  const byteLength = data.byteLength;
  const alignedLength = byteLength - (byteLength % 2);
  const alignedData = data.subarray(0, alignedLength);

  const dataInt16 = new Int16Array(alignedData.buffer, alignedData.byteOffset, alignedData.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  
  // Create an AudioBuffer with the Sample Rate of the SOURCE content (Gemini uses 24000)
  // The AudioContext might be running at 48000, but it will handle the resampling.
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}