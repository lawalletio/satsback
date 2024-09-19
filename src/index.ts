import 'websocket-polyfill';
import * as dotenv from 'dotenv';
import { Filter } from 'nostr-tools';
import { sendSatsback } from './services/sendSatsback';
import { generateRelay } from './services/relay';
import { SubscriptionParams } from './types/relay';
import { prisma } from './utils/prismaClient';

dotenv.config();

const start = async () => {
    try {
        // Keys
        const privateKey = Uint8Array.from(
            Buffer.from(process.env.MODULE_PRIVATE_KEY!, 'hex')
        );
        const laposPublicKey = process.env.LAPOS_PUBLIC_KEY!;
        const ledgerPublicKey = process.env.LEDGER_PUBLIC_KEY!;

        // Relay
        const relayUrl = 'wss://relay.lawallet.ar';

        // Filters
        const since: number =
            parseInt(process.env.TIMESTAMP_SECONDS_INIT!) | (Date.now() / 1000);

        const filters: Filter[] = [
            {
                kinds: [1112],
                authors: [ledgerPublicKey],
                '#p': [laposPublicKey],
                '#t': ['internal-transaction-ok'],
                since,
            },
        ];

        // Subscription
        const subscriptionParams: SubscriptionParams = {
            filters,
            callback: async (event) => {
                try {
                    // Check if event is already done
                    const eventDone = await prisma.eventDoneSatsback.findFirst({
                        where: {
                            eventId: event.id,
                        },
                    });

                    if (eventDone) {
                        throw new Error('Event already done');
                    }

                    await sendSatsback(event, ledgerPublicKey, privateKey);

                    // eslint-disable-next-line
                } catch (error: any) {
                    if (error.message === 'User not allowed to make satsback') {
                        console.warn(error.message);
                    } else if (error.message === 'Event already done') {
                        console.warn(error.message);
                    } else {
                        console.error('Error in relay callback:', error);
                    }
                }
            },
        };

        await generateRelay(relayUrl, subscriptionParams, Date.now());
        // eslint-disable-next-line
    } catch (error: any) {
        console.error('Critical Error in start():', error);
    }
};

start();
