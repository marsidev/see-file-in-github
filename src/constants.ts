import { ErrorCode } from './types'

export const messageByErrorCode: Record<ErrorCode, string> = {
	NO_ORIGIN_REMOTE: 'Remote repository not found',
	NO_GIT_BRANCH: 'Branch not found',
	NO_WORKSPACE_FILE: 'File not in workspace',
	NO_GIT_FILE: 'No git repository found',
}
