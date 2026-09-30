import type { EvidenceVisual as EvidenceVisualData } from "@/data/types";
import { Arms } from "./arms";
import { AuthzMatrix } from "./authz-matrix";
import { Bars } from "./bars";
import { ChaosGrid } from "./chaos-grid";
import { KillGrid } from "./kill-grid";
import { SplitTable } from "./split-table";

export function EvidenceVisual({ visual }: { visual: EvidenceVisualData }) {
  switch (visual.type) {
    case "chaos":
      return <ChaosGrid visual={visual} />;
    case "authz":
      return <AuthzMatrix visual={visual} />;
    case "bars":
      return <Bars visual={visual} />;
    case "killgrid":
      return <KillGrid visual={visual} />;
    case "arms":
      return <Arms visual={visual} />;
    case "split":
      return <SplitTable visual={visual} />;
  }
}
