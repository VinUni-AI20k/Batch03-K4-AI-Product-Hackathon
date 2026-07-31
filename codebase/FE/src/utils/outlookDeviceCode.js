// outlook-local-mcp's device-code message reads e.g. "To sign in, use a web
// browser to open the page https://microsoft.com/devicelogin and enter the
// code ABCD1234 to authenticate." — pull out the URL + code so the UI can
// open the tab itself and show a copyable code instead of raw prose.
export function parseOutlookDeviceCode(message) {
  const match = /open the page (\S+) and enter the code (\S+) to authenticate/.exec(message ?? "");
  return match ? { url: match[1], code: match[2] } : null;
}
