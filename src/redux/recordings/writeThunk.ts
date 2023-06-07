import { createAsyncThunk } from "@reduxjs/toolkit";
import { set } from "idb-keyval";
import { Recording } from "../../types/audio";

const write = createAsyncThunk("recordings/write", async (recording: Recording): Promise<Recording | string> => {
  const { url, ...metadata } = recording;
  const blob = await fetch(url).then((r) => r.blob());
  return new Promise<Recording | string>((resolve, reject) => {
    set(url, { blob: blob, metadata: metadata })
      .then(() => resolve(recording))
      .catch(reject);
  });
});

export default write;
