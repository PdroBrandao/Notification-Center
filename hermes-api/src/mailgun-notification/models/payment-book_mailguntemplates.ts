import { PaymentBookOrder } from "src/payment-book-order/entities/payment-book-order.entity";

export class PaymentBookMailgunTemplates {

  paymentBookOrder: PaymentBookOrder

  constructor(paymentBookOrder: PaymentBookOrder) {
    this.paymentBookOrder = paymentBookOrder;
  }
  // Content: Email de envio do ingresso
  // Regua: Acionar quando a compra for confirmada
  // Variaveis Utilizadas: $name, $ticket_url
  mailgunSendingTicketPaymentBook(): any {
    const customer = this.paymentBookOrder.customer
    const ticket   = this.paymentBookOrder.event.tickets
    const event    = this.paymentBookOrder.event

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
        tickets: this.paymentBookOrder.event.tickets,
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
      })
    };
  }

  // Content: Email de Envio Único do Carnê Completo com todas as parcelas no ato da compra em boleto.
  // Regua: Acionar quando confirmação de pedido de compra pelo boleto.
  // Variaveis Utilizadas: $pdf, $event_name, $event_date, $event_time, $event_city, $event_state
  mailgunDigitalBooklet(): any {
    const customer = this.paymentBookOrder.customer
    const event = this.paymentBookOrder.event
    const pdf = this.paymentBookOrder.pdf

    let invoices = [...this.paymentBookOrder.transactions.map((item, index) => ({ ...item, installment_number: index + 1 }))];

    return {
      from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
      to: customer.email,
      subject: `${customer.name}, confira já o seu CARNÊ DIGITAL completo!`,
      template: "pedido_recebido_carne",
      'h:X-Mailgun-Variables': JSON.stringify({
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
        pdf: pdf,
        invoices: invoices
      }),
    };
  }

  // Content: Email de Envio sobre boleto pago
  // Regua: Acionar quando pagamento for confirmado
  // Variaveis Utilizadas: $pdf, $event_name, $event_date, $event_time, $event_city, $event_state
  mailgunDigitalBookletPaid(): any {
    const customer = this.paymentBookOrder.customer
    const event = this.paymentBookOrder.event
    const pdf = this.paymentBookOrder.pdf

    return {
      from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
      to: customer.email,
      subject: `${customer.name}, recebemos o pagamento do seu carnê!`,
      template: "pagamento_confirmado",
      'h:X-Mailgun-Variables': JSON.stringify({
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
        pdf: pdf
      }),
    };
  }

  // Content: Email de Envio de boleto referente ao vencimento.
  // Regua: Acionar X dias antes do vencimento do boleto do mês vigente.
  // Variaveis Utilizadas: $pdf, $event_name, $event_date, $event_time, $event_city, $event_state
  mailgunDigitalBookletInstallment(): any {

    const customer = this.paymentBookOrder.customer
    const event = this.paymentBookOrder.event
    const installments = this.paymentBookOrder.installments
    const transactions = this.paymentBookOrder.transactions
    const pdf = this.paymentBookOrder.pdf

    return {
      from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
      to: customer.email,
      subject: `${customer.name}, o boleto do seu evento vencerá em breve!`,
      template: "pedido_recebido_carne_parcelas",
      'h:X-Mailgun-Variables': JSON.stringify({
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
        pdf: pdf
      }),
    };
  }

  // Boleto de vencimento - OK
  // Variaveis Utilizadas: $pdf, $event_name, $event_date, $event_time, $event_city, $event_state
  mailgunDigitalBookletPending(): any {
    const customer = this.paymentBookOrder.customer
    const event = this.paymentBookOrder.event
    const pdf = this.paymentBookOrder.pdf

    let invoices = [...this.paymentBookOrder.transactions.map((item, index) => ({ ...item, installment_number: index + 1 }))];

    return {
      from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
      to: customer.email,
      subject: `${customer.name}, o seu boleto vence hoje!`,
      template: "carne_parcelas_cancelamento", //Fake name, preguiça de fazer um novo template no mailgun
      'h:X-Mailgun-Variables': JSON.stringify({
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
        pdf: pdf,
        invoices: invoices
      }),
    };
  }
}
