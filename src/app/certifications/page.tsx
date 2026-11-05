import type { Metadata } from "next";
import { CertificationsList, PageShell } from "@/components/home/PortfolioPages";

export const metadata: Metadata = { title: "Certifications", description: "Certifications, seminars and workshops." };

export default function CertificationsPage() {
  return (
    <PageShell title="Certifications" lede="Certifications, seminars and workshops I’ve completed.">
      <CertificationsList />
    </PageShell>
  );
}
