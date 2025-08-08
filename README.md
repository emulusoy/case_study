Micro-Frontend Case Study
Host (Next.js) + Products Remote (Next.js) + Basket Remote (CRA + Ant Design)

Bu repo; tek bir monorepo altında üç uygulamadan oluşan bir micro-frontend örneğidir:

Host – Next.js (port 3000)

/products sayfasında Products Remote (3001) iframe

/basket sayfasında Basket Remote (3002) iframe

Products Remote – Next.js (port 3001)
Fakestore API’den ürün listeler, sepete ekle eventi gönderir.

Basket Remote – CRA + TypeScript + Ant Design (port 3002)
Host’tan aldığı mesajlarla tam sayfa sepeti gösterir.

Mikro-frontend iletişimi iframe + window.postMessage ile yapılır (basit, framework bağımsız ve stabil).

Önkoşullar
Node.js 18+ (öneri: 20 LTS)

npm 9+

Git

(Opsiyonel) Docker Desktop

Windows’ta satır sonu sorunlarını önlemek için:
git config --global core.autocrlf true

Proje Yapısı
txt
Kopyala
Düzenle
micro-frontend-project/
├── host/                 # Next.js (3000) – iframe sayfaları ve mesaj köprüsü
├── products-remote/      # Next.js (3001) – Fakestore API, "Sepete Ekle"
├── basket-remote/        # CRA + TS + Ant Design (3002) – tam sayfa sepet
├── package.json          # npm workspaces
├── package-lock.json
└── .gitignore
Kurulum
Kök dizinden bağımlılıkları kurun:

bash
Kopyala
Düzenle
npm install
(İsteğe bağlı) basket-remote/.env içine portu sabitleyin:

ini
Kopyala
Düzenle
PORT=3002
Çalıştırma Adımları
Üç terminal (veya tmux/panes) açın ve sırayla:

bash
Kopyala
Düzenle
# Host (Next.js, 3000)
npm run dev --workspace host

# Products Remote (Next.js, 3001)
npm run dev --workspace products-remote

# Basket Remote (CRA + AntD, 3002)
npm run start --workspace basket-remote
Sonra tarayıcıda:

Host: http://localhost:3000

/products → 3001’deki Products Remote’u iframe ile gösterir

/basket → 3002’deki Basket Remote’u iframe ile gösterir

İletişim Mimarisi (postMessage)
Products → Host:
“Sepete Ekle” tıklanınca:

ts
Kopyala
Düzenle
window.parent.postMessage({ type: 'ADD_TO_CART', item }, '*');
Host (/products):
ADD_TO_CART mesajını dinler, ürünü localStorage('mf-cart') içine ekler.

Host (/basket):

Iframe yüklendiğinde:

ts
Kopyala
Düzenle
postMessage({ type: 'INIT_CART', items: JSON.parse(localStorage.getItem('mf-cart') || '[]') }, '*');
Yeni ürün eklenirse:

ts
Kopyala
Düzenle
postMessage({ type: 'ADD_TO_CART', item }, '*');
Basket Remote (App.tsx):
INIT_CART ve ADD_TO_CART mesajlarını dinleyip state’i günceller; Ant Design ile sepeti listeler.

Güvenlik: Geliştirmede '*' kullanıldı. Prod ortamında explicit origin verin (örn. https://example.com).

Script’ler
Kök (workspaces)
bash
Kopyala
Düzenle
npm run dev --workspace host
npm run dev --workspace products-remote
npm run start --workspace basket-remote
Host (Next.js)
dev: next dev

build: next build

start: next start

Products-Remote (Next.js)
dev: next dev

build: next build

start: next start

Basket-Remote (CRA)
start: react-scripts start (CRACO kullanıyorsanız craco start)

build: react-scripts build

Not: Tüm uygulamalarda React 18.2.0 kullanılacak şekilde ayarlanmıştır.

Ortam Değişkenleri
basket-remote/.env

ini
Kopyala
Düzenle
PORT=3002
(Opsiyonel) products-remote/.env.local

ini
Kopyala
Düzenle
NEXT_PUBLIC_API_BASE=https://fakestoreapi.com
Versiyonlama / Branch Stratejisi
Test Branch: test/v1.0.0

Prod Branch: prod/v1.0.0 (test’ten merge edilir)

Tag: v1.0.0

Örnek akış:

bash
Kopyala
Düzenle
# ilk yükleme
git switch -c test/v1.0.0
git push -u origin test/v1.0.0

# prod branch’i (GitHub’da PR ile veya CLI)
git switch -c prod/v1.0.0
git push -u origin prod/v1.0.0

# release etiketi
git tag -a v1.0.0 -m "release v1.0.0"
git push origin v1.0.0
GitHub → Settings → Branches altında prod/* için Branch protection (PR review, status checks vb.) tanımlamanız önerilir.

