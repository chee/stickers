(function(){
	function toggleClass (element, className) {
		if (element.classList.contains(className)) {
			element.classList.remove(className)
		} else {
			element.classList.add(className)
		}
	}

	window.addEventListener('click', function (event) {
		var element = event.target;
		var focused = document.querySelector('.focus')
		if (focused) {
			focused.classList.remove('focus')
		}
		if (element.tagName == 'I') {
			toggleClass(element, 'focus')
		}
	})
})
