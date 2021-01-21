export function getDayOfWeek() {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[(new Date()).getDay()]
}