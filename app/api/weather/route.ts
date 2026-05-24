import { NextRequest, NextResponse } from "next/server";
import { geocodeLocation } from "@/lib/geocode";
import { fetchWeatherData } from "@/lib/weather";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  if (!location || !location.trim()) {
    return NextResponse.json(
      { error: "Location parameter is required." },
      { status: 400 }
    );
  }

  try {
    const geoResult = await geocodeLocation(location.trim());

    if (!geoResult) {
      return NextResponse.json(
        {
          error: `Could not find location: "${location}". Try a city name, coordinates (lat,lon), or postal code.`,
        },
        { status: 404 }
      );
    }

    const weatherData = await fetchWeatherData(geoResult);

    return NextResponse.json(weatherData, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    console.error("[Weather API]", message);
    return NextResponse.json(
      { error: `Failed to fetch weather data: ${message}` },
      { status: 500 }
    );
  }
}
