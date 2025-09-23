const MAX_SIZE = 1080;

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function replaceFileExtension(filename: string) {
  const extension = isSafari() ? "jpeg" : "webp";
  const parts = filename.split(".");
  if (parts.length === 1) return `${filename}.${extension}`;
  parts[parts.length - 1] = extension;
  return parts.join(".");
}

export default async function compressImage(file: File): Promise<File> {
  const fileType = isSafari() ? "image/jpeg" : "image/webp"; // Safari does not support WebP

  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = window.URL || window.webkitURL;
    image.src = url.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      let width = image.width;
      let height = image.height;

      if (width > height && width > MAX_SIZE) {
        height = Math.round(height * (MAX_SIZE / width));
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width = Math.round(width * (MAX_SIZE / height));
        height = MAX_SIZE;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject("Compression failed");
            return;
          }
          const compressedFile = new File(
            [blob],
            replaceFileExtension(file.name),
            {
              type: fileType,
            },
          );
          resolve(compressedFile);
        },
        fileType,
        0.7,
      );
    };
  });
}
