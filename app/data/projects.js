const projects = [
  {
    slug: "mcp-file-manager",
    title: "MCP File Manager",
    category: "Backend + AI",
    description:
      "An AI-powered file manager that uses MCP and Gemini function calling to understand, explain, and manage project files.",

    problem:
      "I focused on a problem I run into often: opening a project and not knowing what a file or a piece of code actually does. Instead of manually reading through files, I wanted an assistant that could manage files and explain them.",

    whatIDid: [
      "Built the MCP client and MCP server.",
      "Integrated Gemini function calling.",
      "Used Python filesystem tools to manage files.",
      "Designed the client to discover MCP tools and convert them into Gemini function-calling schemas.",
      "Kept prompt and resource handling on the client."
    ],

    reliability:
      "When the Gemini API was overloaded, the whole program crashed and filled the terminal with long error messages. I changed the request flow so temporary server errors are retried up to three times, while client errors are caught and handled gracefully. I also rewrote the logging so failures are easier to understand.",

    outcome:
      "The final project can summarize a file, explain what a code file does, review and clean up code, and create, read, update, and delete files.",

    reflection:
      "I consider the project successful because I use it myself to understand code files, and I am satisfied with how it behaves. It also helped me understand the MCP architecture from end to end.",

    nextTime:
      "I would spend more time designing the architecture before writing code, so I have a clearer path for new features. I would also design the request and error-handling flow for LLM APIs from the beginning instead of improving it after failures appeared.",

    repository: "https://github.com/elyasbromand/mcp-file-manager"
  }
];

export default projects;