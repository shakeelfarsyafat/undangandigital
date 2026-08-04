export function createWhatsAppShareUrl({
  phone,
  guestName,
  groomName,
  brideName,
  invitationUrl,
}: {
  phone?: string | null;
  guestName: string;
  groomName: string;
  brideName: string;
  invitationUrl: string;
}): string {
  const message = `Assalamu'alaikum Wr. Wb.

Kepada Yth.
*${guestName}*

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.

*${groomName} & ${brideName}*

Informasi lengkap mengenai waktu dan lokasi acara dapat dilihat melalui undangan berikut:

${invitationUrl}

Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`;

  const encodedMessage = encodeURIComponent(message);
  
  if (phone) {
    // Format phone number (remove space, dash, replace leading 0 with 62)
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  return `https://api.whatsapp.com/send?text=${encodedMessage}`;
}
