import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { MAX_UPLOAD_BYTES } from "@/lib/batchUtils";

function mockCidFromBuffer(buf: Buffer): string {
  const hash = createHash("sha256").update(buf).digest("hex").slice(0, 32);
  return `bafy-local-${hash}`;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File exceeds 5 MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const jwt = process.env.PINATA_JWT;

    if (!jwt) {
      const cid = mockCidFromBuffer(buffer);
      return NextResponse.json({ cid, mock: true });
    }

    const pinataForm = new FormData();
    pinataForm.append("file", new Blob([buffer], { type: file.type }), (file as File).name || "upload");

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: pinataForm,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Pinata error: ${text}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ cid: data.IpfsHash as string });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message || e) }, { status: 500 });
  }
}
