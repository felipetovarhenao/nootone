export default function getTempoTags(tempo: number): string[] {
  const tags: string[] = [`${tempo}bpm`];
  if (tempo < 60) {
    tags.push("slow");
  } else if (tempo > 130) {
    tags.push("very fast");
  } else if (tempo > 100) {
    tags.push("fast");
  }
  return tags;
}
