
export const SAVE_LANGUAGE = 'SAVE_LANGUAGE';
export const NOTIFICATION_COUNT = 'NOTIFICATION_COUNT';

// User class if we need it
export class BrowserSettings {
  language: string = 'mm';
}

export function browserSettingsReducer(state: BrowserSettings = null, action: { type: string, payload?: any }) {
	if(state == null) return new BrowserSettings();
	switch (action.type) {
		case SAVE_LANGUAGE:
			return Object.assign({}, state, { language: action.payload });

		case NOTIFICATION_COUNT:
			return Object.assign({}, state, { notificationCount: action.payload });

		default:
			return state;
	}
}
