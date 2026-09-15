import AuthNavBar from "../components/AuthNavBar";
import { useState } from "react";
import {useNavigate, useLocation } from "react-router-dom";
import {useAuth} from '../context/AuthContext';
import {login as loginService} from '../services/authService';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import api from '../services/api';
export default function AuthPage() {
  const location = useLocation();
  const [modo, setModo] = useState(location.state?.modo === "cadastro" ? "cadastro" : "login");
  const navigate = useNavigate();
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [erroEmailCadastro, setErroEmailCadastro] = useState('');
  const [erroSenhaCadastro, setErroSenhaCadastro] = useState('');
  const [erroConfirmarSenha, setErroConfirmarSenha] = useState('');
  const [erroCadastroApi, setErroCadastroApi] = useState('');
  const [sucessoCadastro, setSucessoCadastro] = useState('');
  const [emailEsqueci, setEmailEsqueci] = useState('');
  const [erroEsqueci, setErroEsqueci] = useState('');
  const [sucessoEsqueci, setSucessoEsqueci] = useState('');
  const [emailNaoVerificado, setEmailNaoVerificado] = useState(false);
  const [reenvioFeito, setReenvioFeito] = useState(false);

  async function handleLogin(e){
    e.preventDefault()
    setErro('')
    setEmailNaoVerificado(false)
    setReenvioFeito(false)
    try{
      const resposta = await loginService(email,senha)
      login (resposta.data.token, resposta.data.nome)
      navigate('/dashboard')
    } catch(error){
      if(error.response?.status === 403 && error.response?.data?.erro === 'email_nao_verificado'){
        setEmailNaoVerificado(true)
        setErro('Confirme seu email antes de entrar — veja o link que mandamos pra sua caixa de entrada.')
      }else if(error.response?.status === 429){
        setErro('Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.')
      }else{
        setErro('Email ou senha incorretos.')
      }
    }
  }

  async function handleReenviarVerificacao(){
    try{
      await api.post('/auth/reenviar-verificacao', { email })
    }catch{
      // silencioso de propósito — mesmo padrão de não revelar nada sobre o email
    }
    setReenvioFeito(true)
  }
  async function handleCadastro(e){
    e.preventDefault();
    if(!validarCadastro()){
      return;
    }
    setErroCadastroApi('')
    try{
      await api.post('/usuarios' , {nome, email: emailCadastro, senha: senhaCadastro})
      setSucessoCadastro('Cadastro realizado! Você já pode entrar.')
      setModo('login')
    }catch{
      setErroCadastroApi('Erro ao cadastrar. Verifique os dados e tente novamente')
    }
  }

  async function handleEsqueciSenha(e){
    e.preventDefault()
    setErroEsqueci('')
    setSucessoEsqueci('')
    try{
      await api.post('/auth/esqueci-senha', { email: emailEsqueci })
      setSucessoEsqueci('Se esse email estiver cadastrado, você vai receber um link de redefinição em instantes.')
    }catch{
      setErroEsqueci('Não foi possível enviar o link. Tente novamente.')
    }
  }

  function validarCadastro(){
    let valido = true;

    setErroNome('');
    setErroEmailCadastro('');
    setErroSenhaCadastro('');
    setErroConfirmarSenha('');
    setErroCadastroApi('');


    if(nome.trim().length < 3){
      setErroNome('Nome deve ter pelo menos 3 caracteres');
      valido = false;
    }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if(!emailRegex.test(emailCadastro)){
        setErroEmailCadastro("Digite um email válido!");
        valido = false;
      }

      if(senhaCadastro.length < 6){
        setErroSenhaCadastro("A senha deve ter pelo menos 6 caracteres!");
        valido = false;
      }

      if(senhaCadastro !== confirmarSenha){
        setErroConfirmarSenha("As senhas não coincidem, por favor verificar!");
        valido = false;
      }
      return valido;
  }

  return (
    <>
      <AuthNavBar onCadastrar={() => setModo("cadastro")} />
      <section className="auth-page">
        <Container>
          <h2 className="auth-titulo">Veyra</h2>
          <Card className="card-auth">
            <Card.Body>
              <Form onSubmit={modo === 'login' ? handleLogin : modo === 'esqueci' ? handleEsqueciSenha : handleCadastro}>
                {modo === 'login' ? (
                  <>
                    <Form.Group className="mb-3" controlId="form-email">
                      <Form.Label>Digite seu email de cadastro:</Form.Label>
                      <Form.Control type="email" placeholder="Seu email" value={email} onChange={e => setEmail(e.target.value)}/>
                      <Form.Text className="text-muted">
                        Não compartilhe seus dados de cadastro com ninguém.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="form-senha">
                      <Form.Label>Digite sua senha:</Form.Label>
                      <Form.Control type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
                    </Form.Group>

                    <Button className="btn-laranja w-100" type="submit">
                      Entrar
                    </Button>
                    {erro && <p style={{color: 'red' , fontSize:'0.85rem', textAlign: 'center'}}>{erro}</p>}
                    {sucessoCadastro && <p style={{color: 'green', fontSize: '0.85rem', textAlign: 'center'}}>{sucessoCadastro}</p>}

                    {emailNaoVerificado && !reenvioFeito && (
                      <p className="text-center" style={{fontSize:'0.85rem'}}>
                        <span className="link-cadastro" onClick={handleReenviarVerificacao}>
                          Reenviar email de confirmação
                        </span>
                      </p>
                    )}
                    {reenvioFeito && (
                      <p className="text-center" style={{color: 'green', fontSize:'0.85rem'}}>
                        Se o email existir, um novo link foi enviado.
                      </p>
                    )}

                    <p className="text-center mt-3" style={{fontSize:'0.85rem', color:'var(--cor-textos-suaves)'}}>
                      <span className="link-cadastro" onClick={() => setModo('esqueci')}>
                        Esqueceu sua senha?
                      </span>
                    </p>
                    <p className="text-center mt-2" style={{fontSize:'0.85rem', color:'var(--cor-textos-suaves)'}}>
                      Não possui cadastro?{' '}
                      <span className="link-cadastro" onClick={() => setModo('cadastro')}>
                        Cadastre-se agora.
                      </span>
                    </p>
                  </>
                ) : modo === 'esqueci' ? (
                  <>
                    <Form.Group className="mb-3" controlId="form-email-esqueci">
                      <Form.Label>Digite seu email de cadastro:</Form.Label>
                      <Form.Control type="email" placeholder="Seu email" value={emailEsqueci} onChange={e => setEmailEsqueci(e.target.value)}/>
                      <Form.Text className="text-muted">
                        Vamos te mandar um link pra escolher uma nova senha.
                      </Form.Text>
                    </Form.Group>

                    <Button className="btn-laranja w-100" type="submit">
                      Enviar link
                    </Button>
                    {erroEsqueci && <p style={{color: 'red', fontSize:'0.85rem', textAlign: 'center'}}>{erroEsqueci}</p>}
                    {sucessoEsqueci && <p style={{color: 'green', fontSize:'0.85rem', textAlign: 'center'}}>{sucessoEsqueci}</p>}

                    <p className="text-center mt-3" style={{fontSize:'0.85rem', color:'var(--cor-textos-suaves)'}}>
                      <span className="link-cadastro" onClick={() => setModo('login')}>
                        Voltar para o login
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <Form.Group className="mb-3" controlId="form-nome-cadastro">
                      <Form.Label>Digite seu nome completo:</Form.Label>
                      <Form.Control type='text' placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)}/>
                    </Form.Group>
                    {erroNome && <p style={{color: 'red', fontSize:'0.8rem'}}>{erroNome}</p>}

                    <Form.Group className="mb-3" controlId="form-email-cadastro">
                      <Form.Label>Digite seu email para cadastro:</Form.Label>
                      <Form.Control type='email' placeholder="Seu email" value={emailCadastro} onChange={e => setEmailCadastro(e.target.value)}/>
                    </Form.Group>
                    {erroEmailCadastro && <p style={{color: 'red', fontSize:'0.8rem'}}>{erroEmailCadastro}</p>}

                    <Form.Group className="mb-3" controlId="form-senha-cadastro">
                      <Form.Label>Digite sua senha para cadastro:</Form.Label>
                      <Form.Control type='password' placeholder="Senha" value={senhaCadastro} onChange={e => setSenhaCadastro(e.target.value)}/>
                      <Form.Text className="text-muted">
                        Não compartilhe seus dados de cadastro com ninguém.
                      </Form.Text>
                      {erroSenhaCadastro && <p style={{color: 'red', fontSize:'0.8rem'}}>{erroSenhaCadastro}</p>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="form-confirmar-senha">
                      <Form.Label>Digite novamente sua senha:</Form.Label>
                      <Form.Control type="password" placeholder="Confirme sua senha" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)}
                      />
                    </Form.Group>
                    {erroConfirmarSenha && <p style={{color: 'red', fontSize:'0.8rem'}}>{erroConfirmarSenha}</p>}

                    <Button className="btn-laranja w-100" type="submit">Cadastrar</Button>
                    {erroCadastroApi && <p style={{color: 'red', fontSize: '0.85rem', textAlign: 'center'}}>{erroCadastroApi}</p>}
                    {sucessoCadastro && <p style={{color: 'green', fontSize: '0.85rem', textAlign: 'center'}}>{sucessoCadastro}</p>}
                    <p className="text-center mt-3" style={{fontSize: '0.85rem', color:'var(--cor-textos-suaves)'}}>
                      Já tem conta?{' '}
                      <span className="link-cadastro" onClick={() => setModo('login')}>
                        Entrar
                      </span>
                    </p>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </>
  )
}
