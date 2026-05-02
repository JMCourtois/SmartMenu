import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { runAiMenuAgentJob } from "@/inngest/functions/run-ai-menu-agent";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [runAiMenuAgentJob],
});
