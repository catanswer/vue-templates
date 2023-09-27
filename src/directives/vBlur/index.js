export default  (app) => {
	app.directive('blur', {
		mounted(el) {
			el.addEventListener('focus', () => {
				el.blur()
			})
		},
		unmounted(el) {
			el.removeEventListener('focus', () => {})
		},
	})
}
