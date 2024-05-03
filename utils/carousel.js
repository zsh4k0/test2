const carousel = document.getElementById('carousel')
const stepsControls = document.getElementById('steps-controls')
const carouselItems = carousel.querySelectorAll('[carousel-item]')

class Carousel {
	/**
	 *
	 * @param {HTMLDivElement} carousel
	 * @param {NodeListOf<HTMLDivElement>} carouselItems
	 * @param {HTMLDivElement} stepsControls
	 */

	constructor(carousel, carouselItems, stepsControls) {
		/** @type {HTMLDivElement} */
		this.carousel = carousel
		this.carouselItems = carouselItems
		this.currentItem = carouselItems.length + 1
		/** @type {HTMLDivElement} */
		this.stepsControls = stepsControls
		this.transitionIsRunning = false
		this.skipInterval = false
	}

	AddStep(add = true) {
		const toAdd = add ? 1 : -1
		this.currentItem =
			(this.currentItem + toAdd) % this.carouselItems.length
		if (this.currentItem < 0) {
			this.currentItem = this.carouselItems.length - 1
		}

		this.markControlStep()
	}

	/**
	 *
	 * @param {"back"|"forward"} direction
	 */
	goTo(direction, transition = true, steps = 1, callback) {
		// Cancel if there is a transition running
		if (this.transitionIsRunning) return
		this.transitionIsRunning = true
		this.AddStep(direction == 'forward')
		let child = this.carousel.firstElementChild
		if (direction == 'back') child = this.carousel.lastElementChild
		const were = direction == 'back' ? 'afterbegin' : 'beforeend'
		const width = parseFloat(getComputedStyle(child).width)
		const translateX = direction == 'back' ? 0 : width * 2

		transition && this.carousel.classList.add('transition')
		this.carousel.style.transform = `translateX(-${translateX}px)`
		const reset = () => {
			this.carousel.classList.remove('transition')
			this.carousel.insertAdjacentElement(were, child)
			this.transitionIsRunning = false
			this.carousel.style.transform = `translateX(-${width}px)`
			this.carousel.style.transitionDuration = null
		}
		!transition && reset()
		this.carousel.ontransitionend = () => {
			reset()
			steps--
			this.carousel.ontransitionend = null
			if (steps > 0) this.goTo(direction, transition, steps)
			if (callback && steps <= 0) callback()
		}
	}

	goToStep(step) {
		const move = step - this.currentItem
		this.skipInterval = true
		if (move > 0) this.goTo('forward', true, move)
		else if (move < 0) this.goTo('back', true, -move)
	}

	markControlStep() {
		this.stepsControls.childNodes.forEach((step, i) => {
			if (i == this.currentItem) step.classList.add('active')
			else step.classList.remove('active')
		})
	}
	setStepsControls() {
		this.carouselItems.forEach((_, i) => {
			const step = document.createElement('DIV')
			step.classList.add('step')
			step.onclick = () => this.goToStep(i)
			this.stepsControls.appendChild(step)
		})
	}

	printImages() {
		this.carouselItems.forEach((item) => {
			const img = item.getAttribute('data-bg')
			if (!img) return
			item.style.backgroundImage = `url(${img})`
			console.log(img.src)
		})
	}

	back() {
		this.skipInterval = true
		this.goTo('back')
	}

	forward() {
		this.skipInterval = true
		this.goTo('forward')
	}
	start() {
		this.printImages()
		this.setStepsControls()
		this.goTo('back')
		onresize = () => this.goTo('back', false)
		setInterval(() => {
			if (this.skipInterval) return (this.skipInterval = false)
			theCarousel.goTo('forward')
		}, 5000)
	}
}

const theCarousel = new Carousel(carousel, carouselItems, stepsControls)
theCarousel.start()

document.getElementById('carousel-forward').onclick = () =>
	theCarousel.forward()
document.getElementById('carousel-back').onclick = () => theCarousel.back()
