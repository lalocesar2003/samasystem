import { Monthlydata } from "@/lib/types";
import { listMonthlyData } from "@/lib/actions/monthlydata.actions";
import { DashboardTabs } from "@/components/dashboard-tabs";

const Dashboard = async () => {
  const data: Monthlydata[] = await listMonthlyData();

  return (
    <div className="p-4">
      <DashboardTabs initialData={data} />
    </div>
  );
};

export default Dashboard;
