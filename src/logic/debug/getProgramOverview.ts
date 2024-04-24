import ts from 'typescript';

const isFileInNodeModules = (file: ts.SourceFile) =>
  file.fileName.includes('/node_modules/');

export const getProgramOverview = (program: ts.Program) => {
  // consider each file
  const fileOverviewsAll = program.getSourceFiles().map((file) => {
    const fileOverview = {
      name: file.fileName,
      inNodeModules: isFileInNodeModules(file),
      references: file.referencedFiles.map((reference) => reference.fileName),
      statements: { count: file.statements.length },
    };
    return fileOverview;
  });
  const nodeModuleFiles = fileOverviewsAll.filter((file) => file.inNodeModules);
  const fileOverviews = {
    nodeModuleFiles: [
      ...nodeModuleFiles.slice(0, 3),
      `...and ${nodeModuleFiles.length - 3} more...`,
    ], // only show the first 5
    directFiles: fileOverviewsAll.filter((file) => !file.inNodeModules),
  };

  // consider file stats
  const fileStatistics = {
    root: program.getRootFileNames().length,
    direct: fileOverviews.directFiles.length,
    nodeModule: nodeModuleFiles.length,
    all: program.getSourceFiles().length,
  };

  // return full overview
  return {
    files: fileOverviews,
    statistics: fileStatistics,
  };
};
