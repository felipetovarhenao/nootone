export default function camelToSpaces(str: string) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += str[i] === str[i].toUpperCase() ? ` ${str[i]}` : str[i];
  }
  return result.toLowerCase();
}
