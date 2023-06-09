import { uniqueNamesGenerator, Config, adjectives, colors } from "unique-names-generator";

const sounds: string[] = [
  "tune",
  "idea",
  "sound",
  "melody",
  "beat",
  "motif",
  "rhythm",
  "improv",
  "scale",
  "lick",
  "song",
  "music",
  "riff",
  "theme",
  "line",
  "earworm",
];
const emoji: string[] = [
  "🎹",
  "👻",
  "🏆",
  "☀️",
  "🎉",
  "🎙",
  "👌🏽",
  "👀",
  "👽",
  "👾",
  "😱",
  "😎",
  "😏",
  "🔥",
  "🌈",
  "🎤",
  "🎧",
  "🎼",
  "🎹",
  "🥁",
  "🪘",
  "🎷",
  "🎺",
  "🪗",
  "🎸",
  "🪕",
  "🎻",
];

const customConfig: Config = {
  dictionaries: [adjectives, colors, sounds, emoji],
  separator: " ",
  length: 4,
};

export default function createUniqueTitle() {
  return uniqueNamesGenerator(customConfig);
}
