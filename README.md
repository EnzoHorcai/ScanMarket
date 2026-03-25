🛒 ScanMarket - Smart Checkout System
O ScanMarket é uma aplicação web experimental (SPA) focada em transformar a experiência de compra em supermercados físicos. O projeto elimina filas tradicionais ao permitir que o usuário gerencie sua própria jornada: do login à liberação fiscal de saída.

🚀 O que o projeto faz?
O sistema guia o usuário por quatro etapas principais, integrando hardware do celular (Câmera e GPS) com uma interface moderna:

Autenticação Segura: Login via CPF e senha para personalização da conta.

Geolocalização de Unidades: Identifica os mercados parceiros mais próximos através do mapa interativo.

Self-Scanning: O usuário utiliza a câmera do celular para escanear os produtos e adicioná-los ao carrinho em tempo real.

Checkout Digital: Pagamento simulado via QR Code e geração de um Cupom Fiscal Digital para conferência na saída da loja.

🛠️ Tecnologias Utilizadas
Para garantir leveza e funcionamento direto no navegador, utilizamos:

HTML5-QRCode: Biblioteca robusta para processamento de imagem e decodificação de códigos de barras/QR em tempo real.

Leaflet.js: Biblioteca open-source para mapas interativos e geolocalização.

FontAwesome: Conjunto de ícones vetoriais para a interface (UI).

CSS3 (Custom Properties): Design responsivo focado em Mobile-First, utilizando variáveis para manter a identidade visual da marca.

JavaScript (ES6+): Lógica de transição de estados, manipulação de DOM e gerenciamento de carrinho.

📱 Fluxo da Aplicação
O código foi estruturado como uma Single Page Application (SPA) para evitar recarregamentos de página e garantir uma transição fluida entre as telas:

1. Login & Segurança
O acesso inicial valida as credenciais e libera o acesso aos sensores de GPS e Câmera.

2. Localização (Maps)
A aplicação solicita permissão de localização e renderiza um mapa centralizado na posição real do usuário, exibindo marcadores dos supermercados disponíveis.

3. Experiência de Compra (Scanner)
A interface de scanner ativa a câmera traseira. Ao identificar um código, o item é inserido dinamicamente em uma lista de "Produtos Recentes", acompanhado de um feedback tátil (vibração).

4. Pagamento e Fiscal
Após a confirmação da compra, o sistema gera dois QR Codes:

Um para ser lido pelo terminal de pagamento.

Um QR Code Fiscal para ser apresentado ao auditor/fiscal na saída do estabelecimento.

⚙️ Requisitos para Rodar
Como a aplicação utiliza APIs sensíveis (Câmera e GPS), existem regras de segurança dos navegadores:

HTTPS: A câmera e o GPS só funcionarão se o site estiver hospedado sob o protocolo HTTPS.

Permissões: O usuário deve clicar em "Permitir" quando o navegador solicitar acesso à localização e à câmera.
