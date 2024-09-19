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
        let since: number =
            parseInt(process.env.TIMESTAMP_SECONDS_INIT!) | (Date.now() / 1000);

        const lastEvent = await prisma.eventDoneSatsback.findFirst({
            orderBy: {
                timestamp: 'desc',
            },
        });

        if (lastEvent) {
            since = lastEvent.timestamp.getTime() / 1000 - 10;

            console.log(
                'Conecting to relay with since of last event saved in db'
            );
            console.log('Event ID:', lastEvent.eventId);
        }

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
                    const eventDone = await prisma.eventDoneSatsback.findUnique(
                        {
                            where: {
                                eventId: event.id,
                            },
                        }
                    );

                    if (eventDone) {
                        console.warn('Event already done');
                        return;
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
