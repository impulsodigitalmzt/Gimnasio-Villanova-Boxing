/**
 * Payload del QR de asistencia.
 * Formato estable para demo y futura API/BD.
 *
 * Texto: VNB1|{memberId}|{email}
 * También acepta JSON: {"v":1,"t":"vnb_checkin","id":"...","e":"..."}
 */

export const QR_VERSION = 1;
export const QR_TYPE = 'vnb_checkin';

export type CheckInQrPayload = {
  v: number;
  t: typeof QR_TYPE;
  id: string;
  e: string;
};

export function encodeCheckInQr(input: { memberId: string; email: string }): string {
  const id = input.memberId.trim();
  const email = input.email.trim().toLowerCase();
  return `VNB${QR_VERSION}|${id}|${email}`;
}

export function decodeCheckInQr(raw: string): CheckInQrPayload | null {
  const text = raw.trim();
  if (!text) return null;

  if (text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text) as Partial<CheckInQrPayload>;
      if (parsed.t === QR_TYPE && parsed.id && parsed.e) {
        return {
          v: Number(parsed.v) || QR_VERSION,
          t: QR_TYPE,
          id: String(parsed.id).trim(),
          e: String(parsed.e).trim().toLowerCase(),
        };
      }
    } catch {
      return null;
    }
  }

  const parts = text.split('|');
  if (parts.length >= 3 && /^VNB\d+$/i.test(parts[0])) {
    return {
      v: Number(parts[0].replace(/VNB/i, '')) || QR_VERSION,
      t: QR_TYPE,
      id: parts[1].trim(),
      e: parts.slice(2).join('|').trim().toLowerCase(),
    };
  }

  return null;
}
