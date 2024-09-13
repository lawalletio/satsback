import * as dotenv from 'dotenv';
import NDK, { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { NDKClientInterface } from '../types/ndk';

dotenv.config();

const relaysUrls = ['wss://relay.lawallet.ar'];

class NDKClient implements NDKClientInterface {
    private _ndk!: NDK;

    async init(): Promise<void> {
        const signer = new NDKPrivateKeySigner(process.env.MODULE_PRIVATE_KEY!);

        await signer.blockUntilReady();

        this._ndk = new NDK({
            devWriteRelayUrls: relaysUrls,
            signer,
        });

        //     .on('event', (event) => {
        //         console.log('[[event]]');
        //         console.log(event);
        //     })
        //     .on('signer:ready', (signer) => {
        //         console.log('[[signer:ready]]');
        //         console.log(signer);
        //     });

        // // Pool
        // this._ndk.pool.on('connect', () => {
        //     console.log('[[connect]]');
        // });

        // // Relays
        // this._ndk.pool.relays.forEach((relay) => {
        //     relay.on('connect', () => {
        //         console.log('[[relay:connect]]');
        //         console.log(relay);
        //     });
        // });
    }

    getInstance(): NDK {
        return this._ndk;
    }
}

export const ndkClient = new NDKClient();
