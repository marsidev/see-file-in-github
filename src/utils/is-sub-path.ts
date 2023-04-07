import { isAbsolute, relative } from 'node:path'

export function isSubPath(childPath: string, parentPath = '') {
	const relativePath = relative(parentPath, childPath)
	return !!relativePath && !relativePath.startsWith('..') && !isAbsolute(relativePath)
}
