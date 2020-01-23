export function parseBase64Json(data: string) {
  return JSON.parse(Buffer.from(data || '', 'base64').toString() || null);
}
