# ELOS - Protótipo Interativo (MVP) 🧩

**Ecossistema Lógico Orientado ao Suporte para Inclusão Escolar.**

Este repositório contém o código-fonte (Front-end) do MVP do projeto **ELOS**, uma plataforma SaaS focada em tecnologia assistiva e **"Tradutibilidade de Dados"** para apoiar alunos com Transtorno do Espectro Autista (TEA nível 2) no ensino regular.

---

## 🚀 Funcionalidades e Telas Desenvolvidas

O protótipo foi construído como uma Single Page Application (SPA) contemplando as regras de negócio de inclusão e segurança (RBAC):

- 🔐 **Login Seguro (`src/components/LoginView.tsx`):** Simulação de autenticação com redirecionamento baseado no papel do usuário (Gestor/Mediador, Família ou Aluno). Possui proteção de rotas simulada (`src/components/PrivateRoute.tsx`), validação de credenciais, opção interativa de *"Esqueci minha senha"* e botões de *Login Rápido*.
- 📱 **Painel do Mediador AEE — Tablet (`src/components/MediatorView.tsx`):** Interface *touch-friendly* para registro ágil de perda de foco / trava cognitiva em sala de aula e disparo remoto de suportes visuais e sonoros suaves (432Hz), sem interromper a rotina pedagógica.
- 🎯 **Interface Sensorial do Aluno — Kiosk Mode (`src/components/StudentKioskView.tsx`):** Tela de baixa carga cognitiva (cores neutras em modo escuro suave `#18202C`, sem pop-ups, sem distrações) desenhada para exibir estímulos de alta previsibilidade (**AGORA → DEPOIS** e barra visual de tempo contínua) em momentos de crise ou desengajamento, além de barra inferior de Comunicação Alternativa e Aumentativa (CAA).
- 👨‍👩‍👧 **Dashboard da Família — Mobile-First (`src/components/FamilyDashboardView.tsx`):** Painel que traduz as métricas escolares e jargões técnicos do AEE em insights visuais, acolhedores e orientações práticas para a rotina doméstica, melhorando a comunicação Escola-Família.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** React 18 com TypeScript
- **Estilização:** Tailwind CSS (focado em acessibilidade WCAG 2.2 AA/AAA e cores amigáveis à neurodivergência — tons suaves de azul, verde-água, lavanda e cinza, evitando vermelhos ou amarelos vibrantes)
- **Ícones:** Lucide React
- **Roteamento:** Roteamento SPA Simulado/Integrado com History API e Proteção de Rotas (`PrivateRoute` + RBAC)
- **Estado:** React Hooks (`useState`, `useEffect`, `useCallback`)

---

## ⚙️ Como executar o projeto localmente

1. Faça o clone deste repositório:

```bash
git clone https://github.com/seu-usuario/elos-mvp.git
```

2. Acesse a pasta do projeto:

```bash
cd elos-mvp
```

3. Instale as dependências:

```bash
npm install
# ou
yarn install
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

5. Abra o navegador e acesse: `http://localhost:5173` (ou `http://localhost:3000` / porta indicada no terminal).

---

## 🧪 Dados de Acesso (Mock)

Para testar os diferentes perfis no protótipo, utilize os seguintes acessos simulados (ou os botões de **Acesso Rápido de Demonstração** na tela de login):

- **Mediador AEE:** `mediador@elos.com` / `senha123`
- **Familiar:** `familia@elos.com` / `senha123`
- **Aluno:** `aluno@elos.com` / `senha123`

---

Desenvolvido por **Renan Bernardo Gonçalves** - IFES Campus Alegre
# projeto-ext-ELOS
