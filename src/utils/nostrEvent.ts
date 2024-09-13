import NDK, { NDKEvent } from '@nostr-dev-kit/ndk';
import { UnsignedEvent } from 'nostr-tools';

const whitelistPublicKeys = {
    pulpo: '9c38f29d508ffdcbe6571a7cf56c963a5805b5d5f41180b19273f840281b3d45',
    agustin: 'a1b0f9fdc84a81e1fa3b0289de83486792d68407f9e13baf22850f1f1f9b61b2',
    juan: '3699cf3fab1aa22dad84155639d35911013c63bbe6e26818e2584ed12cebeb6e',
    rapax: '994d52a31d3efd0ac661b1940e3f3dcae49c750d6dd90c68600589f272e3bc85',
    dios: 'cee287bb0990a8ecbd1dee7ee7f938200908a5c8aa804b3bdeaed88effb55547',
};

const whitelistVolunteers = {};

async function makeEvent(
    userPubkey: string,
    amount: number,
    ledgerPubkey: string,
    ndk: NDK
): Promise<NDKEvent> {
    try {
        // Check if user is allowed to make cash back
        if (!Object.values(whitelistPublicKeys).includes(userPubkey)) {
            throw new Error('User not allowed to make cash back');
        }

        // Cash back rate
        let cashBackRate = 0.5; // Default cash back rate

        if (Object.values(whitelistVolunteers).includes(userPubkey)) {
            cashBackRate = 0.8; // Volunteer cash back rate
        }

        // Make event
        const modulePubkey = (await ndk.signer!.user()).pubkey;

        const content = {
            tokens: {
                BTC: amount * cashBackRate,
            },
            memo: 'cash back test',
        };

        const unsignedEvent: UnsignedEvent = {
            kind: 1112,
            tags: [
                ['p', ledgerPubkey],
                ['p', userPubkey],
                ['t', 'internal-transaction-start'],
            ],
            content: JSON.stringify(content),
            created_at: Math.round(Date.now() / 1000) + 1,
            pubkey: modulePubkey,
        };

        const ndkEvent: NDKEvent = new NDKEvent(ndk, unsignedEvent);

        await ndkEvent.sign();

        return ndkEvent;

        // eslint-disable-next-line
    } catch (error: any) {
        console.error('Error in makeEvent:', error);
        throw error;
    }
}

export { makeEvent };
