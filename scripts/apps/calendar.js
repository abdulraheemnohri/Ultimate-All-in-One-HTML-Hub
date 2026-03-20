const CalendarApp = {
    init(containerId) {
        this.container = document.getElementById(containerId);
        this.date = new Date();
        this.events = Storage.load('calendar_events') || [];
        this.render();
    },

    render() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this.date);

        this.container.innerHTML = `
            <div class="calendar-app">
                <div class="calendar-header">
                    <button onclick="CalendarApp.prevMonth()"><i class="fas fa-chevron-left"></i></button>
                    <h2>${monthName} ${year}</h2>
                    <button onclick="CalendarApp.nextMonth()"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="calendar-grid">
                    <div class="day-name">Sun</div><div class="day-name">Mon</div><div class="day-name">Tue</div>
                    <div class="day-name">Wed</div><div class="day-name">Thu</div><div class="day-name">Fri</div><div class="day-name">Sat</div>
                    ${this.generateDays(firstDay, daysInMonth)}
                </div>
                <div id="event-modal" class="modal" style="display:none">
                    <div class="modal-content">
                        <h3>Add Event</h3>
                        <input type="text" id="event-title" placeholder="Event Title">
                        <button onclick="CalendarApp.saveEvent()">Save</button>
                        <button onclick="CalendarApp.closeModal()">Cancel</button>
                    </div>
                </div>
            </div>
            <style>
                .calendar-app { height: 100%; display: flex; flex-direction: column; }
                .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); flex-grow: 1; border: 1px solid var(--border-color); }
                .day-name { padding: 5px; text-align: center; background: rgba(0,0,0,0.05); font-weight: bold; border-bottom: 1px solid var(--border-color); }
                .day { min-height: 60px; padding: 5px; border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); position: relative; cursor: pointer; }
                .day:hover { background: rgba(0,0,0,0.02); }
                .day.today { background: rgba(0, 120, 212, 0.1); }
                .event-dot { background: var(--accent-color); color: white; font-size: 0.7rem; padding: 2px 4px; border-radius: 3px; margin-top: 2px; white-space: nowrap; overflow: hidden; }
                .modal { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
                .modal-content { background: var(--window-bg); padding: 20px; border-radius: 8px; }
            </style>
        `;
    },

    generateDays(firstDay, daysInMonth) {
        let html = '';
        const today = new Date();
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="day empty"></div>';
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = today.getDate() === day && today.getMonth() === this.date.getMonth() && today.getFullYear() === this.date.getFullYear();
            const dateStr = `${this.date.getFullYear()}-${this.date.getMonth()}-${day}`;
            const dayEvents = this.events.filter(e => e.date === dateStr);

            html += `
                <div class="day ${isToday ? 'today' : ''}" onclick="CalendarApp.openModal('${dateStr}')">
                    <span>${day}</span>
                    ${dayEvents.map(e => `<div class="event-dot">${e.title}</div>`).join('')}
                </div>
            `;
        }
        return html;
    },

    prevMonth() {
        this.date.setMonth(this.date.getMonth() - 1);
        this.render();
    },

    nextMonth() {
        this.date.setMonth(this.date.getMonth() + 1);
        this.render();
    },

    openModal(date) {
        this.selectedDate = date;
        document.getElementById('event-modal').style.display = 'flex';
    },

    closeModal() {
        document.getElementById('event-modal').style.display = 'none';
    },

    saveEvent() {
        const title = document.getElementById('event-title').value;
        if (title) {
            this.events.push({ id: Utils.generateId(), title, date: this.selectedDate });
            Storage.save('calendar_events', this.events);
            this.closeModal();
            this.render();
        }
    }
};
