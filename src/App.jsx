import { useState, useEffect } from 'react';
// 1. ADICIONADO 'Search' NO IMPORT ABAIXO
import { Package, Search, AlertTriangle, CheckCircle, User, LogOut, Trash2, Pencil } from 'lucide-react';
import './App.css';

function LoginPage({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icon"><User size={40} /></div>
        <h2>Estoque Dinamizado</h2>
        <p>Acesse seu painel de gerenciamento</p>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, senha); }}>
          <div className="form-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="admin@auto.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-login">Entrar no Sistema</button>
        </form>
        <div className="login-footer">
          <span>Novo por aqui?
            <button className="link-btn" onClick={() => onSwitch('cadastro')}> Crie uma conta</button>
          </span>
        </div>
      </div>
    </div>
  );
}

// REMOVIDA A PALAVRA 'useEffect' QUE ESTAVA SOLTA AQUI

function RegisterPage({ onSwitch, onRegister }) {
  const [dados, setDados] = useState({ nome: '', email: '', senha: '', confirmar: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dados.senha !== dados.confirmar) {
      alert("As senhas não coincidem!");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/usuarios/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: dados.nome, email: dados.email, senha: dados.senha })
      });

      if (response.ok) {
        alert("Cadastro realizado!");
        onSwitch('login');
      } else {
        alert("Erro ao cadastrar.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box register-box">
        <div className="login-icon green-icon"><User size={40} /></div>
        <h2>Crie sua Conta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo</label>
            <input type="text" required onChange={(e) => setDados({ ...dados, nome: e.target.value })} />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" required onChange={(e) => setDados({ ...dados, email: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Senha</label>
              <input type="password" required onChange={(e) => setDados({ ...dados, senha: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Confirmar</label>
              <input type="password" required onChange={(e) => setDados({ ...dados, confirmar: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-login btn-register">Finalizar Cadastro</button>
        </form>
        <div className="login-footer">
          <span>Já tem conta? <button className="link-btn" onClick={() => onSwitch('login')}>Faça Login</button></span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [itensExcluidos, setItensExcluidos] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [novoProduto, setNovoProduto] = useState({ 
    nome: '', 
    categoria: 'Suspensão', 
    quantidade: '', 
    preco: '' 
  });

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
      setTelaAtual('dashboard');
    }
  }, []);

  useEffect(() => {
    if (telaAtual === 'dashboard') {
      buscarProdutos();
      buscarExcluidos();
    }
  }, [telaAtual]); 

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado'); 
    setUsuario(null);                        
    setTelaAtual('login');                   
  };

  const buscarProdutos = async () => {
    try {
      const resposta = await fetch('http://localhost:3001/api/produtos');
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    }
  };

  const buscarExcluidos = async () => {
    try {
      const resposta = await fetch('http://localhost:3001/api/excluidos');
      const dados = await resposta.json();
      setItensExcluidos(dados);
    } catch (erro) {
      console.error("Erro ao buscar lixeira", erro);
    }
  };

  const handleLoginReal = async (email, senha) => {
    try {
      const response = await fetch('http://localhost:3001/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        const dadosUser = await response.json();
        // 2. SALVANDO NO LOCALSTORAGE PARA O F5 FUNCIONAR
        localStorage.setItem('usuarioLogado', JSON.stringify(dadosUser));
        setUsuario(dadosUser);
        setTelaAtual('dashboard');
      } else {
        alert("Credenciais incorretas");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const prepararEdicao = (prod) => {
    setProdutoEditando(prod);
    setNovoProduto({
      nome: prod.nome,
      categoria: prod.categoria,
      quantidade: prod.quantidade,
      preco: prod.preco
    });
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setProdutoEditando(null);
    setNovoProduto({ nome: '', categoria: 'Suspensão', quantidade: '', preco: '' });
  };

  const handleSaveProduto = async (e) => {
    e.preventDefault();
    const url = produtoEditando 
      ? `http://localhost:3001/api/produtos/${produtoEditando.id}` 
      : 'http://localhost:3001/api/produtos';
    
    const metodo = produtoEditando ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
      });

      if (response.ok) {
        const data = await response.json();
        if (produtoEditando) {
          setProdutos(produtos.map(p => p.id === data.id ? data : p));
        } else {
          setProdutos([...produtos, data]);
        } 
        fecharModal();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const excluirProduto = async (id) => {
    if (!window.confirm("Deseja realmente excluir este item?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/produtos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProdutos(produtos.filter(p => p.id !== id));
        buscarExcluidos();
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const produtosFiltrados = produtos.filter(prod => 
    prod.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    prod.categoria.toLowerCase().includes(termoBusca.toLowerCase())
  );

  if (telaAtual === 'login') {
    return <LoginPage onLogin={handleLoginReal} onSwitch={setTelaAtual} />;
  }

  if (telaAtual === 'cadastro') {
    return <RegisterPage onRegister={() => setTelaAtual('dashboard')} onSwitch={setTelaAtual} />;
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Painel de Estoque</h1>
          <p>Bem-vindo, {usuario?.nome}</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={18} /> Sair
        </button>
      </header>

      <div className="dashboard-cards">
        <div className="card">
          <div className="card-icon blue"><Package size={24} /></div>
          <div><span>Total de Itens</span><strong>{produtos.length}</strong></div>
        </div>
        <div className="card">
          <div className="card-icon orange"><AlertTriangle size={24} /></div>
          <div><span>Baixo Estoque</span><strong>{produtos.filter(p => p.quantidade <= 5).length}</strong></div>
        </div>
        <div className="card">
          <div className="card-icon green"><CheckCircle size={24} /></div>
          <div><span>Categorias</span><strong>{new Set(produtos.map(p => p.categoria)).size}</strong></div>
        </div>
      </div>

      <div className="action-bar">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" /> 
          <input 
            type="text" 
            placeholder="Pesquisar peça ou categoria..." 
            className="input-search"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
        <button className='btn-add' onClick={() => {
          setProdutoEditando(null);
          setNovoProduto({ nome: '', categoria: 'Suspensão', quantidade: '', preco: '' });
          setIsModalOpen(true);
        }}>
          + Novo Produto
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Qtd</th>
              <th>Preço Un.</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((prod) => (
              <tr key={prod.id}>
                <td><strong>{prod.nome}</strong></td>
                <td>{prod.categoria}</td>
                <td>{prod.quantidade}</td>
                <td>{formatarMoeda(prod.preco)}</td>
                <td>{formatarMoeda(prod.quantidade * prod.preco)}</td>
                <td>
                  <span className={`status ${prod.quantidade > 5 ? 'ok' : 'low'}`}>
                    {prod.quantidade > 5 ? 'Estável' : 'Crítico'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-icon-edit" onClick={() => prepararEdicao(prod)}>
                    <Pencil size={16} />
                  </button>
                  <button className="btn-icon-delete" onClick={() => excluirProduto(prod.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{produtoEditando ? 'Editar Produto' : 'Novo Produto'}</h2>
            <form onSubmit={handleSaveProduto}>
              <div className="form-group">
                <label>Nome do Produto</label>
                <input
                  type="text"
                  required
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Categoria</label>
                  <select value={novoProduto.categoria} onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}>
                    <option>Suspensão</option>
                    <option>Freios</option>
                    <option>Motor</option>
                    <option>Elétrica</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantidade</label>
                  <input 
                    type="number" 
                    required
                    value={novoProduto.quantidade} 
                    onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: e.target.value })} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Preço Unitário (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={novoProduto.preco} 
                  onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })} 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="btn-save">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;