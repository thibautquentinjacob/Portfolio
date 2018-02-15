export interface Order {
    symbol?:           string;
    date?:             any;
    resolved?:         any;
    order?:            string;
    duration?:         string;
    minutes?:          number;
    action?:           string;
    orderValue?:       number;
    resolvedAvgValue?: number;
    volume?:           number;
    totalCost?:        number;
    currency?:         string;
    remaining?:        number;
    limit?:            number;
    triggered?:        boolean;
}
