import { Uri, window } from 'vscode'
import { Logs } from '../types'
import { Logger } from './logger'
import { formatBitbucketRemoteUrl } from './format-bitbucket-remote-url'
import { getRelativeFilePath } from './get-relative-file-path'

type GenerateRemoteRepositoryUriFn = (
	origin: string,
	branch: string | undefined | null,
) =>
	| { uri: Uri; logs: Partial<Logs>; success: true }
	| { uri: null; logs: Partial<Logs>; success: false }

export const generateRemoteRepositoryUri: GenerateRemoteRepositoryUriFn = (origin, branch) => {
	const filePath = window.activeTextEditor?.document.fileName

	if (!filePath) {
		// there is no active file
		return {
			uri: Uri.parse(origin),
			logs: {},
			success: true,
		}
	}

	const fileRelativePath = getRelativeFilePath(filePath)
	const isBitbucketRepo = origin.includes('bitbucket.org')
	const isGitLabRepo = origin.includes('gitlab.com')
	const isGitHubRepo = origin.includes('github.com')
	const sep = isBitbucketRepo ? 'src' : 'blob'

	if (isBitbucketRepo) {
		try {
			origin = formatBitbucketRemoteUrl(origin)
		} catch (error) {
			Logger.error(error)
			return {
				uri: null,
				logs: { isBitbucketRepo, isGitLabRepo, isGitHubRepo, error, fileRelativePath },
				success: false,
			}
		}
	}

	const url = `${origin}/${sep}/${branch}/${fileRelativePath}`

	return {
		uri: Uri.parse(url),
		logs: { fileRelativePath, isGitLabRepo, isGitHubRepo, isBitbucketRepo, url },
		success: true,
	}
}
