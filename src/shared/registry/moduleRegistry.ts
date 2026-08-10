export interface ModuleManifest {
  name: string;
  version: string;
  icon: string;
  permissions: string[];
  dependencies: string[];
  apis: string[];
  routes: { path: string; label: string }[];
}

class ModuleRegistry {
  private modules = new Map<string, ModuleManifest>();

  registerModule(name: string, manifest: ModuleManifest) {
    this.modules.set(name, manifest);
    console.log(`[ModuleRegistry] Registered: ${name} v${manifest.version}`);
  }

  getModule(name: string): ModuleManifest | undefined {
    return this.modules.get(name);
  }

  getAllModules(): ModuleManifest[] {
    return Array.from(this.modules.values());
  }

  clear() {
    this.modules.clear();
  }
}

export const moduleRegistry = new ModuleRegistry();
export default moduleRegistry;
