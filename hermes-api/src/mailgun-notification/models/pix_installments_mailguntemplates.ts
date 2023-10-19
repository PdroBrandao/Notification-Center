import { PixInstallment } from 'src/pix-installments/entities/pix-installment.entity';
import { Formatters } from 'src/utils/formatters';
import * as moment from 'moment'; // Importe o Moment.js

export class PixInstallmentsMailgunTemplates {
    PixInstallment: PixInstallment;

  constructor(PixInstallment: PixInstallment) {
    this.PixInstallment = PixInstallment;
  }
  // Content: Email de envio do ingresso -> Regua: Acionar quando a compra for confirmada
  mailgunSendingTicketPix(): any {
    console.log("<<< mailgunSendingTicketPix >>>")

    const customer = this.PixInstallment.customer
    const ticket   = this.PixInstallment.event.tickets
    const event    = this.PixInstallment.event

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
        tickets: this.PixInstallment.event.tickets,
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
      })
    };
  }

  // Email de todas as parcelas do pix -> Regua: Quando comprar
  mailgunPixOrder(): any {
    console.log("Entrei no mailgunPixOrder()")
    const customer = this.PixInstallment.customer
    const event = this.PixInstallment.event
    const pixCode = this.PixInstallment.transaction[0].pix_copy_code
    const dueDate = this.PixInstallment.transaction[0].due_date; // Supondo que seja do tipo Date
    const formattedDueDate = Formatters.dateYmdToDmy(moment(dueDate).format("YYYY-MM-DD")); // Usando Moment.js para formatar

    let invoices = [
        ...this.PixInstallment.transaction.map((item, index) => (
            {
                ...item, 
                installment_number: index + 1 
            }
        ))
    ];

    //console.log("invoices", invoices)

    return {
      from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
      to: customer.email,
      subject: `${customer.name}, acesse já o(s) código(s) pix do seu CARNÊ DIGITAL!`,
      template: "pedido_recebido_cartao",
      'h:X-Mailgun-Variables': JSON.stringify({
        event_name: event.name,
        event_date: event.date,
        event_time: event.time,
        event_city: event.city,
        event_state: event.state,
        invoices: invoices,
      }),
    };
  }

  // Cobrança de Vencimento - Regua: Quando chegar no vencimento
  mailgunPixInstallmentPending(): any {
    console.log(" >>> mailgunPixInstallmentPending >>> ")

    const customer = this.PixInstallment.customer
    const event = this.PixInstallment.event
    const pixCode = this.PixInstallment.transaction[0].pix_copy_code
    const dueDate = this.PixInstallment.transaction[0].due_date; // Supondo que seja do tipo Date

    // Today
    const today = moment();
    const formattedToday = today.format("DD/MM/YYYY");

    let invoices = [
      ...this.PixInstallment.transaction.map((item, index) => {

        if (formattedToday === moment(item.due_date).format("YYYY-MM-DD")){ // Compare formattedToday with formatted due_date
          console.log(" <> Compare formattedToday with formatted due_date <> ")
          const dueDate = moment(item.due_date).format("YYYY-MM-DD")
          const pixCode = item.pix_copy_code
        } 
        
        return {
          ...item,
          installment_number: index + 1,
          dueDate: dueDate, // Add the flag to the object
          pixCode: pixCode
        };
      })
    ];

      console.log("mailgunPixInstallmentPending >>> dueDate >>> ",dueDate)
      console.log("mailgunPixInstallmentPending >>> pixCode >>> ",pixCode)

    return {
      from: "Passaporte Digital <postmaster@mail.passaportedigitalplus.com.br>",
      to: customer.email,
      subject: `${customer.name}, o seu pix expira hoje!`,
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
}
