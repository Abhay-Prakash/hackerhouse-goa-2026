import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ isValid: false, reason: "No image provided." }, { status: 400 });
    }

    // ----------------------------------------------------------------------
    // TODO: Connect this to OpenAI Vision API or Anthropic Claude 3.5 Sonnet
    // ----------------------------------------------------------------------
    // Example Payload for OpenAI:
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4o",
    //     response_format: { type: "json_object" },
    //     messages: [
    //       {
    //         role: "system",
    //         content: `You are validating an uploaded portrait for an event Builder ID Card.
    //           Determine whether the image is a suitable real photographic portrait of exactly one human person.
    //           Accept: real photographs, selfies, portrait photographs, landscape photographs containing one person.
    //           Reject: images with no human, animals, objects, cartoons, drawings, illustrations, obvious avatars, screenshots, photographs of another screen, images containing multiple clearly visible people, unusable/corrupted images.
    //           Do NOT identify the person. Do NOT determine whether the person is famous.
    //           Return ONLY structured JSON: { "isValid": boolean, "reason": string, "faceCount": number, "isPhotographic": boolean, "isScreenshot": boolean, "isIllustration": boolean }`
    //       },
    //       {
    //         role: "user",
    //         content: [
    //           { type: "text", text: "Validate this image." },
    //           { type: "image_url", image_url: { url: image } }
    //         ]
    //       }
    //     ]
    //   })
    // });
    // const data = await response.json();
    // const result = JSON.parse(data.choices[0].message.content);
    // return NextResponse.json(result);
    // ----------------------------------------------------------------------

    // FOR HACKATHON STUB: Since no API key is provided yet, return a mock success
    // to prevent blocking if the adapter is set to 'vision' prematurely.
    return NextResponse.json({
      isValid: true,
      reason: "Vision API stub: Portrait verified successfully.",
      faceCount: 1,
      isPhotographic: true,
      isScreenshot: false,
      isIllustration: false
    });

  } catch (error) {
    console.error("API /verify-image error:", error);
    return NextResponse.json(
      { isValid: false, reason: "Internal server error during verification." },
      { status: 500 }
    );
  }
}
