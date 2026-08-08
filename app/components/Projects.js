import Link from "next/link";
import projects from "../data/projects";

export default function Projects() {
  return (
    <section
      id="projects"
      className="mx-auto max-w-[1200px] px-6 py-24"
    >
      <div className="mb-12">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-[#0D9488]">
          Selected Work
        </p>

        <h2 className="text-[40px] font-bold leading-[1.2] text-[#111827]">
          Projects
        </h2>

        <p className="mt-4 max-w-2xl text-lg leading-[1.7] text-[#1F2937]/80">
          Backend systems and AI features built to solve practical problems.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group rounded-lg border border-[#1F2937]/15 p-8 transition-colors hover:border-[#0D9488]"
          >
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#0D9488]">
              {project.category}
            </p>

            <h3 className="mt-4 text-[28px] font-semibold leading-[1.3] text-[#111827]">
              {project.title}
            </h3>

            <p className="mt-4 text-lg leading-[1.7] text-[#1F2937]/80">
              {project.description}
            </p>

            <span className="mt-8 inline-block text-sm font-medium text-[#0D9488] group-hover:underline">
              Read case study →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}