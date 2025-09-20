const MAX_SIZE = 1080;

async function compress(file: File, cb: (file: Blob | null) => void) {
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

    if (file.type !== "image/webp") canvas.toBlob(cb, file.type, 0.7);
    else {
      const binaryString = atob(canvas.toDataURL(file.type, 0.7).split(",")[1]);
      cb(new Blob([binaryString], {type: file.type}));
    }
  };
}
