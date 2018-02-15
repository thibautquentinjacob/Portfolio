import { EquityCollection } from "./equityCollection";

export class Portfolio {
    name: string;
    equities: EquityCollection[];
    lastUpdate: number;

    constructor( name:       string,
                 equities:   EquityCollection[]) {
        this.name       = name;
        this.equities   = equities;
        this.lastUpdate = Date.now();
    }
}
