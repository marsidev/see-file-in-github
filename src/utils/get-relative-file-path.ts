import { window, workspace } from 'vscode'
import { getRootPath } from './get-root-path'

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
