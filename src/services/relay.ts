import { Relay } from 'nostr-tools';
import { SubscriptionParams } from '../types/relay';
import { prisma } from '../utils/prismaClient';

async function generateRelay(
    relayUrl: string,
    subscriptionCondition?: SubscriptionParams,
    timestamp?: number
) {
    if (!subscriptionCondition)
        console.warn('No subscription condition provided');

    const relay = await Relay.connect(relayUrl);

    const stringTimeToConnection = timestamp
        ? `\n| in: ${Date.now() - timestamp}ms`
        : '';

    console.log(
        '|--',
        '\n| Connected to relay:',
        '\n| url:',
        relay.url,
        '\n| at:',
        Date.now(),
        stringTimeToConnection,
        '\n|--'
    );

    if (subscriptionCondition) {
        relay.subscribe(subscriptionCondition.filters, {
            onevent(event) {
                console.log('Event recived:', event); // debug
                subscriptionCondition.callback(event);
            },
        });
    }

    relay.onclose = async () => {
        console.warn('Relay closed at:', Date.now());

        const lastEvent = await prisma.eventDoneSatsback.findFirst({
            orderBy: {
                timestamp: 'desc',
            },
        });

        if (lastEvent && subscriptionCondition) {
            subscriptionCondition.filters[0].since =
                lastEvent.timestamp.getTime() / 1000 - 10;

            console.log(
                'Reconnecting to relay with since of last event recived before closed.'
            );
            console.log('Event ID:', lastEvent.eventId);
        }

        return await generateRelay(relayUrl, subscriptionCondition, Date.now());
    };

    return relay;
}

export { generateRelay };
