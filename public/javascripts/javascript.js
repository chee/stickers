;(function () {
	var stickersContainer = document.getElementById('stickers');
	var stickers = stickersContainer.querySelectorAll('.js-sticker');
	var stickerEditor = document.getElementById('sticker-editor');
	var foregroundInput = stickerEditor.querySelector('.js-color--foreground');
	var backgroundInput = stickerEditor.querySelector('.js-color--background');
	var editorSticker = stickerEditor.querySelector('.js-sticker');
	var sock = new WebSocket('ws://' + location.host, 'wow');

	window.addEventListener('click', function (event) {
		var sticker = event.target;
		if (!sticker.classList.contains('sticker')) return;
		setEditorSticker({
			foreground: hex(sticker.style.color),
			background: hex(sticker.style.background),
			id: sticker.innerText
		});
		showStickerEditor();
	});

	function colorInputChange () {
		var sticker = document.getElementById(editorSticker.innerText);
		sticker.style.color = editorSticker.style.color = hex(foregroundInput.value);
		sticker.style.background = editorSticker.style.background = hex(backgroundInput.value);
		if (sock && sock.readyState == 1) {
			sock.send(JSON.stringify({
				id: editorSticker.innerText,
				foreground: hex(editorSticker.style.color),
				background: hex(editorSticker.style.background)
			}));
		} else {
			alert('sock is broke, plz refresh or connect to internet or something');
		}
	}

	function decToHex (number) {
		var hex = (+number).toString(16);
		if (hex.length == 1) return '0' + hex;
		return hex;
	}

	function hex(color) {
		if (~color.indexOf('#')) return color;
		var colors = color.replace(/[rgb() ]/g,  '').split(',');
		return '#' + decToHex(colors [0]) + decToHex(colors [1]) + decToHex(colors [2]);
	}

	function setEditorSticker (details) {
		foregroundInput.value = editorSticker.style.color = hex(details.foreground);
		backgroundInput.value = editorSticker.style.background = hex(details.background);
		editorSticker.innerText = details.id;
		editorSticker.id = 'editor-' + details.id;
	}

	function hideStickerEditor () {
		stickerEditor.classList.remove('is-shown');
	}

	function showStickerEditor () {
		stickerEditor.classList.add('is-shown');
	}

	foregroundInput.addEventListener('change', colorInputChange);
	backgroundInput.addEventListener('change', colorInputChange);

	stickerEditor.querySelector('.js-close').addEventListener('click', hideStickerEditor);
	window.addEventListener('keydown', function (event) {
		event.which == 27 && hideStickerEditor();
	});

	sock.addEventListener('message', function (message) {
		message = (function() {
			try {
				return JSON.parse(message.data);
			} catch (error) {
				return;
			}
		})();

		if (!message) return;

		var sticker = document.getElementById(message.id);
		var editorSticker = document.getElementById('editor' + message.id);

		if (sticker) {
			sticker.style.color = message.foreground;
			sticker.style.background = message.background;
		}

		if (editorSticker) {
			editorSticker.style.color = message.foreground;
			editorticker.style.background = message.background;
		}
	});

})();
