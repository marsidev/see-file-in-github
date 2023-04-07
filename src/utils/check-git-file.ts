import { existsSync } from 'node:fs'

export function checkGitFile(path: string) {
	return existsSync(`${path}/.git`)
}
