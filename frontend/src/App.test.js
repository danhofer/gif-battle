import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Lobby from './Lobby'
import { MockServer } from './mockServer.js'

it('renders without crashing', () => {
	const div = document.createElement('div')
	ReactDOM.render(<App server={new MockServer()} />, div)
	ReactDOM.unmountComponentAtNode(div)
})

// it('allows a player to join', () => {
// 	const div = document.createElement('div')
// 	const server = new MockServer()

// 	ReactDOM.render(<Lobby server={server} />, div)
// 	server.dispatchEvent(
// 		new CustomEvent('playerJoined', { detail: { name: 'joel' } })
// 	)
// 	// check that the player div has joel in it
// 	ReactDOM.unmountComponentAtNode(div)
// })

// const puppeteer = require('puppeteer')

// const isDebugging = () => {
// 	// const debugging_mode = {
// 	// 	headless: false,
// 	// 	// slowMo: 250,
// 	// 	// devtools: true,
// 	// }
// 	// return process.env.NODE_ENV === 'debug' ? debugging_mode : {}
// }

// it('google loads correctly', async () => {
// 	const browser = await puppeteer.launch({ headless: false })
// 	let page = await browser.newPage()

// 	await page.goto('http://localhost:3000')
// 	await page.click('button.EnterGame')
// 	await page.keyboard.type('dduuuuddeee')
// 	await page.keyboard.press('Enter')

// 	const gameRoomId = await page.evaluate(() => {
// 		return document
// 			.querySelector('div.GameRoomID')
// 			.textContent.substring('Game Room ID: '.length)
// 	})

// 	await expect(gameRoomId).resolves.toMatch('game1')
// 	await browser.close()

// 	// await expect(page.title()).resolves.toMatch('Google')
// })
