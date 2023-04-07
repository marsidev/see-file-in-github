/**
 * Converts an input URL in the format `https://{username}@bitbucket.org/{workspace}/{repo}`
 * to the format `https://bitbucket.org/{username}/{repo}`, or returns the input URL unchanged
 * if it already has the correct format. Throws an error if the input URL is not in one of the
 * expected formats.
 *
 * @param {string} url - The input URL to convert.
 * @returns The output URL in the expected format.
 * @throws If the input URL is not in the expected format.
 */
export function formatBitbucketRemoteUrl(url: string): string {
	const regex = /^https?:\/\/bitbucket.org\/([\w-]+)\/([\w-]+)$/
	if (url.match(regex)) {
		return url
	}

	const match = url.match(/^https:\/\/([\w-]+)@bitbucket.org\/([\w-]+)\/([\w-]+)$/)
	if (match) {
		const [, username, _workspace, repo] = match
		return `https://bitbucket.org/${username}/${repo}`
	} else {
		throw new Error(`Invalid Bitbucket URL format: ${url}`)
	}
}
