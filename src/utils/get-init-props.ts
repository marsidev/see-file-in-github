import { window } from 'vscode'
import { simpleGit } from 'simple-git'
import { checkGitFile } from '../utils'
import { Logger } from './logger'
import { getRootPath } from './get-root-path'

interface InitProps {
	branch: string | null | undefined
	origin: string | null | undefined
	rootPath: string | null | undefined
	editorPath: string | null | undefined
}

const git = simpleGit()

export async function getInitProps(): Promise<InitProps> {
	let branch: string | undefined | null
	let origin: string | undefined | null

	const { activeTextEditor } = window
	const editorPath = activeTextEditor && activeTextEditor.document.uri.fsPath
	const rootPath = getRootPath(editorPath)

	const isGitRepo = checkGitFile(rootPath ?? '')

	if (!rootPath || !isGitRepo) {
		return { origin: null, branch: null, rootPath: null, editorPath: null }
	}

	try {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		git.cwd(rootPath)

		await git.raw('config', '--global', '--add', 'safe.directory', '*')

		branch = (await git.branch()).current
		origin = (await git.getConfig('remote.origin.url')).value?.replace('.git', '')
	} catch (e) {
		Logger.error(e)
	}

	return { branch, origin, rootPath, editorPath }
}
