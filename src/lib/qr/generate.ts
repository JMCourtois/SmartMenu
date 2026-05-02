import QRCode from "qrcode";

export async function generateQrDataUrl(url: string) {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 720,
    color: {
      dark: "#111827",
      light: "#ffffff",
    },
  });
}
