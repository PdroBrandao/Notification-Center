import { PixInstallment } from "src/pix-installments/entities/pix-installment.entity";

export class PixInstallmentsNotificationTemplates {
     PixInstallment: PixInstallment

  constructor(PixInstallment: PixInstallment) {
    this.PixInstallment = PixInstallment
  }

  templatePixOrderPending(): Array<string> { // Mensagem para mostrar pendências

    const customer = this.PixInstallment.customer
    const event = this.PixInstallment.event
    const value = this.PixInstallment.transaction[0].amount
    const currency = this.PixInstallment.currency
    const pixCode = this.PixInstallment.transaction[0].pix_copy_code

    console.log(" >>> templatePixOrderPending >>> PixInstallment.transaction[0] >>>", this.PixInstallment.transaction[0])

    return [
      `Olá, *${customer.name}*! 💙\n\n` +
      `Estamos aguardando o pagamento da entrada do seu pedido, no valor de *${currency}${value}* referente ao(s) seu(s) ingresso(s) do(a) *${event.name}*, tá?\n\n` +
      `Você terá um prazo de até 24hrs ⏳ para realizar o pagamento desta entrada, caso contrário, o seu pedido será *cancelado* e um novo deverá ser feito.`,
      `📌 Segue abaixo a *1º Parcela* do seu pedido. Copie e cole o código do pix no app do seu banco:`,
      pixCode,
      `👉 Ah, pra saber sobre as outras parcelas, basta digitar um *Oi*, se identificar pelo seu *CPF* e solicitar *SEUS CÓDIGOS* para realizar o pagamento das outras parcelas.`
    ];
  }
  
  templatePixOrderPaid(): string { // Mensagem para confirmação de uma parcela
    const customer = this.PixInstallment.customer
    const event = this.PixInstallment.event
    const transcation = this.PixInstallment.transaction
    const currency = this.PixInstallment.currency
    const ticket = this.PixInstallment.event.tickets

    let ticketString = ''
    for (let i = 0; i < ticket.length; i++) {
      let label = (ticket[i].ticket_name ? `🎟️ ${ticket[i].ticket_name}`: '🎟️ Ingresso '+ (i+1))
      ticketString = ticketString + `\n\n ${label} - ${ticket[i].ticket_url}`
    }

    return `Olá, *${customer.name}*! 💙\n\n` +
    `Confirmamos o pagamento referente ao(s) ingresso(s) do(a) *${event.name}*!🚀 \n\n` +
    `Segue(m) abaixo o(s) ingresso(s):` +
    `${ticketString}\n\n` +
    `_Os links não apareceram? Basta me responder qualquer coisa. 🤓_ \n\n` +
    `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*`
  }

}