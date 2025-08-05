import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("query") || ""
    if (!q) {
        return NextResponse.json({ results: [] })
    }

    const KEY = process.env.OPENCAGE_KEY
    const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(q)}&key=${KEY}&limit=5`
    )
    const payload = await res.json()
    const results = payload.results.map((r: any) => ({
        label: r.formatted,
        lat: r.geometry.lat,
        lng: r.geometry.lng,
    }))
    return NextResponse.json({ results })
}
