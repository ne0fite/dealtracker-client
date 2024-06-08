import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Deal } from '../common/types/deal.type';
import { DealStats } from '../common/types/deal-stats';
import { DealDto } from '../common/types/deal.dto';
import { DialogService } from '../dialog/dialog.service';
import { CloseDealDialog } from './close-deal-dialog/close-deal-dialog.component';
import { DealQuery, FindDealResponse } from '../common/types';
import { QueryInterface } from '../common/query-interface';
import { objectToQueryString } from '../object-to-query-string';

@Injectable({
    providedIn: 'root'
})
export class DealService {
    constructor(
        private http: HttpClient,
        private dialogService: DialogService,
    ) { }

    async getSymbols(): Promise<string[]> {
        const query: QueryInterface = {
            attributes: ['ticker'],
            group: [{
                field: 'ticker',
                dir: 'asc'
            }],
            sort: [{
                field: 'ticker',
                dir: 'asc'
            }]
        }

        const url = `${environment.apiUrl}/api/v1/deal?${objectToQueryString(query)}`;

        const observable = this.http.get<FindDealResponse>(url);
        const response = await firstValueFrom(observable);

        return response.results.map((deal: Deal) => deal.ticker as string);
    }

    getStats(query?: QueryInterface): Promise<DealStats> {
        let url = `${environment.apiUrl}/api/v1/deal/stats`;

        if (query) {
            url += '?' + objectToQueryString(query);;
        }

        const observable = this.http.get<DealStats>(url);
        return firstValueFrom(observable);
    }

    find(query?: QueryInterface): Promise<FindDealResponse> {
        let url = `${environment.apiUrl}/api/v1/deal`;

        if (query) {
            url += '?' + objectToQueryString(query);
        }

        const observable = this.http.get<FindDealResponse>(url);
        return firstValueFrom(observable);
    }

    getById(dealId: string) {
        const url = `${environment.apiUrl}/api/v1/deal/${dealId}`;
        const observable = this.http.get<Deal>(url);
        return firstValueFrom(observable);
    }

    async save(deal: DealDto, id?: string): Promise<Deal> {
        let url = `${environment.apiUrl}/api/v1/deal`;
        if (id) {
            // update an existing record
            url += `/${id}`;
        }

        const dto: DealDto = {
            openDate: deal.openDate,
            closeDate: deal.closeDate,
            exchange: deal.exchange,
            ticker: deal.ticker,
            assetType: deal.assetType,
            status: deal.status,

            units: deal.units,
            openPrice: deal.openPrice,
            takeProfit: deal.takeProfit,
            stopLoss: deal.stopLoss,
            feeOpen: deal.feeOpen,
            feeClose: deal.feeClose,
            feeType: deal.feeType,
            closePrice: deal.closePrice,

            // @TODO
            projectId: null, //deal.projectId,

            notes: deal.notes,
        }

        const observable = this.http.post<Deal>(url, dto);
        return firstValueFrom(observable);
    }

    delete(dealId: string) {
        const url = `${environment.apiUrl}/api/v1/deal/${dealId}`;
        const observable = this.http.delete<Deal>(url);
        return firstValueFrom(observable);
    }

    async closeDeal(deal: DealDto, id: string) {
        deal.status = 'closed';
        const result = await this.dialogService.show(
            CloseDealDialog, {
            initialState: {
                deal,
            }
        }
        );

        if (result.result) {
            this.save(deal, id);
        }

        return result;
    }
}
