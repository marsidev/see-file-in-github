import vscode from 'vscode'
import { AsyncReturnType, Provider } from '../types'
import { labelByProvider, tooltipByProvider } from '../constants'
import { getRemoteRepositoryUri } from './get-remote-repository-uri'

export function updateStatusBarItem(
	item: vscode.StatusBarItem,
	result: AsyncReturnType<typeof getRemoteRepositoryUri>,
) {
	if (result.success) {
		const provider: Provider = result.logs.isGitLabRepo
			? 'GitLab'
			: result.logs.isBitbucketRepo
			? 'Bitbucket'
			: 'GitHub'

		const icon = result.logs.isGitHubRepo ? '$(github)' : '$(file-symlink-file) '
		item.text = `${icon} ${labelByProvider[provider]}`
		item.tooltip = tooltipByProvider[provider]

		return item.show()
	}

	item.hide()
}
