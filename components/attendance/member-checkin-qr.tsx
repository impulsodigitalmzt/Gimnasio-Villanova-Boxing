'use client';

import { QRCodeSVG } from 'qrcode.react';
import { encodeCheckInQr } from '@/lib/attendance/qr-payload';

export function MemberCheckInQr({
  memberId,
  email,
  size = 180,
  className = '',
  showId = true,
}: {
  memberId: string;
  email: string;
  size?: number;
  className?: string;
  showId?: boolean;
}) {
  const value = encodeCheckInQr({ memberId, email });

  return (
    <div
      className={`inline-flex flex-col items-center rounded-2xl bg-white p-3 shadow-sm ${className}`}
    >
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        includeMargin={false}
        bgColor="#ffffff"
        fgColor="#0a0a0a"
      />
      {showId ? (
        <p className="mt-2 max-w-[180px] break-all text-center font-mono text-[9px] text-zinc-500">
          {memberId}
        </p>
      ) : null}
    </div>
  );
}
