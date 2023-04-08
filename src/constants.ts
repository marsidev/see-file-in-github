import { l10n } from 'vscode'
import { ErrorCode, Provider } from './types'

export const labelByProvider: Record<Provider, string> = {
	GitHub: l10n.t('See in GitHub'),
	GitLab: l10n.t('See in GitLab'),
	Bitbucket: l10n.t('See in Bitbucket'),
}

export const tooltipByProvider: Record<Provider, string> = {
	GitHub: l10n.t('See file in GitHub'),
	GitLab: l10n.t('See file in GitLab'),
	Bitbucket: l10n.t('See file in Bitbucket'),
}

export const messageByErrorCode: Record<ErrorCode, string> = {
	NO_ORIGIN_REMOTE: l10n.t('Remote repository not found'),
	NO_GIT_BRANCH: l10n.t('Branch not found'),
	NO_WORKSPACE_FILE: l10n.t('File not in workspace'),
	NO_GIT_FILE: l10n.t('This workspace is not a git repository'),
}
