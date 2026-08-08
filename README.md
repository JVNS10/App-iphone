# GlassWave

Player de música em estilo premium com visual glassmorphism, focado em uma experiência elegante, moderna e responsiva para desktop e celular.

## Visão geral

O projeto é uma aplicação web estática desenvolvida com HTML, CSS e JavaScript puro. Ele simula um player de música com:

- capa destacada da faixa atual
- controles de reprodução
- barra de progresso
- volume
- lista de reprodução
- visual premium em vidro (glassmorphism)
- fundo animado com partículas e efeitos visuais
- suporte para adicionar músicas locais do dispositivo

A ideia principal é entregar uma interface totalmente visualmente refinada, funcionando como uma demo de player musical ou uma base para uma aplicação maior.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript Vanilla
- PWA (Progressive Web App)
- Service Worker
- Manifest do navegador

## Estrutura do projeto

```text
App de Musica/
├── index.html
├── styles.css
├── script.js
├── manifest.json
├── sw.js
├── README.md
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── .
```

### Arquivos principais

- [index.html](index.html): estrutura da interface do player
- [styles.css](styles.css): estilo visual, layout responsivo e efeitos visuais
- [script.js](script.js): lógica do player, controle de reprodução, playlist e interações
- [manifest.json](manifest.json): configuração para instalação como app web
- [sw.js](sw.js): cache de recursos para funcionamento offline/parcial

## Funcionalidades

### Player musical

- reprodução de faixas com `audio` HTML
- navegação entre músicas com botão anterior/próximo
- botão de play/pause
- atualização do tempo atual e duração total
- progresso ajustável arrastando a barra
- controle de volume
- transição automática para a próxima faixa ao final

### Interface

- design em glassmorphism com fundo escuro premium
- hero card principal para faixa em reprodução
- lista lateral com músicas da biblioteca
- animações de brilho, partículas e movimento suave
- layout adaptado para celular e desktop

### Biblioteca

- músicas padrão pré-carregadas via URL pública
- possibilidade de adicionar músicas locais pelo input de arquivo
- renderização automática da playlist na interface

### PWA

- manifest configurado com ícones e nome da aplicação
- service worker preparado para cache do shell da aplicação
- suporte para “instalar como app” em navegadores compatíveis

## Como rodar o projeto

### Opção 1: servidor local simples

A forma mais recomendada é abrir o projeto através de um servidor HTTP local.

No terminal:

```bash
cd "/home/joao/Documentos/App de Musica"
python3 -m http.server 8000
```

Depois abra no navegador:

```text
http://localhost:8000
```

### Opção 2: acessar pelo celular na mesma rede

Se o celular estiver conectado na mesma rede Wi‑Fi, descubra o IP do computador:

```bash
hostname -I
```

Em seguida, abra no celular:

```text
http://<IP-DO-COMPUTADOR>:8000
```

Exemplo:

```text
http://192.168.0.25:8000
```

## Observações importantes sobre funcionamento em celular

O projeto foi pensado para funcionar como site e, em parte, como app web. No entanto, algumas condições precisam ser respeitadas:

- o projeto deve ser servido por um servidor HTTP (não apenas aberto como arquivo local)
- o browser precisa permitir reprodução de áudio
- o serviço de cache do PWA funciona melhor em ambiente com HTTPS ou localhost
- a instalação como app é mais confiável quando o service worker é registrado corretamente pelo navegador

### Importante

O arquivo [sw.js](sw.js) está presente e configurado, mas para que o navegador trate a aplicação como PWA instalada de forma consistente, o service worker deve ser registrado via JavaScript. Isso ainda pode ser ajustado no arquivo [script.js](script.js) para reforçar a experiência mobile.

## Estado atual do projeto

Este é um projeto funcional como demo visual e de player musical, mas ainda não é um produto nativo completo. O código oferece:

- interface moderna
- reprodução em navegação
- playlist local em memória
- experiência visual premium

Falta ainda um nível mais avançado de funcionalidade, como:

- persistência de playlist no armazenamento do navegador
- suporte a favoritos
- busca por músicas
- organização por categorias/álbuns
- lógica completa de shuffle/repeat
- backend para biblioteca real
- autenticação e sincronização em nuvem

## Possíveis melhorias futuras

- armazenar a playlist em `localStorage` ou `IndexedDB`
- permitir edição de nome de música e organização da biblioteca
- adicionar filtros por gênero ou álbum
- melhorar suporte a arquivos locais com metadata
- criar uma versão com React/Vite ou outra estrutura mais escalável
- integrar com API de streaming ou backend real

## Conclusão

GlassWave é uma base sólida para um player de música moderno e visualmente premium, com foco em UX mobile e apresentação elegante. Ele funciona muito bem como projeto frontend estático, demonstração visual e protótipo funcional, e pode evoluir para uma aplicação mais completa em etapas futuras.

## Licença

Este projeto foi desenvolvido como demonstração de interface e player musical. Caso deseje reutilizar o código em um projeto pessoal ou profissional, é recomendável revisar os ativos visuais, ícones e textos antes de publicar em produção.
