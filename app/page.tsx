import { getCurrentUser } from "@/lib/auth";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTASection } from "@/components/landing/CTASection";

export default async function Home() {
  const user = await getCurrentUser();

  const ctaHref = user ? "/dashboard" : "/register";
  const ctaLabel = user ? "前往我的審查" : "免費開始使用";

  return (
    <main className="flex-1">
      <Hero ctaHref={ctaHref} ctaLabel={ctaLabel} />
      <Features />
      <HowItWorks />
      <CTASection ctaHref={ctaHref} ctaLabel={ctaLabel} />
    </main>
  );
}
