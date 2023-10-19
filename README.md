# # notification-center-api


## Requisitos
- node: v18.2.0
- npm: 8.9.0
- docker: ^20.10.12
- docker-compose: ^1.29.1

> [!NOTE]
> Recomenda-se o uso de Linux ou WSL no Windows.

## Ambiente de Desenvolvimento

### Comandos para executar o projeto localmente
- Construir imagens para exeuctar os serviços:
```bash
make build-base-dev
```

- Iniciar execução dos serviços:
```bash
make run-dev
```

- Caso tenha realizado alguma mudança que não tenha sido replicada dentro dos serviços, execute:
```bash
make update-dev
```

### Acessar aplicação em ambiente local
- Api: http://localhost:3000/
- Api Docs: http://localhost:3000/api


## Funcionamento da API
A api de notificações recebe requisões para criar objetos de ordem de pagamento, e para cada um deles inicia sua respectiva régua
de comunicação.
As réguas são divididas entre dois tipos: envios ativos e passivos. Cada um desses tipos utiliza tanto os canais de whatsapp quanto e-mail.

### Envios ativos
- Realizados no momento em que é realizado a criação/atualização de uma das entidades (PixOrder, PaymentBookOrder, CreditCardOrder).
- A criação (post) representa o estado inicial de uma Order. Exemplo, ao criar uma Order de qualquer um dos tipos citados anteriormente,
ela possui um status de "pending". Então uma notificação de **pagamento pendente** será disparada.
- O atualização (put) representa alterações do estado inicial de uma Order. Exemplo, ao atualizar a order de um Pix ou CreditCard
para o status de "paid", uma notificação de **pagamento confirmado** será disparada. No caso do PaymentBook, uma noticação de **parcela paga** será enviada, ou **pagamento confirmado** para o caso em que todas as parcelas foram pagas.

### Envios passivos
- Realizados por eventos periódicos que ocorrem em vários momentos do dia para PixOrder e PaymentBookOrder.
- Quando um PixOrder é criado, também são programadas tasks de envio para notificar do prazo de pagamento desse pix.
- Quando um PaymentBookOrder é criado, também são programdas tasks de envio para notificar do vencimento de cada um dos boletos.

### Melhorias Sugeridas
- Maior customização das réguas, setando o "ruler" de cada Order.
- Maior escabalidade de operações em background.

> [!NOTE]
> Essas melhorias não foram implementadas na versão atual porque já existia muita complexidade na criação do produto atual. Foi necessário utilizar dois canais de comunicação, para 3 diferentes tipos de pagamentos, cada um com fluxo ativo e passivo. Isso resulta em uma combinação de no mínimo 2 * 3 * 2 = 12 fluxos, sem considerar casos de exceção e testes realizados em um espaço de 3 semanas.
