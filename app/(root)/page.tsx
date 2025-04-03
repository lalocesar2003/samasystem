import { Monthlydata } from "@/lib/types";
import { listMonthlyData } from "@/lib/actions/monthlydata.actions";
import { MonthlyDataParent } from "@/components/monthly-data-parent";

const Dashboard = async () => {
  const data: Monthlydata[] = await listMonthlyData();

  return (
    <div>
      <MonthlyDataParent initialData={data} />
    </div>
  );
};

export default Dashboard;
