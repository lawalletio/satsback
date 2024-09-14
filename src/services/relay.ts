import { Relay } from 'nostr-tools';
import { SubscriptionParams } from '../types/relay';

async function generateRelay(
    relayUrl: string,
    subscriptionCondition?: SubscriptionParams
) {
    const relay = await Relay.connect(relayUrl);

    console.log('Connected to relay:', relay.url);

    if (subscriptionCondition) {
        relay.subscribe(subscriptionCondition.filters, {
            onevent(event) {
                console.log('Event recived:', event);
                subscriptionCondition.callback(event);
            },
            async onclose() {
                console.log('Relay closed');
                return await generateRelay(relayUrl, subscriptionCondition);
            },
        });
    }

    return relay;
}

export { generateRelay };
