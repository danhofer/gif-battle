;(async function() {
	const puppeteer = require('puppeteer')
	const browser = await puppeteer.launch({ headless: false })

	const page = await browser.newPage()

	await page.goto('http://localhost:3000')
	await page.click('button.EnterGame')
	await page.keyboard.type('dduuuuddeee')
	await page.keyboard.press('Enter')

	const gameRoomId = await page.evaluate(() => {
		return document
			.querySelector('div.GameRoomID')
			.textContent.substring('Game Room ID: '.length)
	})

	const divs = await page.evaluate(() => {
		const divs = Array.from(document.querySelectorAll('div.player'))
		return divs.map(div => div.textContent)
	})

	console.log(divs)

	const page2 = await browser.newPage()
	await page2.goto('http://localhost:3000')

	await page2.keyboard.type(gameRoomId)
	await page2.click('button.JoinGame')
	await page2.keyboard.type('guy')
	await page2.keyboard.press('Enter')

	await new Promise(x => setTimeout(x, 100))

	const divs2 = await page.evaluate(() => {
		const divs = Array.from(document.querySelectorAll('div.player'))
		return divs.map(div => div.textContent)
	})

	console.log(divs2)

	// instead of console.log, compare with what is expected, and then throw error if wrong
	// google puppeteer + jest

	await new Promise(x => setTimeout(x, 1000))

	await browser.close()
})()
