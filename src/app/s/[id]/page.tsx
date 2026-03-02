import { ShareViewer } from "@/components/ShareViewer";

interface PageProps {
  params: { id: string };
}

export default function SharePage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <ShareViewer id={params.id} />
      </main>
    </div>
  );
}
