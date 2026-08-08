export default function EngineeringApproach() {
  const principles = [
    {
      title: "Reliability before hype",
      description:
        "I care more about whether a system is worth building and can remain useful over time than whether the technology is currently trending."
    },
    {
      title: "AI should solve a real workflow",
      description:
        "I use AI when it improves a real business process. I do not add AI simply because it is possible."
    },
    {
      title: "Design architecture before features",
      description:
        "Before adding features, I think about how the system should be structured so new requirements do not make the code harder to maintain."
    },
    {
      title: "Secure by default",
      description:
        "Security should be part of the system from the beginning, not something added after the main functionality is finished."
    },
    {
      title: "Build systems that are easy to extend",
      description:
        "I prefer modular architecture because it makes it easier to add new features without changing the entire system."
    }
  ];

  return (
    <section
      id="engineering-approach"
      className="mx-auto max-w-[1200px] px-6 py-24"
    >
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-[#0D9488]">
          Engineering Approach
        </p>

        <h2 className="text-[40px] font-bold leading-[1.2] text-[#111827]">
          How I build software
        </h2>

        <p className="mt-6 text-lg leading-[1.7] text-[#1F2937]/80">
          I focus on building software that has a real purpose, can be
          trusted, and can grow without becoming difficult to maintain.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {principles.map((principle) => (
          <article
            key={principle.title}
            className="border-t border-[#1F2937]/15 pt-6"
          >
            <h3 className="text-[28px] font-semibold leading-[1.3] text-[#111827]">
              {principle.title}
            </h3>

            <p className="mt-4 text-lg leading-[1.7] text-[#1F2937]/80">
              {principle.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12">
        <a
          href="#projects"
          className="text-sm font-medium text-[#0D9488] hover:text-[#0F766E] hover:underline"
        >
          See how these principles appear in my projects →
        </a>
      </div>
    </section>
  );
}