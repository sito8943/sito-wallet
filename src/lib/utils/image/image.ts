import { RECEIPT_PHOTO_MAX_SIDE, RECEIPT_PHOTO_QUALITY } from "./constants";

/** Size that fits `maxSide` keeping the aspect ratio; never upscales. */
export const getScaledSize = (
  width: number,
  height: number,
  maxSide: number,
): { width: number; height: number } => {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
};

/**
 * Turns a camera photo into a JPEG ready for OCR: applies the EXIF rotation
 * (the server can't see it) and shrinks it, so a 5 MB photo uploads as a few
 * hundred KB.
 */
export async function prepareReceiptPhoto(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  try {
    const { width, height } = getScaledSize(
      bitmap.width,
      bitmap.height,
      RECEIPT_PHOTO_MAX_SIDE,
    );
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", RECEIPT_PHOTO_QUALITY),
    );
    if (!blob) throw new Error("receipt.invalidImage");

    return new File([blob], "receipt.jpg", { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}
