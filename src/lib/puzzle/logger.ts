import { SessionEvent } from './types';

/**
 * A lightweight, local-only logger for puzzle sessions.
 * In a real-world scenario, this might dispatch to a remote analytics service.
 * Here, we simply keep a bounded array in memory (or localStorage) to aid debugging.
 */
class SessionLogger {
    private events: SessionEvent[] = [];
    private readonly MAX_EVENTS = 1000;

    /**
     * Logs a new session event.
     */
    log(event: Omit<SessionEvent, 'timestamp'>) {
        const fullEvent: SessionEvent = {
            ...event,
            timestamp: Date.now(),
        };

        this.events.push(fullEvent);

        // Prevent memory leaks by capping the log size
        if (this.events.length > this.MAX_EVENTS) {
            this.events.shift(); // Remove oldest
        }

        if (process.env.NODE_ENV === 'development') {
            console.debug(`[SessionLog] ${fullEvent.eventType} | Session: ${fullEvent.sessionId}`, fullEvent.details || '');
        }
    }

    /**
     * Retrieves all logged events, optionally filtered by session ID.
     */
    getEvents(sessionId?: string): SessionEvent[] {
        if (sessionId) {
            return this.events.filter(e => e.sessionId === sessionId);
        }
        return [...this.events];
    }

    /**
     * Clears the event log.
     */
    clear() {
        this.events = [];
    }
}

export const sessionLogger = new SessionLogger();
