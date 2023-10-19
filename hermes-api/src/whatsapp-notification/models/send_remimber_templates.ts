import { SendRemimber } from "src/send-remimber/entities/send-remimber.entity";
//import moment from 'moment';
import * as moment from 'moment';


export class SendRemimberNotificationTemplates {
    SendRemimber: SendRemimber

  constructor(SendRemimber: SendRemimber) {
    this.SendRemimber = SendRemimber
  }

  sendRemimber(): string[] { //Array<string> { // Mensagem para mostrar pendências

    const customer = this.SendRemimber.customer
    const event = this.SendRemimber.event
    const currency = this.SendRemimber.currency

    let code = '';
    let dueDateTransaction: Date | null = null;
    let value = '';

    // 1º Regra que identifica o mes de vencimento

    // Obtém o primeiro e último dia do mês vigente
    const currentDate = moment();
    const startOfCurrentMonth = currentDate.startOf('month').format('YYYY-MM-DD');
    const endOfCurrentMonth = currentDate.endOf('month').format('YYYY-MM-DD');

    console.log(">>> startOfCurrentMonth >>> ", startOfCurrentMonth)
    console.log(">>> endOfCurrentMonth >>> ", endOfCurrentMonth)

    this.SendRemimber.transaction.forEach((transaction, index) => {

        const dueDate = moment(transaction.due_date);
        console.log(">>> transaction.due_date >>> ", transaction.due_date)
        console.log(">>> transaction.amount >>> ", transaction.amount)

        if (dueDate.isBetween(startOfCurrentMonth, endOfCurrentMonth, null, '[]')) {
            console.log(`Transaction ${index + 1}:`);
            // Adicione mais campos conforme necessário

            value = transaction.amount;
            code = transaction.pix_copy_code;
            dueDateTransaction = new Date(transaction.due_date);
          }
      });

      console.log("due_date:", dueDateTransaction);
      console.log("value:", value);
      console.log("code:", code);

      const formattedDueDate = moment(dueDateTransaction).utc().format('DD/MM');


    // 2º Regra que randomiza as mensagens

    const phrasesArray: (string | string[])[] = [];

    phrasesArray.push(

      // 2 blocs
      [
        `Olá, *${customer.name}*!\n\n`+`Não esqueça, a parcela de *${currency}${value}* do seu pedido para o(a) *${event.name}* vence em breve!\n\n`+`Segue abaixo a sua parcela com o vencimento pro dia *${formattedDueDate}* para efetuar o pagamento.`, 
        code
      ],

      // 3 blocs
      [
        `Olá, *${customer.name}*!\n\n`+`Não esqueça, a parcela de *${currency}${value}* do seu pedido para o(a) *${event.name}* vence em breve!\n\n`+`Segue abaixo a sua parcela com o vencimento pro dia *${formattedDueDate}* para efetuar o pagamento.`, 
        code,
        `Em caso de dúvidas, estou a disposição.\n\n`+`👉 Ah, pra saber sobre a sua compra a qualquer hora, basta digitar um *Oi*`
      ],

      // 5 blocs
      [
        `Olá, *${customer.name}*!\n\n`+`Não esqueça, a parcela de *${currency}${value}* do seu pedido para o(a) *${event.name}* vence em breve!`,
        `Segue abaixo a sua parcela com o vencimento pro dia *${formattedDueDate}* para efetuar o pagamento.`, 
        code,
        `Em caso de dúvidas, estou a disposição`,
        `Qualquer coisa, só dar um *Oi*!`
      ],

      // 6 blocs
      [
        `Olá, *${customer.name}*!`,
        `Não esqueça, a parcela de *${currency}${value}* do seu pedido para o(a) ${event.name} vence em breve!`,
        `Segue abaixo a sua parcela com o vencimento pro dia *${formattedDueDate}* para efetuar o pagamento.`, 
        code,
        `Em caso de dúvidas, entre em contato conosco.`,
        `Qualquer coisa, só dar um *Oi*!`
      ],
        
    );
    
    // Continue adicionando suas frases longas de exemplo
    
    const randomIndex = Math.floor(Math.random() * phrasesArray.length);
    const randomPhrase = phrasesArray[randomIndex];

    if (typeof randomPhrase === 'string') {
        return [randomPhrase];
      } else if (Array.isArray(randomPhrase)) {
        return [...randomPhrase];
      }

  }

}