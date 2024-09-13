export interface NDKClientInterface {
    init(): Promise<void>;
    getInstance(): NDK;
}
