import 'websocket-polyfill';
import * as dotenv from 'dotenv';
import { makeEvent } from './utils/nostrEvent';
import { ndkClient } from './services/ndk';
import {
    NDKEvent,
    NDKFilter,
    NDKKind,
    NDKSubscription,
    NDKSubscriptionOptions,
} from '@nostr-dev-kit/ndk';

dotenv.config();

const start = async () => {
    try {
        // NDK
        await ndkClient.init();

        const ndk = ndkClient.getInstance();

        // Subscribe to events
        const laposPublicKey = process.env.LAPOS_PUBLIC_KEY!;
        const ledgerPublicKey = process.env.LEDGER_PUBLIC_KEY!;

        const subscriptionFilter: NDKFilter = {
            kinds: [1112 as NDKKind],
            authors: [ledgerPublicKey],
            '#p': [laposPublicKey],
            '#t': ['internal-transaction-ok'],
            limit: 0,
        };

        const subscriptionOptions: NDKSubscriptionOptions = {
            closeOnEose: false,
        };

        const subscription: NDKSubscription = ndk.subscribe(
            subscriptionFilter,
            subscriptionOptions,
            ndk.devWriteRelaySet,
            true
        );

        subscription.on('event', async (event: NDKEvent) => {
            try {
                console.log('Event received');

                const eventTags = event.tags;
                for (const tag in eventTags) {
                    const userPublicKey =
                        tag === '0' ? eventTags[tag][1] : null;

                    // To Do: validate that the user is of lawallet

                    const amount = JSON.parse(event.content).tokens.BTC;

                    await sendCashBack(
                        userPublicKey!,
                        amount,
                        ledgerPublicKey,
                        ndk
                    );

                    break;
                }

                // eslint-disable-next-line
            } catch (error: any) {
                console.error('Error processing event in subscription:', error);
            }
        });

        subscription.on('close', () => {
            console.log('Subscription closed');

            subscription.start();

            console.log('Subscription started');
        });
    } catch {
        console.error('Error general');
    }
};

const sendCashBack = async (
    userPublicKey: string,
    amount: number,
    ledgerPublicKey: string,
    // eslint-disable-next-line
    ndk: any
) => {
    try {
        // Make event
        const event = await makeEvent(
            userPublicKey,
            amount,
            ledgerPublicKey,
            ndk
        );

        // Options for fetch
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        };

        // Publish event to relay.lawallet.ar
        const response = await fetch(
            'https://api.lawallet.ar/nostr/publish/',
            options
        );

        if (!response.ok) {
            throw new Error(`Failed to send cash back: ${response.statusText}`);
        }

        console.log('Cash back sent');

        // eslint-disable-next-line
    } catch (error: any) {
        console.error('Error in sendCashBack:', error);
        throw error;
    }
};

start();
