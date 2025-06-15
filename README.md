# GymTracker
**Autorzy:** Szymon Barczyk, Jan Dyląg
---
## Cel projektu
> Aplikacja do monitorowania treningów siłowych i progresu sylwetki użytkownika, z możliwością zapisywania się na wspólne treningi z trenerem personalnym oraz testy siłowe ze znajomymi.
---
## Cele funkcjonalne
| Nr  | Cel główny                     | Opis                                                                                                                                  |
| :-: | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
|  1  | **CRUD**                       | • Dodawanie/edycja/usuwanie użytkowników<br>• Ćwiczenia<br>• Treningi (daty, ćwiczenia, serie, powtórzenia, ciężar)<br>• Pomiary ciała (waga, biceps, klatka itd.)<br>• Wydarzenia specjalne |
|  2  | **Operacje transakcyjne i kontrola równoczesnego dostępu** | Rejestracja na limitowane wydarzenia, np. testy siły, wspólne treningi – z ograniczoną liczbą miejsc |
|  3  | **Raportowanie & zapytania agregujące**   | • Najczęściej wykonywane ćwiczenia użytkownika<br>• Ilość treningów użytkownika w danym miesiącu<br>• Ranking punktów użytkowników |
---
## Model danych (kolekcje)
- `users` — dane użytkownika (z systemem punktów)
- `exercises` — dostępne ćwiczenia
- `workouts` — zapisy treningów z datą, ćwiczeniami i seriami
- `measurements` — pomiary sylwetki (waga, biceps, klatka, inne obwody)
- `events` — limitowane wydarzenia specjalne (z możliwością rejestracji)
---
## Technologie
| Warstwa         | Technologia                             |
| --------------- | --------------------------------------- |
| **Baza danych** | MongoDB                                 |
| **Backend**     | Node.js + Express + Mongoose            |
| **Frontend**    | React (opcjonalnie) / testy w Postmanie |
| **Narzędzia**   | Docker, MongoDB Compass, DataGrip       |
---
## Setup projektu

#### 1. Sklonuj repozytorium
```bash
git clone https://github.com/sbarczyk/PROJEKT-bazy_danych.git
cd PROJEKT-bazy_danych
```

#### 2. Zainstaluj zależności backendu
```bash
npm install
```

#### 3. Uruchom MongoDB z replica set w Dockerze
```bash
docker run -d \
  --name gymtracker-mongo \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  mongo:6 \
  --replSet rs0 --bind_ip_all
```

#### 4. Zainicjuj replica set (jednorazowo po starcie MongoDB)
```bash
docker exec -it gymtracker-mongo mongo --eval "rs.initiate()"
```

#### 5. Zainstaluj mongorestore (jeśli nie masz)

**Windows**
1. Pobierz ZIP: https://www.mongodb.com/try/download/database-tools
2. Wypakuj do np. C:\MongoTools
3. Dodaj C:\MongoTools\bin do zmiennej środowiskowej PATH:
   - Otwórz "Panel sterowania" → "System" → "Zaawansowane ustawienia systemu"
   - Kliknij "Zmienne środowiskowe"
   - W sekcji "Zmienne systemowe" znajdź i zaznacz "Path"
   - Kliknij "Edytuj"
   - Kliknij "Nowy" i dodaj ścieżkę: `C:\MongoTools\bin`
   - Kliknij "OK" we wszystkich oknach
   - Uruchom ponownie wiersz poleceń (cmd/PowerShell)
4. Sprawdź instalację:
```bash
mongorestore --version
```

**Linux (Debian/Ubuntu)**
```bash
wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.9.4.deb
sudo dpkg -i mongodb-database-tools-*.deb
mongorestore --version
```

**macOS (Homebrew)**
```bash
brew tap mongodb/brew
brew install mongodb-database-tools
mongorestore --version
```

#### 6. Przywróć bazę danych z dumpu
Upewnij się, że masz folder dump/ (np. ./dump/gymtracker). Potem uruchom:
```bash
mongorestore --uri="mongodb://localhost:27017/gymtracker?replicaSet=rs0" ./dump
```


#### 7. Uruchom backend
```bash
npm start
```

Serwer backendowy będzie działać pod adresem: **http://localhost:5000**
