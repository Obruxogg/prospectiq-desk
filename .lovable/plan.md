# Plano — Plataforma comercial de cursos

## Objetivo
Entregar uma base funcional conectada ao Lovable Cloud para autenticação, catálogo comercial, simulações, propostas, CRM e gestão de equipe, preservando históricos e aplicando permissões no banco.

## Entregas
1. Ativar o Lovable Cloud e criar o modelo relacional com UUIDs, histórico, auditoria, índices, estados e exclusão lógica.
2. Implementar login por e-mail/senha e Google, sem tabela adicional de perfis; dados operacionais de usuários ficam limitados aos registros necessários de equipe e função.
3. Aplicar funções Administrador, Gerente e Vendedor em tabela separada, com políticas que restringem vendedor à própria carteira e gerente à própria equipe.
4. Criar catálogo configurável de áreas, cursos, preços, pagamentos, parcelas, descontos, campanhas, condições e etapas do CRM.
5. Criar fluxo funcional de simulação com busca de aluno por WhatsApp, cálculo instantâneo, snapshot da proposta, apresentação ao aluno e validade independente do retorno.
6. Criar contatos, interações, retornos, histórico de responsáveis, proposta, eventos, timer e auditoria.
7. Criar dashboards por função, CRM Kanban, páginas de contatos/propostas, gestão de usuários e transferência de carteira.
8. Inserir poucos dados claramente marcados como demonstração e validar os fluxos principais em desktop e tablet.

## Regras técnicas
- Nenhuma política comercial variável ficará fixa na interface; opções e limites serão lidos do banco.
- Papéis ficam em tabela separada e toda autorização sensível será validada por RLS/funções no servidor.
- Propostas guardam snapshots financeiros imutáveis.
- Desativação nunca apaga contatos, propostas ou históricos.
- O primeiro incremento prioriza o fluxo utilizável de vendedor e os controles essenciais de administração/gerência.
