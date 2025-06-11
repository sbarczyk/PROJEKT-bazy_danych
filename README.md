# GymTracker

**Autorzy:** Szymon Barczyk, Jan Dyląg

---

## Cel projektu

> Aplikacja do monitorowania treningów siłowych i progresu sylwetki użytkownika, z możliwością zapisywania się na wspólne treningi z trenerem personalnym oraz testy siłowe ze znajomymi.

---

## Cele funkcjonalne

| Nr  | Cel główny                     | Opis                                                                                                                                  |
| :-: | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
|  1  | **CRUD**                       | Ćwiczenia, treningi (data, serie, powtórzenia, ciężar), pomiary ciała                                                                 |
|  2  | **Transakcje i współbieżność** | Rejestracja na limitowane wydarzenia (testy siły, treningi z trenerem)                                                                |
|  3  | **Raportowanie & agregacje**   | • Progres siłowy (max ciężar)<br>• Zmiany obwodów w czasie<br>• Najczęściej wykonywane ćwiczenia<br>• Średnia liczba serii na tydzień |

---

## Model danych (kolekcje)

- `users` — dane użytkownika
- `exercises` — dostępne ćwiczenia
- `workouts` — zapisy treningów z datą i seriami
- `measurements` — pomiary sylwetki (waga, obwody)
- `events` — limitowane wydarzenia (z możliwością rejestracji)

---

## Technologie

| Warstwa         | Technologia                             |
| --------------- | --------------------------------------- |
| **Baza danych** | MongoDB                                 |
| **Backend**     | Node.js + Express + Mongoose            |
| **Frontend**    | React (opcjonalnie) / testy w Postmanie |
| **Narzędzia**   | Docker, MongoDB Compass, DataGrip       |

---
