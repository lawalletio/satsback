import { NostrEvent } from 'nostr-tools';
import { makeEvent } from '../utils/makeEvent';
import { prisma } from '../utils/prismaClient';

async function sendSatsback(
    event: NostrEvent,
    ledgerPublicKey: string,
    privateKey: Uint8Array
) {
    try {
        // User public key
        const eventTags = event.tags;
        let userPublicKey: string;

        for (const tag in eventTags) {
            if (tag === '0') userPublicKey = eventTags[tag][1];
        }

        // Amount
        const amount = JSON.parse(event.content).tokens.BTC;

        // Make event
        const eventToSent: NostrEvent = await makeEvent(
            event.id,
            amount,
            userPublicKey!,
            ledgerPublicKey,
            privateKey
        );

        // Options for fetch
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventToSent),
        };

        // Publish event to relay.lawallet.ar
        const response = await fetch(
            'https://api.lawallet.ar/nostr/publish/',
            options
        );

        // Error
        if (!response.ok) {
            throw new Error(`Failed to send satsback: ${response.statusText}`);
        }

        console.log('Satsback sent');

        await prisma.eventDoneSatsback.create({
            data: {
                eventId: event.id,
                timestamp: new Date(event.created_at * 1000),
                eventSatsbackId: eventToSent.id,
            },
        });

        // eslint-disable-next-line
    } catch (error: any) {
        console.error('Error in sendSatsback:', error);
        throw error;
    }
}

export { sendSatsback };
