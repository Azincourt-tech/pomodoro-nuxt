export const splitValue = (value: number | string, padSize = 2) =>
	`${value}`.padStart(padSize, '0').split('')

export const scrollToElement = (selector: string) => {
	const el: HTMLElement | null = document.querySelector(selector)
	const mq = window.matchMedia('(max-width: 639px)')
	if (el && mq.matches) el.scrollIntoView({ block: 'start', behavior: 'smooth' })
}

export const getRandomNumber = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min) + min)

export const playAudio = (path: string) => new Audio(path).play()

export const sendNotification = (title: string, options: object) => new Notification(title, options)
