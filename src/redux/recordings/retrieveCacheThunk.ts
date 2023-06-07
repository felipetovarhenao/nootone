import { createAsyncThunk } from "@reduxjs/toolkit";
import { delMany, entries, setMany } from "idb-keyval";
import { CachedRecording, Recording } from "../../types/audio";

const retrieveCache = createAsyncThunk("recordings/retrieveCache", async () => {
  return entries().then((entries) => {
    const recs: Recording[] = [];
    if (entries.length === 0) {
      return recs;
    }
    const updatedEntries: [string, CachedRecording][] = [];
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      URL.revokeObjectURL(key as string);
      const url = URL.createObjectURL(value.blob);
      recs.push({
        url: url,
        ...value.metadata,
      });
      updatedEntries.push([
        url,
        {
          blob: value.blob as Blob,
          metadata: { ...value.metadata },
        },
      ]);
    }
    delMany(entries.map((e) => e[0]));
    setMany(updatedEntries);
    return recs;
  });
});

export default retrieveCache;
