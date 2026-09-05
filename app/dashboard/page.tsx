import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ContractUploader } from "@/components/ContractUploader";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <ContractUploader />;
}
