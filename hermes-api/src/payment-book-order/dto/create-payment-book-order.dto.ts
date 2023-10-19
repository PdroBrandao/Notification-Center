export class CreatePaymentBookOrderDto {
    external_id: string
    customer: {
        name: string
        email: string
        whatsapp: {
            country_code: string
            number: string
            area_code: string
        }
    }
    event: {
        name: string
        date: string
        time: string
        city: string
        state: string
        tickets: [
            {
                ticket_name: string
                ticket_type: string
                ticket_url: string
            }
        ]
    }
    ruler: boolean
    installments: number
    currency: string
    status: string
    pdf: string
    transactions:
    [
        {
            value: string,
            due_date: Date,
            payment_date: Date,
            status: string,
            billing_url: string
        }
    ]
}
