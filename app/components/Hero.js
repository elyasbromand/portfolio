export default function Hero() {
    return (
  <section className="mx-auto flex min-h-screen max-w-[1200px] items-center px-6 py-24">
    <div className="max-w-3xl">
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-[#1F2937]">
        Backend AI Engineer
      </p>

      <h1 className="text-[56px] font-bold leading-[1.1] tracking-tight text-[#111827]">
        Elyas Bromand
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-[#1F2937]/80">
        I build backend services that turn AI into practical business features.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#projects"
          className="rounded-md bg-[#1F2937] px-6 py-3 text-sm font-medium text-[#F9FAFB] transition-colors hover:bg-[#0F766E]"
        >
          View My Work
        </a>

        <a
          href="mailto:your-email@example.com"
          className="rounded-md px-6 py-3 text-sm font-medium text-[#0D9488] transition-colors hover:text-[#0F766E] hover:underline"
        >
          Email Me
        </a>
      </div>
    </div>
  </section>
  );
}
