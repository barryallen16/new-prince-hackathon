# ALL IS WELL
a mental health intervention app built using react native and supabase.

## install dependencies
```bash
cd hackathon
bun install
```

## Run Flask backend 
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main1.py
```

## create a ngrok endpoint
```bash
ngrok http 5000
```

## create .env file in the root of the folder
```bash
EXPO_PUBLIC_FLASK_BACKEND_ENDPOINT=your-actual-ngrok-endpoint
EXPO_PUBLIC_ELEVENLABS_APIKEY=your-actual-elevenlabs-apikey
EXPO_PUBLIC_SUPABASE_URL=your-actual-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
```
replace with the actual values. 

## Run the expo app , scan the qr generated in expo go app and test out the applications 
```bash
bunx expo start --go
```