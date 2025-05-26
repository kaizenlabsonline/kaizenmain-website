import { jsPDF } from 'jspdf';

const A4_WIDTH_PT = 595.28; // A4 portrait width in points
const A4_HEIGHT_PT = 841.89; // A4 portrait height in points
const PAGE_MARGIN_PT = 30; // Margin in points

// Helper function to load an image and get its dimensions
const getImageDimensions = (imageDataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (err) => {
      console.error("Failed to load image for dimension check:", err);
      reject(new Error(`Failed to load image: ${imageDataUrl.substring(0, 50)}...`));
    };
    img.src = imageDataUrl;
  });
};

export const generatePdfFromImages = async (base64Images) => {
  if (base64Images.length === 0) {
    throw new Error("No images provided to generate PDF.");
  }

  let initialPdfOrientation = 'p'; // Default to portrait
  if (base64Images.length > 0) {
    try {
      // Determine PDF's initial orientation based on the first image
      const firstImageDims = await getImageDimensions(base64Images[0]);
      if (firstImageDims.width > firstImageDims.height) {
        initialPdfOrientation = 'l'; // Landscape if wider
      }
    } catch (e) {
      console.warn("Could not get dimensions for the first image to set initial PDF orientation. Defaulting to portrait.", e);
      // initialPdfOrientation remains 'p'
    }
  }

  const pdf = new jsPDF({
    orientation: initialPdfOrientation,
    unit: 'pt',
    format: 'a4',
  });

  for (let i = 0; i < base64Images.length; i++) {
    const imageDataUrl = base64Images[i];

    try {
      const { width: imgOriginalWidth, height: imgOriginalHeight } = await getImageDimensions(imageDataUrl);

      if (imgOriginalWidth === 0 || imgOriginalHeight === 0) {
        console.warn(`Image ${i + 1} has zero dimensions, skipping.`);
        if (i > 0) {
          // Add a new page for the skip message.
          // Attempt to use the orientation of the current (last added) page.
          const lastPageOrientation = pdf.internal.pageSize.getWidth() > pdf.internal.pageSize.getHeight() ? 'l' : 'p';
          pdf.addPage('a4', lastPageOrientation);
        }
        // On the current page (either first or newly added):
        pdf.text(`Skipped: Image ${i + 1} (zero dimensions)`, PAGE_MARGIN_PT, PAGE_MARGIN_PT);
        continue;
      }

      const imageIsLandscape = imgOriginalWidth > imgOriginalHeight;
      const targetPageOrientationForImage = imageIsLandscape ? 'l' : 'p';

      if (i > 0) {
        // For subsequent images, add a new page with the determined orientation
        pdf.addPage('a4', targetPageOrientationForImage);
      } else {
        // This is the first image (i=0). The PDF's orientation was already set by the constructor
        // based on this first image (if dimensions were readable).
        // If `initialPdfOrientation` (used in constructor) doesn't match `targetPageOrientationForImage`
        // (e.g., first image dim check failed, defaulted to 'p', but image is actually 'l'),
        // the image will be placed on a page with `initialPdfOrientation`. This is an accepted edge case for robustness.
      }

      // Get current page dimensions (jsPDF updates this after addPage or for the initial page)
      const currentPageWidthPt = pdf.internal.pageSize.getWidth();
      const currentPageHeightPt = pdf.internal.pageSize.getHeight();

      const availableWidthOnPage = currentPageWidthPt - 2 * PAGE_MARGIN_PT;
      const availableHeightOnPage = currentPageHeightPt - 2 * PAGE_MARGIN_PT;

      // Calculate scaling factor to fit image within available space while maintaining aspect ratio
      // And crucially, Math.min(..., 1) prevents upscaling images beyond their original resolution.
      const scaleFactor = Math.min(
        availableWidthOnPage / imgOriginalWidth,
        availableHeightOnPage / imgOriginalHeight,
        1 // Do not scale up images smaller than the available space
      );

      const scaledWidth = imgOriginalWidth * scaleFactor;
      const scaledHeight = imgOriginalHeight * scaleFactor;

      // Center the image on the page
      const xPosition = PAGE_MARGIN_PT + (availableWidthOnPage - scaledWidth) / 2;
      const yPosition = PAGE_MARGIN_PT + (availableHeightOnPage - scaledHeight) / 2;
      
      pdf.addImage(imageDataUrl, 'JPEG', xPosition, yPosition, scaledWidth, scaledHeight);

    } catch (error) { // Catches errors from getImageDimensions or other operations
      console.error(`Error processing image ${i + 1} for PDF:`, error);
      if (i > 0) {
        // Add a new page for the error message.
        const lastPageOrientation = pdf.internal.pageSize.getWidth() > pdf.internal.pageSize.getHeight() ? 'l' : 'p';
        pdf.addPage('a4', lastPageOrientation);
      }
      // On the current page (either first or newly added):
      pdf.text(`Error displaying image ${i + 1}. See console for details.`, PAGE_MARGIN_PT, PAGE_MARGIN_PT);
    }
  }

  try {
    const pdfBlobUrl = pdf.output('bloburl');
    // jsPDF.output('bloburl') returns a URL (string), ensure correct typing if needed by environment.
    return pdfBlobUrl;
  } catch (e) {
    console.error("Error outputting PDF to bloburl:", e);
    throw new Error("Failed to finalize PDF document.");
  }
};
