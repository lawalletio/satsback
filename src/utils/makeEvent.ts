import { EventTemplate, finalizeEvent, NostrEvent } from 'nostr-tools';
import * as dotenv from 'dotenv';
import { prisma } from './prismaClient';
import { Volunteer } from '@prisma/client';

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

        // Calculate satsback amount
        let satsbackAmount: number;
        let satsbackMemo: string = 'Satsback por pagar con LaCard.';

        const volunteer: Volunteer | null = await prisma.volunteer.findUnique({
            where: {
                publicKey: userPubkey,
            },
        });

        if (volunteer && volunteer.voucherMilisats > 0) {
            // Check if are sats in the voucher
            const satsbackRate: number = parseFloat(
                process.env.SATSBACK_VOLUNTEERS!
            );

            // Calculate amount in mSats
            const safeMinimumAmount = Math.max(1000, amount * satsbackRate); // prevent less than 1 sat

            const roundAmount = Math.floor(safeMinimumAmount / 1000) * 1000; // prevent milisats

            satsbackAmount = Math.min(roundAmount, volunteer.voucherMilisats); // prevent more than voucher

            // Memo
            if (
                satsbackAmount === volunteer.voucherMilisats || // means that the last satsback will make the voucher is empty
                satsbackAmount !== roundAmount // means that the last satsback is exactly the same as voucher, make the voucher is empty
            ) {
                satsbackMemo = `Terminaste tu voucher. Gracias por ser voluntario!`;
            }
            satsbackMemo = 'Satsback por pagar con LaCard y ser voluntario.';

            // Update voucher
            await prisma.volunteer.update({
                where: {
                    publicKey: userPubkey,
                },
                data: {
                    voucherMilisats: volunteer.voucherMilisats - satsbackAmount,
                },
            });
        } else {
            const satsbackRate: number = parseFloat(
                process.env.SATSBACK_DEFAULT!
            );

            // Calculate amount in mSats
            const safeMinimumAmount = Math.max(1000, amount * satsbackRate); // prevent less than 1 sat

            const roundAmount = Math.floor(safeMinimumAmount / 1000) * 1000; // prevent milisats

            satsbackAmount = roundAmount;
        }

        // Make event
        const content = {
            tokens: {
                BTC: satsbackAmount,
            },
            memo: satsbackMemo,
        };

        const unsignedEvent: EventTemplate = {
            kind: 1112,
            tags: [
                ['p', ledgerPubkey],
                ['p', userPubkey],
                ['t', 'internal-transaction-start'],
                ['t', 'satsback'],
                ['e', eTag],
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
