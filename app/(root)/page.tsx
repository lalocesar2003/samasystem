import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { Thumbnail } from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { MonthlyDataChart } from "@/components/monthly-data-chart";
import { MonthlyDataTable } from "@/components/monthly-data-table";
import { useState } from "react";
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
