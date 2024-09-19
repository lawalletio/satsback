import { Relay } from 'nostr-tools';
import { SubscriptionParams } from '../types/relay';

async function generateRelay(
    relayUrl: string,
    subscriptionCondition?: SubscriptionParams,
    timestamp?: number
) {
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
                console.log('Event recived:', event);
                subscriptionCondition.callback(event);
            },
        });
    }

    relay.onclose = async () => {
        console.warn('Relay closed at:', Date.now());
        return await generateRelay(relayUrl, subscriptionCondition, Date.now());
    };

    return relay;
}

export { generateRelay };
