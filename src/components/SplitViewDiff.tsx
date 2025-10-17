import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageDiff } from "@/lib/packageDiff";
import { Minus, Plus, RefreshCw, ArrowRight } from "lucide-react";

interface SplitViewDiffProps {
  diff: PackageDiff;
}

export const SplitViewDiff = ({ diff }: SplitViewDiffProps) => {
  const hasChanges = diff.added.length > 0 || diff.removed.length > 0 || diff.updated.length > 0;

  if (!hasChanges) {
    return (
      <Card className="p-8 text-center bg-card border-border">
        <p className="text-muted-foreground">No differences found. The package.json files are identical.</p>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left Side - Current (Removed & Old Versions) */}
      <Card className="p-6 bg-card border-border">
        <div className="mb-4 pb-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            Current package.json
            <Badge variant="secondary" className="ml-auto">
              {diff.removed.length + diff.updated.length} changes
            </Badge>
          </h3>
        </div>

        <div className="space-y-2">
          {/* Packages to Remove */}
          {diff.removed.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-destructive mb-3">
                <Minus className="w-4 h-4" />
                <span>To Remove ({diff.removed.length})</span>
              </div>
              {diff.removed.map((pkg) => (
                <div
                  key={pkg.name}
                  className="p-3 rounded-md border bg-destructive/10 border-destructive/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground break-all">
                      {pkg.name}
                    </span>
                    <Badge variant="destructive" className="shrink-0 text-xs">
                      {pkg.version}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Old Versions of Updated Packages */}
          {diff.updated.length > 0 && (
            <div className="space-y-2 mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-warning mb-3">
                <RefreshCw className="w-4 h-4" />
                <span>Old Versions ({diff.updated.length})</span>
              </div>
              {diff.updated.map((pkg) => (
                <div
                  key={pkg.name}
                  className="p-3 rounded-md border bg-warning/10 border-warning/30"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-foreground break-all">
                      {pkg.name}
                    </span>
                    <Badge variant="secondary" className="shrink-0 text-xs line-through">
                      {pkg.oldVersion}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowRight className="w-3 h-3" />
                    <span>Will update to {pkg.version}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {diff.removed.length === 0 && diff.updated.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No packages to remove or update
            </div>
          )}
        </div>
      </Card>

      {/* Right Side - Target (Added & New Versions) */}
      <Card className="p-6 bg-card border-border">
        <div className="mb-4 pb-4 border-b border-border">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            Target package.json
            <Badge variant="secondary" className="ml-auto">
              {diff.added.length + diff.updated.length} changes
            </Badge>
          </h3>
        </div>

        <div className="space-y-2">
          {/* Packages to Add */}
          {diff.added.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-success mb-3">
                <Plus className="w-4 h-4" />
                <span>To Add ({diff.added.length})</span>
              </div>
              {diff.added.map((pkg) => (
                <div
                  key={pkg.name}
                  className="p-3 rounded-md border bg-success/10 border-success/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground break-all">
                      {pkg.name}
                    </span>
                    <Badge className="shrink-0 text-xs bg-success text-success-foreground">
                      {pkg.version}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Versions of Updated Packages */}
          {diff.updated.length > 0 && (
            <div className="space-y-2 mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-warning mb-3">
                <RefreshCw className="w-4 h-4" />
                <span>New Versions ({diff.updated.length})</span>
              </div>
              {diff.updated.map((pkg) => (
                <div
                  key={pkg.name}
                  className="p-3 rounded-md border bg-warning/10 border-warning/30"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-foreground break-all">
                      {pkg.name}
                    </span>
                    <Badge className="shrink-0 text-xs bg-warning text-warning-foreground">
                      {pkg.version}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ArrowRight className="w-3 h-3" />
                    <span>Updating from {pkg.oldVersion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {diff.added.length === 0 && diff.updated.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No packages to add or update
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
