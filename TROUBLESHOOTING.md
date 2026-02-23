# DevTip — Muammolarni hal qilish

## Serverni ishga tushirishda `spawn EPERM` xatosi

Bu xato odatda Windowsda esbuild/Vite uchun ruxsat muammosi bilan bog‘liq.

### Yechimlar:

1. **Terminalni Administrator sifatida ishga tushiring**
   - PowerShell yoki CMD ni o‘ng tugma bilan oching
   - "Run as administrator" ni tanlang
   - Loyiha papkasiga o‘ting va `npm run dev` ni ishga tushiring

2. **Antivirusdan istisno qiling**
   - Loyiha papkasini antivirus istisnolariga qo‘shing
   - `node_modules` va `node_modules\.vite` papkalarini ham qo‘shing

3. **Loyihani boshqa joyga ko‘chiring**
   - OneDrive, Google Drive yoki boshqa sinxronlashtiriladigan papkada bo‘lsa, uni oddiy papkaga (masalan, `C:\Projects\devtip`) ko‘chiring

4. **Node modulesni qayta o‘rnating**
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   npm run dev
   ```
