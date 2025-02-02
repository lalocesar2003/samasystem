import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";

import { Separator } from "@/components/ui/separator";

import { convertFileSize } from "@/lib/utils";

const Dashboard = async () => {
  // Parallel requests

  return (
    <div className="dashboard-container">
      <section>
        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list"></ul>
      </section>

      {/* Recent files uploaded */}
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
      </section>
    </div>
  );
};

export default Dashboard;
