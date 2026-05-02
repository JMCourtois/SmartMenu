import { generateAndSaveAiProposal } from "@/lib/ai/change-set";
import { inngest } from "@/inngest/client";

export const runAiMenuAgentJob = inngest.createFunction(
  {
    id: "run-ai-menu-agent",
    triggers: [{ event: "menu.ai_edit.requested" }],
  },
  async ({ event, step }) => {
    const changeSetId = event.data.changeSetId as string;

    await step.run("generate-and-save-ai-proposal", async () => {
      return generateAndSaveAiProposal(changeSetId);
    });

    return { changeSetId };
  },
);
