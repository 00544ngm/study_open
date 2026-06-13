import { stages } from "@/data/stages";
import StageContent from "./StageContent";

export function generateStaticParams() {
  return stages.map((s) => ({ slug: s.id }));
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <StageContent slug={Promise.resolve(params).then(p => p.slug)} />;
}
