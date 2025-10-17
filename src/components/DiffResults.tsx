import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PackageDiff } from "@/lib/packageDiff";
import { Plus, Minus, RefreshCw } from "lucide-react";

interface DiffResultsProps {
  diff: PackageDiff;
}

export const DiffResults = ({ diff }: DiffResultsProps) => {
  const hasChanges = diff.added.length > 0 || diff.removed.length > 0 || diff.updated.length > 0;

  if (!hasChanges) {
    return (
      <Card className="p-8 text-center bg-card border-border">
        <p className="text-muted-foreground">No differences found. The package.json files are identical.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All Changes
            <Badge variant="secondary" className="ml-2">
              {diff.added.length + diff.removed.length + diff.updated.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="added" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
            Added
            <Badge variant="secondary" className="ml-2">{diff.added.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="removed" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
            Removed
            <Badge variant="secondary" className="ml-2">{diff.removed.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="updated" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
            Updated
            <Badge variant="secondary" className="ml-2">{diff.updated.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {diff.added.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-success flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Added Packages
              </h3>
              {diff.added.map((pkg) => (
                <PackageItem key={pkg.name} name={pkg.name} version={pkg.version} type="added" />
              ))}
            </div>
          )}
          {diff.removed.length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
                <Minus className="w-4 h-4" />
                Removed Packages
              </h3>
              {diff.removed.map((pkg) => (
                <PackageItem key={pkg.name} name={pkg.name} version={pkg.version} type="removed" />
              ))}
            </div>
          )}
          {diff.updated.length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="text-sm font-semibold text-warning flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Updated Packages
              </h3>
              {diff.updated.map((pkg) => (
                <PackageItem key={pkg.name} name={pkg.name} oldVersion={pkg.oldVersion} version={pkg.version} type="updated" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="added" className="space-y-2">
          {diff.added.map((pkg) => (
            <PackageItem key={pkg.name} name={pkg.name} version={pkg.version} type="added" />
          ))}
        </TabsContent>

        <TabsContent value="removed" className="space-y-2">
          {diff.removed.map((pkg) => (
            <PackageItem key={pkg.name} name={pkg.name} version={pkg.version} type="removed" />
          ))}
        </TabsContent>

        <TabsContent value="updated" className="space-y-2">
          {diff.updated.map((pkg) => (
            <PackageItem key={pkg.name} name={pkg.name} oldVersion={pkg.oldVersion} version={pkg.version} type="updated" />
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

interface PackageItemProps {
  name: string;
  version: string;
  oldVersion?: string;
  type: "added" | "removed" | "updated";
}

const PackageItem = ({ name, version, oldVersion, type }: PackageItemProps) => {
  const bgColor = type === "added" ? "bg-success/10" : type === "removed" ? "bg-destructive/10" : "bg-warning/10";
  const borderColor = type === "added" ? "border-success/30" : type === "removed" ? "border-destructive/30" : "border-warning/30";
  
  return (
    <div className={`p-3 rounded-md border ${bgColor} ${borderColor} font-mono text-sm`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{name}</span>
        <div className="flex items-center gap-2">
          {oldVersion && (
            <>
              <span className="text-muted-foreground line-through">{oldVersion}</span>
              <span className="text-muted-foreground">→</span>
            </>
          )}
          <span className="text-foreground">{version}</span>
        </div>
      </div>
    </div>
  );
};
