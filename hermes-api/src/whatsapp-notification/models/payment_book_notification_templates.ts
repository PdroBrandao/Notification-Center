import { PaymentBookOrder, Tickets } from "src/payment-book-order/entities/payment-book-order.entity";

export class PaymentBookNotificationTemplates {
  templatePaymentBookOrderPendingInstallment() {
    throw new Error("Method not implemented.");
  }
  paymentBookOrder: PaymentBookOrder

  constructor(paymentBookOrder: PaymentBookOrder) {
    this.paymentBookOrder = paymentBookOrder
  }

  async templatePaymentBookOrderPending(): Promise<string> { // Mensagem para mostrar todos as parcelas pendentes
    const installments = this.paymentBookOrder.installments
    const customer = this.paymentBookOrder.customer
    const event = this.paymentBookOrder.event
    const transactions = this.paymentBookOrder.transactions
    let installmentsString = ''
    for (let i = 0; i < installments; i++) {
      const shortUrl = await this.shortLink(transactions[i].billing_url)
      installmentsString = installmentsString + `📌 Parcela Nº ${i + 1}\n${shortUrl}\n\n`
    }

    return `Olá,*${customer.name}* 💙💙\n\n` + 
    `*${event.name.toUpperCase()} – INFORMAÇÕES BOLETO*\n\n` + 
    `⚠️ *O NÃO PAGAMENTO DA 1º PARCELA ATÉ A DATA DE VENCIMENTO IMPLICARÁ NO CANCELAMENTO AUTOMÁTICO DA SUA COMPRA* ⚠️\n\n` +
    `Segue abaixo todas os boletos referentes ao(s) seu(s) ingresso(s).\n` + 
    `Você só receberá o(s) QR Code(s) do ingresso(s) depois de quitar todas as parcelas, tá?\n\n` +
    `${installmentsString}` +
    `Os links não apareceram? Basta me responder qualquer coisa. 🤓\n` +
    `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um Oi`
  }

  async templatePaymentBookOrderInstallmentPaid(installment: number): Promise<string> { // Mensagem para confirmação de uma parcela
    const customer = this.paymentBookOrder.customer
    const transactions = this.paymentBookOrder.transactions
    const installments = this.paymentBookOrder.installments
    const event = this.paymentBookOrder.event
    let installmentsString = ''
    for (let i = 0; i < installments; i++) {
      const shortUrl = await this.shortLink(transactions[i].billing_url)
      installmentsString = installmentsString + `📌 Parcela *Nº ${i + 1}* -> ${transactions[i].status == "paid" ? "*PAGO* ✅" : "*NÃO PAGO* ❌"} \n ${shortUrl}\n\n`
    }
    return `Olá, *${customer.name}* 💙💙\n` +
      `Acabamos de identificar o pagamento de um boleto referente a sua compra.\n` +
      `Segue abaixo os status das parcelas(Pago ou Não Pago) referentes ao(s) seu(s) ingresso(s) do (a) *${event.name}*.\n\n` +
      `${installmentsString}` +
      `\n\n_Os links não apareceram? Basta me responder qualquer coisa._ 🤓\n\n` +
      `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*`
  }
  

  async templatePaymentBookOrderInstallmentPendingExpiring(installment: number): Promise<string> { // Mensagem para confirmação de uma parcela que vencerá
    const customer = this.paymentBookOrder.customer
    const event = this.paymentBookOrder.event
    const transcations = this.paymentBookOrder.transactions

    return `Olá,*${customer.name}* 💙\n\n` +
    `*${event.name.toUpperCase()} – INFORMAÇÕES BOLETO*\n\n` +
    `Um dos seus boletos vence hoje 🗓️\n` + 
    `Segue abaixo o(s) seu(s) boleto(s) pendente(s):\n\n` +
    `📌 Parcela Nº ${installment + 1}\n` +
    `${await this.shortLink(transcations[installment].billing_url)}\n\n` +
    `⚠️ CASO JÁ TENHA EFETUADO O PAGAMENTO FAVOR DESCONSIDERAR A MENSAGEM ⚠️\n\n` +
    `Os links não apareceram? Basta me responder qualquer coisa. 🤓\n\n` +
    `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um Oi`
  }

  templatePaymentBookOrderInstallmentExpired(): string { // Mensagem para avisar que a parcela venceu
    const customer = this.paymentBookOrder.customer
    const event = this.paymentBookOrder.event
    /*
    return `Olá, *${customer.name}*\n` +
      `O boleto da sua compra venceu!\n` +
      `Portanto o houve o cancelamento do seu boleto do ingresso do evento *${event.name}*.\n\n` +
      `Ah, para acessar a(s) sua(s) parcela(s) basta me responder qualquer coisa ` +
      `ou me adicionar nos seus contatos que o link aparecerá para você. \n\n` +
      `Obrigada!`
      */
    return `*${customer.name}* ...\n\n` +
      `Como não identificamos o pagamento da sua última parcela do Carnê Digital até hoje, seu boleto será *CANCELADO* 😭\n\n` +
      `⚠️ *CASO JÁ TENHA EFETUADO O PAGAMENTO FAVOR DESCONSIDERAR A MENSAGEM* ⚠️\n\n` +
      `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*`
  }

  templatePaymentBookOrderPaid(): string { // Mensagem para envio do ingresso
    const customer = this.paymentBookOrder.customer
    const event = this.paymentBookOrder.event
    const ticket = this.paymentBookOrder.event.tickets

    let ticketString = ''
    for (let i = 0; i < ticket.length; i++) {
      let label = (ticket[i].ticket_name ? ticket[i].ticket_name : 'Ingresso ' + (i + 1))
      ticketString = ticketString + `\n\n 🎟️ ${label} - ${ticket[i].ticket_url}`
    }

    return `Olá, *${customer.name}*! 💙\n\n` +
      `Recebi a confirmação do seu pagamento referente ao(s) ingresso(s) do(a) *${event.name}*!🚀 \n\n` +
      `Segue abaixo o(s) ingresso(s):` +
      `${ticketString}\n\n` +
      `_Os links não apareceram? Basta me responder qualquer coisa. 🤓_ \n\n` +
      `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*`
  }


  templateResendPaymentBookOrderPaid(): string { // Mensagem para envio do ingresso
    const customer = this.paymentBookOrder.customer
    const event = this.paymentBookOrder.event
    const ticket = this.paymentBookOrder.event.tickets

    let ticketString = ''
    for (let i = 0; i < ticket.length; i++) {
      let label = (ticket[i].ticket_name ? ticket[i].ticket_name : 'Ingresso ' + (i + 1))
      ticketString = ticketString + `\n\n 🎟️ ${label} - ${ticket[i].ticket_url}`
    }

    return `Olá, *${customer.name}*! 💙\n\n` +
      `Caso tenha perdido a mensagem do(s) seu(s) ingresso(s), estou te enviando novamente!🚀 \n\n` +
      `Segue abaixo:` +
      `${ticketString}\n\n` +
      `_Os links não apareceram? Basta me responder qualquer coisa. 🤓_ \n\n` +
      `👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*`
  }

  async shortLink(url: string) {
    try {
      const shortUrl = process.env.SHORT_LINK_API_URI
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: process.env.SHORT_LINK_API_KEY
        },
        body: JSON.stringify({
          domain: 'short.passaportedigitalplus.com.br',
          originalURL: url
        })
      };
      let response: any = await fetch(shortUrl, options)
      response = await response.json()
      return response?.secureShortURL || url
    } catch (e) {
      console.log(e)
      return url
    }
  }
}