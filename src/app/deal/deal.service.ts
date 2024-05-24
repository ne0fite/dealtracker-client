import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { stringifyQuery } from '../utils/stringify-query';
import { Deal } from '../../../../common/types/deal.type';
import { DealStats } from '../../../../common/types/deal-stats';
import { DealDto } from '../../../../common/types/deal.dto';
import { DialogService } from '../dialog/dialog.service';
import { CloseDealDialog } from './close-deal-dialog/close-deal-dialog.component';
import { DealQuery, FindDealResponse } from '../../../../common/types';

@Injectable({
    providedIn: 'root'
})
export class DealService {
    constructor(
        private http: HttpClient,
        private dialogService: DialogService,
    ) { }

    getStats(query?: DealQuery): Promise<DealStats> {
        let url = `${environment.apiUrl}/api/v1/deal/stats`;

        const options = {};

        if (query) {
            url += '?' + stringifyQuery(query);
        }

        const observable = this.http.get<DealStats>(url);
        return firstValueFrom(observable);
    }

    find(query?: DealQuery): Promise<FindDealResponse> {
        let url = `${environment.apiUrl}/api/v1/deal`;

        const options = {};

        if (query) {
            url += '?' + stringifyQuery(query);
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
