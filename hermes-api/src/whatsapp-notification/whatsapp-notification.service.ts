import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ErrorLogService } from "src/error-log/error-log.service";
import { UserNotification } from './entities/notification.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WhatsappNotificationService {
    private url = 'https://api2.megaapi.com.br/rest/sendMessage/megaapi-MPdmsOoEkkovqZZIzT1sRIgGmj/text'
    private header = {
        'Authorization': 'Bearer MPdmsOoEkkovqZZIzT1sRIgGmj'
    }

    constructor(
        private readonly httpService: HttpService,
        private readonly errorLogService: ErrorLogService,
        @InjectModel(UserNotification.name) private userNotificationModel: Model<UserNotification>,
    ) { }

    private buildJsonBody(phone: string, message: string) {
        return {
            "messageData": {
                "to": `${phone}@s.whatsapp.net`,
                "text": message,
            }
        }
    }

    async sendMessage(phone: string, message: string, external_id: string, cod: string): Promise<boolean> {
        const data = this.buildJsonBody(phone, message)
        const config = { headers: this.header }
        const userNotification = new this.userNotificationModel()

        userNotification.text = message
        userNotification.to = phone
        userNotification.cod = cod
        userNotification.date = new Date()
        userNotification.external_id = external_id

        try {
            console.log("(Whatsapp (Enviando uma mensagem)")
            const response = await this.httpService.axiosRef.post(this.url, data, config);
            //console.log("Mensagem Enviada",response)

            if (!response || response?.data.error) {
                const errorMessage = response ? response?.data.message : 'No response.';
                this.logError(errorMessage, external_id);
                console.log("Error -> ", errorMessage)
                userNotification.status = 'error'
                return false;
            }

            userNotification.status = 'success'
            return true;
        } catch (e) {
            const data = e.response?.data;
            userNotification.status = 'error'
            this.logError(data.name + ' | ' + data.message, external_id);
            return false;
        } finally {
            await userNotification.save()
        }
    }

    async logError(errorMessage: string, external_id: string): Promise<void> {
        this.errorLogService.generateLog(external_id, errorMessage)
    }
}
