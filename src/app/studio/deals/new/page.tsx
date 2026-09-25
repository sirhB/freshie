import { Suspense } from "react";
import NewDealForm from "./new-deal-form";

export default function NewDealPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl py-12 text-sm text-ink/50">Loading deal form…</div>
      }
    >
      <NewDealForm />
    </Suspense>
  );
}
