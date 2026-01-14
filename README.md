Sistema Full Stack desenvolvido para o gerenciamento dinâmico de estoque de uma auto peças, com foco em segurança, controle financeiro e usabilidade.
🚀 Tecnologias Utilizadas
*O projeto foi construído utilizando as seguintes tecnologias:
.Frontend-React.js-Interface de usuário dinâmica e reativa.
.Backend	Node.js + Express	Criação de API RESTful e rotas de autenticação.
.Banco de Dados	SQLite + Knex.js-Persistência de dados e consultas SQL.
.Segurança-Bcrypt-Criptografia de senhas (Hashing).
.Design/UI	Lucide Icons + CSS3	Estilização moderna e iconografia profissional.

✨ Funcionalidades Principais
.Autenticação Segura: Sistema de login e cadastro com senhas protegidas via bcrypt.
.Gestão de Sessão: Uso de localStorage para manter o usuário logado após atualizar a página.
.Dashboard Financeiro: Cálculo automático de patrimônio total em estoque e alerta de itens críticos (baixo estoque).
.CRUD de Produtos: Cadastro, edição, listagem e exclusão de peças.
.Busca em Tempo Real: Filtro instantâneo por nome ou categoria de produto.
.Sistema de Lixeira (Soft Delete): Itens excluídos são movidos para uma seção de "Arquivados" para segurança de dados.

🔒 Destaques Técnicos:
1-Segurança da Informação: As senhas dos usuários nunca são salvas em texto puro. Utilizamos a técnica de Hashing com bcrypt para garantir a integridade dos dados.
2-API RESTful: Comunicação padronizada entre o Frontend e Backend utilizando códigos de status HTTP (200, 401, 500) para tratamento de erros.
3-Desenvolvimento Sustentável: Código organizado em componentes no React e rotas modulares no Node.js.

  *IMPORTANTE*:
 🔄 Versatilidade e Adaptabilidade
Embora o projeto tenha sido inicialmente modelado para uma **Auto Peças**, sua arquitetura foi desenvolvida seguindo princípios de abstração de dados, o que o torna facilmente adaptável para diversos outros nichos de comércio, tais como:
* 💊 **Farmácias e Drogarias** (Controle de lotes e categorias de medicamentos).
* 🛒 **Mercados e Mercearias** (Gestão de itens de consumo e validade).
* 👕 **Lojas de Vestuário** (Organização por categorias, tamanhos e preços).

A estrutura do Banco de Dados e as rotas da API foram projetadas de forma genérica, permitindo que o sistema funcione como um motor de estoque para qualquer negócio que exija controle de entrada, saída e patrimônio.
