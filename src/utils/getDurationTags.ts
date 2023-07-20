export default function getDurationTags(duration: number): string[] {
  const tags: string[] = [];
  if (duration < 10) {
    tags.push("short");
  } else if (duration > 40) {
    tags.push("long");
  }
  return tags;
}
