import Link from "next/link";
import { StudioPageHeader, StudioCard } from "@/components/studio/StudioUI";

export const dynamic = "force-dynamic";

const steps = [
  {
    n: "01",
    title: "Edit your public site",
    body: "Open Site to change your hero, About me, rates, socials, and Instagram reels. Uploads save to durable storage so they stay live after deploys.",
    href: "/studio/site",
    cta: "Open Site CMS",
  },
  {
    n: "02",
    title: "Capture brand inquiries",
    body: "Brands use Hire on your public page. Instagram DMs also land here once Meta tokens are connected in Settings. Until then, use Simulate Instagram DM to practice.",
    href: "/studio/inquiries",
    cta: "Open Inquiries",
  },
  {
    n: "03",
    title: "Convert an inquiry into a deal",
    body: "When a lead looks good, hit Convert to deal. That creates a brand obligation with checklist + starter deliverable so nothing falls through.",
    href: "/studio/inquiries",
    cta: "Triage leads",
  },
  {
    n: "04",
    title: "Track deadlines",
    body: "Today shows what’s due. Calendar is the month view. Pipeline is drag-and-drop for deliverable stages (filming → editing → live).",
    href: "/studio/pipeline",
    cta: "Open Pipeline",
  },
  {
    n: "05",
    title: "Files & payments",
    body: "On each deal, upload briefs/drafts/finals and update payment status. Payments page rolls up booked vs collected.",
    href: "/studio/payments",
    cta: "Open Payments",
  },
  {
    n: "06",
    title: "Password & Instagram",
    body: "Change your password in Settings. Copy the Instagram webhook URL + verify token into Meta, then set Vercel INSTAGRAM_* env vars to go live.",
    href: "/studio/settings",
    cta: "Open Settings",
  },
];

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      <StudioPageHeader
        eyebrow="Guide"
        title="Getting started"
        description="Your self-serve playbook — edit the public media kit, intake brands, and run obligations from one studio."
      />

      <StudioCard className="bg-blush/30">
        <p className="text-sm text-ink/75">
          Public site:{" "}
          <Link href="/" className="font-semibold text-berry hover:underline">
            view media kit
          </Link>
          . Prefer a walkthrough? Follow the six steps below in order the first time.
        </p>
      </StudioCard>

      <ol className="space-y-4">
        {steps.map((step) => (
          <li
            key={step.n}
            className="grid gap-4 rounded-2xl border border-ink/8 bg-white/70 p-5 md:grid-cols-[auto_1fr_auto] md:items-center"
          >
            <span className="font-[family-name:var(--font-display)] text-3xl text-berry/70">
              {step.n}
            </span>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-ink">
                {step.title}
              </h2>
              <p className="mt-1 text-sm text-ink/65">{step.body}</p>
            </div>
            <Link
              href={step.href}
              className="inline-flex justify-center rounded-full bg-berry px-4 py-2 text-sm font-semibold text-pearl hover:bg-violet"
            >
              {step.cta}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
