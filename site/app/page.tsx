import Landing from "@/components/landing";

const BIRTH_DATE = process.env.NEXT_PUBLIC_DAEMON_BIRTH ?? "2026-03-09T01:00:00Z";

export default function Home() {
  return <Landing birthDate={BIRTH_DATE} />;
}
