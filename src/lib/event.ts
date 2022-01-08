import EventEmitter from 'eventemitter3'

export enum Action {
    SPEED_NOTIFY = 'speed-notify',
    SPEED_NOTIFY_SINGLE = 'speed-notify-single',
}

class Event {
    protected EE = new EventEmitter()

    notifySpeedTest () {
        this.EE.emit(Action.SPEED_NOTIFY)
    }

    notifySpeedTestForSingleProxy (tagName: string) {
        this.EE.emit(Action.SPEED_NOTIFY_SINGLE, tagName)
    }

    subscribe<T> (event: Action, callback: (data?: T) => void) {
        this.EE.addListener(event, callback)
    }

    unsubscribe<T> (event: Action, callback: (data?: T) => void) {
        this.EE.removeListener(event, callback)
    }
}

export default new Event()
