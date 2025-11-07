// app/(app)/dashboard/page.tsx
import { Monthlydata } from "@/lib/types";
import { listMonthlyData } from "@/lib/actions/monthlydata.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { DashboardTabs } from "../../components/dashboard-tabs";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const [data, currentUser] = await Promise.all([
    listMonthlyData() as Promise<Monthlydata[]>,
    getCurrentUser(),
  ]);

  if (!currentUser) {
    // por seguridad extra, aunque el layout ya redirige
    redirect("/sign-in");
  }

  return (
    <div>
      <DashboardTabs
        initialData={data}
        ownerId={currentUser.$id}
        accountId={currentUser.accountId}
      />
    </div>
  );
};

export default Dashboard;
