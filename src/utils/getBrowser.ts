export default function getBrowser(): string {
  // Check for Internet Explorer
  if (navigator.userAgent.indexOf("MSIE") !== -1) {
    return "Internet Explorer";
  }

  // Check for Microsoft Edge (legacy version)
  if (navigator.userAgent.indexOf("Edge") !== -1) {
    return "Microsoft Edge";
  }

  // Check for Chrome
  if (navigator.userAgent.indexOf("Chrome") !== -1) {
    return "Google Chrome";
  }

  // Check for Firefox
  if (navigator.userAgent.indexOf("Firefox") !== -1) {
    return "Mozilla Firefox";
  }

  // Check for Safari
  if (navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf("Chrome") === -1) {
    return "Apple Safari";
  }

  // Check for Opera
  if (navigator.userAgent.indexOf("Opera") !== -1 || navigator.userAgent.indexOf("OPR") !== -1) {
    return "Opera";
  }

  // Default to unknown
  return "Unknown";
}
