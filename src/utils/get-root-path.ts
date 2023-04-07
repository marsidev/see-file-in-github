import absolute from 'absolute'
import sortBy from 'lodash.sortby'
import { workspace } from 'vscode'

/* https://github.com/fabiospampinato/vscode-open-in-github/blob/master/src/utils.ts#L38 */
export function getRootPath(basePath?: string) {
	const { workspaceFolders } = workspace

	if (!workspaceFolders) return

	const firstRootPath = workspaceFolders[0].uri.fsPath

	if (!basePath || !absolute(basePath)) return firstRootPath

	const rootPaths = workspaceFolders.map(folder => folder.uri.fsPath)
	const sortedRootPaths = sortBy(rootPaths, [path => path.length]).reverse() // In order to get the closest root

	return sortedRootPaths.find(rootPath => basePath.startsWith(rootPath))
}
