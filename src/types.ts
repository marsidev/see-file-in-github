import { TextEditor } from 'vscode'

export type ErrorCode = 'NO_ORIGIN_REMOTE' | 'NO_GIT_BRANCH' | 'NO_WORKSPACE_FILE' | 'NO_GIT_FILE'

export interface Logs {
	branch: string | undefined | null
	origin: string | undefined | null
	rootPath: string | undefined | null
	filePath: string | undefined | null
	hasGitFile: boolean
	relativePath?: string
	_isNodeModuleFile?: boolean
	_isSubPath?: boolean
	code?: ErrorCode
	fileRelativePath?: string
	url?: string
	isGitLabRepo?: boolean
	isGitHubRepo?: boolean
	isBitbucketRepo?: boolean
	activeTextEditor?: TextEditor
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
	...args: any
) => Promise<infer R>
	? R
	: any
/* eslint-enable @typescript-eslint/no-explicit-any */
