import { PixOrder } from 'src/pix-order/entities/pix-order.entity';
import { Formatters } from 'src/utils/formatters';

export class PixMailgunTemplates {
  pixOrder: PixOrder;

  constructor(pixOrder: PixOrder) {
    this.pixOrder = pixOrder;
  }
  // Content: Email de envio do ingresso
  // Regua: Acionar quando a compra for confirmada
  // Variaveis Utilizadas: $name, $ticket_url
  mailgunSendingTicketPix(): any {
    const customer = this.pixOrder.customer
    const ticket   = this.pixOrder.event.tickets
    const event    = this.pixOrder.event

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
        tickets: this.pixOrder.event.tickets,
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
      })
    };
  }

  // Content: Email de pedido de pix
  // Regua: Acionar quando usuário fizer um pedido por pix
  // Variaveis Utilizadas: $event_name, $event_date, $event_time, $event_city, $event_state
  mailgunPixOrder(): any {
    const customer = this.pixOrder.customer
    const event = this.pixOrder.event
    const pixCode = this.pixOrder.transaction.pix_copy_code
    const dueDate = Formatters.dateYmdToDmy(this.pixOrder.transaction.due_date)

    return {
      from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
      to: customer.email,
      subject: `${customer.name}, seu pedido foi aceito!`,
      template: "pedido_recebido_pix",
      'h:X-Mailgun-Variables': JSON.stringify({
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
        'cod-pix': pixCode,
        'data-final': dueDate
      }),
    };
  }

  // Content: Email de Envio para pagamento de pix pendente
  // Regua: Acionar 3 hrs depois do pedido realizado por pix
  // Variaveis Utilizadas: $qr_code, $pix_copy_code
  mailgunPixOrderPending(): any {
    const customer = this.pixOrder.customer;
    const event    = this.pixOrder.event
    const pixCode  = this.pixOrder.transaction.pix_copy_code
    const dueDate  = Formatters.dateYmdToDmy(this.pixOrder.transaction.due_date)

    return {
      from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
      to: customer.email,
      subject: `${customer.name}, o seu pix vai expirar em breve, faça o pagamento aqui!`,
      template: "pix_notificacao",
      'h:X-Mailgun-Variables': JSON.stringify({
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
        'cod-pix': pixCode,
        'data-final': dueDate
      }),
    };
  }

  // Content: Email de envio para pagamento pix confirmado
  // Regua: Acionar quando cliente pagar o pix
  // Variaveis Utilizadas: $event_name, $event_date, $event_time, $event_city, $event_state
  mailgunPixOrderConfirmation(): any {
    const customer = this.pixOrder.customer
    const event = this.pixOrder.event

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
}
