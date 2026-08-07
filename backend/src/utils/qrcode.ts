import QRCode from 'qrcode';

export const generateQRCodeDataUrl = async (payload: object): Promise<string> => {
  try {
    const stringData = JSON.stringify(payload);
    return await QRCode.toDataURL(stringData, {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 6,
    });
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};
