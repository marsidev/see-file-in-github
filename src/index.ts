import vscode from 'vscode'
import { Logger, getRemoteRepositoryUri, updateStatusBarItem } from './utils'
import { messageByErrorCode } from './constants'

const { window } = vscode

export async function activate(context: vscode.ExtensionContext) {
	const DEV_MODE = context.extensionMode !== vscode.ExtensionMode.Production
	const showLogs = DEV_MODE

	vscode.commands.registerCommand('gitFileViewerButton.open', async () => {
		const result = await getRemoteRepositoryUri()
		if (result.success) {
			showLogs && Logger.success({ uri: result.uri, ...result.logs })
			return vscode.env.openExternal(result.uri)
		}

		window.showErrorMessage(`Error: ${messageByErrorCode[result.code]}`)
		showLogs && Logger.error(result.logs)
	})

	const result = await getRemoteRepositoryUri()

	const statusBar = window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
	statusBar.command = 'gitFileViewerButton.open'

	updateStatusBarItem(statusBar, result)
	showLogs && Logger.log('init', result.logs)

	// toggle icon visibility
	window.onDidChangeActiveTextEditor(async editor => {
		if (!editor) return

		const result = await getRemoteRepositoryUri()
		updateStatusBarItem(statusBar, result)
		showLogs && Logger.log('changeActiveTextEditor', result.logs)
	})
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
