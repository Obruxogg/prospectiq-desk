# Sales Navigator Hub

Crie uma aplicação web interna completa e funcional para gerenciamento comercial e atendimento de vendedores de cursos profissionalizantes.

IMPORTANTE: quero que este primeiro desenvolvimento já entregue uma BASE FUNCIONAL, e não apenas telas estáticas, mockups ou wireframes.

O sistema deve possuir autenticação, banco de dados, permissões, gerenciamento de usuários, catálogo configurável de cursos, motor de preços/descontos, calculadora comercial em tempo real, propostas, timer de validade e CRM individual por vendedor.

A aplicação deve ser modular e altamente configurável. Cursos, preços, descontos, condições, etapas do CRM, usuários e regras comerciais devem vir do banco de dados e poder ser alterados pelos usuários autorizados, sem necessidade de alterar o código.

Não criar valores, cursos ou regras comerciais fixos no código.

1. OBJETIVO DO SISTEMA

O sistema será utilizado internamente por uma equipe comercial.

O vendedor estará conversando com um aluno presencialmente ou por telefone/WhatsApp e deverá conseguir abrir "Nova Simulação", selecionar o curso e configurar rapidamente a condição comercial.

O sistema deverá calcular automaticamente:

valor original;

desconto;

valor final;

forma de pagamento;

quantidade de parcelas;

valor das parcelas;

validade da condição.

O vendedor deve conseguir mostrar a simulação para o aluno em uma interface limpa e profissional.

Depois da simulação, o contato deve ficar registrado automaticamente no CRM daquele vendedor.

O sistema também deve permitir acompanhar:

novos contatos;

contatos em atendimento;

propostas;

aguardando resposta;

negociação;

retorno agendado;

matriculados;

perdidos.

2. PERFIS DE USUÁRIO

Criar autenticação real e controle de acesso baseado em funções.

Perfis:

ADMINISTRADOR

Acesso completo.

Pode:

criar, editar, ativar e desativar gerentes;

criar, editar, ativar e desativar vendedores;

visualizar todos os contatos;

transferir contatos;

gerenciar áreas;

gerenciar cursos;

gerenciar preços;

gerenciar formas de pagamento;

gerenciar parcelamentos;

gerenciar descontos;

gerenciar condições comerciais;

gerenciar campanhas;

configurar etapas do CRM;

visualizar relatórios;

acessar todas as propostas;

acessar todos os históricos.

GERENTE

Responsável por uma equipe.

Pode:

criar vendedores;

editar vendedores;

ativar/desativar vendedores;

visualizar vendedores da equipe;

visualizar as carteiras dos vendedores;

visualizar contatos;

transferir contatos;

assumir contatos;

redistribuir carteiras;

visualizar propostas;

acompanhar timers;

visualizar retornos;

visualizar indicadores da equipe;

gerenciar cursos e condições quando tiver permissão.

VENDEDOR

Possui seu próprio ambiente.

Pode:

visualizar seu perfil;

cadastrar contatos;

visualizar seus contatos;

criar propostas;

utilizar a calculadora;

visualizar cursos disponíveis;

selecionar descontos permitidos;

registrar interações;

alterar estágio dos próprios contatos;

agendar retornos;

pausar timer;

continuar timer;

aumentar timer dentro das permissões;

alterar validade dentro das permissões;

visualizar suas propostas;

visualizar seu histórico.

Um vendedor não deve visualizar livremente a carteira de outro vendedor.

3. REGRA FUNDAMENTAL DOS CONTATOS

Os contatos pertencem à empresa, não ao vendedor.

O vendedor possui um RESPONSÁVEL ATUAL pelo contato.

Também deve existir um HISTÓRICO DE RESPONSÁVEIS.

Exemplo:

Aluno: João da Silva

Responsável atual:
Maria

Histórico:
João — 01/09/2026 até 15/09/2026
Maria — 15/09/2026 até atualmente

Se um vendedor sair ou for desativado:

não apagar contatos;

não apagar propostas;

não apagar histórico;

não apagar interações.

O gerente deve conseguir transferir:

um contato;

vários contatos;

toda a carteira;

propostas abertas.

Opções:

TRANSFERIR PARA VENDEDOR
DISTRIBUIR ENTRE VENDEDORES
DEIXAR SEM RESPONSÁVEL

Toda transferência deve gerar registro no histórico.

4. ESTRUTURA DE NAVEGAÇÃO

Criar menu adaptativo conforme o perfil.

VENDEDOR

Dashboard

Nova Simulação

Meus Contatos

Meu CRM

Minhas Propostas

Meu Perfil

GERENTE

Dashboard da Equipe

Vendedores

Contatos

CRM da Equipe

Propostas

Relatórios

Configurações

ADMINISTRADOR

Dashboard

Usuários

Gerentes

Vendedores

Áreas

Cursos

Preços

Descontos

Formas de Pagamento

Parcelamentos

Condições Comerciais

Campanhas

CRM

Contatos

Propostas

Relatórios

Configurações

5. DASHBOARD DO VENDEDOR

Criar dashboard simples e focado em ação.

Mostrar cards:

Novos

Aguardando resposta

Negociação

Propostas

Retornos hoje

Retornos atrasados

Matriculados

Perdidos

Mostrar também:

PRÓXIMOS RETORNOS

Exemplo:

João da Silva
Administração
Retornar hoje às 14:30

Maria Silva
Excel
Retornar amanhã às 10:00

Permitir clicar no contato e abrir diretamente o atendimento.

6. NOVA SIMULAÇÃO — PRINCIPAL TELA

Esta é a funcionalidade mais importante.

A tela deve ser extremamente rápida.

O vendedor deve conseguir fazer tudo com poucos cliques.

Criar fluxo:

ALUNO

Campo:

Nome

WhatsApp

E-mail opcional

Se o número de WhatsApp já existir, localizar o contato existente e permitir reutilizá-lo.

CURSO

Selecionar:

Área

Curso

Os cursos vêm do banco de dados.

Ao selecionar o curso, mostrar imediatamente:

Nome
Carga horária
Modalidade
Valor base

CONDIÇÃO

Selecionar:

Forma de pagamento

Parcelamento

Desconto

Todos esses dados devem vir das configurações cadastradas.

7. CÁLCULO EM TEMPO REAL

Não criar botão "Calcular".

O resultado deve atualizar imediatamente quando o vendedor mudar qualquer opção.

Exemplo:

Curso:
Excel

Valor:
R$ 2.400,00

Desconto:
10%

Desconto:
R$ 240,00

Valor final:
R$ 2.160,00

Parcelamento:
12x

Parcela:
R$ 180,00

Criar uma área de resultado destacada.

8. MOSTRAR PARA O ALUNO

Adicionar botão:

"Mostrar ao aluno"

Ao clicar, abrir uma visualização limpa, sem menus administrativos.

Exemplo:

FORMAÇÃO EM EXCEL

120 HORAS

De:
R$ 2.400,00

Por:
R$ 2.160,00

12x de:
R$ 180,00

CONDIÇÃO ESPECIAL

TEMPO RESTANTE:
29:43

Botões:

[ QUERO ESSA CONDIÇÃO ]

[ VOLTAR ]

Essa tela deve funcionar muito bem em desktop e tablet.

9. TIMER

Cada proposta poderá possuir uma validade configurável.

O timer deve possuir estados:

ativo;

pausado;

expirado;

concluído;

cancelado.

Controles:

[ PAUSAR ]

[ CONTINUAR ]

[ +30 MIN ]

[ +1 HORA ]

[ ALTERAR DATA/HORA ]

O vendedor deve conseguir ajustar o prazo de acordo com as permissões configuradas.

O gerente deve ter mais permissões.

O administrador deve ter acesso total.

IMPORTANTE:

O TIMER NÃO DEVE SER CONFUNDIDO COM O RETORNO DO VENDEDOR.

São duas coisas diferentes.

Exemplo:

Validade da condição:
18/09 às 18:00

Retorno:
19/09 às 10:00

10. RETORNOS

Criar sistema de follow-up.

O vendedor pode definir:

Data
Hora
Observação

Exemplo:

19/09/2026
10:00

"Aluno pediu para analisar a proposta e responder amanhã."

O dashboard deve mostrar o retorno.

Criar estados:

pendente;

concluído;

atrasado;

cancelado.

11. CRM INDIVIDUAL DO VENDEDOR

Cada vendedor possui seu próprio CRM.

Criar Kanban.

Etapas iniciais:

Novo

Contato realizado

Interesse

Proposta enviada

Aguardando resposta

Negociação

Retorno agendado

Matriculado

Perdido

As etapas devem ser configuráveis pelo administrador.

Permitir:

criar etapa;

editar;

ativar/desativar;

alterar ordem.

Não colocar essas etapas diretamente no código.

12. CARDS DO CRM

Cada card deve mostrar:

Nome
WhatsApp
Curso
Valor da proposta
Status
Próximo retorno
Timer, se houver

Permitir abrir o contato.

Permitir mover entre etapas.

Ao mover, registrar histórico.

13. CONTATO / ALUNO

Criar cadastro simples:

Nome;

WhatsApp;

E-mail;

Observações;

Origem;

Responsável atual;

Status;

Data de criação.

Não criar dezenas de campos desnecessários.

O sistema deve priorizar velocidade.

14. PÁGINA DO ALUNO

Ao abrir um aluno mostrar:

INFORMAÇÕES

Nome
WhatsApp
E-mail
Responsável
Status

CURSOS DE INTERESSE

Lista dos cursos já simulados.

PROPOSTAS

Lista de propostas.

RETORNOS

Histórico de follow-ups.

INTERAÇÕES

Registro de contatos.

HISTÓRICO

Mostrar cronologicamente:

Contato criado
Curso selecionado
Proposta criada
Desconto aplicado
Timer iniciado
Timer pausado
Timer alterado
Retorno agendado
Mudança de estágio
Transferência de vendedor

15. CATÁLOGO DE ÁREAS E CURSOS

Criar gerenciamento configurável.

ÁREA

Campos:

ID

Nome

Descrição opcional

Status

Ordem

CURSO

Campos:

ID

Área

Nome

Descrição opcional

Carga horária

Modalidade

Valor base

Status

Ordem

Permitir:

criar;

editar;

duplicar;

ativar;

desativar.

Não excluir fisicamente cursos que já foram usados em propostas.

16. PREÇOS

Criar estrutura separada para preços.

Não assumir que existe apenas um preço.

Permitir configurar:

preço de tabela;

preço à vista;

preço por forma de pagamento;

número de parcelas;

valor da parcela;

condições especiais.

Quando uma proposta for criada, salvar o valor utilizado naquele momento.

Se o preço do curso mudar depois, propostas antigas NÃO devem mudar.

17. DESCONTOS

Criar sistema configurável de descontos.

Permitir:

percentual;

valor fixo;

mínimo;

máximo;

padrão/recomendado;

cursos permitidos;

formas de pagamento permitidas;

usuários/perfis permitidos;

período de validade.

Exemplo apenas ilustrativo:

5% — vendedor
10% — vendedor
15% — vendedor
20% — gerente
25% — administrador

NÃO fixar esses valores.

Eles devem ser cadastrados pelo administrador.

Se o vendedor ultrapassar o limite:

bloquear;
OU

solicitar autorização,

conforme configuração.

18. CONDIÇÕES COMERCIAIS

Criar um módulo para montar condições.

Uma condição pode relacionar:

curso;

preço;

forma de pagamento;

parcelamento;

desconto;

validade;

perfil autorizado;

campanha.

O objetivo é que a empresa possa alterar sua política comercial sem alterar o código da aplicação.

19. PROPOSTAS

Criar entidade de proposta.

Salvar:

aluno;

vendedor;

curso;

área;

preço original;

desconto;

valor do desconto;

valor final;

forma de pagamento;

parcelas;

valor da parcela;

data;

validade;

status;

observações.

A proposta deve guardar um SNAPSHOT dos valores.

Alterações futuras no catálogo não podem alterar propostas antigas.

Status:

rascunho;

enviada;

visualizada;

aguardando resposta;

negociação;

aprovada;

recusada;

expirada;

cancelada.

20. HISTÓRICO DE PROPOSTAS

Registrar eventos.

Exemplo:

18/09 09:32
Proposta criada

18/09 09:35
Proposta apresentada

18/09 09:40
Timer pausado

18/09 09:41
Timer aumentado em 1 hora

18/09 09:42
Retorno agendado

Registrar:

usuário;

ação;

data/hora;

valor anterior;

valor novo;

observação.

21. GERENCIAMENTO DE VENDEDORES

Criar painel para gerente.

Mostrar:

Nome
Foto
E-mail
Telefone
Status
Data de entrada
Quantidade de contatos
Propostas
Matrículas

Status:

ATIVO
INATIVO

Ao desativar:

NÃO apagar contatos.

NÃO apagar propostas.

NÃO apagar histórico.

Mostrar:

"Este vendedor possui X contatos ativos."

Depois:

[ TRANSFERIR CARTEIRA ]

22. TRANSFERÊNCIA DE CARTEIRA

Criar ferramenta específica.

Exemplo:

VENDEDOR DE ORIGEM:
João

CONTATOS:
32

Selecionar:

[ Maria ]

Opções:

[ Transferir todos ]

[ Selecionar contatos ]

[ Distribuir automaticamente ]

Após transferência:

alterar responsável atual;

manter histórico;

manter propostas;

manter interações;

registrar auditoria.

23. DASHBOARD DO GERENTE

Mostrar visão da equipe.

Cards:

Vendedores ativos
Contatos ativos
Novos contatos
Propostas abertas
Aguardando resposta
Retornos hoje
Retornos atrasados
Matrículas
Perdidos

Mostrar lista dos vendedores:

Nome
Contatos
Propostas
Matrículas
Status

Permitir abrir a carteira de cada vendedor.

O gerente pode visualizar o CRM do vendedor sem alterar o responsável pelos contatos.

24. PERFIL DO VENDEDOR

Cada vendedor deve ter sua própria página de perfil.

Mostrar:

foto;

nome;

e-mail;

telefone;

cargo;

gerente;

data de entrada;

status;

quantidade de contatos;

propostas;

matrículas.

O vendedor pode editar apenas seus dados permitidos.

Gerente/admin pode editar o perfil completo.

25. AUDITORIA

Criar tabela de auditoria.

Registrar alterações importantes:

criação de usuário;

desativação;

alteração de preço;

alteração de desconto;

criação de proposta;

alteração de proposta;

transferência de contato;

alteração de timer;

alteração de estágio.

Guardar:

usuário
ação
data/hora
entidade
ID da entidade
dados anteriores quando aplicável
dados novos quando aplicável

26. BANCO DE DADOS

Utilizar banco relacional, preferencialmente Supabase/PostgreSQL caso seja o ambiente padrão do projeto.

Criar estrutura adequada para:

users
roles
teams
areas
courses
course_prices
payment_methods
installment_options
discount_rules
commercial_conditions
campaigns
students
student_assignments
student_interactions
proposals
proposal_events
proposal_timer_events
crm_stages
followups
audit_logs

Utilizar UUID.

Utilizar timestamps.

Criar relacionamentos.

Criar índices necessários.

Utilizar soft delete/status quando houver histórico.

27. SEGURANÇA

Implementar autenticação real.

Implementar autorização no backend/banco, não somente escondendo elementos da interface.

Aplicar Row Level Security.

VENDEDOR:

acesso aos próprios contatos;

acesso às próprias propostas;

acesso ao próprio histórico;

acesso ao catálogo permitido.

GERENTE:

acesso aos dados da própria equipe;

gestão dos vendedores;

gestão/transferência dos contatos da equipe;

visualização das propostas da equipe.

ADMINISTRADOR:

acesso completo.

28. DESIGN

Criar uma interface moderna, profissional e limpa.

O sistema deve parecer uma ferramenta comercial moderna, não um ERP antigo.

Priorizar:

velocidade;

poucos cliques;

boa hierarquia visual;

cards;

tabelas;

filtros;

Kanban;

indicadores;

modais;

feedback visual.

Usar português do Brasil em toda a interface.

Moeda:
BRL / R$.

Datas:
DD/MM/YYYY.

Horários:
formato 24h.

A interface deve ser responsiva, com prioridade para desktop e tablet.

29. PRINCÍPIO DE MODULARIDADE

Esta regra é OBRIGATÓRIA:

Nenhum curso, preço, desconto, parcela, etapa do CRM, permissão ou regra comercial deve ficar hardcoded.

Tudo que pode mudar na operação deve ser configurável no banco.

O sistema deve permitir que futuramente sejam adicionados:

novas áreas;

novos cursos;

novos vendedores;

novos gerentes;

novas formas de pagamento;

novas condições;

novas campanhas;

novas etapas do CRM;

novas regras de desconto;

sem necessidade de alterar a arquitetura principal.

30. PRIORIDADE DE IMPLEMENTAÇÃO

Como este é o primeiro desenvolvimento e preciso de uma base funcional, implemente tudo em uma única aplicação, mas respeite esta ordem interna:

PRIORIDADE 1:

banco de dados;

autenticação;

RBAC;

usuários;

estrutura de equipe;

segurança.

PRIORIDADE 2:

áreas;

cursos;

preços;

descontos;

formas de pagamento;

parcelamentos;

condições comerciais.

PRIORIDADE 3:

cadastro de alunos;

calculadora;

cálculo em tempo real;

propostas;

timer;

retorno.

PRIORIDADE 4:

CRM;

Kanban;

histórico;

dashboard do vendedor.

PRIORIDADE 5:

gerenciamento de vendedores;

transferência de carteira;

dashboard do gerente;

auditoria.

Tudo deve estar conectado e funcional.

31. DADOS INICIAIS

Criar apenas dados seed/demonstração mínimos para que seja possível testar a aplicação.

Não tratar esses dados como dados reais.

Criar exemplos para:

1 administrador;

1 gerente;

2 vendedores;

algumas áreas;

alguns cursos;

algumas condições comerciais;

alguns contatos;

algumas propostas.

Deixar claramente identificados como dados de demonstração.

32. EXPERIÊNCIA PRINCIPAL DO VENDEDOR

O fluxo mais importante deve ser:

LOGIN

↓

DASHBOARD

↓

NOVA SIMULAÇÃO

↓

Selecionar aluno

↓

Selecionar área

↓

Selecionar curso

↓

Selecionar pagamento

↓

Selecionar desconto

↓

CÁLCULO AUTOMÁTICO

↓

MOSTRAR AO ALUNO

↓

Criar proposta

↓

Iniciar validade/timer

↓

Registrar no CRM

↓

Agendar retorno se necessário

O vendedor deve conseguir executar esse fluxo rapidamente.

33. IMPORTANTE SOBRE A IMPLEMENTAÇÃO

Não criar somente componentes visuais.

Criar a aplicação realmente funcional, conectada ao banco de dados.

Não deixar botões principais sem ação.

Não usar dados mockados para substituir funcionalidades reais.

Não colocar regras comerciais diretamente no frontend.

Validar permissões no backend/banco.

Criar tratamento de erros e estados de carregamento.

Criar confirmações para ações destrutivas ou importantes.

Preservar histórico.

Não excluir dados que sejam necessários para auditoria.

Se alguma funcionalidade avançada não puder ser implementada perfeitamente neste primeiro desenvolvimento, priorizar a fundação, autenticação, banco, permissões, catálogo, calculadora, propostas, CRM e gestão de contatos.

O objetivo é terminar esta primeira construção com um MVP realmente utilizável e uma arquitetura sólida para futuras melhorias.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://prospectiq-desk.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/608d687d-780e-49eb-92b8-9758cc89a6a6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
