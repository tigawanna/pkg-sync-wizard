export interface PackageInfo {
  name: string;
  version: string;
  oldVersion?: string;
}

export interface PackageDiff {
  added: PackageInfo[];
  removed: PackageInfo[];
  updated: PackageInfo[];
}

export interface ParsedPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export const parsePackageJson = (jsonString: string): ParsedPackageJson | null => {
  try {
    const parsed = JSON.parse(jsonString);
    return {
      dependencies: parsed.dependencies || {},
      devDependencies: parsed.devDependencies || {},
    };
  } catch (error) {
    return null;
  }
};

export const comparePackageJsons = (
  currentJson: string,
  targetJson: string
): PackageDiff | null => {
  const current = parsePackageJson(currentJson);
  const target = parsePackageJson(targetJson);

  if (!current || !target) {
    return null;
  }

  const allCurrentDeps = { ...current.dependencies, ...current.devDependencies };
  const allTargetDeps = { ...target.dependencies, ...target.devDependencies };

  const added: PackageInfo[] = [];
  const removed: PackageInfo[] = [];
  const updated: PackageInfo[] = [];

  // Find added and updated packages
  Object.entries(allTargetDeps).forEach(([name, version]) => {
    if (!allCurrentDeps[name]) {
      added.push({ name, version });
    } else if (allCurrentDeps[name] !== version) {
      updated.push({ name, version, oldVersion: allCurrentDeps[name] });
    }
  });

  // Find removed packages
  Object.entries(allCurrentDeps).forEach(([name, version]) => {
    if (!allTargetDeps[name]) {
      removed.push({ name, version });
    }
  });

  return { added, removed, updated };
};
