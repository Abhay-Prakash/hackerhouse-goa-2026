import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export interface PortraitVerificationResult {
  isValid: boolean;
  reason: string;
  faceCount?: number;
  isPhotographic?: boolean;
  isScreenshot?: boolean;
  isIllustration?: boolean;
}

export type PortraitAdapter = (imageBase64: string) => Promise<PortraitVerificationResult>;

let faceDetectorInstance: FaceDetector | null = null;

async function getFaceDetector() {
  if (faceDetectorInstance) return faceDetectorInstance;
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceDetectorInstance = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
      delegate: "GPU"
    },
    runningMode: "IMAGE"
  });
  return faceDetectorInstance;
}

/**
 * MOCK ADAPTER
 * Simulates a verification process for development and hackathon demonstrations.
 */
export const mockPortraitAdapter: PortraitAdapter = async (imageBase64) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Read from environment to allow testing failure states
  const mockResult = process.env.NEXT_PUBLIC_PORTRAIT_MOCK_RESULT || 'valid';
  
  if (mockResult === 'invalid') {
    return {
      isValid: false,
      reason: "No person detected. Try uploading a photo of yourself.",
      faceCount: 0
    };
  }
  
  if (mockResult === 'multiple') {
    return {
      isValid: false,
      reason: "More than one person detected. Please upload a photo containing only you.",
      faceCount: 2
    };
  }

  // Default valid response
  return {
    isValid: true,
    reason: "Portrait verified successfully.",
    faceCount: 1,
    isPhotographic: true,
    isScreenshot: false,
    isIllustration: false
  };
};

/**
 * VISION API ADAPTER
 * Calls the Next.js API route to perform server-side Vision AI analysis.
 */
export const visionPortraitAdapter: PortraitAdapter = async (imageBase64) => {
  try {
    const response = await fetch('/api/verify-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return data as PortraitVerificationResult;
  } catch (error) {
    console.error("Vision Verification Failed:", error);
    // Fallback: If vision API fails, don't hard-reject. 
    // In a full implementation, this might fallback to localFaceAdapter.
    // For now, we return a fallback success to favor usability.
    return {
      isValid: true,
      reason: "Verification bypassed due to server timeout. Proceeding...",
    };
  }
};

/**
 * LOCAL FACE ADAPTER (MediaPipe)
 * Runs purely in the browser to accurately count human faces.
 * Rejects 0 faces (objects, screenshots) and >1 face (group photos).
 */
export const localFaceAdapter: PortraitAdapter = async (imageBase64) => {
  try {
    const detector = await getFaceDetector();
    
    // Create an image element to pass to MediaPipe
    const img = new Image();
    img.src = imageBase64;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const detections = detector.detect(img);
    const faceCount = detections.detections.length;

    if (faceCount === 0) {
      return {
        isValid: false,
        reason: "No person detected. Please upload a clear photo of yourself.",
        faceCount: 0
      };
    }

    if (faceCount > 1) {
      return {
        isValid: false,
        reason: `Multiple people (${faceCount}) detected. Please choose a photo containing only you.`,
        faceCount
      };
    }

    return {
      isValid: true,
      reason: "Portrait verified successfully.",
      faceCount: 1
    };
  } catch (error) {
    console.error("Local Face Detection Error:", error);
    // If it fails to load the model (e.g. network issue), we fallback gracefully
    return {
      isValid: true,
      reason: "Verification bypassed due to initialization error.",
    };
  }
};

/**
 * MAIN VERIFICATION ENTRY POINT
 * Routes the verification request based on the configured environment mode.
 */
export const verifyPortrait = async (imageBase64: string): Promise<PortraitVerificationResult> => {
  // We now default to 'local' so the MediaPipe scanner actually catches group photos and non-human screenshots!
  const mode = process.env.NEXT_PUBLIC_PORTRAIT_VERIFICATION_MODE || 'local';

  switch (mode) {
    case 'vision':
      return await visionPortraitAdapter(imageBase64);
    case 'local':
      return await localFaceAdapter(imageBase64);
    case 'mock':
    default:
      return await mockPortraitAdapter(imageBase64);
  }
};
