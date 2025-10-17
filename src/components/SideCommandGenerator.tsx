import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, Terminal } from "lucide-react";
import { useState } from "react";
import { PackageDiff } from "@/lib/packageDiff";
import { generateCommandsForSide } from "@/lib/commandGenerator";
import { toast } from "@/hooks/use-toast";

interface SideCommandGeneratorProps {
  diff: PackageDiff;
  side: 'left' | 'right';
  selectedPackages: string[];
  includeVersions: boolean;
  onIncludeVersionsChange: (value: boolean) => void;
  packageManager: string;
  onPackageManagerChange: (value: string) => void;
  title: string;
}

export const SideCommandGenerator = ({
  diff,
  side,
  selectedPackages,
  includeVersions,
  onIncludeVersionsChange,
  packageManager,
  onPackageManagerChange,
  title,
}: SideCommandGeneratorProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const commands = generateCommandsForSide(diff, side, selectedPackages, packageManager, includeVersions);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Copied to clipboard",
      description: "Command has been copied successfully",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllCommands = async () => {
    const allCommands = commands.join('\n');
    await navigator.clipboard.writeText(allCommands);
    toast({
      title: "All commands copied",
      description: "All commands have been copied successfully",
    });
  };

  if (commands.length === 0) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">No packages selected</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        {commands.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={copyAllCommands}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy All
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Switch
            id={`include-versions-${side}`}
            checked={includeVersions}
            onCheckedChange={onIncludeVersionsChange}
          />
          <Label htmlFor={`include-versions-${side}`} className="cursor-pointer text-sm">
            Include versions
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor={`package-manager-${side}`} className="text-sm">
            Package Manager:
          </Label>
          <Select value={packageManager} onValueChange={onPackageManagerChange}>
            <SelectTrigger id={`package-manager-${side}`} className="w-32">
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
