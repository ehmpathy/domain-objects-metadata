import { SourceFile } from 'typescript';

const ALLOWLIST = ['simple-async-tasks', 'type-fns'];

/**
 * .what = narrows the list of program source files to the ones we care about
 * .why =
 *   - remove attempts to process invalid dobjs -> decrease speed and decrease errors
 *
 * todo
 * - remove the need for this, by having the input come from a .ts export which explicitly declares which dobjs to analyze
 */
export const extractRelevantProgramSourceFiles = (
  files: readonly SourceFile[],
) =>
  files.filter(
    (file) =>
      !file.fileName.includes('/node_modules/') ||
      ALLOWLIST.some((allowed) =>
        // todo: remove this allowlist by having inputs come from a .ts export which explicitly declares the dobjs to analyze
        file.fileName.includes(`/node_modules/${allowed}`),
      ),
  );
