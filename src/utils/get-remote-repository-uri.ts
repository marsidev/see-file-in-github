import { Uri, window } from 'vscode'
import { ErrorCode, Logs } from '../types'
import { generateRemoteRepositoryUri } from './generate-remote-repository-uri'
import { getRelativeFilePath } from './get-relative-file-path'
import { getInitProps } from './get-init-props'
import { checkGitFile, isNodeModuleFile, isSubPath } from '.'

type GetRemoteRepositoryUriFn = () => Promise<
	{ success: false; code: ErrorCode; logs: Logs } | { success: true; uri: Uri; logs: Logs }
>

export const getRemoteRepositoryUri: GetRemoteRepositoryUriFn = async () => {
	const { activeTextEditor } = window
	const filePath = activeTextEditor?.document.fileName

	const { branch, origin, rootPath } = await getInitProps()
	const hasGitFile = checkGitFile(rootPath ?? '')

	let logs: Logs = { branch, origin, rootPath, filePath, hasGitFile, activeTextEditor }

	if (!hasGitFile) {
		const code = 'NO_GIT_FILE'
		logs = { ...logs, code }
		return { success: false, code, logs }
	}

	if (!origin) {
		// is a git repo but the remote origin is not defined or not found
		const code = 'NO_ORIGIN_REMOTE'
		logs = { ...logs, code }
		return { success: false, code, logs }
	}

	if (filePath && !branch) {
		// is a file but the branch is not defined
		const code = 'NO_GIT_BRANCH'
		logs = { ...logs, code }
		return { success: false, code, logs }
	}

	const relativePath = getRelativeFilePath(filePath ?? '')
	const _isNodeModuleFile = isNodeModuleFile(relativePath)
	const _isSubPath = isSubPath(filePath ?? '', rootPath ?? '')

	logs = { ...logs, relativePath, _isNodeModuleFile, _isSubPath }

	if (filePath && (!_isSubPath || _isNodeModuleFile)) {
		// is a file but is not in the workspace, e.g. Untitled-1 (a new file)
		// or is a node_module file
		const code = 'NO_WORKSPACE_FILE'
		logs = { ...logs, code }
		return { success: false, code, logs }
	}

	const res = generateRemoteRepositoryUri(origin, branch)
	if (res.success) {
		logs = { ...logs, ...res.logs }
		return { success: true, uri: res.uri, logs }
	}

	logs = { ...logs, ...res.logs }
	return { success: false, code: 'NO_ORIGIN_REMOTE', logs }
}
