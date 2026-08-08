export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-[#1F2937]/15 bg-[#F9FAFB]"
    >
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-[#0D9488]">
            Contact
          </p>

          <h2 className="text-[40px] font-bold leading-[1.2] text-[#111827]">
            Let&apos;s build something useful.
          </h2>

          <p className="mt-6 text-lg leading-[1.7] text-[#1F2937]/80">
            If you want to talk about backend engineering, AI-powered
            features, or a project, feel free to reach out.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="mailto:elyasbromand3@gmail.com"
              className="rounded-md bg-[#1F2937] px-6 py-3 text-sm font-medium text-[#F9FAFB] transition-colors hover:bg-[#0F766E]"
            >
              Email Me
            </a>

            <a
              href="https://www.linkedin.com/in/elyas-bromand"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-6 py-3 text-sm font-medium text-[#0D9488] hover:text-[#0F766E] hover:underline"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}