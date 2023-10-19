import { PixOrder } from "src/pix-order/entities/pix-order.entity";

export class PixNotificationTemplates {
  pixOrder: PixOrder

  constructor(pixOrder: PixOrder) {
    this.pixOrder = pixOrder
  }

  templatePixOrderPending(): Array<string> { // Mensagem para mostrar pendências
    const customer = this.pixOrder.customer
    const event = this.pixOrder.event
    const transcation = this.pixOrder.transaction
    const currency = this.pixOrder.currency
    const pixCode = this.pixOrder.transaction.pix_copy_code

    return [
      `Olá, *${customer.name}*\n\n` +
      `Só estamos esperando a confirmação do seu pagamento no valor de *${currency}${transcation.amount}* referente ao(s) seu(s) ingresso(s) do(a) *${event.name}* para te enviar os ingressos, tá?\n\n` +
      `Você tem um prazo de até 24hrs ⏳ para realizar o pagamento, caso contrário, o seu pedido será cancelado e um novo deverá ser feito.\n\n` +
      `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*\n\n`+
      `📌 Segue abaixo o código do pix para copiar e colar:`,
      pixCode
    ];
  }
  
  templatePixOrderPaid(): string { // Mensagem para confirmação de uma parcela
    const customer = this.pixOrder.customer
    const event = this.pixOrder.event
    const transcation = this.pixOrder.transaction
    const currency = this.pixOrder.currency
    const ticket = this.pixOrder.event.tickets

    let ticketString = ''
    for (let i = 0; i < ticket.length; i++) {
      let label = (ticket[i].ticket_name ? `🎟️ ${ticket[i].ticket_name}`: '🎟️ Ingresso '+ (i+1))
      ticketString = ticketString + `\n\n ${label} - ${ticket[i].ticket_url}`
    }

    return `Olá, *${customer.name}*! 💙\n\n` +
    `Acabei de receber a confirmação do seu pagamento referente ao(s) ingresso(s) do(a) *${event.name}*!🚀 \n\n` +
    `Segue(m) abaixo o(s) ingresso(s):` +
    `${ticketString}\n\n` +
    `_Os links não apareceram? Basta me responder qualquer coisa. 🤓_ \n\n` +
    `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*`
  }

  templatePixOrderPendingExpiring(): Array<string> { // Mensagem para notificação de não pagamento
    const event = this.pixOrder.event
    const pixCode = this.pixOrder.transaction.pix_copy_code

    return [
      `⚠️ *Atenção* ⚠️\n\n` +
      `Passei aqui só pra te lembrar de realizar o pagamento do pix, tá?\n\n` +
      `🏃 Corra, pague logo e garanta sua vaga no(a) *${event.name}*. Caso contrário, o seu pedido será cancelado.\n\n` +
      `📌 Segue o código do pix para copiar e colar:`,
      pixCode
    ];
  }
}