import { describe, expect, it } from 'vitest'
import { formatBitbucketRemoteUrl } from '../src/utils/format-bitbucket-remote-url'

describe('formatBitbucketRemoteUrl', () => {
	it('returns the correct URL for valid input that needs to be converted', () => {
		const inputUrl = 'https://myusername@bitbucket.org/myworkspace/myrepo'
		const expectedOutputUrl = 'https://bitbucket.org/myusername/myrepo'
		expect(formatBitbucketRemoteUrl(inputUrl)).toEqual(expectedOutputUrl)
	})

	it('returns the input URL unchanged if already in the correct format', () => {
		const inputUrl = 'https://bitbucket.org/myusername/myrepo'
		expect(formatBitbucketRemoteUrl(inputUrl)).toEqual(inputUrl)
	})

	it('throws an error for an input URL with an unrecognized format', () => {
		const inputUrl = 'https://github.com/myusername/myrepo'
		expect(() => formatBitbucketRemoteUrl(inputUrl)).toThrow(
			`Invalid Bitbucket URL format: ${inputUrl}`,
		)
	})
})
