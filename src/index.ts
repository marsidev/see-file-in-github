import vscode from 'vscode'
import { Logger } from './logger'
import { getRemoteRepositoryUri, messageByErrorCode } from './get-url'

const { window } = vscode

export async function activate(context: vscode.ExtensionContext) {
	const showLogs = context.extensionMode !== vscode.ExtensionMode.Production

	vscode.commands.registerCommand('seeInGitHub.open', async () => {
		const result = await getRemoteRepositoryUri()
		if (result.success) {
			showLogs && Logger.success({ uri: result.uri })
			return vscode.env.openExternal(result.uri)
		}

		const message = `Error: ${messageByErrorCode[result.code]}`
		showLogs && Logger.error(message)
	})

	const statusBar = window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
	statusBar.command = 'seeInGitHub.open'
	statusBar.text = '$(github)'
	statusBar.tooltip = 'See file in GitHub'

	const result = await getRemoteRepositoryUri()
	if (result.success) {
		statusBar.show()
	}

	// toggle github icon
	window.onDidChangeActiveTextEditor(async () => {
		const result = await getRemoteRepositoryUri()
		if (result.success) {
			statusBar.show()
		} else {
			statusBar.hide()
		}
	})
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
