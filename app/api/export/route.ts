import { NextRequest, NextResponse } from "next/server";
import type { WeatherRecord } from "@/lib/types";
import { decodeWeatherCode } from "@/lib/weather";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { records, format } = body as {
      records: WeatherRecord[];
      format: string;
    };

    if (!records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: "records array is required." },
        { status: 400 }
      );
    }

    if (format === "json") {
      return new NextResponse(JSON.stringify(records, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": 'attachment; filename="weather_records.json"',
        },
      });
    }

    if (format === "csv") {
      const headers = [
        "ID",
        "Location Input",
        "Resolved Name",
        "Latitude",
        "Longitude",
        "Start Date",
        "End Date",
        "Temperature",
        "Condition",
        "Notes",
        "Created At",
      ];

      const escape = (v: unknown) => {
        const s = v === null || v === undefined ? "" : String(v);
        return s.includes(",") || s.includes('"')
          ? `"${s.replace(/"/g, '""')}"`
          : s;
      };

      const rows = records.map((r) => {
        const cw = r.weatherJson?.current;
        return [
          r.id,
          r.locationInput,
          r.resolvedName,
          r.latitude,
          r.longitude,
          r.startDate,
          r.endDate,
          cw ? `${cw.temperature}°C` : "",
          cw ? decodeWeatherCode(cw.weatherCode, cw.isDay).label : "",
          r.notes,
          r.createdAt,
        ]
          .map(escape)
          .join(",");
      });

      const csv = [headers.map(escape).join(","), ...rows].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition":
            'attachment; filename="weather_records.csv"',
        },
      });
    }

    return NextResponse.json(
      { error: `Unsupported format: ${format}` },
      { status: 400 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
