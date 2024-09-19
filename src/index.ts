import 'websocket-polyfill';
import * as dotenv from 'dotenv';
import { Filter } from 'nostr-tools';
import { sendSatsback } from './services/sendSatsback';
import { generateRelay } from './services/relay';
import { SubscriptionParams } from './types/relay';

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
        const filters: Filter[] = [
            {
                kinds: [1112],
                authors: [ledgerPublicKey],
                '#p': [laposPublicKey],
                '#t': ['internal-transaction-ok'],
                limit: 0,
            },
        ];

        // Subscription
        const subscriptionParams: SubscriptionParams = {
            filters,
            callback: async (event) => {
                try {
                    await sendSatsback(event, ledgerPublicKey, privateKey);

                    // eslint-disable-next-line
                } catch (error: any) {
                    if (error.message === 'User not allowed to make satsback') {
                        console.warn(
                            'Unauthorized user tried to make satsback'
                        );
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
