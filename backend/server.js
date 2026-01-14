const express = require('express');
const cors = require('cors');
const knex = require('knex');
const app = express();

app.use(cors());
app.use(express.json());


const bcrypt = require('bcrypt');
const saltrounds = 10;
const db = knex({
  client: 'sqlite3',
  connection: { filename: "./estoque.sqlite" },
  useNullAsDefault: true
});

async function initDb() {
  const shelfExists = await db.schema.hasTable('produtos');
  if (!shelfExists) {
    await db.schema.createTable('produtos', table => {
      table.increments('id').primary();
      table.string('nome');
      table.string('categoria');
      table.integer('quantidade');
      table.decimal('preco');
    });
  }

  const trashExists = await db.schema.hasTable('excluidos');
  if (!trashExists) {
    await db.schema.createTable('excluidos', table => {
      table.increments('id').primary();
      table.string('nome');
      table.string('categoria');
      table.integer('quantidade');
      table.decimal('preco');
      table.timestamp('dataExclusao').defaultTo(db.fn.now());
    });
  }

  const userExists = await db.schema.hasTable('usuarios');
  if (!userExists) {
    await db.schema.createTable('usuarios', table => {
      table.increments('id').primary();
      table.string('nome').notNullable();
      table.string('email').unique().notNullable();
      table.string('senha').notNullable();
    });
    console.log("Tabela de usuários pronta!");
  }
}
initDb();

app.post('/api/usuarios/registrar', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
    
    await db('usuarios').insert({ 
      nome, 
      email, 
      senha: senhaCriptografada 
    });
    
    res.status(201).json({ mensagem: "Sucesso" });
  } catch (err) {
    res.status(400).json({ erro: "E-mail já existe" });
  }
});
app.post('/api/usuarios/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await db('usuarios').where({ email }).first();
    if (usuario) {
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (senhaValida) {
        return res.json({
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        });
      }
    }
    res.status(401).json({ erro: "E-mail ou senha incorretos" });

  } catch (err) {
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});
app.get('/api/produtos', async (req, res) => {
  const produtos = await db('produtos').select('*');
  res.json(produtos);
});

app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, categoria, quantidade, preco } = req.body;
    const [id] = await db('produtos').insert({
      nome, categoria, 
      quantidade: Number(quantidade), 
      preco: Number(preco) || 0
    });
    const novo = await db('produtos').where({ id }).first();
    res.status(201).json(novo);
  } catch (err) { res.status(500).send(err); }
});

app.put('/api/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db('produtos').where({ id: Number(id) }).update({
      nome: req.body.nome,
      categoria: req.body.categoria,
      quantidade: Number(req.body.quantidade),
      preco: Number(req.body.preco)
    });
    const atualizado = await db('produtos').where({ id: Number(id) }).first();
    res.json(atualizado);
  } catch (err) { res.status(500).send(err); }
});

app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await db('produtos').where({ id: Number(id) }).first();
    if (produto) {
      await db('excluidos').insert({
        nome: produto.nome,
        categoria: produto.categoria,
        quantidade: produto.quantidade,
        preco: produto.preco
      });
      await db('produtos').where({ id: Number(id) }).delete();
      res.json({ msg: "Apagado" });
    } else { res.status(404).send("Não encontrado"); }
  } catch (err) { res.status(500).send(err); }
});

app.get('/api/excluidos', async (req, res) => {
  const itens = await db('excluidos').select('*').orderBy('dataExclusao', 'desc');
  res.json(itens);
});

app.post('/api/excluidos/restaurar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await db('excluidos').where({ id: Number(id) }).first();
    if (item) {
      await db('produtos').insert({
        nome: item.nome,
        categoria: item.categoria,
        quantidade: item.quantidade,
        preco: item.preco
      });
      await db('excluidos').where({ id: Number(id) }).delete();
      res.json({ msg: "Restaurado" });
    }
  } catch (err) { res.status(500).send(err); }
});

app.listen(3001, () => console.log("Servidor ON na 3001"));