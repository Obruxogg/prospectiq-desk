import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useIM, DEMO_PROFILES } from "@/components/im/im-context";

export function IMAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setProfile, setIsDemoMode, visualSettings } = useIM();

  const handleDemoLogin = (profileId: string) => {
    const profile = DEMO_PROFILES.find((p) => p.id === profileId);
    if (profile) {
      setProfile(profile);
      setIsDemoMode(true);
      navigate({ to: "/" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          setIsDemoMode(false);
          navigate({ to: "/" });
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setErrorMsg("Verifique seu email para confirmar o cadastro.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg("Digite seu email para redefinir a senha.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (error) throw error;
      setErrorMsg("Link de redefini├º├úo enviado para seu email.");
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro ao enviar o email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* Lado Esquerdo ÔÇö Intro & Brand (Escondido no mobile) */}
      <div className="auth-intro">
        <div className="auth-intro-grid" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <a href="#" className="brand-mark">
            <div className="brand-icon">IM</div>
            <span style={{ color: "white" }}>
              Instituto <strong>Mix</strong>
            </span>
          </a>
        </div>

        <div className="auth-copy">
          <p className="eyebrow">Sistema Comercial Integrado</p>
          <h1>
            Seu futuro <br />
            come├ºa <span>aqui.</span>
          </h1>
          <p>
            Plataforma completa de gest├úo comercial, atendimento ao aluno e
            acompanhamento de metas do {visualSettings.institution_name}.
          </p>

          <ul>
            <li>
              <div className="li-icon">Ô£ô</div>
              Gest├úo eficiente de leads e propostas
            </li>
            <li>
              <div className="li-icon">Ô£ô</div>
              Apresenta├º├úo comercial interativa (Modo Aluno)
            </li>
            <li>
              <div className="li-icon">Ô£ô</div>
              Follow-ups organizados e timers de negocia├º├úo
            </li>
          </ul>
        </div>

        <div className="auth-quote">
          "Transformando a vida das pessoas atrav├®s da educa├º├úo profissional."
        </div>
      </div>

      {/* Lado Direito ÔÇö Formul├írio */}
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <div className="brand-icon" style={{ background: "var(--im-red)", color: "white", width: "2rem", height: "2rem", display: "grid", placeItems: "center", borderRadius: "0.4rem" }}>IM</div>
            Instituto Mix
          </div>

          <h2>{isLogin ? "Bem-vindo(a) de volta" : "Criar sua conta"}</h2>
          <p className="form-lead">
            {isLogin
              ? "Acesse o sistema comercial da unidade."
              : "Preencha os dados abaixo para solicitar acesso ao sistema."}
          </p>

          {errorMsg && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                background: errorMsg.includes("enviado")
                  ? "var(--im-success)"
                  : "var(--destructive)",
                color: "white",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: "1.5rem" }}>
            <div className="field">
              <div className="field-label-row">
                <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>E-mail corporativo</label>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@institutomix.com.br"
                required
                style={{
                  padding: "0 0.8rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  outline: "none",
                }}
              />
            </div>

            <div className="field">
              <div className="field-label-row">
                <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Senha</label>
                {isLogin && (
                  <button type="button" onClick={handleForgotPassword} className="text-button">
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó"
                  required
                  style={{
                    width: "100%",
                    padding: "0 0.8rem",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--muted-foreground)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="submit-button btn-im-primary"
              disabled={loading}
              style={{
                borderRadius: "var(--radius-md)",
                fontWeight: 600,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Processando..."
                : isLogin
                ? "Entrar no sistema"
                : "Solicitar acesso"}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? "N├úo tem uma conta? " : "J├í tem acesso? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-button">
              {isLogin ? "Solicitar acesso" : "Fazer login"}
            </button>
          </div>

          <div className="form-divider">ou use um perfil de demonstra├º├úo</div>

          <div className="profile-picker">
            <div
              className="profile-card"
              onClick={() => handleDemoLogin(DEMO_PROFILES[0].id)}
            >
              <div className="profile-avatar">
                {DEMO_PROFILES[0].name.charAt(0)}
              </div>
              <div className="profile-info">
                <strong>{DEMO_PROFILES[0].name}</strong>
                <span>{DEMO_PROFILES[0].email}</span>
              </div>
              <div className="profile-badge badge-admin">Diretor</div>
            </div>

            <div
              className="profile-card"
              onClick={() => handleDemoLogin(DEMO_PROFILES[1].id)}
            >
              <div className="profile-avatar">
                {DEMO_PROFILES[1].name.charAt(0)}
              </div>
              <div className="profile-info">
                <strong>{DEMO_PROFILES[1].name}</strong>
                <span>{DEMO_PROFILES[1].email}</span>
              </div>
              <div className="profile-badge badge-manager">Gerente</div>
            </div>

            <div
              className="profile-card"
              onClick={() => handleDemoLogin(DEMO_PROFILES[2].id)}
            >
              <div className="profile-avatar">
                {DEMO_PROFILES[2].name.charAt(0)}
              </div>
              <div className="profile-info">
                <strong>{DEMO_PROFILES[2].name}</strong>
                <span>{DEMO_PROFILES[2].email}</span>
              </div>
              <div className="profile-badge badge-seller">Vendedor</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
