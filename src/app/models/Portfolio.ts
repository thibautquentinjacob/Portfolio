export class Portfolio {
    total:    number;
    equities: number;
    cash:     number;
    stocks:   OwnedStock[];
    orders:   Order[];
}

class OwnedStock {
    symbol:    string;
    amount:    number;
    boughtFor: number;
}

class Order {
    date:          any;
    resolved:      any;
    symbol:        string;
    volume:        number;
    price:         number;
    resolvedPrice: number;
    type:          string;
    duration:      string;
    action:        string;
    minutes:       number;
}
