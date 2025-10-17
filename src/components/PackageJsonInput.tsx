import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface PackageJsonInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const PackageJsonInput = ({ label, value, onChange, placeholder }: PackageJsonInputProps) => {
  return (
    <Card className="p-6 space-y-3 bg-card border-border">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[400px] font-mono text-sm bg-code text-code-foreground border-border resize-none"
      />
    </Card>
  );
};
