import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { useFileStore } from "./useFileStore";

export type FuncVersion = "0.2.0" | "0.3.0";

type State = {
  compiler: "func";
  version: FuncVersion;
  commandLine: string;
  overrideCommandLine: string | null;
};

type DerivedState = {};

type Actions = {
  setVersion: (version: FuncVersion) => void;
  setOverrideCommandLine: (commandLine: string | null) => void;
};

const _useCompilerSettingsStore = create(
  immer<State & DerivedState & Actions>((set, get) => ({
    // State
    compiler: "func" as "func",
    version: "0.3.0" as FuncVersion,
    commandLine: "",
    overrideCommandLine: null as string | null,

    // Derived

    // Actions
    setVersion: (version: FuncVersion) => {
      set((state) => {
        state.version = version;
      });
    },
    setOverrideCommandLine: (cmd: string | null) => {
      set((state) => {
        state.overrideCommandLine = cmd;
      });
    },
  })),
);

export function useCompilerSettingsStore() {
  const { files } = useFileStore();
  const compilerStore = _useCompilerSettingsStore();

  function prepareCommandLine() {
    const cmd = files
      .filter((f) => f.includeInCommand)
      .map((f) => (f.folder ? f.folder + "/" : "") + f.fileObj.name)
      .join(" ");

    if (!files) return "";
    return `-SPA ${cmd}`;
  }

  return {
    ...compilerStore,
    commandLine: compilerStore.overrideCommandLine ?? prepareCommandLine(),
  };
}
