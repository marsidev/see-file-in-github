/* eslint-disable @typescript-eslint/no-explicit-any */
type LogType = 'log' | 'success' | 'error' | 'warn'

const colors = {
	success: '#61BF6D',
	error: '#FF4A4A',
	warn: '#FFB100',
	log: '#0074D9',
}

const methods = {
	log: console.log,
	success: console.log,
	error: console.error,
	warn: console.warn,
}

const messages = {
	log: '[seeInGitHub][Log]',
	success: '[seeInGitHub][Success]',
	error: '[seeInGitHub][Error]',
	warn: '[seeInGitHub][Warning]',
}

function log(type: LogType, message: string, ...args: any[]): void {
	const fn = methods[type]

	const logMessage = `%c ${message} %c`
	const logArgs = [`background-color: ${colors[type]}; color: white; padding: 2px;`, '', ...args]

	fn(logMessage, ...[...logArgs, { timestamp: Date.now() }])
}

export const Logger = {
	log: (...args: any[]) => log('log', messages.log, ...args),
	success: (...args: any[]) => log('success', messages.success, ...args),
	error: (...args: any[]) => log('error', messages.error, ...args),
	warn: (...args: any[]) => log('warn', messages.warn, ...args),
}
