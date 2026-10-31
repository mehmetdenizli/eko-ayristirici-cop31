# ♻️ Eko-Ayrıştırıcı: Sıfır Atık Laboratuvarı (COP31 Antalya)

> **GameUp 48 Saatlik Hackathon Projesi** — Antalya temalı, web tabanlı, eğitici ve hızlı refleks odaklı akıllı atık ayrıştırma oyunu.

🌐 **Canlı Demo:** [https://mehmetdenizli.github.io/eko-ayristirici-cop31/](https://mehmetdenizli.github.io/eko-ayristirici-cop31/)

---

## 🌍 Proje Vizyonu & COP31 Bağlantısı
"Eko-Ayrıştırıcı", oyuncuyu Antalya'nın ileri teknoloji döngüsel atık ayrıştırma merkezinin başına geçiren, hızlı tempolu ve çevre bilinci aşılayan bir simülasyondur.

Oyuncu, hızla akan konveyör banttan gelen atıkları doğru geri dönüşüm haznelerine aktarırken hem reflekslerini hem de atık hiyerarşisi bilgisini konuşturur.

### 🌟 Öne Çıkan Özellikler
- **5 Akıllı Hazne:** Plastik, Kağıt & Karton, Cam, Organik / Kompost, Tehlikeli & E-Atık.
- **Eğitici Tuzak Nesneler:** Yağlı pizza kutuları, termal alışveriş fişleri, atık piller ve kırık aynalar gibi gerçek hayatta sıkça karıştırılan atıkların doğrusunu anlatan bilimsel hata bildirimleri.
- **Dinamik Arka Plan (Antalya Silueti):** Toros Dağları, Akdeniz, dönen rüzgar türbinleri ve güneş panelleri. Oyuncu doğru ayrıştırdıkça şehir üzerindeki duman dağılır ve deniz berraklaşır.
- **COP31 İklim Etki Karnesi:** Önlenen $CO_2$ salımı (kg), kurtarılan su miktarı (Litre) ve korunan ağaç sayısını anlık hesaplayan göstergeler.
- **Çift Kontrol Desteği:** 
  - Klavye: `1`, `2`, `3`, `4`, `5` tuşları
  - Fare / Dokunmatik: Sürükle-bırak veya tek tıkla hazneye fırlatma
- **Sıfır Dış Bağımlılık (Web Audio API):** Tarayıcı osilatörleriyle çalışan sıfır gecikmeli dinamik ses motoru.
- **Paylaşılabilir Dijital Sertifika:** Bölüm sonunda kişiselleştirilmiş COP31 başarı rozeti ve kopyalanabilir karne.
- **Atık Sözlüğü & Ansiklopedi:** 20'den fazla malzemenin sınıflandırma kurallarını içeren anlık arama destekli rehber.

---

## 🛠️ Teknoloji Yığını
- **Frontend:** React 19 + Vite
- **Stil & Tasarım:** Vanilla CSS (Modern CSS tokens, glassmorphism, responsive grid)
- **Ses Motoru:** Web Audio API (Synthesizer)
- **İkonlar & Efektler:** Lucide React + Canvas Confetti
- **Dağıtım:** GitHub Pages

---

## 🚀 Yerel Kurulum & Çalıştırma

```bash
# Depoyu klonlayın
git clone https://github.com/mehmetdenizli/eko-ayristirici-cop31.git
cd eko-ayristirici-cop31

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173/` adresine gidin.

---

## 📦 Dağıtım (GitHub Pages)

```bash
# Otomatik derleme ve yayınlama
npm run deploy
```
