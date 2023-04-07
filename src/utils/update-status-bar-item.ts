import vscode from 'vscode'
import { AsyncReturnType } from '../types'
import { getRemoteRepositoryUri } from './get-remote-repository-uri'

export function updateStatusBarItem(
	item: vscode.StatusBarItem,
	result: AsyncReturnType<typeof getRemoteRepositoryUri>,
) {
	if (result.success) {
		const provider = result.logs.isGitLabRepo
			? 'GitLab'
			: result.logs.isBitbucketRepo
			? 'Bitbucket'
			: 'GitHub'

		const icon = result.logs.isGitHubRepo ? '$(github)' : '$(file-symlink-file) '
		item.text = `${icon} See in ${provider}`
		item.tooltip = `See file in ${provider}`

		return item.show()
	}

	item.hide()
}
