export class RemovedTabModel {
    removeId: any;
    newTabFocus: any;

    public constructor(init?: Partial<RemovedTabModel>) {
        Object.assign(this, init);
    }
}

