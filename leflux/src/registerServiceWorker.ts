import { registerSW } from 'virtual:pwa-register';

const FIVE_MINUTES = 1000 * 60 * 5;

export function registerServiceWorker() {
	const updateSW = registerSW({
		immediate: true,
		onOfflineReady() {
			console.info('LeFlux is ready to work offline.');
		},
			onRegisteredSW(swUrl: string, registration: ServiceWorkerRegistration | undefined) {
			void swUrl;
			if (registration) {
				setInterval(() => {
					registration.update().catch(() => {
						/* silent */
					});
				}, FIVE_MINUTES);
			}
		},
	});

	return updateSW;
}