export type Beat = {
  id: string;
  name: string;
  genre: string;
  bpm: string;
  key: string;
  gradient: string;
  mp3Url: string;
  wavUrl: string;
  stemsUrl: string;
  previewUrl: string;
  exclusiveAvailable?: boolean;
};

export const STATIC_BEATS: Beat[] = [
  {
    id: "nightwork-001",
    name: "NIGHTWORK 001",
    genre: "drill",
    bpm: "140",
    key: "C MIN",
    gradient: "linear-gradient(135deg,#1a1008,#2d1a05)",
    mp3Url: "https://payhip.com/placidchills",
    wavUrl: "https://payhip.com/placidchills",
    stemsUrl: "https://payhip.com/placidchills",
    previewUrl: "",
  },
  {
    id: "nightwork-002",
    name: "NIGHTWORK 002",
    genre: "trap",
    bpm: "145",
    key: "D MIN",
    gradient: "linear-gradient(135deg,#0d1018,#1a2030)",
    mp3Url: "https://payhip.com/placidchills",
    wavUrl: "https://payhip.com/placidchills",
    stemsUrl: "https://payhip.com/placidchills",
    previewUrl: "",
  },
  {
    id: "nightwork-003",
    name: "NIGHTWORK 003",
    genre: "boom-bap",
    bpm: "90",
    key: "A MIN",
    gradient: "linear-gradient(135deg,#120d08,#251a0f)",
    mp3Url: "https://payhip.com/placidchills",
    wavUrl: "https://payhip.com/placidchills",
    stemsUrl: "https://payhip.com/placidchills",
    previewUrl: "",
  },
  {
    id: "nightwork-004",
    name: "NIGHTWORK 004",
    genre: "drill",
    bpm: "138",
    key: "F MIN",
    gradient: "linear-gradient(135deg,#150a0a,#2a1010)",
    mp3Url: "https://payhip.com/placidchills",
    wavUrl: "https://payhip.com/placidchills",
    stemsUrl: "https://payhip.com/placidchills",
    previewUrl: "",
  },
  {
    id: "nightwork-005",
    name: "NIGHTWORK 005",
    genre: "trap",
    bpm: "150",
    key: "B MIN",
    gradient: "linear-gradient(135deg,#0e1212,#1a2828)",
    mp3Url: "https://payhip.com/placidchills",
    wavUrl: "https://payhip.com/placidchills",
    stemsUrl: "https://payhip.com/placidchills",
    previewUrl: "",
  },
  {
    id: "nightwork-006",
    name: "NIGHTWORK 006",
    genre: "boom-bap",
    bpm: "85",
    key: "E MIN",
    gradient: "linear-gradient(135deg,#0f0f0d,#201e10)",
    mp3Url: "https://payhip.com/placidchills",
    wavUrl: "https://payhip.com/placidchills",
    stemsUrl: "https://payhip.com/placidchills",
    previewUrl: "",
  },
];

export async function fetchBeatsFromAirtable(): Promise<Beat[]> {
  const token = process.env.AIRTABLE_TOKEN;
  const base = process.env.AIRTABLE_BASE;
  const table = process.env.AIRTABLE_TABLE ?? "Beats";

  if (!token || !base) return STATIC_BEATS;

  const url = `https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}?filterByFormula={Status}='Published'&sort[0][field]=Name&sort[0][direction]=asc`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error("Airtable fetch failed");

  const data = (await res.json()) as {
    records: Array<{
      id: string;
      fields: Record<string, string | boolean | undefined>;
    }>;
  };

  const beats = data.records.map((r) => ({
    id: r.id,
    name: String(r.fields.Name ?? "Untitled"),
    genre: String(r.fields.Genre ?? "trap")
      .toLowerCase()
      .replace(/\s+/g, "-"),
    bpm: String(r.fields.BPM ?? "—"),
    key: String(r.fields.Key ?? "—"),
    gradient: String(
      r.fields.Gradient ?? "linear-gradient(135deg,#15120f,#2a241c)",
    ),
    mp3Url: String(r.fields.PayhipMP3 ?? "#contact"),
    wavUrl: String(r.fields.PayhipWAV ?? "#contact"),
    stemsUrl: String(r.fields.PayhipStems ?? "#contact"),
    previewUrl: String(r.fields.PreviewURL ?? ""),
    exclusiveAvailable: Boolean(r.fields.ExclusiveAvailable),
  }));

  return beats.length ? beats : STATIC_BEATS;
}
