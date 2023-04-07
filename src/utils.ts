import path from 'node:path'
import { existsSync } from 'node:fs'
import sortBy from 'lodash.sortby'
import { Uri, window, workspace } from 'vscode'
import absolute from 'absolute'
import { simpleGit } from 'simple-git'

interface InitProps {
	branch: string | null | undefined
	origin: string | null | undefined
	rootPath: string | null | undefined
	editorPath: string | null | undefined
}

const git = simpleGit()

export async function getInitProps(): Promise<InitProps> {
	let branch: string | undefined | null
	let origin: string | undefined | null

	const { activeTextEditor } = window
	const editorPath = activeTextEditor && activeTextEditor.document.uri.fsPath
	const rootPath = getRootPath(editorPath)

	const isGitRepo = checkGitFile(rootPath ?? '')

	if (!rootPath || !isGitRepo) {
		return { origin: null, branch: null, rootPath: null, editorPath: null }
	}

	try {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		git.cwd(rootPath)

		await git.raw('config', '--global', '--add', 'safe.directory', '*')

		branch = (await git.branch()).current
		origin = (await git.getConfig('remote.origin.url')).value?.replace('.git', '')
	} catch (e) {
		console.log(e)
	}

	return { branch, origin, rootPath, editorPath }
}

export function generateRemoteRepositoryUri(origin: string, branch: string | undefined | null) {
	const filePath = window.activeTextEditor?.document.fileName

	if (!filePath) {
		return Uri.parse(origin)
	}

	const fileRelativePath = getRelativeFilePath(filePath)
	const url = `${origin}/blob/${branch}/${fileRelativePath}`
	return Uri.parse(url)
}

export function getRelativeFilePath(path: string) {
	let relativePath = workspace.asRelativePath(path)

	// if is a workspace folder, the relative path has the format "workspaceFolderName/relativePath", so we find and remove the workspaceFolderName
	const { workspaceFolders } = workspace
	if (workspaceFolders && workspaceFolders.length > 0) {
		const { activeTextEditor } = window
		const editorPath = activeTextEditor && activeTextEditor.document.uri.fsPath
		const rootPath = getRootPath(editorPath)

		const workspaceFolder = workspaceFolders.find(wf => wf.uri.fsPath === rootPath)
		if (workspaceFolder) {
			relativePath = relativePath.replace(`${workspaceFolder.name}/`, '')
		}
	}

	return relativePath
}

export function isSubPath(childPath: string, parentPath = '') {
	const relativePath = path.relative(parentPath, childPath)
	return !!relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)
}

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

export function isNodeModuleFile(path: string) {
	return path.includes('node_modules/')
}

export function checkGitFile(path: string) {
	return existsSync(`${path}/.git`)
}
