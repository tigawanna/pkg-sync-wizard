import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { PackageDiff } from "@/lib/packageDiff";
import { generateCommands } from "@/lib/commandGenerator";
import { toast } from "@/hooks/use-toast";

interface CommandGeneratorProps {
  diff: PackageDiff;
  includeVersions: boolean;
  onIncludeVersionsChange: (value: boolean) => void;
  packageManager: string;
  onPackageManagerChange: (value: string) => void;
}

export const CommandGenerator = ({
  diff,
  includeVersions,
  onIncludeVersionsChange,
  packageManager,
  onPackageManagerChange,
}: CommandGeneratorProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const commands = generateCommands(diff, packageManager, includeVersions);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Copied to clipboard",
      description: "Command has been copied successfully",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (commands.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Generated Commands</h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Switch
              id="include-versions"
              checked={includeVersions}
              onCheckedChange={onIncludeVersionsChange}
            />
            <Label htmlFor="include-versions" className="cursor-pointer text-sm">
              Include versions
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="package-manager" className="text-sm">
              Package Manager:
            </Label>
            <Select value={packageManager} onValueChange={onPackageManagerChange}>
              <SelectTrigger id="package-manager" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="npm">npm</SelectItem>
                <SelectItem value="yarn">yarn</SelectItem>
                <SelectItem value="pnpm">pnpm</SelectItem>
                <SelectItem value="expo">expo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {commands.map((cmd, index) => (
          <div key={index} className="relative">
            <div className="bg-code border border-border rounded-lg p-4 pr-14 font-mono text-sm text-code-foreground overflow-x-auto">
              <code>{cmd}</code>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={() => copyToClipboard(cmd, index)}
            >
              {copiedIndex === index ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
