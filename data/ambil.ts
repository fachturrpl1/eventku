import { events, type Event } from '@/data/events';

function jeda(ms : number) {
    return new Promise((r) => setTimeout(r, ms))
}

export async function ambilEvents() {
    await jeda(1500);
    return events;
}

export async function ambilEvent(id: number): Promise<Event | undefined> {
    await jeda(1000);
    return events.find((e) => e.id === id);
}

export async function ambilTerkait(event: Event ) {
    await jeda(2000);
    return events.filter((e) => e.kategori === event.kategori && e.id !== event.id);
}