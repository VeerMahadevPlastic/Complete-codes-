# VMP Admin Mobile App (React Native / Expo)

Mobile-responsive admin app for Veer Mahadev Plastic with:
- Bottom Navigation: Dashboard, Inventory, Orders, Daybook
- PIN/Biometric gate for office-only access
- Real-time Firestore summary (Sales, Purchases, Net Profit)
- Inventory manager with quick edit + delete confirmation
- Camera upload + image compression + Firebase Storage upload
- Push alert scheduling on new paid wholesale orders

## Run
```bash
cd mobile-admin-app
npm install
npm start
```

Set Firebase values in `app.json` -> `expo.extra`.
