import { CreditCardOrder } from "src/credit-card-order/entities/credit-card-order.entity";

export class CreditCardNotificationTemplates {
  creditCardOrder: CreditCardOrder

  constructor(creditCardOrder: CreditCardOrder) {
    this.creditCardOrder = creditCardOrder
  }

  templateCreditCardOrderPending(): string { // Mensagem para mostrar pendência
    const customer = this.creditCardOrder.customer
    const event = this.creditCardOrder.event
    const transcation = this.creditCardOrder.transaction
    const currency = this.creditCardOrder.currency

    return `Olá, *${customer.name}*\n` +
      `Obrigada por comprar com a Passaporte Digital ❤️\n\n` +
      `Estamos aguardando a confirmação do pagamento ` +
      `no valor de *${currency}${transcation.amount}* ` +
      `referente ao ingresso do evento *${event.name}*\n\n` +
      `Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*`
  }

  templateCreditCardOrderPaid(): string { // Mensagem para confirmação
    const customer = this.creditCardOrder.customer
    const event = this.creditCardOrder.event
    const transcation = this.creditCardOrder.transaction
    const currency = this.creditCardOrder.currency
    const ticket = this.creditCardOrder.event.tickets

    let ticketString = ''
    for (let i = 0; i < ticket.length; i++) {
      let label = (ticket[i].ticket_name ? ticket[i].ticket_name: 'Ingresso '+ (i+1))
      ticketString = ticketString + `\n\n 🎟️ ${label} - ${ticket[i].ticket_url}`
    }

    return `Olá, *${customer.name}*! 💙\n\n` +
    `Acabei de receber a confirmação do seu pagamento referente ao(s) ingresso(s) do(a) *${event.name}*!🚀 \n\n` +
    `Segue(m) abaixo o(s) ingresso(s):` +
    `${ticketString}\n\n` +
    `_Os links não apareceram? Basta me responder qualquer coisa. 🤓_ \n\n` +
    `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*`
  }
  
  templateCreditCardOrderFailed(): string { // Mensagem que a compra falhou
    const customer = this.creditCardOrder.customer
    const event = this.creditCardOrder.event
    const transcation = this.creditCardOrder.transaction
    const currency = this.creditCardOrder.currency

    return `Olá, *${customer.name}*\n\n` +
      `Vimos que algo deu errado na sua compra ` +
      `referente ao ingresso do evento *${event.name}*, ` +
      `portanto a compra foi cancelada.`
  }
}