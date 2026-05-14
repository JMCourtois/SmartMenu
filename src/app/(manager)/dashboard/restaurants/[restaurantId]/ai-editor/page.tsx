import { notFound } from "next/navigation";
import {
  AlertTriangle,
  Check,
  CircleDashed,
  FileText,
  ShieldAlert,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";

import {
  applyChangeSetAction,
  approveChangeSetAction,
  rejectChangeSetAction,
  requestAiProposalAction,
} from "@/app/(manager)/dashboard/actions";
import { ManagerPageHeader } from "@/components/dashboard/ManagerPageHeader";
import { ManagerStatusCard } from "@/components/dashboard/ManagerStatusCard";
import { SetupChecklist } from "@/components/dashboard/SetupChecklist";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requireRestaurantAccess } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/db";
import { getAiChangeSets, getManagerRestaurant } from "@/lib/menu/queries";

export const dynamic = "force-dynamic";

function renderValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

function riskVariant(risk: string) {
  if (risk === "HIGH" || risk === "BLOCKED") {
    return "destructive" as const;
  }

  if (risk === "MEDIUM") {
    return "secondary" as const;
  }

  return "outline" as const;
}

export default async function AiEditorPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  await requireRestaurantAccess(restaurantId, "ai:write");
  const data = await getManagerRestaurant(restaurantId);

  if (!data) {
    notFound();
  }

  const changeSets = await getAiChangeSets(data.draftVersion.id);
  const requestProposal = requestAiProposalAction.bind(null, restaurantId);
  const approve = approveChangeSetAction.bind(null, restaurantId);
  const reject = rejectChangeSetAction.bind(null, restaurantId);
  const apply = applyChangeSetAction.bind(null, restaurantId);
  const isDemo = !hasDatabaseUrl();
  const openProposalCount = changeSets.filter((changeSet) =>
    ["PROCESSING", "PROPOSED", "APPROVED"].includes(changeSet.status),
  ).length;
  const highRiskCount = changeSets.filter((changeSet) =>
    ["HIGH", "BLOCKED"].includes(changeSet.riskLevel),
  ).length;

  return (
    <main className="flex flex-col gap-5">
      <ManagerPageHeader
        title="AI menu editor"
        description="Use AI for translations, rewrites, pairings, and missing-field checks. Every output becomes a reviewable proposal against the draft."
        restaurantName={data.restaurant.name}
        restaurantSlug={data.restaurant.slug}
        draftLabel={`Draft v${data.draftVersion.version}`}
        statusLabel="AI proposes, staff approves"
      />

      <section className="grid gap-3 md:grid-cols-3">
        <ManagerStatusCard
          label="Open proposals"
          value={String(openProposalCount)}
          helper="Approve, apply, then publish the draft manually."
          icon={Sparkles}
          tone="violet"
        />
        <ManagerStatusCard
          label="High risk"
          value={String(highRiskCount)}
          helper="Prices, allergens, deletions, and safety claims require human care."
          icon={ShieldAlert}
          tone={highRiskCount > 0 ? "rose" : "green"}
        />
        <ManagerStatusCard
          label="Draft target"
          value={`v${data.draftVersion.version}`}
          helper="The live public menu is never overwritten by AI."
          icon={FileText}
          tone="blue"
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Generate proposal</CardTitle>
            <CardDescription>
              Shortcut ideas mirror common restaurant back-office jobs: translate,
              clarify, promote, and detect missing safety data.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-3">
              {[
                "Translate top dishes into English, Spanish, German, Japanese, and Korean.",
                "Rewrite descriptions so tourists understand origin, taste, and preparation.",
                "Find dishes missing allergen or dietary verification notes.",
                "Suggest pairings and promoted vegetarian dishes for tonight.",
              ].map((prompt) => (
                <div key={prompt} className="rounded-[var(--radius-md)] bg-[var(--paper-warm)] p-3 shadow-[var(--ring-hairline)]">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <WandSparkles className="size-4 text-[var(--secondary)]" />
                    Prompt shortcut
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{prompt}</p>
                </div>
              ))}
            </div>
            <form action={requestProposal} className="flex flex-col gap-3">
              <input type="hidden" name="menuVersionId" value={data.draftVersion.id} />
              <Textarea
                name="prompt"
                rows={8}
                placeholder="Translate the Bavarian classics into natural English for tourists and flag missing allergen details."
                disabled={isDemo}
              />
              <Button type="submit" disabled={isDemo} className="h-10">
                <Sparkles data-icon="inline-start" />
                Generate proposal
              </Button>
            </form>
          </CardContent>
        </Card>

        <SetupChecklist
          items={[
            {
              label: "Generate proposal",
              done: changeSets.length > 0,
              helper: "AI creates a structured ChangeSet, not direct edits.",
            },
            {
              label: "Review risk and diff",
              done: changeSets.some((changeSet) => changeSet.status !== "PROCESSING"),
              helper: "High-risk edits stay manual in the MVP.",
            },
            {
              label: "Approve and apply",
              done: changeSets.some((changeSet) => changeSet.status === "APPLIED"),
              helper: "Only whitelisted handlers update the draft.",
            },
            {
              label: "Publish draft",
              done: false,
              helper: "Publishing is a separate menu operation.",
            },
          ]}
        />
      </div>

      {isDemo ? (
        <Alert className="border-[var(--hairline)] bg-[var(--secondary-soft)] text-[var(--accent-dark)]">
          <AlertTriangle />
          <AlertTitle>Demo mode</AlertTitle>
          <AlertDescription>
            Configure the database and OpenAI key to create live ChangeSets. A
            representative proposal is shown below.
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="flex flex-col gap-4">
        {changeSets.map((changeSet) => (
          <Card key={changeSet.id} className="overflow-hidden">
            <CardHeader className="border-b border-[var(--hairline-soft)] bg-[var(--paper-warm)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>{changeSet.summary ?? "AI proposal"}</CardTitle>
                    <Badge variant={riskVariant(changeSet.riskLevel)}>
                      {changeSet.riskLevel}
                    </Badge>
                    <Badge>{changeSet.status}</Badge>
                  </div>
                  <CardDescription className="mt-2">{changeSet.prompt}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={approve}>
                    <input type="hidden" name="changeSetId" value={changeSet.id} />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isDemo || changeSet.status !== "PROPOSED"}
                    >
                      <Check data-icon="inline-start" />
                      Approve
                    </Button>
                  </form>
                  <form action={apply}>
                    <input type="hidden" name="changeSetId" value={changeSet.id} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="secondary"
                      disabled={isDemo || changeSet.status !== "APPROVED"}
                    >
                      <CircleDashed data-icon="inline-start" />
                      Apply
                    </Button>
                  </form>
                  <form action={reject}>
                    <input type="hidden" name="changeSetId" value={changeSet.id} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      disabled={isDemo || !["PROPOSED", "APPROVED"].includes(changeSet.status)}
                    >
                      <X data-icon="inline-start" />
                      Reject
                    </Button>
                  </form>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {changeSet.warnings.length ? (
                  <Alert variant="destructive">
                  <ShieldAlert />
                  <AlertTitle>Warnings</AlertTitle>
                  <AlertDescription>{changeSet.warnings.join(" ")}</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-3">
                {changeSet.changes.map((change) => (
                  <div key={change.id} className="rounded-[var(--radius-md)] bg-[var(--paper-warm)] p-3 shadow-[var(--ring-hairline)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{change.entityType}</Badge>
                      <Badge variant="secondary">{change.operation}</Badge>
                      {change.field ? <Badge variant="outline">{change.field}</Badge> : null}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{change.reason}</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <pre className="max-h-60 overflow-auto rounded-[var(--radius-sm)] bg-white p-3 text-xs shadow-[var(--ring-hairline)]">
                        {renderValue(change.oldValue)}
                      </pre>
                      <pre className="max-h-60 overflow-auto rounded-[var(--radius-sm)] bg-[var(--accent-soft)] p-3 text-xs shadow-[var(--ring-hairline)]">
                        {renderValue(change.newValue)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
