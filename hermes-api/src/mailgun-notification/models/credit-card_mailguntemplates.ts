import { CreditCardOrder } from "src/credit-card-order/entities/credit-card-order.entity";

export class CreditCardMailgunTemplates {

    creditCardOrder: CreditCardOrder;

    constructor(creditCardOrder: CreditCardOrder) {
        this.creditCardOrder = creditCardOrder;
    }
    // Content: Email de envio do ingresso
    // Regua: Acionar quando a compra for confirmada
    // Variaveis Utilizadas: $name, $ticket_url
    mailgunSendingTicketCreditCard(): any {
        const customer = this.creditCardOrder.customer
        const ticket   = this.creditCardOrder.event.tickets
        const event    = this.creditCardOrder.event
        
        let ticketString = ''
        for (let i = 0; i < ticket.length; i++) {
          let label = (ticket[i].ticket_name ? ticket[i].ticket_name: 'Ingresso '+ (i+1))
          ticketString = ticketString + `\n ${label} - ${ticket[i].ticket_url}`
        }

        return {
            from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
            to: customer.email,
            subject: `${customer.name}, seu ingresso chegou!`,
            template: "ingresso",
            'h:X-Mailgun-Variables': JSON.stringify({
                name: customer.name,
                ticket_url: ticketString,
                tickets: this.creditCardOrder.event.tickets,
                event_name: event.name,
                event_date: event.date,
                event_time: event.time,
                event_city: event.city,
                event_state: event.state,
            })
        };
    }

    // Content: Email de confirmação de pedido por Cartão.
    // Regua: Acionar quando o pedido for feito para o cartão.
    // Variaveis Utilizadas: $event_name, $event_date, $event_time, $event_city, $event_state
    mailgunCreditCardOrder(): any {
        const customer = this.creditCardOrder.customer
        const event = this.creditCardOrder.event

        return {
            from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
            to: customer.email,
            subject: `${customer.name}, seu pedido foi aceito!`,
            template: "pedido_recebido_cartao",
            'h:X-Mailgun-Variables': JSON.stringify({
                event_name: event.name,
                event_date: event.date,
                event_time: event.time,
                event_city: event.city,
                event_state: event.state
            }),
        };
    }

    // Content: Email de confirmação de pagamento.
    // Regua: Acionar quando a compra do cartão de crédito for aprovada.
    // Variaveis Utilizadas: $event_name, $event_date, $event_time, $event_city, $event_state
    mailgunConfirmationPayment(): any {
        const customer = this.creditCardOrder.customer
        const event = this.creditCardOrder.event

        return {
            from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
            to: customer.email,
            subject: `${customer.name}, seu pagamento foi aprovado!`,
            template: "pagamento_confirmado",
            'h:X-Mailgun-Variables': JSON.stringify({
                event_name: event.name,
                event_date: event.date,
                event_time: event.time,
                event_city: event.city,
                event_state: event.state
            }),
        };
    }

    // Content: Email de recusa de pagamento por cartão de crédito.
    // Regua: Acionar quando tiver uma resposta negativa do gateway de pagamento.
    // Variaveis Utilizadas: $event_name, $event_date, $event_time, $event_city, $event_state
    mailgunRejectPayment(): any {
        const customer = this.creditCardOrder.customer
        const event = this.creditCardOrder.event

        return {
            from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
            to: customer.email,
            subject: `${customer.name}, seu pagamento foi recusado =(`,
            template: "pagamento_recusado",
            'h:X-Mailgun-Variables': JSON.stringify({
                event_name: event.name,
                event_date: event.date,
                event_time: event.time,
                event_city: event.city,
                event_state: event.state
            }),
        };
    }
}
