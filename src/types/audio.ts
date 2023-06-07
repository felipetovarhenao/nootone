export type RecordingMetadata = {
  name: string;
  date: string;
  duration: number;
  tags: string[];
  features?: any;
};

export type Recording = RecordingMetadata & {
  url: string;
};

export type CachedRecording = {
  blob: Blob;
  metadata: RecordingMetadata;
};
