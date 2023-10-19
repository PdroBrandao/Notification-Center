export class CreateScheduledTaskDto {
    order_type: string
    order_id: string
    external_id: string
    notification_status: string
    send_date: Date
    attempts: number
    installment: number
}