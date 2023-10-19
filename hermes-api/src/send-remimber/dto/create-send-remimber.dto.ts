export class CreateSendRemimberDto {
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
    ruler: [boolean]
    currency: string
    installments: number
    status: string
    transaction:
    [
        {
            value: string
            status: string
            qr_code: string
            pix_copy_code: string
            due_date: Date
        }
    ]
}

