import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { sanitizeEventMetadata, TrackEventSchema } from "@/lib/analytics/schemas";
import { getPrisma, hasDatabaseUrl } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = TrackEventSchema.parse(body);

    if (!hasDatabaseUrl()) {
      return NextResponse.json({ ok: true, mode: "demo" });
    }

    const prisma = getPrisma();
    await prisma.analyticsEvent.create({
      data: {
        restaurantId: data.restaurantId,
        eventType: data.eventType,
        locale: data.locale,
        source: data.source,
        tableCode: data.tableCode,
        menuItemId: data.menuItemId,
        sessionIdHash: data.sessionIdHash,
        metadata: sanitizeEventMetadata(
          data.eventType,
          data.metadata,
        ) as Prisma.InputJsonObject,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
