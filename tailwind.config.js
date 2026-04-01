/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./components/**/*.{vue,js,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./nuxt.config.{js,ts}'
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				rajdhani: ['Rajdhani', 'sans-serif']
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			'light',
			'dark',
			'cupcake',
			'dracula',
			'synthwave',
			'retro',
			'cyberpunk',
			'valentine',
			'aqua',
			'lofi'
		],
		darkTheme: 'dark',
		base: true,
		styled: true,
		utils: true,
		prefix: '',
		logs: false
	}
}
