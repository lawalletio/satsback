import { Filter, NostrEvent } from 'nostr-tools';

export interface SubscriptionParams {
    filters: Filter[];
    callback: (event: NostrEvent) => void;
}
