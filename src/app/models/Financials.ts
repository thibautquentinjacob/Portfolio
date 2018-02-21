/**
 * File: Financials.ts
 * Project: portfolio
 * File Created: Thursday, 8th February 2018 8:06:51 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 21st February 2018 8:27:53 pm
 * Modified By: Thibaut Jacob (thibautquentinjacob@gmail.com>)
 * -----
 * License:
 * MIT License
 * 
 * Copyright (c) 2018 Thibaut Jacob
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



export interface Financials {
    reportDate:             any;
    grossProfit:            number;
    costOfRevenue:          number;
    operatingRevenue:       number;
    totalRevenue:           number;
    operatingIncome:        number;
    netIncome:              number;
    researchAndDevelopment: number;
    operatingExpense:       number;
    currentAssets:          number;
    totalAssets:            number;
    totalLiabilities:       number;
    currentCash:            number;
    currentDebt:            number;
    totalCash:              number;
    totalDebt:              number;
    shareholderEquity:      number;
    cashChange:             number;
    cashFlow:               number;
    operatingGainsLosses:   number;
}
