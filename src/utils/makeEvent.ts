import { EventTemplate, finalizeEvent, NostrEvent } from 'nostr-tools';
import * as dotenv from 'dotenv';

dotenv.config();

const whitelistPublicKeys = {
    pulpo: '9c38f29d508ffdcbe6571a7cf56c963a5805b5d5f41180b19273f840281b3d45',
    agustin: 'a1b0f9fdc84a81e1fa3b0289de83486792d68407f9e13baf22850f1f1f9b61b2',
    juan: '3699cf3fab1aa22dad84155639d35911013c63bbe6e26818e2584ed12cebeb6e',
    rapax: '994d52a31d3efd0ac661b1940e3f3dcae49c750d6dd90c68600589f272e3bc85',
    dios: 'cee287bb0990a8ecbd1dee7ee7f938200908a5c8aa804b3bdeaed88effb55547',
};

const whitelistVolunteers = {
    pulpo: '9c38f29d508ffdcbe6571a7cf56c963a5805b5d5f41180b19273f840281b3d45',
};

async function makeEvent(
    amount: number,
    userPubkey: string,
    ledgerPubkey: string,
    privateKey: Uint8Array
): Promise<NostrEvent> {
    try {
        // Check if user is allowed to make satsback // debug
        if (!Object.values(whitelistPublicKeys).includes(userPubkey)) {
            throw new Error('User not allowed to make satsback');
        }

        // Satsback rate
        let satsbackRate: string = process.env.SATSBACK_DEFAULT!; // Default satsback rate

        if (Object.values(whitelistVolunteers).includes(userPubkey)) {
            satsbackRate = process.env.SATSBACK_VOLUNTEERS!; // Volunteers satsback rate
        }

        // Satsback amount in mSats
        const satsbackAmount: number =
            Math.floor(
                Math.max(1000, amount * parseFloat(satsbackRate)) / 1000
            ) * 1000;

        // Make event
        const content = {
            tokens: {
                BTC: satsbackAmount,
            },
            memo: 'satsback test',
        };

        const unsignedEvent: EventTemplate = {
            kind: 1112,
            tags: [
                ['p', ledgerPubkey],
                ['p', userPubkey],
                ['t', 'internal-transaction-start'],
            ],
            content: JSON.stringify(content),
            created_at: Math.round(Date.now() / 1000) + 1,
        };

        const signedEvent: NostrEvent = finalizeEvent(
            unsignedEvent,
            privateKey
        );

        return signedEvent;

        // eslint-disable-next-line
    } catch (error: any) {
        console.error('Error in makeEvent:', error);
        throw error;
    }
}

export { makeEvent };
