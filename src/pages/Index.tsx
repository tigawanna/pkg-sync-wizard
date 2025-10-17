import { useState, useEffect } from "react";
import { PackageJsonInput } from "@/components/PackageJsonInput";
import { SplitViewDiff } from "@/components/SplitViewDiff";
import { SideCommandGenerator } from "@/components/SideCommandGenerator";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { comparePackageJsons, PackageDiff } from "@/lib/packageDiff";
import { GitCompare, FileJson } from "lucide-react";

const Index = () => {
  const [currentPackageJson, setCurrentPackageJson] = useLocalStorage("currentPackageJson", "");
  const [targetPackageJson, setTargetPackageJson] = useLocalStorage("targetPackageJson", "");
  const [includeVersions, setIncludeVersions] = useLocalStorage("includeVersions", true);
  const [packageManager, setPackageManager] = useLocalStorage("packageManager", "npm");
  const [diff, setDiff] = useState<PackageDiff | null>(null);
  const [selectedLeft, setSelectedLeft] = useState<string[]>([]);
  const [selectedRight, setSelectedRight] = useState<string[]>([]);

  const handleCompare = () => {
    const result = comparePackageJsons(currentPackageJson, targetPackageJson);
    setDiff(result);
  };

  useEffect(() => {
    if (currentPackageJson && targetPackageJson) {
      const result = comparePackageJsons(currentPackageJson, targetPackageJson);
      setDiff(result);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileJson className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Package.json Diff Tool
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare two package.json files and generate the exact commands needed to sync your dependencies
          </p>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PackageJsonInput
            label="Current package.json"
            value={currentPackageJson}
            onChange={setCurrentPackageJson}
            placeholder='Paste your current package.json here...'
          />
          <PackageJsonInput
            label="Target package.json"
            value={targetPackageJson}
            onChange={setTargetPackageJson}
            placeholder='Paste your target package.json here...'
          />
        </div>

        {/* Compare Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleCompare}
            size="lg"
            className="gap-2 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <GitCompare className="w-5 h-5" />
            Compare Packages
          </Button>
        </div>

        {/* Results Section */}
        {diff && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SplitViewDiff 
              diff={diff} 
              onLeftSelectionChange={setSelectedLeft}
              onRightSelectionChange={setSelectedRight}
            />
            
            {/* Command Generators */}
            <div className="grid md:grid-cols-2 gap-6">
              <SideCommandGenerator
                diff={diff}
                side="left"
                selectedPackages={selectedLeft}
                includeVersions={includeVersions}
                onIncludeVersionsChange={setIncludeVersions}
                packageManager={packageManager}
                onPackageManagerChange={setPackageManager}
                title="Commands for Current"
              />
              <SideCommandGenerator
                diff={diff}
                side="right"
                selectedPackages={selectedRight}
                includeVersions={includeVersions}
                onIncludeVersionsChange={setIncludeVersions}
                packageManager={packageManager}
                onPackageManagerChange={setPackageManager}
                title="Commands for Target"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Your comparison data is automatically saved to local storage</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
