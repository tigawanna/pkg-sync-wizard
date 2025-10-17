import { PackageDiff } from "./packageDiff";

export const generateCommands = (
  diff: PackageDiff,
  packageManager: string,
  includeVersions: boolean
): string[] => {
  const commands: string[] = [];

  const getInstallCommand = (pm: string) => {
    const installCommands: Record<string, string> = {
      npm: "npm install",
      yarn: "yarn add",
      pnpm: "pnpm add",
      expo: "expo install",
    };
    return installCommands[pm] || "npm install";
  };

  const getUninstallCommand = (pm: string) => {
    const uninstallCommands: Record<string, string> = {
      npm: "npm uninstall",
      yarn: "yarn remove",
      pnpm: "pnpm remove",
      expo: "expo uninstall",
    };
    return uninstallCommands[pm] || "npm uninstall";
  };

  const formatPackage = (name: string, version: string) => {
    if (includeVersions) {
      return `${name}@${version}`;
    }
    return name;
  };

  // Generate install commands for added packages
  if (diff.added.length > 0) {
    const packages = diff.added.map((pkg) => formatPackage(pkg.name, pkg.version)).join(" ");
    commands.push(`${getInstallCommand(packageManager)} ${packages}`);
  }

  // Generate install commands for updated packages
  if (diff.updated.length > 0) {
    const packages = diff.updated.map((pkg) => formatPackage(pkg.name, pkg.version)).join(" ");
    commands.push(`${getInstallCommand(packageManager)} ${packages}`);
  }

  // Generate uninstall commands for removed packages
  if (diff.removed.length > 0) {
    const packages = diff.removed.map((pkg) => pkg.name).join(" ");
    commands.push(`${getUninstallCommand(packageManager)} ${packages}`);
  }

  return commands;
};
