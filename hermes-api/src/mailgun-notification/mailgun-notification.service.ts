import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
const FormData = require('form-data');


@Injectable()
export class MailgunNotificationService {
    private url = "https://api.mailgun.net/v3/mail.passaportedigitalplus.com.br/messages"
    private api_key = 'fff86db80c760282e12d87a4d8c3e079-4534758e-e6867200';
    private auth = {
        'username': 'api',
        'password': this.api_key
    }

    constructor(private readonly httpService: HttpService) { }


    async sendEmail(data: any): Promise<AxiosResponse<any>> {

        console.log(" <<< sendEmail >>> ");
        const form = new FormData();
        form.append('from', data['from']);
        form.append('to', data['to']);
        form.append('subject', data['subject']);
        form.append('template', data['template']);
        form.append('h:X-Mailgun-Variables', data['h:X-Mailgun-Variables']);

        const config = {
            headers: {
                ...form.getHeaders()
            },
            auth: this.auth
        }

        const response = await this.httpService.axiosRef.post(this.url, form, config);
        return response
    }

}

