import { Uri, window } from 'vscode'
import {
	generateRemoteRepositoryUri,
	getInitProps,
	getRelativeFilePath,
	isNodeModuleFile,
	isSubPath,
} from './utils'

type ErrorCode = 'NOT_GIT_REPO' | 'NOT_GIT_BRANCH' | 'NOT_WORKSPACE_FILE'

export const messageByErrorCode: Record<ErrorCode, string> = {
	NOT_GIT_REPO: 'Remote repository not found',
	NOT_GIT_BRANCH: 'Branch not found',
	NOT_WORKSPACE_FILE: 'File not in workspace',
}

export async function getRemoteRepositoryUri(): Promise<
	{ success: false; code: ErrorCode } | { success: true; uri: Uri }
> {
	const filePath = window.activeTextEditor?.document.fileName

	const { branch, origin, rootPath } = await getInitProps()

	if (!origin) {
		return { success: false, code: 'NOT_GIT_REPO' }
	}

	if (filePath && !branch) {
		// is a file but the branch is not defined
		return { success: false, code: 'NOT_GIT_BRANCH' }
	}

	const relativePath = getRelativeFilePath(filePath ?? '')
	const _isNodeModuleFile = isNodeModuleFile(relativePath)
	const _isSubPath = isSubPath(filePath ?? '', rootPath ?? '')

	if (filePath && (!_isSubPath || _isNodeModuleFile)) {
		// is a file but is not in the workspace, e.g. Untitled-1 (a new file)
		return { success: false, code: 'NOT_WORKSPACE_FILE' }
	}

	const uri = generateRemoteRepositoryUri(origin, branch)
	return { success: true, uri }
}
